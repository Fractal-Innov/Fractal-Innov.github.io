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

## 2. Une session, toutes les vidéos (décision du 29/09/2026)

Les **grands aperçus** jouent une boucle vidéo : le panneau actif de
l'offre et la démo en avant. Les **petits** (la bande des démos) restent
des images. Une seule session de tournage donne la vidéo du hero ET les
5 boucles des démos ; l'offre réutilise celles des démos (choix (c),
en attendant des images d'usage réel) :

| Aperçu de l'offre | Boucle reprise |
|---|---|
| Convaincre | `stand` |
| Former | `rayon-x` |
| Conserver | `moulage` |

### Tournage (le master)

- **Une session**, coupée ensuite plan par plan, en
  **16:9, 2560 × 1440** (1920 × 1080 minimum), **60 i/s** (le hero la
  garde fluide ; les aperçus sont ramenés à 30 i/s à l'encodage).
- **Par démo, un plan de 7 s utile** (le hero : 12 à 20 s, avec plusieurs
  démos) : mouvement **lent et continu** (orbite, travelling avant,
  montée), **fin = début** (même position de caméra) pour une boucle
  sans couture. Laisser 2 s de marge avant et après chaque plan.
- **Aucune interface** : ni boutons, ni curseur, ni texte.
- **Tons sombres**, fond proche du `#090b13` de la page, lumière sur le
  sujet.
- **Cadrage** :
  - aperçus : sujet dans les **60 % centraux** (la carte rogne les côtés,
    jusqu'au 5:2 au bureau) ;
  - hero : sujet dans le **tiers droit**, moitié gauche calme (le titre
    passe dessus).
- **Une famille** : même angle (trois-quarts, légèrement plongeant),
  même lumière d'une démo à l'autre.

Enregistrement : chaque démo en plein écran dans Chrome, sans
`?debug=1`, interface masquée ; OBS (ou `Cmd + Maj + 5`) en 60 i/s,
qualité max ; exporter le master en ProRes ou H.264 haut débit.

### Couper, puis encoder

Les plans se coupent à la main (un fichier par boucle, 7 s pour une
démo, 12 à 20 s pour le hero), nommés comme l'aperçu : `stand.mov`,
`midipile.mov`, `rayon-x.mov`, `agorapod.mov`, `moulage.mov`,
`hero.mov`. Puis, depuis la racine du site :

```bash
outils/encoder-boucles.sh ~/Captures/*.mov
```

Il produit :

| Sortie | Taille | Poids visé |
|---|---|---|
| `media/accueil/hero/boucle.{webm,mp4,webp}` | 1280 px, poster compris | WebM sous 2 Mo |
| `media/accueil/boucles/<nom>.{webm,mp4}` | 960 × 540, bureau | 0,7 à 1 Mo |
| `media/accueil/boucles/<nom>-mobile.{webm,mp4}` | 640 × 360, téléphone | 250 à 400 Ko |

Pas de poster pour les aperçus : c'est l'image de la démo (§ 3), déjà
en place.

### Essayer avant de brancher

Les fichiers posés, ouvrir `/?debug=1&boucle=prevues` : chaque aperçu
prend sa boucle prévue, le journal `[boucle]` de la console dit laquelle
joue. Me dire « les boucles sont posées » : je branche les attributs
(`data-boucle`) et la vidéo du hero, et je vérifie les poids.

### Ce que le site en fait (composants/boucle.js)

- rien n'est téléchargé à l'ouverture : la boucle n'est demandée qu'à
  l'approche de l'aperçu ;
- **une seule** boucle joue à la fois (le grand aperçu le plus visible) ;
- image seule si mouvement réduit, économie de données, réseau 2g, ou
  lecture refusée (iPhone en économie d'énergie) ;
- un bouton pause sur chaque boucle.

## 3. Les images des démos

**Rôle** : reconnaître la démo d'un coup d'œil (petites cartes) et servir
de poster à la boucle (grandes). Ce sont des **captures 3D pures**, sans
personne, et de préférence **la première image du plan de la boucle** :
le passage de l'image à la vidéo ne saute pas.

- **Format de sortie** : **1600 × 900** (16:9), WebP qualité 80,
  **cible 60 à 120 Ko** par image.
- **Source** : capture à 2560 × 1440 puis réduite (plus net qu'une
  capture directe en 1600).
- **Cadrage, famille, aucune interface** : comme les boucles (§ 2).
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

1. **La session des boucles** (§ 2) : hero et démos, au bureau, en une
   séance.
2. **Les images des démos** (§ 3) : la première image de chaque plan,
   dans la foulée.
3. **Les photos de l'offre** (§ 4) : demandent un lieu et des gens, à
   caler quand l'occasion se présente. En attendant, l'offre joue les
   boucles des démos.
