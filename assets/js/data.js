/* ==========================================================================
   _thebakeshop._  —  catalogue, prices and contact details
   --------------------------------------------------------------------------
   THIS IS THE ONLY FILE YOU NEED TO EDIT TO CHANGE PRICES.
   Change a number here and it updates everywhere on the page.
   ========================================================================== */

const SHOP = {

  /* ---------- who ---------- */
  brand:       '_thebakeshop._',
  tagline:     'Sweet & Delicious',
  baker:       'Mariya',
  place:       'Howly, Barpeta · Assam',
  currency:    '₹',

  /* ---------- where to order ---------- */
  instagram:   '_thebakeshop._',
  profileUrl:  'https://www.instagram.com/_thebakeshop._/',
  dmUrl:       'https://ig.me/m/_thebakeshop._',

  whatsapp:        '919864848384',        // digits only, country code first
  whatsappDisplay: '+91 98648 48384',

  /* WhatsApp accepts the message as a URL parameter, so that route arrives
     already typed out. Instagram has no such parameter, so there the text is
     copied to the clipboard and the DM window is opened to paste into. */
  waUrl(text) {
    return 'https://wa.me/' + this.whatsapp + '?text=' + encodeURIComponent(text);
  },

  /* ---------- the flavour list ---------- */
  flavours: [
    { id: 'vanilla',      label: 'Vanilla',      note: 'soft and classic'     },
    { id: 'butterscotch', label: 'Butterscotch', note: 'praline crunch'       },
    { id: 'strawberry',   label: 'Strawberry',   note: 'fresh and fruity'     },
    { id: 'mango',        label: 'Mango',        note: 'sweet seasonal mango' },
    { id: 'chocolate',    label: 'Chocolate',    note: 'deep cocoa'           },
    { id: 'biscoff',      label: 'Biscoff',      note: 'caramel biscuit'      }
  ],

  /* ---------- size × flavour price matrix ---------- */
  sizes: [
    {
      id: 'bento', label: 'Bento', sub: 'Single-serve box',
      serves: 'Serves 1–2',
      img: 'bento-rose',
      blurb: 'A little cake in its own box. The one people send as a surprise.',
      price: { vanilla: 250, butterscotch: 250, strawberry: 250, mango: 250, chocolate: 280, biscoff: 300 }
    },
    {
      id: 'half', label: '½ Kg', sub: 'Half kilo cake',
      serves: 'Serves 4–6',
      img: 'cake-pink-hearts',
      blurb: 'The everyday birthday size. Enough for a small family table.',
      price: { vanilla: 530, butterscotch: 580, strawberry: 580, mango: 580, chocolate: 600, biscoff: 650 }
    },
    {
      id: 'one', label: '1 Kg', sub: 'One kilo cake',
      serves: 'Serves 8–12',
      img: 'cake-pink-ribbon',
      blurb: 'For a proper party. More room for piping, ribbons and pearls.',
      price: { vanilla: 1050, butterscotch: 1100, strawberry: 1100, mango: 1100, chocolate: 1200, biscoff: 1300 }
    }
  ],

  /* ---------- everything priced on its own ---------- */
  specials: [
    { name: 'Cupcakes',          price: 250,  unit: 'box of 6',      img: 'cupcakes-box',
      desc: 'Piped rosettes in vanilla or strawberry, with pearls or gold dragées.' },
    { name: 'Cake + cupcake combo', price: 350, unit: '',            img: 'combo-red-white',
      desc: 'A small cake with two matching cupcakes on one board. Ready-made gift.' },
    { name: 'Candle cake',       price: 700,  from: true, unit: '',            img: 'cake-candle-blossom',
      desc: 'Tall cream cake with piped blossoms and a candle set into the top.' },
    { name: 'Chocolate truffle', price: 750,  unit: '½ kg',          img: 'cake-truffle',
      desc: 'Dark chocolate ganache, piped border, hand-written message on top.' },
    { name: 'Tier cake',         price: 1150, from: true, unit: '',            img: 'cake-tier-pink',
      desc: 'Two or three tiers with Lambeth piping. Needs a few days of notice.' },
    { name: 'Biscoff cheesecake cups', poa: true, unit: 'price on request', img: 'cheesecake-biscoff',
      desc: 'Set in little tubs with a whole Biscoff biscuit on top. Sold in sets.' },
    { name: 'Dessert box',       poa: true, unit: 'price on request', img: 'bento-cheesecake-set',
      desc: 'A bento cake, cupcakes and cheesecake cups packed together as a hamper.' }
  ],

  /* Real pixel widths of each photo, [small, large]. The srcset needs the
     true width or the browser picks the wrong file. Regenerate if you add
     images. */
  imgW: {
    'bento-cheesecake-set': [640, 1200],
    'bento-rose': [640, 960],
    'cake-anniversary-roses': [480, 480],
    'cake-baby-bunny': [480, 480],
    'cake-birthday-pink': [480, 480],
    'cake-candle-blossom': [640, 960],
    'cake-doctor-theme': [480, 480],
    'cake-heart-floral': [483, 483],
    'cake-mint-floral': [480, 480],
    'cake-pink-bloom': [480, 480],
    'cake-pink-hearts': [640, 960],
    'cake-pink-ribbon': [640, 1200],
    'cake-red-bows': [480, 480],
    'cake-rose-ruffle': [480, 480],
    'cake-tier-pink': [640, 960],
    'cake-truffle': [640, 960],
    'cheesecake-biscoff': [640, 960],
    'cheesecake-cup': [640, 960],
    'combo-bento-box': [640, 640],
    'combo-red-white': [640, 1200],
    'cupcakes-box': [640, 1200],
    'cupcakes-hearts': [640, 1200],
    'mariya': [640, 960]
  },

  /* ---------- the gallery ---------- */
  gallery: [
    { img: 'cake-pink-ribbon',       name: 'Pink Ribbon Lambeth', cat: 'Cakes',
      desc: 'Rose buttercream with Lambeth shell borders, organza ribbons and edible pearls.' },
    { img: 'cake-tier-pink',         name: 'Blush Tier',          cat: 'Tier cakes',
      desc: 'Three tiers in blush and cream with shell piping and piped bows.' },
    { img: 'cake-candle-blossom',    name: 'Candle Blossom',      cat: 'Cakes',
      desc: 'Ivory drip cake with piped pink blossoms, pearls and a single candle.' },
    { img: 'bento-rose',             name: 'Rose Swirl Bento',    cat: 'Bento',
      desc: 'One piped rose filling the whole top, in a takeaway bento box.' },
    { img: 'cake-truffle',           name: 'Chocolate Truffle',   cat: 'Cakes',
      desc: 'Glossy ganache with a piped border and gold hand lettering.' },
    { img: 'cupcakes-box',           name: 'Rosette Cupcakes',    cat: 'Cupcakes',
      desc: 'Six cupcakes in pink and cream with pearls and gold dragées.' },
    { img: 'combo-red-white',        name: 'Red Ribbon Combo',    cat: 'Combos',
      desc: 'A small cake with red satin bows and two matching cupcakes.' },
    { img: 'cake-pink-hearts',       name: 'Blush Hearts',        cat: 'Cakes',
      desc: 'Combed pink buttercream scattered with tiny piped hearts and bows.' },
    { img: 'cake-anniversary-roses', name: 'Anniversary Roses',   cat: 'Tier cakes',
      desc: 'Two ivory tiers with fresh red roses, baby’s breath and a gold topper.' },
    { img: 'cake-heart-floral',      name: 'Heart Bloom',         cat: 'Cakes',
      desc: 'Heart-shaped cream cake edged in pink shells and piped flowers.' },
    { img: 'cake-rose-ruffle',       name: 'Rose Ruffle',         cat: 'Cakes',
      desc: 'Deep rose ruffles all the way round, with a gold plaque on top.' },
    { img: 'cake-red-bows',          name: 'Red Bow',             cat: 'Cakes',
      desc: 'Smooth pink top with red satin bows and piped roses at the base.' },
    { img: 'cheesecake-biscoff',     name: 'Biscoff Cheesecake',  cat: 'Desserts',
      desc: 'No-bake Biscoff cheesecake set in cups, biscuit pressed on top.' },
    { img: 'combo-bento-box',        name: 'Bento Gift Box',      cat: 'Combos',
      desc: 'A bento cake, two cupcakes and two cheesecake cups packed together.' },
    { img: 'cake-doctor-theme',      name: 'Doctor’s Coat',       cat: 'Themed',
      desc: 'A themed cake made for a doctor — piped coat, stethoscope and pens.' },
    { img: 'cake-baby-bunny',        name: 'Baby Bunny',          cat: 'Themed',
      desc: 'Pink and blue with piped bunnies and flowers, made for a baby shower.' },
    { img: 'cake-pink-bloom',        name: 'White Bloom',         cat: 'Cakes',
      desc: 'Blush cake with piped bows and a single white bloom sitting on top.' },
    { img: 'cake-birthday-pink',     name: 'Birthday Pearl',      cat: 'Cakes',
      desc: 'Cream and pink shell borders with pearls and a gold birthday script.' },
    { img: 'cake-mint-floral',       name: 'Mint Floral',         cat: 'Cakes',
      desc: 'Ivory buttercream with piped mint-green flowers and hand lettering.' },
    { img: 'cupcakes-hearts',        name: 'Sweetheart Cupcakes', cat: 'Cupcakes',
      desc: 'Cream swirls topped with a red sugar heart, boxed for gifting.' },
    { img: 'bento-cheesecake-set',   name: 'Bento & Cheesecake',  cat: 'Combos',
      desc: 'A rose bento cake alongside six Biscoff cheesecake cups.' },
    { img: 'cheesecake-cup',         name: 'Cheesecake Cup',      cat: 'Desserts',
      desc: 'Single Biscoff cheesecake cup — the size that fits in one hand.' }
  ],

  /* ---------- what the order form offers ---------- */
  orderKinds: [
    'Bento cake', 'Half kg cake', '1 kg cake', 'Tier cake',
    'Cupcakes', 'Combo', 'Cheesecake cups', 'Something custom'
  ]
};

/* Convenience: cheapest price on the page, used for the "starts from" line. */
SHOP.startsFrom = Math.min(
  ...SHOP.sizes.flatMap(s => Object.values(s.price))
);
