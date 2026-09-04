/**
 * L'écran du configurateur — le seul module de `offre/` qui touche au DOM.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * ⚠️ AMÉLIORATION PROGRESSIVE — CE QUI DOIT RESTER VRAI
 * ════════════════════════════════════════════════════════════════════════════
 * La page `niveaux-et-modules` **liste déjà les trois niveaux et les huit
 * modules en HTML**, avant que ce script existe. Un visiteur sans JavaScript,
 * un lecteur d'écran, un robot de modèle de langage : tous voient l'offre
 * complète.
 *
 * Ce module ne fait qu'**ajouter** le geste de composition par-dessus. S'il ne
 * se charge pas, on perd le confort, jamais l'information. C'est la règle du
 * jalon 32, et elle ne se négocie pas : le sens de la page ne dépend d'aucun
 * script.
 *
 * ⚠️ **Conséquence pratique** : ce script se charge en `defer`, et il ne
 * réécrit jamais le contenu existant — il remplit un emplacement vide prévu
 * pour lui. Remplacer la liste HTML par un rendu JavaScript ferait disparaître
 * l'offre pour tous ceux qui comptent le plus au référencement.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * DEUX SURFACES, UN SEUL CODE
 * ════════════════════════════════════════════════════════════════════════════
 * Le même écran sert le site public et l'extract. La seule différence est un
 * drapeau : l'extract affiche le chiffrage, le public ne le connaît pas — le
 * module de chiffrage n'y est même pas chargé. Deux arborescences
 * divergeraient en trois semaines ; le précédent qui tourne déjà est
 * `valeo_sdv_demo`, qui sert `/` et `/remote` depuis un seul code.
 */
import { createLogger } from "../../../../socle/debugLog.js";
import { texte } from "./offreCatalogue.js";
import { createConfigurateur, lienDevis } from "./offreConfigurateur.js";
import { estLord } from "./offreLord.js";
const log = createLogger("ConfigurateurUI");
/** L'identifiant de l'emplacement réservé dans la page statique. */
export const HOTE_ID = "configurateur";
function esc(valeur) {
    return valeur.replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch] ?? ch);
}
/**
 * Monte le configurateur dans son emplacement.
 *
 * @returns `false` si l'emplacement n'existe pas — sur les cinq autres pages,
 *          c'est le cas normal, pas une erreur.
 */
export function monterConfigurateur(contenu, opts = {}) {
    const hote = document.getElementById(HOTE_ID);
    if (!hote)
        return false;
    const conf = createConfigurateur(contenu, { surChangement: () => rendre() });
    /**
     * ⚠️ Délégation d'événements, avec la règle du projet : **le préfixe le
     * plus long se teste en premier.** Un préfixe court qui mord avant un
     * préfixe long inverse le sens d'un clic **sans lever d'erreur** — payé
     * deux fois, au jalon 23 sur les préfixes de modèles et au jalon 26 sur
     * une table de renommage. Ici les trois préfixes sont disjoints, donc
     * l'ordre est sans conséquence ; il le deviendra au premier ajout.
     */
    hote.addEventListener("click", (ev) => {
        const cible = ev.target?.closest("[data-action]");
        const action = cible?.dataset.action;
        if (!action)
            return;
        if (action.startsWith("produit-"))
            conf.choisirProduit(action.slice(8));
        else if (action.startsWith("niveau-"))
            conf.choisirNiveau(action.slice(7));
        else if (action.startsWith("module-"))
            conf.basculerModule(action.slice(7));
        else if (action === "copier")
            copierCode();
    });
    async function copierCode() {
        const code = conf.code();
        try {
            await navigator.clipboard.writeText(code);
            annoncer("Code copié.");
        }
        catch {
            // ⚠️ Le presse-papiers est refusé hors contexte sécurisé et sur
            // certains navigateurs mobiles. Un échec silencieux laisserait le
            // visiteur croire que le bouton est cassé — on lui dit quoi faire.
            annoncer(`Copie impossible — sélectionnez le code : ${code}`);
        }
    }
    /** Message vivant, annoncé aussi aux lecteurs d'écran (`aria-live`). */
    function annoncer(message) {
        const zone = hote.querySelector("[data-annonce]");
        if (zone)
            zone.textContent = message;
    }
    function rendre() {
        const etat = conf.etat();
        const applicables = conf.modulesApplicables();
        const produits = contenu.produits.map(p => `
            <button class="ui-tuile" type="button" data-action="produit-${esc(p.id)}"
                    aria-pressed="${etat.produit === p.id}">
                <span class="ui-tuile__titre">${esc(p.nom)}</span>
                <span class="ui-tuile__detail">${esc(texte(p.accroche))}</span>
            </button>`).join("");
        const niveaux = contenu.niveaux.map(n => `
            <button class="ui-tuile" type="button" data-action="niveau-${esc(n.id)}"
                    aria-pressed="${etat.niveau === n.id}">
                <span class="ui-tuile__titre">${esc(n.nom)}</span>
                <span class="ui-tuile__detail">${esc(texte(n.delai))}</span>
            </button>`).join("");
        // ⚠️ Les modules restent VISIBLES hors SIGNATURE, mais désactivés et
        // expliqués. Les faire disparaître laisserait le visiteur penser que
        // l'offre n'en propose pas ; les laisser cliquables promettrait ce que
        // le niveau ne tient pas.
        const modules = contenu.modules.map(m => `
            <button class="ui-tuile" type="button" data-action="module-${esc(m.id)}"
                    aria-pressed="${etat.modules.includes(m.id)}"
                    ${applicables ? "" : "disabled"}>
                <span class="ui-tuile__titre">${etat.modules.includes(m.id) ? "☑" : "☐"} ${esc(texte(m.nom))}</span>
                <span class="ui-tuile__detail">${esc(texte(m.detail))}</span>
            </button>`).join("");
        const note = applicables
            ? ""
            : `<p class="ui-tuile__detail">Les modules du catalogue relèvent du niveau SIGNATURE.
                 Vos choix sont conservés si vous y revenez.</p>`;
        // ⚠️ Le chiffrage n'existe QUE si l'appelant l'a fourni. Sur le site
        // public, `opts.chiffrer` est `undefined` et la grille tarifaire n'est
        // pas dans le bundle : il n'y a rien à masquer, il n'y a rien du tout.
        const chiffrage = opts.chiffrer
            ? `<section class="ui-carte">
                   <strong>Chiffrage — usage interne</strong>
                   <pre>${esc(opts.chiffrer(etat))}</pre>
               </section>`
            : "";
        // Le mode Lord n'ouvre aucun accès : il affiche un rappel de ce que la
        // page est. Voir l'en-tête de `offreLord.ts`.
        const lord = estLord()
            ? `<p class="ui-pastille" style="--ui-pastille-teinte:var(--color-action-vive)">
                   <span class="ui-pastille__picto" aria-hidden="true">✦</span>mode Lord</p>`
            : "";
        hote.innerHTML = `
            ${lord}
            <fieldset><legend>1. Le produit</legend><div class="config-grille">${produits}</div></fieldset>
            <fieldset><legend>2. Le niveau d'engagement</legend><div class="config-grille">${niveaux}</div></fieldset>
            <fieldset><legend>3. Les modules</legend>${note}<div class="config-grille">${modules}</div></fieldset>

            <section class="ui-carte">
                <strong>Votre configuration</strong>
                <pre>${esc(conf.recapitulatif())}</pre>
                <p>Code : <code>${esc(conf.code())}</code></p>
                ${chiffrage}
                <p>
                    <!-- ⚠️ ui-eclat : le SEUL élément de la page autorisé à
                         briller. L'effet ne décore pas, il désigne l'action qui
                         rapporte. Un deuxième élément aussi appuyé et les deux
                         cessent de fonctionner — voir composants.css. -->
                    <a class="ui-bouton ui-eclat" href="${esc(lienDevis(contenu, conf))}">Demander un devis</a>
                    <button class="ui-bouton ui-bouton--discret" type="button" data-action="copier">Copier le code</button>
                </p>
                <p class="ui-tuile__detail" data-annonce role="status" aria-live="polite"></p>
            </section>`;
    }
    rendre();
    log("configurateur monté", opts.chiffrer ? "(avec chiffrage)" : "(sans prix)");
    return true;
}
