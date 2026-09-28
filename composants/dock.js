/* ══════════════════════════════════════════════════════════════════════
   LE DOCK (composants/dock.js)
   d'après le dock de la borne : salon_demo_app/src/components/layout/Dock.tsx
   décidé le 28/09/2026 (spec 2026-09-27-galerie-affordance-son-design.md § 17)

   Ce qu'il fait : UNE surface en bas de l'écran. La rangée de boutons en
   bas, et au-dessus un bandeau qui prend l'un de trois visages :

     état        bandeau                         page
     ─────────   ─────────────────────────────   ─────────────────────────
     question    la première question (requise)  verrouillée, atténuée
     situation   la situation cliquée            libre
     sommaire    « Tous » : les chapitres        libre
     replie      aucun                           libre

   L'état vit à UN seul endroit, `data-etat` sur le dock ; le CSS en tire
   l'apparence (plus l'interaction demandée est forte, plus le bandeau
   appelle). Deux fonctions seulement le changent : ouvrir() et replier().

   Les règles :
     1. **La question se pose une fois.** Seul un visiteur neuf, arrivé en
        haut de page, la voit bandeau ouvert. Un retour (« fi:dock-repondu »),
        un lien `?situation=` ou une ancre (`/#demos`) arrivent replié : ils
        sont venus pour un contenu précis.
     2. **Pas de croix sur la question.** Échap ne la ferme pas : elle
        attend une réponse, et « ou juste regarder » est la sortie visible.
     3. **Le verrou vient APRÈS le déplacement réussi du panneau.** Si ce
        script plante avant, la question reste dans le hero, en liens, et
        la page n'est jamais bloquée.
     4. **Il ne choisit rien lui-même.** Le choix d'une situation reste au
        script « LE PARCOURS » (délégation sur [data-situation-choix]) ; le
        dock écoute fi:situation, comme le son et la mesure.

   Écoute : fi:situation {id, origine}, fi:chapitre {id}
   Émet   : fi:dock {etat, avant}, fi:aller {chapitre} (contrat existant)
   Journal: « ?debug=1 » (clé fi:debug), préfixe [dock].
   Recette: « ?question=1 » repose la question à chaque chargement (efface
            fi:dock-repondu, remonte en haut) : pour la QA, sans vider le stockage.
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
  /* Ce que le verrou rend inerte : tout ce qui suit le hero. */
  var suite = document.querySelectorAll('.page-rest, .footer');
  var CLE_REPONDU = 'fi:dock-repondu';

  var etat = 'replie';
  var situationOuverte = null;

  /* ── Le verrou ─────────────────────────────────────────────────────
     `inert` retire la suite du clavier et des clics ; la classe sur <html>
     bloque le défilement et atténue (CSS). Les deux vont ensemble. */
  /* Quitter la question, par n'importe quel chemin, c'est y avoir répondu :
     la prochaine visite arrive replié. */
  function noterReponse() {
    try { localStorage.setItem(CLE_REPONDU, '1'); } catch (e) {}
  }
  function verrouiller(oui) {
    document.documentElement.classList.toggle('fi-verrou', oui);
    Array.prototype.forEach.call(suite, function (el) { el.inert = oui; });
  }

  /* ── Les deux seules fonctions qui changent l'état ─────────────────── */
  function ouvrir(nouvel, detail) {
    var avant = etat;
    if (avant === 'question' && nouvel !== 'question') noterReponse();
    etat = nouvel;
    Object.keys(vues).forEach(function (k) { vues[k].hidden = k !== nouvel; });
    dock.setAttribute('data-etat', nouvel);
    boutonTous.setAttribute('aria-expanded', nouvel === 'sommaire' ? 'true' : 'false');
    verrouiller(nouvel === 'question');
    journal(avant, '›', nouvel + (detail ? ' (' + detail + ')' : ''), nouvel === 'question' ? '· page verrouillée' : '');
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
    if (avant === 'question') { verrouiller(false); noterReponse(); }
    journal(avant, '› replie (' + raison + ')', avant === 'question' ? '· verrou retiré' : '');
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
  function marquerChapitre(id) {
    Array.prototype.forEach.call(dock.querySelectorAll('[data-dock-chapitre]'), function (a) {
      if (a.getAttribute('data-dock-chapitre') === id) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });
  }

  /* ── Les boutons de la rangée ────────────────────────────────────── */
  dock.querySelector('[data-dock-depart]').addEventListener('click', function () {
    if (etat !== 'question') replier('départ');
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
  dock.querySelector('[data-dock-rdv]').addEventListener('click', function () { if (etat !== 'question') replier('réserver'); });
  dock.querySelector('[data-dock-fermer]').addEventListener('click', function () { replier('croix'); });
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

  /* Échap et clic dehors : situation et sommaire seulement (règle 2).
     ⚠️ `pointerdown` en capture, comme la borne : un `click` ne vient pas
     toujours (un défilement tactile n'en produit pas). */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && (etat === 'situation' || etat === 'sommaire')) { replier('Échap'); rangee.querySelector('button').focus(); }
  });
  document.addEventListener('pointerdown', function (e) {
    if ((etat === 'situation' || etat === 'sommaire') && !e.composedPath().includes(dock)) replier('clic dehors');
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
    var verrou = document.documentElement.classList.contains('fi-verrou');
    var inertes = Array.prototype.every.call(suite, function (el) { return el.inert; });
    if (etat === 'question' && (!verrou || !inertes)) fautes.push('question sans verrou complet (défilement ' + (verrou ? 'bloqué' : 'LIBRE') + ', suite ' + (inertes ? 'inerte' : 'ACTIVE') + ')');
    if (etat !== 'question' && (verrou || Array.prototype.some.call(suite, function (el) { return el.inert; }))) fautes.push('verrou qui traîne en « ' + etat + ' »');
    var r = dock.getBoundingClientRect();
    if (r.width && (r.left < 0 || r.right > window.innerWidth)) fautes.push('dock hors écran (' + Math.round(r.left) + ' › ' + Math.round(r.right) + ' px pour ' + window.innerWidth + ')');
    Array.prototype.forEach.call(rangee.querySelectorAll('button:not([hidden]), a'), function (b) {
      var br = b.getBoundingClientRect();
      if (br.width && (br.width < 44 || br.height < 44)) fautes.push('cible de ' + Math.round(br.width) + '×' + Math.round(br.height) + ' px : ' + (b.getAttribute('aria-label') || b.textContent.trim()));
    });
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
     double avec la rangée (bug relevé le 28/09/2026). Seul le verrou
     dépend de la question ; le déplacement, jamais. */
  var panneau = document.querySelector('.hero .situations');
  if (panneau) {
    vues.question.appendChild(panneau);
    vues.question.setAttribute('role', 'region');
    vues.question.setAttribute('aria-labelledby', 'situationsQuestion');
  } else {
    journal('⚠️ panneau .situations introuvable : pas de question, page libre');
  }

  /* Recette : ?question=1 force la question, comme pour un visiteur neuf.
     On oublie la réponse notée et on remonte en haut (le navigateur restaure
     sinon le défilement au rechargement, ce qui replierait le dock). */
  var force = new URLSearchParams(location.search).get('question') === '1';
  if (force && panneau) {
    try { localStorage.removeItem(CLE_REPONDU); } catch (e) {}
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    journal('?question=1 : réponse oubliée, question reposée (recette)');
  }

  var repondu = false;
  try { repondu = localStorage.getItem(CLE_REPONDU) === '1'; } catch (e) {}
  var ancre = !force && location.hash && location.hash !== '#top';
  var viaSituation = !force && document.body.hasAttribute('data-situation');
  var descendu = !force && window.scrollY > 40;
  if (!panneau || repondu || ancre || viaSituation || descendu) {
    if (panneau) journal('pas de question :', repondu ? 'déjà répondu' : ancre ? 'arrivée sur ' + location.hash : viaSituation ? 'situation venue de l\'URL' : 'page déjà défilée');
    verifier();
    return;
  }
  /* Règle 3 : le panneau est déjà déplacé (plus haut), PUIS on verrouille. */
  ouvrir('question', 'visiteur neuf');
  /* Le focus se pose sur la question, sans faire sauter la page. */
  var titreQuestion = document.getElementById('situationsQuestion');
  if (titreQuestion) {
    titreQuestion.setAttribute('tabindex', '-1');
    titreQuestion.focus({ preventScroll: true });
  }

})();
