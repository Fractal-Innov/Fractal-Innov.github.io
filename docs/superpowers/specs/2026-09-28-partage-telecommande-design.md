# Partager la page et la tendre en télécommande

- **Date** : 28/09/2026
- **Sous-projet** : 3 sur 4 (parcours, son, **télécommande**, SEO/GEO), réuni
  avec le partage « Emporter cette page » prévu au § 7 de
  `2026-09-27-galerie-affordance-son-design.md`.
- **Branche** : `feat/partage-telecommande`, depuis `main` après la
  fusion de la passe graphique (PR #4).
- **Référence** : le « Farfadet » de la landing du dépôt `stand` (servie à
  `www.fractal-innov.fr/stand/`) et le relais du Salon (`salon_demo_app`).

## 1. L'intention

Corentin présente le site sur son ordinateur à quelqu'un qui ne le connaît
pas encore, et lui **tend la télécommande** : la personne scanne un QR,
son téléphone pilote la page. Le même bouton sert à **partager** l'endroit
où l'on est (section et situation) avec d'autres.

Réussite : la personne qui reçoit le téléphone sait quoi toucher sans
explication ; l'écran lui répond en défilant ; Corentin voit d'un coup
d'œil qu'un téléphone est connecté.

## 2. Les décisions (questions du 28/09/2026)

| Sujet | Décision | Écartée |
|---|---|---|
| Branche | nouvelle branche depuis `main` | ajout à la passe graphique ; PR empilées |
| Porte d'entrée | bouton « Partager » dans la rangée du dock **et** « Emporter cette page » dans le Contact, même bandeau | bouton flottant de /stand/ (le dock occupe le bas) |
| Ce que partage « Cet endroit » | section en cours + situation choisie | section seule ; accueil nu |
| Transport | le relais du Salon en ligne (Scalingo), une salle par onglet, PIN envoyé d'office | relais dédié ; pair-à-pair WebRTC |
| Contenu de la télécommande | les six chapitres (rail numéroté) + les trois situations | précédent / suivant ; son |
| Retour côté écran | témoin sur le bouton + ligne dans le bandeau + son du geste | rien de visible |
| Page ouverte sur un téléphone | « Copier le lien » et « Envoyer » seuls, sans QR ni onglet Télécommande | même panneau qu'au bureau |
| Apparitions reprises de /stand/ | QR qui se déplie (250 ms), « Vous êtes ici » à point lumineux mis à jour en direct | rangement contre le bord (inutile dans le dock) |
| Libellé du bouton | « Partager » | « QR », « Emporter » |
| Commande de chapitre reçue | défilement doux vers la section | saut direct |
| Connexion d'un téléphone | le bandeau se referme seul, le témoin reste | bandeau laissé ouvert |
| Public de la télécommande | une personne qui découvre le site (souvent) | Corentin seul |
| Ménage | la copie Tailwind `stand/` du dépôt est retirée, commit `chore` à part | garder |

## 3. Ce qui a été vérifié avant d'écrire (28/09/2026)

- `www.fractal-innov.fr/stand/` est servi par le dépôt `Fractal-Innov/stand`
  (GitHub Pages, branche `master`) : le dossier `stand/` de ce dépôt-ci,
  14 Ko en Tailwind, est masqué. Le retirer ne change rien en ligne.
- Relais `wss://stand-demonstrateur.osc-fr1.scalingo.io/ws-remote`, essai
  réel depuis Node avec l'origine `https://www.fractal-innov.fr` :
  - connexion acceptée (le relais ne filtre pas l'origine) ;
  - PIN du bundle du Salon (`123456`, `config/pin.ts`) = PIN du serveur ;
  - `REMOTE_CMD` relayé à l'écran, `DISPLAY_STATE` relayé **tel quel** au
    téléphone (un champ ajouté, `situation`, passe) ;
  - **réveil à froid : 6,8 s** avant la première ouverture, puis ~30 ms
    par aller-retour.
- Le relais ne prévient PAS l'écran de l'arrivée ni du départ d'une
  télécommande : c'est au téléphone de se présenter (§ 6).
- Salle : `^[a-z0-9_-]{1,40}$`, sinon le relais la range dans `borne`
  (la borne physique du salon) : une salle invalide piloterait la borne.

## 4. L'architecture

```
composants/
  partage.js              le bandeau « partager » : onglets, QR, copier, envoyer
  telecommande-ecran.js   l'écran : salle, relais, commandes reçues, témoin
  vendor/qrcode.min.js    qrcode-generator 1.4.4 (MIT), chargé à la 1re ouverture
telecommande/
  index.html              la télécommande (téléphone), autonome
```

- **dock.js** gagne un cinquième état, `partage` (après `question`,
  `situation`, `sommaire`, `replie`) : un seul bandeau à la fois, Échap et
  clic dehors le ferment comme la situation et le sommaire. Son contenu
  est rempli par `partage.js`.
- **Événement d'entrée** : `fi:partager {mode: 'endroit' | 'telecommande'}`,
  émis par le bouton du dock (mode `endroit`) et par « Emporter cette
  page » (mode `endroit`). Même logique que `fi:aller`.
- **Aucune connexion** au relais tant que l'onglet Télécommande n'a pas été
  ouvert une fois : un visiteur ordinaire n'ouvre rien.

## 5. Le bandeau « Partager » (écran)

- **Bouton** dans la rangée, entre Son et Réserver : picto QR (celui de
  /stand/), libellé « Partager » au bureau, picto seul au téléphone, cible
  de 44 px minimum. ⚠️ La rangée passe de 7 à 8 cibles au téléphone : la
  garde vérifie qu'elle tient à 360 px sans débordement.
- **Onglets** (`role="tablist"`) : « Cet endroit » et « Télécommande ».
- **Cet endroit** :
  - lien `https://www.fractal-innov.fr/?situation=<id>#<chapitre>` (la
    situation seulement si choisie, le chapitre seulement hors `top`) ;
  - « Vous êtes ici : Démos, pour former » avec un point lumineux, mis à
    jour en direct sur `fi:chapitre` et `fi:situation` ;
  - QR (se déplie en 250 ms), lien affiché, « Copier le lien » (devient
    « Lien copié »), « Envoyer » (feuille de partage native, masqué sans
    `navigator.share`).
- **Télécommande** :
  - à la première ouverture, l'écran se connecte (§ 6) ; le QR pointe vers
    `https://www.fractal-innov.fr/telecommande/?salle=<salle>` ;
  - consigne : « Scannez avec le téléphone : il pilote cette page » ;
  - tant que le relais se réveille : « Préparation de la télécommande… »
    (le QR n'apparaît qu'une fois l'écran inscrit dans la salle) ;
  - relais injoignable après 20 s : « Télécommande indisponible pour le
    moment », et l'onglet « Cet endroit » reste utilisable.
- **Au téléphone** (`max-width: 767px`) : ni QR ni onglets ; le lien,
  « Copier le lien » et « Envoyer ».
- **Mouvement réduit** : le QR s'affiche directement.

## 6. La télécommande : le protocole

Le protocole du Salon, inchangé côté serveur :

| Sens | Message | Sens pour l'accueil |
|---|---|---|
| écran › relais | `REGISTER {role: 'display', salle}` | l'écran s'inscrit |
| tél. › relais | `REGISTER {role: 'remote', salle}` puis `AUTH {pin}` | le téléphone entre (PIN d'office) |
| tél. › écran | `REMOTE_CMD {cmd: {type: 'OPEN_MODAL', navItemId: '<chapitre>'}}` | `fi:aller {chapitre}`, défilement doux |
| tél. › écran | `REMOTE_CMD {cmd: {type: 'OPEN_MODAL', navItemId: 'situation:<id>'}}` | la situation est choisie par le chemin d'un clic de pilier (origine `telecommande`) |
| tél. › écran | `REMOTE_CMD {cmd: {type: 'BONJOUR'}}` à l'`AUTH_OK`, puis toutes les 20 s | présence : témoin allumé, bandeau refermé à la 1re |
| écran › tél. | `DISPLAY_STATE {state: {activeModalId: '<chapitre>', situation: '<id>' \| null}}` | à chaque `fi:chapitre`, `fi:situation` et en réponse à `BONJOUR` |

- **Salle** : 8 caractères `[a-z0-9]` tirés au hasard, gardés pour
  l'onglet (`sessionStorage`, clé `fi:salle`) : recharger la page garde le
  téléphone connecté.
- **Présence** : le témoin s'éteint 45 s après le dernier `BONJOUR`.
- **Reconnexion** : écran et téléphone se reconnectent seuls après une
  coupure (délai croissant, 1 s › 10 s).
- **Filtre** : l'écran n'accepte que les six chapitres connus et les trois
  situations ; tout autre `navItemId` est ignoré (et journalisé).

## 7. La page `/telecommande/` (téléphone)

- Autonome, légère, aux couleurs du site (`composants.css` pour les
  jetons) ; `noindex` ; aucun cookie.
- Pensée pour une personne qui **découvre** le site :
  - en tête, « Vous avez la main : touchez un chapitre, l'écran vous suit » ;
  - **les six chapitres** en tuiles numérotées 01 à 06, comme le rail du
    dock ; le chapitre en cours allumé (dégradé), d'après `DISPLAY_STATE` ;
  - **« Pour quoi faire ? »** : Convaincre, Former, Conserver, la
    situation en cours allumée.
- États : « Connexion à l'écran… » (réveil du relais), « Connecté »,
  « L'écran s'est fermé : scannez à nouveau le QR » (aucun état reçu depuis
  45 s), « Lien incomplet : scannez le QR affiché sur l'écran » (sans
  `salle` valide ; jamais de repli sur la salle `borne`).
- Retour tactile : `navigator.vibrate(10)` au toucher quand il existe.

## 8. Retour côté écran

- Témoin : un point vert sur le bouton Partager (`data-telecommande`
  sur le dock), et dans le bandeau « Un téléphone pilote cette page ».
- À la première présence, le bandeau se referme seul (état `replie`).
- Chaque commande reçue émet `fi:geste {chapitre, geste: 'telecommande'}` :
  le son répond (défaut `choix`).

## 9. Mesure, journal, garde

- Umami : `partage-ouvert {mode}` (prévu par la spec de la galerie) et
  `telecommande-connectee` (une fois par salle).
- Journaux `?debug=1` (clé `fi:debug`), préfixes `[partage]` et
  `[telecommande]`, qui racontent le déroulé (connexion, salle, commande
  reçue et traduite, présence, reconnexion) ; la page `/telecommande/`
  a le même interrupteur.
- Garde du dock (`FiDock.verifier()`) : bouton Partager sous 44 px ;
  rangée qui déborde ; connexion ouverte alors que l'onglet Télécommande
  n'a jamais été ouvert.

## 10. Accessibilité et wording

- Bandeau : `role="dialog"`, titre « Partager cette page » ; onglets au
  clavier (flèches) ; « Lien copié » annoncé (`aria-live="polite"`).
- Le QR a une alternative texte : le lien affiché.
- Aucun tiret cadratin dans les textes visibles.

## 11. Hors périmètre

- Toute modification du relais du Salon ou de ses pages.
- Précédent / suivant et son sur la télécommande (non retenus).
- Le mode présentation (déroulé automatique piloté).
- La passe SEO/GEO (sous-projet 4).

## 12. Risques

- **Dépendance au Salon** : si l'app Scalingo est arrêtée ou change de
  protocole, la télécommande de l'accueil tombe ; le partage « Cet
  endroit » ne dépend de rien. Le message d'indisponibilité le dit.
- **PIN visible** dans le code de fractal-innov.fr : il l'est déjà dans le
  bundle du Salon, qui le déclare non secret. Une salle aléatoire par
  onglet reste la vraie barrière entre deux visiteurs.
- **Rangée du dock à 8 cibles** au téléphone : à mesurer à 360 px.

## 13. Bilan (28/09/2026)

### Décisions prises en boucle 🎨

| Point | Choix |
|---|---|
| Bouton Partager | libellé + picto QR dans la rangée (bureau), ligne « Partager » dans le sommaire (téléphone) ; témoin = point vert |
| Bandeau | QR 148 px à gauche, texte à droite ; barre d'onglets masquée quand il ne reste qu'un onglet (téléphone) |
| Télécommande (téléphone) | rail numéroté 01 à 06 + « Pour quoi faire ? » ; phrase d'accueil gardée |
| Ligne d'aide à 360 × 740 | laissée telle quelle : elle passe 15 px sous le pli, toutes les commandes restent visibles (fin à 689 px) |

### Écart corrigé en route

- **« Indisponible » jamais atteint** : le compte à rebours de 20 s était
  relancé à chaque essai de reconnexion (1, 2, 4, 8, 10 s), toujours plus
  rapprochés que 20 s. Il part désormais une fois par épisode et ne
  s'annule qu'à l'inscription réussie (`telecommande-ecran.js`,
  `connecter()`).

### Mesures

- Relais : réveil à froid 6,8 s, puis ~30 ms par aller-retour.
- Garde `FiDock.verifier()` muette à 1440, 1280, 1024, 375 et 360 ;
  bouton Partager 124 × 48 au bureau, ligne du sommaire 310 × 44 au
  téléphone ; aucun défilement horizontal ; aucune erreur console.
- Onglet neuf : aucune connexion au relais, même après ouverture de
  « Cet endroit », tant que l'onglet Télécommande n'a pas été ouvert.
- Présence : témoin éteint ~45 s après le dernier `BONJOUR` ; téléphone
  en « L'écran s'est fermé » ~45 s après la fermeture de l'écran ;
  rechargement de l'écran : salle gardée, pas de nouveau scan.
- Liens invalides (`borne`, majuscules, sans salle) : « Lien incomplet »,
  aucune connexion.

### Reste à faire

- Parcours complet sur de vrais appareils (ordinateur + téléphone), en
  production après fusion.
- Hors périmètre, relevé en passant : à 360 × 740 avec une situation
  choisie, le bouton « Voir la page » de la démo mise en avant passe
  8 px sous le dock.
