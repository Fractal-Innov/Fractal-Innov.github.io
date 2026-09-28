# Partage et télécommande : plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Un bouton « Partager » (dock et contact) qui partage l'endroit où
l'on est par QR ou lien, et qui tend la page en télécommande : un QR,
et le téléphone d'une personne qui découvre le site pilote l'écran.

**Architecture:** Site statique sans compilation. Le dock gagne un 5e état,
`partage`, rempli par `composants/partage.js`. La télécommande côté écran
(`composants/telecommande-ecran.js`) parle au relais WebSocket du Salon
déjà en ligne, sans rien changer côté serveur ; la page téléphone
`/telecommande/` est autonome. Tout passe par des événements `fi:*`.

**Tech Stack:** HTML, CSS, JavaScript ES5 (style du dépôt), WebSocket,
qrcode-generator 1.4.4 (MIT), Node 22 (outil de simulation du téléphone).

**Spec:** `docs/superpowers/specs/2026-09-28-partage-telecommande-design.md`

## Global Constraints

- Relais : `wss://stand-demonstrateur.osc-fr1.scalingo.io/ws-remote` ; PIN `123456` (non secret, spec § 12).
- Salle : exactement 8 caractères `[a-z0-9]`, tirée par onglet, `sessionStorage` clé `fi:salle` ; jamais de repli sur la salle `borne`.
- Lien d'endroit : `https://www.fractal-innov.fr/?situation=<id>#<chapitre>` (situation si choisie, chapitre hors `top`).
- Lien de télécommande : `https://www.fractal-innov.fr/telecommande/?salle=<salle>`.
- Chapitres : `top`, `offre`, `demos`, `approche`, `equipe`, `contact`. Situations : `convaincre`, `former`, `garder` (affichée « Conserver »).
- Présence : `BONJOUR` toutes les 20 s ; témoin éteint 45 s après le dernier ; indisponible après 20 s sans inscription ; reconnexion 1 s › 10 s.
- Aucune connexion au relais tant que l'onglet Télécommande n'a pas été ouvert dans cet onglet du navigateur.
- Cibles tactiles ≥ 44 px ; rien ne déborde à 360 px ; `prefers-reduced-motion` : état final direct.
- Journaux `?debug=1` (clé `fi:debug`), préfixes `[partage]`, `[telecommande]` ; ils racontent le déroulé.
- Aucun tiret cadratin dans un texte visible. Pas de point final dans les titres.
- **Règles de l'atelier** : les fichiers `.html` s'éditent par script (python ou heredoc), jamais avec Edit/Write ; `git` et `gh` sont tapés par l'utilisateur (commande exacte + pourquoi) ; messages de commit dans un fichier, `git commit -F`, puis `rm`.
- **Co-création** : chaque point 🎨 est une petite boucle : montrer les pistes, poser la question, attendre la réponse avant de coder la partie concernée. L'utilisateur valide lui-même le rendu.

## Review Focus

1. Téléphone ouvert sur `/telecommande/` sans `salle` ou avec une salle invalide : message « Lien incomplet », aucune connexion (jamais la borne du salon). Test : Tâche 5, étape 5.
2. Relais endormi (6,8 s) ou injoignable : « Préparation de la télécommande… », puis « Télécommande indisponible pour le moment » à 20 s ; « Cet endroit » reste utilisable. Test : Tâche 4, étape 6.
3. Commande inconnue ou `navItemId` du Salon (`logiciel`, etc.) : ignorée et journalisée, l'écran ne bouge pas. Test : Tâche 4, étape 5.
4. « Partager » cliqué pendant la question du dock : ignoré, la question reste et la page reste verrouillée. Test : Tâche 2, étape 5.
5. Téléphone parti (écran verrouillé, onglet fermé) : témoin éteint après 45 s ; écran rechargé : même salle, téléphone reconnecté sans rescanner. Test : Tâche 4, étape 7.

---

### Tâche 1 : ménage de la copie `stand/`

**Files:**
- Delete: `stand/index.html` (copie Tailwind du 08/09, masquée en ligne par le dépôt `Fractal-Innov/stand`, spec § 3)

- [ ] **Étape 1 : vérifier qu'aucun fichier du dépôt ne dépend du dossier**

Run: `grep -rn "stand/index\|/stand/assets" --include='*.html' --include='*.js' --include='*.json' . | grep -v '^./stand/'`
Expected: aucune ligne (les liens `/stand/` vers la page en ligne restent valides : c'est le dépôt `stand` qui la sert).

- [ ] **Étape 2 : l'utilisateur retire le dossier** (`git rm` retire le fichier du disque ET de l'index ; récupérable avec `git restore --source=HEAD stand/` tant que rien n'est commité)

```bash
git rm -r stand/
```

- [ ] **Étape 3 : commit** (message dans `msg-stand.txt`)

```
chore(stand): retirer la copie Tailwind masquée par le dépôt stand

www.fractal-innov.fr/stand/ est servi par le dépôt Fractal-Innov/stand
(GitHub Pages, master). Cette copie du 08/09 ne s'affichait nulle part
et prêtait à confusion avec la page validée.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
```

```bash
git commit -F msg-stand.txt
```

```bash
rm msg-stand.txt
```

---

### Tâche 2 : le bouton « Partager » et l'état `partage` du dock

**Files:**
- Modify: `index.html` (rangée du dock, vue `partage` dans `.fi-dock__bandeau`, ligne du sommaire) : par script python
- Modify: `composants/dock.js` (état `partage`, `fi:partager`, fermeture, garde)
- Modify: `composants/composants.css` (bouton, témoin, ligne du sommaire, vue)

**Interfaces:**
- Produces : événement `fi:partager {mode: 'endroit' | 'telecommande'}` ; `FiDock.etat()` peut valoir `'partage'` ; attribut `data-telecommande="connectee"` lu par le CSS du témoin ; marqueurs `[data-partage-mode]`, `[data-partage-ou]`, `[data-partage-qr]`, `[data-partage-consigne]`, `[data-partage-lien]`, `[data-partage-copier]`, `[data-partage-envoyer]`, `[data-partage-etat]`, `[data-partage-annonce]` dans la vue.

- [ ] **Étape 1 : 🎨 boucle de co-création, la place du bouton au téléphone**

Mesure : 7 cibles de 44 px font déjà ~335 px ; une 8e ne tient pas à 360 px.
Montrer et demander :
  - **A (recommandée)** : au bureau, « Partager » dans la rangée ; au téléphone, une ligne « Partager cette page » en bas du sommaire (bouton Tous). Au téléphone, le partage n'a ni QR ni télécommande : il est secondaire.
  - **B** : au téléphone, « Partager » remplace le bouton son dans la rangée, le son passe dans le sommaire.
  - **C** : au téléphone, le glyphe Fi (retour au début) quitte la rangée, « Départ » passe dans le sommaire.
Et le témoin de connexion : **point vert fixe** (recommandé, lisible d'un coup d'œil) ou **anneau qui respire une fois** à la connexion puis reste.
Coder la suite selon la réponse (le code ci-dessous suit A + point vert).

- [ ] **Étape 2 : le balisage** (python, une assertion par remplacement)

```python
p = 'index.html'; s = open(p).read()
def rep(a, b):
    global s
    assert s.count(a) == 1, a
    s = s.replace(a, b)
QR = ('<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1"/>'
      '<rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>'
      '<path d="M14 14h3v3h-3zM20 14h1v1h-1zM14 20h1v1h-1zM18 18h3v3h-3z"/></svg>')
# 1. Le bouton, entre Son et Réserver
rep('''      <!-- Réserver : descend au contact''', '''      <!-- Partager : le bandeau « partage » (cet endroit, la télécommande),
           spec partage-telecommande § 5. Au téléphone, il passe dans le
           sommaire (la rangée est pleine à 360 px). -->
      <button class="fi-dock__btn fi-dock__partager" type="button" data-dock-partager
              aria-expanded="false" aria-controls="dockBandeau" title="Partager cette page">
        ''' + QR + '''
        <span class="fi-dock__libelle">Partager</span>
        <span class="fi-dock__temoin" aria-hidden="true"></span>
      </button>
      <!-- Réserver : descend au contact''')
# 2. La ligne du sommaire (téléphone)
rep('''          <li><a href="#contact" data-dock-chapitre="contact">Contact</a></li>
        </ol>''', '''          <li><a href="#contact" data-dock-chapitre="contact">Contact</a></li>
        </ol>
        <button class="fi-dock__partager-ligne" type="button" data-dock-partager aria-expanded="false" aria-controls="dockBandeau">
          ''' + QR + '''Partager cette page
        </button>''')
# 3. La vue « partage », après le sommaire
i = s.index('<nav class="fi-dock__vue fi-dock__vue--sommaire"')
j = s.index('</nav>', i) + len('</nav>')
s = s[:j] + '''

      <!-- partage : rempli par composants/partage.js (lien, QR, onglets). -->
      <section class="fi-dock__vue fi-dock__vue--partage" data-dock-vue="partage" hidden
               role="dialog" aria-labelledby="dockPartageTitre">
        <button class="fi-dock__fermer" type="button" data-dock-fermer aria-label="Fermer">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>
        </button>
        <p class="fi-dock__titre" id="dockPartageTitre">Partager cette page</p>
        <div class="fi-partage__modes" role="tablist" aria-label="Quoi partager">
          <button type="button" role="tab" id="partageOngletEndroit" aria-selected="true" aria-controls="partageCorps" data-partage-mode="endroit">Cet endroit</button>
          <button type="button" role="tab" id="partageOngletTele" aria-selected="false" aria-controls="partageCorps" tabindex="-1" data-partage-mode="telecommande" hidden>Télécommande</button>
        </div>
        <div class="fi-partage__corps" id="partageCorps" role="tabpanel">
          <div class="fi-partage__qr" data-partage-qr role="img" aria-label="QR code du lien affiché" hidden></div>
          <div class="fi-partage__texte">
            <p class="fi-partage__ou"><span class="fi-partage__point" aria-hidden="true"></span><span data-partage-ou>Le haut de la page</span></p>
            <p class="fi-partage__consigne" data-partage-consigne></p>
            <code class="fi-partage__lien" data-partage-lien></code>
            <div class="fi-partage__actions">
              <button class="fi-partage__btn" type="button" data-partage-copier>Copier le lien</button>
              <button class="fi-partage__btn fi-partage__btn--plein" type="button" data-partage-envoyer hidden>Envoyer</button>
            </div>
            <p class="fi-partage__etat" data-partage-etat></p>
          </div>
        </div>
        <span class="sr-only" aria-live="polite" data-partage-annonce></span>
      </section>''' + s[j:]
open(p, 'w').write(s)
```

- [ ] **Étape 3 : dock.js**

Après `var boutonsSituation = …` :

```js
  var boutonsPartager = dock.querySelectorAll('[data-dock-partager]');
  function marquerPartager(ouvert) {
    Array.prototype.forEach.call(boutonsPartager, function (b) { b.setAttribute('aria-expanded', ouvert ? 'true' : 'false'); });
  }
```

Dans `ouvrir()`, après `boutonTous.setAttribute(…)` : `marquerPartager(nouvel === 'partage');`
Dans `replier()`, après `boutonTous.setAttribute('aria-expanded', 'false');` : `marquerPartager(false);`

Remplacer `dock.querySelector('[data-dock-fermer]').addEventListener('click', function () { replier('croix'); });` par :

```js
  /* Une croix par vue qui en a une (situation, partage). */
  Array.prototype.forEach.call(dock.querySelectorAll('[data-dock-fermer]'), function (b) {
    b.addEventListener('click', function () { replier('croix'); });
  });
  /* Partager : le bouton de la rangée (bureau), la ligne du sommaire
     (téléphone) et « Emporter cette page » du contact passent tous par
     fi:partager, la porte du bandeau « partage » (spec partage § 4). */
  Array.prototype.forEach.call(boutonsPartager, function (b) {
    b.addEventListener('click', function () {
      if (etat === 'partage') { replier('re-clic sur Partager'); return; }
      emettre('fi:partager', { mode: 'endroit' });
    });
  });
  document.addEventListener('fi:partager', function (e) {
    if (etat === 'question') { journal('fi:partager ignoré : la question attend sa réponse'); return; }
    ouvrir('partage', (e.detail && e.detail.mode) || 'endroit');
  });
```

Dans les écouteurs Échap et `pointerdown`, remplacer `(etat === 'situation' || etat === 'sommaire')` par `(etat === 'situation' || etat === 'sommaire' || etat === 'partage')` (deux occurrences).

Dans `verifier()`, avant `if (fautes.length)` :

```js
    if (rangee.scrollWidth > rangee.clientWidth + 1) fautes.push('rangée qui déborde (' + rangee.scrollWidth + ' px pour ' + rangee.clientWidth + ')');
```

Mettre à jour l'en-tête du fichier : cinq états, `partage` ajouté, `fi:partager` dans « Écoute ».

- [ ] **Étape 4 : composants.css**, bloc « partage » après celui du sommaire

```css
/* ── partage : Cet endroit / Télécommande (spec partage-telecommande § 5) ── */
.fi-dock__partager { position: relative; }
/* Le témoin : un téléphone pilote la page (telecommande-ecran.js pose
   data-telecommande sur le dock). */
.fi-dock__temoin {
  position: absolute; top: 9px; right: 9px; width: 8px; height: 8px; border-radius: 50%;
  background: #34d399; box-shadow: 0 0 0 2px var(--fi-fond-plein); display: none;
}
.fi-dock[data-telecommande="connectee"] .fi-dock__temoin { display: block; }
.fi-dock__partager-ligne { display: none; }
@media (max-width: 767px) {
  .fi-dock__rangee [data-dock-partager] { display: none; } /* la rangée est pleine : il passe dans le sommaire */
  .fi-dock__partager-ligne {
    display: flex; align-items: center; gap: var(--fi-e1); width: 100%; min-height: 44px;
    margin-top: var(--fi-e2); padding: 0 var(--fi-e2);
    border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 12px; background: none;
    color: var(--fi-texte); font: inherit; font-weight: 600; cursor: pointer;
  }
  .fi-dock__partager-ligne svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
}
.fi-dock__vue--partage { padding: var(--fi-e3); }
.fi-partage__modes { display: inline-flex; gap: 4px; padding: 4px; margin: var(--fi-e2) 0; border-radius: 999px; background: rgba(255, 255, 255, 0.05); }
.fi-partage__modes [role="tab"] {
  min-height: 36px; padding: 0 var(--fi-e2); border: 0; border-radius: 999px; background: none;
  color: var(--fi-texte-doux); font: inherit; font-size: var(--fi-t-05); font-weight: 600; cursor: pointer;
}
.fi-partage__modes [role="tab"][aria-selected="true"] { background: var(--fi-fond-survol); color: var(--fi-texte); }
.fi-partage__modes [role="tab"]:focus-visible { outline: 2px solid var(--fi-accent); outline-offset: 2px; }
.fi-partage__modes [hidden] { display: none; }
.fi-partage__corps { display: flex; gap: var(--fi-e3); align-items: center; }
.fi-partage__texte { min-width: 0; flex: 1; }
.fi-partage__qr { flex-shrink: 0; width: 148px; height: 148px; padding: 10px; border-radius: 12px; background: #fff; transform-origin: bottom center; }
.fi-partage__qr[hidden] { display: none; }
.fi-partage__qr svg { display: block; width: 100%; height: 100%; }
.fi-partage__qr--pli { animation: fiQrPli 250ms var(--fi-ease-sortie) both; } /* le QR se déplie, comme /stand/ */
@keyframes fiQrPli { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: none; } }
.fi-partage__ou { display: flex; align-items: center; gap: var(--fi-e1); margin: 0; font-weight: 600; color: var(--fi-texte); }
.fi-partage__point { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; background: var(--fi-accent); box-shadow: 0 0 0 4px color-mix(in oklab, var(--fi-accent) 25%, transparent); }
.fi-partage__consigne { margin: var(--fi-e1) 0 0; font-size: var(--fi-t-05); color: var(--fi-texte-doux); }
.fi-partage__lien { display: block; margin-top: var(--fi-e1); font-size: var(--fi-t-1); color: var(--fi-texte-doux); overflow-wrap: anywhere; user-select: all; }
.fi-partage__actions { display: flex; flex-wrap: wrap; gap: var(--fi-e1); margin-top: var(--fi-e2); }
.fi-partage__btn {
  min-height: 44px; padding: 0 var(--fi-e2); border: 1px solid rgba(255, 255, 255, 0.16); border-radius: 12px;
  background: none; color: var(--fi-texte); font: inherit; font-weight: 600; cursor: pointer;
}
.fi-partage__btn--plein { border-color: transparent; background: var(--fi-degrade); color: #fff; }
.fi-partage__btn:focus-visible { outline: 2px solid var(--fi-accent); outline-offset: 2px; }
.fi-partage__btn[hidden] { display: none; }
.fi-partage__etat { margin: var(--fi-e2) 0 0; font-size: var(--fi-t-05); color: #34d399; }
.fi-partage__etat:empty { display: none; }
@media (prefers-reduced-motion: reduce) { .fi-partage__qr--pli { animation: none; } }
```

- [ ] **Étape 5 : vérifier dans le navigateur** (serveur `accueil-fi-revue`, `?debug=1`)

```js
// Bureau 1440 : le bouton ouvre la vue, re-clic la ferme
document.querySelector('.fi-dock__rangee [data-dock-partager]').click();
[FiDock.etat(), document.querySelector('[data-dock-vue="partage"]').hidden]   // ['partage', false]
document.querySelector('.fi-dock__rangee [data-dock-partager]').click();
FiDock.etat()                                                                 // 'replie'
// Review Focus 4 : pendant la question (charger ?debug=1&question=1)
document.dispatchEvent(new CustomEvent('fi:partager', { detail: { mode: 'endroit' } }));
[FiDock.etat(), document.documentElement.classList.contains('fi-verrou')]      // ['question', true]
```

Puis `resize_window` 360 × 740 : `FiDock.verifier()` n'écrit aucune faute (pas de « rangée qui déborde ») ; la ligne « Partager cette page » est dans le sommaire.

- [ ] **Étape 6 : l'utilisateur valide le rendu, puis commit** (`msg-partage-dock.txt`)

```
feat(dock): ouvrir un bandeau « Partager » depuis la rangée

- bouton Partager entre Son et Réserver, ligne du sommaire au téléphone
- cinquième état du dock, `partage`, ouvert par fi:partager
- Échap, clic dehors et croix le ferment ; ignoré pendant la question
- garde : la rangée ne doit pas déborder

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
```

```bash
git add index.html composants/dock.js composants/composants.css
```

```bash
git commit -F msg-partage-dock.txt
```

```bash
rm msg-partage-dock.txt
```

---

### Tâche 3 : « Cet endroit » (lien, QR, copier, envoyer) et « Emporter cette page »

**Files:**
- Create: `composants/partage.js`
- Create: `composants/vendor/qrcode.min.js` (copie de `../stand/assets/js/qrcode.min.js`, en-tête MIT conservé)
- Modify: `index.html` (script `partage.js` après `dock.js`, bouton du contact, mesure `partage-ouvert`, CSS du bouton du contact) : par script python

**Interfaces:**
- Consumes : `fi:partager {mode}` (Tâche 2), la vue et ses marqueurs `[data-partage-*]`, `body[data-chapitre]`, `body[data-situation]`, `fi:chapitre`, `fi:situation`.
- Consumes (facultatif, Tâche 4) : `window.FiTelecommande = { demarrer(): void, etat(): 'eteinte'|'connexion'|'prete'|'connectee'|'indisponible', url(): string }` et l'événement `fi:telecommande {etat, salle, url}`. Tant qu'il n'existe pas, l'onglet Télécommande reste masqué.
- Produces : `[data-partager-endroit]` (tout bouton de la page qui ouvre le partage).

- [ ] **Étape 1 : 🎨 boucle de co-création, la mise en page du bandeau et du bouton du contact**

Montrer et demander :
  - Bandeau au bureau : **A (recommandée)** QR à gauche, texte à droite (le bandeau reste bas, la page reste visible) ; **B** empilé et centré comme /stand/ (QR au-dessus).
  - « Emporter cette page » dans le contact : **A (recommandée)** lien discret souligné, picto QR, sous « Vous repartez avec… » ; **B** une 5e icône dans la rangée des liens (carte, e-mail, LinkedIn, Instagram).
Coder selon la réponse (le code suit A + A).

- [ ] **Étape 2 : la bibliothèque QR**

Run: `mkdir -p composants/vendor && cp ../stand/assets/js/qrcode.min.js composants/vendor/qrcode.min.js && head -c 120 composants/vendor/qrcode.min.js`
Expected: `/* qrcode-generator 1.4.4, Kazuhiko Arase, licence MIT : https://github.com/kazuhikoarase/qrcode-generator */`

- [ ] **Étape 3 : `composants/partage.js`**

```js
/* ══ LE PARTAGE : CET ENDROIT, OU LA TÉLÉCOMMANDE ═════════════════════
   spec : docs/superpowers/specs/2026-09-28-partage-telecommande-design.md § 5
   dock.js ouvre la vue « partage » sur fi:partager ; ce script la REMPLIT.

     - Cet endroit : le lien de la page réglé (situation choisie, chapitre
       en cours), « Vous êtes ici », le QR, Copier, Envoyer. Mis à jour en
       direct tant que la vue est ouverte.
     - Télécommande : l'état vient de telecommande-ecran.js
       (window.FiTelecommande, fi:telecommande) ; sans lui, l'onglet reste
       masqué. Au téléphone, ni QR ni onglet Télécommande.
     - Le QR (qrcode-generator 1.4.4, MIT, 20 Ko) n'est chargé qu'à la
       première ouverture.

   Écoute : fi:partager {mode}, fi:chapitre, fi:situation, fi:telecommande
   Émet   : fi:partager {mode} (changement d'onglet, bouton du contact)
   Journal : « ?debug=1 » (clé fi:debug), préfixe [partage].
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var DEBUG = false;
  try { DEBUG = localStorage.getItem('fi:debug') === '1'; } catch (e) {}
  function journal() {
    if (!DEBUG) return;
    var a = Array.prototype.slice.call(arguments);
    a.unshift('%c[partage]', 'color:#6ea8ff');
    console.log.apply(console, a);
  }
  function emettre(nom, detail) { document.dispatchEvent(new CustomEvent(nom, { detail: detail })); }

  var vue = document.querySelector('[data-dock-vue="partage"]');
  if (!vue) return;
  var onglets = Array.prototype.slice.call(vue.querySelectorAll('[data-partage-mode]'));
  var ongletTele = vue.querySelector('[data-partage-mode="telecommande"]');
  var zoneOu = vue.querySelector('[data-partage-ou]');
  var zoneQr = vue.querySelector('[data-partage-qr]');
  var zoneConsigne = vue.querySelector('[data-partage-consigne]');
  var zoneLien = vue.querySelector('[data-partage-lien]');
  var zoneEtat = vue.querySelector('[data-partage-etat]');
  var zoneAnnonce = vue.querySelector('[data-partage-annonce]');
  var boutonCopier = vue.querySelector('[data-partage-copier]');
  var boutonEnvoyer = vue.querySelector('[data-partage-envoyer]');

  var SITE = 'https://www.fractal-innov.fr/';
  var LIEUX = { top: 'Le haut de la page', offre: "L'offre", demos: 'Démos', approche: "L'approche", equipe: "L'équipe", contact: 'Contact' };
  var POUR = { convaincre: 'pour convaincre', former: 'pour former', garder: 'pour conserver' };
  var CONSIGNES = {
    endroit: "Scannez avec l'appareil photo du téléphone : la page s'ouvre au même endroit",
    telecommande: 'Scannez avec le téléphone : il pilote cette page',
    connexion: 'Préparation de la télécommande…',
    eteinte: 'Préparation de la télécommande…',
    indisponible: 'Télécommande indisponible pour le moment'
  };
  var CONNECTEE = 'Un téléphone pilote cette page';

  var mode = 'endroit';
  var lienCourant = '';
  var lienDessine = '';

  function estTelephone() { return window.matchMedia('(max-width: 767px)').matches; }
  function chapitre() { return document.body.getAttribute('data-chapitre') || 'top'; }
  function situation() { return document.body.getAttribute('data-situation'); }
  function tele() { return window.FiTelecommande || null; }

  function lienEndroit() {
    var u = new URL(SITE);
    if (situation()) u.searchParams.set('situation', situation());
    if (chapitre() !== 'top') u.hash = chapitre();
    return u.toString();
  }
  function libelleEndroit() {
    var l = LIEUX[chapitre()] || LIEUX.top;
    return POUR[situation()] ? l + ', ' + POUR[situation()] : l;
  }

  /* ── Le QR, chargé à la demande ── */
  var qrPret = null;
  function chargerQr() {
    if (qrPret) return qrPret;
    qrPret = new Promise(function (ok, ko) {
      if (typeof window.qrcode === 'function') { ok(); return; }
      var s = document.createElement('script');
      s.src = '/composants/vendor/qrcode.min.js';
      s.onload = function () { journal('bibliothèque QR chargée (première ouverture)'); ok(); };
      s.onerror = function () { qrPret = null; ko(new Error('qrcode.min.js')); };
      document.head.appendChild(s);
    });
    return qrPret;
  }
  function dessinerQr(url) {
    if (url === lienDessine) return;
    lienDessine = url;
    chargerQr().then(function () {
      var code = window.qrcode(0, 'M');
      code.addData(url);
      code.make();
      zoneQr.innerHTML = code.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
      zoneQr.hidden = false;
      zoneQr.classList.remove('fi-partage__qr--pli');
      void zoneQr.offsetWidth; /* relance l'animation du dépli */
      zoneQr.classList.add('fi-partage__qr--pli');
      journal('QR dessiné :', url);
    }, function () {
      zoneQr.hidden = true;
      journal('⚠️ QR indisponible (script non chargé) : le lien et « Copier » restent');
    });
  }

  function afficher(lien, ou, consigne, avecQr) {
    zoneOu.textContent = ou;
    zoneConsigne.textContent = consigne;
    zoneLien.textContent = lien ? lien.replace(/^https:\/\//, '') : '';
    boutonCopier.hidden = !lien;
    boutonEnvoyer.hidden = !lien || !navigator.share;
    if (lien !== lienCourant) {
      lienCourant = lien;
      boutonCopier.textContent = 'Copier le lien';
    }
    if (lien && avecQr) dessinerQr(lien);
    else { zoneQr.hidden = true; lienDessine = ''; }
  }

  function rendre() {
    if (vue.hidden) return;
    var t = tele();
    ongletTele.hidden = estTelephone() || !t;
    if (mode === 'telecommande' && ongletTele.hidden) mode = 'endroit';
    onglets.forEach(function (o) {
      var actif = o.getAttribute('data-partage-mode') === mode;
      o.setAttribute('aria-selected', actif ? 'true' : 'false');
      o.tabIndex = actif ? 0 : -1;
    });
    var etatTele = t ? t.etat() : 'eteinte';
    zoneEtat.textContent = etatTele === 'connectee' ? CONNECTEE : '';
    if (mode === 'telecommande') {
      var pret = etatTele === 'prete' || etatTele === 'connectee';
      afficher(pret ? t.url() : '', 'Télécommande de cette page', pret ? CONSIGNES.telecommande : CONSIGNES[etatTele], true);
      return;
    }
    afficher(lienEndroit(), libelleEndroit(), CONSIGNES.endroit, !estTelephone());
  }

  /* ── Les entrées ── */
  document.addEventListener('fi:partager', function (e) {
    mode = e.detail && e.detail.mode === 'telecommande' ? 'telecommande' : 'endroit';
    if (mode === 'telecommande' && tele()) tele().demarrer();
    journal('ouvert : ' + mode);
    rendre();
  });
  ['fi:chapitre', 'fi:situation', 'fi:telecommande'].forEach(function (nom) {
    document.addEventListener(nom, rendre);
  });
  window.addEventListener('resize', rendre);

  onglets.forEach(function (o) {
    o.addEventListener('click', function () { emettre('fi:partager', { mode: o.getAttribute('data-partage-mode') }); });
    /* Onglets au clavier : flèches gauche / droite. */
    o.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      var visibles = onglets.filter(function (x) { return !x.hidden; });
      var i = visibles.indexOf(o) + (e.key === 'ArrowRight' ? 1 : -1);
      var cible = visibles[(i + visibles.length) % visibles.length];
      cible.focus();
      cible.click();
    });
  });

  boutonCopier.addEventListener('click', function () {
    var lien = lienCourant;
    function fait() { boutonCopier.textContent = 'Lien copié'; zoneAnnonce.textContent = 'Lien copié'; journal('lien copié :', lien); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(lien).then(fait, function () { window.getSelection().selectAllChildren(zoneLien); });
    } else {
      window.getSelection().selectAllChildren(zoneLien);
    }
  });
  boutonEnvoyer.addEventListener('click', function () {
    navigator.share({ title: 'Fractal Innov', text: 'Fractal Innov : ' + zoneOu.textContent, url: lienCourant })
      .catch(function () { /* partage annulé : rien à faire */ });
  });

  /* « Emporter cette page » (contact) et tout autre [data-partager-endroit] :
     masqués sans JS (ils n'auraient rien à ouvrir), montrés ici. */
  Array.prototype.forEach.call(document.querySelectorAll('[data-partager-endroit]'), function (b) {
    b.hidden = false;
    b.addEventListener('click', function () { emettre('fi:partager', { mode: 'endroit' }); });
  });

  journal('prêt : ' + onglets.length + ' onglets, QR à la demande');
})();
```

- [ ] **Étape 4 : index.html** (python, une assertion par remplacement)

```python
p = 'index.html'; s = open(p).read()
def rep(a, b):
    global s
    assert s.count(a) == 1, a
    s = s.replace(a, b)
rep('  <script defer src="/composants/dock.js"></script>\n',
    '  <script defer src="/composants/dock.js"></script>\n'
    '  <script defer src="/composants/partage.js"></script> <!-- le bandeau « Partager » : cet endroit, la télécommande -->\n')
rep('''          <p class="contact__atelier">Vous repartez avec l'usage par lequel commencer.</p>''',
    '''          <p class="contact__atelier">Vous repartez avec l'usage par lequel commencer.</p>
          <!-- Ouvre le bandeau « Partager » du dock (partage.js le montre). -->
          <button class="contact__emporter" type="button" data-partager-endroit hidden>
            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14h1v1h-1zM14 20h1v1h-1zM18 18h3v3h-3z"/></svg>
            Emporter cette page
          </button>''')
rep("""        sonCoupe: 'son-coupe'
      };""", """        sonCoupe: 'son-coupe',
        partageOuvert: 'partage-ouvert',
        telecommandeConnectee: 'telecommande-connectee'
      };""")
rep("""      document.addEventListener('fi:dock', function (e) {
        if (e.detail.etat === 'sommaire') mesurerUneFois('guide', MESURES.guideOuvert);
      });""", """      document.addEventListener('fi:dock', function (e) {
        if (e.detail.etat === 'sommaire') mesurerUneFois('guide', MESURES.guideOuvert);
      });
      /* Le partage (spec partage-telecommande § 9) : chaque ouverture et
         changement d'onglet ; la télécommande, une fois par visite. */
      document.addEventListener('fi:partager', function (e) {
        mesurer(MESURES.partageOuvert, { mode: (e.detail && e.detail.mode) || 'endroit', situation: situationActuelle() });
      });
      document.addEventListener('fi:telecommande', function (e) {
        if (e.detail && e.detail.etat === 'connectee') mesurerUneFois('telecommande', MESURES.telecommandeConnectee);
      });""")
css = '''    /* ── « Emporter cette page » (contact) : un lien discret, il ouvre le
       bandeau « Partager » du dock (spec partage-telecommande § 4). ── */
    .contact__emporter {
      display: inline-flex; align-items: center; gap: var(--fi-e1);
      min-height: 44px; margin-top: var(--fi-e1); padding: 0 var(--fi-e1);
      border: 0; background: none; color: var(--text-muted);
      font: inherit; font-size: var(--fi-t-05);
      text-decoration: underline; text-underline-offset: 4px; cursor: pointer;
    }
    .contact__emporter[hidden] { display: none; }
    .contact__emporter:hover { color: var(--text-main); }
    .contact__emporter:focus-visible { outline: 2px solid var(--accent-blue); outline-offset: 2px; border-radius: 6px; }
    .contact__emporter svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
'''
assert s.count('  </style>') == 1
s = s.replace('  </style>', css + '  </style>')
open(p, 'w').write(s)
```

- [ ] **Étape 5 : vérifier dans le navigateur** (`?debug=1&situation=former`, défiler jusqu'aux démos)

```js
document.dispatchEvent(new CustomEvent('fi:partager', { detail: { mode: 'endroit' } }));
await new Promise(r => setTimeout(r, 600));
({ ou: document.querySelector('[data-partage-ou]').textContent,          // « Démos, pour former »
   lien: document.querySelector('[data-partage-lien]').textContent,      // « www.fractal-innov.fr/?situation=former#demos »
   qr: !!document.querySelector('[data-partage-qr] svg'),                // true (bureau)
   tele: document.querySelector('[data-partage-mode="telecommande"]').hidden }) // true (Tâche 4 pas encore là)
```

Puis : un défilement jusqu'à l'équipe met à jour « L'équipe, pour former » sans refermer ; le bouton « Emporter cette page » du contact ouvre le bandeau ; à 375 × 812, pas de QR, « Copier le lien » visible ; `read_network_requests` montre `qrcode.min.js` chargé une seule fois, et pas avant la première ouverture.

- [ ] **Étape 6 : l'utilisateur valide le rendu (bureau, téléphone), puis commit** (`msg-partage-endroit.txt`)

```
feat(partage): partager l'endroit où l'on est par QR ou lien

- « Vous êtes ici » et lien réglés sur le chapitre et la situation,
  mis à jour en direct
- QR qui se déplie (qrcode-generator 1.4.4, MIT, chargé à la demande)
- Copier le lien, Envoyer (feuille de partage native)
- « Emporter cette page » dans le contact ; mesure partage-ouvert

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
```

```bash
git add composants/partage.js composants/vendor/qrcode.min.js index.html
```

```bash
git commit -F msg-partage-endroit.txt
```

```bash
rm msg-partage-endroit.txt
```

---

### Tâche 4 : la télécommande côté écran

**Files:**
- Create: `composants/telecommande-ecran.js`
- Create: `outils/telephone-simule.mjs` (Node 22 : joue le téléphone contre le relais, pour tester l'écran sans téléphone)
- Modify: `index.html` (script après `partage.js` ; `window.FiParcours` dans le script du parcours) : par script python

**Interfaces:**
- Consumes : `fi:aller {chapitre}` (existant, défilement doux), `window.FiDock.etat()` / `.replier(raison)`, `fi:chapitre`, `fi:situation`, `body[data-chapitre]`, `body[data-situation]`.
- Produces : `window.FiTelecommande = { demarrer(), etat(), url() }` ; `fi:telecommande {etat: 'connexion'|'prete'|'connectee'|'indisponible', salle, url}` ; `fi:geste {chapitre, geste: 'telecommande'}` ; `dock[data-telecommande="connectee"]` ; `window.FiParcours = { choisirSituation(id, origine) }`.

- [ ] **Étape 1 : exposer le choix de situation** (python)

```python
p = 'index.html'; s = open(p).read()
a = "      /* Le hero : on choisit, l'onde et l'accord partent, PUIS on descend"
assert s.count(a) == 1
s = s.replace(a, """      /* La porte du choix pour ce qui n'est pas un clic : la télécommande
         (composants/telecommande-ecran.js) choisit par ici, avec son
         origine, sans ouvrir le bandeau de situation sur l'écran. */
      window.FiParcours = { choisirSituation: choisirSituation };

""" + a)
a2 = '  <script defer src="/composants/partage.js"></script>'
assert s.count(a2) == 1
i = s.index(a2); j = s.index('\n', i) + 1
s = s[:j] + '  <script defer src="/composants/telecommande-ecran.js"></script> <!-- la télécommande : l\'écran obéit au téléphone -->\n' + s[j:]
open(p, 'w').write(s)
```

- [ ] **Étape 2 : `composants/telecommande-ecran.js`**

```js
/* ══ LA TÉLÉCOMMANDE, CÔTÉ ÉCRAN ════════════════════════════════════════
   spec : docs/superpowers/specs/2026-09-28-partage-telecommande-design.md § 6, § 8
   Corentin tend la page : un téléphone la pilote par le relais du Salon
   (déjà en ligne, inchangé). Ce script est l'ÉCRAN :

     1. Rien ne se connecte tant que l'onglet Télécommande n'a pas été
        ouvert (demarrer()) ; recharger l'onglet garde la salle.
     2. Il s'inscrit dans une salle à lui (8 caractères, sessionStorage)
        et publie le lien du téléphone : /telecommande/?salle=…
     3. Commandes reçues (protocole du Salon) :
          OPEN_MODAL {navItemId: '<chapitre>'}         › fi:aller (défilement doux)
          OPEN_MODAL {navItemId: 'situation:<id>'}     › FiParcours.choisirSituation
          BONJOUR (toutes les 20 s)                    › présence, témoin
        Tout le reste est ignoré (et journalisé).
     4. Il renvoie son état (chapitre, situation) à chaque changement.

   ⚠️ Le relais ne prévient pas l'écran de l'arrivée d'un téléphone : c'est
   le BONJOUR du téléphone qui allume le témoin, et son silence (45 s) qui
   l'éteint.
   ⚠️ Le son d'une commande reçue ne joue qu'après un premier geste sur
   l'écran (règle des navigateurs) : en présentation, c'est acquis.

   Émet   : fi:telecommande {etat, salle, url}, fi:aller, fi:geste
   Journal : « ?debug=1 » (clé fi:debug), préfixe [telecommande] ;
             « ?relais=<url> » (debug seulement) remplace le relais.
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var DEBUG = false;
  try { DEBUG = localStorage.getItem('fi:debug') === '1'; } catch (e) {}
  function journal() {
    if (!DEBUG) return;
    var a = Array.prototype.slice.call(arguments);
    a.unshift('%c[telecommande]', 'color:#34d399');
    console.log.apply(console, a);
  }
  function emettre(nom, detail) { document.dispatchEvent(new CustomEvent(nom, { detail: detail })); }

  var RELAIS = 'wss://stand-demonstrateur.osc-fr1.scalingo.io/ws-remote';
  if (DEBUG) {
    try { var r = new URLSearchParams(location.search).get('relais'); if (r) { RELAIS = r; journal('relais remplacé (debug) :', r); } } catch (e) {}
  }
  var PAGE = 'https://www.fractal-innov.fr/telecommande/';
  var CHAPITRES = ['top', 'offre', 'demos', 'approche', 'equipe', 'contact'];
  var SITUATIONS = ['convaincre', 'former', 'garder'];
  var CLE_SALLE = 'fi:salle';
  var DELAI_INDISPONIBLE = 20000;
  var SILENCE_MAX = 45000;

  var dock = document.querySelector('[data-composant="dock"]');
  var etat = 'eteinte';
  var salle = null;
  var ws = null;
  var attente = 1000;
  var minuterieIndispo = 0;
  var minuteriePresence = 0;
  var presente = false;

  function tirerSalle() {
    try { var gardee = sessionStorage.getItem(CLE_SALLE); if (/^[a-z0-9]{8}$/.test(gardee || '')) return gardee; } catch (e) {}
    var abc = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var hasard = window.crypto.getRandomValues(new Uint8Array(8));
    var nom = '';
    for (var i = 0; i < 8; i++) nom += abc[hasard[i] % 36];
    try { sessionStorage.setItem(CLE_SALLE, nom); } catch (e) {}
    return nom;
  }
  function url() { return salle ? PAGE + '?salle=' + salle : ''; }
  function changer(nouvel) {
    if (nouvel === etat) return;
    journal(etat + ' › ' + nouvel + (salle ? ' (salle ' + salle + ')' : ''));
    etat = nouvel;
    emettre('fi:telecommande', { etat: etat, salle: salle, url: url() });
  }

  function envoyer(msg) {
    if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(msg));
  }
  function envoyerEtat() {
    envoyer({ type: 'DISPLAY_STATE', state: {
      activeModalId: document.body.getAttribute('data-chapitre') || 'top',
      situation: document.body.getAttribute('data-situation') || null
    } });
  }

  function marquerPresence() {
    clearTimeout(minuteriePresence);
    minuteriePresence = setTimeout(function () {
      presente = false;
      if (dock) dock.removeAttribute('data-telecommande');
      journal('plus de nouvelles du téléphone depuis ' + SILENCE_MAX / 1000 + ' s : témoin éteint');
      changer('prete');
    }, SILENCE_MAX);
    if (presente) return;
    presente = true;
    if (dock) dock.setAttribute('data-telecommande', 'connectee');
    changer('connectee');
    /* Le bandeau se referme : l'écran appartient à la présentation. */
    if (window.FiDock && window.FiDock.etat() === 'partage') window.FiDock.replier('téléphone connecté');
  }

  function recevoir(cmd) {
    if (cmd.type === 'BONJOUR') { marquerPresence(); envoyerEtat(); return; }
    if (cmd.type !== 'OPEN_MODAL' || typeof cmd.navItemId !== 'string') { journal('commande ignorée :', cmd); return; }
    var id = cmd.navItemId;
    marquerPresence();
    if (id.indexOf('situation:') === 0) {
      var s = id.slice('situation:'.length);
      if (SITUATIONS.indexOf(s) < 0 || !window.FiParcours) { journal('situation inconnue, ignorée :', s); return; }
      journal('le téléphone choisit la situation « ' + s + ' »');
      window.FiParcours.choisirSituation(s, 'telecommande');
      emettre('fi:geste', { chapitre: document.body.getAttribute('data-chapitre') || 'top', geste: 'telecommande' });
      return;
    }
    if (CHAPITRES.indexOf(id) < 0) { journal('chapitre inconnu, ignoré :', id); return; }
    journal('le téléphone demande « ' + id + ' » : défilement doux');
    emettre('fi:aller', { chapitre: id });
    emettre('fi:geste', { chapitre: id, geste: 'telecommande' });
  }

  function connecter() {
    if (!presente) changer('connexion');
    clearTimeout(minuterieIndispo);
    minuterieIndispo = setTimeout(function () {
      if (etat === 'connexion') { journal('relais muet depuis ' + DELAI_INDISPONIBLE / 1000 + ' s'); changer('indisponible'); }
    }, DELAI_INDISPONIBLE);
    journal('connexion au relais (le premier réveil peut prendre ~7 s)');
    try { ws = new WebSocket(RELAIS); } catch (e) { journal('⚠️ WebSocket refusé :', e.message); relancer(); return; }
    ws.onopen = function () { envoyer({ type: 'REGISTER', role: 'display', salle: salle }); };
    ws.onmessage = function (e) {
      var m;
      try { m = JSON.parse(e.data); } catch (x) { return; }
      if (m.type === 'REGISTER_OK') {
        attente = 1000;
        clearTimeout(minuterieIndispo);
        journal('écran inscrit dans la salle ' + salle + ' : QR prêt');
        changer(presente ? 'connectee' : 'prete');
        envoyerEtat();
      } else if (m.type === 'REMOTE_CMD') {
        recevoir(m.cmd || {});
      }
    };
    ws.onclose = function () { ws = null; relancer(); };
  }
  function relancer() {
    journal('coupure : nouvel essai dans ' + attente / 1000 + ' s');
    setTimeout(connecter, attente);
    attente = Math.min(attente * 2, 10000);
  }

  function demarrer() {
    if (salle) return;
    salle = tirerSalle();
    journal('démarrage : salle ' + salle + ', téléphone › ' + url());
    connecter();
  }

  document.addEventListener('fi:chapitre', envoyerEtat);
  document.addEventListener('fi:situation', envoyerEtat);

  window.FiTelecommande = {
    demarrer: demarrer,
    etat: function () { return etat; },
    url: url
  };

  /* Onglet rechargé : la salle est gardée, on se réinscrit sans attendre
     que l'onglet Télécommande soit rouvert (le téléphone reste connecté). */
  var gardee = null;
  try { gardee = sessionStorage.getItem(CLE_SALLE); } catch (e) {}
  if (gardee) { journal('salle gardée par cet onglet, réinscription'); demarrer(); }
})();
```

- [ ] **Étape 3 : `outils/telephone-simule.mjs`**

```js
/* Joue le TÉLÉPHONE contre le relais du Salon, pour tester l'écran sans
   téléphone (spec partage-telecommande § 6).
   Usage : node outils/telephone-simule.mjs <salle> [commande…]
     commandes : un chapitre (demos), situation:former, inconnu:<id>,
                 attendre:<ms>, silence (arrête BONJOUR), fin
   Exemple : node outils/telephone-simule.mjs ab12cd34 demos situation:former inconnu:logiciel attendre:2000 fin */
const RELAIS = process.env.RELAIS || 'wss://stand-demonstrateur.osc-fr1.scalingo.io/ws-remote';
const [salle, ...commandes] = process.argv.slice(2);
if (!/^[a-z0-9]{8}$/.test(salle || '')) { console.error('salle invalide : 8 caractères [a-z0-9]'); process.exit(1); }
const t0 = Date.now();
const log = (...a) => console.log(((Date.now() - t0) / 1000).toFixed(2) + ' s', ...a);
const ws = new WebSocket(RELAIS);
let bonjour = 0;
const envoyer = (m) => { ws.send(JSON.stringify(m)); log('›', JSON.stringify(m)); };
const pause = (ms) => new Promise((r) => setTimeout(r, ms));
async function jouer() {
  for (const c of commandes) {
    if (c === 'fin') { clearInterval(bonjour); ws.close(); return; }
    if (c === 'silence') { clearInterval(bonjour); log('silence : plus de BONJOUR'); continue; }
    if (c.startsWith('attendre:')) { await pause(Number(c.slice(9))); continue; }
    const navItemId = c.startsWith('inconnu:') ? c.slice(8) : c;
    envoyer({ type: 'REMOTE_CMD', cmd: { type: 'OPEN_MODAL', navItemId } });
    await pause(800);
  }
}
ws.onopen = () => envoyer({ type: 'REGISTER', role: 'remote', salle });
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  log('‹', JSON.stringify(m));
  if (m.type === 'REGISTER_OK') envoyer({ type: 'AUTH', pin: '123456' });
  if (m.type === 'AUTH_OK') {
    envoyer({ type: 'REMOTE_CMD', cmd: { type: 'BONJOUR' } });
    bonjour = setInterval(() => envoyer({ type: 'REMOTE_CMD', cmd: { type: 'BONJOUR' } }), 20000);
    jouer();
  }
};
ws.onclose = () => { log('fermé'); process.exit(0); };
```

- [ ] **Étape 4 : ouvrir l'onglet Télécommande et lire la salle** (navigateur, `?debug=1`, bureau)

```js
document.dispatchEvent(new CustomEvent('fi:partager', { detail: { mode: 'telecommande' } }));
await new Promise(r => setTimeout(r, 9000)); // réveil à froid du relais
({ etat: FiTelecommande.etat(), url: FiTelecommande.url(), qr: !!document.querySelector('[data-partage-qr] svg') })
// { etat: 'prete', url: 'https://www.fractal-innov.fr/telecommande/?salle=xxxxxxxx', qr: true }
```

- [ ] **Étape 5 : jouer le téléphone** (Review Focus 3)

Run: `node outils/telephone-simule.mjs <salle lue à l'étape 4> demos situation:former inconnu:logiciel inconnu:situation:borne fin`
Expected côté terminal : `‹ DISPLAY_STATE` avec `activeModalId: "demos"`, puis `situation: "former"`.
Expected côté écran (journal) : « le téléphone demande « demos » : défilement doux », « le téléphone choisit la situation « former » », « chapitre inconnu, ignoré : logiciel », « situation inconnue, ignorée : borne » ; `FiDock.etat()` = `'replie'` (bandeau refermé à la connexion) ; `dock.dataset.telecommande` = `'connectee'`.

- [ ] **Étape 6 : relais injoignable** (Review Focus 2) : charger `?debug=1&relais=wss://127.0.0.1:9/`, vider `fi:salle` (`sessionStorage.removeItem('fi:salle')`), ouvrir l'onglet Télécommande.
Expected : consigne « Préparation de la télécommande… », pas de QR ; à 20 s, « Télécommande indisponible pour le moment » ; l'onglet « Cet endroit » garde son QR et son lien.

- [ ] **Étape 7 : présence et rechargement** (Review Focus 5)

Run: `node outils/telephone-simule.mjs <salle> silence attendre:50000 fin`
Expected : le témoin s'éteint ~45 s après le dernier BONJOUR (`dock.dataset.telecommande` absent, journal « témoin éteint »).
Puis recharger l'écran : journal « salle gardée par cet onglet, réinscription », même salle ; relancer le simulateur sans rescanner : l'écran obéit.

- [ ] **Étape 8 : l'utilisateur valide, puis commit** (`msg-telecommande-ecran.txt`)

```
feat(telecommande): laisser un téléphone piloter la page

- l'écran s'inscrit au relais du Salon (une salle par onglet) à la
  première ouverture de l'onglet Télécommande, jamais avant
- chapitres et situations reçus, défilement doux, son du geste
- témoin sur Partager, bandeau refermé à la connexion, 45 s de silence
  l'éteignent ; reconnexion automatique ; indisponible après 20 s
- outils/telephone-simule.mjs joue le téléphone pour tester

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
```

```bash
git add composants/telecommande-ecran.js outils/telephone-simule.mjs index.html
```

```bash
git commit -F msg-telecommande-ecran.txt
```

```bash
rm msg-telecommande-ecran.txt
```

---

### Tâche 5 : la page `/telecommande/` (téléphone)

**Files:**
- Create: `telecommande/index.html` (par heredoc ou python, jamais Edit/Write), pictos repris de `index.html` (`<symbol id="pic-convaincre|former|garder">`)

**Interfaces:**
- Consumes : le protocole (spec § 6) ; salle dans `?salle=` ; l'écran de la Tâche 4 répond à `BONJOUR` par `DISPLAY_STATE {activeModalId, situation}`.

- [ ] **Étape 1 : 🎨 boucle de co-création, la télécommande en main**

Montrer (maquettes rapides en ASCII ou rendu `?variante=`) et demander :
  - **A (recommandée)** : les six chapitres en **rail vertical**, comme le sommaire du dock que la personne vient de voir à l'écran (tuile 01 à 06 + libellé, lignes de 56 px pleine largeur, faciles au pouce), puis « Pour quoi faire ? » en trois pastilles.
  - **B** : une **grille 2 × 3** de grandes tuiles numérotées, puis les situations en rangée.
  - La phrase d'accueil : « Vous avez la main : touchez un chapitre, l'écran vous suit » (spec) ou une variante proposée par l'utilisateur.
Coder selon la réponse (le code suit A).

- [ ] **Étape 2 : écrire la page** (python : le gabarit ci-dessous, les trois `<symbol>` copiés depuis `index.html`)

```python
import re
src = open('index.html').read()
symboles = '\n'.join(re.search(r'<symbol id="pic-%s".*?</symbol>' % n, src, re.S).group(0)
                     for n in ('convaincre', 'former', 'garder'))
page = open('/dev/stdin').read().replace('<!--SYMBOLES-->', symboles)
import os; os.makedirs('telecommande', exist_ok=True)
open('telecommande/index.html', 'w').write(page)
```

Gabarit passé sur l'entrée standard :

```html
<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="robots" content="noindex">
  <meta name="theme-color" content="#090b13">
  <title>Télécommande | Fractal Innov</title>
  <!-- La télécommande de l'accueil (spec partage-telecommande § 7) : le
       téléphone d'une personne qui DÉCOUVRE le site pilote l'écran de la
       présentation, par le relais du Salon. Autonome : aucun script du
       site, aucun cookie. Journal : ?debug=1 (clé fi:debug), [telephone]. -->
  <style>
    @font-face { font-family: "Outfit"; src: url("/media/polices/outfit-latin-400.woff2") format("woff2"); font-weight: 400; font-display: swap; }
    @font-face { font-family: "Outfit"; src: url("/media/polices/outfit-latin-700.woff2") format("woff2"); font-weight: 700; font-display: swap; }
    :root {
      --fond: #090b13; --fond-2: #0f1220; --texte: #f0f0f0; --doux: rgba(240, 240, 240, 0.6);
      --ligne: rgba(255, 255, 255, 0.1); --accent: #6ea8ff; --ok: #34d399;
      --degrade: linear-gradient(100deg, #6ea8ff 0%, #8b5cf6 52%, #f472b6 100%);
    }
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100dvh; background: var(--fond); color: var(--texte);
      font: 400 17px/1.5 "Outfit", system-ui, -apple-system, "Segoe UI", sans-serif;
      padding: 24px 16px calc(24px + env(safe-area-inset-bottom)); -webkit-tap-highlight-color: transparent; }
    main { max-width: 440px; margin: 0 auto; }
    .etat { display: inline-flex; align-items: center; gap: 8px; margin: 0 0 16px; font-size: 14px; color: var(--doux); }
    .etat::before { content: ""; width: 8px; height: 8px; border-radius: 50%; background: var(--doux); }
    .etat[data-etat="connecte"]::before { background: var(--ok); box-shadow: 0 0 0 4px rgba(52, 211, 153, 0.2); }
    h1 { margin: 0 0 24px; font-size: 24px; line-height: 1.25; font-weight: 700; }
    .etiquette { margin: 0 0 8px; font-size: 13px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent); }
    .chapitres { list-style: none; margin: 0 0 32px; padding: 0; counter-reset: ch; }
    .chapitres button, .situations button {
      display: flex; align-items: center; gap: 16px; width: 100%; min-height: 56px; padding: 0 16px;
      border: 1px solid var(--ligne); border-radius: 14px; background: var(--fond-2); color: var(--texte);
      font: inherit; font-weight: 600; text-align: left; cursor: pointer;
    }
    .chapitres li + li { margin-top: 8px; }
    .chapitres button::before {
      counter-increment: ch; content: counter(ch, decimal-leading-zero);
      display: grid; place-items: center; width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0;
      background: rgba(255, 255, 255, 0.06); font-size: 13px; font-variant-numeric: tabular-nums;
    }
    .chapitres button[aria-current="true"] { border-color: transparent; background: linear-gradient(var(--fond-2), var(--fond-2)) padding-box, var(--degrade) border-box; }
    .chapitres button[aria-current="true"]::before { background: var(--degrade); color: #fff; }
    .situations { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin: 0; padding: 0; list-style: none; }
    .situations button { flex-direction: column; justify-content: center; gap: 6px; min-height: 76px; padding: 8px; text-align: center; font-size: 15px; }
    .situations svg { width: 22px; height: 22px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    .situations button[aria-pressed="true"] { border-color: transparent; background: linear-gradient(var(--fond-2), var(--fond-2)) padding-box, var(--degrade) border-box; }
    button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
    button:active { transform: scale(0.98); }
    main[data-inactif] .commandes { opacity: 0.4; pointer-events: none; }
    .aide { margin: 24px 0 0; font-size: 14px; color: var(--doux); }
    @media (prefers-reduced-motion: reduce) { button:active { transform: none; } }
  </style>
</head>
<body>
  <svg width="0" height="0" style="position:absolute" aria-hidden="true">
<!--SYMBOLES-->
  </svg>
  <main data-inactif>
    <p class="etat" data-etat="connexion" aria-live="polite">Connexion à l'écran…</p>
    <h1>Vous avez la main : touchez un chapitre, l'écran vous suit</h1>
    <div class="commandes">
      <p class="etiquette">Chapitres</p>
      <ol class="chapitres">
        <li><button type="button" data-chapitre="top">Accueil</button></li>
        <li><button type="button" data-chapitre="offre">L'offre</button></li>
        <li><button type="button" data-chapitre="demos">Démos</button></li>
        <li><button type="button" data-chapitre="approche">L'approche</button></li>
        <li><button type="button" data-chapitre="equipe">L'équipe</button></li>
        <li><button type="button" data-chapitre="contact">Contact</button></li>
      </ol>
      <p class="etiquette">Pour quoi faire ?</p>
      <ul class="situations">
        <li><button type="button" data-situation="convaincre" aria-pressed="false"><svg aria-hidden="true"><use href="#pic-convaincre"></use></svg>Convaincre</button></li>
        <li><button type="button" data-situation="former" aria-pressed="false"><svg aria-hidden="true"><use href="#pic-former"></use></svg>Former</button></li>
        <li><button type="button" data-situation="garder" aria-pressed="false"><svg aria-hidden="true"><use href="#pic-garder"></use></svg>Conserver</button></li>
      </ul>
    </div>
    <p class="aide">Rien à installer. Fermez simplement cette page quand vous avez fini.</p>
  </main>
  <script>
  (function () {
    'use strict';
    var DEBUG = false;
    try { DEBUG = localStorage.getItem('fi:debug') === '1' || /[?&]debug=1/.test(location.search); } catch (e) {}
    function journal() { if (!DEBUG) return; var a = [].slice.call(arguments); a.unshift('%c[telephone]', 'color:#34d399'); console.log.apply(console, a); }

    var RELAIS = 'wss://stand-demonstrateur.osc-fr1.scalingo.io/ws-remote';
    var PIN = '123456'; /* non secret : le relais du Salon le publie déjà dans son bundle */
    var params = new URLSearchParams(location.search);
    if (DEBUG && params.get('relais')) RELAIS = params.get('relais');
    var salle = params.get('salle') || '';
    var main = document.querySelector('main');
    var zoneEtat = document.querySelector('.etat');
    var TEXTES = {
      connexion: "Connexion à l'écran…",
      connecte: 'Connecté',
      ferme: "L'écran s'est fermé : scannez à nouveau le QR",
      incomplet: "Lien incomplet : scannez le QR affiché sur l'écran",
      indisponible: 'Télécommande indisponible pour le moment'
    };
    function montrer(e) {
      zoneEtat.setAttribute('data-etat', e);
      zoneEtat.textContent = TEXTES[e];
      if (e === 'connecte') main.removeAttribute('data-inactif'); else main.setAttribute('data-inactif', '');
      journal('état : ' + e);
    }

    /* Jamais de repli sur la salle « borne » du relais : ce serait piloter
       la borne physique du salon. */
    if (!/^[a-z0-9]{8}$/.test(salle)) { montrer('incomplet'); journal('salle absente ou invalide :', salle); return; }

    var ws = null, attente = 1000, bonjour = 0, dernierEtat = 0;
    function envoyer(m) { if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(m)); }
    function commande(navItemId) {
      envoyer({ type: 'REMOTE_CMD', cmd: { type: 'OPEN_MODAL', navItemId: navItemId } });
      if (navigator.vibrate) navigator.vibrate(10);
      journal('commande : ' + navItemId);
    }
    function allumer(state) {
      [].forEach.call(document.querySelectorAll('[data-chapitre]'), function (b) {
        if (b.getAttribute('data-chapitre') === state.activeModalId) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
      });
      [].forEach.call(document.querySelectorAll('[data-situation]'), function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-situation') === state.situation ? 'true' : 'false');
      });
    }
    function connecter() {
      montrer('connexion');
      ws = new WebSocket(RELAIS);
      ws.onopen = function () { envoyer({ type: 'REGISTER', role: 'remote', salle: salle }); };
      ws.onmessage = function (e) {
        var m; try { m = JSON.parse(e.data); } catch (x) { return; }
        if (m.type === 'REGISTER_OK') envoyer({ type: 'AUTH', pin: PIN });
        else if (m.type === 'AUTH_FAIL') { montrer('indisponible'); ws.close(); }
        else if (m.type === 'AUTH_OK') {
          attente = 1000;
          envoyer({ type: 'REMOTE_CMD', cmd: { type: 'BONJOUR' } });
          clearInterval(bonjour);
          bonjour = setInterval(function () { envoyer({ type: 'REMOTE_CMD', cmd: { type: 'BONJOUR' } }); }, 20000);
        } else if (m.type === 'DISPLAY_STATE') {
          dernierEtat = Date.now();
          if (zoneEtat.getAttribute('data-etat') !== 'connecte') montrer('connecte');
          allumer(m.state || {});
        }
      };
      ws.onclose = function () {
        clearInterval(bonjour);
        journal('coupure : nouvel essai dans ' + attente / 1000 + ' s');
        setTimeout(connecter, attente);
        attente = Math.min(attente * 2, 10000);
      };
    }
    /* L'écran répond à chaque BONJOUR (20 s) : 45 s sans état, il est parti. */
    setInterval(function () {
      if (zoneEtat.getAttribute('data-etat') === 'connecte' && Date.now() - dernierEtat > 45000) montrer('ferme');
    }, 5000);
    document.addEventListener('click', function (e) {
      var c = e.target.closest('[data-chapitre]');
      if (c) { commande(c.getAttribute('data-chapitre')); return; }
      var s = e.target.closest('[data-situation]');
      if (s) commande('situation:' + s.getAttribute('data-situation'));
    });
    journal('salle ' + salle + ', relais ' + RELAIS);
    connecter();
  })();
  </script>
</body>
</html>
```

- [ ] **Étape 3 : ouvrir la page face à l'écran** : écran `?debug=1`, onglet Télécommande ouvert (salle `S`) ; second onglet du navigateur (ou le téléphone de l'utilisateur sur le même réseau via `http://<ip>:4100/telecommande/?salle=S&debug=1`), `resize_window` mobile.
Expected : « Connexion à l'écran… » puis « Connecté », le chapitre en cours allumé ; toucher « Démos » fait défiler l'écran, la tuile s'allume ; « Former » allume la situation et la pastille.

- [ ] **Étape 4 : l'écran fermé** : fermer l'onglet de l'écran. Expected : ~45 s plus tard, « L'écran s'est fermé : scannez à nouveau le QR », commandes grisées.

- [ ] **Étape 5 : lien incomplet** (Review Focus 1) : ouvrir `/telecommande/`, puis `/telecommande/?salle=borne`, puis `?salle=ABC`.
Expected : « Lien incomplet : scannez le QR affiché sur l'écran » ; `read_network_requests` : aucune connexion au relais.

- [ ] **Étape 6 : l'utilisateur valide le rendu sur son téléphone, puis commit** (`msg-telecommande-page.txt`)

```
feat(telecommande): la page que tient le téléphone

- six chapitres en rail numéroté et trois situations, l'état de l'écran
  allumé en direct
- pensée pour une personne qui découvre le site : une phrase d'accueil,
  des états lisibles (connexion, connecté, écran fermé, lien incomplet)
- jamais de repli sur la salle « borne » du relais ; noindex

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
```

```bash
git add telecommande/index.html
```

```bash
git commit -F msg-telecommande-page.txt
```

```bash
rm msg-telecommande-page.txt
```

---

### Tâche 6 : clôture

**Files:**
- Modify: `docs/superpowers/specs/2026-09-28-partage-telecommande-design.md` (§ 13 « Bilan » : décisions des boucles 🎨, mesures, écarts)
- Modify: ce plan (cases cochées)

- [ ] **Étape 1 : parcours complet sur de vrais appareils** : ordinateur + téléphone de l'utilisateur, en production après fusion ou en local sur le réseau ; noter la durée du premier réveil du relais.
- [ ] **Étape 2 : garde** : `FiDock.verifier()` muet à 1440, 1280, 1024, 375 et 360 ; aucune erreur console ; `document.documentElement.scrollWidth === innerWidth` au téléphone.
  Et, onglet neuf (`sessionStorage` vide) : `read_network_requests` ne montre AUCUNE connexion au relais avant l'ouverture de l'onglet Télécommande (spec § 4, § 9).
- [ ] **Étape 3 : écrire le § 13 de la spec**, commit `docs(spec): …` (tapé par l'utilisateur, message dans un fichier).
- [ ] **Étape 4 : PR** avec `finishing-a-development-branch` : `git push -u origin feat/partage-telecommande`, puis `gh pr create --base main --title 'feat(partage): partager la page et la tendre en télécommande' --body-file msg-pr.md` (corps terminé par la ligne « 🤖 Generated with [Claude Code](https://claude.com/claude-code) »).
