# Cahier des captures : vidéo du hero, aperçus des démos et de l'offre

- **Date** : 28/09/2026
- **Pour** : la passe visuels (après le son, la couleur du navigateur et le
  partage au téléphone).
- **Principe** : les fichiers gardent les noms et les emplacements actuels.
  Remplacer une image = déposer le nouveau fichier au même chemin, aucune
  ligne de code à changer (sauf la vidéo, un attribut).

## 1. Ce qui existe aujourd'hui

| Emplacement | Fichier | Taille actuelle | Problème |
|---|---|---|---|
| Hero (fond) | aucun, `data-hero-video="aucune"` | · | halos seuls |
| Offre, Convaincre | `media/accueil/offre-stand.webp` | 1600 × 1063 (3:2) | ratio ≠ 16:9, rogné |
| Offre, Former | `media/accueil/demos/rayon-x.webp` | 1200 × 630 (1,9:1) | même image que la démo |
| Offre, Conserver | `media/accueil/demos/moulage.webp` | 1080 × 606 | même image que la démo |
| Démo STAND | `media/accueil/demos/stand.webp` | 1600 × 1063 (3:2) | ratio |
| Démo Midipile | `media/accueil/demos/midipile.webp` | 1080 × 607 | un peu juste en Retina |
| Démo Rayon X | `media/accueil/demos/rayon-x.webp` | 1200 × 630 | ratio |
| Démo AgoraPod | `media/accueil/demos/agorapod.webp` | 1200 × 675 | ok |
| Démo À fleur d'écorce | `media/accueil/demos/moulage.webp` | 1080 × 606 | un peu juste |

Tous les cadres sont en **16:9** (`.media-16x9`, `object-fit: cover`) :
un fichier dans un autre ratio est rogné par le navigateur, pas par vous.

## 2. La vidéo du hero

**Rôle** : dire « c'est de la 3D, et ça vit » sans un mot. Le titre, le
chapeau et le portrait sont posés PAR-DESSUS, à gauche.

**Où elle joue** : au bureau seulement (768 px et plus). Au téléphone, en
mouvement réduit ou en économie de données : le **poster seul** (la
première image). La première image doit donc être belle à elle seule.

### Tournage (source)

- **Ratio 16:9**, **2560 × 1440** idéalement (1920 × 1080 minimum),
  **60 i/s**, sans son.
- **Durée finale 12 à 20 s**, en **boucle sans couture** : la dernière
  image rejoint la première (même position de caméra), ou un fondu de
  1 s au montage.
- **3 ou 4 démos**, 3 à 5 s chacune (ex. STAND, Rayon X, À fleur
  d'écorce, AgoraPod) : une par usage si possible (convaincre, former,
  conserver).
- **Mouvements lents et continus** : orbite, travelling avant, lente
  montée. Jamais de coupe sèche, de flash ni de secousse (la page reste
  lisible par-dessus ; les personnes sensibles au mouvement ont le poster).
- **Aucune interface** : ni boutons, ni curseur, ni texte, ni logo client
  sans accord écrit.
- **Composition** : le sujet dans le **tiers droit**. La moitié gauche
  passe sous le titre et un voile sombre, elle doit rester calme
  (fond, sol, ciel).
- **Tons sombres** : fond proche du `#090b13` de la page, lumière sur le
  sujet. Une image claire rendrait le titre blanc illisible.

### Comment enregistrer

1. Ouvrir chaque démo en plein écran dans Chrome, fenêtre 2560 × 1440,
   sans `?debug=1`, interface masquée.
2. Enregistrer avec OBS (ou `Cmd + Maj + 5`) en 60 i/s, qualité max.
3. Monter les plans (fondus de 0,5 à 1 s), exporter un master ProRes ou
   H.264 haut débit.
4. Encoder avec le préréglage déjà prévu (720p, 1,2 Mb/s, WebM VP9 +
   MP4 + poster WebP) :

```bash
Needle5/scripts/encoder-video.sh master.mov --preset hero --sortie Fractal-Innov_Agency/media/accueil/hero/boucle.mp4
```

5. Me dire « la boucle est posée » : je passe `data-hero-video` à
   `/media/accueil/hero/boucle` et je vérifie le poids (cible : WebM
   sous 2 Mo).

## 3. Les aperçus des démos

**Rôle** : reconnaître la démo d'un coup d'œil et donner envie de
l'ouvrir. Ce sont des **captures 3D pures**, sans personne.

- **Format de sortie** : **1600 × 900** (16:9), WebP qualité 80,
  **cible 60 à 120 Ko** par image.
- **Source** : capture à 2560 × 1440 puis réduite (plus net qu'une
  capture directe en 1600).
- **Cadrage** : le sujet dans les **60 % centraux** ; au bureau, la démo
  mise en avant affiche l'image sur une moitié de carte et peut rogner
  les côtés.
- **Une famille** : même angle (trois-quarts, légèrement plongeant),
  même fond sombre neutre, même lumière d'un aperçu à l'autre. C'est ce
  qui fait « collection » plutôt que « captures d'écran ».
- **Aucune interface**, pas de texte incrusté (le titre est dans la
  carte).
- **Une image par démo** : `stand`, `midipile`, `rayon-x`, `agorapod`,
  `moulage` (même nom, même dossier : `media/accueil/demos/`).

## 4. Les visuels de l'offre

**Rôle** : montrer l'**usage**, pas l'objet. Aujourd'hui l'offre
réutilise les aperçus des démos : le visiteur voit deux fois la même
image. Proposition : l'offre montre **des gens en situation**, les démos
montrent **la 3D**.

| Usage | Scène à photographier | Fichier |
|---|---|---|
| Convaincre | un salon : une personne présente un produit sur une tablette ou une borne, un visiteur regarde | `media/accueil/offre-convaincre.webp` |
| Former | un opérateur ou un apprenant, téléphone ou tablette en main, devant (ou à la place de) la vraie machine | `media/accueil/offre-former.webp` |
| Conserver | un geste d'artisan, un atelier, un objet patrimonial, et l'écran qui le rejoue | `media/accueil/offre-conserver.webp` |

- **Format de sortie** : 1600 × 900 (16:9), WebP qualité 80, 80 à
  150 Ko.
- **Prise de vue** : source 3200 × 1800 minimum (tout téléphone récent en
  mode photo 16:9 convient), lumière naturelle ou douce, **écran
  lisible** (luminosité de l'écran à fond, pas de reflet : se placer de
  biais par rapport aux fenêtres, verrouiller l'exposition sur l'écran).
- **L'écran montre la démo** : c'est le lien entre l'offre et les démos.
- **Personnes** : de dos, de trois-quarts ou les mains seules évitent
  l'autorisation de droit à l'image. Visage reconnaissable : **autorisation
  écrite** avant publication.
- **Marques, logos, stands clients** : accord écrit, sinon flou ou hors
  champ.
- Ces trois fichiers sont nouveaux : je changerai les trois `src` de
  l'offre quand ils seront posés.

## 5. Conversion (pour tout visuel fixe)

```bash
cwebp -q 80 -resize 1600 900 capture.png -o media/accueil/demos/stand.webp
```

(`brew install webp` si `cwebp` manque.) Une capture qui n'est pas en
16:9 : la recadrer d'abord (Aperçu › Outils › Ajuster la taille, ou
recadrage 16:9 dans Photos), sinon `-resize` la déforme.

## 6. Ordre conseillé pour le tournage

1. **Les aperçus des démos** : tout se fait au bureau, en une séance.
2. **La vidéo du hero** : réutilise les mêmes scènes, mêmes réglages.
3. **Les photos de l'offre** : demandent un lieu et des gens, à caler
   quand l'occasion se présente (un salon, un atelier). En attendant,
   l'offre garde les aperçus des démos.
