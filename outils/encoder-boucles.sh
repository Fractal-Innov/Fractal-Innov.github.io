#!/usr/bin/env bash
# ══ LES BOUCLES : UNE SESSION, TOUS LES FICHIERS ══════════════════════
# 29/09/2026 · docs/visuels/2026-09-28-cahier-des-captures.md § 2 et 3
#
# Une seule session de tournage (le master), découpée par un fichier texte :
# une ligne par boucle, « nom début durée » (secondes ou hh:mm:ss).
#
#   # decoupe.txt
#   hero      00:00:05  16
#   stand     00:00:30  7
#   midipile  00:01:02  7
#   rayon-x   00:01:40  7
#   agorapod  00:02:15  7
#   moulage   00:02:50  7
#
# Usage (depuis la racine du site) :
#   outils/encoder-boucles.sh master.mov decoupe.txt
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
#   hero     1280 px  crf 27  plafond 1200 kb/s
# ══════════════════════════════════════════════════════════════════════
set -euo pipefail

master="${1:-}"; decoupe="${2:-}"
if [ -z "$master" ] || [ -z "$decoupe" ] || [ ! -f "$master" ] || [ ! -f "$decoupe" ]; then
  echo "usage : outils/encoder-boucles.sh <master.mov> <decoupe.txt>" >&2; exit 1
fi
command -v ffmpeg >/dev/null || { echo "ffmpeg absent : brew install ffmpeg" >&2; exit 1; }

# -nostdin : sans lui, ffmpeg lit le fichier de découpe à la place de
# la boucle `while read` et avale des lignes.
# Une variante : <entrée> <début> <durée> <largeur> <crf> <plafond kb/s> <sortie sans extension>
encoder() {
  local debut="$2" duree="$3" largeur="$4" crf="$5" plafond="$6" sortie="$7"
  # `scale` : jamais agrandir, hauteur paire (libx264 refuse l'impair).
  local filtre="scale='min($largeur,iw)':-2,fps=30"
  echo "  → $(basename "$sortie") · ${largeur} px · crf $crf · ${plafond} kb/s"
  ffmpeg -nostdin -loglevel error -y -ss "$debut" -t "$duree" -i "$1" -an -vf "$filtre" \
    -c:v libx264 -profile:v high -preset slow -crf "$crf" \
    -maxrate "${plafond}k" -bufsize "$((plafond * 2))k" -pix_fmt yuv420p \
    -movflags +faststart "$sortie.mp4"
  ffmpeg -nostdin -loglevel error -y -ss "$debut" -t "$duree" -i "$1" -an -vf "$filtre" \
    -c:v libvpx-vp9 -crf $((crf + 8)) -b:v "${plafond}k" -row-mt 1 -g 60 \
    "$sortie.webm"
}

mkdir -p media/accueil/boucles media/accueil/hero
while read -r nom debut duree _; do
  case "$nom" in ''|\#*) continue ;; esac
  echo "▸ $nom (de $debut, $duree s)"
  if [ "$nom" = "hero" ]; then
    encoder "$master" "$debut" "$duree" 1280 27 1200 media/accueil/hero/boucle
    ffmpeg -nostdin -loglevel error -y -ss "$debut" -i "$master" -frames:v 1 -vf "scale='min(1280,iw)':-2" media/accueil/hero/boucle.png
    if command -v cwebp >/dev/null; then
      cwebp -quiet -q 82 media/accueil/hero/boucle.png -o media/accueil/hero/boucle.webp && rm -f media/accueil/hero/boucle.png
    else
      echo "  (cwebp absent : brew install webp, le poster reste en PNG)"
    fi
  else
    encoder "$master" "$debut" "$duree" 960 28 900 "media/accueil/boucles/$nom"
    encoder "$master" "$debut" "$duree" 640 30 400 "media/accueil/boucles/$nom-mobile"
  fi
done < "$decoupe"

echo "✓ poids :"
ls -lh media/accueil/boucles media/accueil/hero 2>/dev/null | awk 'NF>5 {print "  " $5 "  " $9}'
