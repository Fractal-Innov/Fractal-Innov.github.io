/**
 * Domaine « offre » — les types du site fractal-innov.fr.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * CE QUE CE DOMAINE EST
 * ════════════════════════════════════════════════════════════════════════════
 * Le troisième domaine sur le socle, après `fitness` et `visite` (jalon 28) —
 * et le premier qui parte en production. Il décrit **l'offre commerciale de
 * Fractal Innov** telle que le deck la présente : 12 arrêts, 3 produits,
 * 3 niveaux d'engagement, 8 modules au catalogue.
 *
 * ⚠️ **Le site démontre le produit en ÉTANT le produit.** Le visiteur traverse
 * un monde EXPLORE de 12 arrêts ; arrivé à la matrice, il compose son offre
 * (CONFIGURE) ; la sortie est une capsule de quelques caractères, qui est à la
 * fois son devis, un objet partageable et le lead. Aucune de ces trois briques
 * n'est à inventer : elles existent depuis le jalon 12, habillées en sport.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * ⚠️ UNE SOURCE, DEUX RENDUS — LA DÉCISION QUI NE SE RATTRAPE PAS
 * ════════════════════════════════════════════════════════════════════════════
 * `contenu.json` sert **deux sorties** :
 *
 *     contenu.json ──┬─→ les 12 arrêts de l'expérience 3D      (le jeu)
 *                    └─→ 6 pages HTML réelles, sans JavaScript (le site)
 *
 * Ce n'est pas une optimisation de référencement, c'est une contrainte
 * d'existence. Mesuré sur `index.html` : **2 balises de titre ou de
 * paragraphe**, tout le reste est injecté en JS après le démarrage du moteur
 * 3D. Googlebot exécute le JS mais en rendu différé et budgété ; **GPTBot,
 * ClaudeBot et PerplexityBot ne l'exécutent pas du tout** — ils voient une page
 * vide. Or les réponses générées sont précisément le canal visé.
 *
 * ⚠️ **Une passe de référencement en fin de projet ne peut rien réparer : il
 * n'y a rien à optimiser dans une page vide.** D'où la couche statique ici, au
 * jalon du domaine, et pas plus tard.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * ⚠️ DEUX FICHIERS DE CONTENU, ET C'EST STRUCTURANT
 * ════════════════════════════════════════════════════════════════════════════
 *     contenu.json   ✅ expédié   — textes, structure, délais, l'ancrage 4 900 €
 *     tarifs.json    ❌ JAMAIS    — les prix unitaires. Build « extract » seul
 *
 * **Mettre un tarif dans `contenu.json`, c'est publier les prix par accident.**
 * C'est la seule erreur irrattrapable de ce jalon — `t33` la surveille.
 *
 * ⚠️ Et le point technique qui doit être dit une fois pour toutes : **un bouton
 * masqué sur une page publique n'est pas un secret.** Tout ce qui est dans le
 * bundle est lisible en ouvrant les sources. Si la grille tarifaire y est, elle
 * est publique — qu'un geste la révèle ou non n'y change rien. La seule façon
 * qu'un prix ne circule pas est qu'il ne soit pas dans le build.
 */
export {};
