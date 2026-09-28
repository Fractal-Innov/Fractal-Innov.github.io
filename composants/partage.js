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
  var barreOnglets = vue.querySelector('[role="tablist"]');
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
      if (url !== lienDessine) return; /* le lien a changé pendant le chargement */
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
    /* Un seul onglet n'est pas un choix : la barre disparaît avec lui. */
    barreOnglets.hidden = ongletTele.hidden;
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
    /* Au téléphone, pas de QR : c'est lui qu'on scannerait. */
    afficher(lienEndroit(), libelleEndroit(), estTelephone() ? '' : CONSIGNES.endroit, !estTelephone());
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
    function fait() {
      boutonCopier.textContent = 'Lien copié';
      zoneAnnonce.textContent = 'Lien copié';
      journal('lien copié :', lien);
    }
    function selectionner() { window.getSelection().selectAllChildren(zoneLien); journal('presse-papiers refusé : lien sélectionné'); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(lien).then(fait, selectionner);
    else selectionner();
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
