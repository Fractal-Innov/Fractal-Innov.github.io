# Passe graphique section par section : plan d'implémentation

> **Mode d'exécution (formation en cours)** : natif, dans la session, une
> section par boucle. L'assistant écrit le code et mesure. L'utilisateur
> valide le rendu, puis tape lui-même chaque commande `git`/`gh`. Les
> skills `subagent-driven-development` et `executing-plans` restent en
> sommeil (voir `~/.claude/CLAUDE.md`).

**Objectif :** chaque section de l'accueil dit son résultat, tient à l'écran
et se lit d'un coup d'œil, dans l'ordre du parcours du visiteur.

**Architecture :** site statique sans build. Les surcharges CSS vont dans un
bloc commenté par section, en fin de `<style>` d'`index.html`. Les
composants partagés restent dans `composants/`. Une garde de debug mesure
« tient à l'écran » sur des éléments marqués `data-essentiel`, ce qui
remplace ici une suite de tests.

**Stack :** HTML, CSS (tokens `--fi-t*`, `--fi-e*`), JS vanilla en IIFE,
événements `fi:*`.

**Spec :** `docs/superpowers/specs/2026-09-27-galerie-affordance-son-design.md`
(§ 16 et § 17). Les décisions de ce plan y seront ajoutées en § 18.

## Contraintes globales

- Ordre de traitement : l'ordre de la page (hero, offre, démos, approche,
  équipe, contact), pour garder un parcours cohérent de bout en bout.
- « Tient à l'écran » :
  - au bureau (1440×900 et 1280×720), la section entière tient en un écran ;
  - au mobile (375×812 et 360×740), le titre, le résultat et le geste
    suivant sont dans le premier écran de la section.
- Wording : titres et paragraphes réécrivables. Chaque changement est
  montré en avant / après avant d'être intégré. Aucun fait, prix ni chiffre
  n'est inventé.
- Jamais de tiret cadratin « — » dans un texte visible.
- Partenaires : leur rôle seulement, sans nom ni logo.
- Fondateur et partenaires fusionnent en une section « équipe » : le
  fondateur au centre, le réseau autour.
- Démos : une démo mise en avant, grande, et 4 vignettes.
- Vignettes : presque toutes à refaire. On pose le cadre et des
  emplacements propres ; les nouveaux visuels viendront de l'utilisateur.
- Tout ce qui bouge a son `prefers-reduced-motion`. Aucun défilement
  horizontal. Cibles d'au moins 44 px.
- Tout nouveau code porte un journal pédagogique derrière `?debug=1`.
- Éditer `index.html` par script (python avec assertion par
  remplacement), jamais avec Edit/Write : cela ouvre un onglet `file://`
  sans style.
- Contrats à ne pas casser : `fi:situation`, `fi:chapitre`, `fi:aller`,
  `fi:dock`, `fi:son`, `[data-situation-choix]`, `?situation=`,
  `?question=1`.

## Points de revue

1. **Anciennes ancres** (`/#fondateur`, `/#partenaires`) venues d'un lien
   externe : elles doivent atterrir sur la nouvelle section équipe. Vérifié
   en tâche 5, étape 5.
2. **`?situation=former`** et le choix fait dans le dock : la démo mise en
   avant doit suivre la situation. Vérifié en tâche 3, étape 5.
3. **Téléphone court (360×740)** : les éléments essentiels ne passent pas
   sous le dock replié. Vérifié par la garde à chaque tâche.
4. **Sans JavaScript** : toutes les démos et tous les rôles restent visibles
   et atteignables, rien n'est caché derrière un script. Vérifié en tâche 3
   et en tâche 5.
5. **Le sommaire « Tous » du dock** après la fusion : un chapitre de moins,
   bon rang, `aria-current` juste. Vérifié en tâche 5, étape 6.

---

### Tâche 0 : la garde « tient à l'écran »

**Fichiers :**
- Créer : `composants/garde-ecran.js`
- Modifier : `index.html` (une balise `<script defer>` après `dock.js`,
  et `data-essentiel` sur le titre, le chapeau et la question du hero)

**Interfaces :**
- Produit : l'attribut `data-essentiel` (sur n'importe quel élément d'une
  section) et `window.FiGarde.mesurer()` qui renvoie un tableau
  `[{section, ecrans, essentielsHors: [texte…]}]`.

- [ ] **Étape 1 : écrire la garde**

```js
/* ══ LA GARDE « TIENT À L'ÉCRAN » (?debug=1) ════════════════════════════
   Pour chaque section : combien d'écrans elle occupe, et si ses éléments
   [data-essentiel] tiennent dans son PREMIER écran (au-dessus du dock).
   Muette hors debug ; FiGarde.mesurer() reste appelable à la main.
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var DEBUG = false;
  try { DEBUG = localStorage.getItem('fi:debug') === '1'; } catch (e) {}

  function mesurer() {
    var dock = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--fi-dock-h')) || 64;
    var utile = innerHeight - dock; /* l'écran que le visiteur voit vraiment */
    return Array.prototype.map.call(document.querySelectorAll('section[id]'), function (s) {
      var r = s.getBoundingClientRect();
      var hors = Array.prototype.filter.call(s.querySelectorAll('[data-essentiel]'), function (el) {
        return el.getBoundingClientRect().bottom - r.top > utile;
      }).map(function (el) { return el.textContent.trim().slice(0, 40); });
      return { section: s.id, ecrans: +(r.height / utile).toFixed(2), essentielsHors: hors };
    });
  }
  window.FiGarde = { mesurer: mesurer };
  if (!DEBUG) return;
  addEventListener('load', function () {
    mesurer().forEach(function (m) {
      var ok = m.essentielsHors.length === 0;
      console.log('%c[garde] ' + (ok ? '✓' : '⚠️') + ' #' + m.section + ' : ' + m.ecrans + ' écran(s)' +
        (ok ? '' : ', hors du premier écran : ' + m.essentielsHors.join(' | ')), 'color:#6ea8ff');
    });
  });
})();
```

- [ ] **Étape 2 : brancher la garde et marquer le hero** (script python sur
  `index.html` : ajout du `<script defer src="/composants/garde-ecran.js">`
  et de `data-essentiel` sur `.hero__titre`, `.hero__lead` et
  `#situationsQuestion`).
- [ ] **Étape 3 : mesurer** aux 4 formats avec `FiGarde.mesurer()`.
  Attendu : `#top` sans aucun essentiel hors écran, aucune erreur console.
- [ ] **Étape 4 : commit** (commandes données à l'utilisateur) :
  `feat(outils): mesurer ce qui tient à l'écran en debug`.

### Tâche 1 : hero (retouche)

**Fichiers :** `index.html` (bloc « PASSE GRAPHIQUE : HERO »)

- [ ] **Étape 1 : voir.** Rendu aux 4 formats, diagnostic en 3 lignes
  (lecture, geste, composition).
- [ ] **Étape 2 : wording.** Le chapeau a déjà été revu. On relit le titre et
  la pastille, avant / après seulement si un gain est net.
- [ ] **Étape 3 : affordance.** La question du dock est le geste. On vérifie
  que rien dans le hero ne lui fait concurrence.
- [ ] **Étape 4 : garde + QA de l'utilisateur**, puis commit
  `feat(hero): …` (ou aucun commit si rien ne change).

### Tâche 2 : offre « Un savoir, trois usages »

**Fichiers :** `index.html` (markup `#offre`, bloc « PASSE GRAPHIQUE : OFFRE »)

- [ ] **Étape 1 : voir.** Mesures de départ : 0,9 écran au bureau, 1,4 au
  mobile, 91 mots.
- [ ] **Étape 2 : wording.** Intro en une phrase, titre relu, puis chaque
  onglet réduit à : accroche (h3), une phrase, une ligne « Résultat ».
  Avant / après montré.
- [ ] **Étape 3 : affordance.** Nouvelle ligne `.offre__resultat` par onglet
  (pictogramme de validation + la phrase résultat, en `--fi-accent`), qui
  paraphrase la carte sans rien ajouter à l'offre.
- [ ] **Étape 4 : composition.** Au mobile, onglets, carte et bouton dans le
  premier écran. `data-essentiel` sur le h2, `.offre__resultat` et le
  bouton.
- [ ] **Étape 5 : garde aux 4 formats**, onglet actif changé 3 fois,
  `fi:situation` toujours émis. QA de l'utilisateur, commit
  `feat(offre): …`.

### Tâche 3 : démos, une mise en avant et 4 vignettes

**Fichiers :** `index.html` (markup `#demos`, bloc « PASSE GRAPHIQUE :
DÉMOS »), `composants/dock.js` ou script « LE PARCOURS » pour la
mise en avant.

- [ ] **Étape 1 : voir.** Mesures de départ : 2 écrans au bureau, 4,5 au
  mobile, 314 mots, 5 cartes groupées par usage.
- [ ] **Étape 2 : wording.** Une accroche et une ligne par démo. Les points
  (`.demo__points`) passent dans la seule démo mise en avant. Avant / après
  montré.
- [ ] **Étape 3 : composition.**
  - Au bureau : grille à 2 colonnes, la démo mise en avant à gauche (16:9,
    accroche, 3 points, bouton « Ouvrir la démo ») et les 4 vignettes à
    droite en 2×2.
  - Au mobile : la mise en avant, puis les vignettes en liste compacte
    (visuel 96 px + titre + une ligne).
  - Le regroupement par usage passe dans une étiquette sur chaque carte.
- [ ] **Étape 4 : mise en avant pilotée.** Au `fi:situation`, la démo liée à
  la situation passe en avant, avec une transition courte (et instantanée
  en reduced motion). Sans JS, l'ordre du HTML fait foi : la première démo
  est la mise en avant. La correspondance situation → démo se décide dans
  cette boucle avec l'utilisateur.
- [ ] **Étape 5 : vérifier.**
  - `?situation=former` et un clic dans le dock changent la démo en avant.
  - Sans JS, les 5 démos sont visibles et cliquables.
  - La garde passe, 1 écran au bureau.
- [ ] **Étape 6 : cadre des vignettes.** Format cible :
  - image 16:9, webp 1280×720, moins de 120 Ko ;
  - boucle vidéo optionnelle, mp4 H.264 de 6 s maximum, moins de 1,5 Mo,
    muette, avec l'image fixe comme poster.

  Liste des vignettes à refaire remise à l'utilisateur. Commit
  `feat(demos): …`.

### Tâche 4 : approche en trois étapes

**Fichiers :** `index.html` (markup `#approche`, bloc « PASSE GRAPHIQUE :
APPROCHE »)

- [ ] **Étape 1 : voir.** Mesures de départ : 1 écran au bureau, 1,9 au
  mobile, 145 mots.
- [ ] **Étape 2 : wording.** Par étape : un titre, une phrase et un livrable
  en gras (« Vous repartez avec : … »). Avant / après montré.
- [ ] **Étape 3 : composition.** Frise horizontale au bureau, avec un fil
  qui se remplit à l'arrivée (une seule animation) ; étapes compactes
  verticales au mobile.
- [ ] **Étape 4 : garde, QA, commit** `feat(approche): …`.

### Tâche 5 : équipe, le fondateur au centre et le réseau autour

**Fichiers :** `index.html` (fusion de `#partenaires` et `#fondateur` en
`#equipe`, bloc « PASSE GRAPHIQUE : ÉQUIPE »), sommaire du dock.

- [ ] **Étape 1 : voir.** Mesures de départ, deux sections cumulées :
  2,5 écrans au bureau, 4,6 au mobile.
- [ ] **Étape 2 : représentation.** Montrer 2 ou 3 pistes jouables à
  l'utilisateur :
  - (a) une orbite : le portrait au centre, les 5 rôles en satellites
    reliés par des fils ;
  - (b) une constellation : les fils s'allument au survol ou au toucher
    d'un rôle ;
  - (c) des rôles rangés par étape de l'approche.

  L'utilisateur choisit avant toute intégration.
- [ ] **Étape 3 : wording.** Bio du fondateur en 3 lignes plus 3 faits en
  pastilles ; chaque rôle en une ligne, sans nom. Avant / après montré.
- [ ] **Étape 4 : intégration** de la piste choisie. Sans JS et au mobile,
  une liste lisible (portrait, bio, rôles).
- [ ] **Étape 5 : anciennes ancres.** Poser des `<span id="fondateur">` et
  `<span id="partenaires">` dans `#equipe`. Vérifier que `/#fondateur` et
  `/#partenaires` atterrissent sur la section, sans poser de question.
- [ ] **Étape 6 : parcours.**
  - Le sommaire « Tous » compte un chapitre de moins, avec le bon rang et
    un `aria-current` juste.
  - `FiDock.verifier()` passe.
  - Le JSON-LD reste inchangé.
- [ ] **Étape 7 : garde, QA, commit** `feat(equipe)!: …`, avec un
  `BREAKING CHANGE` pour les ids de chapitre.

### Tâche 6 : contact

**Fichiers :** `index.html` (bloc « PASSE GRAPHIQUE : CONTACT »)

- [ ] **Étape 1 : voir, wording.** Intro raccourcie, centrage conservé
  (c'est la conclusion), avant / après montré.
- [ ] **Étape 2 : affordance.** Le bouton dit ce qui se passe (« Réserver
  30 min, gratuit ») et une ligne dit ce qu'on obtient à la fin de
  l'atelier.
- [ ] **Étape 3 : garde, QA, commit** `feat(contact): …`.

### Tâche 7 : clôture

- [ ] Ajouter § 18 à la spec : décisions, mesures avant / après par
  section.
- [ ] Ajouter en commentaire `data-essentiel` sur chaque section traitée.
- [ ] Faire la PR `feat/passe-graphique` avec
  `finishing-a-development-branch`.

## Annexe : chiffres candidats (à trier par l'utilisateur, rien d'inventé)

Mesurables par nous, donc sans NDA :
- temps d'ouverture d'une démo en 4G ;
- poids d'une démo ;
- nombre de démos en ligne (5) ;
- appareils couverts (ordinateur, tablette, téléphone, casque).

À chercher côté projets, si ce n'est pas sous NDA :
- visiteurs ou prises en main sur un salon ;
- durée moyenne d'une session sur borne ;
- délai de production d'une démo (en semaines) ;
- nombre de salons ou de clients servis ;
- transports ou montages évités.
