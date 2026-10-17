#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
/Library/TeX/texbin/latexmk -pdf -interaction=nonstopmode -halt-on-error northvalley-capability-statement.tex
cp northvalley-capability-statement.pdf ../public/northvalley-capability-statement.pdf
pdfinfo ../public/northvalley-capability-statement.pdf | grep Pages
