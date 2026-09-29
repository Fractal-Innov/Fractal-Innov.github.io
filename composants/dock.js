/* ══════════════════════════════════════════════════════════════════════
   LE DOCK (composants/dock.js)
   d'après le dock de la borne : salon_demo_app/src/components/layout/Dock.tsx
   décidé le 28/09/2026 (spec 2026-09-27-galerie-affordance-son-design.md § 17)

   Ce qu'il fait : UNE surface en bas de l'écran. La rangée de boutons en
   bas, et au-dessus un bandeau qui prend l'un de quatre visages :

     état        bandeau                         page
     ─────────   ─────────────────────────────   ─────────────────────────
     question    « Votre savoir doit d'abord : »  libre
     situation   la situation cliquée            libre
     sommaire    « Tous » : les chapitres        libre
     partage     « Partager » : lien, QR,        libre
                 télécommande (partage.js)
     replie      aucun                           libre

   L'état vit à UN seul endroit, `data-etat` sur le dock ; le CSS en tire
   l'apparence (plus l'interaction demandée est forte, plus le bandeau
   appelle). Deux fonctions seulement le changent : ouvrir() et replier().

   Les règles :
     1. **La question se pose sur demande** (décision du 29/09/2026).
        Elle ne s'ouvrait seule que pour un visiteur neuf arrivé en haut
        de page : un retour, une ancre ou un lien `?situation=` ne la
        voyaient jamais. Désormais tout le monde voit la même invitation,
        « Choisir mon usage » dans le hero (hero-depart.js), et la page
        n'est plus verrouillée : Échap et clic dehors la referment comme
        les autres bandeaux.
     2. **Le panneau rejoint le dock seulement si ce script tourne.** S'il
        plante avant, la question reste dans le hero, en liens.
     3. **Pendant la question, <html> porte `fi-question`** : le hero
        s'en sert pour faire de la place au téléphone (signature,
        invitation), rien d'autre.
     4. **Il ne choisit rien lui-même.** Le choix d'une situation reste au
        script « LE PARCOURS » (délégation sur [data-situation-choix]) ; le
        dock écoute fi:situation, comme le son et la mesure.

   Écoute : fi:situation {id, origine}, fi:chapitre {id},
            fi:partager {mode} (spec 2026-09-28-partage-telecommande-design.md § 4)
   Émet   : fi:dock {etat, avant}, fi:aller {chapitre} (contrat existant)
   Journal: « ?debug=1 » (clé fi:debug), préfixe [dock].
   Recette: « ?question=1 » ouvre la question au chargement (QA, démo).
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var DEBUG = false;
  try { DEBUG = localStorage.getItem('fi:debug') === '1'; } catch (e) {}
  function journal() {
    if (!DEBUG) return;
    var a = Array.prototype.slice.call(arguments);
    a.unshift('%c[dock]', 'color:#6ea8ff');
    console.log.apply(console, a);
  }
  function emettre(nom, detail) {
    document.dispatchEvent(new CustomEvent(nom, { detail: detail }));
  }

  var dock = document.querySelector('[data-composant="dock"]');
  if (!dock) return;

  var bandeau = dock.querySelector('.fi-dock__bandeau');
  var rangee = dock.querySelector('.fi-dock__rangee');
  var vues = {};
  Array.prototype.forEach.call(dock.querySelectorAll('[data-dock-vue]'), function (v) {
    vues[v.getAttribute('data-dock-vue')] = v;
  });
  var boutonTous = dock.querySelector('[data-dock-tous]');
  var boutonsSituation = dock.querySelectorAll('[data-dock-situation]');
  /* « Partager » : le bouton de la rangée (bureau) et la ligne du sommaire
     (téléphone), un seul état ouvert pour les deux. */
  var boutonsPartager = dock.querySelectorAll('[data-dock-partager]');
  function marquerPartager(ouvert) {
    Array.prototype.forEach.call(boutonsPartager, function (b) { b.setAttribute('aria-expanded', ouvert ? 'true' : 'false'); });
  }
  /* L'ancienne clé de la question « déjà répondue » : plus lue depuis
     que la question se pose sur demande, on la retire au passage. */
  try { localStorage.removeItem('fi:dock-repondu'); } catch (e) {}

  var etat = 'replie';
  var situationOuverte = null;

  /* La question ouverte se lit sur <html> (règle 3). */
  function marquerQuestion(oui) {
    document.documentElement.classList.toggle('fi-question', oui);
  }

  /* ── Les deux seules fonctions qui changent l'état ─────────────────── */
  function ouvrir(nouvel, detail) {
    var avant = etat;
    etat = nouvel;
    Object.keys(vues).forEach(function (k) { vues[k].hidden = k !== nouvel; });
    dock.setAttribute('data-etat', nouvel);
    boutonTous.setAttribute('aria-expanded', nouvel === 'sommaire' ? 'true' : 'false');
    marquerPartager(nouvel === 'partage');
    marquerQuestion(nouvel === 'question');
    journal(avant, '›', nouvel + (detail ? ' (' + detail + ')' : ''));
    emettre('fi:dock', { etat: nouvel, avant: avant });
    verifier();
  }
  function replier(raison) {
    if (etat === 'replie') return;
    var avant = etat;
    etat = 'replie';
    situationOuverte = null;
    Object.keys(vues).forEach(function (k) { vues[k].hidden = true; });
    dock.setAttribute('data-etat', 'replie');
    boutonTous.setAttribute('aria-expanded', 'false');
    marquerPartager(false);
    marquerQuestion(false);
    journal(avant, '› replie (' + raison + ')');
    emettre('fi:dock', { etat: 'replie', avant: avant });
    verifier();
  }

  /* ── Le bandeau « situation » : construit depuis la carte de l'offre ──
     Aucun texte nouveau : le nom (eyebrow), l'accroche (h3) et la ligne
     « Ça tourne déjà » de #usage-<id>. */
  function remplirSituation(id) {
    var carte = document.getElementById('usage-' + id);
    var v = vues.situation;
    if (!carte) { journal('⚠️ carte #usage-' + id + ' introuvable : bandeau vide'); return false; }
    var eyebrow = carte.querySelector('.offre__eyebrow');
    var accroche = carte.querySelector('h3');
    var preuve = carte.querySelector('.offre__preuve');
    var titre = v.querySelector('.fi-dock__titre');
    titre.textContent = '';
    /* Le pictogramme de la situation, repris tel quel ; `id` vient d'une
       liste fermée (les trois boutons), l'innerHTML est sûr. */
    titre.insertAdjacentHTML('afterbegin', '<svg class="pic" aria-hidden="true"><use href="#pic-' + id + '"></use></svg>');
    /* Le nom de la situation : `.offre__eyebrow-texte` depuis la passe de
       l'offre (28/09/2026) ; les nœuds texte nus en secours. */
    var texteEyebrow = eyebrow && eyebrow.querySelector('.offre__eyebrow-texte');
    var nom = texteEyebrow ? texteEyebrow.textContent.trim()
      : eyebrow ? Array.prototype.filter.call(eyebrow.childNodes, function (n) { return n.nodeType === 3; })
        .map(function (n) { return n.textContent; }).join(' ').trim() : id;
    titre.appendChild(document.createTextNode(nom));
    v.querySelector('[data-dock-texte]').textContent = accroche ? accroche.textContent.trim() : '';
    var zonePreuve = v.querySelector('[data-dock-preuve]');
    zonePreuve.innerHTML = '';
    if (preuve) Array.prototype.forEach.call(preuve.childNodes, function (n) { zonePreuve.appendChild(n.cloneNode(true)); });
    zonePreuve.hidden = !preuve;
    v.querySelector('[data-dock-suite]').setAttribute('href', '#usage-' + id);
    return true;
  }
  function ouvrirSituation(id) {
    if (etat === 'situation' && situationOuverte === id) { replier('re-clic sur ' + id); return; }
    if (!remplirSituation(id)) return;
    situationOuverte = id;
    ouvrir('situation', id);
  }

  /* ── Le sommaire : le chapitre en cours ──────────────────────────── */
  /* Passe du 28/09/2026 : un rail relie les tuiles numérotées. Il est
     rempli jusqu'au chapitre en cours (`--fi-rang` sur la liste, lu par le
     CSS), les chapitres déjà passés portent `data-passe`. */
  function marquerChapitre(id) {
    var liens = dock.querySelectorAll('[data-dock-chapitre]');
    var rang = -1;
    Array.prototype.forEach.call(liens, function (a, i) {
      if (a.getAttribute('data-dock-chapitre') === id) { a.setAttribute('aria-current', 'location'); rang = i; }
      else a.removeAttribute('aria-current');
    });
    Array.prototype.forEach.call(liens, function (a, i) {
      if (rang > -1 && i < rang) a.setAttribute('data-passe', '');
      else a.removeAttribute('data-passe');
    });
    var liste = dock.querySelector('.fi-dock__chapitres');
    if (liste) liste.style.setProperty('--fi-rang', Math.max(rang, 0));
    journal('sommaire : chapitre « ' + id + ' », rang ' + (rang + 1) + ' sur ' + liens.length + ', ' + Math.max(rang, 0) + ' passé(s)');
  }

  /* ── Les boutons de la rangée ────────────────────────────────────── */
  dock.querySelector('[data-dock-depart]').addEventListener('click', function () {
    replier('départ');
    emettre('fi:aller', { chapitre: 'top' });
  });
  Array.prototype.forEach.call(boutonsSituation, function (b) {
    /* Le choix lui-même part du script « LE PARCOURS » (même clic,
       délégué sur le document) ; ici, on ouvre le bandeau. */
    b.addEventListener('click', function () { ouvrirSituation(b.getAttribute('data-dock-situation')); });
  });
  boutonTous.addEventListener('click', function () {
    if (etat === 'sommaire') replier('re-clic sur Tous');
    else ouvrir('sommaire');
  });
  dock.querySelector('[data-dock-rdv]').addEventListener('click', function () { replier('réserver'); });
  /* Une croix par vue qui en a une (situation, partage). */
  Array.prototype.forEach.call(dock.querySelectorAll('[data-dock-fermer]'), function (b) {
    b.addEventListener('click', function () { replier('croix'); });
  });
  /* Partager : le bouton de la rangée, la ligne du sommaire et
     « Emporter cette page » du contact passent tous par fi:partager, la
     porte du bandeau « partage » (spec partage-telecommande § 4). */
  Array.prototype.forEach.call(boutonsPartager, function (b) {
    b.addEventListener('click', function () {
      if (etat === 'partage') { replier('re-clic sur Partager'); return; }
      emettre('fi:partager', { mode: 'endroit' });
    });
  });
  document.addEventListener('fi:partager', function (e) {
    ouvrir('partage', (e.detail && e.detail.mode) || 'endroit');
  });
  /* Un chapitre du sommaire passe par fi:aller, la porte que prendra
     aussi la télécommande. */
  vues.sommaire.addEventListener('click', function (e) {
    var a = e.target.closest('[data-dock-chapitre]');
    if (!a) return;
    e.preventDefault();
    replier('chapitre choisi');
    emettre('fi:aller', { chapitre: a.getAttribute('data-dock-chapitre') });
  });
  /* ⚠️ « ou juste regarder » n'émet PAS fi:situation quand aucune
     situation n'était choisie (rien ne change) : on ne peut donc pas
     attendre l'événement. Ce clic-ci arrive avant celui du parcours
     (délégué sur le document) : la page est libre quand il fait défiler. */
  vues.question.addEventListener('click', function (e) {
    var choix = e.target.closest('[data-situation-choix]');
    if (choix && etat === 'question') replier('réponse : ' + choix.getAttribute('data-situation-choix'));
  });
  vues.situation.querySelector('[data-dock-suite]').addEventListener('click', function () { replier('voir la suite'); });

  /* Échap et clic dehors : tous les bandeaux, la question comprise
     depuis qu'elle n'est plus requise (règle 1).
     ⚠️ `pointerdown` en capture, comme la borne : un `click` ne vient pas
     toujours (un défilement tactile n'en produit pas).
     ⚠️ Le bouton qui OUVRE un bandeau depuis la page (« Choisir mon
     usage », [data-dock-ouvre]) n'est pas un clic dehors : sans cette
     exception, il refermerait aussitôt ce qu'il vient d'ouvrir. */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && etat !== 'replie') { replier('Échap'); rangee.querySelector('button').focus(); }
  });
  document.addEventListener('pointerdown', function (e) {
    if (etat === 'replie') return;
    var chemin = e.composedPath();
    if (chemin.includes(dock)) return;
    if (chemin.some(function (n) { return n.hasAttribute && n.hasAttribute('data-dock-ouvre'); })) return;
    replier('clic dehors');
  }, true);

  /* ── Ce que le reste de la page annonce ─────────────────────────── */
  function majSituation(id) {
    Array.prototype.forEach.call(boutonsSituation, function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-dock-situation') === id ? 'true' : 'false');
    });
  }
  document.addEventListener('fi:situation', function (e) {
    var d = e.detail || {};
    majSituation(d.id);
    if (etat === 'question') replier('réponse : ' + (d.id || 'juste regarder'));
  });
  document.addEventListener('fi:chapitre', function (e) { marquerChapitre(e.detail.id); });

  /* ── Deux hauteurs publiées sur <html>, mesurées et non devinées ──────
     --fi-dock-h      la rangée seule : la marge du pied de page
     --fi-dock-total  le dock entier, bandeau compris : le hero centre son
                      contenu AU-DESSUS, pour que rien ne passe sous la
                      question (retour du 28/09/2026). Elle change avec
                      l'état : ~400 px avec la question au téléphone, 64 replié. */
  if ('ResizeObserver' in window) {
    new ResizeObserver(function () {
      var racine = document.documentElement.style;
      racine.setProperty('--fi-dock-h', Math.ceil(rangee.getBoundingClientRect().height) + 'px');
      var total = Math.ceil(dock.getBoundingClientRect().height);
      racine.setProperty('--fi-dock-total', total + 'px');
      journal('hauteur du dock :', total, 'px (' + etat + ')');
    }).observe(dock);
  }

  /* ── La garde (?debug=1) : des règles qui ont une raison, donc des dents ──
     Elle crie si l'une d'elles casse ; muette hors debug. */
  function verifier() {
    if (!DEBUG) return;
    var fautes = [];
    var marque = document.documentElement.classList.contains('fi-question');
    if (marque !== (etat === 'question')) fautes.push('marque fi-question ' + (marque ? 'qui traîne' : 'absente') + ' en « ' + etat + ' »');
    var r = dock.getBoundingClientRect();
    if (r.width && (r.left < 0 || r.right > window.innerWidth)) fautes.push('dock hors écran (' + Math.round(r.left) + ' › ' + Math.round(r.right) + ' px pour ' + window.innerWidth + ')');
    Array.prototype.forEach.call(rangee.querySelectorAll('button:not([hidden]), a'), function (b) {
      var br = b.getBoundingClientRect();
      if (br.width && (br.width < 44 || br.height < 44)) fautes.push('cible de ' + Math.round(br.width) + '×' + Math.round(br.height) + ' px : ' + (b.getAttribute('aria-label') || b.textContent.trim()));
    });
    /* 8 cibles au bureau depuis « Partager » : la rangée ne doit jamais
       déborder (au téléphone, Partager passe dans le sommaire). */
    if (rangee.scrollWidth > rangee.clientWidth + 1) fautes.push('rangée qui déborde (' + rangee.scrollWidth + ' px pour ' + rangee.clientWidth + ')');
    if (fautes.length) journal('⚠️ garde du dock :', fautes);
    else journal('garde du dock : ok (' + etat + ', ' + window.innerWidth + ' px)');
  }
  window.addEventListener('resize', verifier);

  window.FiDock = { etat: function () { return etat; }, ouvrir: ouvrir, replier: replier, verifier: verifier };

  /* ── Au démarrage ────────────────────────────────────────────────── */
  majSituation(document.body.getAttribute('data-situation'));
  marquerChapitre(document.body.getAttribute('data-chapitre') || 'top');
  dock.hidden = false;

  /* Le panneau du hero rejoint TOUJOURS le dock quand le script tourne :
     sans cela, un visiteur qui revient le voyait resté dans le hero, en
     double avec la rangée (bug relevé le 28/09/2026). La question s'y
     ouvre ensuite sur demande (hero-depart.js, règle 1). */
  var panneau = document.querySelector('.hero .situations');
  if (panneau) {
    vues.question.appendChild(panneau);
    vues.question.setAttribute('role', 'region');
    vues.question.setAttribute('aria-labelledby', 'situationsQuestion');
  } else {
    journal('⚠️ panneau .situations introuvable : pas de question, page libre');
  }

  /* Recette : ?question=1 ouvre la question au chargement (QA, démo). */
  if (panneau && new URLSearchParams(location.search).get('question') === '1') {
    ouvrir('question', '?question=1');
  } else {
    verifier();
  }

})();
