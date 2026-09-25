## Pourquoi

L'accueil parlait de secteurs (industrie, formation, art). Il parle maintenant de **situations** que le prospect reconnaît dès le premier écran, et mène à une seule porte : **l'atelier de cadrage de 30 min, gratuit**. La page devient un parcours en sept chapitres, pilotable demain par le son et la télécommande.

Spec : `docs/superpowers/specs/2026-09-25-parcours-interactif-design.md`
Plan : `docs/superpowers/plans/2026-09-25-parcours-interactif.md`
Fiche de vente : `VENTE.md`

## Ce qui change

- **Un savoir, trois usages** : Convaincre un acheteur (équipements lourds, coût et impact logistique), Former un nouvel arrivant (savoir-faire, compatible NDA), Garder un savoir-faire (processus, tour de main, geste d'une artiste).
- **Le hero pose la question** « Votre savoir doit d'abord : » ; le choix règle toute la page (repère du fondateur en tête, carte d'usage et démos allumées avec badge, titre du contact personnalisé). Rien n'est masqué ni réordonné.
- **Lien de relance** : `/?situation=former` ouvre la page déjà réglée.
- **Un geste par chapitre** : étapes de l'approche à allumer, constellation des partenaires.
- **Le dock** en bas au centre (fil, position, situation) ; sur téléphone, **une pastille de 56 px** avec anneau de progression et trois effets ponctuels, aucun en boucle.
- **Le contrat d'événements** pour les sous-projets suivants : `fi:chapitre`, `fi:situation`, `fi:geste` émis, `fi:aller` écouté.
- **La mesure Umami** : situation choisie, chapitres atteints, gestes, guide ouvert, `rdv-demande` (la conversion), démos, autres canaux. Coupée hors production (`data-domains`).
- **Correctif** : `--ease-morph` et `--radius-enveloppe` étaient utilisés sans être définis.

## Vérifié (navigateur, chiffres relevés)

- Arrivée par `/#demos` : le dock affiche « 5 / 7 · Ça tourne déjà ».
- Choix « Former » : `data-situation="former"`, URL `?situation=former`, badge sur Rayon X seul, contact « Parlons de vos nouveaux arrivants ».
- `/?situation=garder` réglé sans clic ; `/?situation=xyz` et `FORMER` restent neutres.
- 375 × 812 : pastille 56 × 56 px, débordement horizontal 0, pied de page visible en bas.
- Contrat : `fi:aller { pas: 1 }` fait avancer d'un chapitre ; deux appuis rapides avancent de deux.
- Umami absent : mesure ignorée, aucune erreur en console.
- Aucun tiret cadratin visible, aucun titre à point final, aucun prix.
- Poids : 156 677 octets (37,6 Ko compressés), sous le plafond de 500 Ko.

## Reste à valider par Corentin

- Le rendu à l'œil, grand écran et vrai téléphone.
- Le mouvement réduit (DevTools › Rendering).
- La lecture sans JavaScript.
- La constellation (ligne derrière les cartes, diagonale entre les deux rangées).

## Hors de cette PR

Le son, la télécommande (`/telecommande/`, le visiteur la tient) et la passe SEO/GEO, dont la meta description qui parle encore de secteurs.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
