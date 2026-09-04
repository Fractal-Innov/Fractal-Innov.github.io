/**
 * Domaine « offre » — la liste des gestes qu'on compte, et pourquoi.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * UN SEUL ENDROIT OÙ LES NOMS SONT ÉCRITS
 * ════════════════════════════════════════════════════════════════════════════
 * Un nom d'événement mal orthographié ne lève aucune erreur : il crée une
 * deuxième colonne dans le tableau de bord, et la statistique se coupe en deux
 * **sans que rien ne le signale**. Le défaut se découvre des semaines plus
 * tard, en se demandant pourquoi les chiffres ont chuté.
 *
 * D'où cette table. `t35` vérifie qu'aucun nom n'est écrit en clair ailleurs.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * ⚠️ CE QU'ON MESURE — ET CE QU'ON NE MESURE PAS
 * ════════════════════════════════════════════════════════════════════════════
 * On mesure **des gestes**, jamais des personnes : aucun identifiant, aucun
 * texte saisi, aucune adresse. La question à laquelle ces chiffres répondent
 * est « qu'est-ce qui donne envie d'aller plus loin ? », pas « qui est venu ? ».
 *
 * L'ordre ci-dessous est celui de l'entonnoir commercial. Il se lit comme un
 * parcours : on arrive, on explore, on compose, on demande.
 */
export const MESURES = {
    // ── 1. On arrive ────────────────────────────────────────────────────────
    /** Un arrêt est entré dans l'écran. Dit **quel contenu retient**. */
    ARRET_VU: "arret-vu",
    /** Le visiteur a atteint le bas de la page. Dit si la page tient. */
    PAGE_LUE: "page-lue",
    // ── 2. On explore ───────────────────────────────────────────────────────
    /** Un point d'un arrêt a été mis en avant par un geste du visiteur. */
    POINT_REVELE: "point-revele",
    /** Une entrée du menu a été suivie. Dit **où on va après**. */
    NAVIGATION: "navigation",
    /** Un lien vers une démo en ligne a été ouvert. */
    DEMO_OUVERTE: "demo-ouverte",
    /** L'expérience OpenFit a été ouverte depuis le site. */
    OPENFIT_OUVERT: "openfit-ouvert",
    // ── 3. On compose ───────────────────────────────────────────────────────
    /** Un produit a été choisi dans le configurateur. */
    PRODUIT_CHOISI: "produit-choisi",
    /** Un niveau d'engagement a été choisi. */
    NIVEAU_CHOISI: "niveau-choisi",
    /** Un module a été coché ou décoché. */
    MODULE_BASCULE: "module-bascule",
    // ── 4. On demande ───────────────────────────────────────────────────────
    /**
     * ⚠️ **L'événement qui compte.** Tout le reste sert à expliquer celui-ci :
     * une demande de devis partie du site. C'est la seule mesure dont la valeur
     * se lit en euros, et le seul chiffre à regarder si on n'en regarde qu'un.
     */
    DEVIS_DEMANDE: "devis-demande",
    /** Le code de configuration a été copié — un devis qui part autrement. */
    CODE_COPIE: "code-copie",
    /** Le contact direct par courriel, hors configurateur. */
    CONTACT_DIRECT: "contact-direct",
};
