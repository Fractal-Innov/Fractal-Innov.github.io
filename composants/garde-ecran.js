/* ══ LA GARDE « TIENT À L'ÉCRAN » (?debug=1) ═══════════════════════════
   La règle de la passe graphique (28/09/2026) :
     - au bureau, une section tient ENTIÈRE en un écran ;
     - au mobile, ses éléments [data-essentiel] (titre, résultat, geste
       suivant) tiennent dans son PREMIER écran.

   « Un écran » = ce que le visiteur voit vraiment quand une ancre pose la
   section en haut : de `scroll-padding-top` jusqu'au haut du dock.

   Pour chaque section[id], la garde journalise :
     ✓ / ⚠️  #id : N écran(s), essentiels hors du premier écran : …
   Exception : une section `data-garde="plein-ecran"` (le hero, en 100svh,
   passe exprès sous le dock) n'est jugée que sur ses essentiels.
   Muette hors debug. `FiGarde.mesurer()` reste appelable à la main
   (console) et renvoie [{section, ecrans, essentielsHors}].
   Re-mesure au redimensionnement (debug seulement), pour la QA des formats.
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var DEBUG = false;
  try { DEBUG = localStorage.getItem('fi:debug') === '1'; } catch (e) {}

  /* La hauteur utile : du haut (après scroll-padding) au haut du dock. */
  function hauteurUtile() {
    var haut = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    var dock = document.getElementById('dock');
    var bas = dock ? dock.getBoundingClientRect().top : innerHeight;
    return bas - haut;
  }

  function mesurer() {
    var utile = hauteurUtile();
    return Array.prototype.map.call(document.querySelectorAll('section[id]'), function (s) {
      var r = s.getBoundingClientRect();
      var hors = Array.prototype.filter.call(s.querySelectorAll('[data-essentiel]'), function (el) {
        /* Distance depuis le haut de la section : c'est la position que
           l'élément aura quand la section est posée en haut de l'écran. */
        return el.getBoundingClientRect().bottom - r.top > utile;
      }).map(function (el) { return el.textContent.replace(/\s+/g, ' ').trim().slice(0, 40); });
      return { section: s.id, ecrans: +(r.height / utile).toFixed(2), essentielsHors: hors,
               pleinEcran: s.getAttribute('data-garde') === 'plein-ecran' };
    });
  }

  function journaliser() {
    var bureau = innerWidth >= 1024;
    console.log('%c[garde] ' + innerWidth + '×' + innerHeight + ' (' + (bureau ? 'bureau : section entière' : 'mobile : essentiels au 1er écran') + '), utile ' + Math.round(hauteurUtile()) + ' px', 'color:#6ea8ff');
    mesurer().forEach(function (m) {
      /* Au bureau la section entière doit tenir ; partout, les essentiels. */
      var ok = m.essentielsHors.length === 0 && (!bureau || m.pleinEcran || m.ecrans <= 1);
      console.log('%c[garde] ' + (ok ? '✓' : '⚠️') + ' #' + m.section + ' : ' + m.ecrans + ' écran(s)' +
        (m.essentielsHors.length ? ', essentiels hors du premier écran : ' + m.essentielsHors.join(' | ') : ''),
        'color:' + (ok ? '#6ea8ff' : '#f5a524'));
    });
  }

  window.FiGarde = { mesurer: mesurer, journaliser: journaliser };
  if (!DEBUG) return;

  addEventListener('load', function () { setTimeout(journaliser, 300); }); /* après la mesure du dock */
  var minuterie;
  addEventListener('resize', function () {
    clearTimeout(minuterie);
    minuterie = setTimeout(journaliser, 400);
  });
})();
