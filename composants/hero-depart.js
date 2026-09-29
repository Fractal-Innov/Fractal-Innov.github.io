/* ══ L'INVITATION DU HERO ══════════════════════════════════════════════
   décidée le 29/09/2026 (spec 2026-09-27-galerie-affordance-son-design.md § 19)

   La question du dock ne s'ouvre plus seule : elle ne se montrait qu'au
   visiteur neuf arrivé en haut de page, les autres ne la voyaient jamais.
   Tout le monde voit désormais la même porte d'entrée dans le hero :

     « Votre besoin : [Choisir] »  ouvre (ou referme) la question du
                            dock ; après un choix : « Votre besoin :
                            ◎ Former [Changer] »
     « Son »                muet par défaut ; allume en « doux », coupe
     la ligne sous          « 3 réponses · le site s'adapte », tant
                            qu'aucun usage n'est choisi

   Sans dock ou sans question (script en panne), l'invitation reste
   masquée : la question est alors restée dans le hero, en liens.
   Sans FiSon, la pastille « Son » reste masquée.

   Écoute : fi:dock {etat}, fi:situation {id}, fi:son {niveau}
   Journal : « ?debug=1 » (clé fi:debug), préfixe [depart].
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var DEBUG = false;
  try { DEBUG = localStorage.getItem('fi:debug') === '1'; } catch (e) {}
  function journal() {
    if (!DEBUG) return;
    var a = Array.prototype.slice.call(arguments);
    a.unshift('%c[depart]', 'color:#f472b6');
    console.log.apply(console, a);
  }

  var depart = document.querySelector('[data-hero-depart]');
  if (!depart) return;
  if (!window.FiDock || !document.querySelector('[data-dock-vue="question"] .situations')) {
    journal('pas de question dans le dock : invitation masquée, la question reste dans le hero');
    return;
  }

  var boutonChoisir = depart.querySelector('[data-hero-choisir]');
  var texteChoisir = depart.querySelector('[data-hero-choisir-texte]');
  var valeur = depart.querySelector('[data-hero-besoin]');
  var texteValeur = depart.querySelector('[data-hero-besoin-texte]');
  var picValeur = valeur.querySelector('use');
  var note = depart.querySelector('[data-hero-depart-note]');
  var boutonSon = depart.querySelector('[data-hero-son]');
  /* « Votre besoin : [Choisir] », puis « Votre besoin : ◎ Former
     [Changer] » : la valeur se lit à part, le bouton ne porte que le
     geste (retour du 29/09/2026). */
  var NOM = { convaincre: 'Convaincre', former: 'Former', garder: 'Conserver' };

  /* ── Votre besoin ──────────────────────────────────────────────────── */
  function majChoix(id) {
    var choisi = NOM.hasOwnProperty(id);
    valeur.hidden = !choisi;
    if (choisi) {
      texteValeur.textContent = NOM[id];
      picValeur.setAttribute('href', '#pic-' + id);
    }
    texteChoisir.textContent = choisi ? 'Changer' : 'Choisir';
    /* Choisir est LE geste du hero (primaire) ; une fois fait, changer
       devient secondaire. */
    boutonChoisir.classList.toggle('hero-cta__btn--primary', !choisi);
    boutonChoisir.classList.toggle('hero-cta__btn--secondary', choisi);
    note.hidden = choisi;
    journal('besoin : ' + (choisi ? NOM[id] + ' [Changer]' : '[Choisir]'));
  }
  boutonChoisir.addEventListener('click', function () {
    if (window.FiDock.etat() === 'question') { window.FiDock.replier('re-clic sur « Choisir »'); return; }
    window.FiDock.ouvrir('question', 'hero : votre besoin');
    /* Le focus rejoint la question, sans faire sauter la page. */
    var titre = document.getElementById('situationsQuestion');
    if (titre) {
      titre.setAttribute('tabindex', '-1');
      titre.focus({ preventScroll: true });
    }
  });
  document.addEventListener('fi:dock', function (e) {
    boutonChoisir.setAttribute('aria-expanded', e.detail.etat === 'question' ? 'true' : 'false');
  });
  document.addEventListener('fi:situation', function (e) { majChoix(e.detail && e.detail.id); });

  /* ── Le son ────────────────────────────────────────────────────────── */
  function majSon(niveau) {
    var actif = niveau !== 'muet';
    boutonSon.setAttribute('aria-pressed', actif ? 'true' : 'false');
    boutonSon.title = actif ? 'Couper le son' : 'Activer le son';
  }
  if (window.FiSon && window.FiSon.niveau) {
    majSon(window.FiSon.niveau());
    boutonSon.addEventListener('click', function () {
      /* Deux crans ici (le dock garde les trois) : allumé = « doux ». */
      var n = window.FiSon.actif() ? 'muet' : 'doux';
      journal('son › ' + n + ' (pastille du hero)');
      window.FiSon.regler(n);
    });
    document.addEventListener('fi:son', function (e) { majSon(e.detail.niveau || (e.detail.actif ? 'doux' : 'muet')); });
  } else {
    boutonSon.hidden = true;
    journal('FiSon absent : pastille « Son » masquée');
  }

  majChoix(document.body.getAttribute('data-situation'));
  depart.hidden = false;
  journal('prêt : question sur demande, son ' + (window.FiSon ? window.FiSon.niveau() : 'absent'));
})();
