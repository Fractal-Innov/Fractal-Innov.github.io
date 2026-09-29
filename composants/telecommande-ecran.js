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

  /* ── L'écran reste allumé tant qu'on le pilote (29/09/2026) ──────────
     Un téléphone qui sert d'écran n'est plus touché : sans verrou de
     veille, il s'éteindrait au bout de ~30 s et la page se figerait
     (plus de défilement, plus de relais). Wake Lock : Chrome, Safari iOS
     16.4+ ; ailleurs, rien ne change. Le navigateur lâche le verrou quand
     l'onglet passe en arrière-plan : on le reprend au retour. */
  var veille = null;
  function tenirEveille(oui) {
    if (!('wakeLock' in navigator)) return;
    if (oui && !veille && document.visibilityState === 'visible') {
      navigator.wakeLock.request('screen').then(function (v) {
        veille = v;
        journal('écran gardé allumé pendant le pilotage');
        v.addEventListener('release', function () { veille = null; });
      }, function (e) { journal('veille : verrou refusé (' + e.name + ')'); });
    } else if (!oui && veille) {
      veille.release();
      veille = null;
      journal('veille rendue au système');
    }
  }
  document.addEventListener('visibilitychange', function () { if (presente) tenirEveille(true); });

  function marquerPresence() {
    clearTimeout(minuteriePresence);
    minuteriePresence = setTimeout(function () {
      presente = false;
      tenirEveille(false);
      if (dock) dock.removeAttribute('data-telecommande');
      journal('plus de nouvelles du téléphone depuis ' + SILENCE_MAX / 1000 + ' s : témoin éteint');
      changer('prete');
    }, SILENCE_MAX);
    if (presente) return;
    presente = true;
    tenirEveille(true);
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
    /* ⚠️ Le compte à rebours part UNE fois par épisode de connexion et ne
       s'annule qu'à l'inscription réussie. Relancé à chaque essai, il ne
       finissait jamais : un relais mort échoue tout de suite, et les
       essais (1, 2, 4, 8, 10 s) sont plus rapprochés que 20 s (bug du
       28/09/2026). Une fois « indisponible », on y reste jusqu'au succès :
       l'essai suivant ne fait pas clignoter « Préparation… ». */
    if (!presente && etat !== 'indisponible') changer('connexion');
    if (!minuterieIndispo) {
      minuterieIndispo = setTimeout(function () {
        minuterieIndispo = 0;
        if (etat === 'connexion') { journal('relais muet depuis ' + DELAI_INDISPONIBLE / 1000 + ' s'); changer('indisponible'); }
      }, DELAI_INDISPONIBLE);
    }
    journal('connexion au relais (le premier réveil peut prendre ~7 s)');
    try { ws = new WebSocket(RELAIS); } catch (e) { journal('⚠️ WebSocket refusé :', e.message); relancer(); return; }
    ws.onopen = function () { envoyer({ type: 'REGISTER', role: 'display', salle: salle }); };
    ws.onmessage = function (e) {
      var m;
      try { m = JSON.parse(e.data); } catch (x) { return; }
      if (m.type === 'REGISTER_OK') {
        attente = 1000;
        clearTimeout(minuterieIndispo);
        minuterieIndispo = 0;
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
