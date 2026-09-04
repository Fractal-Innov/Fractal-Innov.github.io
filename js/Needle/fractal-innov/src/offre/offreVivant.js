/**
 * Le site qui réagit — apparitions, rotation du contenu, mesure d'usage.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * ⚠️ CE MODULE N'AJOUTE JAMAIS DE SENS, IL N'EN AJOUTE QUE L'ENVIE
 * ════════════════════════════════════════════════════════════════════════════
 * Tout ce qu'il fait est **retirable sans perte d'information** : il révèle ce
 * qui est déjà écrit, il met un point en avant parmi des points déjà présents,
 * il compte des gestes. Si le script ne se charge pas, la page reste complète —
 * c'est la règle du jalon 32, et c'est elle qui rend le site lisible par les
 * robots des modèles de langage, qui n'exécutent pas de JavaScript.
 *
 * Le test à s'appliquer avant d'ajouter quoi que ce soit ici : **est-ce que la
 * page perd une information si ce module disparaît ?** Si oui, c'est au
 * gabarit (`offreSite.ts`) que ça appartient, pas ici.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * LES TROIS INTENTIONS, ET OÙ ELLES SE POSENT
 * ════════════════════════════════════════════════════════════════════════════
 * 1. **La curiosité** — les arrêts se dévoilent en cascade au défilement. On
 *    ne voit pas tout d'un coup, donc on descend.
 * 2. **L'émerveillement** — l'aura suit le pointeur, la page respire. Effet
 *    subliminal : on ne le remarque pas, on le ressent.
 * 3. **La vente** — un seul élément brille, le bouton de devis. L'effet
 *    désigne l'action qui rapporte, il ne décore pas.
 *
 * ⚠️ **Un quatrième effet en enlèverait aux trois autres.** C'est la seule
 * règle à tenir dans ce fichier ; tout le reste est de la mécanique.
 */
import { createLogger } from "../../../../socle/debugLog.js";
import { creerMesureUnique, mesurer } from "../../../../socle/mesure/analytique.js";
import { hash32, mulberry32 } from "../../../../socle/generation/seed.js";
import { MESURES } from "./offreMesures.js";
const log = createLogger("OffreVivant");
/** Le décalage entre deux apparitions voisines. Au-delà, ça traîne. */
const RETARD_CASCADE_MS = 70;
/** Combien de temps un point reste en vedette avant de laisser la place. */
const ROTATION_MS = 4200;
export function animerSite() {
    // ⚠️ Ce drapeau est la clé de voûte de l'amélioration progressive : tout
    // l'état masqué du CSS est écrit sous `html.js`. Il est posé ICI, au
    // démarrage du script, donc jamais si le script ne tourne pas.
    document.documentElement.classList.add("js");
    apparitions();
    aura();
    rotationDesPoints();
    mesuresDeParcours();
    log("site animé");
}
/* ══════════════════════════════════════════════════════════════════════════
   1. Les apparitions en cascade
   ══════════════════════════════════════════════════════════════════════════ */
function apparitions() {
    const cibles = Array.from(document.querySelectorAll(".ui-revele"));
    if (cibles.length === 0)
        return;
    const vuUneFois = creerMesureUnique();
    // ⚠️ Repli explicite : sans `IntersectionObserver`, on montre tout plutôt
    // que de laisser une page vide. Le défaut d'un navigateur ancien ne doit
    // jamais coûter le contenu — même raisonnement que l'échec silencieux du
    // configurateur.
    if (typeof IntersectionObserver === "undefined") {
        cibles.forEach(el => { el.dataset.revele = "vu"; });
        return;
    }
    const observateur = new IntersectionObserver((entrees) => {
        for (const entree of entrees) {
            if (!entree.isIntersecting)
                continue;
            const el = entree.target;
            el.dataset.revele = "vu";
            // ⚠️ On se désabonne dès l'apparition. Sans ça, l'élément
            // continuerait d'être observé pendant tout le défilement, et le
            // compteur ci-dessous se rejouerait à chaque remontée : la mesure
            // cesserait de dire « combien de personnes ont vu » pour dire
            // « combien de fois le navigateur a repassé le seuil ».
            observateur.unobserve(el);
            const arret = el.dataset.arret;
            if (arret)
                vuUneFois(MESURES.ARRET_VU, { arret });
        }
    }, {
        // Déclenché un peu avant l'entrée réelle : l'élément est déjà en place
        // quand l'œil arrive dessus, au lieu d'apparaître sous le regard.
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.05,
    });
    cibles.forEach((el, i) => {
        // La cascade se calcule par POSITION DANS LE GROUPE, pas dans la page :
        // sinon le dixième élément attendrait 700 ms après son entrée à
        // l'écran, et l'effet passerait pour de la lenteur.
        el.style.setProperty("--ui-retard", `${(i % 4) * RETARD_CASCADE_MS}ms`);
        observateur.observe(el);
    });
}
/* ══════════════════════════════════════════════════════════════════════════
   2. L'aura du pointeur
   ══════════════════════════════════════════════════════════════════════════ */
function aura() {
    // ⚠️ Sur un écran tactile, l'aura n'a aucun sens : il n'y a pas de pointeur
    // qui survole, et le calque coûterait une passe de rendu pour rien.
    if (!globalThis.matchMedia?.("(hover: hover) and (pointer: fine)").matches)
        return;
    const calque = document.createElement("div");
    calque.className = "ui-aura";
    calque.setAttribute("aria-hidden", "true");
    document.body.prepend(calque);
    let x = 0, y = 0, enAttente = false;
    globalThis.addEventListener("pointermove", (ev) => {
        x = ev.clientX;
        y = ev.clientY;
        if (enAttente)
            return;
        enAttente = true;
        // ⚠️ Une écriture de style par image, jamais par événement : un
        // `pointermove` peut arriver plusieurs fois entre deux images, et
        // écrire à chaque fois provoque des recalculs de style inutiles. C'est
        // la même discipline que « aucune allocation dans la boucle de rendu ».
        requestAnimationFrame(() => {
            calque.style.setProperty("--ui-x", `${x}px`);
            calque.style.setProperty("--ui-y", `${y}px`);
            calque.dataset.actif = "oui";
            enAttente = false;
        });
    }, { passive: true });
}
/* ══════════════════════════════════════════════════════════════════════════
   3. La rotation des points — le contenu change sans jamais disparaître
   ══════════════════════════════════════════════════════════════════════════ */
/**
 * Met un point en avant à la fois, et change de point.
 *
 * ⚠️ **Aucun point n'est jamais masqué** : ils restent tous lus, tous
 * indexables, tous accessibles. Ce qui tourne, c'est *lequel est souligné* —
 * ce qui suffit à ce que la page ne soit jamais tout à fait la même deux fois,
 * sans rien retirer à personne. Masquer pour « faire vivant » reviendrait à
 * échanger de l'information contre du mouvement, ce qui n'est jamais un bon
 * marché sur un site qui doit être cité par un moteur.
 *
 * ⚠️ **C'est ici que `socle/generation/seed.ts` sert enfin dans ce domaine.**
 * Le jalon 32 avait acté honnêtement que la génération déterministe ne servait
 * pas à `offre/` — l'ordre des arrêts est celui du deck. Elle trouve son usage
 * réel : deux visiteurs de la même page le même jour voient la même rotation,
 * donc la page reste **partageable à l'identique** (« regarde ce site »), sans
 * pour autant être figée d'un jour à l'autre.
 */
function rotationDesPoints() {
    const sections = Array.from(document.querySelectorAll("main section"));
    if (sections.length === 0)
        return;
    const jour = new Date().toISOString().slice(0, 10);
    for (const section of sections) {
        const points = Array.from(section.querySelectorAll("li"));
        if (points.length < 2)
            continue;
        const alea = mulberry32(hash32(`${jour}|${section.id}`));
        let i = Math.floor(alea() * points.length);
        const poser = () => {
            points.forEach(p => { delete p.dataset.vedette; });
            points[i % points.length].dataset.vedette = "oui";
        };
        poser();
        // La rotation ne tourne QUE si la section est à l'écran : une page
        // ouverte en arrière-plan ne doit pas consommer de temps de rendu.
        let minuteur = null;
        const demarrer = () => {
            minuteur ?? (minuteur = setInterval(() => { i++; poser(); }, ROTATION_MS));
        };
        const arreter = () => {
            if (minuteur !== null) {
                clearInterval(minuteur);
                minuteur = null;
            }
        };
        if (typeof IntersectionObserver === "undefined") {
            demarrer();
            continue;
        }
        new IntersectionObserver(([e]) => (e?.isIntersecting ? demarrer() : arreter()))
            .observe(section);
        // Un geste du visiteur fait avancer la rotation tout de suite : le clic
        // est récompensé immédiatement, ce qui donne envie de recommencer.
        section.addEventListener("pointerenter", () => {
            i++;
            poser();
            mesurer(MESURES.POINT_REVELE, { arret: section.id });
        });
    }
}
/* ══════════════════════════════════════════════════════════════════════════
   4. La mesure — par délégation, sans toucher au configurateur
   ══════════════════════════════════════════════════════════════════════════ */
/**
 * ⚠️ **Tout est écouté au niveau du document, en délégation.**
 *
 * Le configurateur (`configurateurUI.ts`) refait son `innerHTML` à chaque
 * changement : un écouteur posé sur ses boutons serait détruit au premier clic.
 * Et surtout, cette délégation permet de mesurer le configurateur **sans le
 * modifier** — donc sans risquer quoi que ce soit sur la frontière des prix du
 * jalon 33, qui est ce que ce projet a de plus fragile.
 *
 * ⚠️ Règle du projet, elle resservira : **le préfixe le plus long se teste en
 * premier.** Payé au jalon 23 puis au jalon 26.
 */
function mesuresDeParcours() {
    document.addEventListener("click", (ev) => {
        const cible = ev.target;
        if (!cible)
            return;
        const bouton = cible.closest("[data-action]");
        const action = bouton?.dataset.action;
        if (action) {
            if (action.startsWith("produit-")) {
                mesurer(MESURES.PRODUIT_CHOISI, { produit: action.slice(8) });
            }
            else if (action.startsWith("niveau-")) {
                mesurer(MESURES.NIVEAU_CHOISI, { niveau: action.slice(7) });
            }
            else if (action.startsWith("module-")) {
                mesurer(MESURES.MODULE_BASCULE, { module: action.slice(7) });
            }
            else if (action === "copier") {
                mesurer(MESURES.CODE_COPIE);
            }
            return;
        }
        const lien = cible.closest("a[href]");
        if (!lien)
            return;
        const href = lien.getAttribute("href") ?? "";
        if (href.startsWith("mailto:")) {
            // ⚠️ On distingue le devis composé du simple contact : le premier
            // arrive avec une configuration, le second non. Les confondre
            // ferait croire que le configurateur convertit alors que c'est le
            // pied de page qui travaille.
            const estDevis = lien.closest("#configurateur") !== null;
            mesurer(estDevis ? MESURES.DEVIS_DEMANDE : MESURES.CONTACT_DIRECT);
            return;
        }
        if (href.startsWith("/openfit")) {
            mesurer(MESURES.OPENFIT_OUVERT);
        }
        else if (/^https?:/.test(href)) {
            mesurer(MESURES.DEMO_OUVERTE, { cible: hote(href) });
        }
        else if (href.startsWith("/")) {
            mesurer(MESURES.NAVIGATION, { vers: href });
        }
    }, { capture: true });
    // ⚠️ En CAPTURE : plusieurs modules de ce projet appellent
    // `stopPropagation()`. Un écouteur en phase de bouillonnement raterait
    // silencieusement une partie des clics — et une mesure qui manque des
    // événements est pire qu'une mesure absente, parce qu'on la croit.
    // Le bas de page atteint : la seule mesure honnête de « la page a tenu ».
    const sentinelle = document.querySelector("body > footer");
    if (sentinelle && typeof IntersectionObserver !== "undefined") {
        const uneFois = creerMesureUnique();
        const obs = new IntersectionObserver(([e]) => {
            if (e?.isIntersecting) {
                uneFois(MESURES.PAGE_LUE, { page: location.pathname });
                obs.disconnect();
            }
        });
        obs.observe(sentinelle);
    }
}
function hote(url) {
    try {
        return new URL(url).host;
    }
    catch {
        return "inconnu";
    }
}
