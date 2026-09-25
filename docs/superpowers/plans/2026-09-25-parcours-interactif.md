# Le parcours interactif de l'accueil : plan d'implémentation

> **Exécution : native, dans cette session.** Les skills d'exécution par
> sous-agents (`subagent-driven-development`, `executing-plans`) sont en
> sommeil pendant la formation : l'assistant écrit le code tâche par tâche,
> **Corentin tape toutes les commandes `git` et `gh`** (une par bloc), et
> valide lui-même le rendu. Les cases `- [ ]` servent au suivi.

**Goal :** faire de l'accueil un parcours en sept chapitres réglé sur la
situation du visiteur (convaincre, former, garder), avec un dock de fil,
un geste par chapitre, un contrat d'événements pour le son et la
télécommande, et la mesure Umami.

**Architecture :** tout vit dans `index.html`. Le premier script (existant)
reste la source unique du chapitre courant : il écrit `body[data-chapitre]`
et émet `fi:chapitre`. Un second script, « LE PARCOURS », porte la mesure,
la situation, les gestes et le dock ; il n'écrit que des attributs
(`data-situation`, `data-etape`, `aria-*`) et le CSS fait le reste. Aucun
texte n'est injecté : tout le contenu est dans le HTML au chargement.

**Tech Stack :** HTML, CSS et JavaScript ES5 sans build (comme la page
actuelle), Umami Cloud (script déjà utilisé par les autres pages du site).

**Spec :** `docs/superpowers/specs/2026-09-25-parcours-interactif-design.md`

**Branche :** `feat/parcours-interactif`, empilée sur
`feat/accueil-theme-sombre` (PR #1, pas encore fusionnée).

## Global Constraints

- Un seul fichier : `index.html`. Aucune dépendance ajoutée hormis le script Umami.
- Poids ajouté au document **sous 15 Ko** (CSS + JS + balisage), mesuré par `wc -c` contre la base **105 276 octets**.
- Sans JavaScript, la page se lit comme aujourd'hui, les trois cartes ouvertes, sans dock.
- Aucun texte injecté par JavaScript (SEO) : les variantes sont dans le balisage, masquées par attribut `hidden`.
- Charte de `/stand/` : jetons existants, `--brand-gradient`, aucune nouvelle couleur.
- Jamais de tiret cadratin dans le texte visible ; pas de point final dans les titres.
- La couleur et l'icône ne portent jamais l'information seules (règle 6 de Needle5) ; un contrôle vit dans la bande centrale (règle 7) ; une pile de boutons partage sa largeur (règle 9).
- Cible tactile minimale : 44 px.
- Journal de debug par `?debug=1` (clé `fi:debug`), préfixe `[parcours]`, muet sinon.
- Mouvement réduit : aucun mouvement, états finaux, anneau de progression à jour.
- La navbar reste sur une seule rangée (règle du 25/09/2026) : on n'y touche pas.
- Umami : `data-website-id="6d76c813-ff70-4f96-b7c3-186f17661a14"`, noms d'événements en kebab-case, table `MESURES` unique.
- Calendrier de l'atelier : `https://calendar.app.google/SDuiKb9ZBQ6BcbED6`.

## Review Focus

1. **Arrivée par une ancre profonde** (`/#demos`, `/#contact`) : le dock doit afficher le bon chapitre dès qu'il apparaît, jamais « 1 / 7 ». Test en tâche 6, étape 4.
2. **`?situation=` inconnue ou mal écrite** (`xyz`, `FORMER`) : page neutre, une ligne au journal, aucune erreur. Test en tâche 4, étape 4.
3. **Umami absent** (bloqueur, hors ligne) **ou pas encore chargé** au démarrage (script `defer`) : aucune erreur, et la situation venue d'un lien de relance est quand même comptée une fois le script chargé. Test en tâche 3, étape 4.
4. **Petit téléphone (375 × 667)** : le hero plus chargé (question, trois boutons, CTA) ne déborde pas horizontalement et chaque bouton fait au moins 44 px de haut. Test en tâche 1, étape 9.
5. **Deux appuis rapides sur « › »** pendant un défilement doux : on avance de deux chapitres, pas d'un seul (le chapitre courant n'a pas encore changé). Test en tâche 4, étape 5.

---

### Task 1 : Le balisage des trois usages

Tout le texte et tous les attributs dont les tâches suivantes ont besoin,
sans une ligne de JavaScript. À la fin de cette tâche, la page se lit avec
le nouvel axe, sans JS comme avec.

**Files :**
- Modify : `index.html` : `<body>` (pictogrammes), hero, fondateur, approche, offre, démos, contact, CSS (bloc PARCOURS, règle `.offres`)

**Interfaces :**
- Produces (attributs lus par les tâches 3 à 7) :
  - `data-situation-choix="convaincre|former|garder|aucune"` sur les boutons qui choisissent, `data-origine="dock"` pour ceux du dock (tâche 6) ;
  - `data-usages="convaincre|former|garder"` sur ce que la situation allume (repères, cartes d'offre, démos) ;
  - `.badge-cas[hidden]` dans ces éléments ; `[data-pour="aucune|convaincre|former|garder"]` pour les variantes du contact ;
  - `data-rdv="hero|approche|offre|contact"`, `data-demo="stand|rayon-x|midipile|moulage|village"`, `data-canal="carte|email|linkedin|instagram"` ;
  - `#etapeSuivante` (bouton `hidden`), `#usage-convaincre`, `#usage-former`, `#usage-garder` ;
  - symboles SVG `#pic-convaincre`, `#pic-former`, `#pic-garder` ; classes `.pic`, `.sr-only`.

- [ ] **Step 1 : Mesurer le poids de départ**

Run : `wc -c index.html`
Expected : `105276 index.html`

- [ ] **Step 2 : Poser les trois pictogrammes**

Juste après `<div class="aura" aria-hidden="true"></div>`, ajouter :

```html
  <!-- Les pictogrammes des trois situations, dessinés une fois et repris par
       <use>. ⚠️ Règle 6 de Needle5 : un pictogramme n'est jamais seul, le mot
       l'accompagne toujours. -->
  <svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
    <symbol id="pic-convaincre" viewBox="0 0 24 24"><path d="M12 2 3 7v10l9 5 9-5V7z"/><path d="m3 7 9 5 9-5M12 12v10"/></symbol>
    <symbol id="pic-former" viewBox="0 0 24 24"><path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/></symbol>
    <symbol id="pic-garder" viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/></symbol>
  </svg>
```

- [ ] **Step 3 : Le hero**

Remplacer le bloc qui va de `<p class="hero__lead">` jusqu'à la fermeture
de `<div class="hero__actions">` par :

```html
        <p class="hero__lead">Votre savoir est mis en 3D une fois. Ensuite, il vend, il forme,
          il reste. Dans le navigateur, sans application.</p>

        <!-- Le premier geste du parcours. Sans JavaScript, chaque bouton est un
             lien vers la carte de sa situation ; avec, il règle aussi toute la
             page sur ce cas (script « LE PARCOURS », section LA SITUATION). -->
        <div class="situations">
          <p class="situations__question" id="situationsQuestion">Votre savoir doit d'abord :</p>
          <ul class="situations__liste" aria-labelledby="situationsQuestion">
            <li><a class="situation-btn" href="#usage-convaincre" data-situation-choix="convaincre">
              <svg class="pic" aria-hidden="true"><use href="#pic-convaincre"></use></svg>Convaincre un acheteur</a></li>
            <li><a class="situation-btn" href="#usage-former" data-situation-choix="former">
              <svg class="pic" aria-hidden="true"><use href="#pic-former"></use></svg>Former un nouvel arrivant</a></li>
            <li><a class="situation-btn" href="#usage-garder" data-situation-choix="garder">
              <svg class="pic" aria-hidden="true"><use href="#pic-garder"></use></svg>Garder un savoir-faire</a></li>
          </ul>
          <a class="situations__regarder" href="#fondateur" data-situation-choix="aucune">Juste regarder</a>
        </div>

        <div class="hero__actions">
          <a class="hero-cta__btn hero-cta__btn--primary"
             href="https://calendar.app.google/SDuiKb9ZBQ6BcbED6"
             target="_blank" rel="noopener" data-rdv="hero"><span>Réserver 30 min</span></a>
        </div>
```

📌 « Rencontrer le fondateur » disparaît : « Juste regarder » mène au même
endroit (`#fondateur`), et un hero à six boutons n'en fait lire aucun.

- [ ] **Step 4 : Le fondateur**

Dans `.portrait__barre`, remplacer les quatre tags de secteurs par :

```html
              <ul class="portrait__barre tag-liste" aria-label="Trois usages">
                <li class="tag">Convaincre</li>
                <li class="tag">Former</li>
                <li class="tag">Garder</li>
              </ul>
```

Puis, entre la fin de `<p class="fondateur__bio reveal">…</p>` et
`<p class="bloc-titre reveal">Compétences</p>`, insérer :

```html
            <p class="bloc-titre reveal">Pour votre cas</p>
            <ul class="reperes reveal">
              <li class="repere" data-usages="convaincre">
                <svg class="pic" aria-hidden="true"><use href="#pic-convaincre"></use></svg>
                <span><strong>Convaincre</strong> : vos équipements lourds et encombrants,
                  présentés sans le coût ni l'impact logistique du transport</span></li>
              <li class="repere" data-usages="former">
                <svg class="pic" aria-hidden="true"><use href="#pic-former"></use></svg>
                <span><strong>Former</strong> : des parcours sur équipement qui mettent en valeur
                  un savoir-faire, compatibles avec vos accords de confidentialité (Rayon X)</span></li>
              <li class="repere" data-usages="garder">
                <svg class="pic" aria-hidden="true"><use href="#pic-garder"></use></svg>
                <span><strong>Garder</strong> : processus de fabrication, savoir-faire, geste
                  d'une artiste, rejouables étape par étape (Mathilde Thiennot)</span></li>
            </ul>
```

- [ ] **Step 5 : L'approche**

Dans la première `<article class="carte etape reveal">`, remplacer :

```html
            <h3>Exploration</h3>
            <p class="etape__court">Comprendre ce qui doit être compris</p>
            <p class="etape__texte">Nous partons de votre produit, de votre public et de ce qu'il
              doit retenir. Vos fichiers 3D, photos et vidéos sont regardés ensemble.</p>
```

par :

```html
            <h3>Partir de votre situation</h3>
            <p class="etape__court">L'atelier de 30 min</p>
            <p class="etape__texte">Nous partons de votre besoin et du socle qui tourne déjà. Vos
              fichiers 3D, photos et vidéos sont regardés ensemble, et vous repartez en sachant
              par quel usage commencer. C'est gratuit.</p>
```

Puis, entre la fermeture de `<div class="etapes">` et le `</section>` de
l'approche, insérer :

```html
        <!-- Le geste de l'approche. « Étape suivante » est masqué sans
             JavaScript : les trois temps sont alors tous visibles. -->
        <div class="etapes__geste">
          <button class="hero-cta__btn hero-cta__btn--secondary" id="etapeSuivante" type="button" hidden>Étape suivante</button>
          <a class="hero-cta__btn hero-cta__btn--primary"
             href="https://calendar.app.google/SDuiKb9ZBQ6BcbED6"
             target="_blank" rel="noopener" data-rdv="approche"><span>Réserver 30 min</span></a>
        </div>
```

- [ ] **Step 6 : Les trois usages**

Remplacer toute la section `<section class="section" id="offre">` (de son
commentaire `<!-- ══ OFFRE` jusqu'à son `</section>`) par :

```html
      <!-- ══ TROIS USAGES ════════════════════════════════════════════════
           Un savoir, trois usages. Les trois cartes sont TOUJOURS dans le
           HTML, ouvertes : c'est ce que lisent les moteurs et le visiteur
           sans JavaScript. La situation choisie n'en masque aucune, elle
           allume la sienne (`body[data-situation]` + `data-usages`). -->
      <section class="section" id="offre">
        <p class="section-number reveal">L'agence</p>
        <h2 class="reveal">Un savoir, trois usages</h2>
        <p class="reveal">Chaque usage part du même socle, qui tourne déjà dans cinq
          démonstrateurs. L'atelier de 30 min sert à choisir par lequel commencer.</p>

        <div class="offres">
          <article class="carte offre reveal" id="usage-convaincre" data-usages="convaincre">
            <div class="media-16x9">
              <img src="/media/accueil/offre-stand.webp"
                   alt="La borne STAND sur un stand de salon, vue d'ensemble de la scène 3D"
                   width="1600" height="1063" loading="lazy" decoding="async">
            </div>
            <div class="offre__corps">
              <p class="offre__eyebrow"><svg class="pic" aria-hidden="true"><use href="#pic-convaincre"></use></svg>Convaincre un acheteur
                <span class="badge-cas" hidden>Votre situation</span></p>
              <h3>Votre produit ne voyage pas ? Votre démo, si</h3>
              <p class="offre__texte">Machines, équipements lourds, systèmes intégrés : leur jumeau
                3D se présente sur une borne ou derrière un lien, sans transport, sans montage,
                sans le coût ni l'impact logistique d'un convoi. Vos commerciaux gardent l'outil
                d'un salon à l'autre.</p>
              <p class="offre__preuve">Ça tourne déjà : <a href="#demo-stand">STAND</a>,
                <a href="#demo-midipile">Midipile</a></p>
              <div class="offre__actions">
                <a class="hero-cta__btn hero-cta__btn--primary"
                   href="https://calendar.app.google/SDuiKb9ZBQ6BcbED6"
                   target="_blank" rel="noopener" data-rdv="offre"><span>Réserver 30 min</span></a>
                <a class="hero-cta__btn hero-cta__btn--secondary" href="/stand/" data-demo="stand">Découvrir STAND</a>
              </div>
            </div>
          </article>

          <article class="carte offre reveal" id="usage-former" data-usages="former">
            <div class="media-16x9">
              <img src="/media/accueil/demos/rayon-x.webp"
                   alt="Rayon X : un échangeur thermique industriel en 3D, parcouru comme en formation"
                   width="1200" height="675" loading="lazy" decoding="async">
            </div>
            <div class="offre__corps">
              <p class="offre__eyebrow"><svg class="pic" aria-hidden="true"><use href="#pic-former"></use></svg>Former un nouvel arrivant
                <span class="badge-cas" hidden>Votre situation</span></p>
              <h3>Vos nouveaux arrivants apprennent sur l'équipement en production ?</h3>
              <p class="offre__texte">Ils le démontent, le parcourent et recommencent en 3D, sans
                arrêter la ligne ni prendre de risque. Le parcours met en valeur votre savoir-faire
                et respecte vos accords de confidentialité.</p>
              <p class="offre__preuve">Ça tourne déjà : <a href="#demo-rayon-x">Rayon X</a></p>
              <div class="offre__actions">
                <a class="hero-cta__btn hero-cta__btn--primary"
                   href="https://calendar.app.google/SDuiKb9ZBQ6BcbED6"
                   target="_blank" rel="noopener" data-rdv="offre"><span>Réserver 30 min</span></a>
              </div>
            </div>
          </article>

          <article class="carte offre reveal" id="usage-garder" data-usages="garder">
            <div class="media-16x9">
              <img src="/media/accueil/demos/moulage.webp"
                   alt="À fleur d'écorce : le geste de l'artiste Mathilde Thiennot, rejouable en 3D"
                   width="1200" height="675" loading="lazy" decoding="async">
            </div>
            <div class="offre__corps">
              <p class="offre__eyebrow"><svg class="pic" aria-hidden="true"><use href="#pic-garder"></use></svg>Garder un savoir-faire
                <span class="badge-cas" hidden>Votre situation</span></p>
              <h3>Vos savoir-faire partent avec ceux qui les ont ?</h3>
              <p class="offre__texte">Un processus de fabrication, un tour de main, le geste d'une
                artiste : capturés, découpés en étapes et rejouables sous tous les angles, aussi
                souvent qu'il le faut. La captation se fait avec vous, ou avec un partenaire
                spécialisé selon le besoin.</p>
              <p class="offre__preuve">Ça tourne déjà : <a href="#demo-moulage">À fleur d'écorce</a></p>
              <div class="offre__actions">
                <a class="hero-cta__btn hero-cta__btn--primary"
                   href="https://calendar.app.google/SDuiKb9ZBQ6BcbED6"
                   target="_blank" rel="noopener" data-rdv="offre"><span>Réserver 30 min</span></a>
              </div>
            </div>
          </article>
        </div>
      </section>
```

Puis, dans la règle CSS `.offres`, remplacer `minmax(min(100%, 24rem), 1fr)`
par `minmax(min(100%, 18rem), 1fr)` : trois cartes tiennent sur une rangée
à 1 100 px (3 × 288 px + 2 gouttières < 1 100 px), au lieu de 2 + 1.

- [ ] **Step 7 : Les démos et le contact**

Démos, cinq remplacements exacts :

| Chercher | Remplacer par |
|---|---|
| `<article class="carte demo reveal" id="demo-stand">` | `<article class="carte demo reveal" id="demo-stand" data-usages="convaincre">` |
| `<article class="carte demo reveal" id="demo-rayon-x">` | `<article class="carte demo reveal" id="demo-rayon-x" data-usages="former">` |
| `<article class="carte demo reveal" id="demo-midipile">` | `<article class="carte demo reveal" id="demo-midipile" data-usages="convaincre">` |
| `<article class="carte demo reveal" id="demo-moulage">` | `<article class="carte demo reveal" id="demo-moulage" data-usages="garder">` |
| `<h3>STAND</h3>`, `<h3>Rayon X</h3>`, `<h3>Midipile</h3>`, `<h3>À fleur d'écorce</h3>` | la même ligne précédée de `<p class="badge-cas" hidden>Pour votre cas</p>` |

Et sur les liens des démos, ajouter `data-demo` :
`href="/stand/"` → `href="/stand/" data-demo="stand"` (dans `#demo-stand`),
`href="/rayon-x/"` → `… data-demo="rayon-x"`, `href="/midipile/"` →
`… data-demo="midipile"`, `href="/moulage-mathilde-thiennot/"` →
`… data-demo="moulage"`, `href="/village/"` → `… data-demo="village"`.
Le village ne reçoit ni `data-usages` ni badge : c'est la visite de tout le
site, rattachée à aucune situation.

Contact, remplacer `<h2 class="reveal">Un projet ou une idée en tête ?</h2>` par :

```html
        <!-- Les quatre titres sont dans le HTML (SEO) ; seul celui de la
             situation choisie s'affiche, par CSS (`data-pour`). Sans JS :
             le titre neutre. -->
        <h2 class="reveal">
          <span data-pour="aucune">Un projet ou une idée en tête ?</span>
          <span data-pour="convaincre" hidden>Parlons de l'équipement qui ne voyage pas</span>
          <span data-pour="former" hidden>Parlons de vos nouveaux arrivants</span>
          <span data-pour="garder" hidden>Parlons du savoir-faire à garder</span>
        </h2>
```

Sur `<a class="contact__primary" id="contactPrimary"`, ajouter
`data-rdv="contact"` et remplacer son `<span>Prendre rendez-vous</span>` par
`<span>Réserver 30 min</span>`. Juste après le `</a>` de ce bouton, avant
`<p class="contact__or">`, insérer :

```html
          <p class="contact__atelier">L'atelier de cadrage, gratuit : nous partons de votre
            situation et du socle existant.</p>
```

Sur les quatre liens de `.contact__links`, ajouter dans l'ordre
`data-canal="carte"`, `data-canal="email"`, `data-canal="linkedin"`,
`data-canal="instagram"`.

- [ ] **Step 8 : Le CSS du balisage**

Juste avant le bloc `@media (prefers-reduced-motion: reduce)`, insérer :

```css
    /* ══════════════════════════════════════════════════════════════════════
       PARCOURS : les trois usages, la situation, les gestes, le dock
       (spec : docs/superpowers/specs/2026-09-25-parcours-interactif-design.md)

       ⚠️ Tout ce qui s'allume se lit sur <body data-situation> : le script
       n'écrit QUE cet attribut, le CSS fait le reste. Aucune couleur neuve.
       ⚠️ `display` posé par l'auteur l'emporte sur l'attribut `hidden` : tout
       élément qui porte `hidden` ET une classe à `display` reçoit sa règle
       `[hidden] { display: none; }`, sinon il ne se masque jamais.
       ══════════════════════════════════════════════════════════════════════ */
    .sr-only {
      position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
      overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
    }
    .pic {
      width: 1.1em; height: 1.1em; flex-shrink: 0;
      fill: none; stroke: currentColor; stroke-width: 2;
      stroke-linecap: round; stroke-linejoin: round;
    }

    /* Le choix du hero : trois pilules, le même poids pour les trois. */
    .situations { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; }
    .situations__question { margin: 0; font-size: 0.95rem; color: var(--text-soft); }
    .situations__liste {
      list-style: none; margin: 0; padding: 0;
      display: flex; flex-wrap: wrap; justify-content: center; gap: 0.6rem;
    }
    .situation-btn {
      display: inline-flex; align-items: center; gap: 0.5rem;
      min-height: 44px; padding: 0.6rem 1.1rem;
      border-radius: 999px; border: 1px solid var(--glass-border-highlight);
      background: var(--glass-bg); color: var(--text-main);
      font-weight: 600; font-size: 0.95rem; text-decoration: none;
      transition: background 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
    }
    .situation-btn:hover,
    .situation-btn:focus-visible { background: var(--glass-bg-hover); border-color: var(--accent-blue); transform: translateY(-2px); }
    .situation-btn[aria-current="true"] {
      border-color: transparent;
      background: linear-gradient(var(--bg-base-2), var(--bg-base-2)) padding-box,
                  var(--brand-gradient) border-box;
    }
    .situations__regarder { font-size: 0.9rem; color: var(--text-muted); text-underline-offset: 3px; }
    .situations__regarder:hover { color: var(--text-main); }

    /* Les repères du fondateur. */
    .reperes { list-style: none; margin: 0 0 1.5rem; padding: 0; display: flex; flex-direction: column; gap: 0.6rem; }
    .repere {
      display: flex; gap: 0.75rem; align-items: flex-start;
      padding: 0.75rem 1rem; border-radius: 12px;
      border: 1px solid var(--glass-border); background: var(--glass-bg);
      color: var(--text-soft); font-size: 0.95rem;
    }
    .repere .pic { margin-top: 0.2em; color: var(--accent-blue-light); }
    .repere strong { color: var(--text-main); }

    /* Les cartes d'usage et les démos. */
    .offre__eyebrow { display: flex; align-items: center; flex-wrap: wrap; gap: 0.45rem; }
    .offre__preuve { margin: 0 0 1.25rem; font-size: 0.9rem; color: var(--text-muted); }
    .offre__preuve a { color: var(--accent-blue-light); }
    .badge-cas {
      display: inline-flex; align-items: center; width: fit-content;
      margin: 0 0 0.4rem; padding: 0.15rem 0.6rem; border-radius: 999px;
      font-size: 0.72rem; font-weight: 700; letter-spacing: 0.04em;
      color: #fff; background: var(--brand-gradient);
    }
    .badge-cas[hidden] { display: none; }

    /* L'approche et le contact. */
    .etapes__geste { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.75rem; margin-top: 2rem; }
    .etapes__geste button { font: inherit; cursor: pointer; }
    .etapes__geste [hidden] { display: none; }
    .contact__atelier { margin: 0.75rem 0 0; font-size: 0.9rem; color: var(--text-muted); }
```

- [ ] **Step 9 : Vérifier**

Serveur `accueil-fi` (port 4000, lançable par l'assistant), page
`http://127.0.0.1:4000/`, dans la console :

```js
[document.querySelectorAll('[data-usages]').length,
 document.querySelectorAll('[data-rdv]').length,
 document.querySelectorAll('[data-demo]').length,
 document.querySelectorAll('[data-canal]').length,
 document.body.innerText.includes('Prendre rendez-vous'),
 document.body.innerText.includes('\u2014')]
```
Expected : `[10, 6, 6, 4, false, false]` (3 repères + 3 cartes + 4 démos ;
hero, approche, 3 cartes, contact ; « Découvrir STAND » + 5 démos).

À 375 × 667 (`resize_window`), sur le hero :

```js
[document.documentElement.scrollWidth - innerWidth,
 Math.min(...[...document.querySelectorAll('.situation-btn, .hero__actions a')].map(a => a.getBoundingClientRect().height))]
```
Expected : `[0, 44]` ou plus pour le second nombre.

Sans JavaScript (Corentin, DevTools › Désactiver JavaScript) : texte
complet, un clic sur « Former un nouvel arrivant » descend à la carte
Former, le contact dit « Un projet ou une idée en tête ? ».

- [ ] **Step 10 : Commit** (Corentin tape)

```bash
git add index.html
```

```bash
git commit -m "feat(parcours): poser le balisage des trois usages" -m "Hero avec le choix de situation, reperes du fondateur, etape 01 renommee en atelier de 30 min, trois cartes d'usage, variantes du contact et attributs lus par le parcours. Aucun JavaScript : la page se lit deja avec le nouvel axe." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2 : Le signal de chapitre

Le scroll-spy existant devient la source unique du chapitre courant, sur
sept chapitres au lieu de cinq sections.

**Files :**
- Modify : `index.html`, premier `<script>`, bloc « Le lien de navigation de la section courante »

**Interfaces :**
- Consumes : les `id` de section `top`, `fondateur`, `approche`, `offre`, `demos`, `partenaires`, `contact`.
- Produces : `document.body.dataset.chapitre` (toujours posé, dès le premier appel) ; événement `fi:chapitre` sur `document`, `detail: { id: string, rang: number (1..7), total: 7 }`, émis à chaque changement, y compris le tout premier.

- [ ] **Step 1 : Remplacer le calcul**

Remplacer, de `var liensNav = document.querySelectorAll('#mainNav .nav-link');`
jusqu'à la fin de `function majLienActif() { … }` inclus, par :

```js
      var liensNav = document.querySelectorAll('#mainNav .nav-link');
      var idsSections = ['fondateur', 'approche', 'offre', 'demos', 'partenaires'];
      /* Les SEPT chapitres du parcours (le hero et le contact en plus des
         liens de la nav). ⚠️ Même liste, même ordre que CHAPITRES dans le
         script « LE PARCOURS » : ce sont aussi les `navItemId` que la
         télécommande enverra. */
      var idsChapitres = ['top', 'fondateur', 'approche', 'offre', 'demos', 'partenaires', 'contact'];
      var rafNav = 0;
      var dernierActif = null;

      function majLienActif() {
        rafNav = 0;
        var hauteurBandeau = 96;
        var pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
        var ligne = window.scrollY + Math.max(hauteurBandeau + 28, pad + 2);

        /* Le chapitre courant : le dernier dont le haut a passé la ligne. */
        var chapitre = idsChapitres[0];
        for (var i = 1; i < idsChapitres.length; i++) {
          var el = document.getElementById(idsChapitres[i]);
          if (el && ligne >= el.getBoundingClientRect().top + window.scrollY) chapitre = idsChapitres[i];
        }
        /* En bas de page, le dernier chapitre gagne même s'il est trop court
           pour que son haut atteigne la ligne : sinon le contact ne serait
           jamais « atteint » sur un grand écran. */
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
          chapitre = idsChapitres[idsChapitres.length - 1];
        }

        var actif = idsSections.indexOf(chapitre) >= 0 ? chapitre : null;
        liensNav.forEach(function (a) {
          var href = a.getAttribute('href') || '';
          var id = href.charAt(0) === '#' ? href.slice(1) : '';
          a.classList.toggle('active-link', id === actif && actif !== null);
        });

        /* ⚠️ Le parcours, le son et la télécommande lisent CE résultat, et
           rien d'autre : une seconde ligne de lecture finirait par dire un
           autre chapitre que la nav. L'attribut est posé dès le premier
           appel, pour qui arrive après l'événement (arrivée par `/#demos`). */
        if (chapitre !== dernierActif) {
          var rang = idsChapitres.indexOf(chapitre) + 1;
          journal('chapitre :', (dernierActif || '(départ)') + ' → ' + chapitre, '(' + rang + ' / ' + idsChapitres.length + ')');
          dernierActif = chapitre;
          document.body.setAttribute('data-chapitre', chapitre);
          document.dispatchEvent(new CustomEvent('fi:chapitre', {
            detail: { id: chapitre, rang: rang, total: idsChapitres.length }
          }));
        }
      }
```

📌 Changement de comportement voulu : sur le contact, plus aucun lien de la
nav n'est surligné (avant, « Partenaires » le restait jusqu'en bas).

- [ ] **Step 2 : Vérifier**

`http://127.0.0.1:4000/?debug=1`, console :

```js
document.addEventListener('fi:chapitre', e => console.log('reçu', e.detail));
document.getElementById('demos').scrollIntoView();
```
Expected : `reçu {id: 'demos', rang: 5, total: 7}` et
`document.body.dataset.chapitre === 'demos'`.

```js
scrollTo(0, 1e6)
```
Expected : `reçu {id: 'contact', rang: 7, total: 7}`, aucun `.active-link`.

Recharger `http://127.0.0.1:4000/#partenaires` : `document.body.dataset.chapitre`
vaut `'partenaires'` une fois la page posée.

- [ ] **Step 3 : Commit** (Corentin tape)

```bash
git add index.html
```

```bash
git commit -m "feat(parcours): emettre le chapitre courant depuis le scroll-spy" -m "La ligne de lecture de la nav couvre les sept chapitres, pose body[data-chapitre] et emet fi:chapitre. Une seule source de verite pour le dock, le son et la telecommande." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3 : Le script du parcours et la mesure

Le second script naît ici, avec son vocabulaire et la mesure Umami. Le
compter en premier permet de voir chaque tâche suivante dans le journal.

**Files :**
- Modify : `index.html` : `<head>` (script Umami), nouveau `<script>` après le premier

**Interfaces :**
- Consumes : `fi:chapitre` et `body[data-chapitre]` (tâche 2) ; `data-rdv`, `data-demo`, `data-canal` (tâche 1).
- Produces (dans la portée du script, pour les tâches 4 à 7) :
  - `journal(...args)`, `sobre: boolean`, `emettre(nom: string, detail: object)` ;
  - `CHAPITRES: {id, titre}[]`, `IDS: string[]`, `SITUATIONS: {convaincre: 'Convaincre', former: 'Former', garder: 'Garder'}` ;
  - `MESURES` (table des noms), `mesurer(nom, donnees?)`, `mesurerUneFois(cle, nom, donnees?)`, `situationActuelle(): string` (`'aucune'` par défaut) ;
  - écoute `fi:situation` (`detail: { id, origine }`) et `fi:geste` (`detail: { chapitre, geste, etape }`), émis par les tâches 4 et 5.
- Règle de placement : **chaque tâche suivante ajoute sa section à la fin de l'IIFE, avant la section « AU DÉMARRAGE »** (créée en tâche 4).

- [ ] **Step 1 : Charger Umami**

Dans `<head>`, juste après `<link rel="manifest" href="/site.webmanifest">` :

```html
  <!-- La mesure d'usage, comme sur les autres pages du site. Umami ne pose
       aucun cookie : pas de bandeau de consentement. `data-domains` coupe
       l'envoi hors production : les essais en local ne faussent pas les
       chiffres (le script répond, mais n'envoie rien). -->
  <script defer src="https://cloud.umami.is/script.js"
          data-website-id="6d76c813-ff70-4f96-b7c3-186f17661a14"
          data-domains="www.fractal-innov.fr,fractal-innov.fr"></script>
```

- [ ] **Step 2 : Créer le script du parcours**

Juste après le `</script>` du premier script (avant `</body>`), ajouter :

```html
  <script>
    /* ══════════════════════════════════════════════════════════════════════
       LE PARCOURS

       Ce qu'il fait : il lit les sept sections comme les chapitres d'un même
       récit, règle la page sur la situation du visiteur, joue un geste par
       chapitre, tient le dock, et compte ce qui se passe (Umami).
       Pourquoi un second script : le premier règle l'apparence et s'arrête
       tôt (le `return` de l'apparition au défilement). Il ne dépend de lui
       que par UN point : `fi:chapitre` et `body[data-chapitre]`.
       ⚠️ Ce qui casse si on s'y trompe : la page doit rester lisible sans ce
       script. Il n'injecte AUCUN texte ; il allume, masque et compte.

       Le contrat (spec, § 8), pour le son et la télécommande :
         émis    fi:chapitre {id, rang, total}   (par le premier script)
                 fi:situation {id, origine}      fi:geste {chapitre, geste, etape}
         écouté  fi:aller {chapitre} | {pas: 1 | -1}
       ══════════════════════════════════════════════════════════════════════ */
    (function () {
      'use strict';

      /* ── Le journal : même interrupteur que le premier script (?debug=1),
         qui a déjà écrit la clé quand celui-ci s'exécute. ── */
      var DEBUG = false;
      try { DEBUG = localStorage.getItem('fi:debug') === '1'; } catch (e) {}
      function journal() {
        if (!DEBUG) return;
        console.log.apply(console, ['%c[parcours]', 'color:#f472b6']
          .concat(Array.prototype.slice.call(arguments)));
      }
      var sobre = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      /* ── Le vocabulaire ────────────────────────────────────────────────
         ⚠️ Les `id` sont ceux des sections ET les `navItemId` de la
         télécommande (protocole du Salon) : les renommer casse le pilotage.
         Même ordre que `idsChapitres` dans le premier script. */
      var CHAPITRES = [
        { id: 'top', titre: 'Accueil' },
        { id: 'fondateur', titre: 'Le fondateur' },
        { id: 'approche', titre: "L'approche" },
        { id: 'offre', titre: 'Trois usages' },
        { id: 'demos', titre: 'Ça tourne déjà' },
        { id: 'partenaires', titre: 'Partenaires' },
        { id: 'contact', titre: 'Contact' }
      ];
      var IDS = CHAPITRES.map(function (c) { return c.id; });
      var SITUATIONS = { convaincre: 'Convaincre', former: 'Former', garder: 'Garder' };

      function emettre(nom, detail) {
        document.dispatchEvent(new CustomEvent(nom, { detail: detail }));
      }
      function situationActuelle() {
        return document.body.getAttribute('data-situation') || 'aucune';
      }

      /* ── LA MESURE (Umami) ─────────────────────────────────────────────
         Le contrat de `socle/mesure/analytique.ts`, porté en JS simple :
         une mesure ne lève JAMAIS d'exception et ne fait rien sans le
         script (bloqueur, hors ligne). Aucun geste n'appelle Umami : la
         mesure ÉCOUTE le parcours, comme le feront le son et la télécommande.

         ⚠️ Le script Umami est `defer` : il s'exécute APRÈS celui-ci. Ce qui
         se mesure au démarrage (la situation d'un lien de relance, le
         premier chapitre) attend donc l'événement `load` dans une file,
         sinon la mesure la plus précieuse serait perdue. */
      var MESURES = {
        situationChoisie: 'situation-choisie',
        chapitreAtteint: 'chapitre-atteint',
        geste: 'geste',
        guideOuvert: 'guide-ouvert',
        rdvDemande: 'rdv-demande',
        demoOuverte: 'demo-ouverte',
        contactDirect: 'contact-direct'
      };
      var fileMesures = [];
      function envoyer(nom, donnees) {
        try {
          var u = window.umami;
          if (!u || typeof u.track !== 'function') {
            journal('mesure ignorée (script absent) :', nom, donnees || '');
            return;
          }
          if (donnees && Object.keys(donnees).length) u.track(nom, donnees);
          else u.track(nom);
          journal('mesure :', nom, donnees || '');
        } catch (e) { /* une mesure ne casse jamais la page */ }
      }
      function mesurer(nom, donnees) {
        if (fileMesures) { fileMesures.push([nom, donnees]); return; }
        envoyer(nom, donnees);
      }
      window.addEventListener('load', function () {
        var file = fileMesures;
        fileMesures = null;
        journal(file.length + ' mesure(s) du démarrage envoyée(s) après le chargement d\'Umami');
        file.forEach(function (m) { envoyer(m[0], m[1]); });
      });
      var dejaMesure = {};
      function mesurerUneFois(cle, nom, donnees) {
        if (dejaMesure[cle]) return;
        dejaMesure[cle] = true;
        mesurer(nom, donnees);
      }

      document.addEventListener('fi:situation', function (e) {
        mesurer(MESURES.situationChoisie, {
          situation: e.detail.id || 'aucune',
          origine: e.detail.origine || 'inconnue'
        });
      });
      function mesurerChapitre(id) {
        mesurerUneFois('chapitre:' + id, MESURES.chapitreAtteint, { chapitre: id, rang: IDS.indexOf(id) + 1 });
      }
      document.addEventListener('fi:chapitre', function (e) { mesurerChapitre(e.detail.id); });
      /* Le premier chapitre a été annoncé AVANT que ce script n'écoute. */
      mesurerChapitre(document.body.getAttribute('data-chapitre') || 'top');
      document.addEventListener('fi:geste', function (e) {
        var d = e.detail;
        mesurerUneFois('geste:' + d.chapitre + ':' + d.geste, MESURES.geste, { chapitre: d.chapitre, geste: d.geste });
      });

      /* Les clics qui comptent : la réservation (LA conversion), une démo,
         un autre canal. Une seule écoute, déléguée, lue sur les attributs
         posés dans le HTML. */
      document.addEventListener('click', function (e) {
        if (!e.target.closest) return;
        var rdv = e.target.closest('[data-rdv]');
        if (rdv) {
          mesurer(MESURES.rdvDemande, { situation: situationActuelle(), emplacement: rdv.getAttribute('data-rdv') });
          return;
        }
        var demo = e.target.closest('[data-demo]');
        if (demo) {
          mesurer(MESURES.demoOuverte, { demo: demo.getAttribute('data-demo'), situation: situationActuelle() });
          return;
        }
        var canal = e.target.closest('[data-canal]');
        if (canal) mesurer(MESURES.contactDirect, { canal: canal.getAttribute('data-canal') });
      });
    })();
  </script>
```

- [ ] **Step 3 : Vérifier le flux normal**

`http://127.0.0.1:4000/?debug=1`, console, après chargement :
Expected : une ligne `[parcours] 1 mesure(s) du démarrage envoyée(s)…`
puis `[parcours] mesure : chapitre-atteint {chapitre: 'top', rang: 1}`.

Clic sur « Réserver 30 min » du hero (un onglet du calendrier s'ouvre, le
refermer) :
Expected : `mesure : rdv-demande {situation: 'aucune', emplacement: 'hero'}`.
Onglet Réseau : aucune requête `/api/send` (hors production, `data-domains`).

- [ ] **Step 4 : Vérifier sans Umami** (Review Focus 3)

```js
delete window.umami;
document.querySelector('[data-canal="linkedin"]').dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}));
```
Expected : `mesure ignorée (script absent) : contact-direct {canal: 'linkedin'}`,
aucune erreur rouge dans la console.

- [ ] **Step 5 : Commit** (Corentin tape)

```bash
git add index.html
```

```bash
git commit -m "feat(parcours): mesurer le parcours avec Umami" -m "Script Umami du site (coupe hors production par data-domains) et second script LE PARCOURS : vocabulaire des chapitres, mesure muette sans le script, file d'attente jusqu'au chargement, ecoute des evenements fi: et des clics rdv, demo, contact." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4 : La situation

**Files :**
- Modify : `index.html` : script « LE PARCOURS » (sections LA SITUATION, ALLER À UN CHAPITRE, AU DÉMARRAGE), CSS (bloc PARCOURS)

**Interfaces :**
- Consumes : `journal`, `sobre`, `emettre`, `IDS`, `SITUATIONS` (tâche 3) ; `[data-situation-choix]`, `[data-usages]`, `.badge-cas`, `[data-pour]` (tâche 1).
- Produces :
  - `choisirSituation(id: 'convaincre'|'former'|'garder'|null, origine: 'hero'|'dock'|'url')` ;
  - `body[data-situation]` (absent quand aucune), `aria-current="true"` sur les boutons de la situation, `?situation=` dans l'URL ;
  - événement `fi:situation` `{ id, origine }` ; écoute de `fi:aller` `{ chapitre }` ou `{ pas: 1|-1 }` ;
  - la section **AU DÉMARRAGE**, qui reste la dernière du script.

- [ ] **Step 1 : Le code**

À la fin de l'IIFE (avant `})();`), ajouter :

```js
      /* ── LA SITUATION ──────────────────────────────────────────────────
         Une seule variable, écrite de trois endroits : un bouton du hero,
         le menu du dock, l'URL à l'arrivée (lien de relance).
         ⚠️ L'URL n'est LUE qu'une fois, au démarrage ; ensuite c'est le
         choix qui l'écrit, jamais l'inverse. Deux sources qui se lisent
         l'une l'autre finissent par se contredire. */
      var situation = null;
      var boutonsSituation = document.querySelectorAll('[data-situation-choix]');

      function choisirSituation(id, origine) {
        if (id !== null && !SITUATIONS.hasOwnProperty(id)) {
          journal('situation inconnue, ignorée :', id);
          return;
        }
        if (id === situation) return;
        var avant = situation;
        situation = id;
        if (id) document.body.setAttribute('data-situation', id);
        else document.body.removeAttribute('data-situation');
        boutonsSituation.forEach(function (b) {
          if (b.getAttribute('data-situation-choix') === id) b.setAttribute('aria-current', 'true');
          else b.removeAttribute('aria-current');
        });
        /* `replaceState` et non `pushState` : changer de situation ne doit
           pas ajouter une page au bouton Précédent. */
        try {
          var url = new URL(location.href);
          if (id) url.searchParams.set('situation', id);
          else url.searchParams.delete('situation');
          history.replaceState(history.state, '', url.pathname + url.search + url.hash);
        } catch (e) { /* file:// ou navigateur ancien : la page marche sans */ }
        journal('situation :', (avant || 'aucune') + ' → ' + (id || 'aucune'), '(venue de : ' + origine + ')');
        emettre('fi:situation', { id: id, origine: origine });
      }

      /* Le lien du hero garde son ancre : on choisit, PUIS le navigateur
         descend à la carte, comme sans JavaScript. */
      document.addEventListener('click', function (e) {
        var cible = e.target.closest && e.target.closest('[data-situation-choix]');
        if (!cible) return;
        var v = cible.getAttribute('data-situation-choix');
        choisirSituation(v === 'aucune' ? null : v, cible.getAttribute('data-origine') || 'hero');
      });

      /* ── ALLER À UN CHAPITRE (fi:aller) ────────────────────────────────
         La porte d'entrée du dock et de la future télécommande.
         ⚠️ Pendant un défilement doux, `data-chapitre` n'a pas encore
         changé : deux « suivant » rapides viseraient deux fois le même
         chapitre. On compte donc depuis la DERNIÈRE cible pendant 1 s. */
      var derniereCible = -1;
      var cibleViseeA = 0;
      document.addEventListener('fi:aller', function (e) {
        var d = e.detail || {};
        var rang = IDS.indexOf(d.chapitre);
        if (rang < 0 && (d.pas === 1 || d.pas === -1)) {
          var depart = (derniereCible >= 0 && performance.now() - cibleViseeA < 1000)
            ? derniereCible
            : Math.max(0, IDS.indexOf(document.body.getAttribute('data-chapitre') || 'top'));
          rang = depart + d.pas;
          if (rang < 0 || rang >= IDS.length) { journal('fi:aller : déjà au bout du parcours'); return; }
        }
        if (rang < 0) { journal('fi:aller : chapitre inconnu', d); return; }
        derniereCible = rang;
        cibleViseeA = performance.now();
        journal('fi:aller →', IDS[rang]);
        document.getElementById(IDS[rang]).scrollIntoView({ behavior: sobre ? 'auto' : 'smooth', block: 'start' });
      });

      /* ── AU DÉMARRAGE ──────────────────────────────────────────────────
         ⚠️ Cette section reste la DERNIÈRE du script : tous les écouteurs
         (mesure, dock) doivent être posés avant que la situation venue de
         l'URL ne soit annoncée, sinon ils la manquent. */
      var depuisUrl = null;
      try { depuisUrl = new URLSearchParams(location.search).get('situation'); } catch (e) {}
      if (depuisUrl !== null) {
        if (SITUATIONS.hasOwnProperty(depuisUrl)) choisirSituation(depuisUrl, 'url');
        else journal('?situation=' + depuisUrl + ' inconnue : la page reste neutre');
      }
      journal('parcours prêt, chapitre', document.body.getAttribute('data-chapitre') || 'top');
```

- [ ] **Step 2 : Le CSS de l'allumage**

À la fin du bloc PARCOURS (avant `@media (prefers-reduced-motion`) :

```css
    /* ── Ce que la situation allume ─────────────────────────────────────
       ⚠️ Rien n'est masqué ni réordonné dans les offres et les démos :
       réordonner ferait sauter le contenu sous le doigt. On allume. */
    body[data-situation="convaincre"] [data-usages~="convaincre"],
    body[data-situation="former"] [data-usages~="former"],
    body[data-situation="garder"] [data-usages~="garder"] {
      border: 1px solid transparent;
      background: linear-gradient(var(--bg-base-2), var(--bg-base-2)) padding-box,
                  var(--brand-gradient) border-box;
      box-shadow: 0 18px 48px -22px rgba(139, 92, 246, 0.6);
    }
    body[data-situation="convaincre"] [data-usages~="convaincre"] .badge-cas[hidden],
    body[data-situation="former"] [data-usages~="former"] .badge-cas[hidden],
    body[data-situation="garder"] [data-usages~="garder"] .badge-cas[hidden] { display: inline-flex; }
    body[data-situation="convaincre"] [data-pour="convaincre"][hidden],
    body[data-situation="former"] [data-pour="former"][hidden],
    body[data-situation="garder"] [data-pour="garder"][hidden] { display: inline; }
    body[data-situation] [data-pour="aucune"] { display: none; }
    /* Le fondateur : le repère de la situation passe en tête de liste. */
    body[data-situation="convaincre"] .repere[data-usages~="convaincre"],
    body[data-situation="former"] .repere[data-usages~="former"],
    body[data-situation="garder"] .repere[data-usages~="garder"] { order: -1; }
```

📌 Arbitrage 20/80 : la spec dit que la carte choisie « s'allume et
s'ouvre ». Les trois cartes étant déjà ouvertes (SEO, sans JS), « s'ouvre »
se réduit ici à s'allumer et porter le badge.

- [ ] **Step 3 : Vérifier le choix** (critère 2)

`http://127.0.0.1:4000/?debug=1`, clic sur « Former un nouvel arrivant » :

```js
[document.body.dataset.situation, location.search,
 getComputedStyle(document.querySelector('#demo-rayon-x .badge-cas')).display,
 getComputedStyle(document.querySelector('#demo-stand .badge-cas')).display,
 [...document.querySelectorAll('#contact h2 span')].filter(s => getComputedStyle(s).display !== 'none').map(s => s.textContent)]
```
Expected : `['former', '?situation=former', 'inline-flex', 'none', ['Parlons de vos nouveaux arrivants']]`,
et au journal `situation : aucune → former (venue de : hero)` puis
`mesure : situation-choisie {situation: 'former', origine: 'hero'}`.

- [ ] **Step 4 : Vérifier l'URL** (critère 3, Review Focus 2)

Ouvrir `http://127.0.0.1:4000/?situation=garder&debug=1` :
Expected : `document.body.dataset.situation === 'garder'`, le repère Garder
en tête, la carte `usage-garder` allumée, au journal `(venue de : url)`.

Ouvrir `/?situation=xyz`, puis `/?situation=FORMER` :
Expected : `document.body.dataset.situation === undefined`, une ligne
`?situation=… inconnue : la page reste neutre`, aucune erreur.

- [ ] **Step 5 : Vérifier fi:aller** (Review Focus 5)

Depuis le haut de page :

```js
document.dispatchEvent(new CustomEvent('fi:aller', {detail: {pas: 1}}));
document.dispatchEvent(new CustomEvent('fi:aller', {detail: {pas: 1}}));
```
Expected, 1 s plus tard : `document.body.dataset.chapitre === 'approche'`
(deux chapitres, pas un). Puis
`document.dispatchEvent(new CustomEvent('fi:aller', {detail: {chapitre: 'contact'}}))`
→ `'contact'`.

- [ ] **Step 6 : Commit** (Corentin tape)

```bash
git add index.html
```

```bash
git commit -m "feat(parcours): regler la page sur la situation du visiteur" -m "Choix depuis le hero, le dock ou ?situation= lu une fois a l'arrivee, ecrit ensuite par replaceState. body[data-situation] allume repere, carte, demos et titre du contact par CSS. fi:aller deplace d'un chapitre ou vers un chapitre nomme." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5 : Les gestes de l'approche et des partenaires

**Files :**
- Modify : `index.html` : script « LE PARCOURS » (section LES GESTES, avant AU DÉMARRAGE), CSS (bloc PARCOURS)

**Interfaces :**
- Consumes : `journal`, `emettre` (tâche 3) ; `#etapeSuivante` (tâche 1) ; `.partenaires`, `.partenaire__logo` (existants) ; `fi:chapitre`.
- Produces : `fi:geste { chapitre: 'approche', geste: 'etape', etape: 1..3 }` et `fi:geste { chapitre: 'partenaires', geste: 'constellation', etape: 1 }` ; classes `.etape--allumee`, `.partenaires.reliee`.

- [ ] **Step 1 : Le code**

Avant la section « AU DÉMARRAGE », ajouter :

```js
      /* ── LES GESTES ────────────────────────────────────────────────────
         Un geste par chapitre, qui se joue et ne se subit pas : aucun ne
         fait défiler la page. Le fondateur, l'offre, les démos et le
         contact sont « joués » par la situation (CSS) ; restent ces deux. */

      /* L'approche : « Étape suivante » allume les trois temps l'un après
         l'autre. Sans JS, le bouton reste `hidden` et tout est allumé. */
      var boiteEtapes = document.querySelector('#approche .etapes');
      var etapes = boiteEtapes ? boiteEtapes.querySelectorAll('.etape') : [];
      var btnEtape = document.getElementById('etapeSuivante');
      if (etapes.length && btnEtape) {
        var allumees = 0;
        var allumer = function (n) {
          allumees = n;
          etapes.forEach(function (el, i) {
            el.classList.toggle('etape--allumee', i < n);
            if (i === n - 1) el.setAttribute('aria-current', 'step');
            else el.removeAttribute('aria-current');
          });
          btnEtape.textContent = n >= etapes.length ? 'Revoir depuis le début' : 'Étape suivante';
        };
        boiteEtapes.setAttribute('data-etape', '');
        allumer(1);
        btnEtape.hidden = false;
        btnEtape.addEventListener('click', function () {
          allumer(allumees >= etapes.length ? 1 : allumees + 1);
          journal('approche : étape', allumees, 'allumée');
          emettre('fi:geste', { chapitre: 'approche', geste: 'etape', etape: allumees });
        });
      }

      /* Les partenaires : au survol ou au toucher, les monogrammes se
         relient en constellation. Le tracé est recalculé à chaque fois, sur
         la position réelle des logos : la grille change de colonnes avec la
         largeur. ⚠️ Au toucher, `pointerleave` arrive dès que le doigt se
         lève : on n'éteint alors qu'en quittant le chapitre. */
      var grillePart = document.querySelector('#partenaires .partenaires');
      if (grillePart) {
        var ciel = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        ciel.setAttribute('class', 'constellation');
        ciel.setAttribute('aria-hidden', 'true');
        grillePart.appendChild(ciel);
        var constellationVue = false;
        var relier = function () {
          var base = grillePart.getBoundingClientRect();
          var d = Array.prototype.map.call(grillePart.querySelectorAll('.partenaire__logo'), function (logo, i) {
            var r = logo.getBoundingClientRect();
            return (i ? 'L' : 'M') + Math.round(r.left - base.left + r.width / 2) + ' ' + Math.round(r.top - base.top + r.height / 2);
          }).join(' ');
          ciel.setAttribute('viewBox', '0 0 ' + Math.round(base.width) + ' ' + Math.round(base.height));
          ciel.innerHTML = '<path pathLength="1" d="' + d + '"></path>';
        };
        var allumerCiel = function () {
          if (grillePart.classList.contains('reliee')) return;
          relier();
          ciel.getBoundingClientRect(); /* force le premier rendu : sans lui, pas de tracé animé */
          grillePart.classList.add('reliee');
          journal('partenaires : constellation reliée');
          if (!constellationVue) {
            constellationVue = true;
            emettre('fi:geste', { chapitre: 'partenaires', geste: 'constellation', etape: 1 });
          }
        };
        var eteindreCiel = function () { grillePart.classList.remove('reliee'); };
        grillePart.addEventListener('pointerenter', allumerCiel);
        grillePart.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') eteindreCiel(); });
        document.addEventListener('fi:chapitre', function (e) { if (e.detail.id !== 'partenaires') eteindreCiel(); });
        window.addEventListener('resize', function () { if (grillePart.classList.contains('reliee')) relier(); });
      }
```

- [ ] **Step 2 : Le CSS**

À la fin du bloc PARCOURS :

```css
    /* ── Les gestes ── */
    /* ⚠️ On éteint les ENFANTS de l'étape, pas l'étape : elle porte déjà
       l'opacité de `.reveal`, et deux règles d'opacité se battraient. */
    .etapes[data-etape] .etape > * { transition: opacity 0.4s ease; }
    .etapes[data-etape] .etape:not(.etape--allumee) > * { opacity: 0.38; }

    .partenaires { position: relative; }
    .partenaire { position: relative; z-index: 1; }
    .constellation {
      position: absolute; inset: 0; width: 100%; height: 100%;
      overflow: visible; pointer-events: none; z-index: 0;
    }
    .constellation path {
      fill: none; stroke: var(--accent-purple); stroke-width: 1.5; stroke-linecap: round;
      stroke-dasharray: 1; stroke-dashoffset: 1; opacity: 0;
      transition: stroke-dashoffset 1.1s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease;
    }
    .partenaires.reliee .constellation path { stroke-dashoffset: 0; opacity: 0.55; }
    .partenaire__logo { transition: opacity 0.4s ease, box-shadow 0.4s ease; }
    .partenaires.reliee .partenaire__logo {
      opacity: 1;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 0 26px rgba(139, 92, 246, 0.5);
    }
```

- [ ] **Step 3 : Vérifier**

`?debug=1`, au chapitre approche, trois clics sur « Étape suivante » :
Expected : journal `approche : étape 2 allumée`, `… 3 …`, puis `… 1 …` ;
le libellé passe à « Revoir depuis le début » à l'étape 3 ; une seule ligne
`mesure : geste {chapitre: 'approche', geste: 'etape'}` (une fois par visite).

Survol de la grille des partenaires :
Expected : `document.querySelector('.constellation path').getAttribute('d')`
contient 5 points (`M` puis 4 `L`), journal `constellation reliée`.

- [ ] **Step 4 : Commit** (Corentin tape)

```bash
git add index.html
```

```bash
git commit -m "feat(parcours): jouer les gestes de l'approche et des partenaires" -m "Etape suivante allume les trois temps de l'approche ; les monogrammes des partenaires se relient en constellation au survol ou au toucher. Chaque geste emet fi:geste." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6 : Le dock (grand écran)

**Files :**
- Modify : `index.html` : balisage du dock après `</footer>`, script « LE PARCOURS » (section LE DOCK, avant AU DÉMARRAGE), CSS (bloc PARCOURS)

**Interfaces :**
- Consumes : `journal`, `emettre`, `CHAPITRES`, `IDS`, `SITUATIONS` (tâche 3) ; `fi:chapitre`, `fi:situation` ; `fi:aller` (tâche 4) ; le délégué de `[data-situation-choix]` (tâche 4) prend en charge les boutons du menu.
- Produces (pour la tâche 7, dans le bloc `if (dock)`) : variables `dock`, `dockPrec`, `dockSuiv`, `dockMenu`, `chapitreDock` ; fonction `fermerMenuSituation()` ; attribut `dock[data-visible="oui|non"]` ; événement interne `fi:dock { visible: boolean }` (utile aussi à la télécommande).

- [ ] **Step 1 : Le balisage**

Entre `</footer>` et le premier `<script>` :

```html
  <!-- ══ LE DOCK : le fil du parcours ═════════════════════════════════════
       Le reflet du dock de la borne STAND : où l'on en est, où l'on va, pour
       quelle situation. ⚠️ `hidden` au départ : sans JavaScript il n'existe
       pas. Centré dans la bande de contenu (règle 7 de Needle5). Les
       emplacements du son et de la télécommande n'existent pas encore :
       aucun bouton mort tant que leur sous-projet n'est pas livré. -->
  <div class="dock" id="dock" data-etat="replie" data-visible="non" hidden>
    <button class="dock__pastille" id="dockPastille" type="button"
            aria-expanded="false" aria-controls="dockPanneau">
      <span class="dock__anneau" aria-hidden="true"></span>
      <span class="dock__centre" id="dockCentre" aria-hidden="true">1</span>
      <span class="sr-only" id="dockPastilleLibelle">Chapitre 1 sur 7, Accueil. Ouvrir le guide</span>
    </button>
    <nav class="dock__panneau" id="dockPanneau" aria-label="Guide de la page">
      <button class="dock__btn" id="dockPrec" type="button" aria-label="Chapitre précédent" title="Chapitre précédent">‹</button>
      <span class="dock__position" id="dockPosition" aria-live="polite">1 / 7 · Accueil</span>
      <button class="dock__btn" id="dockSuiv" type="button" aria-label="Chapitre suivant" title="Chapitre suivant">›</button>
      <span class="dock__sep" aria-hidden="true"></span>
      <div class="dock__situation">
        <button class="dock__choix" id="dockChoix" type="button" aria-expanded="false" aria-controls="dockMenu">
          <span id="dockChoixLibelle">Choisir</span><span aria-hidden="true"> ▾</span>
        </button>
        <ul class="dock__menu" id="dockMenu" hidden>
          <li><button type="button" data-situation-choix="convaincre" data-origine="dock">
            <svg class="pic" aria-hidden="true"><use href="#pic-convaincre"></use></svg>Convaincre un acheteur</button></li>
          <li><button type="button" data-situation-choix="former" data-origine="dock">
            <svg class="pic" aria-hidden="true"><use href="#pic-former"></use></svg>Former un nouvel arrivant</button></li>
          <li><button type="button" data-situation-choix="garder" data-origine="dock">
            <svg class="pic" aria-hidden="true"><use href="#pic-garder"></use></svg>Garder un savoir-faire</button></li>
          <li><button type="button" data-situation-choix="aucune" data-origine="dock">Aucune</button></li>
        </ul>
      </div>
      <button class="dock__fermer" id="dockFermer" type="button">Fermer</button>
    </nav>
  </div>
```

- [ ] **Step 2 : Le code**

Avant la section « AU DÉMARRAGE » :

```js
      /* ── LE DOCK ───────────────────────────────────────────────────────
         Il ne calcule rien : il AFFICHE le chapitre du premier script et
         la situation, et ses flèches passent par fi:aller comme le fera la
         télécommande. Invisible sur le hero (qui porte déjà le choix) et
         quand le pied de page est à l'écran (il couvrirait le contact). */
      var dock = document.getElementById('dock');
      if (dock) {
        var dockPrec = document.getElementById('dockPrec');
        var dockSuiv = document.getElementById('dockSuiv');
        var dockPosition = document.getElementById('dockPosition');
        var dockChoix = document.getElementById('dockChoix');
        var dockChoixLibelle = document.getElementById('dockChoixLibelle');
        var dockMenu = document.getElementById('dockMenu');
        /* ⚠️ Lu sur <body> et non attendu en événement : à l'arrivée par
           `/#demos`, le premier `fi:chapitre` est parti avant ce script. */
        var chapitreDock = document.body.getAttribute('data-chapitre') || 'top';
        var footerVu = false;

        var fermerMenuSituation = function () {
          dockMenu.hidden = true;
          dockChoix.setAttribute('aria-expanded', 'false');
        };
        var majFil = function () {
          var i = Math.max(0, IDS.indexOf(chapitreDock));
          dockPosition.textContent = (i + 1) + ' / ' + IDS.length + ' · ' + CHAPITRES[i].titre;
          dockPrec.disabled = i === 0;
          dockSuiv.disabled = i === IDS.length - 1;
        };
        var majVisibilite = function () {
          var visible = chapitreDock !== 'top' && !footerVu;
          if ((dock.getAttribute('data-visible') === 'oui') === visible) return;
          dock.setAttribute('data-visible', visible ? 'oui' : 'non');
          /* `inert` : un dock effacé ne doit pas voler le focus du clavier. */
          dock.inert = !visible;
          if (!visible) fermerMenuSituation();
          journal('dock', visible ? 'visible' : 'effacé', '(' + chapitreDock + (footerVu ? ', pied de page à l\'écran' : '') + ')');
          emettre('fi:dock', { visible: visible });
        };

        dockPrec.addEventListener('click', function () { emettre('fi:aller', { pas: -1 }); });
        dockSuiv.addEventListener('click', function () { emettre('fi:aller', { pas: 1 }); });
        dockChoix.addEventListener('click', function () {
          var ouvre = dockMenu.hidden;
          dockMenu.hidden = !ouvre;
          dockChoix.setAttribute('aria-expanded', ouvre ? 'true' : 'false');
          if (ouvre) dockMenu.querySelector('button').focus();
        });
        document.addEventListener('click', function (e) {
          if (!dockMenu.hidden && !e.target.closest('.dock__situation')) fermerMenuSituation();
        });
        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape' && !dockMenu.hidden) { fermerMenuSituation(); dockChoix.focus(); }
        });
        document.addEventListener('fi:situation', function (e) {
          dockChoixLibelle.textContent = e.detail.id ? SITUATIONS[e.detail.id] : 'Choisir';
          fermerMenuSituation();
        });
        document.addEventListener('fi:chapitre', function (e) {
          chapitreDock = e.detail.id;
          majFil();
          majVisibilite();
        });
        var piedDePage = document.querySelector('.footer');
        if (piedDePage && 'IntersectionObserver' in window) {
          new IntersectionObserver(function (entrees) {
            footerVu = entrees[0].isIntersecting;
            majVisibilite();
          }).observe(piedDePage);
        }

        dock.hidden = false;
        dock.inert = true;
        majFil();
        majVisibilite();
      }
```

- [ ] **Step 3 : Le CSS**

À la fin du bloc PARCOURS :

```css
    /* ── Le dock ── */
    .dock {
      position: fixed;
      left: 0; right: 0;
      bottom: calc(1rem + env(safe-area-inset-bottom));
      margin-inline: auto;
      width: fit-content;
      max-width: min(100% - 2rem, 1100px);
      z-index: 90;      /* sous le bandeau (102) et son menu plein écran (150) */
      transition: opacity 0.3s ease, transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .dock[data-visible="non"] { opacity: 0; transform: translateY(calc(100% + 1.5rem)); pointer-events: none; }
    .dock__panneau {
      display: flex; align-items: center; gap: 0.35rem;
      padding: 0.35rem 0.5rem;
      border-radius: 999px;
      background: rgba(10, 11, 20, 0.72);
      border: 1px solid var(--glass-border);
      backdrop-filter: blur(14px) saturate(150%);
      -webkit-backdrop-filter: blur(14px) saturate(150%);
      box-shadow: 0 16px 40px -16px rgba(0, 0, 0, 0.7);
    }
    .dock button { font: inherit; color: var(--text-main); background: none; border: 0; cursor: pointer; }
    .dock :focus-visible { outline: 2px solid var(--accent-blue); outline-offset: 2px; }
    .dock__btn { width: 44px; height: 44px; border-radius: 50%; font-size: 1.4rem; line-height: 1; }
    .dock__btn:hover:not(:disabled),
    .dock__choix:hover { background: var(--glass-bg-hover); }
    .dock__btn:disabled { opacity: 0.3; cursor: default; }
    .dock__position { min-width: 11.5rem; text-align: center; font-size: 0.9rem; font-weight: 600; white-space: nowrap; }
    .dock__sep { width: 1px; height: 24px; margin-inline: 0.25rem; background: var(--glass-border-highlight); }
    .dock__situation { position: relative; }
    .dock__choix { min-height: 44px; padding: 0 1rem; border-radius: 999px; font-size: 0.9rem; font-weight: 600; white-space: nowrap; }
    /* Règle 9 : les boutons du menu partagent la largeur de la pile. */
    .dock__menu {
      position: absolute; bottom: calc(100% + 0.6rem); left: 50%; transform: translateX(-50%);
      list-style: none; margin: 0; padding: 0.4rem; min-width: 15rem;
      display: flex; flex-direction: column; gap: 0.3rem;
      border-radius: 16px; background: rgba(10, 11, 20, 0.92);
      border: 1px solid var(--glass-border); box-shadow: 0 16px 40px -16px rgba(0, 0, 0, 0.7);
    }
    .dock__menu[hidden] { display: none; }
    .dock__menu button {
      width: 100%; min-height: 44px; padding: 0 0.9rem; border-radius: 10px;
      display: flex; align-items: center; gap: 0.6rem; text-align: left; font-size: 0.9rem;
    }
    .dock__menu button:hover,
    .dock__menu button[aria-current="true"] { background: var(--glass-bg-hover); }
    .dock__pastille,
    .dock__fermer { display: none; }
```

- [ ] **Step 4 : Vérifier** (critère 1, Review Focus 1)

À 1 440 px, ouvrir `http://127.0.0.1:4000/?debug=1#demos` (le `?` avant le `#`).

```js
[document.getElementById('dockPosition').textContent, document.getElementById('dock').dataset.visible]
```
Expected : `['5 / 7 · Ça tourne déjà', 'oui']`.

Clic sur « › » : `6 / 7 · Partenaires`. Clic sur « Choisir », puis
« Garder un savoir-faire » : le menu se ferme, le bouton dit « Garder »,
journal `(venue de : dock)`. `Échap` avec le menu ouvert le referme et
rend le focus à « Choisir ». En haut de page et en bas (pied de page à
l'écran) : `dataset.visible === 'non'`.

- [ ] **Step 5 : Commit** (Corentin tape)

```bash
git add index.html
```

```bash
git commit -m "feat(parcours): ajouter le dock du parcours" -m "Dock centre en bas : fil precedent et suivant par fi:aller, position et titre du chapitre, menu de situation. Absent sans JavaScript, efface sur le hero et au pied de page, inert quand il est cache." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7 : La pastille (téléphone)

Sous 768 px, le dock se replie en une pastille de 56 px qui donne envie
d'être touchée (rôle `affordance`), avec trois effets ponctuels.

**Files :**
- Modify : `index.html` : script « LE PARCOURS » (fin du bloc `if (dock) { … }`), CSS (bloc PARCOURS et bloc `prefers-reduced-motion`)

**Interfaces :**
- Consumes (tâche 6) : `dock`, `dockPrec`, `dockSuiv`, `dockMenu`, `chapitreDock`, `fermerMenuSituation()`, `fi:dock` ; (tâche 3) `mesurerUneFois`, `MESURES.guideOuvert`, `sobre`, `SITUATIONS`, `CHAPITRES`, `IDS`.
- Produces : `dock[data-etat="replie|deplie"]`, variable CSS `--progression` (0 à 1) sur `.dock`, classes ponctuelles `dock--entree`, `dock--bascule`, `dock--invite` ; mesure `guide-ouvert` une fois par visite.

- [ ] **Step 1 : Le code**

À la fin du bloc `if (dock) { … }`, juste après `majVisibilite();` :

```js
        /* ── La pastille (téléphone) ─────────────────────────────────────
           Sous 768 px, le dock replié tient en 56 px : un anneau qui se
           remplit avec la lecture, le numéro du chapitre (ou le
           pictogramme de la situation) au centre.
           Trois effets, un par intention, AUCUN en boucle : un appel qui ne
           s'arrête jamais devient du bruit, et fatigue en rendez-vous.
             entrée  : « je suis là »       (première apparition)
             bascule : « vous avancez »     (changement de chapitre)
             invite  : « touchez-moi »      (une fois par visite) */
        var mobile = window.matchMedia('(max-width: 767px)');
        var pastille = document.getElementById('dockPastille');
        var centre = document.getElementById('dockCentre');
        var pastilleLibelle = document.getElementById('dockPastilleLibelle');
        var dejaApparu = false;
        var guideOuvert = false;
        var inviteFaite = false;
        var chapitresSansOuvrir = 0;
        var ignorerDefilementJusqua = 0;

        /* Rejoue une classe d'animation, même si elle tournait déjà. */
        var jouer = function (classe, duree) {
          if (sobre) return;
          dock.classList.remove(classe);
          void dock.offsetWidth;
          dock.classList.add(classe);
          clearTimeout(jouer[classe]);
          jouer[classe] = setTimeout(function () { dock.classList.remove(classe); }, duree);
        };
        var majPastille = function () {
          var i = Math.max(0, IDS.indexOf(chapitreDock));
          var s = document.body.getAttribute('data-situation');
          /* `s` vient de SITUATIONS (liste fermée) : l'innerHTML est sûr. */
          centre.innerHTML = s && SITUATIONS[s]
            ? '<svg class="pic" aria-hidden="true"><use href="#pic-' + s + '"></use></svg>'
            : String(i + 1);
          pastilleLibelle.textContent = 'Chapitre ' + (i + 1) + ' sur ' + IDS.length + ', ' + CHAPITRES[i].titre
            + (s ? ', situation ' + SITUATIONS[s] : '') + '. Ouvrir le guide';
        };
        var deplier = function () {
          dock.setAttribute('data-etat', 'deplie');
          pastille.setAttribute('aria-expanded', 'true');
          ignorerDefilementJusqua = performance.now() + 400;
          journal('dock déplié');
          if (!guideOuvert) { guideOuvert = true; mesurerUneFois('guide', MESURES.guideOuvert); }
          (dockSuiv.disabled ? dockPrec : dockSuiv).focus();
        };
        var replier = function (raison) {
          if (dock.getAttribute('data-etat') !== 'deplie') return;
          dock.setAttribute('data-etat', 'replie');
          pastille.setAttribute('aria-expanded', 'false');
          fermerMenuSituation();
          journal('dock replié :', raison);
        };

        pastille.addEventListener('click', deplier);
        document.getElementById('dockFermer').addEventListener('click', function () {
          replier('bouton Fermer');
          pastille.focus();
        });
        /* Les flèches font défiler en douceur : ce défilement-là ne doit
           pas replier le dock qu'on est en train d'utiliser. */
        [dockPrec, dockSuiv].forEach(function (b) {
          b.addEventListener('click', function () { ignorerDefilementJusqua = performance.now() + 1200; });
        });
        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape' && dock.getAttribute('data-etat') === 'deplie') {
            replier('Échap');
            pastille.focus();
          }
        });
        mobile.addEventListener('change', function () { replier('passage en grand écran'); });

        /* L'anneau : une information, pas une décoration. Il reste à jour
           en mouvement réduit. */
        var rafProgression = 0;
        var majProgression = function () {
          rafProgression = 0;
          var max = document.documentElement.scrollHeight - window.innerHeight;
          var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
          dock.style.setProperty('--progression', p.toFixed(3));
        };
        window.addEventListener('scroll', function () {
          if (!rafProgression) rafProgression = requestAnimationFrame(majProgression);
          if (performance.now() > ignorerDefilementJusqua) replier('défilement');
        }, { passive: true });

        document.addEventListener('fi:dock', function (e) {
          if (!e.detail.visible) { replier('dock effacé'); return; }
          if (!dejaApparu) {
            dejaApparu = true;
            if (mobile.matches) { jouer('dock--entree', 1300); journal('pastille : première apparition'); }
          }
        });
        document.addEventListener('fi:chapitre', function () {
          majPastille();
          if (!mobile.matches || dock.getAttribute('data-visible') !== 'oui') return;
          if (!dock.classList.contains('dock--entree')) jouer('dock--bascule', 650);
          if (!guideOuvert && !inviteFaite && ++chapitresSansOuvrir >= 2) {
            inviteFaite = true;
            setTimeout(function () { jouer('dock--invite', 750); }, 700);
            journal('pastille : invitation (une fois par visite)');
          }
        });
        document.addEventListener('fi:situation', function () {
          majPastille();
          replier('situation choisie');
        });

        majPastille();
        majProgression();
```

- [ ] **Step 2 : Le CSS**

À la fin du bloc PARCOURS :

```css
    /* ── La pastille (< 768 px) : rôle `affordance` ── */
    @media (max-width: 767px) {
      .dock { bottom: calc(0.75rem + env(safe-area-inset-bottom)); }
      .dock__pastille {
        display: grid; place-items: center; position: relative;
        width: 56px; height: 56px; padding: 0; border-radius: 50%;
        background: rgba(10, 11, 20, 0.82);
        box-shadow: 0 10px 28px -10px rgba(0, 0, 0, 0.8), 0 0 0 1px var(--glass-border);
        -webkit-tap-highlight-color: transparent;
      }
      /* L'anneau : un dégradé conique rempli jusqu'à la progression, évidé
         au centre par un masque radial. */
      .dock__anneau {
        position: absolute; inset: 0; border-radius: 50%;
        background: conic-gradient(var(--accent-blue) 0deg,
                    var(--accent-pink) calc(var(--progression, 0) * 360deg),
                    rgba(255, 255, 255, 0.12) 0deg);
        -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 3px));
        mask: radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 3px));
      }
      .dock__centre { position: relative; font-size: 1.05rem; font-weight: 700; }
      .dock__centre .pic { width: 22px; height: 22px; }
      .dock__sep { display: none; }

      .dock[data-etat="replie"] .dock__panneau { display: none; }
      .dock[data-etat="deplie"] { left: 16px; right: 16px; width: auto; max-width: none; }
      .dock[data-etat="deplie"] .dock__pastille { display: none; }
      .dock[data-etat="deplie"] .dock__panneau {
        display: grid;
        grid-template-columns: 44px 1fr auto 44px;
        grid-template-areas: "prec pos pos suiv" "sit sit fermer fermer";
        gap: 0.25rem; padding: 0.5rem; border-radius: 20px;
        transform-origin: 50% 100%;
        animation: dockDeplie 0.3s cubic-bezier(0.22, 1, 0.36, 1);
      }
      #dockPrec { grid-area: prec; }
      #dockPosition { grid-area: pos; min-width: 0; }
      #dockSuiv { grid-area: suiv; }
      .dock__situation { grid-area: sit; }
      .dock__choix { width: 100%; }
      .dock__menu { left: 0; transform: none; min-width: 0; width: min(18rem, calc(100vw - 48px)); }
      .dock[data-etat="deplie"] .dock__fermer {
        grid-area: fermer; display: inline-flex; align-items: center; justify-content: center;
        min-height: 44px; padding: 0 1rem; border-radius: 999px; font-size: 0.9rem; color: var(--text-muted);
      }

      /* Les trois effets. ::before = le halo, ::after = le reflet. */
      .dock__pastille::before,
      .dock__pastille::after { content: ""; position: absolute; border-radius: 50%; pointer-events: none; opacity: 0; }
      .dock__pastille::before { inset: -6px; border: 2px solid var(--accent-purple); }
      .dock__pastille::after {
        inset: 0;
        background: linear-gradient(115deg, transparent 35%, rgba(255, 255, 255, 0.55) 50%, transparent 65%);
        background-size: 250% 100%;
      }
      .dock--entree .dock__pastille { animation: pastilleEntree 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
      .dock--entree .dock__pastille::after { animation: pastilleReflet 0.9s 0.35s ease-out both; }
      .dock--bascule .dock__centre { animation: centreBascule 0.45s cubic-bezier(0.22, 1, 0.36, 1); }
      .dock--bascule .dock__pastille::before { animation: pastilleHalo 0.6s ease-out; }
      .dock--invite .dock__pastille { animation: pastilleInvite 0.7s cubic-bezier(0.34, 1.56, 0.64, 1); }
    }
    @keyframes pastilleEntree { from { transform: translateY(140%) scale(0.6); } to { transform: none; } }
    @keyframes pastilleReflet {
      0% { opacity: 1; background-position: 120% 0; }
      80% { opacity: 1; }
      100% { opacity: 0; background-position: -30% 0; }
    }
    @keyframes centreBascule { from { transform: rotateX(90deg); opacity: 0; } to { transform: none; opacity: 1; } }
    @keyframes pastilleHalo { from { opacity: 0.9; transform: scale(0.85); } to { opacity: 0; transform: scale(1.35); } }
    @keyframes pastilleInvite {
      0%, 100% { transform: none; }
      30% { transform: translateY(-10px); }
      55% { transform: translateY(0); }
      75% { transform: translateY(-4px); }
    }
    @keyframes dockDeplie { from { opacity: 0; transform: scale(0.4, 0.3); } to { opacity: 1; transform: none; } }
```

Puis, DANS le bloc `@media (prefers-reduced-motion: reduce)` existant,
juste avant `* { transition-duration: 0.01ms !important; }` :

```css
      /* Le parcours : états finaux, aucun mouvement. L'anneau reste à jour. */
      .dock,
      .dock__panneau,
      .dock__pastille,
      .dock__pastille::before,
      .dock__pastille::after,
      .dock__centre,
      .situation-btn,
      .constellation path { animation: none !important; transform: none; }
```

- [ ] **Step 3 : Vérifier** (critères 4 et 6)

`resize_window` preset `mobile` (375 × 812), `?debug=1`, descendre au
chapitre fondateur :

```js
const p = document.getElementById('dockPastille').getBoundingClientRect();
[Math.round(p.width), Math.round(p.height), document.getElementById('dock').dataset.etat,
 document.documentElement.scrollWidth - innerWidth]
```
Expected : `[56, 56, 'replie', 0]` ; journal `pastille : première apparition`.

Descendre de deux chapitres sans toucher la pastille : journal
`pastille : invitation (une fois par visite)`, une seule fois même en
remontant et redescendant. Toucher la pastille : `data-etat` vaut
`deplie`, journal `mesure : guide-ouvert` ; « › » avance sans replier ;
un défilement au doigt replie. En bas de page, le pied de page est
entièrement visible (dock effacé).

Mouvement réduit (`colorScheme` inchangé, DevTools › Rendering ›
prefers-reduced-motion, par Corentin) : aucune animation, l'anneau suit
toujours la lecture.

Remettre `resize_window` preset `desktop`.

- [ ] **Step 4 : Commit** (Corentin tape)

```bash
git add index.html
```

```bash
git commit -m "feat(parcours): replier le dock en pastille sur telephone" -m "Sous 768 px, pastille de 56 px avec anneau de progression et numero ou pictogramme de la situation. Trois effets ponctuels (entree, bascule, invitation une fois par visite), aucun en boucle, tous coupes en mouvement reduit. Mesure guide-ouvert." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8 : Vérification finale et PR

**Files :**
- Create : `.github/pr-parcours.md` (corps de la PR, écrit par l'assistant)

- [ ] **Step 1 : Les dix critères de la spec (§ 11)**

Rejouer les vérifications des tâches 2 à 7, puis :

```js
// 5. Clavier : Tab depuis le haut atteint les 3 boutons de situation, puis
//    « Étape suivante », puis, une fois le dock visible, ses contrôles.
// 8. Le contrat
['fi:chapitre', 'fi:situation', 'fi:geste'].forEach(n => document.addEventListener(n, e => console.log(n, e.detail)));
document.dispatchEvent(new CustomEvent('fi:aller', {detail: {pas: 1}}));
// 9. Les titres
[...document.querySelectorAll('h1, h2, h3')].filter(h => /\.\s*$/.test(h.textContent)).length
```
Expected : `fi:chapitre {…}` après le `fi:aller`, puis `0` titre à point final.

- [ ] **Step 2 : Le poids**

Run : `wc -c index.html`
Expected : moins de `120636` (105 276 + 15 360). Si le poids dépasse à
cause des commentaires pédagogiques, le dire à Corentin avec le chiffre,
sans les supprimer : c'est à lui d'arbitrer entre le budget et la règle
« le code n'est jamais compressé ».

- [ ] **Step 3 : Relecture commerciale**

Relire la page comme un prospect pressé, contre `VENTE.md` : chaque
promesse visible a sa ligne dans la fiche (aucun support de formation
cité, captation « avec vous, ou avec un partenaire », aucun prix).

- [ ] **Step 4 : Le corps de la PR**

L'assistant écrit `.github/pr-parcours.md` : le résumé (axe, dock,
pastille, contrat, mesure), les vérifications chiffrées des étapes 1 et 2,
ce qui reste à valider par Corentin (rendu, mouvement réduit, sans JS), et
la dernière ligne « 🤖 Generated with [Claude Code](https://claude.com/claude-code) ».

```bash
git add .github/pr-parcours.md
```

```bash
git commit -m "docs(parcours): rediger la description de la PR" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

- [ ] **Step 5 : Pousser et ouvrir la PR** (Corentin tape)

```bash
git push -u origin feat/parcours-interactif
```

```bash
gh pr create --base feat/accueil-theme-sombre --head feat/parcours-interactif --title "feat(parcours): parcours interactif de l'accueil" --body-file .github/pr-parcours.md
```

📌 La PR vise `feat/accueil-theme-sombre` parce que la branche est empilée
sur la PR #1. Quand la #1 sera fusionnée et sa branche supprimée, GitHub
reciblera celle-ci sur `main` tout seul.

---

## Après ce plan

- Sous-projet 2, le son : écoute `fi:chapitre` et `fi:geste`, emplacement
  réservé dans le dock.
- Sous-projet 3, la télécommande : `/telecommande/`, protocole du Salon,
  `OPEN_MODAL { navItemId }` → `fi:aller { chapitre }`,
  `PRESENTATION_NEXT_SLIDE` → `fi:aller { pas: 1 }`. Le visiteur la tient,
  Corentin tient l'écran : elle se comprend sans explication, sans PIN.
- Sous-projet 4, la passe `veilleur` SEO/GEO (dont la meta description,
  qui parle encore de secteurs).
