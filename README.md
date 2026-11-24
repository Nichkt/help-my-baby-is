# help! My baby is:

A support site for parents of newborns and toddlers. Tap the situation ("running a fever", "not sleeping", "hit their head") and get plain guidance on what's normal, what to try, when to call the doctor, and when to call 911.

## Editing tiles

All tile content lives in `data.js`. Each tile has:

- `id`: short unique slug, also the page link (`#fever`)
- `cat`: one of the keys in `CATS`
- `label`: finishes the sentence "My baby is ..."
- `keys`: extra search words
- `normal`: what's usually going on
- `tryList`, `callDoc`, `now`: lists for "Things to try", "Call the doctor if", and "Call 911 if" (leave `now` empty for non-urgent topics)

## Before launch

The guidance follows AAP and CDC thresholds but has not been reviewed by a pediatrician yet. Get every page reviewed before promoting the site.

## Running locally

Open `index.html` in a browser, or run `python3 -m http.server` in this folder.
