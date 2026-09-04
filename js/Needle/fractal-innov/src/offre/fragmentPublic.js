/**
 * Point d'entrée d'un fragment spatialisé, jalon 41 — **le côté enfant**.
 *
 * Ce module tourne À L'INTÉRIEUR du quad (`/arret/<id>/`), jamais dans la page
 * parente. Il porte les deux seuls gestes qui n'ont de sens que là :
 *
 *   1. « arrêt suivant », qui pilote la CAMÉRA de la scène parente ;
 *   2. le renvoi des glissers commencés sur une zone vide, pour que tourner
 *      autour de la scène reste possible à travers le quad.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * ⚠️ POURQUOI UN RENVOI, ALORS QUE LE FOND EST DÉJÀ `pointer-events: none`
 * ════════════════════════════════════════════════════════════════════════════
 * C'est le piège de ce jalon, et il est contre-intuitif. `pointer-events: none`
 * à l'intérieur d'un iframe empêche le contenu de l'iframe d'être visé — mais
 * l'événement **ne traverse pas pour autant l'iframe** : il s'arrête sur
 * l'élément `<iframe>` lui-même, dans le document parent. Le canvas 3D placé
 * derrière ne le voit jamais.
 *
 * Sans ce module, un glisser commencé sur une zone transparente du quad ne
 * ferait donc RIEN. Pas de défilement (règle 2 du CSS), et pas de rotation non
 * plus : le geste mourrait dans l'iframe.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * LA MÉCANIQUE, EN QUATRE TEMPS
 * ════════════════════════════════════════════════════════════════════════════
 * 1. ici : un `pointerdown` atteint le fond (donc pas la carte) → on prévient
 *    le parent, en lui donnant la position DANS CE DOCUMENT et sa taille ;
 * 2. parent (`fragmentPont.ts`) : il neutralise la couche CSS3D entière, puis
 *    rejoue un `pointerdown` sur le canvas à la position convertie ;
 * 3. la couche étant neutralisée, les `pointermove` et le `pointerup` suivants
 *    atteignent le canvas **nativement** — aucun rejeu, donc aucune dérive ;
 * 4. parent : au relâchement, la couche CSS3D redevient interactive.
 *
 * ⚠️ Ce module ne fait donc suivre QUE le premier événement d'un geste. C'est
 * volontaire : rejouer tout un glisser synthétiquement se désynchronise du
 * pointeur réel, et casse la capture de pointeur des contrôles d'orbite.
 *
 * ⚠️ Même origine obligatoire (`window.parent` lu directement, sans
 * `postMessage`) : c'est le cas ici, le fragment est servi par le même serveur
 * que le totem. Si un jour un fragment venait d'un autre domaine, ce canal
 * devrait passer par `postMessage` — et ce module refuserait de fonctionner
 * en silence, faute d'accès à `window.parent`.
 */
/** Vrai seulement si ce document est réellement embarqué dans un autre. */
function dansUnQuad() {
    return typeof window !== "undefined" && window.parent !== window;
}
function initArretSuivant() {
    const bouton = document.getElementById("fi-fragment-suivant");
    const suivant = document.body.dataset.suivant;
    if (!bouton || !suivant)
        return;
    bouton.addEventListener("click", () => {
        if (!dansUnQuad())
            return;
        // Le parent écoute cet événement et appelle `allerAuPoi()`, exactement
        // comme le fait un bouton du dock. Un seul canal de navigation.
        window.parent.dispatchEvent(new CustomEvent("fi:fragment-poi", { detail: { id: suivant } }));
    });
}
function initRenvoiDesGlissers() {
    if (!dansUnQuad())
        return;
    document.addEventListener("pointerdown", e => {
        // La carte capte ses propres clics (`pointer-events: auto`) : si
        // l'événement arrive jusqu'ici avec le fond pour cible, c'est qu'il a
        // touché une zone vide du quad.
        const cible = e.target;
        if (cible && cible.closest(".ui-fragment__carte"))
            return;
        window.parent.dispatchEvent(new CustomEvent("fi:fragment-glisser", {
            detail: {
                // ⚠️ L'`id` de l'arrêt est ce qui permet au parent de retrouver
                // QUEL quad a parlé : un `CustomEvent` ne transporte pas la
                // fenêtre émettrice, et plusieurs fragments coexistent.
                arret: document.body.dataset.arret,
                x: e.clientX,
                y: e.clientY,
                largeur: window.innerWidth,
                hauteur: window.innerHeight,
                bouton: e.button,
            },
        }));
        // ⚠️ En capture : la phase de bulle suffirait aujourd'hui, mais un futur
        // gestionnaire posé sur le fond pourrait arrêter la propagation, et le
        // renvoi cesserait alors sans que rien ne le signale.
    }, { capture: true });
}
initArretSuivant();
initRenvoiDesGlissers();
