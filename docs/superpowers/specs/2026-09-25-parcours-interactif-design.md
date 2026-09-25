# Le parcours interactif de l'accueil : design

- **Date** : 25/09/2026
- **Statut** : à relire par Corentin, puis plan (`superpowers:writing-plans`)
- **Sous-projet** : 1 sur 4 (parcours, puis son, puis télécommande, puis SEO/GEO)
- **Page** : `index.html` de `Fractal-Innov.github.io` (branche de la PR #1, pas encore fusionnée)
- **Fiche de vente qui fait foi** : `VENTE.md` à la racine du dépôt, créée avec cette spec

---

## 1. L'intention

**Ce que Corentin a dit.**
La maquette est prête et les sections existent. Il faut un parcours interactif
qui traverse les sections comme un scénario, avec des CTA ludiques et des
retours qui soutiennent une narration fluide. La page est le **reflet d'une
expérience WebXR qui soutient en direct un discours commercial** : une
télécommande doit pouvoir la piloter, et les métadonnées doivent servir le
référencement. Le propos n'est pas un secteur mais **un besoin précis** que
rencontrent ses clients, et le parcours doit mener à **un atelier de cadrage**
qui adapte un socle applicatif existant à ce besoin. Trois scénarios partagent
la même matière : l'aide à la vente, l'apprentissage, la conservation des
savoir-faire. Sur téléphone, la surface d'écran est à préserver.

**Ce que j'en ai déduit, et qu'il a validé au fil des questions.**
- Les sections sont des **chapitres**, et un seul signal (« on est au
  chapitre N ») alimente le fil, le son et la télécommande.
- Le défilement reste la navigation (approche A). Le mode « diapositives »
  n'est envisagé qu'avec la télécommande, dans le sous-projet 3.
- La page se parcourt seule par défaut ; la télécommande, quand elle existera,
  en prendra la main.

**Ce qui fait le succès.**
Un prospect se reconnaît dans une situation dès le premier écran, voit la
preuve qui tourne pour son cas, et réserve les 30 min avec un CTA qui reprend
sa situation. Corentin peut envoyer un lien de relance qui ouvre la page déjà
réglée sur le cas du prospect.

---

## 2. Les décisions

| Sujet | Décision | Écartée, et pourquoi |
|---|---|---|
| Qui déroule | la page seule, ou Corentin avec la télécommande | le visiteur seul : ne sert plus le pitch en direct |
| Forme | un **fil** de chapitres + **un geste** par chapitre | des gestes sans fil : pas de scénario à piloter |
| Navigation | le **défilement** reste la navigation, le fil est une surcouche | des diapositives : détournent le défilement, pénibles sur téléphone |
| Axe | **un savoir, trois usages** : convaincre, former, garder | des secteurs (salon, formation, musée, fabrication) : le prospect se range dans une case au lieu de reconnaître son problème |
| Porte d'entrée | l'**atelier de cadrage**, l'appel de **30 min, gratuit** | payant ou sur devis : choix de Corentin |
| Prix | **aucun prix** sur l'accueil ; ceux de STAND sont à revoir | afficher 4 900 / 6 900 € HT : jugés irréalistes |
| Fil | un **dock en bas, centré**, reflet du dock de la borne | un rail sur le bord droit : enfreint la règle 7 de Needle5 (un contrôle vit dans la bande centrale) |
| Téléphone | le dock se **rétracte en pastille** ludique | un dock toujours déplié : mange l'écran |
| Mise en avant | **allumer** ce qui correspond, avec un badge | réordonner : fait sauter le contenu sous le doigt |

---

## 3. L'axe : un savoir, trois usages

> Votre savoir est mis en 3D une fois. Ensuite, il vend, il forme, il reste.

| id | Le bouton | La situation reconnue | La preuve qui tourne |
|---|---|---|---|
| `convaincre` | Convaincre un acheteur | « Ma machine ne tient pas sur un stand » | STAND, Midipile |
| `former` | Former un nouvel arrivant | « On apprend sur l'équipement en production » | Rayon X |
| `garder` | Garder le geste d'un expert | « Mon expert part, son savoir-faire aussi » | À fleur d'écorce |

Le village n'est rattaché à aucune situation : c'est la visite de tout le site.

Toutes les situations mènent au même endroit : **« Réserver 30 min »**, vers
le calendrier existant (`https://calendar.app.google/SDuiKb9ZBQ6BcbED6`).

---

## 4. Les chapitres

Les identifiants sont ceux des sections actuelles. Ils ne changent pas : ce
sont eux que la télécommande enverra comme `navItemId` (protocole commun avec
`valeo_sdv_demo` et le Salon).

| Rang | id | Titre court (dock) |
|---|---|---|
| 1 | `top` | Accueil |
| 2 | `fondateur` | Le fondateur |
| 3 | `approche` | L'approche |
| 4 | `offre` | Trois usages |
| 5 | `demos` | Ça tourne déjà |
| 6 | `partenaires` | Partenaires |
| 7 | `contact` | Contact |

Le chapitre courant est donné par le **scroll-spy existant** (la ligne de
lecture de `majLienActif`). Il n'y a pas de seconde source de vérité : le
dock, le son et la télécommande lisent le même résultat.

---

## 5. Les gestes, chapitre par chapitre

Chaque geste est jouable au clavier et fonctionne sans JavaScript dans une
forme dégradée (colonne « Sans JS »).

| Chapitre | Le geste | Ce que le visiteur comprend | Sans JS |
|---|---|---|---|
| Accueil | « Votre savoir doit d'abord : » et trois boutons de situation, plus « Juste regarder » | il se reconnaît dès le premier écran | chaque bouton est un lien vers la carte d'offre de sa situation (`#usage-former`…) |
| Le fondateur | trois repères s'allument sous le portrait, un par usage ; celui de la situation choisie d'abord | qui il aura en face, pour son cas | les trois repères sont visibles |
| L'approche | « Étape suivante » allume les trois temps l'un après l'autre ; l'étape 01 s'appelle « L'atelier de 30 min » | ce qui se passe après le clic | les trois temps sont visibles |
| Trois usages | trois cartes ; celle de la situation choisie s'allume et s'ouvre, les autres restent lisibles | l'offre répond à son cas | trois cartes ouvertes |
| Ça tourne déjà | les démos de sa situation s'allument avec un badge « Pour votre cas » | la preuve existe | toutes les démos, sans badge |
| Partenaires | les monogrammes se relient en constellation au survol ou au toucher | il n'est pas seul | les cartes telles qu'aujourd'hui |
| Contact | le titre et le CTA reprennent la situation (« Parlons de vos nouveaux arrivants », « Réserver 30 min ») | le rendez-vous commence personnalisé | la version neutre |

⚠️ **Aucun geste ne fait défiler la page tout seul**, sauf un clic explicite
sur un bouton de navigation (fil, bouton de situation du hero). Changer de
situation au milieu de la page change les mises en avant, jamais la position
de lecture.

---

## 6. Le texte (brouillon du rôle `commercial`, à valider)

Règles : jamais de tiret cadratin, pas de point final dans les titres, le CTA
dit ce qui se passe après. Ce qui n'est pas encore dans `VENTE.md` est marqué
**[à valider]** : c'est le devis qui paie une promesse.

### Hero
- Titre : **gardé tel quel** (« Transmettre les savoirs par l'expérience »),
  c'est l'accroche qui marche.
- Chapeau : « Votre savoir est mis en 3D une fois. Ensuite, il vend, il forme,
  il reste. Dans le navigateur, sans application. »
- Question : « Votre savoir doit d'abord : »
- Boutons : « Convaincre un acheteur » · « Former un nouvel arrivant » ·
  « Garder le geste d'un expert » · lien discret « Juste regarder »
- CTA primaire : « Réserver 30 min » (remplace « Prendre rendez-vous »)

### Le fondateur
Les tags de secteurs (Industrie, Formation, Art, Médiation scientifique)
deviennent trois repères d'usage :
- **Convaincre** : démonstrateurs pour les forces de vente (Greentech,
  Mobilité, Énergie)
- **Former** : parcours de formation sur équipement (Rayon X)
- **Garder** : le geste d'une artiste, rejouable (Mathilde Thiennot)

### L'approche
L'étape 01 garde son contenu et prend son nom réel :
- Surtitre : « 01 · L'atelier de 30 min »
- Titre : « Partir de votre situation »
- Texte : « Nous partons de votre besoin et du socle qui tourne déjà. Vos
  fichiers 3D, photos et vidéos sont regardés ensemble, et vous repartez en
  sachant par quel usage commencer. C'est gratuit. »

### Trois usages (remplace « L'agence », deux canaux)
- Titre : « Un savoir, trois usages »
- Chapeau : « Chaque usage part du même socle, qui tourne déjà dans cinq
  démonstrateurs. L'atelier de 30 min sert à choisir par lequel commencer. »

| Carte (`id`) | Titre | Texte | Preuve |
|---|---|---|---|
| `usage-convaincre` | Votre machine ne tient pas sur un stand ? Votre démo, si | Le produit en 3D sur une borne ou derrière un lien : chaque acheteur le découvre à son rythme, même sans connexion. Vos commerciaux gardent l'outil d'un salon à l'autre. | STAND, Midipile |
| `usage-former` | Vos nouveaux arrivants apprennent sur l'équipement en production ? | Ils le démontent, le parcourent et recommencent en 3D, sans arrêter la ligne ni prendre de risque. **[à valider : sur poste, tablette ou casque]** | Rayon X |
| `usage-garder` | Votre expert part, son savoir-faire aussi ? | Son geste est capturé, découpé en étapes et rejouable : ceux qui arrivent le revoient sous tous les angles, aussi souvent qu'il le faut. **[à valider : la captation fait-elle partie de l'offre]** | À fleur d'écorce |

Chaque carte finit par « Réserver 30 min ». La carte « Convaincre » garde en
plus le lien « Découvrir STAND ».

### Contact
- Titre neutre : « Un projet ou une idée en tête ? » (gardé)
- Variantes : « Parlons de votre prochain salon » · « Parlons de vos nouveaux
  arrivants » · « Parlons du geste de votre expert »
- Sous le CTA : « L'atelier de cadrage, gratuit : nous partons de votre
  situation et du socle existant. »

---

## 7. Le dock

### Contenu

```
╭───────────────────────────────────────────────────────╮
│  ‹   3 / 7 · L'approche   ›   │  Former ▾  │  🔈  📱  │
╰───────────────────────────────────────────────────────╯
```

- **Le fil** : précédent, position et titre court, suivant. Précédent est
  inactif au chapitre 1, suivant au chapitre 7.
- **La situation** : « Choisir » tant que rien n'est choisi, puis le verbe
  de la situation (« Former ») ; un menu de trois choix plus « Aucune ».
- **Deux emplacements réservés** : le son (sous-projet 2) et la télécommande
  (sous-projet 3). **Absents du DOM** tant que leur sous-projet n'est pas
  livré ; aucun bouton mort.
- Chaque pictogramme porte son libellé (règle 6 de Needle5 : la couleur ou
  l'icône ne portent jamais l'information seules).

### Quand il est là
- Invisible sur le hero (le hero porte déjà le choix), il apparaît quand le
  bas du hero passe sous la ligne de lecture.
- Il s'efface quand le pied de page entre à l'écran, pour ne pas couvrir le
  contact et les liens.

### Sur grand écran (≥ 768 px)
Déplié, centré, largeur au plus celle du contenu (1100 px), en pilule verre
de la charte (`--glass-bg`, `--glass-border`, flou comme `.masthead-bg`).

### Sur téléphone (< 768 px) : la pastille (rôle `affordance`)
Le dock est **rétracté par défaut** en une pastille de **56 px**, en bas au
centre, au-dessus de `env(safe-area-inset-bottom)`.

- **Ce qu'elle montre** : un anneau de progression (dégradé de marque en
  `conic-gradient`) qui se **remplit avec le défilement** de la page ; au
  centre, le numéro du chapitre, ou le pictogramme de la situation une fois
  choisie. L'anneau est une information, pas une décoration : il reste à
  jour même en mouvement réduit.
- **Les trois effets, un par intention, aucun en boucle** :
  1. **Première apparition** : entrée en ressort depuis le bas et **un seul
     reflet** qui traverse la pastille. Elle dit « je suis là ».
  2. **Changement de chapitre** : le chiffre bascule, un halo bref s'échappe
     de l'anneau. Elle dit « vous avancez ».
  3. **Invitation, une fois par visite** : si le visiteur a traversé deux
     chapitres sans l'ouvrir, un petit rebond. Elle dit « touchez-moi ».
  Pas de pulsation permanente : un appel qui ne s'arrête jamais devient du
  bruit, et fatigue en rendez-vous.
- **Au toucher** : elle se déplie en dock pleine largeur (moins la
  gouttière de 16 px), en 300 ms, depuis sa propre position. Elle se replie
  au défilement suivant, au bouton « Fermer », à `Échap`, ou après un choix
  de situation.
- **Accessibilité** : un `button` avec `aria-expanded` et `aria-controls`,
  libellé « Chapitre 3 sur 7, L'approche. Ouvrir le guide ».
- **Place prise** : 56 px de haut, soit ~7 % d'un écran de 812 px, contre
  64 px pleine largeur pour un dock toujours déplié. La page reçoit une marge
  basse égale, pour ne jamais masquer sa dernière ligne.

### Mouvement réduit
Pas de ressort, pas de reflet, pas de bascule, pas de rebond, pas de
constellation animée : les états finaux s'affichent directement. L'anneau et
le numéro restent à jour.

---

## 8. Le contrat (ce que les sous-projets 2 et 3 consomment)

Le parcours **émet** sur `document`, et ne sait pas qui écoute :

| Événement | `detail` | Quand |
|---|---|---|
| `fi:chapitre` | `{ id, rang, total }` | le chapitre courant change (scroll-spy) |
| `fi:situation` | `{ id }` (`'convaincre'`, `'former'`, `'garder'` ou `null`) | le visiteur choisit, change ou retire sa situation |
| `fi:geste` | `{ chapitre, geste, etape }` | un geste s'accomplit (une étape de l'approche s'allume, une carte s'ouvre) |

Il **écoute** :

| Événement | `detail` | Effet |
|---|---|---|
| `fi:aller` | `{ chapitre }` ou `{ pas: 1 \| -1 }` | défilement doux vers ce chapitre (instantané en mouvement réduit) |

La télécommande traduira `OPEN_MODAL { navItemId }` en `fi:aller { chapitre }`
et `PRESENTATION_NEXT_SLIDE` en `fi:aller { pas: 1 }` ; le son jouera sur
`fi:chapitre` et `fi:geste`. Aucun des deux ne touchera au code du parcours.

**L'état se lit aussi sur `<body>`**, comme sur `/stand/` :
`data-chapitre="approche"`, `data-situation="former"`. Le CSS s'en sert
(`body[data-situation="former"] #usage-former`), ce qui limite le JS.

**L'URL porte la situation** : `?situation=former` à l'arrivée présélectionne
le cas (lien de relance), et un choix la met à jour par
`history.replaceState`, sans nouvelle entrée d'historique. Une valeur
inconnue est ignorée et journalisée.

---

## 9. Les règles

- **SEO** : tout le texte des trois situations est dans le HTML au
  chargement ; aucun paragraphe n'est injecté par JavaScript. Les variantes
  de titre et de CTA du contact sont dans le balisage, masquées par
  attribut, jamais fabriquées.
- **Sans JavaScript**, la page se lit comme aujourd'hui, avec les trois
  cartes ouvertes ; le dock n'apparaît pas.
- **Charte de `/stand/`** : jetons, dégradé de marque, verre, rayons. Aucune
  nouvelle couleur.
- **Navbar** : la règle du 25/09/2026 tient toujours, une seule rangée.
- **Journal de debug** (`?debug=1`) : chaque module raconte le flux
  (« chapitre 3 → 4 », « situation : former, venue de l'URL »), muet sinon.
- **Poids** : moins de 15 Ko ajoutés au document (CSS + JS + balisage).
- **Un seul fichier** : tout reste dans `index.html`, comme le reste de la
  page.

---

## 10. Hors de ce sous-projet

- Le son (sous-projet 2), la télécommande et son mode présentation
  (sous-projet 3), la passe `veilleur` SEO/GEO (sous-projet 4).
- La nouvelle approche de prix de STAND, et la mise à jour de `/stand/` et
  de `stand/VENTE.md` qui en découlera.
- La version anglaise (la structure la permet : les textes sont dans le
  balisage, les identifiants ne sont pas traduits).
- La boucle vidéo du hero (tâche 7 du plan précédent).

---

## 11. Comment on saura que c'est fini

1. Arrivée par `/#demos` : le dock affiche « 5 / 7 · Ça tourne déjà » dès
   le premier affichage, pas « 1 / 7 ».
2. Un clic sur « Former un nouvel arrivant » dans le hero : `data-situation`
   vaut `former`, l'URL porte `?situation=former`, la carte `usage-former`
   est ouverte, Rayon X porte le badge, le contact dit « Parlons de vos
   nouveaux arrivants ».
3. Arrivée par `/?situation=garder` : même résultat pour `garder`, sans clic.
   `/?situation=xyz` : situation neutre, une ligne au journal.
4. À 375 px : la pastille fait 56 px, le dock est replié, débordement
   horizontal 0 px, la dernière ligne du pied de page reste visible.
5. Au clavier : fil, situation et gestes atteignables, focus visible,
   `Échap` referme le dock.
6. En mouvement réduit : aucun mouvement, états finaux, anneau à jour.
7. Sans JS : texte complet, les boutons du hero mènent aux cartes.
8. Un écouteur posé en console reçoit `fi:chapitre`, `fi:situation`,
   `fi:geste`, et `fi:aller { pas: 1 }` fait avancer d'un chapitre.
9. Poids ajouté sous 15 Ko ; aucun tiret cadratin dans le texte visible ;
   aucun point final dans les titres.

## 12. Ce qui risque de mordre

1. **Une arrivée par ancre profonde** laisse le dock sur le chapitre 1 si le
   scroll-spy n'a pas encore tourné : le dock se règle sur le même appel
   initial que la nav (test 1).
2. **Le clavier virtuel et la barre d'adresse mobiles** changent la hauteur
   utile : la pastille se cale sur `env(safe-area-inset-bottom)` et la
   hauteur dynamique, jamais sur `100vh`.
3. **Deux sources de vérité pour la situation** (l'URL et le clic) : l'URL
   n'est lue qu'une fois, à l'arrivée ; ensuite, c'est le clic qui écrit
   dans l'URL, jamais l'inverse.
4. **Le rebond d'invitation** qui revient à chaque passage deviendrait
   agaçant : une fois par visite, gardé en mémoire de page.
5. **Les textes [à valider]** ne partent pas en production tant que
   Corentin ne les a pas confirmés dans `VENTE.md`.
