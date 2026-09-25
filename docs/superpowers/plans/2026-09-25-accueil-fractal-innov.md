# Refonte de la page d'accueil de fractal-innov.fr

> **Pour l'exécutant :** ce plan est écrit pour être suivi tâche par tâche.
> Les cases `- [ ]` servent au suivi. ⚠️ **Aucune commande `git` n'est exécutée
> par l'assistant** : chaque bloc `bash` est tapé par Corentin.

**But :** remplacer la page d'accueil de `www.fractal-innov.fr` (aujourd'hui le
village 3D Needle) par la page statique du handoff, enrichie des preuves qui
manquaient à la maquette, sans perdre une seule des pages déjà indexées.

**Architecture :** un `index.html` unique dans `Fractal-Innov/Fractal-Innov.github.io`
(CSS dans `<style>`, JS vanilla en bas, polices auto-hébergées), sur le modèle
exact de `/stand/`. Le village 3D descend dans son propre dépôt et devient un
démonstrateur parmi les autres. Le contenu rédactionnel vit dans un objet de
données JS en haut du script, pour que l'anglais s'ajoute plus tard sans
rouvrir le balisage.

**Pile :** HTML/CSS/JS sans dépendance, GitHub Pages, `scripts/encoder-video.sh`
(dépôt Needle5) pour la boucle du hero.

**Sources :**
- Maquette : `~/Downloads/design_handoff_accueil_fractal_innov/` (README = la
  spécification, valeurs de design définitives)
- Références de code : `stand/index.html` (classes `.masthead`, `.hero-cta__btn`,
  `.reveal`, `.page-rest`)
- Catalogue des démos : `Needle5/Needle/fractal-innov/src/hub/demos.ts`
- Captures : `stand/assets/demo/*.webp`

---

## Contraintes globales

- **Jamais de tiret cadratin** dans un texte vu par un prospect. Remplacer par
  « : », « . », « , » ou des parenthèses.
- **Pas de point final** dans les titres (H1, H2, H3, H4).
- **Conventional Commits 1.0.0** pour chaque message.
- **Branche + PR systématique**, `main` reste propre.
- Aucun prix affiché sur cette page (décision de la session : l'ancrage
  4 900 € reste sur `/pilote-15-jours/` et `/stand/`).
- Polices auto-hébergées, **aucun appel à Google Fonts** (RGPD).
- Cible tactile ≥ 44 px, focus visible `outline: 2px solid #a8c8ff`.
- `prefers-reduced-motion: reduce` coupe halos, radar, halo de page, apparitions
  et la lecture de la vidéo du hero.

## ⚠️ Consigne du 25/09/2026 : la charte de /stand/ fait foi

Relevé en cours de route : la page reprenait les valeurs du handoff là où
`stand/index.html` en a d'autres, et les deux pages du domaine se mettaient à
diverger. **Nouvelle règle, appliquée rétroactivement à la tâche 2** : quand une
valeur existe dans `/stand/`, c'est elle qui gagne. Même discipline que le socle
partagé des projets Needle, une seule source pour le vocabulaire visuel.

Conséquence concrète : les **noms** de variables et de classes sont ceux de
`/stand/` (`--bg-base`, `--text-muted`, `--glass-bg`, `--brand-gradient`,
`.section`, `.section-number`, `.reveal`, `.page-rest`, `.burger`). Un bloc
copié d'une page à l'autre fonctionne sans traduction.

⚠️ **Deuxième relevé, le 25/09/2026 : la feuille de /stand/ se surcharge
elle-même plus bas.** Lire la première définition d'une règle donne une valeur
PÉRIMÉE. Deux éléments avaient été repris sur leur version obsolète, et sont
refaits sur l'état final :

- **le CTA de la navigation** n'est pas un bouton fantôme bleu mais un bouton
  **plein en dégradé profond** (`--accent-blue-deep` → `--accent-purple-deep`),
  qui révèle un second dégradé plus clair au survol via un `::before` ;
- **le menu mobile** n'est pas un panneau déroulant sous la pilule mais un
  **plein écran qui glisse depuis la droite** (`right: -100%` → `0`, fond
  `rgba(10,11,20,.88)` flouté à 22px, `visibility` en `step-end`), et le CTA
  « Contact » **entre dedans**. C'est la MÊME balise `nav` dans les deux cas :
  au-delà de 951px elle passe en `display: contents` et ses deux enfants
  deviennent les colonnes 2 et 3 de la grille de la pilule.

S'y ajoute la famille complète des boutons, à **quatre** variantes et non deux :
`.hero-cta__btn` (fantôme bleu), `--primary` (plein, dégradé, `-2px` au survol,
`scale(0.98)` au clic), `--secondary` (bleu sourd plein) et `--ghost`.
Le handoff appelait « principal » le fantôme : c'est `--primary` qui l'est.

Les écarts tranchés en faveur de `/stand/` :

| | handoff | /stand/, retenu |
|---|---|---|
| largeur de contenu | 75rem (1200px) | **1100px** |
| titre de section | clamp jusqu'à 3rem, graisse 700 | **2.2rem, graisse 600, `-.01em`** |
| sur-titre | .75rem / 700 / .12em | **.8rem / 600 / .2em, capitales** |
| rayon de carte | 1.25rem | **16px** |
| survol de carte | `translateY(-2px)`, bord bleu | **`translateY(-5px)`, bord blanc à 20 %** |
| étiquettes | bord bleu à 40 % | **valeurs de `.level-tag`, bord blanc à 8 %** |

Trois variables seulement n'existent pas dans `/stand/` et sont propres à cette
page : `--text-soft` (le « 70 % » du handoff, pour le chapeau du hero et les
paragraphes longs, `/stand/` n'ayant que le 55 %), `--radius-burger` et
`--radius-pill-nav` (le rayon de la pilule DÉCOULE du burger, deux courbes
parallèles).

## Décisions prises avec Corentin le 25/09/2026

| question | réponse |
|---|---|
| périmètre | refonte complète du site, **par étapes**, l'accueil d'abord |
| implantation | `index.html` statique dans `Fractal-Innov.github.io` |
| ajouts à la maquette | section « Ce qui tourne déjà » + liens vers les pages existantes en pied |
| langues | FR d'abord, **structure prête** pour l'EN |
| village 3D | publié en `/village/`, devient une carte de la section démos |
| logos partenaires | monogrammes générés en attendant les vrais |
| carte « En ligne » | branchée sur Midipile et Rayon X, « Bientôt » disparaît |
| hero | halos CSS **plus** une boucle vidéo discrète (webm + mp4 + poster) |

## Points de vigilance (ce que la maquette ne couvre pas et qui mordra)

1. **La racine est servie par un dépôt qui contient déjà la build Needle.**
   Écraser `index.html` sans déplacer `needle-app.js`, `assets/`, `js/` et
   `charte.css` laisse 11 Mo de fichiers morts servis au public.
2. **`/stand/` est servi par le dépôt `stand`, pas par ce dépôt**, bien qu'un
   dossier `stand/` existe aussi ici. Ne pas y toucher, et vérifier après
   bascule que `/stand/` répond toujours la landing et non la page générée.
3. **Le sitemap et `robots.txt` vivent à la racine du dépôt** : une page
   ajoutée ou déplacée sans mise à jour du sitemap n'est pas indexée.
4. **La vidéo du hero n'existe pas encore.** La page doit être correcte avec le
   seul poster : `<video>` avec `poster`, aucune hauteur qui saute.
5. **Le carrousel de démos lit `demos.ts` côté Needle.** Ici c'est une copie
   figée en JS : toute démo ajoutée devra l'être aux deux endroits tant que la
   refonte n'a pas absorbé le village.

---

## Structure des fichiers

Dans `Fractal-Innov.github.io/` :

```
index.html                    la nouvelle accueil (créé : tout y est, CSS et JS inclus)
apercu/index.html             copie de travail, validée avant de prendre la racine (temporaire)
media/                        ⚠️ DOSSIER NEUF, séparé de `assets/`
  polices/                    outfit 400 · 700, jetbrains-mono 400, et les deux licences
  marque/                     fractalinnov-logo.webp (le wordmark), fi-logo-252.webp
  accueil/
    portrait.webp             portrait du fondateur (depuis stand/assets/cta-photo.webp)
    hero-loop.webm/.mp4/.webp la boucle du hero et son poster
    demos/*.webp              une capture par démonstrateur
    og-accueil.jpg            1200 × 630, aperçu de partage
sitemap.xml · robots.txt      mis à jour
```

⚠️ **Pourquoi `media/` et non `assets/`, contrairement au premier jet du plan.**
`assets/` contient déjà les 13 Mo de la build Needle, aux noms hachés. Y glisser
les fichiers du nouveau site obligerait, à la tâche 9, à trier fichier par
fichier ce qui part au village et ce qui reste. Un dossier neuf rend la tâche 9
brutale et sûre : **tout `assets/` s'en va, `media/` reste**.

---

## Tâche 1 : préparer le terrain

**Fichiers :** aucun code. Clone et branche.

- [ ] **1.1** Cloner le dépôt racine

```bash
git clone https://github.com/Fractal-Innov/Fractal-Innov.github.io.git /Users/coko/Documents/GitHub/Fractal-Innov.github.io
```

- [ ] **1.2** Créer la branche de travail

```bash
git -C /Users/coko/Documents/GitHub/Fractal-Innov.github.io switch -c feat/accueil-theme-sombre
```

Modèle mental : `switch -c` crée la branche **et** s'y place. `main` continue de
servir le site en production pendant tout le chantier ; rien de ce qui suit
n'est visible du public avant la fusion.

- [ ] **1.3** Relever l'état de départ (l'assistant le fait, lecture seule) :
  inventaire des fichiers de la build Needle à déplacer en tâche 9.

---

## Tâche 2 : le socle de la page (head, jetons, nav, hero)

**Fichiers :**
- Créer : `apercu/index.html`
- Créer : `assets/fonts/` (4 fichiers + licences)

- [x] **2.1** Polices copiées depuis le handoff, JetBrains Mono 400 (sous-ensemble
      latin, 21 Ko) récupérée et sa licence OFL 1.1 avec elle. ⚠️ La marque est le
      **wordmark** `fractalinnov-logo.webp` (770 × 142) et non le logo carré plus
      un libellé : c'est ce que demande le handoff, et c'est ce que porte /stand/.
- [x] **2.2** Écrire le `<head>` : titre, description, `canonical`
      `https://www.fractal-innov.fr/`, `theme-color #090b13`, Open Graph et
      Twitter en **URL absolues**, favicon et `site.webmanifest` existants.
- [x] **2.3** Poser les jetons du thème sombre en `:root` (valeurs exactes du
      README : fonds, texte, action, surfaces, bords, rayons, ombres) et les
      `@font-face` en `font-display: swap`.
- [x] **2.4** Nav `.masthead` : pilule en verre, marque, 4 liens, CTA Contact,
      burger ≤ 950 px. Reprendre le CSS de `stand/index.html`, adapter les liens.
- [x] **2.5** Hero : halos, pastille radar, H1 avec dégradé de marque sur la
      seconde ligne, chapeau, deux CTA, bloc identité.
- [x] **Vérification** (relevée, pas déduite) : à 375 px et à 1440 px, débordement
      horizontal **0 px** ; Outfit 400 et 700 chargées ; **aucune erreur console** ;
      le burger passe bien en croix (`aria-expanded="true"`, rotations ±45°, barre
      médiane à `opacity: 0`) ; Échap ferme le menu **et rend le focus au burger**.
- [ ] **2.6** Commit

```bash
git -C /Users/coko/Documents/GitHub/Fractal-Innov.github.io add apercu/index.html assets/fonts && git -C /Users/coko/Documents/GitHub/Fractal-Innov.github.io commit -m "feat(accueil): poser le socle, la navigation et le hero du theme sombre"
```

---

## Tâche 3 : sections Fondateur et Approche

**Fichiers :** Modifier `apercu/index.html`

- [x] **3.1** Portrait copié en `media/accueil/portrait.webp`.
- [x] **3.2** Section `#fondateur` : grille auto-fit, portrait 4:5 avec liseré
      dégradé, barre de verre et pastilles d'usage (Industrie, Formation, Art,
      Médiation scientifique), eyebrow, H2, rôle, ligne mono, bio avec secteurs
      en gras, tuiles de compétences, carte « Ma boussole ».
- [x] **3.3** Section `#approche` : 3 cartes 01/02/03, numéro en mono avec le
      dégradé de marque, titre, texte, pilules de points clés. Contenu repris
      **mot pour mot** de la maquette (`etapes` dans le script du handoff).
- [x] **Vérification** (relevée) : débordement horizontal **0 px** à 375 px et à
      1280 px ; **aucune erreur console** ; les **15** éléments `.reveal` passent
      bien à `.active` ; toutes les requêtes en **200**, poids total ≈ **156 Ko**
      (47 Ko de HTML, 49 Ko de polices, 60 Ko d'images).
- [ ] **3.4** Commit `feat(accueil): ajouter les sections fondateur et approche`

---

## Tâche 4 : section Offre, carte « En ligne » branchée sur les démos

**Fichiers :** Modifier `apercu/index.html`, créer `assets/accueil/demos/`

- [x] **4.1** Visuels en place. STAND : `vue-ensemble.webp` copié. En ligne :
      **le poster du démonstrateur lui-même** plutôt qu'une capture refaite à la
      main. Chaque démo publie le sien en `og:image`, ils sont déjà cadrés en
      16:9 et pèsent 5 à 18 Ko. Les trois sont descendus d'un coup dans
      `media/accueil/demos/` (midipile, moulage, rayon-x), ce qui sert aussi la
      tâche 5. Rayon X était en PNG de 114 Ko : converti en webp, **17,6 Ko**.
- [x] **4.2** Écrire les deux cartes, média 16:9 en tête, corps, boutons en pied.
- [x] **4.3** Carte STAND : « Découvrir STAND » vers `/stand/`.
- [x] **4.4** Carte En ligne : le bouton « Bientôt » à bord pointillé est
      **remplacé** par « Voir un exemple » vers `/midipile/`, le secondaire
      reste « Prendre rendez-vous ». Le texte perd toute promesse au futur.
- [x] **Vérification** (relevée) : menu plein écran conforme (`position: fixed`,
      `right` **-773px → 0px**, `visibility` hidden → visible, `overflow: hidden`
      sur le corps, flou **22px**, CTA bien À L'INTÉRIEUR de la nav) ; Échap
      referme et **rend le défilement** ; en grand écran `display: contents` et
      grille **3 colonnes** ; CTA en dégradé `rgb(40,89,255)` → `rgb(124,58,237)`,
      libellé blanc ; les 2 cartes d'offre s'affichent et se révèlent ;
      débordement **0 px** à 375 px comme à 1280 px ; **aucune erreur console**.
- [ ] **4.5** Commit `feat(accueil): ajouter la section offre et brancher la carte en ligne sur midipile`

---

## Tâche 5 : section « Ce qui tourne déjà » (l'ajout principal)

**Fichiers :** Modifier `apercu/index.html`, alimenter `assets/accueil/demos/`

C'est la brique qui manquait à la maquette : la preuve avant l'argument. Elle
se place **entre Offre et Partenaires**, avec son ancre `#demos` et un cinquième
lien dans la nav.

- [ ] **5.1** Reprendre les textes depuis `src/hub/demos.ts` (français), en
      gardant la structure `{ id, titre, accroche, points, url }` dans l'objet
      de données JS, prête pour la colonne anglaise.

| id | titre | adresse |
|---|---|---|
| `stand` | STAND, le produit sur le stand sans le transporter | `/stand/` |
| `rayon-x` | Rayon X, la formation à l'échangeur thermique | `/rayon-x/` |
| `midipile` | Midipile, le démonstrateur produit | `/midipile/` |
| `moulage` | À fleur d'écorce, une performance de Mathilde Thiennot | `/moulage-mathilde-thiennot/` |
| `village` | Le village, le site comme expérience 3D | `/village/` (tâche 9) |

- [ ] **5.2** Capturer une image par démo (1600 px de large, webp) avec le
      navigateur intégré, sauf STAND qui réutilise `vue-ensemble.webp`.
- [ ] **5.3** Grille de cartes : visuel 16:9, titre coupé sur la virgule (nom en
      titre, suite en sous-texte, règle de `demos.ts`), accroche, 3 points,
      lien « Ouvrir la démo » avec `target="_blank" rel="noopener"`.
- [ ] **5.4** Ajouter `Démos` aux liens de nav et à l'IntersectionObserver de la
      tâche 8.
- [ ] **Vérification** : les cinq adresses répondent 200 ; la carte `village`
      reste masquée tant que la tâche 9 n'est pas faite (attribut `hidden`).
- [ ] **5.5** Commit `feat(accueil): ajouter la section des demonstrateurs en ligne`

---

## Tâche 6 : Partenaires, Contact, pied de page avec les pages existantes

**Fichiers :** Modifier `apercu/index.html`

- [ ] **6.1** Partenaires : 4 cartes, emplacement logo 88 × 88 rempli par un
      **monogramme** (initiale en Outfit 700 sur le dégradé de marque, rayon
      18 px, généré en CSS, aucun fichier image). Un commentaire dans le code
      dit où glisser le vrai logo.
- [ ] **6.2** Contact : carte de verre centrée sur halo violet, avatar 56 px,
      H2, texte, CTA « Prendre rendez-vous » vers le lien Google Calendar, puis
      les 4 liens secondaires (carte de visite, e-mail, LinkedIn, Instagram).
- [ ] **6.3** Pied de page **enrichi** : marque, baseline, e-mail, et une
      rangée de liens vers les pages déjà indexées, qui sauve leur
      référencement en attendant leur refonte :
      `/webxr-dans-le-navigateur/`, `/art/`, `/configure/`, `/learn/`,
      `/pilote-15-jours/`, `/methode-et-contact/`, `/stand/`.
- [ ] **Vérification** : chaque lien du pied répond 200 ; contraste des liens
      secondaires au moins 4.5:1 sur le fond `#0f1220`.
- [ ] **6.4** Commit `feat(accueil): ajouter partenaires, contact et les liens vers les pages existantes`

---

## Tâche 7 : la boucle vidéo du hero

**Fichiers :** Créer `assets/accueil/hero-loop.webm`, `.mp4`, `hero-loop.webp` ;
modifier `apercu/index.html`

- [ ] **7.1** Capturer 10 à 15 s du village 3D ou d'un démonstrateur (OBS,
      1080p, curseur masqué), déposer le fichier source.
- [ ] **7.2** Encoder avec l'outil existant du dépôt Needle5 :

```bash
/Users/coko/Documents/GitHub/Needle5/scripts/encoder-video.sh <source> --preset hero
```

  Le préréglage `hero` produit le mp4 720p sans son, le WebM VP9 et le poster
  WebP de la première image.

- [ ] **7.3** Intégrer : `<video muted loop playsinline preload="none"
      poster="…">` avec les deux sources (webm d'abord), en calque derrière les
      halos, opacité basse, `object-fit: cover`.
- [ ] **7.4** Ne lancer la lecture **que** si la vidéo est visible
      (IntersectionObserver), et jamais si `prefers-reduced-motion: reduce` ou
      `navigator.connection.saveData`. Même logique que `/stand/`.
- [ ] **Vérification** : sur un réseau bridé, la page reste lisible avec le seul
      poster ; aucun saut de hauteur au chargement.
- [ ] **7.5** Commit `feat(accueil): ajouter la boucle video du hero`

---

## Tâche 8 : les interactions

> ⚠️ **8.2 a été livrée en avance, à la tâche 3.** `.reveal` masque ses
> éléments en CSS : les poser sans l'observateur qui les rallume aurait rendu
> invisible la moitié de la page. Les deux vont ensemble, ils ont été écrits
> ensemble. Le garde-fou qui va avec : le masquage est conditionné à une classe
> `js` posée par un script en tête de `<head>`, donc **sans JavaScript rien
> n'est masqué**.

**Fichiers :** Modifier `apercu/index.html` (bloc `<script>` final)

- [ ] **8.1** Scroll-spy : IntersectionObserver sur `#fondateur, #approche,
      #offre, #demos, #partenaires`, `rootMargin: -45% 0px -50% 0px`, qui pose
      le soulignement bleu 2 px sur le lien actif.
- [ ] **8.2** Apparition au défilement : `[data-revele]` sous le pli part de
      `opacity:0; translateY(24px)`, arrive en 0.8 s `cubic-bezier(.16,1,.3,1)`,
      0.1 s de décalage par frère. **Ce qui est déjà visible n'est jamais masqué.**
- [ ] **8.3** Aura du pointeur : calque fixe, `--ui-x/--ui-y` mis à jour au
      `pointermove` passif, `pointer-events: none`.
- [ ] **8.4** Burger ≤ 950 px : trois barres qui deviennent une croix, panneau
      déroulant, fermeture au clic sur un lien et à l'échappement.
- [ ] **8.5** Halo de page `.page-rest::before`, statique ≤ 1024 px.
- [ ] **Vérification** : au clavier seul, parcourir toute la page ; le menu
      burger s'ouvre et se ferme ; `prefers-reduced-motion` coupe tout le
      mouvement sans casser la mise en page.
- [ ] **8.6** Commit `feat(accueil): ajouter le scroll-spy, les apparitions et le menu mobile`

---

## Tâche 9 : la bascule

C'est l'étape irréversible côté public. Elle ne se fait qu'après validation
visuelle de `/apercu/` sur téléphone et sur écran.

- [ ] **9.1** Créer le dépôt du village et y pousser la build actuelle

```bash
gh repo create Fractal-Innov/village --public --description "Le village 3D de Fractal Innov, ancienne page d'accueil, publie comme demonstrateur"
```

- [ ] **9.2** Y déplacer `index.html` (l'actuel), `needle-app.js`,
      `needle.buildinfo.json`, `charte.css`, `assets/`, `js/`, `include/`,
      `arret/`, `produits/`, `cas-d-usage/`, `niveaux-et-modules/`,
      `contenu.json`, `apercu-social-1200x630.webp`. Activer Pages sur `main`.
- [ ] **9.3** Vérifier `https://www.fractal-innov.fr/village/` en 200 **avant**
      de retirer quoi que ce soit de la racine.
- [ ] **9.4** Promouvoir la page : `apercu/index.html` devient `index.html`,
      le dossier `apercu/` disparaît, la carte `village` perd son `hidden`.
- [ ] **9.5** Mettre à jour `sitemap.xml` (ajouter `/village/`, garder les
      pages existantes) et `robots.txt`.
- [ ] **9.6** Produire `assets/accueil/og-accueil.jpg` (1200 × 630) et pointer
      les balises Open Graph dessus.
- [ ] **9.7** Commit puis pousser la branche et ouvrir la PR

```bash
git -C /Users/coko/Documents/GitHub/Fractal-Innov.github.io push -u origin feat/accueil-theme-sombre
```

```bash
gh pr create --repo Fractal-Innov/Fractal-Innov.github.io --title "feat(accueil): refondre la page d'accueil en theme sombre" --body-file .github/pr-accueil.md
```

---

## Tâche 10 : vérification finale

- [ ] **10.1** Les 11 adresses du sitemap répondent 200, plus `/village/`.
- [ ] **10.2** `/stand/` sert toujours la landing du dépôt `stand`, pas la page
      générée (contrôler le titre de la page).
- [ ] **10.3** Rendu à 375 px, 768 px, 1440 px : aucun débordement horizontal.
- [ ] **10.4** Parcours au clavier complet, focus visible partout.
- [ ] **10.5** `prefers-reduced-motion: reduce` : plus aucun mouvement.
- [ ] **10.6** Poids de la page hors vidéo sous 400 Ko.
- [ ] **10.7** Aperçu de partage correct (OG absolu, image 1200 × 630).

---

## Ce que ce plan ne fait pas, volontairement

- **Le configurateur et la capsule** ne sont pas portés. Ils restent sur
  `/configure/` et dans le village. À rouvrir quand la refonte atteindra les
  pages de l'offre.
- **L'anglais** n'est pas rédigé : la structure l'accueille, le contenu viendra.
- **Les pages internes** gardent leur thème actuel. Leur refonte est la boucle
  suivante, une fois l'accueil validée en production.
