/**
 * OpenFitWebXR — graine et générateur pseudo-aléatoire déterministes.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * POURQUOI CE MODULE EXISTE
 * ────────────────────────────────────────────────────────────────────────────
 * C'est la primitive n°1 du socle (voir ARCHITECTURE.md §2) : une expérience
 * reproductible à l'identique sur deux appareils sans qu'ils se parlent. Tout
 * ce qu'il faut pour ça tient en deux fonctions pures — un hachage de chaîne
 * vers un entier 32 bits, et un générateur pseudo-aléatoire qui part de cet
 * entier. Aucune des deux ne sait ce qu'est une séance ou une visite.
 *
 * ⚠️ Ce module a été extrait au jalon 27 après avoir trouvé deux copies
 * **identiques au bit près** de `mulberry32` — une dans `fitSessionMatrix.ts`
 * (`makeRng`), une dans `fitDaily.ts` (`rngFrom`). Rien n'indiquait qu'elles
 * l'étaient : elles ont divergé de nom sans jamais diverger de code, le signe
 * classique d'un copier-coller qu'on aurait dû faire une fois. Un module
 * socle n'a de sens qu'à partir de la deuxième utilisation identique — c'était
 * la deuxième.
 *
 * ⚠️ **Ne jamais changer l'implémentation sans mesurer l'impact.** Toute
 * séance ou visite déjà partagée par un code encode une graine ; changer la
 * façon dont `mulberry32` transforme cette graine en tirages change le
 * résultat produit pour la même graine, silencieusement, des deux côtés à la
 * fois puisque encodeur et décodeur partagent ce module. Un code déjà donné à
 * quelqu'un cesserait de rejouer la même chose.
 */
/**
 * Hache une chaîne en un entier 32 bits non signé (FNV-1a).
 *
 * Sert à dériver une graine numérique d'une clé lisible — une date, un
 * identifiant de lieu — sans jamais avoir à stocker ou transmettre la graine
 * elle-même : les deux appareils recalculent le même entier à partir de la
 * même chaîne.
 */
export function hash32(s) {
    let h = 0x811c9dc5;
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 0x01000193);
    }
    return h >>> 0;
}
/**
 * Générateur pseudo-aléatoire déterministe (mulberry32).
 *
 * Retourne une fonction qui produit, à chaque appel, un flottant dans [0, 1).
 * Deux appels de `mulberry32(x)` produisent toujours la même **suite**
 * d'appels ultérieurs pour un même `x` — c'est tout ce qu'on lui demande.
 *
 * Choisi pour sa simplicité (une addition, deux multiplications, deux XOR) et
 * sa qualité suffisante pour du tirage de contenu — ce n'est **pas** un
 * générateur cryptographique, et ne doit jamais servir à quoi que ce soit qui
 * a besoin de l'être.
 */
export function mulberry32(seed) {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6D2B79F5) >>> 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
/**
 * Mélange un tableau selon Fisher-Yates, à partir d'un générateur fourni.
 *
 * Prend le générateur en paramètre plutôt que la graine directement : deux
 * appelants qui tirent plusieurs mélanges depuis la même graine doivent
 * partager une seule suite de tirages, pas en relancer une par appel — sinon
 * chaque mélange reproduirait le premier.
 */
export function shuffle(items, rng) {
    const out = [...items];
    for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
}
