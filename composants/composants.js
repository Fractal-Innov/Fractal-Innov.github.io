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
