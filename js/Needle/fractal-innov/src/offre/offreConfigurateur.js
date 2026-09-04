/**
 * Domaine « offre » — l'état du configurateur.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * CE MODULE NE TOUCHE PAS AU DOM — ET C'EST LA MÊME RAISON QUE `fitLobby.ts`
 * ════════════════════════════════════════════════════════════════════════════
 * Il porte l'état (produit, niveau, modules cochés) et les règles qui vont
 * avec. L'écran vit ailleurs. C'est ce qui rend le configurateur testable sans
 * navigateur — et c'est aussi ce qui permettra de le rhabiller entièrement
 * pour un client CONFIGURE sans toucher à une règle.
 *
 * ⚠️ **C'est la brique que `PLATEFORME.md` §5 disait manquante.** Le produit
 * CONFIGURE y était décrit comme le plus incomplet du socle. Il ne l'était pas :
 * on le regardait comme un produit à part, alors qu'un éditeur de niveau, un
 * configurateur produit et un « skin de parcours » sont **le même objet** — ce
 * qui change, c'est ce que la capsule décrit, pas la mécanique qui la produit.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * ⚠️ AUCUN PRIX NE PASSE PAR ICI
 * ════════════════════════════════════════════════════════════════════════════
 * Ce module compose une **description de produit**, rien d'autre. Le chiffrage
 * vit dans `offreChiffrage.ts`, qui n'est jamais importé par le build public.
 * La séparation n'est pas cosmétique : c'est elle qui garantit qu'aucun montant
 * n'entre dans le bundle expédié aux visiteurs.
 */
import { createLogger } from "../../../../socle/debugLog.js";
import { texte } from "./offreCatalogue.js";
import { encodeConfiguration } from "./offreShareCode.js";
const log = createLogger("Configurateur");
export function createConfigurateur(contenu, opts = {}) {
    // Départ sur le premier produit et le premier niveau du manifeste : un
    // configurateur qui s'ouvre vide oblige le visiteur à deviner par où
    // commencer, et beaucoup ferment l'onglet à ce moment-là.
    const etat = {
        produit: opts.depart?.produit ?? contenu.produits[0].id,
        niveau: opts.depart?.niveau ?? contenu.niveaux[0].id,
        modules: [...(opts.depart?.modules ?? [])],
    };
    function changer() {
        log("état", etat.produit, etat.niveau, etat.modules.join("+") || "(aucun module)");
        opts.surChangement?.({ ...etat, modules: [...etat.modules] });
    }
    /**
     * ⚠️ La seule vraie règle métier du configurateur, et elle vient du deck :
     * **les modules relèvent du niveau SIGNATURE.** Au niveau KIT, il n'y a
     * « aucun développement spécifique » — cocher des modules y serait une
     * promesse que l'offre ne tient pas. Au niveau ATELIER, tout est sur
     * mesure : le catalogue n'a plus de sens, tout est dans le forfait.
     *
     * On ne **vide** pas la sélection quand le visiteur redescend en KIT : il
     * remonte souvent en SIGNATURE juste après, et perdre ses cases cochées au
     * passage est le genre de détail qui fait abandonner. On les ignore, on le
     * dit, et on les retrouve intactes.
     */
    function modulesApplicables() {
        return etat.niveau === "signature";
    }
    return {
        etat: () => ({ ...etat, modules: [...etat.modules] }),
        choisirProduit(id) {
            if (!contenu.produits.some(p => p.id === id))
                return;
            etat.produit = id;
            changer();
        },
        choisirNiveau(id) {
            if (!contenu.niveaux.some(n => n.id === id))
                return;
            etat.niveau = id;
            changer();
        },
        basculerModule(id) {
            if (!contenu.modules.some(m => m.id === id))
                return;
            const i = etat.modules.indexOf(id);
            if (i >= 0)
                etat.modules.splice(i, 1);
            else
                etat.modules.push(id);
            changer();
        },
        modulesRetenus() {
            // ⚠️ On respecte l'ordre du MANIFESTE, pas l'ordre des clics : le
            // récapitulatif doit se lire dans le même ordre que le catalogue
            // affiché juste au-dessus, sinon le visiteur ne se relit pas.
            return contenu.modules.filter(m => etat.modules.includes(m.id));
        },
        modulesApplicables,
        code: () => encodeConfiguration({
            ...etat,
            // Le code décrit ce que le visiteur a réellement commandé : hors
            // SIGNATURE, les modules ne partent pas.
            modules: modulesApplicables() ? etat.modules : [],
        }),
        recapitulatif() {
            const produit = contenu.produits.find(p => p.id === etat.produit);
            const niveau = contenu.niveaux.find(n => n.id === etat.niveau);
            const lignes = [
                `Produit : ${produit.nom} — ${texte(produit.accroche)}`,
                `Niveau : ${niveau.nom} — ${texte(niveau.delai)}`,
            ];
            if (modulesApplicables()) {
                const mods = contenu.modules.filter(m => etat.modules.includes(m.id));
                lignes.push(mods.length > 0
                    ? `Modules : ${mods.map(m => texte(m.nom)).join(", ")}`
                    : "Modules : aucun pour l'instant");
            }
            else {
                lignes.push(`Modules : sans objet au niveau ${niveau.nom}`);
            }
            return lignes.join("\n");
        },
    };
}
/**
 * Compose le message de demande de devis.
 *
 * ⚠️ **Pourquoi un `mailto:` plutôt qu'un formulaire.** Un formulaire suppose
 * un service tiers, une base de prospects et les obligations qui vont avec.
 * Le `mailto:` délivre exactement le même lead — la configuration complète,
 * dans votre boîte — sans qu'aucune donnée du visiteur ne transite par un
 * système qui vous appartient. Il n'y a rien à déclarer parce qu'il n'y a rien
 * à traiter.
 *
 * ⚠️ **Le code est dans le corps ET le récapitulatif en clair.** Le code seul
 * serait illisible pour le destinataire s'il n'a pas l'extract sous la main ;
 * le texte seul ne se décode pas. Les deux, et chacun rattrape l'autre.
 */
export function lienDevis(contenu, conf) {
    const sujet = `Demande de devis — ${conf.code()}`;
    const corps = [
        "Bonjour,",
        "",
        "J'ai composé la configuration suivante sur votre site :",
        "",
        conf.recapitulatif(),
        "",
        `Code de configuration : ${conf.code()}`,
        "",
        "Pouvez-vous me faire un retour ?",
        "",
        "",
    ].join("\n");
    // ⚠️ `encodeURIComponent` laisse `'` `(` `)` `!` `*` non encodés — c'est
    // légal et inoffensif dans une URL `mailto:`. Un test qui l'interdirait
    // serait trop strict ; le projet est déjà tombé dans ce piège au jalon 15.
    return `mailto:${contenu.site.contact}`
        + `?subject=${encodeURIComponent(sujet)}`
        + `&body=${encodeURIComponent(corps)}`;
}
