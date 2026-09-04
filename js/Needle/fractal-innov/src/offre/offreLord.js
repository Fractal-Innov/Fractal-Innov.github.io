/**
 * Le mode « Lord ».
 *
 * ════════════════════════════════════════════════════════════════════════════
 * ⚠️⚠️  LORD EST UN MODE, PAS UNE PERMISSION.  ⚠️⚠️
 * ════════════════════════════════════════════════════════════════════════════
 * Écrit en toutes lettres, en tête de module, pour que personne — humain ou
 * agent — ne le prenne un jour pour du contrôle d'accès et ne construise
 * dessus.
 *
 * Ce drapeau vit dans le `localStorage` du navigateur. **Il ne protège rien.**
 * N'importe qui peut l'écrire depuis la console en trois secondes, et tout ce
 * que le mode révèle est de toute façon déjà dans le bundle de la page. Ce
 * n'est pas un défaut de cette implémentation : c'est ce qu'est un drapeau
 * client, et aucune façon de l'écrire n'y changera quoi que ce soit.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * ALORS À QUOI IL SERT, ET POURQUOI C'EST SUFFISANT
 * ════════════════════════════════════════════════════════════════════════════
 * Il sert à **ne pas montrer une interface d'édition à quelqu'un qui n'en veut
 * pas**. C'est un problème d'ergonomie, pas de sécurité, et un drapeau local
 * le résout complètement.
 *
 * Ce qui est réellement confidentiel — la grille tarifaire — n'est pas protégé
 * par ce drapeau : **il est protégé par le fait de ne pas être dans le
 * bundle**. Le site public ignore jusqu'à l'existence des montants ; l'extract
 * les embarque et vit sur une adresse en `noindex` que vous seul distribuez.
 * C'est la seule frontière qui tienne, et elle est physique.
 *
 * ⚠️ **Ne jamais ajouter à ce module quoi que ce soit qui ressemblerait à une
 * autorisation.** Un `role: "lord"` écrit dans la table Supabase serait la
 * même illusion : `fit_push` est un `update` aveugle ouvert à `anon`, donc
 * n'importe qui pourrait se l'écrire (voir `ARCHITECTURE.md` §5.4). Le « Lord
 * serveur » demande une vraie authentification et reste fermé tant que vous
 * êtes seul à publier — auquel cas publier, c'est déployer, et le contrôle
 * d'accès s'appelle déjà GitHub.
 *
 * ⚠️ Le « **Lord gagné** » — obtenir l'éditeur en terminant le parcours — est
 * reporté : « terminer le parcours » n'a pas de sens tant que le monde 3D des
 * 12 arrêts n'existe pas. Le point d'accroche est ci-dessous (`accorderLord`),
 * le déclencheur viendra avec le monde.
 */
import { createLogger } from "../../../../socle/debugLog.js";
const log = createLogger("Lord");
const CLE = "fractalinnov:lord:v1";
/**
 * Le mode est-il actif ?
 *
 * ⚠️ Tolérant à l'absence de `localStorage` : en navigation privée sur
 * certains navigateurs, y accéder **lève une exception**. Laisser filer
 * l'erreur ferait échouer le rendu de la page entière pour un drapeau
 * d'affichage — le remède serait pire que le mal.
 */
export function estLord() {
    try {
        return globalThis.localStorage?.getItem(CLE) === "1";
    }
    catch {
        return false;
    }
}
/**
 * Ouvre le mode.
 *
 * Le point d'accroche du « Lord gagné » : le jour où le monde 3D existera,
 * c'est cette fonction que la fin du parcours appellera. Rien d'autre ne
 * changera — et c'est pour ça qu'elle est écrite maintenant, alors qu'un seul
 * appelant existe.
 */
export function accorderLord(raison) {
    try {
        globalThis.localStorage?.setItem(CLE, "1");
        log("mode Lord ouvert —", raison);
    }
    catch {
        log("mode Lord impossible à mémoriser (stockage indisponible)");
    }
}
export function retirerLord() {
    try {
        globalThis.localStorage?.removeItem(CLE);
        log("mode Lord refermé");
    }
    catch { /* rien à faire : il n'était pas mémorisé */ }
}
/**
 * Ouvre le mode si l'URL le demande (`?lord=1`), et **nettoie l'URL**.
 *
 * ⚠️ Le nettoyage n'est pas cosmétique : sans lui, l'adresse partagée par
 * copier-coller transporterait le paramètre, et le mode s'ouvrirait chez le
 * destinataire. Même discipline que `shareUrlFor()` côté sport, qui repart
 * d'une URL vidée pour qu'un code joueur ne voyage jamais par accident.
 */
export function lireLordDepuisUrl() {
    try {
        const url = new URL(globalThis.location?.href ?? "");
        if (url.searchParams.get("lord") !== "1")
            return estLord();
        accorderLord("paramètre d'URL");
        url.searchParams.delete("lord");
        globalThis.history?.replaceState(null, "", url.toString());
        return true;
    }
    catch {
        return estLord();
    }
}
