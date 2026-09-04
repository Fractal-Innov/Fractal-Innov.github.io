/**
 * Point d'entrée du configurateur — **build PUBLIC**.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * ⚠️ CE FICHIER EST LA FRONTIÈRE DES PRIX, ET ELLE EST PHYSIQUE
 * ════════════════════════════════════════════════════════════════════════════
 * Regardez ses imports : il n'y a **aucune** référence à `offreChiffrage.ts`
 * ni à `tarifs.json`. Comme un bundler ne suit que les imports, la grille
 * tarifaire n'entre jamais dans le JavaScript expédié aux visiteurs.
 *
 * Ce n'est pas un masquage, c'est une absence. Un visiteur qui ouvrirait les
 * sources, la console ou l'onglet réseau ne trouverait rien — parce qu'il n'y
 * a rien.
 *
 * ⚠️ **Ne jamais ajouter d'import de chiffrage ici**, même « temporairement »,
 * même derrière un `if`. Un `import` statique embarque le module que la
 * condition soit vraie ou non. `t34` rougit si ce fichier atteint le chiffrage.
 */
import { monterConfigurateur } from "./configurateurUI.js";
import { lireLordDepuisUrl } from "./offreLord.js";
/** Le manifeste est servi à côté des pages. Chemin absolu : la page peut être
 *  à la racine comme dans un sous-dossier. */
const CHEMIN_MANIFESTE = "/contenu.json";
async function demarrer() {
    // Lu en premier : le paramètre d'URL est consommé et l'adresse nettoyée
    // avant tout rendu, pour qu'un copier-coller ne transporte pas le mode.
    lireLordDepuisUrl();
    try {
        const reponse = await fetch(CHEMIN_MANIFESTE);
        if (!reponse.ok)
            throw new Error(`HTTP ${reponse.status}`);
        monterConfigurateur(await reponse.json());
    }
    catch (e) {
        // ⚠️ Échec silencieux **assumé, et c'est le bon comportement ici** :
        // la page liste déjà les niveaux et les modules en HTML. Si le
        // configurateur ne se charge pas, le visiteur garde l'information —
        // afficher un message d'erreur à la place lui donnerait l'impression
        // que le site est cassé alors qu'il est complet.
        console.warn("[Configurateur] manifeste indisponible, la page reste lisible", e);
    }
}
void demarrer();
