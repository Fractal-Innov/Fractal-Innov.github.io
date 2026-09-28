# Galerie, son et hero (PR 1) : plan d'implémentation

> **Exécution : native, dans cette session.** Les skills d'exécution par
> sous-agents sont en sommeil pendant la formation. L'assistant écrit le
> code tâche par tâche, une tâche à la fois, sur le feu vert de Corentin
> (« lance la tâche N »). **Dans cette conversation seulement**, l'assistant
> lance lui-même les commandes `git` et `gh` (autorisation du 25/09/2026,
> limitée à cette conversation). Corentin valide le rendu à l'œil et à
> l'oreille. Les cases `- [ ]` servent au suivi.

**Goal :** remettre l'accueil dans l'ordre réponse, preuve, méthode,
confiance, poser le socle partagé `composants/` (effets, bouton son, moteur
d'intonations), ouvrir la galerie, et livrer la passe sur le hero dont les
CTA mènent à la section suivante.

**Architecture :** trois fichiers servis tels quels dans `composants/`,
chargés en `defer` par l'accueil et par `/galerie/` : `son.js` (écoute les
`fi:*`, ne connaît aucun composant), `composants.js` (un comportement par
attribut `data-*`), `composants.css` (jetons `--fi-*` à valeurs de repli).
L'accueil garde ses deux scripts ; il émet un `fi:son` de plus, un geste
`rdv`, et écrit `body[data-chapitre-rang]`.

**Tech Stack :** HTML, CSS, JavaScript ES5 sans compilation (comme la page),
Web Audio (synthèse, aucun fichier son), Umami (déjà en place).

**Spec :** `docs/superpowers/specs/2026-09-27-galerie-affordance-son-design.md`
(ordre : § 3 bis ; contrat : § 3 ; son : § 6 ; effets : § 7 ; galerie : § 8)

**Branche :** `feat/galerie-affordance-son` (la spec y est déjà commitée).

## Global Constraints

- Ordre des chapitres : `top`, `offre`, `demos`, `approche`, `partenaires`, `fondateur`, `contact` (spec § 3 bis).
- Poids : `index.html` + `composants/composants.css` + `composants/composants.js` + `composants/son.js` **sous 500 Ko** au total. Base : `index.html` = **156 959 octets**.
- Sans JavaScript : tout le contenu lisible, les liens du hero mènent à `#offre`, aucun bouton son.
- Aucun texte d'offre nouveau ; un redécoupage (« **Convaincre** un acheteur ») reste fidèle au libellé.
- Jamais de tiret cadratin dans le texte visible ; pas de point final dans les titres.
- Règle 6 de Needle5 : icône + libellé, jamais la couleur seule ; règle 7 : contrôles fixes dans la bande de 1 100 px ; règle 9 : une pile de boutons partage sa largeur.
- Cible tactile minimale : 44 px ; focus visible.
- Mouvement réduit : aucun éclat, reflet, onde ; transitions coupées ; le son reste piloté par son seul bouton.
- Son : coupé par défaut, clé `localStorage` `fi:son` (`'1'` / `'0'`), gain maître 0,12, 4 voix au plus, un déclenchement au plus toutes les 80 ms, suspension 1,5 s après le passage en arrière-plan.
- Journal : `?debug=1` (clé `fi:debug`), préfixes `[son]` et `[composants]`, muet sinon.
- Umami : noms en kebab-case, dans la table `MESURES` ; `rdv` exclu de la mesure `geste`.
- La navbar reste sur une seule rangée : mêmes libellés, seul l'ordre change.
- Commentaires pédagogiques gardés (le pourquoi, les pièges marqués ⚠️).

## Review Focus

1. **« Réserver 30 min » ouvre l'agenda dans un nouvel onglet** : l'onglet de l'accueil passe en arrière-plan au moment même où l'accord de la réservation commence ; il doit s'entendre en entier (suspension différée de 1,5 s). Test en tâche 2, étape 6.
2. **Arrivée par une ancre profonde avec le son allumé** (`/#demos` à la visite suivante) : `son.js` se charge après le premier `fi:chapitre` ; il doit partir du bon degré (rang 3), pas de do. Test en tâche 2, étape 5.
3. **Web Audio absent ou stockage bloqué** : le bouton s'affiche, le son se tait, aucune erreur console. Test en tâche 2, étape 7.
4. **Clavier** : Tab jusqu'à un pilier, Entrée : la page descend à `#offre` ET le focus y arrive ; le Tab suivant part de l'offre, pas du hero. Test en tâche 5, étape 7.
5. **Double clic rapide sur un pilier** : une seule descente, un seul accord, aucune erreur. Test en tâche 5, étape 8.

---

### Task 1 : Le nouvel ordre des sections

Aucun effet, aucun son : la page se relit dans le nouvel ordre, et les CTA
du hero mènent à la section suivante. À la fin, tout le reste du plan
s'appuie sur cet ordre.

**Files :**
- Modify : `index.html` : nav (5 liens), hero (ancres, bloc d'identité), blocs `<section>` du `.page-rest`, premier script (`idsSections`, `idsChapitres`, `data-chapitre-rang`), second script (`CHAPITRES`), CSS du parcours (`.hero__identite`)
- Modify : `docs/superpowers/specs/2026-09-25-parcours-interactif-design.md` (renvoi vers le nouvel ordre)

**Interfaces :**
- Produces : `body[data-chapitre-rang]` (entier 1 à 7, écrit avec `data-chapitre`) ; ordre des `IDS` ; `a.hero__identite[href="#fondateur"]`.

- [ ] **Step 1 : Mesurer le poids de départ**

Run : `wc -c index.html`
Expected : `156959 index.html`

- [ ] **Step 2 : Déplacer les cinq blocs de section**

Les blocs commencent chacun par un commentaire `<!-- ══ … ══ -->` et le
dernier s'arrête avant la fermeture de `.page-rest`. Un script qui découpe
sur ces marqueurs est plus sûr qu'un copier-coller de 400 lignes.

Run :
```bash
python3 - <<'EOF'
import pathlib
p = pathlib.Path('index.html')
s = p.read_text()
marqueurs = ['<!-- ══ FONDATEUR', '<!-- ══ APPROCHE', '<!-- ══ TROIS USAGES',
             '<!-- ══ CE QUI TOURNE DÉJÀ', '<!-- ══ PARTENAIRES']
# Chaque bloc commence au début de la ligne de son marqueur (indentation comprise).
debuts = [s.rindex('\n', 0, s.index(m)) + 1 for m in marqueurs]
fin = s.index('    </div>\n\n    <!-- ══ CONTACT')
assert debuts == sorted(debuts) and debuts[-1] < fin
blocs = {m: s[d:(debuts[i + 1] if i + 1 < len(debuts) else fin)]
         for i, (m, d) in enumerate(zip(marqueurs, debuts))}
ordre = ['<!-- ══ TROIS USAGES', '<!-- ══ CE QUI TOURNE DÉJÀ', '<!-- ══ APPROCHE',
         '<!-- ══ PARTENAIRES', '<!-- ══ FONDATEUR']
milieu = '\n\n'.join(blocs[m].rstrip('\n') for m in ordre) + '\n'
nouveau = s[:debuts[0]] + milieu + s[fin:]
assert len(nouveau.split()) == len(s.split()), 'du texte a été perdu'
p.write_text(nouveau)
print('ok')
EOF
```
Expected : `ok`

- [ ] **Step 3 : Vérifier l'ordre dans le fichier**

Run : `grep -o '<section class="[a-z ]*" id="[a-z]*"' index.html`
Expected, dans cet ordre :
```
<section class="hero" id="top"
<section class="section" id="offre"
<section class="section" id="demos"
<section class="section" id="approche"
<section class="section" id="partenaires"
<section class="section" id="fondateur"
<section class="contact reveal" id="contact"
```

- [ ] **Step 4 : Remettre la nav dans le même ordre**

Remplacer :
```html
          <a href="#fondateur" class="nav-link">Fondateur</a>
          <a href="#approche" class="nav-link">Approche</a>
          <a href="#offre" class="nav-link">Agence WebXR</a>
          <a href="#demos" class="nav-link">Démos</a>
          <a href="#partenaires" class="nav-link">Partenaires</a>
```
par :
```html
          <a href="#offre" class="nav-link">Agence WebXR</a>
          <a href="#demos" class="nav-link">Démos</a>
          <a href="#approche" class="nav-link">Approche</a>
          <a href="#partenaires" class="nav-link">Partenaires</a>
          <a href="#fondateur" class="nav-link">Fondateur</a>
```

- [ ] **Step 5 : Les listes de chapitres des deux scripts**

Dans le premier script, remplacer :
```js
      var idsSections = ['fondateur', 'approche', 'offre', 'demos', 'partenaires'];
```
par :
```js
      /* ⚠️ Même ordre que la page (spec 2026-09-27 § 3 bis) : réponse,
         preuve, méthode, confiance. */
      var idsSections = ['offre', 'demos', 'approche', 'partenaires', 'fondateur'];
```
et :
```js
      var idsChapitres = ['top', 'fondateur', 'approche', 'offre', 'demos', 'partenaires', 'contact'];
```
par :
```js
      var idsChapitres = ['top', 'offre', 'demos', 'approche', 'partenaires', 'fondateur', 'contact'];
```
Puis, juste après `document.body.setAttribute('data-chapitre', chapitre);`, ajouter :
```js
          /* Le rang aussi, pour qui se charge APRÈS l'événement : le son
             (defer) doit connaître le degré de départ à l'arrivée par
             `/#demos`. */
          document.body.setAttribute('data-chapitre-rang', String(rang));
```

Dans le second script, remplacer le tableau `CHAPITRES` par :
```js
      var CHAPITRES = [
        { id: 'top', titre: 'Accueil' },
        { id: 'offre', titre: 'Trois usages' },
        { id: 'demos', titre: 'Ça tourne déjà' },
        { id: 'approche', titre: "L'approche" },
        { id: 'partenaires', titre: 'Partenaires' },
        { id: 'fondateur', titre: 'Le fondateur' },
        { id: 'contact', titre: 'Contact' }
      ];
```

- [ ] **Step 6 : Les CTA du hero mènent à la section suivante**

Dans le hero, remplacer `href="#usage-convaincre"`, `href="#usage-former"`,
`href="#usage-garder"` (les trois `.situation-btn`) et le `href="#fondateur"`
de « Juste regarder » par `href="#offre"`.

Remplacer le commentaire au-dessus de `<div class="situations">` par :
```html
        <!-- Le premier geste du parcours. Sans JavaScript, chaque bouton est un
             lien vers la section suivante (#offre), où sa carte est ; avec, il
             règle aussi toute la page sur ce cas (script « LE PARCOURS »,
             section LA SITUATION). -->
```

- [ ] **Step 6 bis : « Réserver 30 min » du hero reste dans le site**

Décision du 27/09/2026 : il descend au contact au lieu d'ouvrir l'agenda
dans un nouvel onglet. Son `href` devient `#contact`, et il perd
`target`, `rel` et `data-rdv` (ce clic n'est pas encore la demande de
rendez-vous ; le compter doublerait `rdv-demande` avec le contact).

- [ ] **Step 7 : Le bloc d'identité du hero mène au fondateur**

Le fondateur est désormais avant le contact ; le portrait et le nom du hero
deviennent le chemin vers lui. Remplacer :
```html
        <div class="hero__identite">
```
par :
```html
        <a class="hero__identite" href="#fondateur">
```
et le `</div>` qui ferme ce bloc (juste après `</span>\n        </span>`) par `</a>`.

Dans le CSS, bloc PARCOURS, juste après la règle `.situations__regarder:hover`, ajouter :
```css
    /* Le bloc d'identité du hero est un lien vers le fondateur (spec
       2026-09-27 § 3 bis) : il garde son allure, le nom se souligne au
       survol pour dire qu'il se clique. */
    a.hero__identite { color: var(--text-main); border-radius: 999px; }
    a.hero__identite:hover .hero__nom,
    a.hero__identite:focus-visible .hero__nom { text-decoration: underline; text-underline-offset: 3px; }
    a.hero__identite:hover .hero__avatar { border-color: var(--accent-blue); }
```

- [ ] **Step 8 : Renvoi dans la spec du parcours**

Dans `docs/superpowers/specs/2026-09-25-parcours-interactif-design.md`,
juste sous la ligne `- **Sous-projet** : …`, ajouter :
```markdown
- **Ordre des sections** : remplacé le 27/09/2026 par
  `2026-09-27-galerie-affordance-son-design.md` § 3 bis (réponse, preuve,
  méthode, confiance) ; les tableaux ci-dessous gardent l'ancien ordre.
```

- [ ] **Step 9 : Vérifier dans le navigateur**

Serveur `accueil-fi` (port 4000). Recharger `http://localhost:4000/?debug=1`, puis en JS :
```js
[[...document.querySelectorAll('main section[id]')].map(s => s.id).join(' '),
 [...document.querySelectorAll('#mainNav .nav-link')].map(a => a.getAttribute('href')).join(' '),
 document.querySelectorAll('a[href="#offre"][data-situation-choix]').length,
 document.querySelector('.hero__identite').getAttribute('href')]
```
Expected :
```
["top offre demos approche partenaires fondateur contact",
 "#offre #demos #approche #partenaires #fondateur", 4, "#fondateur"]
```
Puis naviguer vers `http://localhost:4000/#demos`, attendre 2 s, et lire :
```js
[document.body.dataset.chapitre, document.body.dataset.chapitreRang, document.getElementById('dockPosition').textContent]
```
Expected : `["demos", "3", "3 / 7 · Ça tourne déjà"]`

Cliquer « Former un nouvel arrivant » dans le hero, attendre 2 s :
```js
[document.body.dataset.situation, document.body.dataset.chapitre, location.search]
```
Expected : `["former", "offre", "?situation=former"]`

Console : aucune erreur. Largeur 375 : `document.documentElement.scrollWidth` = `375`.

- [ ] **Step 10 : Commit**

```bash
git add index.html docs/superpowers/specs/2026-09-25-parcours-interactif-design.md
git commit -m "feat(accueil): remettre les sections dans l'ordre réponse, preuve, méthode, confiance" -m "Le fondateur coupait le chemin entre le choix de situation et sa réponse, sans qu'aucune interaction n'y mène.

- ordre : hero, offre, démos, approche, partenaires, fondateur, contact
- les CTA du hero mènent à la section suivante (#offre)
- le portrait du hero devient le lien vers le fondateur
- body[data-chapitre-rang] pour les scripts chargés après le premier chapitre

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2 : Le moteur d'intonations

**Files :**
- Create : `composants/son.js`
- Modify : `index.html` : `<head>` (une balise `<script defer>`)

**Interfaces :**
- Consumes : `fi:chapitre {id, rang, total}`, `fi:situation {id, origine}`, `fi:geste {chapitre, geste, etape?}`, `body[data-situation]`, `body[data-chapitre]`, `body[data-chapitre-rang]` (tâche 1).
- Produces : `window.FiSon = { actif(): boolean, basculer(): boolean, jouer(rang: number, timbre: 'aucune'|'convaincre'|'former'|'garder'): boolean }` ; événement `fi:son {actif: boolean}` ; clé `localStorage` `fi:son`.

- [ ] **Step 1 : Vérifier que rien n'existe encore**

Recharger `http://localhost:4000/?debug=1`, puis en JS : `typeof window.FiSon`
Expected : `"undefined"`

- [ ] **Step 2 : Écrire `composants/son.js`**

```js
/* ══════════════════════════════════════════════════════════════════════
   LE MOTEUR D'INTONATIONS (composants/son.js)
   spec : docs/superpowers/specs/2026-09-27-galerie-affordance-son-design.md § 6

   Ce qu'il fait : il ÉCOUTE le parcours (fi:chapitre, fi:situation,
   fi:geste) et répond par une note. Il ne connaît aucun composant, aucun
   sélecteur : un composant nouveau sonne sans qu'on touche à ce fichier.

   Ce qu'il promet :
     - coupé par défaut ; allumé seulement par FiSon.basculer() (le bouton
       son), et le choix est retenu (localStorage « fi:son ») ;
     - le moteur audio du navigateur n'existe pas tant qu'un geste ne l'a
       pas demandé : la page ne paie rien tant que le son est coupé ;
     - une gamme pentatonique : aucune combinaison ne sonne faux ;
     - le degré suit le chapitre, le timbre suit la situation ;
     - jamais d'exception : sans Web Audio ou sans stockage, il se tait.

   API    : window.FiSon = { actif(), basculer(), jouer(rang, timbre) }
   Émet   : fi:son {actif}
   Journal: « ?debug=1 » (clé fi:debug), préfixe [son].
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var DEBUG = false;
  try { DEBUG = localStorage.getItem('fi:debug') === '1'; } catch (e) {}
  function journal() {
    if (!DEBUG) return;
    var a = Array.prototype.slice.call(arguments);
    a.unshift('[son]');
    console.log.apply(console, a);
  }
  /* Une promesse rejetée ne doit jamais remonter en console. */
  function sansErreur(p) { if (p && typeof p.catch === 'function') p.catch(function () {}); }

  /* ── La gamme ─────────────────────────────────────────────────────────
     Pentatonique majeure en do, sur un peu plus de deux octaves. Le rang
     d'un chapitre (1 à 7) donne l'indice rang - 1 ; + 3 monte d'une quinte
     dans la gamme, + 5 d'une octave. */
  var GAMME = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
  var NOMS = ['do4', 'ré4', 'mi4', 'sol4', 'la4', 'do5', 'ré5', 'mi5', 'sol5', 'la5', 'do6'];

  /* ── Les timbres : un par situation ──────────────────────────────────
     attaque et déclin en secondes. `quinte` ajoute la quinte juste (× 1,5)
     à ce gain (0,25 ≈ −12 dB) ; `passeBas` adoucit les aigus (en Hz). */
  var TIMBRES = {
    aucune:     { onde: 'sine',     attaque: 0.015, declin: 0.6 },
    convaincre: { onde: 'triangle', attaque: 0.008, declin: 0.45 },
    former:     { onde: 'sine',     attaque: 0.015, declin: 0.7, quinte: 0.25 },
    garder:     { onde: 'triangle', attaque: 0.04,  declin: 0.9, passeBas: 1200 }
  };

  var VOLUME = 0.12;              /* gain maître : bas, jamais réglé par la page */
  var VOIX_MAX = 4;               /* l'accord de la réservation en compte 4 */
  var ECART_DECLENCHEMENT = 80;   /* ms entre deux déclenchements */
  var ECART_CHAPITRE = 400;       /* ms : pas de rejeu en oscillant au bord d'une section */
  var DELAI_SUSPENSION = 1500;    /* ms en arrière-plan avant de suspendre */

  var actif = false;
  try { actif = localStorage.getItem('fi:son') === '1'; } catch (e) {}
  var ctx = null;
  var maitre = null;
  var voix = 0;
  var dernierDeclenchement = -Infinity;
  /* ⚠️ Ce script est `defer` : le premier fi:chapitre est parti avant lui.
     Le rang de départ se lit donc sur <body>, posé par le premier script. */
  var rangCourant = parseInt(document.body.getAttribute('data-chapitre-rang'), 10) || 1;
  var dernierChapitre = document.body.getAttribute('data-chapitre');
  var chapitreA = -Infinity;
  var minuterieSuspension = 0;

  function situation() {
    var s = document.body.getAttribute('data-situation');
    return s && TIMBRES.hasOwnProperty(s) ? s : 'aucune';
  }

  /* ── Le moteur audio, créé par un geste seulement ────────────────────
     ⚠️ Les navigateurs refusent un son qui n'a pas été demandé par un
     geste (clic, touche). On ne crée donc le contexte QUE depuis un geste :
     le clic sur le bouton son, ou, si le son était allumé à la visite
     précédente, le premier clic ou la première touche dans la page. */
  function reveiller() {
    try {
      if (!ctx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) { journal('Web Audio absent : le son reste muet'); return false; }
        ctx = new AC();
        maitre = ctx.createGain();
        maitre.gain.value = VOLUME;
        maitre.connect(ctx.destination);
        journal('moteur audio créé');
      }
      if (ctx.state === 'suspended') sansErreur(ctx.resume());
      return true;
    } catch (e) {
      journal('moteur audio indisponible :', e && e.message);
      ctx = null;
      return false;
    }
  }

  /* ── Une voix : un ou deux oscillateurs, une enveloppe, un filtre ──── */
  function note(indice, nomTimbre, delai, court) {
    if (voix >= VOIX_MAX) { journal('note', NOMS[indice], 'ignorée :', VOIX_MAX, 'voix déjà'); return; }
    var tb = TIMBRES[nomTimbre] || TIMBRES.aucune;
    var declin = court ? tb.declin * 0.4 : tb.declin;
    var t = ctx.currentTime + (delai || 0);
    var fin = t + tb.attaque + declin;
    /* Rampes exponentielles : l'oreille entend en logarithme, une rampe
       linéaire paraîtrait s'éteindre d'un coup à la fin. */
    var env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(1, t + tb.attaque);
    env.gain.exponentialRampToValueAtTime(0.0001, fin);
    var filtre = null;
    if (tb.passeBas) {
      filtre = ctx.createBiquadFilter();
      filtre.type = 'lowpass';
      filtre.frequency.value = tb.passeBas;
      env.connect(filtre);
      filtre.connect(maitre);
    } else {
      env.connect(maitre);
    }
    var oscillateur = function (freq, gain) {
      var o = ctx.createOscillator();
      var g = ctx.createGain();
      o.type = tb.onde;
      o.frequency.value = freq;
      g.gain.value = gain;
      o.connect(g);
      g.connect(env);
      o.start(t);
      o.stop(fin + 0.05);
      return o;
    };
    var principal = oscillateur(GAMME[indice], 1);
    if (tb.quinte) oscillateur(GAMME[indice] * 1.5, tb.quinte);
    voix++;
    principal.onended = function () {
      voix--;
      try { env.disconnect(); if (filtre) filtre.disconnect(); } catch (e) {}
    };
  }

  /* ── Un déclenchement = une ou plusieurs notes ───────────────────────
     notes : [[indice dans la GAMME, délai en s], …]. Les notes d'un même
     arpège ne comptent pas dans l'écart de 80 ms : seul le déclenchement
     compte. */
  function declencher(nom, notes, court) {
    if (!actif || document.hidden || !ctx || ctx.state === 'closed') return;
    var maintenant = performance.now();
    if (maintenant - dernierDeclenchement < ECART_DECLENCHEMENT) {
      journal(nom, ': moins de', ECART_DECLENCHEMENT, 'ms après le précédent, ignoré');
      return;
    }
    dernierDeclenchement = maintenant;
    var timbre = situation();
    var noms = [];
    notes.forEach(function (n) {
      var i = Math.max(0, Math.min(GAMME.length - 1, n[0]));
      noms.push(NOMS[i]);
      note(i, timbre, n[1], court);
    });
    journal('♪', nom, ':', noms.join('-'), '· timbre', timbre);
  }

  /* ── Ce qui joue ─────────────────────────────────────────────────── */
  document.addEventListener('fi:chapitre', function (e) {
    var d = e.detail || {};
    if (!d.rang) return;
    rangCourant = d.rang;
    if (d.id === dernierChapitre) return;
    dernierChapitre = d.id;
    var maintenant = performance.now();
    var tropProche = maintenant - chapitreA < ECART_CHAPITRE;
    chapitreA = maintenant;
    if (tropProche) { journal('chapitre', d.id, ': moins de', ECART_CHAPITRE, 'ms après le précédent, muet'); return; }
    declencher('chapitre ' + d.id, [[d.rang - 1, 0]]);
  });

  document.addEventListener('fi:situation', function (e) {
    if (!e.detail || !e.detail.id) return;
    /* Le timbre est celui de la NOUVELLE situation : le parcours écrit
       body[data-situation] avant d'émettre. */
    declencher('situation ' + e.detail.id, [[0, 0], [2, 0.08], [3, 0.16]]);
  });

  var ORNEMENTS = {
    choix: function () { return [[rangCourant - 1, 0], [rangCourant + 2, 0.09]]; },
    etape: function (d) { return [[[0, 2, 3][Math.max(0, Math.min(2, (d.etape || 1) - 1))], 0]]; },
    relie: function () { return [[9, 0]]; },
    ouvre: function () { return [[3, 0], [5, 0.09]]; },
    rdv:   function () { return [[0, 0], [2, 0.06], [3, 0.12], [5, 0.18]]; }
  };
  var COURTS = { relie: true };
  document.addEventListener('fi:geste', function (e) {
    var d = e.detail || {};
    var ornement = ORNEMENTS[d.geste];
    if (ornement) declencher('geste ' + d.geste, ornement(d), COURTS[d.geste]);
    else declencher('geste ' + d.geste + ' (ornement par défaut)', [[rangCourant + 4, 0]], true);
  });

  /* ── L'arrière-plan ──────────────────────────────────────────────────
     ⚠️ Suspendre tout de suite couperait l'accord de la réservation :
     « Réserver 30 min » ouvre l'agenda dans un nouvel onglet, et l'accueil
     passe en arrière-plan au moment même où l'accord commence. */
  document.addEventListener('visibilitychange', function () {
    clearTimeout(minuterieSuspension);
    if (!ctx) return;
    if (document.hidden) {
      minuterieSuspension = setTimeout(function () {
        try { sansErreur(ctx.suspend()); journal('suspendu (onglet en arrière-plan)'); } catch (e) {}
      }, DELAI_SUSPENSION);
    } else if (actif) {
      reveiller();
      journal('repris (onglet au premier plan)');
    }
  });

  /* ── Son allumé à une visite précédente ──────────────────────────────
     Le moteur attend le premier geste dans la page pour naître. */
  function auPremierGeste() {
    document.removeEventListener('pointerdown', auPremierGeste, true);
    document.removeEventListener('keydown', auPremierGeste, true);
    if (actif && !ctx && reveiller()) journal('réveillé par le premier geste de la visite');
  }
  if (actif) {
    document.addEventListener('pointerdown', auPremierGeste, true);
    document.addEventListener('keydown', auPremierGeste, true);
  }

  /* ── L'API ───────────────────────────────────────────────────────── */
  function basculer() {
    actif = !actif;
    try { localStorage.setItem('fi:son', actif ? '1' : '0'); } catch (e) {}
    journal('son', actif ? 'allumé' : 'coupé');
    if (actif && reveiller()) declencher('confirmation', [[0, 0], [3, 0.09]]);
    document.dispatchEvent(new CustomEvent('fi:son', { detail: { actif: actif } }));
    return actif;
  }
  /* Pour la galerie : une note précise, dans un timbre précis. */
  function jouer(rang, timbre) {
    if (!actif || !reveiller()) return false;
    var i = Math.max(0, Math.min(GAMME.length - 1, (rang | 0) - 1));
    var t = TIMBRES.hasOwnProperty(timbre) ? timbre : 'aucune';
    note(i, t, 0);
    journal('♪ jouer', NOMS[i], '· timbre', t);
    return true;
  }

  window.FiSon = {
    actif: function () { return actif; },
    basculer: basculer,
    jouer: jouer
  };
  journal('prêt, son', actif ? 'allumé (en attente d\'un geste)' : 'coupé', '· chapitre de départ', rangCourant);
})();
```

- [ ] **Step 3 : Charger le moteur**

Dans `index.html`, juste après la balise Umami (`data-domains="…"></script>`), ajouter :
```html

  <!-- Les composants partagés (voir /galerie/), servis tels quels.
       ⚠️ `defer` s'exécute dans l'ordre d'écriture : son.js AVANT
       composants.js, qui lit window.FiSon pour le bouton son. -->
  <script defer src="/composants/son.js"></script>
```

- [ ] **Step 4 : Vérifier l'allumage et le chapitre**

Recharger `http://localhost:4000/?debug=1`. En JS :
```js
localStorage.removeItem('fi:son'); location.reload();
```
Puis :
```js
[typeof FiSon, FiSon.actif(), FiSon.basculer(), localStorage.getItem('fi:son')]
```
Expected : `["object", false, true, "1"]` ; console : `[son] prêt, son coupé · chapitre de départ 1`, `[son] son allumé`, `[son] moteur audio créé`, `[son] ♪ confirmation : do4-sol4 · timbre aucune`.

Dans un **second** appel (sinon la note tombe moins de 80 ms après l'accord de confirmation, et l'écart minimal l'ignore, à juste titre) :
```js
document.dispatchEvent(new CustomEvent('fi:chapitre', { detail: { id: 'demos', rang: 3, total: 7 } }));
document.dispatchEvent(new CustomEvent('fi:chapitre', { detail: { id: 'approche', rang: 4, total: 7 } }));
```
Expected console : `♪ chapitre demos : mi4`, puis `chapitre approche : moins de 400 ms après le précédent, muet`.

- [ ] **Step 5 : Arrivée par une ancre profonde (Review Focus 2)**

Le son est allumé (`fi:son` = `'1'`). Charger `http://localhost:4000/?debug=1#demos` par un **vrai rechargement** (`location.reload()` : changer seulement l'ancre ne recharge pas la page).
Expected console : `[son] prêt, son allumé (en attente d'un geste) · chapitre de départ 1`. C'est juste : la page part du haut, puis le navigateur descend à `#demos` en émettant `offre` puis `demos`, que le son reçoit.
Cliquer n'importe où dans la page. Expected : `[son] réveillé par le premier geste de la visite`. Puis, en JS : `document.dispatchEvent(new CustomEvent('fi:geste', { detail: { chapitre: 'demos', geste: 'test' } }))`. Expected : `♪ geste test (ornement par défaut) : mi5` (rang 3 + une octave : le degré courant est le bon).

- [ ] **Step 6 : L'accord de la réservation survit à l'arrière-plan (Review Focus 1)**

En JS :
```js
document.dispatchEvent(new CustomEvent('fi:geste', { detail: { chapitre: 'contact', geste: 'rdv' } }));
Object.defineProperty(document, 'hidden', { configurable: true, get: function () { return true; } });
document.dispatchEvent(new Event('visibilitychange'));
```
Expected : `♪ geste rdv : do4-mi4-sol4-do5` tout de suite ; **aucune** ligne `suspendu` avant 1,5 s ; `suspendu (onglet en arrière-plan)` après 1,5 s (relire la console à 0,5 s puis à 2 s). Recharger ensuite la page (le faux `hidden` disparaît).

- [ ] **Step 7 : Sans Web Audio (Review Focus 3)**

En JS : `localStorage.setItem('fi:son', '0'); location.reload();`, puis :
```js
window.AudioContext = undefined; window.webkitAudioContext = undefined;
[FiSon.basculer(), FiSon.jouer(3, 'garder')]
```
Expected : `[true, false]` ; console : `Web Audio absent : le son reste muet` ; aucune erreur (`read_console_messages` avec `onlyErrors`). Remettre `localStorage.setItem('fi:son', '0')` et recharger.

- [ ] **Step 8 : Commit**

```bash
git add composants/son.js index.html
git commit -m "feat(son): ajouter le moteur d'intonations" -m "Le sous-projet son du parcours : une note par chapitre, un timbre par situation, coupé par défaut.

- synthèse Web Audio, gamme pentatonique en do, aucun fichier son
- écoute fi:chapitre, fi:situation et fi:geste, émet fi:son
- moteur créé par un geste seulement, choix retenu (fi:son)
- suspension différée pour laisser finir l'accord de la réservation

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3 : Le socle visuel des composants

**Files :**
- Create : `composants/composants.css`
- Create : `composants/composants.js`
- Modify : `index.html` : `<head>` (une feuille, un script)

**Interfaces :**
- Consumes : `window.FiSon` (tâche 2) ; événement `fi:son`.
- Produces : `window.FiComposants = { eclat(el: Element, x?: number, y?: number): void, reflet(el: Element): void, activer(racine?: ParentNode): void }` ; attributs `data-composant="choix|bascule-son"`, `data-choix-item`, `data-eclat`, `data-reflet`, `data-geste="nom"`, `data-bascule-libelle`, `data-libelle-coupe`, `data-libelle-allume` ; classes `.fi-pilier` (+ `__icone`, `__texte`, `__fleche`), `.fi-choix`, `.fi-bascule-son` (+ `__icone`, `__ondes`, `__coupe`), `.fi-eclat`, `.fi-reflet`, `.fi-sobre` ; jetons `--fi-*`.

- [ ] **Step 1 : Vérifier que rien n'existe encore**

En JS : `typeof window.FiComposants`
Expected : `"undefined"`

- [ ] **Step 2 : Écrire `composants/composants.css`**

```css
/* ══════════════════════════════════════════════════════════════════════
   LES COMPOSANTS (composants/composants.css)
   spec : docs/superpowers/specs/2026-09-27-galerie-affordance-son-design.md § 5, § 7
   galerie vivante : /galerie/

   ⚠️ Ce fichier ne lit QUE ses jetons --fi-*. Chacun retombe sur la charte
   Fractal Innov (valeur de repli), et une page hôte peut les redéfinir
   pour une autre charte sans toucher aux règles.
   ⚠️ Chargé AVANT la feuille de la page : à spécificité égale, la page
   gagne. Les règles qui doivent tenir face à une classe de page sont donc
   écrites à deux classes (.fi-pilier .fi-pilier__icone).
   ══════════════════════════════════════════════════════════════════════ */
:root {
  --fi-fx-court: 180ms;
  --fi-fx-long: 700ms;
  --fi-ease-morph: var(--ease-morph, cubic-bezier(0.34, 1.2, 0.64, 1));
  --fi-ease-sortie: cubic-bezier(0.22, 1, 0.36, 1);
  --fi-texte: var(--text-main, #f0f0f0);
  --fi-texte-doux: var(--text-muted, rgba(240, 240, 240, 0.55));
  --fi-accent: var(--accent-blue, #6ea8ff);
  --fi-fond: var(--glass-bg, rgba(255, 255, 255, 0.03));
  --fi-fond-survol: var(--glass-bg-hover, rgba(255, 255, 255, 0.06));
  --fi-fond-plein: var(--bg-base-2, #0f1220);
  --fi-bordure: var(--glass-border-highlight, rgba(255, 255, 255, 0.2));
  --fi-degrade: var(--brand-gradient, linear-gradient(100deg, #6ea8ff 0%, #8b5cf6 52%, #f472b6 100%));
  --fi-eclat: var(--accent-pink, #f472b6);
  --fi-eclat-2: var(--accent-blue, #6ea8ff);
}

/* ── PILIER (d'après .hero-pillar de la landing STAND) ──────────────────
   Une carte cliquable : icône, texte, flèche qui glisse au survol. La
   flèche dit « ça mène quelque part » ; sur écran tactile (pas de
   survol), elle reste visible à demi. */
.fi-pilier {
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  column-gap: 0.7rem;
  min-height: 44px;
  padding: 0.75rem 1rem;
  border-radius: 16px;
  border: 1px solid var(--fi-bordure);
  background: var(--fi-fond);
  color: var(--fi-texte);
  font: inherit;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  transition: background var(--fi-fx-court) ease, border-color var(--fi-fx-court) ease,
              transform var(--fi-fx-court) var(--fi-ease-morph);
}
.fi-pilier .fi-pilier__icone {
  width: 22px; height: 22px; flex-shrink: 0;
  color: var(--fi-accent);
  fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;
}
.fi-pilier__texte { line-height: 1.3; font-size: 0.95rem; color: var(--fi-texte-doux); }
.fi-pilier__texte strong { display: block; color: var(--fi-texte); font-weight: 600; font-size: 1rem; }
.fi-pilier .fi-pilier__fleche {
  width: 18px; height: 18px;
  fill: none; stroke: currentColor; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round;
  color: var(--fi-texte-doux);
  opacity: 0; transform: translateX(-6px);
  transition: opacity var(--fi-fx-court) ease, transform 300ms var(--fi-ease-sortie);
}
.fi-pilier:hover,
.fi-pilier:focus-visible { background: var(--fi-fond-survol); border-color: var(--fi-accent); transform: translateY(-2px); }
.fi-pilier:hover .fi-pilier__fleche,
.fi-pilier:focus-visible .fi-pilier__fleche { opacity: 1; transform: none; }
.fi-pilier:active { transform: scale(0.98); }
@media (hover: none) { .fi-pilier .fi-pilier__fleche { opacity: 0.6; transform: none; } }
/* Choisi : bordure au dégradé de la marque (pressé pour un bouton,
   courant pour un lien). */
.fi-pilier[aria-pressed="true"],
.fi-pilier[aria-current="true"] {
  border-color: transparent;
  background: linear-gradient(var(--fi-fond-plein), var(--fi-fond-plein)) padding-box,
              var(--fi-degrade) border-box;
}

/* ── CHOIX : une rangée de piliers de même largeur (règle 9) ──────────── */
.fi-choix {
  list-style: none; margin: 0; padding: 0;
  display: grid; gap: 0.6rem;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
}
.fi-choix > li { display: flex; }
.fi-choix > li > .fi-pilier { flex: 1; }

/* ── BOUTON SON ─────────────────────────────────────────────────────────
   Icône ET libellé (règle 6) : les ondes quand il est allumé, la croix
   quand il est coupé. `hidden` tant que le JS ne l'a pas activé. */
.fi-bascule-son {
  display: inline-flex; align-items: center; gap: 0.5rem;
  min-height: 44px; padding: 0 0.9rem;
  border-radius: 999px; border: 1px solid var(--fi-bordure);
  background: var(--fi-fond); color: var(--fi-texte);
  font: inherit; font-size: 0.9rem; font-weight: 600; white-space: nowrap; cursor: pointer;
}
.fi-bascule-son[hidden] { display: none; }
.fi-bascule-son:hover { background: var(--fi-fond-survol); }
.fi-bascule-son .fi-bascule-son__icone {
  width: 20px; height: 20px; overflow: visible;
  fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;
}
.fi-bascule-son[aria-pressed="true"] .fi-bascule-son__icone { color: var(--fi-accent); }
.fi-bascule-son[aria-pressed="true"] .fi-bascule-son__coupe,
.fi-bascule-son[aria-pressed="false"] .fi-bascule-son__ondes { display: none; }
.fi-bascule-son__ondes { transform-origin: 30% 50%; }
.fi-son--joue .fi-bascule-son__ondes { animation: fiOndes 900ms var(--fi-ease-sortie); }
@keyframes fiOndes {
  0% { opacity: 0; transform: scale(0.6); }
  40% { opacity: 1; transform: scale(1.15); }
  100% { opacity: 1; transform: none; }
}

/* ── ÉCLAT : huit particules en étoile ──────────────────────────────────
   La boîte est posée dans <body>, aux coordonnées de la page (elle défile
   avec l'élément, sans être rognée par son `overflow`) ; chaque particule
   part dans son angle (--fi-angle) et s'éteint. */
.fi-eclat { position: absolute; width: 0; height: 0; pointer-events: none; z-index: 95; }
.fi-eclat > span {
  position: absolute; left: -3px; top: -3px;
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--fi-eclat);
  transform: rotate(var(--fi-angle)) translateX(0) scale(1);
  animation: fiEclat 520ms var(--fi-ease-sortie) forwards;
}
.fi-eclat > span:nth-child(even) { background: var(--fi-eclat-2); }
@keyframes fiEclat {
  to { transform: rotate(var(--fi-angle)) translateX(var(--fi-eclat-portee, 44px)) scale(0.2); opacity: 0; }
}

/* ── REFLET : une bande de lumière traverse l'élément, une fois ────────
   Un <span> posé dans l'hôte, qui porte son propre `overflow: hidden` et
   hérite du rayon : l'hôte n'a pas à changer son débordement. */
.fi-reflet {
  position: absolute; inset: 0; z-index: 2;
  border-radius: inherit; overflow: hidden; pointer-events: none;
}
.fi-reflet::before {
  content: ""; position: absolute; top: 0; bottom: 0; left: -60%; width: 45%;
  background: linear-gradient(105deg, transparent, rgba(255, 255, 255, 0.16) 50%, transparent);
  transform: skewX(-12deg);
  animation: fiReflet 900ms ease-out forwards;
}
@keyframes fiReflet { to { left: 120%; } }

/* ── MOUVEMENT RÉDUIT ───────────────────────────────────────────────────
   Préférence du système, ou démonstration forcée par la galerie
   (.fi-sobre sur un ancêtre). États finaux, aucun mouvement. */
@media (prefers-reduced-motion: reduce) {
  .fi-eclat, .fi-reflet { display: none; }
  .fi-pilier, .fi-pilier .fi-pilier__fleche { transition: none; }
  .fi-pilier:hover, .fi-pilier:focus-visible, .fi-pilier:active { transform: none; }
  .fi-son--joue .fi-bascule-son__ondes { animation: none; }
}
.fi-sobre .fi-eclat, .fi-sobre .fi-reflet { display: none; }
.fi-sobre .fi-pilier, .fi-sobre .fi-pilier .fi-pilier__fleche { transition: none; }
.fi-sobre .fi-pilier:hover, .fi-sobre .fi-pilier:focus-visible, .fi-sobre .fi-pilier:active { transform: none; }
.fi-sobre .fi-son--joue .fi-bascule-son__ondes { animation: none; }
```

- [ ] **Step 3 : Écrire `composants/composants.js`**

```js
/* ══════════════════════════════════════════════════════════════════════
   LES COMPOSANTS (composants/composants.js)
   spec : docs/superpowers/specs/2026-09-27-galerie-affordance-son-design.md § 5, § 7
   galerie vivante : /galerie/

   Un comportement par attribut, rien d'autre :
     data-composant="choix"        groupe de piliers, flèches du clavier
     data-composant="bascule-son"  le bouton son (lit window.FiSon)
     data-eclat                    un éclat de particules au clic
     data-reflet                   un reflet unique quand l'élément paraît
     data-geste="nom"              émet fi:geste {chapitre, geste} au clic
   ⚠️ Rien ici ne connaît le son : un geste passe par fi:geste, et c'est
   son.js qui choisit la note. Sans `data-geste`, un composant se tait.

   API    : window.FiComposants = { eclat(el, x?, y?), reflet(el), activer(racine?) }
   Journal: « ?debug=1 » (clé fi:debug), préfixe [composants].
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var DEBUG = false;
  try { DEBUG = localStorage.getItem('fi:debug') === '1'; } catch (e) {}
  function journal() {
    if (!DEBUG) return;
    var a = Array.prototype.slice.call(arguments);
    a.unshift('[composants]');
    console.log.apply(console, a);
  }

  var mouvementReduit = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : { matches: false };
  /* Sobre : préférence du système, ou démonstration forcée par la galerie. */
  function sobre(el) {
    return mouvementReduit.matches || !!(el && el.closest && el.closest('.fi-sobre'));
  }
  function emettre(nom, detail) {
    document.dispatchEvent(new CustomEvent(nom, { detail: detail }));
  }
  /* Le chapitre d'un geste : l'id de la section qui le contient. */
  function chapitreDe(el) {
    var s = el.closest('section[id]');
    return s ? s.id : 'page';
  }
  /* Un effet se pose DANS l'élément : il lui faut un repère de position. */
  function assurerPositionnement(el) {
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
  }
  /* Rejoue une classe d'animation, même si elle tournait déjà. */
  function rejouer(el, classe, duree) {
    el.classList.remove(classe);
    void el.offsetWidth;   /* force le navigateur à « voir » le retrait */
    el.classList.add(classe);
    clearTimeout(el['_fi_' + classe]);
    el['_fi_' + classe] = setTimeout(function () { el.classList.remove(classe); }, duree);
  }
  function retirerApres(el, duree) {
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, duree);
  }

  /* ── ÉCLAT ─────────────────────────────────────────────────────────
     ⚠️ La boîte est posée dans <body>, aux coordonnées de la PAGE, et non
     dans l'élément : un bouton en `overflow: hidden` (le CTA primaire de
     l'accueil, par exemple) rognerait les particules à son bord. En
     coordonnées de page, elle défile quand même avec l'élément. */
  var PARTICULES = 8;
  function eclat(el, x, y) {
    if (!el || sobre(el)) return;
    var r = el.getBoundingClientRect();
    var boite = document.createElement('span');
    boite.className = 'fi-eclat';
    boite.setAttribute('aria-hidden', 'true');
    boite.style.left = (window.scrollX + r.left + (x == null ? r.width / 2 : x)) + 'px';
    boite.style.top = (window.scrollY + r.top + (y == null ? r.height / 2 : y)) + 'px';
    for (var i = 0; i < PARTICULES; i++) {
      var p = document.createElement('span');
      p.style.setProperty('--fi-angle', (i * 360 / PARTICULES) + 'deg');
      boite.appendChild(p);
    }
    document.body.appendChild(boite);
    retirerApres(boite, 700);
    journal('éclat sur', el.tagName.toLowerCase() + (el.id ? '#' + el.id : ''));
  }

  /* ── REFLET ──────────────────────────────────────────────────────── */
  function reflet(el) {
    if (!el || sobre(el)) return;
    assurerPositionnement(el);
    var r = document.createElement('span');
    r.className = 'fi-reflet';
    r.setAttribute('aria-hidden', 'true');
    el.appendChild(r);
    retirerApres(r, 1000);
    journal('reflet sur', el.tagName.toLowerCase() + (el.id ? '#' + el.id : ''));
  }
  var observateurReflets = ('IntersectionObserver' in window)
    ? new IntersectionObserver(function (entrees) {
        entrees.forEach(function (en) {
          if (!en.isIntersecting) return;
          observateurReflets.unobserve(en.target);
          reflet(en.target);
        });
      }, { threshold: 0.5 })
    : null;

  /* ── CHOIX : les flèches du clavier passent d'un pilier à l'autre ────
     Un bouton reçoit aria-pressed ; un lien garde son aria-current, posé
     par la page (le choix de situation de l'accueil, par exemple). */
  function activerChoix(groupe) {
    var items = function () {
      return Array.prototype.slice.call(groupe.querySelectorAll('[data-choix-item]'));
    };
    groupe.addEventListener('click', function (e) {
      var item = e.target.closest('[data-choix-item]');
      if (!item || item.tagName !== 'BUTTON') return;
      items().forEach(function (b) {
        if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', b === item ? 'true' : 'false');
      });
    });
    groupe.addEventListener('keydown', function (e) {
      var sens = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (!sens) return;
      var liste = items();
      var i = liste.indexOf(document.activeElement);
      if (i < 0) return;
      e.preventDefault();
      liste[(i + sens + liste.length) % liste.length].focus();
    });
  }

  /* ── BOUTON SON ──────────────────────────────────────────────────── */
  function activerBasculeSon(btn) {
    if (!window.FiSon) { journal('bascule-son : FiSon absent, le bouton reste caché'); return; }
    var libelle = btn.querySelector('[data-bascule-libelle]');
    /* Chaque bouton peut porter ses mots (l'invitation du hero dit
       « Visite sonore ») ; sinon, les libellés par défaut. */
    var coupe = btn.getAttribute('data-libelle-coupe') || 'Son coupé';
    var allume = btn.getAttribute('data-libelle-allume') || 'Son allumé';
    var maj = function (actif) {
      btn.setAttribute('aria-pressed', actif ? 'true' : 'false');
      if (libelle) libelle.textContent = actif ? allume : coupe;
    };
    maj(window.FiSon.actif());
    btn.hidden = false;
    btn.addEventListener('click', function () { window.FiSon.basculer(); });
    /* Plusieurs boutons (dock, galerie) restent d'accord : ils écoutent
       tous fi:son au lieu de se croire sur parole. */
    document.addEventListener('fi:son', function (e) {
      maj(e.detail.actif);
      if (e.detail.actif && !sobre(btn)) rejouer(btn, 'fi-son--joue', 900);
    });
  }

  /* ── L'ACTIVATION ────────────────────────────────────────────────── */
  var ACTIVATEURS = { 'choix': activerChoix, 'bascule-son': activerBasculeSon };
  function activer(racine) {
    racine = racine || document;
    var n = 0;
    Array.prototype.forEach.call(racine.querySelectorAll('[data-composant]'), function (el) {
      if (el.hasAttribute('data-composant-actif')) return;
      var f = ACTIVATEURS[el.getAttribute('data-composant')];
      if (!f) return;
      el.setAttribute('data-composant-actif', '');
      f(el);
      n++;
    });
    if (observateurReflets) {
      Array.prototype.forEach.call(racine.querySelectorAll('[data-reflet]'), function (el) {
        if (el.hasAttribute('data-reflet-suivi')) return;
        el.setAttribute('data-reflet-suivi', '');
        observateurReflets.observe(el);
      });
    }
    return n;
  }

  /* Une seule écoute, déléguée, pour les éclats et les gestes : elle vaut
     aussi pour ce qui est ajouté plus tard dans la page. */
  document.addEventListener('click', function (e) {
    if (!e.target.closest) return;
    var cible = e.target.closest('[data-eclat]');
    if (cible) {
      var r = cible.getBoundingClientRect();
      /* Au clavier (e.detail === 0), pas de point de clic : le centre. */
      if (e.detail === 0) eclat(cible);
      else eclat(cible, e.clientX - r.left, e.clientY - r.top);
    }
    var geste = e.target.closest('[data-geste]');
    if (geste) {
      emettre('fi:geste', { chapitre: chapitreDe(geste), geste: geste.getAttribute('data-geste') });
    }
  });

  window.FiComposants = { eclat: eclat, reflet: reflet, activer: activer };
  journal('prêt :', activer(document), 'composant(s) activé(s)');
})();
```

- [ ] **Step 4 : Charger la feuille et le script**

Dans `index.html`, juste après `<script defer src="/composants/son.js"></script>`, ajouter :
```html
  <script defer src="/composants/composants.js"></script>
  <link rel="stylesheet" href="/composants/composants.css">
```

- [ ] **Step 5 : Vérifier l'éclat et le reflet**

Recharger `http://localhost:4000/?debug=1`. En JS :
```js
var b = document.querySelector('.hero__actions .hero-cta__btn');
FiComposants.eclat(b); FiComposants.reflet(b);
[typeof FiComposants, b.querySelectorAll('.fi-eclat > span').length, b.querySelectorAll('.fi-reflet').length]
```
Expected : `["object", 8, 1]`. Une seconde plus tard :
```js
document.querySelectorAll('.fi-eclat, .fi-reflet').length
```
Expected : `0` (retirés). Console : `[composants] prêt : 0 composant(s) activé(s)` (aucun `data-composant` dans la page à ce stade), aucune erreur.

- [ ] **Step 6 : Vérifier le mouvement réduit**

Émuler `prefers-reduced-motion: reduce` n'est pas possible depuis le JS : on passe par la classe de démonstration, qui suit le même chemin (`sobre()`).
```js
document.body.classList.add('fi-sobre');
var b = document.querySelector('.hero__actions .hero-cta__btn');
FiComposants.eclat(b); FiComposants.reflet(b);
var n = b.querySelectorAll('.fi-eclat, .fi-reflet').length;
document.body.classList.remove('fi-sobre'); n
```
Expected : `0`

- [ ] **Step 7 : Commit**

```bash
git add composants/composants.css composants/composants.js index.html
git commit -m "feat(composants): poser le socle partagé des composants" -m "Le dossier composants/ devient le template réutilisable des sites à venir.

- jetons --fi-* avec valeurs de repli sur la charte
- pilier, choix, bouton son, éclat, reflet
- comportements par attribut data-*, gestes émis en fi:geste
- mouvement réduit : système ou classe de démonstration .fi-sobre

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4 : Le bouton son (dock et invitation du hero), et sa mesure

**Files :**
- Modify : `index.html` : balisage du dock, CSS du dock (grand écran et pastille), second script (`MESURES`, écoute `fi:son`, exclusion de `rdv`, émission du geste `rdv`)

**Interfaces :**
- Consumes : `.fi-bascule-son`, `data-composant="bascule-son"`, `data-bascule-libelle` (tâche 3) ; `fi:son` (tâche 2).
- Produces : Umami `son-active`, `son-coupe` ; `fi:geste {chapitre: <id de section>, geste: 'rdv'}` au clic sur `[data-rdv]`.

- [ ] **Step 1 : Vérifier l'absence du bouton**

En JS : `document.querySelector('#dock .fi-bascule-son')`
Expected : `null`

- [ ] **Step 2 : Le balisage**

Dans le dock, juste avant `<button class="dock__fermer" …>`, ajouter :
```html
      <span class="dock__sep" aria-hidden="true"></span>
      <!-- Le bouton son (composants/composants.js). `hidden` : sans JS, ou
           sans le moteur son.js, il n'existe pas. -->
      <button class="fi-bascule-son dock__son" type="button"
              data-composant="bascule-son" aria-pressed="false" hidden>
        <svg class="fi-bascule-son__icone" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M11 5 6 9H3v6h3l5 4z"/>
          <path class="fi-bascule-son__ondes" d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>
          <path class="fi-bascule-son__coupe" d="M16 9.5l5 5M21 9.5l-5 5"/>
        </svg>
        <span data-bascule-libelle>Son coupé</span>
      </button>
```
Dans le commentaire au-dessus du dock, remplacer :
```
       dépend pas de sa place (`position: fixed`). Les
       emplacements du son et de la télécommande n'existent pas encore :
       aucun bouton mort tant que leur sous-projet n'est pas livré. -->
```
par :
```
       dépend pas de sa place (`position: fixed`). Le son a son bouton ;
       la télécommande n'existe pas encore : aucun bouton mort tant que
       son sous-projet n'est pas livré. -->
```

- [ ] **Step 2 bis : L'invitation « Visite sonore » du hero (spec § 3 ter)**

Le dock est caché sur le hero : c'est ce bouton qui permet d'allumer le
son avant le premier geste. Juste après le lien « Juste regarder », ajouter :
```html
          <!-- Le son s'allume ici, avant le premier geste (spec § 3 ter) ;
               ensuite le dock prend le relais. Même composant, ses mots à lui. -->
          <button class="fi-bascule-son situations__son" type="button"
                  data-composant="bascule-son" aria-pressed="false" hidden
                  data-libelle-coupe="Visite sonore" data-libelle-allume="Visite sonore activée">
            <svg class="fi-bascule-son__icone" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M11 5 6 9H3v6h3l5 4z"/>
              <path class="fi-bascule-son__ondes" d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>
              <path class="fi-bascule-son__coupe" d="M16 9.5l5 5M21 9.5l-5 5"/>
            </svg>
            <span data-bascule-libelle>Visite sonore</span>
          </button>
```
**Point de co-conception** : montrer le hero rendu à Corentin (bordure
pointillée, taille, libellés) avant de passer au CSS du dock ; ajuster
selon son retour.

- [ ] **Step 3 : Le CSS**

Pour l'invitation du hero, dans le bloc PARCOURS :
```css
    /* L'invitation « Visite sonore » : une pilule discrète, en pointillé
       tant que le son est coupé (une invitation, pas un bouton de plus). */
    .situations__son { border-style: dashed; color: var(--text-soft); }
    .situations__son[aria-pressed="true"] { border-style: solid; color: var(--text-main); }
```

⚠️ `.dock button` (deux sélecteurs) bat `.fi-bascule-son` (une classe) : fond,
bordure et couleur du dock s'appliquent, c'est voulu ; le survol se
redéclare à la bonne spécificité. Juste après la règle `.dock__menu button[aria-current="true"] { … }`, ajouter :
```css
    .dock .fi-bascule-son { font-size: 0.9rem; }
    .dock .fi-bascule-son:hover { background: var(--glass-bg-hover); }
```
Dans `@media (max-width: 767px)`, remplacer :
```css
        grid-template-areas: "prec pos pos suiv" "sit sit fermer fermer";
```
par :
```css
        grid-template-areas: "prec pos pos suiv" "sit sit sit sit" "son son fermer fermer";
```
et, juste après `.dock__choix { width: 100%; }`, ajouter :
```css
      .dock__son { grid-area: son; justify-content: center; }
```

- [ ] **Step 4 : La mesure et le geste de réservation**

Dans `MESURES`, après `contactDirect: 'contact-direct'`, ajouter (virgule sur la ligne précédente) :
```js
        sonActive: 'son-active',
        sonCoupe: 'son-coupe'
```
Remplacer l'écoute des gestes :
```js
      document.addEventListener('fi:geste', function (e) {
        var d = e.detail;
        mesurerUneFois('geste:' + d.chapitre + ':' + d.geste, MESURES.geste, { chapitre: d.chapitre, geste: d.geste });
      });
```
par :
```js
      document.addEventListener('fi:geste', function (e) {
        var d = e.detail;
        /* ⚠️ La réservation est déjà comptée par `rdv-demande` : la
           compter aussi en `geste` la doublerait sous un autre nom. */
        if (d.geste === 'rdv') return;
        mesurerUneFois('geste:' + d.chapitre + ':' + d.geste, MESURES.geste, { chapitre: d.chapitre, geste: d.geste });
      });
      document.addEventListener('fi:son', function (e) {
        mesurer(e.detail.actif ? MESURES.sonActive : MESURES.sonCoupe, { situation: situationActuelle() });
      });
```
Dans l'écoute déléguée des clics, remplacer :
```js
        if (rdv) {
          mesurer(MESURES.rdvDemande, { situation: situationActuelle(), emplacement: rdv.getAttribute('data-rdv') });
          return;
        }
```
par :
```js
        if (rdv) {
          mesurer(MESURES.rdvDemande, { situation: situationActuelle(), emplacement: rdv.getAttribute('data-rdv') });
          /* La réservation devient aussi un geste, pour que le son la
             résolve (spec 2026-09-27 § 3). */
          var sectionRdv = rdv.closest('section[id]');
          emettre('fi:geste', { chapitre: sectionRdv ? sectionRdv.id : 'top', geste: 'rdv' });
          return;
        }
```

- [ ] **Step 5 : Vérifier en grand écran**

Recharger `http://localhost:4000/?debug=1#demos` (1440 × 900), attendre 2 s. En JS :
```js
var s = document.querySelector('#dock .fi-bascule-son');
[s.hidden, s.getAttribute('aria-pressed'), s.textContent.trim()]
```
Expected : `[false, "false", "Son coupé"]`. Cliquer le bouton (outil `computer`, clic réel : c'est un geste). Expected : libellé `Son allumé`, console `[parcours] mesure : son-active {situation: 'aucune'}` (ou `mesure ignorée (script absent) : son-active …` si Umami n'a pas chargé) et `[son] ♪ confirmation : do4-sol4`. Capture d'écran du dock.

Cliquer « Réserver 30 min » dans l'approche puis revenir sur l'onglet de l'accueil. Expected console : une ligne `mesure` (ou `mesure ignorée`) `: rdv-demande …`, `[son] ♪ geste rdv : do4-mi4-sol4-do5`, et **aucune** ligne de mesure `geste` avec `geste: 'rdv'`. Fermer l'onglet de l'agenda. Recliquer le bouton son (retour à `Son coupé`).

- [ ] **Step 6 : Vérifier sur téléphone**

`resize_window` preset `mobile`, recharger `http://localhost:4000/?debug=1#demos`, toucher la pastille. En JS :
```js
var s = document.querySelector('#dock .fi-bascule-son'), r = s.getBoundingClientRect();
[getComputedStyle(s).display !== 'none', Math.round(r.height) >= 44, document.documentElement.scrollWidth]
```
Expected : `[true, true, 375]`. Capture d'écran du dock déplié. Revenir en preset `desktop`.

Sur le hero, cliquer « Visite sonore » : son libellé passe à « Visite sonore activée », et celui du dock (plus bas) à « Son allumé » ; recliquer l'un éteint les deux.

- [ ] **Step 7 : Commit**

```bash
git add index.html
git commit -m "feat(dock): ajouter le bouton son et sa mesure" -m "Le son est coupé par défaut : le visiteur l'allume depuis le dock, sur grand écran comme dans la pastille.

- bouton son (icône et libellé) dans le dock et le dock déplié
- mesures son-active et son-coupe
- la réservation émet un geste rdv pour le son, exclu de la mesure geste

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5 : La passe sur le hero

Les trois boutons de situation deviennent des piliers ; le clic choisit,
lance l'éclat et l'accord, puis descend à l'offre, où la carte choisie
reçoit un reflet.

**Files :**
- Modify : `index.html` : balisage `.situations`, CSS du parcours (retrait des règles `.situation-btn`, ajout `.situations .fi-choix`, focus des sections), bloc mouvement réduit, second script (écoute du choix de situation)

**Interfaces :**
- Consumes : `.fi-pilier`, `.fi-choix`, `data-composant="choix"`, `data-choix-item`, `data-eclat`, `FiComposants.reflet` (tâche 3) ; `choisirSituation(id, origine)`, `sobre`, `journal` (second script).
- Produces : rien de nouveau pour la suite.

- [ ] **Step 1 : Vérifier l'état de départ**

En JS : `document.querySelectorAll('.situations .fi-pilier').length`
Expected : `0`

- [ ] **Step 2 : Le balisage des piliers**

Remplacer la `<ul class="situations__liste" …>…</ul>` du hero par :
```html
          <ul class="situations__liste fi-choix" aria-labelledby="situationsQuestion" data-composant="choix">
            <li><a class="fi-pilier" href="#offre" data-situation-choix="convaincre" data-choix-item data-eclat>
              <svg class="pic fi-pilier__icone" aria-hidden="true"><use href="#pic-convaincre"></use></svg>
              <span class="fi-pilier__texte"><strong>Convaincre</strong> un acheteur</span>
              <svg class="fi-pilier__fleche" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </a></li>
            <li><a class="fi-pilier" href="#offre" data-situation-choix="former" data-choix-item data-eclat>
              <svg class="pic fi-pilier__icone" aria-hidden="true"><use href="#pic-former"></use></svg>
              <span class="fi-pilier__texte"><strong>Former</strong> un nouvel arrivant</span>
              <svg class="fi-pilier__fleche" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </a></li>
            <li><a class="fi-pilier" href="#offre" data-situation-choix="garder" data-choix-item data-eclat>
              <svg class="pic fi-pilier__icone" aria-hidden="true"><use href="#pic-garder"></use></svg>
              <span class="fi-pilier__texte"><strong>Garder</strong> un savoir-faire</span>
              <svg class="fi-pilier__fleche" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </a></li>
          </ul>
```

- [ ] **Step 3 : Le CSS de la page**

Supprimer le bloc des pilules, de `/* Le choix du hero : trois pilules, le même poids pour les trois. */` à la règle `.situation-btn[aria-current="true"] { … }` incluse, **sauf** les trois premières règles (`.situations`, `.situations__question`, `.situations__liste`), et remplacer la règle `.situations__liste { … }` par :
```css
    /* Le choix du hero : trois piliers (composants/composants.css, .fi-pilier),
       de même largeur (règle 9), sur une rangée dès 768 px. La page ne
       règle que leur place. */
    .situations__liste.fi-choix { width: min(100%, 48rem); }
    @media (min-width: 768px) {
      .situations__liste.fi-choix { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    }
```
Juste après, ajouter :
```css
    /* Une section qui reçoit le focus par script (le hero y descend) ne
       s'encadre pas : le focus sert au prochain Tab, pas au regard. */
    section[tabindex="-1"]:focus { outline: none; }
```
Dans le bloc `@media (prefers-reduced-motion: reduce)`, retirer la ligne `.situation-btn,` de la liste du parcours.

Run : `grep -n 'situation-btn' index.html`
Expected : aucune ligne.

- [ ] **Step 4 : Le choix, puis la descente**

Dans le second script, remplacer :
```js
      /* Le lien du hero garde son ancre : on choisit, PUIS le navigateur
         descend à la carte, comme sans JavaScript. */
      document.addEventListener('click', function (e) {
        var cible = e.target.closest && e.target.closest('[data-situation-choix]');
        if (!cible) return;
        var v = cible.getAttribute('data-situation-choix');
        choisirSituation(v === 'aucune' ? null : v, cible.getAttribute('data-origine') || 'hero');
      });
```
par :
```js
      /* Le hero : on choisit, l'éclat et l'accord partent, PUIS on descend
         à la section suivante (#offre). 220 ms : le temps de voir l'éclat
         avant que la page ne glisse ; rien en mouvement réduit. Sans
         JavaScript, le lien mène au même endroit. Les boutons du dock
         n'ont pas d'ancre : ils choisissent sans faire défiler. */
      var DELAI_DESCENTE = 220;
      var descenteEnCours = 0;
      document.addEventListener('click', function (e) {
        var cible = e.target.closest && e.target.closest('[data-situation-choix]');
        if (!cible) return;
        var v = cible.getAttribute('data-situation-choix');
        choisirSituation(v === 'aucune' ? null : v, cible.getAttribute('data-origine') || 'hero');
        var ancre = cible.getAttribute('href');
        var dest = ancre && ancre.charAt(0) === '#' ? document.getElementById(ancre.slice(1)) : null;
        if (!dest) return;
        e.preventDefault();
        /* Un double clic ne descend qu'une fois. */
        clearTimeout(descenteEnCours);
        descenteEnCours = setTimeout(function () { descendreA(dest, v); }, sobre ? 0 : DELAI_DESCENTE);
      });
      function descendreA(dest, v) {
        dest.scrollIntoView({ behavior: sobre ? 'auto' : 'smooth', block: 'start' });
        /* Le focus suit, comme avec une ancre : le prochain Tab part de là. */
        if (!dest.hasAttribute('tabindex')) dest.setAttribute('tabindex', '-1');
        dest.focus({ preventScroll: true });
        /* À l'arrivée, un reflet unique sur la carte de la situation. */
        var carte = v && v !== 'aucune' ? document.getElementById('usage-' + v) : null;
        if (carte && window.FiComposants) {
          setTimeout(function () { window.FiComposants.reflet(carte); }, sobre ? 0 : 900);
        }
        journal('hero → #' + dest.id + (carte ? ', reflet sur ' + carte.id : ''));
      }
```

- [ ] **Step 5 : Vérifier le rendu**

Recharger `http://localhost:4000/?debug=1` en 1440 × 900 : capture d'écran du hero (trois piliers sur une rangée, même largeur). Survoler un pilier : la flèche glisse (capture zoomée). `resize_window` preset `mobile`, recharger : capture (piliers empilés), puis en JS :
```js
[document.documentElement.scrollWidth,
 [...document.querySelectorAll('.situations .fi-pilier')].map(a => Math.round(a.getBoundingClientRect().height) >= 44).join(),
 new Set([...document.querySelectorAll('.situations .fi-pilier')].map(a => Math.round(a.getBoundingClientRect().width))).size]
```
Expected : `[375, "true,true,true", 1]`. Revenir en preset `desktop`.

- [ ] **Step 6 : Vérifier le choix à la souris**

Allumer le son par un clic réel sur le bouton du dock (défiler jusqu'aux démos pour qu'il paraisse). Remonter en haut, cliquer « Garder un savoir-faire ». Expected console, dans l'ordre (le script de la page écoute avant `composants.js`, chargé en `defer`) : `[son] ♪ situation garder : do4-mi4-sol4 · timbre garder`, `[composants] éclat sur a`, `[parcours] hero → #offre, reflet sur usage-garder`, puis `[son] ♪ chapitre offre : ré4 · timbre garder`, `[composants] reflet sur article#usage-garder`. En JS après 2 s :
```js
[document.body.dataset.situation, document.body.dataset.chapitre, document.activeElement.id]
```
Expected : `["garder", "offre", "offre"]`

- [ ] **Step 7 : Vérifier au clavier (Review Focus 4)**

Recharger `http://localhost:4000/?debug=1`, placer le focus sur le premier pilier (`document.querySelector('.situations .fi-pilier').focus()`), puis la flèche droite du clavier : le focus passe au deuxième pilier (`document.activeElement.textContent` contient « Former »). Touche Entrée. Après 2 s : `document.activeElement.id` = `"offre"`. Touche Tab : `document.activeElement.closest('#offre') !== null` = `true`.

- [ ] **Step 8 : Vérifier le double clic (Review Focus 5)**

Remonter en haut. En JS :
```js
var p = document.querySelector('.situations .fi-pilier[data-situation-choix="convaincre"]');
p.click(); p.click();
```
Expected console : une seule ligne `hero → #offre`, un seul `♪ situation convaincre` (le second clic ne change pas de situation : `choisirSituation` sort tôt), aucune erreur.

- [ ] **Step 9 : Vérifier sans JavaScript et en mouvement réduit**

Run : `grep -c 'class="fi-pilier" href="#offre" data-situation-choix' index.html`
Expected : `3` (sans JS, chaque pilier est un lien vers `#offre`).

En JS : `document.body.classList.add('fi-sobre')` puis cliquer « Former » : aucun `.fi-eclat` créé (`[composants] éclat` absent de la console), la descente part aussitôt. Retirer la classe. Couper le son (retour à `Son coupé`).

- [ ] **Step 10 : Commit**

```bash
git add index.html
git commit -m "feat(hero): passer le choix de situation en piliers qui mènent à l'offre" -m "Le choix du hero ne disait pas où il menait : trois pilules identiques, sans suite visible.

- trois piliers (icône, libellé, flèche) de même largeur, flèches du clavier
- le clic choisit, lance l'éclat et l'accord, puis descend à #offre
- le focus suit la descente ; un reflet signale la carte choisie
- sans JavaScript, chaque pilier reste un lien vers #offre

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6 : La galerie

**Files :**
- Create : `galerie/index.html`

**Interfaces :**
- Consumes : tout `composants/` (tâches 2 et 3).
- Produces : la page `/galerie/`, que chaque PR suivante enrichit d'une section.

- [ ] **Step 1 : Vérifier l'absence de la page**

Run : `curl -s -o /dev/null -w '%{http_code}\n' http://localhost:4000/galerie/`
Expected : `404`

- [ ] **Step 2 : Écrire `galerie/index.html`**

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Galerie de composants</title>
  <!-- ⚠️ Un outil de travail, pas une page de l'offre : hors index et hors
       sitemap.xml. -->
  <meta name="robots" content="noindex, nofollow">
  <meta name="description" content="Les composants partagés des sites Fractal Innov, vivants, avec leur markup à copier.">
  <link rel="icon" href="/icones/fi-32.png" sizes="32x32" type="image/png">
  <!-- Exactement comme l'accueil : son.js avant composants.js. -->
  <script defer src="/composants/son.js"></script>
  <script defer src="/composants/composants.js"></script>
  <link rel="stylesheet" href="/composants/composants.css">
  <style>
    /* La galerie ne porte que ses jetons de page (mêmes valeurs que
       l'accueil) : les composants lisent les leurs (--fi-*). */
    :root {
      --bg-base: #090b13; --bg-base-2: #0f1220;
      --text-main: #f0f0f0; --text-muted: rgba(240, 240, 240, 0.55);
      --accent-blue: #6ea8ff; --accent-blue-light: #a8c8ff;
      --accent-purple: #8b5cf6; --accent-pink: #f472b6;
      --glass-border: rgba(255, 255, 255, 0.08);
    }
    *, *::before, *::after { box-sizing: border-box; }
    body {
      margin: 0; line-height: 1.6; color: var(--text-main);
      background: linear-gradient(180deg, var(--bg-base), var(--bg-base-2));
      font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
    }
    a { color: var(--accent-blue-light); }
    :focus-visible { outline: 2px solid var(--accent-blue-light); outline-offset: 3px; }
    .g-page { width: min(100% - 2rem, 1100px); margin-inline: auto; padding: 2.5rem 0 5rem; }
    h1 { font-size: clamp(1.8rem, 1.4rem + 2vw, 2.6rem); line-height: 1.15; margin: 0.5rem 0; }
    h2 { font-size: 1.35rem; margin: 0 0 0.25rem; }
    code { color: var(--accent-blue-light); }
    .g-doux { color: var(--text-muted); }
    .g-outils {
      position: sticky; top: 0; z-index: 5;
      display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center;
      margin: 1.5rem 0 2rem; padding: 0.75rem 0; background: var(--bg-base);
    }
    .g-bouton {
      font: inherit; font-size: 0.9rem; min-height: 44px; padding: 0 1rem; cursor: pointer;
      border-radius: 999px; border: 1px solid rgba(255, 255, 255, 0.2);
      background: rgba(255, 255, 255, 0.04); color: var(--text-main);
    }
    .g-bouton[aria-pressed="true"] { border-color: var(--accent-blue); background: rgba(110, 168, 255, 0.12); }
    .g-composant {
      margin-bottom: 1.5rem; padding: 1.5rem;
      border: 1px solid var(--glass-border); border-radius: 16px; background: rgba(255, 255, 255, 0.02);
    }
    .g-demo { margin: 1rem 0; padding: 1.5rem; border-radius: 12px; background: rgba(0, 0, 0, 0.25); }
    .g-code { position: relative; }
    .g-code pre {
      margin: 0; padding: 1rem; padding-right: 7rem; overflow-x: auto;
      border-radius: 12px; background: #05060c; font-size: 0.8rem; line-height: 1.5;
    }
    .g-code .g-bouton { position: absolute; top: 0.5rem; right: 0.5rem; }
    .g-contrat { margin: 0.75rem 0 0; font-size: 0.9rem; color: var(--text-muted); }
    .g-carte {
      max-width: 22rem; padding: 1.25rem; border-radius: 16px;
      border: 1px solid var(--glass-border); background: rgba(255, 255, 255, 0.04);
    }
    .g-clavier { display: grid; gap: 0.5rem; }
    .g-clavier__rang { display: grid; grid-template-columns: 7rem repeat(7, minmax(0, 1fr)); gap: 0.35rem; align-items: center; }
    .g-clavier__rang .g-bouton { padding: 0; border-radius: 10px; }
    .g-journal {
      max-height: 12rem; overflow: auto; margin: 0; padding: 0.75rem 1rem 0.75rem 2.25rem;
      border-radius: 12px; background: #05060c; font: 0.8rem/1.5 ui-monospace, monospace;
    }
    table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
    th, td { text-align: left; padding: 0.4rem 0.6rem; border-bottom: 1px solid var(--glass-border); vertical-align: top; }
    @media (max-width: 640px) {
      .g-clavier__rang { grid-template-columns: repeat(7, minmax(0, 1fr)); }
      .g-clavier__rang > span { grid-column: 1 / -1; }
      table { font-size: 0.8rem; }
    }
  </style>
</head>
<body>
  <!-- Un pictogramme générique pour les démos (l'accueil a les siens). -->
  <svg width="0" height="0" style="position:absolute" aria-hidden="true">
    <symbol id="g-pic" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8 12.5l3 3 5-6"/></symbol>
  </svg>

  <main class="g-page">
    <p><a href="/">← Retour à l'accueil</a></p>
    <h1>Galerie de composants</h1>
    <p class="g-doux">Les composants partagés des sites Fractal Innov, vivants. Pour les
      réutiliser : copier le dossier <code>/composants/</code>, charger
      <code>son.js</code> puis <code>composants.js</code> en <code>defer</code> et
      <code>composants.css</code>, poser les attributs montrés ici. Une autre charte :
      redéfinir les jetons <code>--fi-*</code>.</p>

    <div class="g-outils">
      <button class="fi-bascule-son" type="button" data-composant="bascule-son" aria-pressed="false" hidden>
        <svg class="fi-bascule-son__icone" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M11 5 6 9H3v6h3l5 4z"/>
          <path class="fi-bascule-son__ondes" d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>
          <path class="fi-bascule-son__coupe" d="M16 9.5l5 5M21 9.5l-5 5"/>
        </svg>
        <span data-bascule-libelle>Son coupé</span>
      </button>
      <button class="g-bouton" type="button" id="gSobre" aria-pressed="false">Mouvement réduit</button>
    </div>

    <section class="g-composant" id="contrat">
      <h2>Le contrat</h2>
      <p class="g-doux">Les composants et le son ne se connaissent pas : ils se parlent par
        des événements sur <code>document</code>.</p>
      <table>
        <thead><tr><th>Événement</th><th>Émis par</th><th>Écouté par</th></tr></thead>
        <tbody>
          <tr><td><code>fi:chapitre {id, rang, total}</code></td><td>la page</td><td>son, mesure, dock</td></tr>
          <tr><td><code>fi:situation {id, origine}</code></td><td>la page</td><td>son, mesure</td></tr>
          <tr><td><code>fi:geste {chapitre, geste, etape?}</code></td><td>page, composants (<code>data-geste</code>)</td><td>son, mesure</td></tr>
          <tr><td><code>fi:son {actif}</code></td><td><code>son.js</code></td><td>bouton son, mesure</td></tr>
        </tbody>
      </table>
    </section>

    <section class="g-composant" id="choix">
      <h2>Pilier et choix</h2>
      <p class="g-doux">D'après les piliers du hero de STAND. La flèche dit « ça mène
        quelque part » ; les flèches du clavier passent d'un pilier à l'autre.</p>
      <div class="g-demo" data-exemple>
        <ul class="fi-choix" data-composant="choix" aria-label="Exemple de choix">
          <li><button class="fi-pilier" type="button" data-choix-item data-eclat data-geste="choix" aria-pressed="false">
            <svg class="fi-pilier__icone" aria-hidden="true"><use href="#g-pic"></use></svg>
            <span class="fi-pilier__texte"><strong>Premier</strong> un sous-titre</span>
            <svg class="fi-pilier__fleche" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </button></li>
          <li><button class="fi-pilier" type="button" data-choix-item data-eclat data-geste="choix" aria-pressed="false">
            <svg class="fi-pilier__icone" aria-hidden="true"><use href="#g-pic"></use></svg>
            <span class="fi-pilier__texte"><strong>Deuxième</strong> un sous-titre</span>
            <svg class="fi-pilier__fleche" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </button></li>
        </ul>
      </div>
      <div class="g-code"><pre><code></code></pre><button class="g-bouton" type="button">Copier</button></div>
      <p class="g-contrat">Lit : <code>data-composant="choix"</code>, <code>data-choix-item</code>,
        <code>aria-pressed</code> (bouton) ou <code>aria-current</code> (lien, posé par la page).
        Émet : <code>fi:geste</code> si <code>data-geste</code>.</p>
    </section>

    <section class="g-composant" id="eclat">
      <h2>Éclat</h2>
      <p class="g-doux">Huit particules au point du clic, puis plus rien. Au clavier, depuis le centre.</p>
      <div class="g-demo" data-exemple>
        <button class="g-bouton" type="button" data-eclat>Cliquer ici</button>
      </div>
      <div class="g-code"><pre><code></code></pre><button class="g-bouton" type="button">Copier</button></div>
      <p class="g-contrat">Lit : <code>data-eclat</code>. En script :
        <code>FiComposants.eclat(el, x?, y?)</code>.</p>
    </section>

    <section class="g-composant" id="reflet">
      <h2>Reflet</h2>
      <p class="g-doux">Une bande de lumière traverse l'élément, une fois, quand il paraît
        à moitié à l'écran.</p>
      <div class="g-demo" data-exemple>
        <div class="g-carte" data-reflet>
          <strong>Une carte</strong>
          <p class="g-doux">Elle reçoit un reflet à sa première apparition.</p>
        </div>
      </div>
      <p><button class="g-bouton" type="button" id="gReflet">Rejouer le reflet</button></p>
      <div class="g-code"><pre><code></code></pre><button class="g-bouton" type="button">Copier</button></div>
      <p class="g-contrat">Lit : <code>data-reflet</code>. En script : <code>FiComposants.reflet(el)</code>.</p>
    </section>

    <section class="g-composant" id="bascule-son">
      <h2>Bouton son</h2>
      <p class="g-doux">Coupé par défaut, icône et libellé. Deux boutons restent d'accord :
        celui-ci et celui du haut.</p>
      <div class="g-demo" data-exemple>
        <button class="fi-bascule-son" type="button" data-composant="bascule-son" aria-pressed="false" hidden>
          <svg class="fi-bascule-son__icone" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M11 5 6 9H3v6h3l5 4z"/>
            <path class="fi-bascule-son__ondes" d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>
            <path class="fi-bascule-son__coupe" d="M16 9.5l5 5M21 9.5l-5 5"/>
          </svg>
          <span data-bascule-libelle>Son coupé</span>
        </button>
      </div>
      <div class="g-code"><pre><code></code></pre><button class="g-bouton" type="button">Copier</button></div>
      <p class="g-contrat">Lit : <code>data-composant="bascule-son"</code>, <code>data-bascule-libelle</code>,
        <code>window.FiSon</code>. Écoute : <code>fi:son</code>.</p>
    </section>

    <section class="g-composant" id="intonations">
      <h2>Le moteur d'intonations</h2>
      <p class="g-doux">Gamme pentatonique en do : le degré suit le chapitre, le timbre suit
        la situation. Allumer le son, puis écouter.</p>
      <div class="g-clavier" id="gClavier"></div>
      <p class="g-contrat" id="gClavierMessage" aria-live="polite"></p>
    </section>

    <section class="g-composant" id="journal">
      <h2>Le journal des événements</h2>
      <p class="g-doux">Les douze derniers <code>fi:*</code> reçus par la page.</p>
      <ol class="g-journal" id="gJournal" reversed></ol>
    </section>
  </main>

  <script>
    /* ⚠️ Ce script inline s'exécute AVANT les scripts `defer` : il lit le
       markup des démos tant qu'aucun composant ne l'a encore modifié
       (hidden retiré, attributs d'activation). Le code montré est donc
       celui à copier, pas l'état de la page. */
    (function () {
      'use strict';

      /* ── Le markup de chaque démo, désindenté, dans son bloc de code ── */
      function desindenter(texte) {
        var lignes = texte.replace(/^\n+|\s+$/g, '').split('\n');
        var marge = Math.min.apply(null, lignes.filter(function (l) { return l.trim(); })
          .map(function (l) { return l.match(/^ */)[0].length; }));
        return lignes.map(function (l) { return l.slice(marge); }).join('\n');
      }
      Array.prototype.forEach.call(document.querySelectorAll('.g-composant'), function (bloc) {
        var demo = bloc.querySelector('[data-exemple]');
        var code = bloc.querySelector('.g-code code');
        var bouton = bloc.querySelector('.g-code .g-bouton');
        if (!demo || !code) return;
        var texte = desindenter(demo.innerHTML);
        code.textContent = texte;
        bouton.addEventListener('click', function () {
          var fait = function (msg) { bouton.textContent = msg; setTimeout(function () { bouton.textContent = 'Copier'; }, 1500); };
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(texte).then(function () { fait('Copié'); }, function () { fait('Copie refusée'); });
          } else {
            fait('Copie indisponible');
          }
        });
      });

      /* ── Mouvement réduit forcé (.fi-sobre, lu par les composants) ── */
      var sobre = document.getElementById('gSobre');
      sobre.addEventListener('click', function () {
        var on = document.body.classList.toggle('fi-sobre');
        sobre.setAttribute('aria-pressed', on ? 'true' : 'false');
      });

      document.getElementById('gReflet').addEventListener('click', function () {
        if (window.FiComposants) window.FiComposants.reflet(document.querySelector('#reflet .g-carte'));
      });

      /* ── Le clavier sonore : 4 timbres × 7 degrés ── */
      var TIMBRES = [['aucune', 'Neutre'], ['convaincre', 'Convaincre'], ['former', 'Former'], ['garder', 'Garder']];
      var NOTES = ['do4', 'ré4', 'mi4', 'sol4', 'la4', 'do5', 'ré5'];
      var CHAPITRES = ['Accueil', 'Trois usages', 'Ça tourne déjà', "L'approche", 'Partenaires', 'Le fondateur', 'Contact'];
      var clavier = document.getElementById('gClavier');
      var message = document.getElementById('gClavierMessage');
      TIMBRES.forEach(function (t) {
        var rang = document.createElement('div');
        rang.className = 'g-clavier__rang';
        var nom = document.createElement('span');
        nom.textContent = t[1];
        rang.appendChild(nom);
        NOTES.forEach(function (n, i) {
          var b = document.createElement('button');
          b.type = 'button';
          b.className = 'g-bouton';
          b.textContent = n;
          b.title = 'Chapitre ' + (i + 1) + ' : ' + CHAPITRES[i] + ', timbre ' + t[1];
          b.addEventListener('click', function () {
            var ok = window.FiSon && window.FiSon.jouer(i + 1, t[0]);
            message.textContent = ok ? n + ', ' + t[1] + ' (' + CHAPITRES[i] + ')' : 'Allumez le son (bouton en haut) pour écouter.';
          });
          rang.appendChild(b);
        });
        clavier.appendChild(rang);
      });

      /* ── Le journal des fi:* ── */
      var liste = document.getElementById('gJournal');
      ['fi:chapitre', 'fi:situation', 'fi:geste', 'fi:son'].forEach(function (nom) {
        document.addEventListener(nom, function (e) {
          var li = document.createElement('li');
          li.textContent = new Date().toLocaleTimeString('fr-FR') + '  ' + nom + ' ' + JSON.stringify(e.detail);
          liste.insertBefore(li, liste.firstChild);
          while (liste.children.length > 12) liste.removeChild(liste.lastChild);
        });
      });
    })();
  </script>
</body>
</html>
```

- [ ] **Step 3 : Vérifier la page**

Ouvrir `http://localhost:4000/galerie/?debug=1`. En JS :
```js
[document.querySelector('meta[name="robots"]').content,
 document.querySelectorAll('.g-code code').length,
 document.querySelector('#choix .g-code code').textContent.indexOf('data-composant-actif'),
 document.querySelectorAll('.fi-bascule-son:not([hidden])').length,
 document.querySelectorAll('#gClavier button').length]
```
Expected : `["noindex, nofollow", 4, -1, 2, 28]`. Console : `[composants] prêt : 3 composant(s) activé(s)`, aucune erreur.

Cliquer le bouton son du haut : les **deux** boutons passent à « Son allumé ». Cliquer `sol4` du rang Garder : message `sol4, Garder (L'approche)`, console `[son] ♪ jouer sol4 · timbre garder`. Cliquer « Premier » : éclat, `aria-pressed="true"`, journal de la page : une ligne `fi:geste {"chapitre":"choix","geste":"choix"}`. Captures d'écran en 1440 et en preset `mobile` (clavier sur deux lignes par timbre, largeur 375). Couper le son.

Run : `grep -c galerie sitemap.xml`
Expected : `0`

- [ ] **Step 4 : Commit**

```bash
git add galerie/index.html
git commit -m "feat(galerie): ouvrir la galerie des composants partagés" -m "La galerie est le template vivant des sites et expériences à venir.

- chaque composant en démo, avec son markup à copier et son contrat
- clavier sonore : sept degrés, quatre timbres
- journal des fi:* et mouvement réduit forcé
- noindex, absente du plan du site

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7 : Vérification finale et PR

**Files :**
- Modify : `VENTE.md` (journal)
- Create : `.github/pr-galerie-son.md`

- [ ] **Step 1 : Le poids**

Run : `cat index.html composants/composants.css composants/composants.js composants/son.js | wc -c`
Expected : moins de `512000` (500 Ko). Relever aussi `cat index.html composants/*.css composants/*.js | gzip -c | wc -c` pour la PR.

- [ ] **Step 2 : Le texte visible**

Sur `/` puis sur `/galerie/`, en JS : `[document.body.innerText.includes('—'), document.body.innerText.includes('€')]`
Expected : `[false, false]` sur les deux pages (les commentaires du code ne comptent pas : on lit le texte rendu).

- [ ] **Step 3 : Le parcours complet, son allumé**

Sur `http://localhost:4000/?debug=1`, son allumé, défiler du hero au contact avec « › » du dock, une fois par seconde. Expected console, dans l'ordre : `♪ chapitre offre : ré4`, `demos : mi4`, `approche : sol4`, `partenaires : la4`, `fondateur : do5`, `contact : ré5`. Choisir « Garder » par le dock : les notes suivantes portent `timbre garder`. Aucune erreur (`read_console_messages`, `onlyErrors`).

- [ ] **Step 4 : Sans JavaScript**

Run : `curl -s http://localhost:4000/ | grep -c 'href="#offre" data-situation-choix'`
Expected : `4`. Et : `curl -s http://localhost:4000/ | grep -o 'data-composant="bascule-son" aria-pressed="false" hidden'` : une ligne (le bouton son est caché sans JS).

- [ ] **Step 5 : Le journal de la fiche de vente**

À la fin de `VENTE.md`, section Journal, ajouter :
```markdown
- 2026-09-27 : l'accueil suit l'ordre réponse, preuve, méthode, confiance
  (hero, trois usages, démos, approche, partenaires, fondateur, contact) ;
  les choix du hero mènent à l'offre, le fondateur arrive juste avant la
  réservation (« celui que vous aurez en face »). Un son discret, coupé
  par défaut, accompagne le parcours.
```

- [ ] **Step 6 : La description de PR**

Écrire `.github/pr-galerie-son.md` : Pourquoi / Ce qui change / Vérifié (chiffres relevés aux étapes précédentes) / Reste à valider par Corentin (rendu et écoute, grand écran et vrai téléphone, mouvement réduit dans DevTools › Rendering, le libellé des timbres à l'oreille) / Hors de cette PR (PR 2 à 7 de la spec § 11), terminé par la ligne `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.

- [ ] **Step 7 : Commit, poussée, PR**

```bash
git add VENTE.md .github/pr-galerie-son.md
git commit -m "docs(vente): consigner le nouvel ordre de l'accueil et le son" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git push -u origin feat/galerie-affordance-son
gh pr create --base main --title "feat: galerie de composants, son et passe sur le hero" --body-file .github/pr-galerie-son.md
```

## Après ce plan

Les PR 2 à 7 de la spec (§ 11) auront chacune leur plan court : fondateur
(`carte-etiquette`), approche (`frise`), offre (`pivot`), démos (`groupe`),
partenaires (`fil`), contact (`partage` + QR). Chacune ajoute sa section à
`/galerie/`.
