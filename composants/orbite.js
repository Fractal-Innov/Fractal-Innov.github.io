/* ══ L'ORBITE DE L'ÉQUIPE : LE FONDATEUR AU CENTRE, LE RÉSEAU AUTOUR ════
   Passe graphique du 28/09/2026 (piste « a + b » choisie par l'auteur) :
   les rôles sont posés en orbite par le CSS, ce script ne fait que TRACER
   un fil du portrait vers chaque rôle, et l'allumer au survol.

     - Le tracé part du centre du portrait et finit au centre de la tuile
       du rôle (le portrait et les tuiles passent par-dessus, le fil semble
       sortir de l'un pour entrer dans l'autre).
     - Il est recalculé à chaque changement de taille de l'orbite
       (ResizeObserver) : les positions viennent toujours du rendu réel,
       jamais de coordonnées en dur.
     - À l'arrivée, les fils se dessinent un par un : c'est le CSS
       (`.orbite.active`, le « reveal » de la page) qui anime, pas ce script.
     - Au mobile et sans JS, l'orbite devient une liste : le SVG est masqué
       par le CSS, et le script ne trace rien tant qu'il est masqué.

   Émet : fi:geste {chapitre: 'equipe', geste: 'relier'} au premier survol
          (le son répond ; les survols suivants se taisent).
   Journal : « ?debug=1 » (clé fi:debug), préfixe [orbite].
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var DEBUG = false;
  try { DEBUG = localStorage.getItem('fi:debug') === '1'; } catch (e) {}
  function journal() {
    if (!DEBUG) return;
    var args = Array.prototype.slice.call(arguments);
    args.unshift('%c[orbite]', 'color:#6ea8ff');
    console.log.apply(console, args);
  }

  var racine = document.querySelector('[data-composant="orbite"]');
  if (!racine) return;
  var centre = racine.querySelector('.orbite__centre');
  var roles = Array.prototype.slice.call(racine.querySelectorAll('.role'));
  if (!centre || !roles.length) { journal('⚠️ centre ou rôles introuvables : la liste reste'); return; }

  var NS = 'http://www.w3.org/2000/svg';
  var fils = document.createElementNS(NS, 'svg');
  fils.setAttribute('class', 'orbite__fils');
  fils.setAttribute('aria-hidden', 'true');
  racine.insertBefore(fils, racine.firstChild);

  /* Un fil par rôle, créé une fois ; seul son tracé (d) change ensuite. */
  var chemins = roles.map(function (role, i) {
    var p = document.createElementNS(NS, 'path');
    p.setAttribute('pathLength', '1');
    p.setAttribute('data-role', role.getAttribute('data-role'));
    p.style.setProperty('--i', i);
    fils.appendChild(p);
    return p;
  });

  function milieu(el, base) {
    var r = el.getBoundingClientRect();
    return [Math.round(r.left - base.left + r.width / 2), Math.round(r.top - base.top + r.height / 2)];
  }

  function tracer() {
    if (getComputedStyle(fils).display === 'none') return; /* mobile : la liste, pas de fils */
    var base = racine.getBoundingClientRect();
    var c = milieu(centre, base);
    fils.setAttribute('viewBox', '0 0 ' + Math.round(base.width) + ' ' + Math.round(base.height));
    roles.forEach(function (role, i) {
      var t = milieu(role.querySelector('.role__pic') || role, base);
      chemins[i].setAttribute('d', 'M' + c[0] + ' ' + c[1] + ' L' + t[0] + ' ' + t[1]);
    });
    journal('fils tracés depuis le centre (' + c.join(', ') + ') vers ' + roles.length + ' rôles, orbite ' + Math.round(base.width) + '×' + Math.round(base.height));
  }

  var attente = 0;
  function planifier() {
    if (attente) return;
    attente = window.requestAnimationFrame(function () { attente = 0; tracer(); });
  }
  if ('ResizeObserver' in window) new ResizeObserver(planifier).observe(racine);
  else window.addEventListener('resize', planifier);
  window.addEventListener('load', planifier); /* le portrait posé, les positions sont justes */
  planifier();

  /* ── Le survol : le fil du rôle s'allume ── */
  var dejaRelie = false;
  roles.forEach(function (role, i) {
    role.addEventListener('pointerenter', function () {
      chemins[i].classList.add('orbite__fil--allume');
      role.classList.add('role--allume');
      journal('survol : ' + role.getAttribute('data-role') + ' relié au centre');
      if (!dejaRelie) {
        dejaRelie = true;
        document.dispatchEvent(new CustomEvent('fi:geste', { detail: { chapitre: 'equipe', geste: 'relier' } }));
      }
    });
    role.addEventListener('pointerleave', function () {
      chemins[i].classList.remove('orbite__fil--allume');
      role.classList.remove('role--allume');
    });
  });

  racine.setAttribute('data-js', '');
  journal(roles.length + ' rôles en orbite : ' + roles.map(function (r) { return r.getAttribute('data-role'); }).join(', '));
})();
