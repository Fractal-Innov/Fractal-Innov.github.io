/* ══ LES BOUCLES DES APERÇUS ═══════════════════════════════════════════
   décidées le 29/09/2026 (docs/visuels/2026-09-28-cahier-des-captures.md § 2)

   Les grands aperçus (le panneau actif de l'offre, la démo en avant)
   jouent une boucle vidéo ; les petits restent des images. La boucle est
   un BONUS : l'image reste l'aperçu, elle sert de poster, et tout échec
   (réseau, format, lecture refusée) la laisse simplement en place.

   Dans la page :
     <div class="media-16x9" data-boucle="/media/accueil/boucles/stand">
       <img …>   ← l'image, toujours là
     </div>
     data-boucle="aucune" (ou absent) › image seule, aucune requête ;
     data-boucle-prevue garde la base à venir : quand les fichiers sont
     posés, « data-boucle="aucune" data-boucle-prevue= » devient « data-boucle= ».
   Fichiers attendus (outils/encoder-boucles.sh) :
     <base>.webm / <base>.mp4               bureau, 960 × 540
     <base>-mobile.webm / <base>-mobile.mp4 téléphone, 640 × 360

   Les règles, pour que le téléphone reste léger :
     1. rien n'est téléchargé à l'ouverture : la source n'est posée que
        quand l'aperçu approche de l'écran ;
     2. UNE seule boucle joue à la fois : l'aperçu grand format le plus
        visible ; les autres sont en pause ;
     3. grand format = dans la scène des démos ([data-demos-scene]) ou un
        panneau de l'offre visible (pas aria-hidden) ;
     4. image seule si mouvement réduit, économie de données ou réseau
        très lent (2g) ; lecture refusée (iPhone en économie d'énergie) :
        l'image reste. « 3g » ne coupe pas : Chrome l'annonce pour bien
        des connexions correctes (même en local), et la version
        téléphone ne pèse que 250 à 400 Ko. Safari et Firefox ne disent
        rien du réseau : ils comptent sur la règle 1 et le refus de lecture ;
     5. un bouton pause par aperçu (une boucle de plus de 5 s doit pouvoir
        s'arrêter) ; arrêtée par le visiteur, elle ne repart plus seule.

   Essais (avec ?debug=1) :
     &boucle=prevues  › chaque aperçu prend sa base prévue (fichiers posés
                        en local, pas encore branchés) ;
     &boucle=<base>   › cette base sur tous les aperçus.
   Journal : « ?debug=1 » (clé fi:debug), préfixe [boucle].
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var DEBUG = false;
  try { DEBUG = localStorage.getItem('fi:debug') === '1'; } catch (e) {}
  function journal() {
    if (!DEBUG) return;
    var a = Array.prototype.slice.call(arguments);
    a.unshift('%c[boucle]', 'color:#34d399');
    console.log.apply(console, a);
  }

  var medias = Array.prototype.slice.call(document.querySelectorAll('[data-boucle]'));
  var essai = DEBUG ? new URLSearchParams(location.search).get('boucle') : null;
  if (essai) journal('boucle d\'essai demandée par ?boucle=, ' + essai);
  medias = medias.filter(function (m) {
    var base = essai === 'prevues' ? m.getAttribute('data-boucle-prevue') : (essai || m.getAttribute('data-boucle'));
    if (!base || base === 'aucune') return false;
    m.setAttribute('data-boucle-base', base);
    return true;
  });
  if (!medias.length) { journal('aucun aperçu avec une boucle : images seules'); return; }

  /* ── Les raisons de s'en tenir à l'image ───────────────────────────── */
  var cnx = navigator.connection || {};
  var raison = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'mouvement réduit demandé'
    : cnx.saveData ? 'économie de données'
    : /(^|-)2g$/.test(cnx.effectiveType || '') ? 'réseau très lent (' + cnx.effectiveType + ')'
    : !('IntersectionObserver' in window) ? 'navigateur sans IntersectionObserver'
    : '';
  /* En essai (?boucle=), le réseau annoncé ne coupe pas : l'estimation de
     Chrome varie d'un chargement à l'autre (3g, puis 2g, en local). */
  if (raison && essai && /réseau/.test(raison)) { journal('essai : ' + raison + ' ignoré'); raison = ''; }
  if (raison) { journal('images seules : ' + raison); return; }

  /* Le téléphone reçoit la version 640 × 360 (≈ 300 Ko au lieu de 1 Mo). */
  var mobile = window.matchMedia('(max-width: 767px)').matches;
  var suffixe = mobile ? '-mobile' : '';
  journal(medias.length + ' aperçus à boucle, version ' + (mobile ? 'téléphone (640)' : 'bureau (960)'));

  var visibilite = new Map();   // media › part visible (0 à 1)
  var arretee = new Set();      // arrêtées par le visiteur
  var courante = null;

  function grandFormat(m) {
    if (m.closest('[data-demos-scene]')) return true;
    var panneau = m.closest('[data-story-panneau]');
    return !!panneau && panneau.getAttribute('aria-hidden') !== 'true';
  }

  /* ── Poser la vidéo (une fois, à l'approche) ───────────────────────── */
  function preparer(m) {
    if (m._boucle) return m._boucle;
    var base = m.getAttribute('data-boucle-base');
    var v = document.createElement('video');
    v.className = 'boucle__video';
    v.muted = true; v.loop = true; v.playsInline = true;
    v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
    v.preload = 'metadata';
    v.setAttribute('aria-hidden', 'true');
    [['webm', 'video/webm'], ['mp4', 'video/mp4']].forEach(function (f) {
      var s = document.createElement('source');
      s.src = base + suffixe + '.' + f[0];
      s.type = f[1];
      v.appendChild(s);
    });
    /* Une <source> qui échoue émet `error` sur elle-même (d'où la
       capture) ; si la dernière échoue, on retire la vidéo : l'image reste. */
    v.addEventListener('error', function (e) {
      if (e.target !== v.lastElementChild) return;
      journal(base + suffixe + ' : aucune source lisible, l\'image reste');
      m.removeAttribute('data-boucle-joue');
      v.remove(); bouton.remove();
      m._boucle = { mort: true };
      if (courante === m) courante = null;
    }, true);
    v.addEventListener('playing', function () {
      m.setAttribute('data-boucle-joue', '');
      bouton.hidden = false;
      majBouton();
      journal('lecture : ' + v.currentSrc.split('/').pop());
    });
    v.addEventListener('pause', majBouton);

    var bouton = document.createElement('button');
    bouton.type = 'button';
    bouton.className = 'boucle__pause';
    bouton.hidden = true;
    bouton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="boucle__pause-barres" d="M9 6v12M15 6v12"/><path class="boucle__pause-lecture" d="M8 5.5l11 6.5-11 6.5z"/></svg>';
    function majBouton() {
      var enPause = v.paused;
      bouton.setAttribute('aria-pressed', enPause ? 'true' : 'false');
      bouton.setAttribute('aria-label', enPause ? 'Relancer la vidéo de l\'aperçu' : 'Mettre en pause la vidéo de l\'aperçu');
    }
    bouton.addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation(); /* l'aperçu est parfois dans un lien */
      if (v.paused) { arretee.delete(m); journal('relancée par le visiteur'); arbitrer('clic'); }
      else { arretee.add(m); v.pause(); journal('arrêtée par le visiteur : ne repart plus seule'); }
    });

    m.appendChild(v);
    m.appendChild(bouton);
    m._boucle = { video: v };
    journal('source posée : ' + base + suffixe + ' (.webm, .mp4)');
    return m._boucle;
  }

  /* ── Une seule boucle à la fois ────────────────────────────────────── */
  function arbitrer(origine) {
    var meilleure = null, part = 0.5; /* au moins la moitié visible */
    medias.forEach(function (m) {
      var p = visibilite.get(m) || 0;
      if (p >= part && grandFormat(m) && !arretee.has(m) && !(m._boucle && m._boucle.mort)) { meilleure = m; part = p; }
    });
    if (document.hidden) meilleure = null;
    medias.forEach(function (m) {
      if (m !== meilleure && m._boucle && m._boucle.video && !m._boucle.video.paused) m._boucle.video.pause();
    });
    if (meilleure !== courante) journal('au tour de ' + (meilleure ? (meilleure.closest('[id]') || {}).id : 'aucune') + ' (' + origine + ')');
    courante = meilleure;
    if (!meilleure) return;
    var v = preparer(meilleure).video;
    if (!v || !v.paused) return;
    var p = v.play();
    if (p && typeof p.catch === 'function') p.catch(function () { journal('lecture refusée par le navigateur, l\'image reste'); });
  }

  var io = new IntersectionObserver(function (entrees) {
    entrees.forEach(function (e) { visibilite.set(e.target, e.isIntersecting ? e.intersectionRatio : 0); });
    arbitrer('défilement');
  }, { threshold: [0, 0.25, 0.5, 0.75, 1] });
  medias.forEach(function (m) { io.observe(m); });

  /* Le grand format change sans défilement : un panneau de l'offre qui
     tourne, une démo qui passe dans la scène, un onglet masqué. */
  var mo = new MutationObserver(function () { arbitrer('panneau ou scène'); });
  Array.prototype.forEach.call(document.querySelectorAll('[data-story-panneau]'), function (p) {
    mo.observe(p, { attributes: true, attributeFilter: ['aria-hidden'] });
  });
  var scene = document.querySelector('[data-demos-scene]');
  if (scene) mo.observe(scene, { childList: true });
  document.addEventListener('visibilitychange', function () { arbitrer('onglet'); });
})();
