/**
 * Point d'entrée du site de l'offre — chargé sur **toutes** les pages.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * ⚠️ LA FRONTIÈRE DES PRIX VAUT AUSSI POUR CE FICHIER
 * ════════════════════════════════════════════════════════════════════════════
 * Comme `configurateurPublic.ts`, ce module n'atteint **jamais**
 * `offreChiffrage.ts` ni `tarifs.json`, et `t34` le vérifie en parcourant son
 * graphe d'imports. Ce point d'entrée est chargé sur les six pages : y faire
 * entrer le chiffrage publierait la grille tarifaire **partout d'un coup**.
 *
 * ⚠️ **Ne jamais y ajouter d'import de chiffrage**, même derrière une
 * condition : un `import` statique embarque le module que la condition soit
 * vraie ou non.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * POURQUOI IL EST SÉPARÉ DU CONFIGURATEUR
 * ════════════════════════════════════════════════════════════════════════════
 * Le configurateur ne sert que sur une page ; l'animation et la mesure servent
 * partout. Les fondre en un seul fichier ferait télécharger le configurateur —
 * son état, son codec, son écran — sur cinq pages qui n'en ont aucun usage.
 * Le budget de performance se juge sur la page statique, pas sur l'expérience
 * 3D : c'est elle qui est indexée.
 */
import { animerSite } from "./offreVivant.js";
// Le script est chargé en `defer` : le document est déjà analysé quand il
// s'exécute, il n'y a donc rien à attendre. Un `DOMContentLoaded` ici ne ferait
// que retarder l'apparition d'une image de plus.
try {
    animerSite();
}
catch (e) {
    // ⚠️ Échec silencieux **assumé** : la page est complète sans ce script.
    // Afficher une erreur donnerait l'impression que le site est cassé alors
    // qu'il ne manque que du confort.
    console.warn("[Site] animation indisponible, la page reste complète", e);
}
