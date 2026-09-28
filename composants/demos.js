/* ══ LES DÉMOS : UNE SCÈNE, UNE BANDE ═══════════════════════════════════
   Passe graphique du 28/09/2026. Une démo est EN AVANT (la scène : grande,
   accroche, points, bouton), les autres défilent en VIGNETTES dans une
   bande de hauteur fixe. Ajouter une démo ne touche ni ce script ni le
   CSS : on copie un <article class="demo"> dans la bande (voir la liste
   de contrôle au-dessus du markup, section #demos).

   Qui est en avant, dans cet ordre :
     1. la démo VISÉE : clic sur une vignette, ou arrivée par son ancre
        (« Voir la démo Rayon X ↓ » dans l'offre, lien partagé /#demo-…) ;
     2. sinon la vitrine de la SITUATION (`data-avant-pour~="former"`) ;
     3. sinon la vitrine par défaut (`data-avant-pour~="aucune"`).
   Un nouveau choix dans le dock (fi:situation) efface la visée : la
   situation reprend la main (c'est ce que le CSS seul ne savait pas faire).

   La bande : les vignettes de la situation d'abord, puis l'ordre du HTML.
   Les flèches ‹ › n'apparaissent que si la bande déborde.

   Sans JavaScript : pas de scène, la bande est une grille ; la démo visée
   (:target) ou STAND passe en grand par le CSS (bloc « DÉMOS »).

   Écoute : fi:situation {id}, hashchange
   Journal : « ?debug=1 » (clé fi:debug), préfixe [demos].

   ⚠️ Plus tard : un filtre par usage (Tout / Convaincre / Former /
   Conserver) quand un usage aura 3 démos ou la liste ~8 (décision du
   28/09/2026 : pas avant, la bande et le tri par situation suffisent).
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var DEBUG = false;
  try { DEBUG = localStorage.getItem('fi:debug') === '1'; } catch (e) {}
  function journal() {
    if (!DEBUG) return;
    var args = Array.prototype.slice.call(arguments);
    args.unshift('%c[demos]', 'color:#6ea8ff');
    console.log.apply(console, args);
  }

  var racine = document.querySelector('[data-composant="demos"]');
  if (!racine) return;
  var bande = racine.querySelector('[data-demos-bande]');
  var scene = racine.querySelector('[data-demos-scene]');
  var fleches = racine.querySelectorAll('[data-demos-fleche]');
  if (!bande || !scene) { journal('⚠️ scène ou bande introuvable : la grille sans JS reste'); return; }

  var cartes = Array.prototype.slice.call(bande.querySelectorAll('.demo'));
  cartes.forEach(function (c, i) { c.setAttribute('data-rang', i); }); /* l'ordre du HTML, pour ranger */
  var sobre = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var vise = null; /* id de la démo visée, ou null */

  function situation() { return document.body.getAttribute('data-situation') || 'aucune'; }
  function porte(carte, attribut, valeur) {
    return (' ' + (carte.getAttribute(attribut) || '') + ' ').indexOf(' ' + valeur + ' ') !== -1;
  }
  function trouver(fn) { for (var i = 0; i < cartes.length; i++) if (fn(cartes[i])) return cartes[i]; return null; }

  function choisir() {
    var s = situation();
    var carte = vise && document.getElementById(vise);
    if (carte && cartes.indexOf(carte) !== -1) return { carte: carte, pourquoi: 'visée' };
    carte = trouver(function (c) { return porte(c, 'data-avant-pour', s); });
    if (carte) return { carte: carte, pourquoi: 'vitrine de la situation « ' + s + ' »' };
    carte = trouver(function (c) { return porte(c, 'data-avant-pour', 'aucune'); }) || cartes[0];
    return { carte: carte, pourquoi: 'vitrine par défaut' };
  }

  /* Range la scène et la bande. Rien d'autre ne déplace les cartes. */
  function ranger(raison) {
    var choix = choisir();
    var avant = choix.carte;
    var s = situation();
    if (scene.firstElementChild !== avant) {
      if (scene.firstElementChild) bande.appendChild(scene.firstElementChild);
      scene.appendChild(avant);
      journal('en avant : #' + avant.id + ' (' + choix.pourquoi + ', ' + raison + ')');
    }
    var reste = cartes.filter(function (c) { return c !== avant; });
    reste.sort(function (a, b) {
      var sa = porte(a, 'data-usages', s) ? 0 : 1;
      var sb = porte(b, 'data-usages', s) ? 0 : 1;
      return (sa - sb) || (a.getAttribute('data-rang') - b.getAttribute('data-rang'));
    });
    reste.forEach(function (c) { bande.appendChild(c); });
    bande.scrollLeft = 0;
    majFleches();
  }

  /* Amène la scène à l'écran (après un clic ou une ancre). */
  function montrerScene() {
    scene.scrollIntoView({ behavior: sobre ? 'auto' : 'smooth', block: 'start' });
    var lien = scene.querySelector('.demo__lien');
    if (lien) lien.focus({ preventScroll: true });
  }

  function viser(id, raison) {
    vise = id;
    ranger(raison);
    montrerScene();
  }

  /* ── Les flèches : visibles seulement si la bande déborde ── */
  function majFleches() {
    var deborde = bande.scrollWidth > bande.clientWidth + 2;
    Array.prototype.forEach.call(fleches, function (f) {
      f.hidden = !deborde;
      var sens = Number(f.getAttribute('data-demos-fleche'));
      var auBout = sens < 0 ? bande.scrollLeft <= 2
        : bande.scrollLeft + bande.clientWidth >= bande.scrollWidth - 2;
      f.disabled = auBout;
    });
  }
  Array.prototype.forEach.call(fleches, function (f) {
    f.addEventListener('click', function () {
      var pas = (bande.firstElementChild ? bande.firstElementChild.getBoundingClientRect().width : 300) + 24;
      bande.scrollBy({ left: Number(f.getAttribute('data-demos-fleche')) * pas, behavior: sobre ? 'auto' : 'smooth' });
    });
  });
  bande.addEventListener('scroll', function () { window.requestAnimationFrame(majFleches); }, { passive: true });
  window.addEventListener('resize', majFleches);

  /* ── Les gestes ── */
  bande.addEventListener('click', function (e) {
    var lien = e.target.closest && e.target.closest('.demo__lien');
    if (!lien) return;
    var carte = lien.closest('.demo');
    e.preventDefault();
    history.replaceState(null, '', '#' + carte.id); /* le lien reste partageable */
    viser(carte.id, 'clic sur la vignette');
  });
  window.addEventListener('hashchange', function () {
    var id = location.hash.slice(1);
    if (id && document.getElementById(id) && cartes.indexOf(document.getElementById(id)) !== -1) viser(id, 'ancre ' + location.hash);
  });
  document.addEventListener('fi:situation', function () {
    if (vise) {
      journal('nouvelle situation : la visée #' + vise + ' s\'efface');
      vise = null;
      if (location.hash.indexOf('#demo-') === 0) history.replaceState(null, '', location.pathname + location.search);
    }
    ranger('fi:situation');
  });

  /* ── Démarrage ── */
  /* Une vignette hors champ dans la bande n'intersecte jamais l'écran : le
     « .reveal » la laisserait invisible. Les cartes sont montrées d'office. */
  cartes.forEach(function (c) { c.classList.add('active'); });
  racine.setAttribute('data-js', '');
  scene.hidden = false;
  var ancre = location.hash.slice(1);
  var carteAncre = ancre && document.getElementById(ancre);
  if (carteAncre && cartes.indexOf(carteAncre) !== -1) {
    vise = ancre;
    ranger('arrivée sur ' + location.hash);
    window.addEventListener('load', function () { scene.scrollIntoView({ block: 'start' }); });
  } else {
    ranger('démarrage');
  }
  window.addEventListener('load', majFleches); /* les largeurs sont justes une fois les images posées */
  journal(cartes.length + ' démos, bande : ' + Array.prototype.map.call(bande.children, function (c) { return c.id; }).join(', '));
})();
