/**
 * Socle — la mesure d'usage.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * POURQUOI UMAMI, ET POURQUOI C'EST UNE DÉCISION ET PAS UN DÉTAIL
 * ════════════════════════════════════════════════════════════════════════════
 * Umami ne pose **aucun cookie** et ne conserve **aucune donnée personnelle** :
 * il n'y a donc ni bandeau de consentement à afficher, ni registre de
 * traitement à tenir pour cette brique. Sur un site commercial dont l'action
 * qui rapporte est à trois clics de l'accueil, un bandeau qui s'interpose est
 * un coût réel — et c'est exactement ce qu'un outil classique impose.
 *
 * C'est la même logique que le `mailto:` du devis (`offreConfigurateur.ts`) :
 * **il n'y a rien à déclarer parce qu'il n'y a rien à collecter.**
 *
 * ════════════════════════════════════════════════════════════════════════════
 * ⚠️ CE MODULE NE CONNAÎT AUCUN DOMAINE
 * ════════════════════════════════════════════════════════════════════════════
 * Il ne sait ni ce qu'est une offre, ni ce qu'est une séance. Il repart tel
 * quel chez le client suivant, comme `socle/generation/seed.ts` et
 * `socle/util/eventBus.ts` — le domaine, lui, décide **quels** événements
 * valent la peine d'être comptés (voir `offreMesures.ts`).
 *
 * ⚠️ **Silencieux par construction.** Sans le script chargé — bloqueur de
 * publicité, hors ligne, environnement de test, build local — chaque appel ne
 * fait rien. Un module de mesure qui lève une exception casse la page qu'il
 * était censé observer, et c'est toujours en production qu'on s'en aperçoit.
 */
import { createLogger } from "../debugLog.js";
const log = createLogger("Analytique");
function umami() {
    if (typeof globalThis === "undefined")
        return undefined;
    const u = globalThis.umami;
    return u && typeof u.track === "function" ? u : undefined;
}
/** Le script de mesure est-il chargé ? Utile pour ne pas construire de charge inutile. */
export function mesureActive() {
    return umami() !== undefined;
}
/**
 * Enregistre un événement.
 *
 * ⚠️ **Ne jamais y passer de donnée personnelle** — ni adresse de courriel, ni
 * texte saisi, ni identifiant de visiteur. Ce qu'on mesure, ce sont des
 * **gestes** (« un devis a été demandé »), jamais des **personnes**. La règle
 * est la même que celle du code de partage côté sport : le code décrit une
 * forme, pas quelqu'un.
 */
export function mesurer(nom, donnees) {
    try {
        const u = umami();
        if (!u) {
            log("ignoré (script absent) —", nom);
            return;
        }
        if (donnees && Object.keys(donnees).length > 0)
            u.track(nom, donnees);
        else
            u.track(nom);
        log(nom, donnees ?? "");
    }
    catch {
        // ⚠️ Avalé volontairement. Voir l'en-tête : la mesure ne casse jamais
        // la page. Un bloqueur qui remplace `umami` par un objet inerte est un
        // cas normal, pas une anomalie à remonter.
    }
}
/**
 * Fabrique un compteur qui n'émet **qu'une fois** par nom.
 *
 * ⚠️ Indispensable pour tout ce qui se déclenche au défilement ou au survol :
 * sans lui, un visiteur qui remonte et redescend gonfle le compte, et la
 * statistique cesse de dire « combien de personnes ont vu » pour dire
 * « combien de fois le navigateur a repassé le seuil » — deux chiffres très
 * différents, dont un seul aide à décider.
 */
export function creerMesureUnique() {
    const vus = new Set();
    return (nom, donnees) => {
        if (vus.has(nom))
            return;
        vus.add(nom);
        mesurer(nom, donnees);
    };
}
