# Galerie de composants, passe d'affordance et intonations sonores : design

- **Date** : 27/09/2026
- **Sous-projet** : 2 sur 4 du parcours (le son), élargi à la passe
  d'affordance de l'accueil et à une galerie de composants réutilisable
- **Précédent** : `2026-09-25-parcours-interactif-design.md` (le contrat
  d'événements `fi:*`, le dock, la mesure Umami)
- **Statut** : validé en conversation, à relire avant le plan

## 1. L'intention

Ce que Corentin a demandé :

- chaque section de l'accueil dit en une seconde ce qu'on peut y faire
  (affordance), en reprenant les structures de la landing STAND ;
- ces structures, adaptées et complétées, forment une **galerie
  réutilisable** comme template pour les sites et expériences à venir ;
- des **effets visuels un peu juicy** répondent aux gestes ;
- un **son discret** accompagne le parcours, par un système d'intonations.

La réussite : un visiteur comprend où cliquer sans lire, chaque geste
reçoit une réponse franche et courte, le son (s'il l'allume) lui fait
entendre qu'il avance, et un futur site copie un dossier pour avoir tout
cela.

## 2. Les décisions

| Sujet | Décision | Écartée |
|---|---|---|
| Source des structures | la landing du dépôt `stand` (323 Ko : `tour`, `wiring`, `timeline`, `hero-pillar`, `friction-card`, `kit-card`, `share`…) | la page `/stand/` de fi.fr, générée par le socle, pauvre en structures |
| Lieu de la galerie | dossier `composants/` partagé + page `/galerie/` | le socle Needle5 (couple la passe à la chaîne Needle), la Forge (trop lourd), l'accueil seul (pas de réutilisation) |
| Architecture | **A** : fichiers servis tels quels, chargés par l'accueil ET la galerie | B : recopie dans `index.html` (deux copies divergent) ; C : injection par script (réintroduit une compilation) |
| Découpage | section par section, une PR chacune, finie | par couche (rien de fini avant la fin) |
| Niveau des effets | marqué mais ponctuel, rien en boucle, CSS + JS léger, aucune librairie | discret ; spectaculaire (canvas, WebGL, poids, mobile) |
| Activation du son | **coupé par défaut**, bouton dans le dock, choix mémorisé | invite au premier geste ; allumé par défaut |
| Source du son | synthèse Web Audio, 0 Ko de fichiers | échantillons ; hybride |
| Intention mélodique | **le degré suit le chapitre, le timbre suit la situation** | l'un des deux seulement |
| Démos | cartes **groupées par usage**, toutes visibles | onglets (masquent 4 démos sur 5, contredit « rien n'est masqué ») |
| QR | oui : « Emporter cette page » dans le contact | |
| Départ | le hero et le choix de situation | |

## 3. L'architecture

```
composants/
  composants.css      jetons des effets + un bloc commenté par composant
  composants.js       un comportement par composant, activé par data-composant
  son.js              le moteur d'intonations : écoute les fi:*, ignore les composants
  vendor/qrcode.min.js  qrcode-generator 1.4.4 (MIT), chargé à la demande
galerie/
  index.html          chaque composant vivant, son markup, ses réglages (noindex)
```

- Servis tels quels, sans compilation, comme tout le dépôt.
- `index.html` garde sa mise en page et charge les trois fichiers
  (`composants.css` dans le `<head>`, les deux scripts en `defer`).
- **Réutilisation** : un futur site copie `composants/`, définit ses jetons
  `--fi-*` s'il veut une autre charte, et pose les attributs `data-*`.

### Le contrat, étendu sans rien casser

Rien de ce que la spec du parcours a posé ne change (`fi:chapitre`,
`fi:situation`, `fi:geste`, `fi:aller`, `body[data-chapitre]`,
`body[data-situation]`, `?situation=`).

| Événement | Émis par | Écouté par | Nouveau |
|---|---|---|---|
| `fi:chapitre {id, rang, total}` | le parcours | son, mesure, dock | non |
| `fi:situation {id, origine}` | le parcours | son, mesure, composants | non |
| `fi:geste {chapitre, geste, etape?}` | parcours **et composants** | son, mesure | émis aussi par les composants |
| `fi:son {actif}` | `son.js` | mesure, bouton son | **oui** |

- **Un composant émet `fi:geste` seulement s'il porte `data-geste="nom"`.**
  Le chapitre est l'`id` de la `section` qui le contient. Sans l'attribut,
  il joue son effet visuel et se tait : c'est ce qui évite un double son
  quand le parcours émet déjà (le choix de situation émet `fi:situation`).
- **Le son n'écoute que des `fi:*`.** Il ne connaît aucun composant, aucun
  sélecteur. Un composant nouveau sonne donc sans toucher au moteur.
- **La réservation devient un geste** : le parcours émet
  `fi:geste {chapitre: <id de la section du bouton>, geste: 'rdv'}` au clic
  sur `[data-rdv]`, pour que le son la résolve. ⚠️ La mesure automatique
  des gestes **ignore `rdv`**, déjà compté par `rdv-demande` : sans cette
  exclusion, la conversion serait comptée deux fois sous deux noms.
- **Le rang du chapitre se lit aussi sur `<body data-chapitre-rang>`**,
  écrit avec `data-chapitre` : `son.js` se charge après le premier
  `fi:chapitre` (arrivée par `/#demos`) et doit connaître le degré courant.

## 3 bis. L'ordre des sections (décidé le 27/09/2026)

Le fondateur était au milieu : entre le choix de situation et la réponse à
ce choix, sans qu'aucune interaction n'y mène. Nouvel ordre, du type
réponse, preuve, méthode, confiance :

| Rang | Chapitre (`id`) | Titre du dock | Pourquoi là |
|---|---|---|---|
| 1 | `top` | Accueil | la question |
| 2 | `offre` | Trois usages | la réponse au choix : la carte allumée |
| 3 | `demos` | Ça tourne déjà | la preuve, juste après la promesse |
| 4 | `approche` | L'approche | comment on travaille, une fois convaincu |
| 5 | `partenaires` | Partenaires | qui renforce l'équipe |
| 6 | `fondateur` | Le fondateur | celui qu'on aura en face pendant les 30 min |
| 7 | `contact` | Contact | la réservation |

- **Les CTA du hero mènent à la section suivante, `#offre`** : les trois
  piliers de situation et « Juste regarder ».
- **« Réserver 30 min » du hero reste dans le site** : il descend au
  contact (`#contact`), dont le bouton ouvre l'agenda. Il perd son
  `data-rdv` : ce clic n'est pas encore la demande, et le compter
  doublerait `rdv-demande` avec celui du contact. Les autres « Réserver
  30 min » (approche, offre, contact) ouvrent toujours l'agenda.
- **Ce qui mène au fondateur** : le lien de la nav, le dock, et le bloc
  d'identité du hero (portrait + nom), qui devient un lien vers
  `#fondateur`.
- Les liens de la nav suivent le même ordre. La spec du parcours
  (`2026-09-25`) garde l'historique ; celle-ci fait foi pour l'ordre.

## 3 ter. Décisions de la séance du 27/09/2026 (après la tâche 2)

Prises en co-conception, sur croquis et prototype jouable.

### La fenêtre (piste A : modale qui grandit du bouton)

Un seul composant `fenetre`, réutilisé par la plupart des CTA : la page
s'assombrit, la fenêtre grandit depuis le bouton cliqué, Échap / fond /
« Fermer » la referment et le focus revient au bouton. Sur téléphone, plein
écran. Mouvement réduit : fondu seul. Sans JavaScript, chaque CTA garde son
lien.

| Variante | Ouverte par | Contenu |
|---|---|---|
| `agenda` | les « Réserver 30 min » de l'approche, de l'offre, du contact | l'agenda Google en iframe (adresse longue `calendar.google.com/calendar/appointments/schedules/…`, le lien court refuse l'iframe), chargée au premier clic seulement ; « Ouvrir dans un onglet » en secours, mis en avant après 8 s sans chargement |
| `demo` | les « Ouvrir la démo » (Rayon X, Midipile, À fleur d'écorce, le village) | la démo en iframe à gauche, ses détails à droite (repris de la carte, rien de nouveau) ; sur téléphone, les détails dans un tiroir ; « Ouvrir en plein écran » en garde-fou (AR, caméra) |
| `carte` | « Carte de visite » du contact | une carte maison : portrait, nom, rôle, e-mail, QR vers la carte Blinq (Blinq refuse l'iframe : `X-Frame-Options: DENY`), bouton « Ajouter à mes contacts » (`.vcf`) |

- **STAND** n'a pas de scène de démo : son lien ouvre `/stand/` comme une
  page normale, dans le même onglet.
- Le « Réserver 30 min » du hero descend toujours au contact (§ 3 bis).

### L'offre : un usage à la fois (piste A : sélecteur en pastilles)

Remplace « rien n'est masqué » pour les trois cartes de l'offre (les démos,
elles, restent toutes visibles, groupées par usage).

- Trois pastilles (icône + libellé) au-dessus d'une seule carte ; la carte
  change en fondu.
- **Effet story** : chaque pastille se remplit en **5 s**, puis la suivante,
  **en boucle**. La story **démarre quand l'offre entre à l'écran** et se
  met en pause quand elle en sort, au survol et au focus clavier.
- **Situation choisie dans la page** (hero, dock, `?situation=`) : l'offre
  s'ouvre sur sa pastille, **figée**, sans minuteur.
- **Clic sur une pastille** : la story se fige sur elle ; le choix reste
  **local à la section** (la situation de la page ne change pas).
- **Son** : une note douce à chaque changement de pastille, seulement tant
  que la section est visible (et que le son est allumé).
- Mouvement réduit : pas de minuteur, première pastille (ou celle de la
  situation). Sans JavaScript : les trois cartes l'une sous l'autre.

### Le CTA son (piste B : une invitation dans le hero)

Le dock est caché sur le hero : sans autre bouton, le son ne pouvait pas
s'allumer avant le premier geste, alors que l'accord de la situation joue
justement là.

- Une invitation « Visite sonore » juste sous le choix de situation : le
  même composant `bascule-son`, avec ses propres libellés (attributs
  `data-libelle-coupe` / `data-libelle-allume`).
- Ensuite, le dock prend le relais ; les deux boutons restent d'accord
  (ils écoutent `fi:son`).

## 4. La correspondance sections / structures

Une structure STAND par section, deux au plus, choisie par ce qui coince.
Dans l'ordre de la page (§ 3 bis) ; la colonne # garde le numéro de PR.

| PR | Section | Structure reprise | Adaptation | Effet | Son |
|---|---|---|---|---|---|
| 1 | Hero (`#top`) | `hero-pillar` | les 3 boutons de situation deviennent des piliers (icône, texte, flèche qui glisse au survol) ; le clic choisit, joue l'éclat, puis descend à `#offre` | `eclat` au choix ; `reflet` sur la carte de la situation à l'arrivée dans l'offre | accord de la situation (§ 6) |
| 4 | Offre | `friction-card`, tons `section--defi` / `section--gains` | chaque carte lue douleur (ton chaud) › pivot › gain (vert) ; les trois restent ouvertes | `reflet` sur la carte de la situation quand elle s'allume (posé dès la PR 1) | geste `allume` (ornement par défaut) |
| 5 | Démos | `tour__group-label` | cartes groupées sous des étiquettes d'usage, toutes visibles ; le groupe de la situation passe en tête visuellement (ordre CSS, pas DOM) | cascade d'entrée par groupe | note du chapitre |
| 3 | Approche | `timeline` + `step-gain` | les 3 étapes sur une frise dont le fil se remplit ; un gain nommé par étape, en vert, **paraphrasé du texte existant** ; le bouton `#etapeSuivante` pilote la frise | fil qui se remplit, marqueur qui s'allume | `etape` : arpège montant |
| 6 | Partenaires | `wiring__cable` | la ligne de constellation devient le composant `fil` : une impulsion la parcourt au survol | impulsion le long du câble | `relie` : tintement |
| 2 | Fondateur | `kit-card` | les 3 repères deviennent des cartes à étiquette ; celui de la situation d'abord (déjà le cas) | le repère choisi se pose en « tampon », les autres en cascade | note du chapitre |
| 7 | Contact | `share` | bouton « Emporter cette page » : QR du lien de relance réglé (`?situation=…`), lien copiable | le QR se déplie depuis le bouton | `ouvre` ; `rdv` : accord résolu |
| · | Dock | aucune | bouton son, coupé par défaut, libellé, dans le dock et la pastille mobile | ondes à l'activation | accord de confirmation |

**Les groupes des démos** (d'après les `data-usages` en place) :

| Groupe | Démos |
|---|---|
| Convaincre un acheteur | STAND, Midipile |
| Former un nouvel arrivant | Rayon X |
| Garder un savoir-faire | À fleur d'écorce |
| Le site lui-même *(libellé à valider)* | Le village (aucun usage) |

**Laissés de côté**

- **FAQ en accordéon** : la bonne structure pour les objections, mais leurs
  réponses sont « à compléter » dans `VENTE.md`. Elle viendra avec elles.
- **Tableau comparatif à coches** : ajouterait du contenu que l'offre ne
  dit pas.
- **Visuel collé + pager** : doublon avec les groupes de démos.
- **Onglets `tour`** : écartés pour les démos (voir § 2) ; le composant
  entre quand même dans la galerie s'il sert un futur site, pas dans cette
  passe.

## 5. Les composants de la galerie

Chacun : un bloc CSS commenté, un comportement JS s'il en faut, une entrée
dans la galerie. Noms en français, préfixe de classe du composant.

| Composant | Déclencheur | Ce qu'il fait | Origine |
|---|---|---|---|
| `pilier` | CSS | carte cliquable icône + texte + flèche, état `aria-pressed="true"` | `hero-pillar` |
| `choix` | `data-composant="choix"` | groupe de piliers exclusif : un seul pressé, flèches clavier | nouveau |
| `carte-etiquette` | CSS | carte avec icône et étiquette | `kit-card` |
| `frise` | `data-composant="frise"`, étapes `[data-etape]` | fil rempli jusqu'à l'étape courante (`--frise-avance`), marqueurs | `timeline` |
| `pivot` | CSS | douleur › pivot › gain, avec icône ET libellé à chaque ton | `friction-card` + tons |
| `groupe` | CSS | étiquette de groupe au-dessus d'une grille de cartes | `tour__group-label` |
| `fil` | `data-composant="fil"`, `data-fil-de`, `data-fil-vers` | tracé SVG entre deux éléments, recalculé au redimensionnement, impulsion sur demande | `wiring__cable` |
| `partage` | `data-composant="partage"` | bouton, panneau, QR paresseux, lien copiable | `share` |
| `eclat` | `data-eclat` ou `FiComposants.eclat(el)` | 8 particules en CSS, créées puis retirées (≈ 500 ms) | nouveau |
| `reflet` | `data-reflet` ou `FiComposants.reflet(el)` | un reflet traverse l'élément une fois | nouveau |
| `bascule-son` | `data-composant="bascule-son"` | bouton `aria-pressed`, libellé « Son coupé » / « Son allumé », ondes | nouveau |

- `window.FiComposants` expose `eclat(el)`, `reflet(el)` et `activer(racine)`
  (active les `data-composant` d'un fragment ajouté après coup).
- Tout composant sans JS reste lisible et utilisable : un pilier est un
  `<button>` ou un lien, une frise est une liste ordonnée, un groupe est un
  titre suivi de cartes. Le bouton son et le bouton de partage portent
  `hidden` et le JS le retire.

## 6. Le moteur d'intonations (`son.js`)

### La gamme et les timbres

- **Pentatonique majeure en do** : aucune combinaison ne sonne faux.
- **Degré par chapitre** (rang 1 à 7) :

| Rang | Chapitre | Note | Hz |
|---|---|---|---|
| 1 | Accueil | do4 | 261,63 |
| 2 | Trois usages | ré4 | 293,66 |
| 3 | Ça tourne déjà | mi4 | 329,63 |
| 4 | L'approche | sol4 | 392,00 |
| 5 | Partenaires | la4 | 440,00 |
| 6 | Le fondateur | do5 | 523,25 |
| 7 | Contact | ré5 | 587,33 |

- **Timbre par situation** :

| Situation | Oscillateur | Enveloppe | Intention |
|---|---|---|---|
| aucune | sinus | attaque 15 ms, déclin 600 ms | neutre |
| convaincre | triangle | attaque 8 ms, déclin 450 ms | brillant, affirmé |
| former | sinus + sa quinte (−12 dB) | attaque 15 ms, déclin 700 ms | clair |
| garder | triangle + passe-bas 1 200 Hz | attaque 40 ms, déclin 900 ms | chaud, boisé |

### Ce qui joue

| Déclencheur | Ce qu'on entend |
|---|---|
| `fi:chapitre` | la note du rang, **une fois par changement réel** (pas de rejeu si l'on oscille au bord d'une section : 400 ms minimum entre deux notes de chapitre) |
| `fi:situation` (id ≠ aucune) | l'accord de do (do-mi-sol) arpégé, dans le nouveau timbre |
| `fi:geste` `choix` | la note du chapitre puis sa quinte dans la gamme |
| `fi:geste` `etape` | la note de l'étape : do, mi, sol pour 1, 2, 3 |
| `fi:geste` `relie` | la5, très court |
| `fi:geste` `ouvre` | deux notes montantes (sol4, do5) |
| `fi:geste` `rdv` | accord résolu do-mi-sol-do5, arpégé à 60 ms |
| `fi:geste` autre | la note du chapitre courant, une octave plus haut, courte |
| `fi:son {actif: true}` | accord de confirmation (do-sol) |

### La discrétion

- Volume maître bas (gain 0,12), jamais réglé par la page hôte.
- 4 voix au plus en même temps (l'accord de la réservation en compte 4) ;
  un déclenchement au plus toutes les 80 ms (les notes d'un même arpège
  ne comptent pas).
- Aucune note n'est lancée quand l'onglet est caché. Le moteur se suspend
  **1,5 s après** le passage en arrière-plan, et reprend au retour :
  « Réserver 30 min » ouvre l'agenda dans un nouvel onglet, et une
  suspension immédiate couperait l'accord de la réservation.
- Le son est **indépendant du mouvement réduit** : il n'est piloté que par
  son bouton.

### L'activation

- Le moteur audio (`AudioContext`) n'est créé **qu'au clic sur le bouton
  son** : c'est la règle des navigateurs, et la page ne paie rien tant que
  le son est coupé.
- Le choix est retenu (`localStorage['fi:son'] = '1'`). À la visite
  suivante, le bouton s'affiche allumé ; le moteur se crée au premier
  `pointerdown` ou `keydown` dans la page.
- Toute lecture ou écriture de `localStorage` et toute création audio est
  sous `try/catch` : sans stockage ou sans Web Audio, le bouton reste
  visible et le son muet, sans erreur console.
- API : `window.FiSon = { actif(), basculer(), jouer(rang, timbre) }`
  (`jouer` sert la galerie).

### Le journal

Chaque note s'écrit dans le journal existant (`?debug=1`) : note, timbre,
déclencheur. Même interrupteur `fi:debug` que le parcours.

## 7. Les effets

- **Jetons** en tête de `composants.css`, avec valeurs de repli :
  `--fi-fx-court: 180ms`, `--fi-fx-long: 700ms`, `--fi-ease-morph`
  (repli `cubic-bezier(0.34, 1.2, 0.64, 1)`), `--fi-eclat` (couleur
  d'accent de la charte).
- **Un mouvement par intention** : aucun élément ne cumule deux effets
  déclenchés par le même geste.
- Chaque effet se déclenche par une classe posée puis retirée par le JS
  (rejouable) ; les particules sont créées à la volée et supprimées.
- **Rien en boucle.**
- **Mouvement réduit** : `eclat`, `reflet`, impulsion du `fil`, ondes du
  bouton son ne jouent pas ; frise, piliers, cartes affichent directement
  leur état final.

## 8. La galerie (`/galerie/`)

- `<meta name="robots" content="noindex">`, absente de `sitemap.xml`.
- Charge `composants/` exactement comme l'accueil.
- Pour chaque composant : la démo vivante ; le markup, avec un bouton
  « Copier » ; les `data-*` lus ; les événements émis ; un interrupteur
  « mouvement réduit » qui force l'état final.
- **Le clavier sonore** : 7 degrés × 4 timbres, pour écouter toute la gamme.
- Un journal visible des `fi:*` reçus, pour voir le contrat vivre.
- Elle grossit avec chaque PR : une section livrée ajoute ses composants.

## 9. La mesure

| Événement Umami | Quand | Données |
|---|---|---|
| `son-active` | `fi:son {actif: true}` | `situation` |
| `son-coupe` | `fi:son {actif: false}` | `situation` |
| `partage-ouvert` | ouverture du panneau QR | `situation` |

- La mesure écoute `fi:son` et `fi:geste {geste: 'ouvre'}`, comme le reste :
  aucun composant n'appelle Umami.
- `geste` ignore `rdv` (voir § 3).

## 10. Les contraintes

- **Poids** : `index.html` et les fichiers `composants/` chargés au
  démarrage restent sous **500 Ko** au total. Le QR (20 Ko) n'est chargé
  qu'à l'ouverture du panneau et ne compte pas.
- **Sans JavaScript** : tout le contenu est lisible, les démos groupées
  visibles, les boutons son et partage absents.
- **Accessibilité** : règle 6 de Needle5 (la couleur ne porte jamais seule
  l'information : icône + libellé), règle 7 (les contrôles fixes vivent
  dans la bande de 1 100 px), règle 9 (une pile de boutons partage une
  largeur égale) ; focus visible, `aria-pressed` sur les bascules.
- **Mobile** : aucun défilement horizontal à 375 px.
- **Wording** : aucun tiret cadratin visible, pas de point final dans les
  titres, aucun prix, aucun contenu nouveau sur l'offre ; un gain nommé
  paraphrase le texte existant.
- **Code** : CSS dans `composants.css` par blocs commentés, sans réécrire
  les règles de l'accueil ; vérifier la spécificité (`.dock button` bat une
  classe seule) ; commentaires pédagogiques et logs de debug gardés.

## 11. La livraison

Une PR par étape, chacune vérifiée et finie (découpage du 27/09/2026) :

1. **Ordre + socle + hero** : le nouvel ordre des sections (§ 3 bis),
   `composants/` (CSS, JS, `son.js`), le bouton son du dock et
   l'invitation « Visite sonore » du hero (§ 3 ter), la galerie avec
   `pilier`, `choix`, `eclat`, `reflet`, `bascule-son` et le clavier
   sonore ; la passe sur le hero ; `fi:son` et sa mesure ; `rdv` émis en
   geste et exclu de `geste`.
1 bis. **La fenêtre** (§ 3 ter) : `fenetre` et ses variantes `agenda`,
   `demo`, `carte` ; le QR arrive ici (carte de visite).
1 ter. **L'offre en story** (§ 3 ter) : le sélecteur en pastilles.
2. **Fondateur** : `carte-etiquette`.
3. **Approche** : `frise`.
4. **Offre** : `pivot` (dans la carte du sélecteur livré en 1 ter).
5. **Démos** : `groupe`.
6. **Partenaires** : `fil` (remplace le tracé de constellation actuel).
7. **Contact** : `partage` + QR.

## 12. Critères d'acceptation

1. Son coupé par défaut ; un clic sur le bouton son joue l'accord de
   confirmation ; recharger la page garde le bouton allumé, et le premier
   clic dans la page réveille le son.
2. Défiler de l'accueil au contact fait entendre do, ré, mi, sol, la, do,
   ré, une note par chapitre, sans doublon en oscillant au bord.
3. Choisir « Garder » change le timbre de toutes les notes suivantes.
4. Cliquer « Réserver 30 min » joue l'accord résolu ; Umami reçoit
   `rdv-demande` une fois et **aucun** `geste` `rdv`.
5. Sans Web Audio ou sans `localStorage` : aucune erreur console.
6. Mouvement réduit émulé : aucun éclat, reflet, impulsion ni onde ; états
   finaux visibles.
7. Sans JavaScript : contenu complet, boutons son et partage absents.
8. 375 × 812 : débordement horizontal 0 ; bouton son atteignable dans la
   pastille.
9. La galerie montre chaque composant livré, vivant, avec son markup
   copiable ; elle porte `noindex`.
10. Poids au démarrage sous 500 Ko (valeur relevée dans la PR).
11. Le journal (`?debug=1`) montre chaque note avec son déclencheur.
12. Les sections se suivent dans l'ordre du § 3 bis, dans la page, la nav
    et le dock (« 2 / 7 · Trois usages » juste après le hero).
13. Un clic sur un pilier du hero ou sur « Juste regarder » descend à
    `#offre` ; le focus clavier y arrive aussi. Sans JavaScript, le lien
    mène au même endroit.
14. L'accord de la réservation s'entend en entier même si l'agenda s'ouvre
    dans un nouvel onglet.

## 13. Hors périmètre

- La télécommande (sous-projet 3) : elle émettra `fi:aller`, et le composant
  `fil` lui servira ; rien de plus ici.
- La passe SEO/GEO (sous-projet 4), dont la meta description.
- La FAQ des objections, en attente des réponses dans `VENTE.md`.
- Des échantillons audio : la synthèse suffit tant qu'elle convainc.
- L'extraction de `composants/` vers le socle Needle5 : à envisager quand
  un deuxième site l'utilisera.
