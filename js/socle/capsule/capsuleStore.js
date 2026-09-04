/**
 * OpenFitWebXR — jalon 30 : la capsule, générique.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * CE QUE CE MODULE NOMME
 * ────────────────────────────────────────────────────────────────────────────
 * Depuis le jalon 12, le projet sait encoder une expérience entière comme un
 * **écart depuis la génération vierge** — une graine, quelques retouches, et
 * ça tient en ~16 caractères dictables au téléphone. Depuis le jalon 23, il
 * sait ranger ce code sous un nom (`fit/fitModeles.ts`).
 *
 * Ce qui manquait, c'est le **nom générique** de cet objet, et un magasin qui
 * ne parle pas de sport : une **capsule**. Un modèle de séance est une capsule.
 * Un parcours de visite en est une. Une configuration d'offre en sera une.
 *
 * Ce module ne sait rien du sport : il ne connaît ni séance, ni exercice, ni
 * thème. Il range des codes sous des noms, et c'est tout.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠️ UNE FABRIQUE, PAS UN SINGLETON — ET C'EST LA LEÇON DU JALON 27
 * ────────────────────────────────────────────────────────────────────────────
 * `fitStore.ts` est un singleton : un seul `_store` mutable au niveau du
 * module. C'est précisément ce qui a rendu son extraction impossible au jalon
 * 27 sans une refonte de la taille d'un jalon (voir `ARCHITECTURE.md` §8).
 *
 * On ne refait pas l'erreur sur un module neuf. `createCapsuleStore()` rend
 * une instance dès la première ligne : deux domaines peuvent tenir deux
 * bibliothèques sans se marcher dessus, et aucun n'a besoin de connaître
 * l'autre.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠️ POURQUOI LA PERSISTANCE EST INJECTÉE
 * ────────────────────────────────────────────────────────────────────────────
 * Ce module ne lit ni n'écrit `localStorage`, et n'importe surtout pas
 * `fitStore`. Il reçoit deux fonctions — d'où lire la liste, comment demander
 * l'enregistrement — et se contente de la manipuler.
 *
 * C'est ce qui permet à `fit/` de continuer à ranger ses modèles **dans le
 * profil joueur** (là où ils vivent depuis le jalon 23, synchronisés entre
 * appareils) pendant qu'un domaine sans profil, comme `visite/` ou `offre/`,
 * tient sa liste en mémoire ou dans une clé à lui. Même mécanisme, deux
 * politiques de rangement, aucune dépendance croisée.
 *
 * Même geste d'injection que `configureBadgeXpResolver()` au jalon 27 (suite).
 *
 * Toggle de trace : `__debug.on("Capsule")` en console.
 */
import { createLogger } from "../debugLog.js";
import { BASE32_CONFUSIONS } from "../partage/base32.js";
const debug = createLogger("Capsule");
/** Longueur maximale d'un nom — au-delà, il ne tient plus sur une tuile. */
export const MAX_CAPSULE_NAME_LEN = 28;
/**
 * Fabrique un nettoyeur de code pour un préfixe donné.
 *
 * ⚠️ **Cette fonction existait déjà en DEUX exemplaires**, identiques au
 * caractère près sauf le préfixe : `normalizeShareCode` (`FIT`) dans
 * `fit/fitShareCode.ts` et `normalizeVisitCode` (`VIS`) dans
 * `domaines/visite/visiteShareCode.ts`. Exactement la même trouvaille qu'au
 * jalon 28, où `makeRng` et `rngFrom` s'étaient révélés être deux copies du
 * même générateur — le signe d'un copier-coller qui aurait dû être un import.
 *
 * Un troisième domaine allait en écrire une troisième. Il n'en écrira pas.
 */
export function makeCodeNormalizer(prefix) {
    // Le préfixe se retire s'il est là, et seulement en tête : un code peut
    // arriver collé avec ou sans lui selon qu'on l'a lu sur une carte ou reçu
    // dans un message.
    const tete = new RegExp(`^${prefix}[-\\s]*`);
    return (raw) => raw
        .toUpperCase()
        .replace(tete, "")
        .replace(/[^0-9A-Z]/g, "")
        .split("")
        // Les confusions de l'alphabet Crockford : O→0, I→1, L→1… Quelqu'un qui
        // recopie un code à la main se trompe là, systématiquement.
        .map(ch => BASE32_CONFUSIONS[ch] ?? ch)
        .join("");
}
/** Deux noms se valent s'ils ne diffèrent que par la casse et les espaces. */
function sameName(a, b) {
    return a.trim().toLowerCase() === b.trim().toLowerCase();
}
/**
 * Construit une bibliothèque de capsules pour un domaine.
 *
 * Un appel par domaine, réutilisé partout — jamais deux magasins sur la même
 * liste, ils se contrediraient sur les dédoublonnages.
 */
export function createCapsuleStore(config) {
    const maxNameLen = config.maxNameLen ?? MAX_CAPSULE_NAME_LEN;
    /**
     * Les capsules de CE domaine.
     *
     * ⚠️ Le filtre est le garde du jalon : une capsule d'un autre domaine
     * rangée dans la même liste n'est pas rendue, donc jamais proposée au
     * décodeur qui ne saurait pas la lire. `domaine` absent = capsule d'avant
     * ce jalon, donc du domaine qui la relit — c'est ce qui évite de faire
     * disparaître les modèles déjà rangés par les joueurs.
     */
    function mine() {
        return config.read().filter(c => (c.domaine ?? config.domaine) === config.domaine);
    }
    return {
        list() {
            // Ce qu'on vient de faire est très probablement ce qu'on va refaire.
            // Une capsule jamais lancée retombe en bas — mais après toutes
            // celles qui ont servi, sinon une capsule rangée et oubliée
            // occuperait la première place.
            return [...mine()].sort((a, b) => (b.lastUsedAt ?? 0) - (a.lastUsedAt ?? 0) || b.createdAt - a.createdAt);
        },
        byId(id) {
            return mine().find(c => c.id === id) ?? null;
        },
        keep({ name: nomBrut, code: codeBrut, source }) {
            const name = nomBrut.trim().slice(0, maxNameLen);
            const code = config.normalize(codeBrut);
            if (!name || !code) {
                debug("nom ou code vide — rien rangé");
                return null;
            }
            const liste = config.read();
            // ── Dédoublonnage par CODE : on ignore ────────────────────────────
            // Garder deux fois le même code sous deux noms remplirait la liste
            // de copies d'une seule expérience. On rend l'existante comme si de
            // rien n'était : le geste a réussi, il n'a simplement rien ajouté.
            const memeCode = mine().find(c => config.normalize(c.code) === code);
            if (memeCode) {
                debug("code déjà rangé sous", memeCode.name);
                return memeCode;
            }
            // ── Dédoublonnage par NOM : on remplace ──────────────────────────
            // Ranger sous un nom déjà pris REMPLACE le code. C'est la façon la
            // plus simple de mettre une capsule à jour : on reçoit la version
            // corrigée, on la garde sous le même nom, et c'est celle-là qu'on
            // retrouvera.
            const memeNom = mine().find(c => sameName(c.name, name));
            if (memeNom) {
                memeNom.code = code;
                memeNom.source = source;
                memeNom.domaine = config.domaine;
                config.persist();
                debug("capsule mise à jour :", memeNom.name);
                return memeNom;
            }
            if (mine().length >= config.max) {
                debug(`liste pleine (${config.max}) — « ${name} » non rangée`);
                return null;
            }
            const capsule = {
                id: `cp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
                domaine: config.domaine,
                name, code, source,
                createdAt: Date.now(),
                played: 0,
            };
            liste.push(capsule);
            config.persist();
            debug(`capsule « ${name} » rangée (${source}, ${config.domaine})`);
            return capsule;
        },
        // Rebaptiser ne touche pas au code — d'où l'identifiant plutôt que le nom.
        rename(id, name) {
            const c = this.byId(id);
            const propre = name.trim().slice(0, maxNameLen);
            if (!c || !propre)
                return false;
            c.name = propre;
            config.persist();
            return true;
        },
        remove(id) {
            const liste = config.read();
            // ⚠️ L'index se cherche dans la liste COMPLÈTE, pas dans `mine()` :
            // `splice` s'applique au tableau réel, et un index calculé sur une
            // vue filtrée retirerait la mauvaise capsule dès qu'un autre
            // domaine partage la liste.
            const idx = liste.findIndex(c => c.id === id && (c.domaine ?? config.domaine) === config.domaine);
            if (idx < 0)
                return false;
            const [partie] = liste.splice(idx, 1);
            config.persist();
            debug(`capsule « ${partie.name} » oubliée`);
            return true;
        },
        /**
         * ⚠️ Appelée au **lancement**, pas à la clôture. La différence est
         * voulue : un compteur de lancements ne prétend pas qu'on a fait le
         * tour — il sert à remonter la capsule en tête de liste, et une
         * expérience abandonnée au bout de deux minutes reste une expérience
         * qu'on a choisie.
         */
        markPlayed(id) {
            const c = this.byId(id);
            if (!c)
                return;
            c.lastUsedAt = Date.now();
            c.played += 1;
            config.persist();
            debug("capsule lancée", c.name, `(${c.played}ᵉ fois)`);
        },
        // Sert à prévenir avant le geste plutôt qu'à s'excuser après : l'écran
        // peut dire « remplacera la capsule existante » au lieu de faire
        // disparaître un code en silence.
        nameTaken(name) {
            return mine().some(c => sameName(c.name, name));
        },
        isFull() {
            return mine().length >= config.max;
        },
    };
}
