/**
 * Domaine « offre » — la capsule de configuration.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * CE QUE CETTE CAPSULE EST, EN LANGAGE COMMERCIAL
 * ════════════════════════════════════════════════════════════════════════════
 * **C'est le devis du visiteur, et c'est le lead.** Il compose produit × niveau
 * × modules sur les deux arrêts configurables, repart avec un code de quelques
 * caractères, l'envoie. Le chiffrage se fait de l'autre côté, avec
 * `tarifs.json` — qui n'a jamais quitté le poste du Lord.
 *
 * Conséquence : le module « Collecte de leads » du catalogue est livré **par le
 * codec**, sans formulaire, sans base et sans serveur. Et le lead arrive
 * qualifié : on sait exactement ce que le visiteur a composé avant de le
 * rappeler.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * ⚠️ UN CODEC PROPRE AU DOMAINE — IL NE S'AJOUTE PAS À CELUI DU SPORT
 * ════════════════════════════════════════════════════════════════════════════
 * Même règle que `visite/` au jalon 28. Les 8 index de thème du codec sportif
 * sont **pleins** (3 bits), et `decodeShareCode` refuse toute version autre que
 * la sienne : y ajouter quoi que ce soit rendrait illisibles **tous les
 * parcours et modèles déjà rangés chez les joueurs**. Ce domaine a son préfixe,
 * sa version et son format ; le socle ne fournit que l'alphabet et le
 * bit-packing.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * ⚠️ CE QUE CE DOMAINE PROUVE, ET CE QU'IL NE PROUVE PAS
 * ════════════════════════════════════════════════════════════════════════════
 * Il prouve que `socle/partage/base32.ts` sert un troisième domaine sans une
 * ligne modifiée — après le sport et le musée.
 *
 * Il ne prouve **rien** sur la génération déterministe, et c'est une
 * information, pas un manque : **l'ordre des 12 arrêts est celui du deck**. Une
 * présentation commerciale a une progression voulue — l'accroche avant la
 * technique, les cas d'usage avant le contact — et la tirer au sort
 * dégraderait le propos. Aucune graine n'est donc employée ici. Fabriquer un
 * usage du générateur pour « cocher la primitive » aurait produit un mensonge
 * dans le rapport de jalon ; le jalon 28 avait déjà rendu le même verdict sur
 * `reconcile()`, jugé non nécessaire à un domaine sans retouches.
 */
import { fromBase32, toBase32 } from "../../../../socle/partage/base32.js";
import { makeCodeNormalizer } from "../../../../socle/capsule/capsuleStore.js";
export const OFFRE_SHARE_PREFIX = "FI";
/**
 * ⚠️ **Version 2 depuis le 18/08/2026**, et le passage n'était pas cosmétique :
 * le masque de modules tenait sur UN octet, donc huit entrées, toutes prises.
 * Le neuvième module (l'agent conversationnel) imposait le mur annoncé plus bas.
 *
 * 📌 **Les codes v1 restent décodables**, et c'est la seule chose qui rend ce
 * changement acceptable : un code déjà dicté à un client vaut un devis en
 * cours. Le décodage branche donc sur l'octet de version, et ne devine jamais.
 */
export const OFFRE_SHARE_VERSION = 2;
/** L'ancienne version, encore décodée. Elle n'est plus jamais écrite. */
const VERSION_UN_OCTET = 1;
/**
 * Le nombre de modules que le format sait porter.
 *
 * ⚠️ **Deux octets, donc seize.** Le prochain mur est là, et il se franchira de
 * la même façon : une version de plus, l'ancienne toujours décodée.
 */
export const PLAFOND_MODULES = 16;
/**
 * ⚠️ L'ORDRE DE CES TROIS TABLES EST LE FORMAT LUI-MÊME.
 *
 * On ajoute **uniquement en fin**, jamais au milieu. Insérer une entrée
 * décalerait tous les index suivants : les codes déjà transmis se
 * décoderaient sans erreur, en désignant **autre chose** — un devis muet et
 * faux, ce qui est bien pire qu'un code refusé.
 *
 * ⚠️ `MODULES` occupait un masque d'un octet, soit 8 entrées, toutes prises.
 * Le mur a été atteint le 18/08/2026 avec l'agent conversationnel, et franchi
 * comme il devait l'être : un second octet, une version de format de plus, et
 * l'ancienne toujours décodée. **Le plafond est maintenant 16**, et le suivant
 * se franchira pareil. C'est le mur du codec sportif au jalon 25, à cette
 * différence près qu'ici il était annoncé d'avance.
 */
const PRODUITS = ["explore", "reveal", "configure"];
const NIVEAUX = ["kit", "signature", "atelier"];
const MODULES = [
    "langue", "accessibilite", "leads", "analytics",
    "gamification", "multijoueur", "assets3d", "connecteur",
    // ⚠️ En FIN de table, jamais au milieu : insérer décalerait tous les index
    // suivants, et les codes déjà transmis se décoderaient sans erreur en
    // désignant autre chose. Le neuvième bit est le premier du second octet.
    "agent",
];
/** Nettoie une saisie — la fabrique commune du jalon 30. */
export const normalizeOffreCode = makeCodeNormalizer(OFFRE_SHARE_PREFIX);
/**
 * Encode une configuration.
 *
 * Charge utile : version · index de produit · index de niveau · masque de
 * modules. **Quatre octets**, soit sept caractères en base32 — dictables au
 * téléphone, ce qui est le point.
 *
 * ⚠️ **Rien d'autre ne voyage.** Pas de prix, pas d'horodatage, pas
 * d'identifiant de session, pas d'adresse. Un code qui transporterait une
 * donnée personnelle deviendrait un traitement à déclarer, alors qu'il n'est
 * aujourd'hui qu'une description de produit — même discipline que « un code
 * joueur ne voyage jamais » côté sport.
 */
export function encodeConfiguration(config) {
    const out = [];
    out.push(OFFRE_SHARE_VERSION);
    // ⚠️ `indexOf` rend -1 sur une valeur inconnue ; on le rabat sur 0 plutôt
    // que d'écrire 255 dans l'octet. Un devis qui dit « EXPLORE » par défaut
    // est discutable à l'oral ; un devis qui ne se décode pas est perdu.
    out.push(Math.max(0, PRODUITS.indexOf(config.produit)));
    out.push(Math.max(0, NIVEAUX.indexOf(config.niveau)));
    let masque = 0;
    for (const id of config.modules) {
        const bit = MODULES.indexOf(id);
        if (bit >= 0)
            masque |= 1 << bit;
    }
    // ⚠️ Poids faible d'abord, poids fort ensuite. L'ordre EST le format : le
    // lire à l'envers rendrait une configuration parfaitement plausible, avec
    // les mauvais modules cochés, et rien ne le signalerait.
    out.push(masque & 0xff);
    out.push((masque >> 8) & 0xff);
    return `${OFFRE_SHARE_PREFIX}-${toBase32(out)}`;
}
/** Décode une configuration. Rend `null` sur un code illisible ou d'une autre version. */
export function decodeConfiguration(raw) {
    const bytes = fromBase32(normalizeOffreCode(raw));
    if (bytes.length < 4)
        return null;
    // ⚠️ **La version se lit AVANT tout le reste**, et elle décide de la
    // longueur attendue. Un code v2 tronqué à 4 octets ne doit pas passer pour
    // un v1 : il rendrait une configuration amputée de ses modules du second
    // octet, et le devis partirait incomplet sans la moindre erreur.
    const version = bytes[0];
    if (version === OFFRE_SHARE_VERSION) {
        if (bytes.length < 5)
            return null;
    }
    else if (version !== VERSION_UN_OCTET) {
        return null;
    }
    const produit = PRODUITS[bytes[1]];
    const niveau = NIVEAUX[bytes[2]];
    // ⚠️ Un index hors table vient d'un code d'une version future ou corrompu.
    // On refuse : mieux vaut demander au visiteur de recoller son code que de
    // chiffrer une configuration qu'il n'a pas composée.
    if (!produit || !niveau)
        return null;
    // 📌 Un code v1 n'a qu'un octet de masque : ses modules sont les huit
    // premiers, et l'agent conversationnel en est absent. C'est exact et non
    // approximatif : quand ce code a été composé, le module n'existait pas et
    // le visiteur ne pouvait pas le cocher.
    const masque = version === VERSION_UN_OCTET ? bytes[3] : bytes[3] | (bytes[4] << 8);
    const modules = MODULES.filter((_, bit) => (masque & (1 << bit)) !== 0);
    return { produit, niveau, modules };
}
/**
 * Vérifie que les tables du codec et le manifeste ne se sont pas désynchronisés.
 *
 * ⚠️ **Le défaut que cette fonction attrape est silencieux.** Ajouter un module
 * dans `contenu.json` sans l'ajouter ici ne casse rien : le module s'affiche
 * sur le site, le visiteur le coche, et il **disparaît du code** — le devis
 * arrive amputé, sans que personne ne voie où. C'est exactement la famille du
 * piège « `TOUS` dans `fitExercisePool` doit inclure tout nouveau thème »
 * (jalon 25), où une séance sortait amputée sans erreur.
 */
export function verifierCodec(contenu) {
    const soucis = [];
    for (const p of contenu.produits) {
        if (!PRODUITS.includes(p.id))
            soucis.push(`produit absent du codec : ${p.id}`);
    }
    for (const n of contenu.niveaux) {
        if (!NIVEAUX.includes(n.id))
            soucis.push(`niveau absent du codec : ${n.id}`);
    }
    for (const m of contenu.modules) {
        if (!MODULES.includes(m.id))
            soucis.push(`module absent du codec : ${m.id}`);
    }
    if (contenu.modules.length > PLAFOND_MODULES) {
        soucis.push(`${contenu.modules.length} modules : le masque de deux octets est plein à ${PLAFOND_MODULES}, il faut une nouvelle version de format`);
    }
    return soucis;
}
