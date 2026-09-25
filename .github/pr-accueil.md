Remplace la page d'accueil de www.fractal-innov.fr par une page de
présentation en thème sombre, et republie le village 3D qui l'occupait
comme démonstrateur sur `/village/`.

## Pourquoi

L'accueil était le village 3D : 13 Mo à charger avant de comprendre ce que
vend Fractal Innov, et les dix sous-pages générées n'y avaient aucune porte
d'entrée. La nouvelle page dit l'offre en un écran, montre les cinq
démonstrateurs qui tournent déjà, et garde le village à un clic.

## Ce qui change

- **Nouvelle page d'accueil** (`index.html`), reprise de la maquette de
  handoff : nav collante, hero, Fondateur, Approche, Offre, « Ce qui tourne
  déjà », Partenaires, Contact, pied de page.
- **La charte de `/stand/` fait foi.** Jetons, largeur de contenu (1100 px),
  échelles de titres, cartes, CTA dégradé, burger et menu plein écran sont
  repris de `stand/index.html`, noms de variables compris : les blocs sont
  portables d'une page à l'autre, sur le modèle du socle des projets Needle.
- **Section « Ce qui tourne déjà »** : STAND, Rayon X, Midipile, le moulage
  de Mathilde Thiennot et le village, chacun avec sa propre image de partage
  publiée (5 à 18 Ko, déjà en 16:9).
- **Pied de page** : les 7 pages indexées du site, qui n'étaient atteignables
  que depuis le village.
- **Le village part dans `Fractal-Innov/village`** et est servi sur
  `/village/`. `charte.css`, `js/`, `contenu.json`, `arret/`, `icones/` et
  les sous-pages restent ici : elles sont partagées.
- **Polices auto-hébergées** (`media/polices/`, Outfit et JetBrains Mono) :
  aucune requête vers Google Fonts, donc rien à déclarer côté RGPD.
- **Image de partage** `media/accueil/og-accueil.jpg` (1200 × 630, 17 Ko).
- `sitemap.xml` passe à 12 adresses.

## Ce qui est vérifié

- Aucun débordement horizontal à 375, 768, 1200 et 1280 px (mesuré à 0 px).
- Aucune requête en échec au chargement (`performance.getEntriesByType`).
- Menu mobile : `right` de −773 px à 0 px, `overflow` du body verrouillé.
- Décalage d'ancre : titre à 250 px, bas de la pilule à 89 px, donc lisible.
- `prefers-reduced-motion: reduce` couvre toutes les règles animées.
- Sans JavaScript, aucun contenu n'est masqué (la classe `.js` est posée
  dans le `<head>`, et `.reveal` ne cache qu'à travers elle).

## ⚠️ Ordre de fusion

`https://www.fractal-innov.fr/village/` doit répondre **200 avant** la
fusion : cette PR retire la build du village de la racine. Tant qu'elle
n'est pas fusionnée, rien n'est public.

## Ce qui reste à faire après

- La boucle vidéo du hero (tâche 7) attend une capture OBS de 10 à 15 s.
- Les logos des partenaires sont des monogrammes générés ; les emplacements
  sont commentés dans le balisage.
- Le texte du Catalyseur POLD est écrit sans source et demande une relecture.
- `include/marque/` (3,3 Mo) et `include/EnergieFlow01.JPG` (1,4 Mo) ne sont
  référencés nulle part : à retirer dans un commit `chore` séparé.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
