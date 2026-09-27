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
