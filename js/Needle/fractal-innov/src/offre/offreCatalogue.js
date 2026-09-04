/**
 * Domaine « offre » — lire le manifeste, et vérifier qu'il tient debout.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * POURQUOI CE MODULE NE FAIT QUE DU CALCUL
 * ════════════════════════════════════════════════════════════════════════════
 * Il ne charge rien lui-même : on lui **passe** le manifeste déjà lu. C'est ce
 * qui permet aux trois consommateurs de partager exactement le même code sans
 * qu'aucun n'impose sa façon de lire un fichier :
 *
 *   · le monde 3D          → `fetch()` dans le navigateur ;
 *   · le générateur de pages → `readFileSync()` dans Node ;
 *   · la suite `t33`         → `readFileSync()` aussi, sans navigateur.
 *
 * Même geste que la persistance injectée du jalon 30 (`createCapsuleStore`) et
 * que `configureBadgeXpResolver()` au jalon 27 : le module reçoit sa source,
 * il ne la choisit pas.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * ⚠️ LE CONTENU EST DU CONTENU — DONC IL N'A PAS DE COMPILATEUR
 * ════════════════════════════════════════════════════════════════════════════
 * `contenu.json` sera édité à la main, par quelqu'un qui n'ouvrira pas ce
 * fichier. Rien ne l'empêchera d'écrire un `page` qui ne correspond à aucune
 * page, ou de retirer un arrêt encore référencé. `verifierContenu()` est donc
 * le compilateur de ce fichier-là — et `t33` l'exécute à chaque `npm test`.
 */
import { createLogger } from "../../../../socle/debugLog.js";
const log = createLogger("Offre");
/**
 * Rend le texte d'une langue, avec repli sur le français.
 *
 * ⚠️ **Le repli est délibéré et il ne doit PAS produire de page anglaise.**
 * Un champ `en` vide signifie « pas encore traduit » ; rendre le français à sa
 * place dans une page balisée `lang="en"` produirait une page en double langue,
 * que Google traite comme du contenu de mauvaise qualité. D'où la règle
 * appliquée par le générateur de pages : **une langue n'est publiée que si elle
 * est complète** (`langueComplete()` ci-dessous). Le repli ne sert qu'à
 * l'affichage dans le monde 3D, où une phrase vaut mieux que du vide.
 */
export function texte(t, langue = "fr") {
    const valeur = t[langue];
    return valeur && valeur.trim().length > 0 ? valeur : t.fr;
}
/**
 * Une langue est-elle assez complète pour être publiée ?
 *
 * Vérifie les champs qui **finissent dans le HTML indexé** : titres, méta,
 * `h1`, question. Si l'un manque, la page n'existe pas dans cette langue —
 * mieux vaut une page de moins qu'une page à moitié traduite.
 */
export function langueComplete(contenu, langue) {
    if (langue === "fr")
        return true;
    return contenu.pages.every(p => [p.titre, p.description, p.h1, p.question].every(t => (t[langue] ?? "").trim().length > 0));
}
/** Les arrêts d'une page, dans l'ordre déclaré par la page. */
export function arretsDeLaPage(contenu, page) {
    return page.arrets
        .map(id => contenu.arrets.find(a => a.id === id))
        .filter((a) => a !== undefined);
}
/** Les arrêts du parcours 3D, dans l'ordre de lecture du deck (rang 1 → 12). */
export function arretsOrdonnes(contenu) {
    return [...contenu.arrets].sort((a, b) => a.rang - b.rang);
}
/** Les modules d'une famille, dans l'ordre du manifeste. */
export function modulesDeCategorie(contenu, categorie) {
    return contenu.modules.filter(m => m.categorie === categorie);
}
/** L'URL canonique d'une page. ⚠️ Jamais d'ancre : les routes en `#` ne s'indexent pas. */
export function urlCanonique(contenu, slug) {
    const base = contenu.site.origine.replace(/\/+$/, "");
    return slug === "" ? `${base}/` : `${base}/${slug}/`;
}
/**
 * Le chemin d'une page pour un lien **interne** : `/` ou `/mon-slug/`.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * ⚠️ POURQUOI CE N'EST PAS `urlCanonique()`
 * ════════════════════════════════════════════════════════════════════════════
 * Les deux se ressemblent, et les confondre a un coût réel — payé au jalon 33 :
 * la navigation employait `urlCanonique()`, donc **chaque lien du menu pointait
 * vers `https://www.fractal-innov.fr/…`**. Résultat : le site construit n'était
 * navigable nulle part ailleurs que sur le domaine de production. En local, en
 * préproduction, sur le serveur de dev, cliquer une entrée du menu vous éjectait
 * vers l'ancien site en ligne — sans la moindre erreur, ce qui est le pire cas.
 *
 * La distinction, une fois pour toutes :
 *
 * | | à quoi ça sert | forme |
 * |---|---|---|
 * | `urlCanonique()` | **dire aux moteurs** quelle est l'adresse officielle d'une page (`<link rel="canonical">`, le sitemap, le JSON-LD) | **absolue**, obligatoirement |
 * | `cheminInterne()` | **naviguer** d'une page à l'autre | **racine-relative** |
 *
 * Une canonique relative ne veut rien dire pour un moteur ; un lien de
 * navigation absolu enferme le site sur un seul domaine. Chacune à sa place.
 */
export function cheminInterne(slug) {
    return slug === "" ? "/" : `/${slug}/`;
}
/**
 * Vérifie le manifeste, et dit ce qui cloche.
 *
 * @returns la liste des anomalies — vide si tout va bien.
 */
export function verifierContenu(contenu) {
    const soucis = [];
    // ── Intégrité des références croisées ───────────────────────────────────
    const idsArrets = new Set(contenu.arrets.map(a => a.id));
    if (idsArrets.size !== contenu.arrets.length)
        soucis.push("deux arrêts partagent un identifiant");
    const slugs = new Set(contenu.pages.map(p => p.slug));
    if (slugs.size !== contenu.pages.length)
        soucis.push("deux pages partagent un slug");
    for (const page of contenu.pages) {
        // ⚠️ Un slug avec majuscule, espace ou accent produit une URL fragile,
        // ré-encodée différemment selon le client. Le mal est fait au moment
        // où elle est indexée : la corriger après coûte une redirection.
        if (!/^[a-z0-9-]+$/.test(page.slug))
            soucis.push(`slug non conforme : ${page.slug}`);
        for (const id of page.arrets) {
            if (!idsArrets.has(id))
                soucis.push(`la page ${page.slug} référence un arrêt inconnu : ${id}`);
        }
    }
    // ⚠️ Un arrêt orphelin est du contenu écrit qui n'apparaît nulle part —
    // le genre de perte qu'on ne remarque qu'en relisant le site six mois plus
    // tard, en se demandant où est passé le paragraphe.
    const placés = new Set(contenu.pages.flatMap(p => p.arrets));
    for (const arret of contenu.arrets) {
        if (!placés.has(arret.id))
            soucis.push(`arrêt orphelin, sur aucune page : ${arret.id}`);
        if (!arret.titre.fr.trim())
            soucis.push(`titre français manquant : ${arret.id}`);
        if (!arret.resume.fr.trim())
            soucis.push(`résumé français manquant : ${arret.id}`);
    }
    // ── Ce que le référencement exige, vérifié comme une règle métier ───────
    for (const page of contenu.pages) {
        if (!page.h1.fr.trim())
            soucis.push(`h1 manquant : ${page.slug}`);
        if (!page.menu?.fr.trim())
            soucis.push(`libellé de menu manquant : ${page.slug}`);
        if (!page.question.fr.trim())
            soucis.push(`question sans réponse annoncée : ${page.slug}`);
        const d = page.description.fr.trim().length;
        // Fourchette large exprès : ce sont des ordres de grandeur d'affichage
        // dans les résultats, pas une norme. Trop court n'informe pas, trop
        // long est tronqué au milieu d'une phrase.
        if (d < 70 || d > 320)
            soucis.push(`description hors fourchette (${d} car.) : ${page.slug}`);
    }
    // ── ⚠️ LA GARDE QUI COMPTE : aucun prix ne fuit ─────────────────────────
    // La seule erreur irrattrapable de ce jalon. On balaie TOUT le manifeste,
    // pas seulement les champs où l'on croit que des prix pourraient être :
    // c'est précisément dans le champ auquel on n'a pas pensé qu'un montant
    // finira par être écrit.
    const ancrage = String(contenu.site.ancrageEuros);
    const brut = JSON.stringify(contenu);
    for (const m of brut.matchAll(/(\d[\d   ]{2,})\s*(?:€|EUR|euros)/gi)) {
        const montant = m[1].replace(/[^\d]/g, "");
        if (montant !== ancrage) {
            soucis.push(`⚠️ montant autre que l'ancrage dans le manifeste public : ${m[0].trim()}`);
        }
    }
    log("vérification —", soucis.length, "anomalie(s)");
    return soucis;
}
/** Les identifiants valides, exposés pour le codec et les tests. */
export function idsProduits(contenu) {
    return contenu.produits.map(p => p.id);
}
export function idsNiveaux(contenu) {
    return contenu.niveaux.map(n => n.id);
}
