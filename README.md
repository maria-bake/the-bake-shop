# _thebakeshop._ — website

A one-page site for Mariya's home bakery in Howly, Barpeta, Assam.
Plain HTML, CSS and JavaScript. No build step, no framework, no server code.

```
index.html            the whole page
assets/css/style.css  all the styling (written mobile-first)
assets/js/data.js     ← prices, flavours, gallery. EDIT THIS ONE.
assets/js/app.js      page behaviour
assets/img/           every photo, in 4 sizes each
assets/decor/         the blossoms and pearls in the background
assets/logo.png       her Instagram logo
Cakes/                the original untouched photos she sent
```

## Changing prices

Open `assets/js/data.js`. Everything the page shows comes from that one file —
change a number there and it updates in the price cards, the order form and the
message that gets sent. Nothing else needs touching.

```js
half: price: { vanilla: 530, butterscotch: 580, ... }
```

## Where it lives

The site is published from the `main` branch of
[maria-bake/the-bake-shop](https://github.com/maria-bake/the-bake-shop) and
served at:

**https://maria-bake.github.io/the-bake-shop/**

To publish a change:

```bash
git add -A && git commit -m "what changed" && git push
```

GitHub rebuilds the page within a minute or so.

## How the cake photo reaches Mariya

WhatsApp cannot be handed an image through a plain link, so the page uses two
routes and picks whatever the visitor's device supports:

- **On a phone — "Send with the photo".** This uses the phone's own share
  sheet, so WhatsApp or Instagram receives the **actual JPEG** along with the
  written order. The button only appears once a cake has been picked from the
  gallery and only on browsers that support it (most phones do, most desktops
  do not).
- **Everywhere else — a link to the photo inside the message.** The order text
  ends with `Photo of the cake I mean: https://.../cake-pink-ribbon.jpg` and
  WhatsApp turns that into a thumbnail she can tap.

**The link route only works once the site is online.** While you are testing
from your own computer the address is `localhost`, which means nothing on
Mariya's phone. Deploy first, then test the photo.

## Running it locally

```bash
python3 -m http.server 8765
```

Then open `http://localhost:8765`. Opening `index.html` by double-clicking also
works, but the photo link is left out of the message in that case.

## Notes

- There is no payment on the site and no checkout. The form only writes the
  order out; price and payment are settled in the chat.
- Mariya does not deliver — orders are collected, and the page says so.
- The images in `Cakes/` are the originals. `assets/img/` holds the resized
  copies the page actually loads.
