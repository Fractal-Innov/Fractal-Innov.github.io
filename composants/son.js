/* ══════════════════════════════════════════════════════════════════════
   LE MOTEUR D'INTONATIONS (composants/son.js)
   spec : docs/superpowers/specs/2026-09-27-galerie-affordance-son-design.md § 6
   d'après la voix du village (Needle5/Needle/fractal-innov/src/scripts/
   voixDuVillage.ts et Needle5/socle/son/synthese.ts), jalons 55 à 57

   Ce qu'il fait : il ÉCOUTE les gestes du visiteur (fi:situation,
   fi:geste, fi:son) et répond par un petit symbole sonore. Il ne connaît
   aucun composant, aucun sélecteur : un composant nouveau sonne sans
   qu'on touche à ce fichier.

   Les règles, reprises du village :
     1. **Le silence entre deux gestes n'est pas un manque.** Défiler ne
        joue rien (retour d'usage du 27/09/2026 : une note par section,
        c'était trop présent). Seul un CTA actionné sonne ; un panneau qui
        défile tout seul (fi:geste avec `auto`) se tait.
     2. **Grave et dans une salle.** Sol à 196 Hz, gamme pentatonique (aucun
        demi-ton, donc aucune combinaison ne sonne faux), une réverbe
        générée et un écho léger : le son a de l'espace au lieu d'un bip.
     3. **Un son se ferme en s'éteignant.** Un passe-bas suit l'enveloppe :
        la note s'assombrit en mourant, comme un corps qui résonne.
     4. **Un symbole a au moins deux notes, et leur sens compte.** Monter,
        c'est entrer ; descendre, c'est revenir. Le degré d'arrivée est
        celui de la situation : après « Garder », les gestes se posent sur
        sol.
     5. **La règle de la queue.** Si le symbole précédent résonne encore,
        seule la note d'ARRIVÉE du suivant sonne, plus bas, dans sa
        réverbe : qui clique vite fait une mélodie, pas un empilement.
     6. **La doublure à l'octave inférieure est réservée à la
        réservation** : entendue seule, elle ne peut être que ça.

   Ce qu'il promet aussi :
     - trois niveaux, comme fi-v3 : « plein », « doux », « muet ».
       **Doux par défaut** (retour du 27/09/2026) : le visiteur entend
       dès son premier geste, discrètement, par-dessus sa musique. Le
       bouton son fait tourner les niveaux (FiSon.cycler()) et le choix
       est retenu (localStorage « fi:son-niveau ») ;
     - le moteur audio du navigateur n'existe pas tant qu'un geste ne l'a
       pas demandé : le premier clic ou la première touche le réveille,
       et rien ne joue avant ;
     - jamais d'exception : sans Web Audio ou sans stockage, il se tait.

   API    : window.FiSon = { niveau(), actif(), cycler(), regler(n),
                          basculer() (alias de cycler), jouer(degre) }
   Émet   : fi:son {actif, niveau}
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

  /* ── L'accordage ──────────────────────────────────────────────────────
     ⚠️ 196 Hz et non plus do4 (262 Hz) jusqu'à do6 (1 047 Hz) : au-dessus de
     1 000 Hz on entre dans la bande où l'oreille fatigue le plus vite, et
     c'est là que l'ancien moteur passait sa réservation. Un palier monte
     d'une QUINTE (7 demi-tons), jamais d'une octave : le village a payé
     pour apprendre qu'une octave par étage sort de la bande utile. */
  var FONDAMENTALE = 196;
  var PENTA = [0, 2, 4, 7, 9];
  var PAS_PALIER = 7;
  var NOMS = ['sol', 'la', 'si', 'ré', 'mi'];
  /* Le degré de chaque situation : c'est là que ses gestes se posent. */
  var DEGRES = { aucune: 0, convaincre: 1, former: 2, garder: 3 };

  function hauteur(palier, degre) {
    var octave = Math.floor(degre / PENTA.length);
    var i = ((degre % PENTA.length) + PENTA.length) % PENTA.length;
    return FONDAMENTALE * Math.pow(2, (palier * PAS_PALIER) / 12 + octave + PENTA[i] / 12);
  }
  function nom(palier, degre) {
    var i = ((degre % PENTA.length) + PENTA.length) % PENTA.length;
    return NOMS[i] + palier;
  }

  /* Les gains de fi-v3 : « doux » (0,3) est le volume que ce moteur a
     toujours eu ; « plein » (0,85) reste sous 1 pour garder de la marge
     aux notes doublées de la réservation. */
  var NIVEAUX = { plein: 0.85, doux: 0.3, muet: 0 };
  var ORDRE = ['plein', 'doux', 'muet'];   /* l'ordre du cycle, celui de fi-v3 */
  var COUPURE = 900;              /* passe-bas au palier 0, en Hz */
  var OUVERTURE_PAR_PALIER = 1.35;
  var PLAFOND_COUPURE = 3200;
  var DELAI_SUSPENSION = 1500;    /* ms en arrière-plan avant de suspendre */

  /* Le niveau retenu. ⚠️ Migration : l'ancienne clé « fi:son » était un
     booléen ; « 1 » (allumé) devient doux, « 0 » (coupé) devient muet,
     pour qu'un visiteur qui avait coupé le son ne l'entende pas revenir. */
  var niveau = 'doux';
  try {
    var retenu = localStorage.getItem('fi:son-niveau');
    var ancien = localStorage.getItem('fi:son');
    if (NIVEAUX.hasOwnProperty(retenu)) niveau = retenu;
    else if (ancien === '0') niveau = 'muet';
  } catch (e) {}
  var actif = niveau !== 'muet';
  var ctx = null;
  var maitre = null;
  var envoiEcho = null;
  var finQueue = 0;               /* instant (horloge audio) où la queue du dernier symbole s'éteint */
  var minuterieSuspension = 0;

  function degreSituation() {
    var s = document.body.getAttribute('data-situation');
    return DEGRES.hasOwnProperty(s) ? DEGRES[s] : 0;
  }
  function coupureDe(palier) {
    return Math.min(PLAFOND_COUPURE, COUPURE * Math.pow(OUVERTURE_PAR_PALIER, palier));
  }

  /* ── La salle : une réverbe générée, sans fichier à charger ──────────
     Un bruit qui décroît en exponentielle : la recette classique d'une
     réverbe bon marché, ni licence ni poids. Plus un écho rebouclé léger
     qui donne les rebonds distincts après une note longue. */
  function construireImpulsion(c) {
    var n = Math.floor(c.sampleRate * 2.4);
    var buf = c.createBuffer(2, n, c.sampleRate);
    for (var canal = 0; canal < 2; canal++) {
      var data = buf.getChannelData(canal);
      for (var i = 0; i < n; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 3.2);
    }
    return buf;
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
        maitre.gain.value = NIVEAUX[niveau];
        maitre.connect(ctx.destination);
        var convolveur = ctx.createConvolver();
        convolveur.buffer = construireImpulsion(ctx);
        envoiEcho = ctx.createGain();
        envoiEcho.gain.value = 0.45;
        var delai = ctx.createDelay(1);
        delai.delayTime.value = 0.19;
        var reinjection = ctx.createGain();
        reinjection.gain.value = 0.32;
        delai.connect(reinjection);
        reinjection.connect(delai);
        envoiEcho.connect(convolveur);
        convolveur.connect(maitre);
        envoiEcho.connect(delai);
        delai.connect(maitre);
        journal('moteur audio créé, avec sa salle');
      }
      if (ctx.state === 'suspended') sansErreur(ctx.resume());
      return true;
    } catch (e) {
      journal('moteur audio indisponible :', e && e.message);
      ctx = null;
      return false;
    }
  }

  /* ── Une note : sinus, enveloppe percussive, filtre qui se referme ───
     o : { gain, queue (s), envoi (part vers la salle), coupure (Hz),
           doublure (demi-tons, vers le BAS seulement) } */
  function note(freq, t, o) {
    var env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(Math.max(0.0002, o.gain), t + 0.012);
    env.gain.exponentialRampToValueAtTime(0.0001, t + o.queue);
    /* ⚠️ Le filtre AVANT l'enveloppe et la prise d'écho : sinon la salle
       recevrait le sommet non filtré et rendrait ce que le filtre ôte. */
    var filtre = ctx.createBiquadFilter();
    filtre.type = 'lowpass';
    filtre.Q.value = 0.7;
    filtre.frequency.setValueAtTime(o.coupure, t);
    filtre.frequency.exponentialRampToValueAtTime(Math.max(120, o.coupure * 0.35), t + o.queue);
    filtre.connect(env);
    var oscs = [];
    var poser = function (hz, part) {
      var osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(hz, t);
      if (part === 1) osc.connect(filtre);
      else { var g = ctx.createGain(); g.gain.value = part; osc.connect(g); g.connect(filtre); }
      osc.start(t);
      osc.stop(t + o.queue + 0.05);
      oscs.push(osc);
    };
    poser(freq, 1);
    if (o.doublure < 0) poser(freq * Math.pow(2, o.doublure / 12), 0.5);
    env.connect(maitre);
    if (o.envoi) {
      var prise = ctx.createGain();
      prise.gain.value = o.envoi;
      env.connect(prise);
      prise.connect(envoiEcho);
    }
    oscs[0].onended = function () { try { env.disconnect(); filtre.disconnect(); } catch (e) {} };
  }

  /* ── Le vocabulaire ──────────────────────────────────────────────────
     notes : [palier, degré] ; pas : secondes entre deux notes ; queue :
     durée de résonance de chaque note ; envoi : part vers la salle.
     ⚠️ Un acquit (clic sur un objet déjà là) a un pas SERRÉ et pas
     d'écho : deux notes espacées se liraient comme un déplacement. */
  function symbole(nomSymbole, notes, reglage) {
    if (!actif || document.hidden || !ctx || ctx.state === 'closed') return;
    var t = ctx.currentTime;
    /* La règle de la queue : on garde l'ARRIVÉE, la dernière note. */
    var enchaine = t < finQueue;
    var aJouer = enchaine ? [notes[notes.length - 1]] : notes;
    var noms = [];
    aJouer.forEach(function (n, i) {
      var palier = n[0], degre = n[1];
      var derniere = enchaine || i === aJouer.length - 1;
      note(hauteur(palier, degre), t + i * reglage.pas, {
        gain: (enchaine ? 0.6 : 1) * reglage.gain * (derniere ? 1 : 0.78),
        queue: reglage.queue,
        envoi: reglage.envoi,
        coupure: coupureDe(palier),
        doublure: derniere ? (reglage.doublure || 0) : 0
      });
      noms.push(nom(palier, degre));
    });
    finQueue = t + (aJouer.length - 1) * reglage.pas + reglage.queue * 0.55;
    journal('♪', nomSymbole, ':', noms.join('-') + (enchaine ? ' (dans la queue du précédent)' : ''));
  }

  /* Le son s'allume : deux gongs, la tonique puis sa quinte, longs et
     lointains. C'est l'entrée dans la visite sonore. */
  function gongs() {
    symbole('entrée', [[0, 0], [0, 3]], { pas: 0.62, gain: 0.4, queue: 3.4, envoi: 0.7 });
  }
  /* Choisir une situation, c'est entrer : on monte vers son degré, un
     palier plus haut. « Aucune », c'est revenir : on redescend. */
  function situation(id) {
    if (id) symbole('situation ' + id, [[0, 0], [1, DEGRES[id] || 0]], { pas: 0.32, gain: 0.34, queue: 1.6, envoi: 0.5 });
    else symbole('retour', [[1, 0], [0, 0]], { pas: 0.32, gain: 0.26, queue: 1.2, envoi: 0.4 });
  }
  var GESTES = {
    /* Une pastille, un pilier : un acquit, deux notes serrées sans écho. */
    etape: function (d) {
      var degre = Math.max(1, Math.min(3, d.etape || 1));
      return { notes: [[1, degre - 1], [1, degre]], reglage: { pas: 0.11, gain: 0.16, queue: 0.7, envoi: 0 } };
    },
    choix: function () {
      var degre = degreSituation();
      return { notes: [[1, degre], [1, degre + 1]], reglage: { pas: 0.11, gain: 0.16, queue: 0.7, envoi: 0 } };
    },
    /* Ouvrir une démo : on entre, deux notes qui montent dans la salle. */
    ouvre: function () {
      var degre = degreSituation();
      return { notes: [[1, degre], [2, degre]], reglage: { pas: 0.24, gain: 0.26, queue: 1.4, envoi: 0.45 } };
    },
    /* La réservation : la résolution, trois notes qui montent vers le
       degré de la situation, la dernière doublée à l'octave inférieure. */
    rdv: function () {
      return {
        notes: [[0, 0], [0, 3], [1, degreSituation() + 5]],
        reglage: { pas: 0.2, gain: 0.34, queue: 2.4, envoi: 0.6, doublure: -12 }
      };
    }
  };

  document.addEventListener('fi:situation', function (e) {
    var d = e.detail || {};
    /* Au démarrage (lien de relance), la situation vient de l'URL, pas
       d'un geste : rien ne joue. */
    if (d.origine === 'url') return;
    situation(d.id);
  });
  document.addEventListener('fi:geste', function (e) {
    var d = e.detail || {};
    /* Un panneau qui défile tout seul n'est pas un geste du visiteur. */
    if (d.auto) { journal('geste', d.geste, 'automatique : silence'); return; }
    var f = GESTES[d.geste] || GESTES.choix;
    var s = f(d);
    symbole('geste ' + d.geste, s.notes, s.reglage);
  });

  /* ── L'arrière-plan ──────────────────────────────────────────────────
     ⚠️ Suspendre tout de suite couperait la réservation : « Réserver
     30 min » ouvre l'agenda dans un nouvel onglet, et l'accueil passe en
     arrière-plan au moment même où le symbole commence. */
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

  /* ── Le premier geste ────────────────────────────────────────────────
     Le son est doux par défaut, mais le moteur attend le premier geste
     dans la page pour naître : le navigateur l'exige. */
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
  /* Régler un niveau : le gain glisse (80 ms) au lieu de sauter, et un
     niveau audible se fait entendre tout de suite : les deux gongs
     servent d'aperçu, le visiteur sait ce qu'il vient de choisir. */
  function regler(n) {
    if (!NIVEAUX.hasOwnProperty(n)) return niveau;
    niveau = n;
    actif = n !== 'muet';
    try { localStorage.setItem('fi:son-niveau', n); } catch (e) {}
    journal('son', n, '(gain', NIVEAUX[n] + ')');
    if (actif && reveiller()) {
      maitre.gain.setTargetAtTime(NIVEAUX[n], ctx.currentTime, 0.08);
      finQueue = 0;
      gongs();
    }
    document.dispatchEvent(new CustomEvent('fi:son', { detail: { actif: actif, niveau: niveau } }));
    return niveau;
  }
  /* Le bouton son : niveau suivant dans l'ordre de fi-v3 (plein, doux,
     muet, puis on reboucle). Depuis doux : muet, puis plein. */
  function cycler() {
    return regler(ORDRE[(ORDRE.indexOf(niveau) + 1) % ORDRE.length]);
  }
  /* Pour la galerie : une note seule, au degré donné (palier 1). */
  function jouer(degre) {
    if (!actif || !reveiller()) return false;
    note(hauteur(1, degre | 0), ctx.currentTime, { gain: 0.26, queue: 1.2, envoi: 0.4, coupure: coupureDe(1) });
    journal('♪ jouer', nom(1, degre | 0));
    return true;
  }

  window.FiSon = {
    niveau: function () { return niveau; },
    actif: function () { return actif; },
    cycler: cycler,
    regler: regler,
    basculer: cycler,   /* l'ancien nom, gardé pour ne rien casser */
    jouer: jouer
  };
  journal('prêt, son', niveau + (actif ? ' (en attente d\'un geste)' : ''), '· silence au défilement, un symbole par CTA');
})();
