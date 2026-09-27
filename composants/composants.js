/* ══════════════════════════════════════════════════════════════════════
   LES COMPOSANTS (composants/composants.js)
   spec : docs/superpowers/specs/2026-09-27-galerie-affordance-son-design.md § 5, § 7
   galerie vivante : /galerie/

   Un comportement par attribut, rien d'autre :
     data-composant="choix"        groupe de piliers, flèches du clavier
     data-composant="bascule-son"  le bouton son (lit window.FiSon)
     data-composant="story"        des pastilles qui font défiler des panneaux
     data-eclat                    une onde iridescente au clic
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
     l'accueil, par exemple) rognerait l'onde à son bord. En
     coordonnées de page, elle défile quand même avec l'élément. */
  function eclat(el, x, y) {
    if (!el || sobre(el)) return;
    var r = el.getBoundingClientRect();
    var boite = document.createElement('span');
    boite.className = 'fi-eclat';
    boite.setAttribute('aria-hidden', 'true');
    boite.style.left = (window.scrollX + r.left + (x == null ? r.width / 2 : x)) + 'px';
    boite.style.top = (window.scrollY + r.top + (y == null ? r.height / 2 : y)) + 'px';
    // L'onde couvre un peu plus que l'élément, bornée pour rester légère
    var onde = Math.min(320, Math.max(80, Math.max(r.width, r.height) * 1.4));
    boite.style.setProperty('--fi-onde', Math.round(onde) + 'px');
    boite.appendChild(document.createElement('span'));
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

  /* ── STORY : des pastilles qui font défiler des panneaux ─────────────
     Balisage attendu, dans l'élément data-composant="story" :
       [data-story-pastilles]  la rangée d'onglets, `hidden` au départ
         button[data-story-pastille][aria-controls=<id du panneau>]
           .fi-pastille__jauge  la jauge qui se remplit
       [data-story-scene]      le conteneur des panneaux
         [data-story-panneau]  un panneau, avec son id
     Options : data-story-duree (ms, 5000 par défaut) ; data-story-situation
     (le panneau dont data-usages contient la situation se fige, via
     fi:situation) ; data-story-geste="etape" (chaque changement émet
     fi:geste {etape: n}, `auto: true` s'il vient du minuteur).
     ⚠️ Le temps, c'est la jauge : son animation CSS dure `--fi-story-duree`
     et sa fin (animationend) fait avancer. Mettre en pause = figer
     l'animation (data-story-etat="pause") ; aucun minuteur JS à resynchroniser.
     Sans JavaScript, rien ne change : les pastilles restent cachées et
     tous les panneaux s'affichent. */
  function activerStory(boite) {
    var rangee = boite.querySelector('[data-story-pastilles]');
    var pastilles = Array.prototype.slice.call(boite.querySelectorAll('[data-story-pastille]'));
    var panneaux = pastilles.map(function (p) { return document.getElementById(p.getAttribute('aria-controls')); });
    if (!rangee || !pastilles.length || panneaux.indexOf(null) >= 0) {
      journal('story : balisage incomplet, rien n\'est activé'); return;
    }
    var duree = parseInt(boite.getAttribute('data-story-duree'), 10) || 5000;
    var geste = boite.getAttribute('data-story-geste');
    boite.style.setProperty('--fi-story-duree', duree + 'ms');
    var courant = -1;
    /* Ce qui arrête le défilement. Figé : il ne repartira pas tout seul
       (un choix du visiteur). En pause : il repartira (survol, focus,
       hors de l'écran, onglet caché). */
    var fige = { local: false, situation: false };
    var pause = { survol: false, focus: false, horsEcran: true, onglet: document.hidden };

    rangee.setAttribute('role', 'tablist');
    pastilles.forEach(function (p, i) {
      if (!p.id) p.id = panneaux[i].id + '-pastille';
      p.setAttribute('role', 'tab');
      panneaux[i].setAttribute('role', 'tabpanel');
      panneaux[i].setAttribute('aria-labelledby', p.id);
    });

    function etat() {
      if (fige.local || fige.situation || sobre(boite)) return 'fige';
      if (pause.survol || pause.focus || pause.horsEcran || pause.onglet) return 'pause';
      return 'joue';
    }
    function majEtat() {
      var e = etat();
      if (boite.getAttribute('data-story-etat') !== e) {
        boite.setAttribute('data-story-etat', e);
        journal('story', boite.id || '', ':', e, JSON.stringify({ fige: fige, pause: pause }));
      }
    }
    function montrer(i, origine) {
      if (i === courant) return;
      courant = i;
      pastilles.forEach(function (p, j) {
        p.setAttribute('aria-selected', j === i ? 'true' : 'false');
        p.tabIndex = j === i ? 0 : -1;
        if (j === i) { panneaux[j].removeAttribute('inert'); panneaux[j].removeAttribute('aria-hidden'); }
        else { panneaux[j].setAttribute('inert', ''); panneaux[j].setAttribute('aria-hidden', 'true'); }
      });
      if (origine !== 'depart' && !sobre(boite)) rejouer(panneaux[i], 'fi-story--entree', 500);
      /* La situation a déjà son accord : le panneau change en silence. */
      if (geste && (origine === 'clic' || origine === 'auto')) {
        emettre('fi:geste', { chapitre: chapitreDe(boite), geste: geste, etape: i + 1, auto: origine === 'auto' });
      }
      journal('story : panneau', panneaux[i].id, '(' + origine + ')');
    }

    /* Le minuteur : la jauge de la pastille active a fini de se remplir. */
    boite.addEventListener('animationend', function (e) {
      if (!e.target.classList.contains('fi-pastille__jauge') || etat() !== 'joue') return;
      montrer((courant + 1) % pastilles.length, 'auto');
    });
    /* Un clic fige ici seulement : la situation de la page ne change pas. */
    rangee.addEventListener('click', function (e) {
      var p = e.target.closest('[data-story-pastille]');
      if (!p) return;
      fige.local = true;
      montrer(pastilles.indexOf(p), 'clic');
      majEtat();
    });
    rangee.addEventListener('keydown', function (e) {
      var sens = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (!sens) return;
      e.preventDefault();
      var i = (courant + sens + pastilles.length) % pastilles.length;
      pastilles[i].focus();
      pastilles[i].click();
    });
    boite.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') { pause.survol = true; majEtat(); } });
    boite.addEventListener('pointerleave', function () { pause.survol = false; majEtat(); });
    boite.addEventListener('focusin', function () { pause.focus = true; majEtat(); });
    boite.addEventListener('focusout', function (e) {
      if (!boite.contains(e.relatedTarget)) { pause.focus = false; majEtat(); }
    });
    document.addEventListener('visibilitychange', function () { pause.onglet = document.hidden; majEtat(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entrees) {
        pause.horsEcran = !entrees[entrees.length - 1].isIntersecting;
        majEtat();
      }, { threshold: 0.35 }).observe(boite);
    } else {
      pause.horsEcran = false;
    }

    /* La situation de la page, si le composant la suit. */
    function suivreSituation(id, origine) {
      var i = -1;
      if (id) panneaux.forEach(function (pan, j) {
        if (i < 0 && (' ' + (pan.getAttribute('data-usages') || '') + ' ').indexOf(' ' + id + ' ') >= 0) i = j;
      });
      fige.local = false;
      fige.situation = i >= 0;
      if (i >= 0) montrer(i, origine);
      majEtat();
    }
    var suitSituation = boite.hasAttribute('data-story-situation');

    boite.setAttribute('data-story-actif', '');
    rangee.hidden = false;
    montrer(0, 'depart');
    if (suitSituation) {
      suivreSituation(document.body.getAttribute('data-situation'), 'depart');
      document.addEventListener('fi:situation', function (e) { suivreSituation(e.detail.id, 'situation'); });
    }
    majEtat();
  }

  /* ── L'ACTIVATION ────────────────────────────────────────────────── */
  var ACTIVATEURS = { 'choix': activerChoix, 'bascule-son': activerBasculeSon, 'story': activerStory };
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
