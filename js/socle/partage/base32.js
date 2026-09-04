/**
 * OpenFitWebXR — encodage d'octets en texte court et dictable.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * POURQUOI CE MODULE EXISTE
 * ────────────────────────────────────────────────────────────────────────────
 * C'est la moitié mécanique de la primitive n°2 du socle (voir
 * ARCHITECTURE.md §2) : écrire un tableau d'octets en une chaîne courte, et la
 * relire. Ce module ne sait rien de ce que ces octets représentent — ni séance
 * ni thème ni visite. Cette ignorance est le point : un codec qui connaîtrait
 * le domaine ne pourrait pas servir au domaine suivant.
 *
 * ⚠️ **Extrait de `fitShareCode.ts` au jalon 27**, en même temps que le second
 * domaine de démonstration (`domaines/visite/`) était écrit. La partie qui
 * restait dans `fitShareCode.ts` — les tables `THEMES`/`EQUIPMENTS`, la
 * comparaison à la séance vierge, `reconcile()` — est **du domaine** et n'a
 * pas bougé : c'est elle qui sait ce qu'une séance est. Ce module ne porte que
 * ce que n'importe quel codec d'écart doit faire de toute façon.
 *
 * ⚠️ **Ne jamais changer l'alphabet ni le bit-packing sans mesurer l'impact.**
 * Tout code déjà donné à quelqu'un — séance, parcours, modèle — a été écrit
 * avec cet alphabet précis ; un changement le rendrait illisible, en silence,
 * pour quiconque le collerait après la mise à jour.
 */
/**
 * Alphabet base32 de Crockford, sans I, L, O ni U.
 *
 * Ces quatre lettres sont écartées parce qu'elles se confondent à l'oral et à
 * l'écrit avec 1, 0 et V — un code fait pour être dicté au téléphone ne peut
 * pas se permettre cette ambiguïté.
 */
export const BASE32_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
/** Confusions courantes, à corriger silencieusement à la saisie. */
export const BASE32_CONFUSIONS = {
    I: "1", L: "1", O: "0", U: "V",
};
/** Encode un tableau d'octets en texte, 5 bits par caractère. */
export function toBase32(bytes) {
    let bits = 0, value = 0, out = "";
    for (const b of bytes) {
        value = (value << 8) | b;
        bits += 8;
        while (bits >= 5) {
            out += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
            bits -= 5;
        }
    }
    // Bits restants complétés par des zéros : le décodeur s'arrête sur la
    // longueur annoncée dans la charge utile, jamais sur la fin de chaîne.
    if (bits > 0)
        out += BASE32_ALPHABET[(value << (5 - bits)) & 31];
    return out;
}
/** Décode un texte base32 en tableau d'octets. Ignore les caractères inconnus. */
export function fromBase32(text) {
    let bits = 0, value = 0;
    const out = [];
    for (const ch of text) {
        const idx = BASE32_ALPHABET.indexOf(ch);
        if (idx < 0)
            continue;
        value = (value << 5) | idx;
        bits += 5;
        if (bits >= 8) {
            out.push((value >>> (bits - 8)) & 255);
            bits -= 8;
        }
    }
    return out;
}
const enc = new TextEncoder();
const dec = new TextDecoder();
/** Écrit une chaîne préfixée de sa longueur en octets (tronquée à `maxBytes`). */
export function putText(out, text, maxBytes = 40) {
    const bytes = [...enc.encode(text)].slice(0, maxBytes);
    out.push(bytes.length, ...bytes);
}
/** Lit une chaîne écrite par `putText`, en avançant le curseur `at.i`. */
export function takeText(bytes, at) {
    const len = bytes[at.i++] ?? 0;
    const slice = bytes.slice(at.i, at.i + len);
    at.i += len;
    return dec.decode(new Uint8Array(slice));
}
