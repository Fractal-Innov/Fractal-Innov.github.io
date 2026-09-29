#!/usr/bin/env bash
# ══ LES BOUCLES : ENCODER DES PLANS DÉJÀ COUPÉS ═══════════════════════
# 29/09/2026 · docs/visuels/2026-09-28-cahier-des-captures.md § 2
#
# Les plans sont coupés à la main, un fichier par boucle, nommé comme
# l'aperçu : stand.mov, midipile.mov, rayon-x.mov, agorapod.mov,
# moulage.mov, et hero.mov pour le fond du hero.
#
# Usage (depuis la racine du site) :
#   outils/encoder-boucles.sh ~/Captures/stand.mov ~/Captures/hero.mov …
#   outils/encoder-boucles.sh ~/Captures/*.mov
#
# Sorties :
#   hero  › media/accueil/hero/boucle.{webm,mp4,webp}  1280 px, poster compris
#   autre › media/accueil/boucles/<nom>.{webm,mp4}      960 px (bureau)
#           media/accueil/boucles/<nom>-mobile.{webm,mp4} 640 px (téléphone)
#   Pas de poster pour les aperçus : c'est l'image déjà en place.
#
# Réglages (cibles du cahier) : 30 i/s, sans piste son, H.264 démarrable
# avant la fin du téléchargement (+faststart), VP9 à côté.
#   bureau    960 px  crf 28  plafond 900 kb/s  › ~0,7 à 1 Mo pour 7 s
#   téléphone 640 px  crf 30  plafond 400 kb/s  › ~250 à 400 Ko
#   hero     1280 px  crf 27  plafond 1200 kb/s › WebM sous 2 Mo
# ══════════════════════════════════════════════════════════════════════
set -euo pipefail

if [ "$#" -eq 0 ]; then
  echo "usage : outils/encoder-boucles.sh <plan.mov> [<plan.mov> …]" >&2; exit 1
fi
command -v ffmpeg >/dev/null || { echo "ffmpeg absent : brew install ffmpeg" >&2; exit 1; }

# Une variante : <entrée> <largeur> <crf> <plafond kb/s> <sortie sans extension>
# -nostdin : ffmpeg ne lit pas le terminal (sûr dans une boucle).
encoder() {
  local largeur="$2" crf="$3" plafond="$4" sortie="$5"
  # `scale` : jamais agrandir, hauteur paire (libx264 refuse l'impair).
  local filtre="scale='min($largeur,iw)':-2,fps=30"
  echo "  → $(basename "$sortie") · ${largeur} px · crf $crf · ${plafond} kb/s"
  ffmpeg -nostdin -loglevel error -y -i "$1" -an -vf "$filtre" \
    -c:v libx264 -profile:v high -preset slow -crf "$crf" \
    -maxrate "${plafond}k" -bufsize "$((plafond * 2))k" -pix_fmt yuv420p \
    -movflags +faststart "$sortie.mp4"
  # VP9 en qualité contrainte : -crf avec -b:v comme plafond.
  ffmpeg -nostdin -loglevel error -y -i "$1" -an -vf "$filtre" \
    -c:v libvpx-vp9 -crf $((crf + 8)) -b:v "${plafond}k" -row-mt 1 -g 60 \
    "$sortie.webm"
}

mkdir -p media/accueil/boucles media/accueil/hero
for plan in "$@"; do
  [ -f "$plan" ] || { echo "introuvable : $plan" >&2; continue; }
  nom="$(basename "${plan%.*}")"
  echo "▸ $nom"
  if [ "$nom" = "hero" ]; then
    encoder "$plan" 1280 27 1200 media/accueil/hero/boucle
    ffmpeg -nostdin -loglevel error -y -i "$plan" -frames:v 1 -vf "scale='min(1280,iw)':-2" media/accueil/hero/boucle.png
    if command -v cwebp >/dev/null; then
      cwebp -quiet -q 82 media/accueil/hero/boucle.png -o media/accueil/hero/boucle.webp && rm -f media/accueil/hero/boucle.png
    else
      echo "  (cwebp absent : brew install webp, le poster reste en PNG)"
    fi
  else
    encoder "$plan" 960 28 900 "media/accueil/boucles/$nom"
    encoder "$plan" 640 30 400 "media/accueil/boucles/$nom-mobile"
  fi
done

echo "✓ poids :"
ls -lh media/accueil/boucles media/accueil/hero 2>/dev/null | awk 'NF>5 {print "  " $5 "  " $9}'
