/**
 * OpenFitWebXR — logs de debug activables à l'exécution, sans recompiler.
 *
 * Objectif : chaque module crée son propre logger scopé, qui ne produit RIEN
 * par défaut. L'activation se fait depuis la console du navigateur et persiste
 * dans localStorage (survit au rechargement de la page).
 *
 * Dans un module :
 *   const debug = createLogger("FitSync");
 *   debug("Poussée programmée dans 1200ms");
 *
 * Depuis la console du navigateur :
 *   __debug.on()            → active TOUS les modules
 *   __debug.on("FitSync")   → active uniquement le scope "FitSync"
 *   __debug.off()           → coupe tout
 *   __debug.off("FitSync")  → coupe uniquement ce scope
 *   __debug.status()        → affiche l'état courant
 *
 * Ce fichier est le SEUL endroit qui gère la persistance/l'activation — les
 * modules qui l'utilisent n'ont besoin de rien savoir de ce mécanisme, juste
 * d'appeler le logger qu'on leur donne.
 */
const STORAGE_KEY = "openfitwebxr:debug";
function readState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw)
            return { all: false, scopes: [] };
        const parsed = JSON.parse(raw);
        return { all: !!parsed.all, scopes: Array.isArray(parsed.scopes) ? parsed.scopes : [] };
    }
    catch {
        return { all: false, scopes: [] };
    }
}
function writeState(state) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
    catch { /* mode privé : ignoré */ }
}
function isEnabled(scope) {
    const s = readState();
    return s.all || s.scopes.includes(scope);
}
/**
 * Crée un logger scopé. N'imprime que si le debug est actif pour ce scope
 * (ou globalement) — coût quasi nul quand désactivé : une lecture
 * localStorage, aucune concaténation de chaîne tant que le message n'est pas
 * affiché.
 */
export function createLogger(scope) {
    const prefix = `[${scope}]`;
    return (...args) => {
        if (isEnabled(scope))
            console.log(prefix, ...args);
    };
}
function enable(scope) {
    const s = readState();
    if (!scope)
        s.all = true;
    else if (!s.scopes.includes(scope))
        s.scopes.push(scope);
    writeState(s);
    console.log(scope ? `[Debug] Activé pour "${scope}"` : "[Debug] Activé pour tous les modules");
}
function disable(scope) {
    const s = readState();
    if (!scope) {
        s.all = false;
        s.scopes = [];
    }
    else
        s.scopes = s.scopes.filter(x => x !== scope);
    writeState(s);
    console.log(scope ? `[Debug] Désactivé pour "${scope}"` : "[Debug] Désactivé pour tous les modules");
}
function status() {
    const s = readState();
    console.log("[Debug] État :", s.all ? "TOUS les modules actifs" : (s.scopes.length ? s.scopes.join(", ") : "aucun module actif"));
}
/** Expose les commandes sur window.__debug — appelé une fois au démarrage (main.ts). */
export function initDebugConsole() {
    window.__debug = { on: enable, off: disable, status };
}
