/* ==========================================================================
   _thebakeshop._  —  page behaviour
   Everything reads from SHOP in data.js, so prices live in one place only.
   ========================================================================== */
(function () {
  'use strict';

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var reduced = window.matchMedia &&
                window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var money = function (n) { return SHOP.currency + n.toLocaleString('en-IN'); };

  /* Every photo exists as name.webp / name.jpg plus a name-sm.* pair. The
     widths come from SHOP.imgW because several photos are smaller than the
     nominal 1200px and a wrong descriptor makes the browser pick badly. */
  function picture(slug, alt, sizes, eager) {
    var w  = (SHOP.imgW && SHOP.imgW[slug]) || [640, 1200];
    var sm = w[0], lg = w[1];
    var set = function (ext) {
      var a = 'assets/img/' + slug + '-sm.' + ext + ' ' + sm + 'w';
      return lg > sm ? a + ', assets/img/' + slug + '.' + ext + ' ' + lg + 'w' : a;
    };
    return '<picture>' +
      '<source type="image/webp" sizes="' + sizes + '" srcset="' + set('webp') + '">' +
      '<img src="assets/img/' + slug + '-sm.jpg" sizes="' + sizes + '" srcset="' + set('jpg') + '" ' +
        'alt="' + alt + '" loading="' + (eager ? 'eager' : 'lazy') + '" decoding="async">' +
      '</picture>';
  }

  /* Link to the photo, so the cake travels with the message even when the
     browser cannot attach the file itself — WhatsApp turns it into a preview.
     Only a served page has a URL worth sending; a file:// path means nothing
     on someone else's phone. */
  function photoUrl(slug) {
    if (location.protocol !== 'http:' && location.protocol !== 'https:') return '';
    try { return new URL('assets/img/' + slug + '.jpg', location.href).href; }
    catch (e) { return ''; }
  }

  /* ------------------------------------------------------------------
     Navigation
     ------------------------------------------------------------------ */
  var nav    = $('#nav');
  var mnav   = $('#mnav');
  var burger = $('#burger');

  function closeMenu() {
    if (!mnav) return;
    mnav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.removeProperty('overflow');
  }

  if (burger) {
    burger.addEventListener('click', function () {
      var open = mnav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    $$('#mnav a').forEach(function (a) { a.addEventListener('click', closeMenu); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mnav.classList.contains('open')) {
        closeMenu();
        burger.focus();
      }
    });
    /* Crossing into the desktop layout hides the menu in CSS, so release the
       scroll lock too — otherwise the page stays frozen with nothing on screen
       to explain why. */
    addEventListener('resize', function () {
      if (window.innerWidth >= 920 && mnav.classList.contains('open')) closeMenu();
    }, { passive: true });
  }

  var sections = $$('main section[id]');
  var navLinks = $$('.nav-links a');
  var fab      = $('#fab');
  var ticking  = false;

  var lastY = 0;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (nav) nav.classList.toggle('stuck', y > 12);

    /* The floating button gets out of the way while you are reading down the
       page — otherwise it sits on top of the right-hand price column — and
       comes back the moment you scroll up looking for it. */
    if (fab) {
      var goingDown = y > lastY + 4;
      var goingUp   = y < lastY - 4;
      if (y < 260)        fab.classList.add('hide');
      else if (goingDown) fab.classList.add('hide');
      else if (goingUp)   fab.classList.remove('hide');
    }
    lastY = y;

    var line = y + (parseFloat(getComputedStyle(document.documentElement)
                    .getPropertyValue('--nav-h')) || 60) + 90;
    var current = '';
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].offsetTop <= line) current = sections[i].id;
    }
    navLinks.forEach(function (a) {
      a.classList.toggle('on', a.getAttribute('href') === '#' + current);
    });
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });

  /* ------------------------------------------------------------------
     Reveal on scroll
     ------------------------------------------------------------------ */
  function revealAll() {
    $$('[data-rev]').forEach(function (el) { el.classList.add('in'); });
  }

  function watchReveals() {
    var items = $$('[data-rev]:not(.in)');
    if (reduced || !('IntersectionObserver' in window)) { revealAll(); return; }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    items.forEach(function (el) { io.observe(el); });

    /* Safety net: content must never be permanently invisible because an
       observer did not fire. Anything still hidden after a moment is shown. */
    setTimeout(function () {
      $$('[data-rev]:not(.in)').forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight * 1.2) el.classList.add('in');
      });
    }, 1400);
  }

  /* ------------------------------------------------------------------
     Small animated touches
     ------------------------------------------------------------------ */
  var PETAL_COLOURS = ['#F7C9DA', '#FBE0EA', '#E39BB8', '#FCD9E6'];

  /* A handful of petals puff out of whatever was just tapped. */
  function burst(x, y) {
    if (reduced) return;
    for (var i = 0; i < 11; i++) {
      var el = document.createElement('i');
      var ang = (-90 + (Math.random() * 150 - 75)) * Math.PI / 180;
      var dist = 55 + Math.random() * 95;
      el.className = 'burst';
      el.style.left = x + 'px';
      el.style.top  = y + 'px';
      el.style.background = PETAL_COLOURS[i % PETAL_COLOURS.length];
      el.style.setProperty('--dx',  Math.cos(ang) * dist + 'px');
      el.style.setProperty('--dy',  Math.sin(ang) * dist + 'px');
      el.style.setProperty('--rot', (Math.random() * 540 - 270) + 'deg');
      el.style.setProperty('--t',   (720 + Math.random() * 520) + 'ms');
      document.body.appendChild(el);
      (function (node) {
        setTimeout(function () { if (node.parentNode) node.parentNode.removeChild(node); }, 1400);
      })(el);
    }
  }

  /* Petals drifting down the page, all the way through. */
  function petals() {
    var cv = $('#petals');
    if (!cv || reduced) return;
    var ctx = cv.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w, h, ps;

    function size() {
      w = cv.width  = Math.floor(innerWidth  * dpr);
      h = cv.height = Math.floor(innerHeight * dpr);
      cv.style.width  = innerWidth  + 'px';
      cv.style.height = innerHeight + 'px';
    }

    function seed() {
      var n = innerWidth < 700 ? 12 : 20;
      ps = [];
      for (var i = 0; i < n; i++) {
        ps.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: (7 + Math.random() * 9) * dpr,
          s: (.2 + Math.random() * .42) * dpr,
          d: Math.random() * Math.PI * 2,
          v: .005 + Math.random() * .011,
          a: .3 + Math.random() * .35,
          c: PETAL_COLOURS[i % PETAL_COLOURS.length]
        });
      }
    }

    /* A petal: a teardrop with a soft point at the tip. */
    function petal(g, r) {
      g.beginPath();
      g.moveTo(0, -r);
      g.bezierCurveTo(r * .78, -r * .5, r * .62, r * .62, 0, r);
      g.bezierCurveTo(-r * .62, r * .62, -r * .78, -r * .5, 0, -r);
      g.closePath();
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < ps.length; i++) {
        var p = ps[i];
        p.y += p.s;
        p.d += p.v;
        p.x += Math.sin(p.d) * .45 * dpr;
        if (p.y - p.r > h) { p.y = -p.r * 2; p.x = Math.random() * w; }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.d);
        /* The gentle spin reads as a petal turning edge-on. */
        ctx.scale(1, Math.max(.35, Math.abs(Math.cos(p.d * .6))));
        ctx.globalAlpha = p.a;
        ctx.fillStyle = p.c;
        petal(ctx, p.r);
        ctx.fill();
        ctx.restore();
      }
      requestAnimationFrame(draw);
    }

    size(); seed(); draw();
    var t;
    addEventListener('resize', function () {
      clearTimeout(t);
      t = setTimeout(function () { size(); seed(); }, 220);
    }, { passive: true });
  }

  /* ------------------------------------------------------------------
     Price cards
     ------------------------------------------------------------------ */
  function buildPrices() {
    var host = $('#priceGrid');
    if (!host) return;

    host.innerHTML = SHOP.sizes.map(function (s, i) {
      var rows = SHOP.flavours.filter(function (f) {
        return s.price[f.id] != null;
      }).map(function (f) {
        return '<li>' +
          '<span class="fl-name">' + f.label +
            '<span class="fl-note">' + f.note + '</span>' +
          '</span>' +
          '<i class="fl-dot" aria-hidden="true"></i>' +
          '<span class="fl-price">' + money(s.price[f.id]) + '</span>' +
        '</li>';
      }).join('');

      return '<article class="price-card" data-rev style="--d:' + (i * 90) + 'ms">' +
        '<div class="pc-top">' +
          '<div class="pc-img">' + picture(s.img, s.label + ' cake', '68px') + '</div>' +
          '<div class="pc-ttl">' +
            '<span class="pc-sub">' + s.sub + '</span>' +
            '<h3>' + s.label + '</h3>' +
            '<span class="pc-serves">' + s.serves + '</span>' +
          '</div>' +
        '</div>' +
        '<p class="pc-blurb">' + s.blurb + '</p>' +
        '<ul class="flist">' + rows + '</ul>' +
        '<div class="pc-foot">' +
          '<button class="btn btn-ghost btn-block" data-order-size="' + s.id + '">' +
            'Order a ' + s.label.toLowerCase() + '</button>' +
        '</div>' +
      '</article>';
    }).join('');
  }

  /* ------------------------------------------------------------------
     Specials
     ------------------------------------------------------------------ */
  function buildSpecials() {
    var host = $('#spGrid');
    if (!host) return;

    host.innerHTML = SHOP.specials.map(function (sp, i) {
      var price = sp.poa
        ? '<span class="sp-price"><small>Price on request' +
            (sp.unit ? ' · ' + sp.unit : '') + '</small></span>'
        : '<span class="sp-price">' +
            (sp.from ? '<small>from</small>' : '') + money(sp.price) +
            (sp.unit ? '<small>' + sp.unit + '</small>' : '') +
          '</span>';

      return '<button class="sp-card" data-rev style="--d:' + (i * 55) + 'ms" ' +
             'data-order-item="' + sp.name + '" data-order-img="' + sp.img + '">' +
        '<span class="sp-thumb">' + picture(sp.img, sp.name, '76px') + '</span>' +
        '<span class="sp-body">' +
          '<h3>' + sp.name + '</h3>' +
          '<p>' + sp.desc + '</p>' +
          price +
        '</span>' +
      '</button>';
    }).join('');
  }

  /* ------------------------------------------------------------------
     Gallery + lightbox
     ------------------------------------------------------------------ */
  var shown = [];   // indexes of the gallery entries currently visible
  var lbAt  = 0;

  function buildGallery() {
    var host = $('#galGrid');
    if (!host) return;

    host.innerHTML = SHOP.gallery.map(function (g, i) {
      return '<button class="gal-item" data-cat="' + g.cat + '" data-i="' + i + '" ' +
             'aria-label="' + g.name + ' — open larger photo and order it">' +
        picture(g.img, g.name + ' — ' + g.desc,
                '(min-width:980px) 25vw, (min-width:620px) 33vw, 48vw', i < 4) +
        '<span class="gal-cap"><b>' + g.name + '</b><span>' + g.cat + '</span></span>' +
      '</button>';
    }).join('');

    var cats = [];
    SHOP.gallery.forEach(function (g) { if (cats.indexOf(g.cat) < 0) cats.push(g.cat); });

    var chips = $('#galFilters');
    if (chips) {
      chips.innerHTML = ['All'].concat(cats).map(function (c, i) {
        return '<button class="' + (i === 0 ? 'on' : '') + '" data-f="' + c + '" ' +
               'aria-pressed="' + (i === 0 ? 'true' : 'false') + '">' + c + '</button>';
      }).join('');

      chips.addEventListener('click', function (e) {
        var b = e.target.closest('button');
        if (!b) return;
        $$('button', chips).forEach(function (x) {
          x.classList.toggle('on', x === b);
          x.setAttribute('aria-pressed', x === b ? 'true' : 'false');
        });
        var f = b.dataset.f;
        $$('.gal-item', host).forEach(function (it) {
          it.classList.toggle('hidden', f !== 'All' && it.dataset.cat !== f);
        });
        refreshShown();
      });
    }

    host.addEventListener('click', function (e) {
      var b = e.target.closest('.gal-item');
      if (!b) return;
      burst(e.clientX, e.clientY);
      openLb(shown.indexOf(parseInt(b.dataset.i, 10)));
    });

    refreshShown();
  }

  function refreshShown() {
    shown = $$('.gal-item:not(.hidden)').map(function (b) { return parseInt(b.dataset.i, 10); });
  }

  var lb = $('#lb');

  function current() { return SHOP.gallery[shown[lbAt]]; }

  var lbFrom = null;

  function openLb(pos) {
    if (pos < 0 || !lb) return;
    lbFrom = document.activeElement;
    lbAt = pos;
    paintLb();
    lb.classList.add('on');
    document.body.style.overflow = 'hidden';
    $('#lb-close').focus();
  }

  function paintLb() {
    var g = current();
    if (!g) return;
    $('#lb-img').src  = 'assets/img/' + g.img + '.jpg';
    $('#lb-img').alt  = g.name + ' — ' + g.desc;
    $('#lb-name').textContent = g.name;
    $('#lb-desc').textContent = g.desc;
    var many = shown.length > 1;
    $('#lb-prev').hidden = !many;
    $('#lb-next').hidden = !many;
  }

  function closeLb() {
    if (!lb) return;
    lb.classList.remove('on');
    document.body.style.removeProperty('overflow');
    if (lbFrom && lbFrom.focus) lbFrom.focus();
    lbFrom = null;
  }

  /* Keep tabbing inside the dialog while it is open. */
  function trapLb(e) {
    if (e.key !== 'Tab' || !lb.classList.contains('on')) return;
    var f = $$('button', lb).filter(function (b) { return !b.hidden; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function stepLb(d) {
    if (!shown.length) return;
    lbAt = (lbAt + d + shown.length) % shown.length;
    paintLb();
  }

  if (lb) {
    $('#lb-close').addEventListener('click', closeLb);
    $('#lb-prev').addEventListener('click', function () { stepLb(-1); });
    $('#lb-next').addEventListener('click', function () { stepLb(1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('on')) return;
      if (e.key === 'Escape')     closeLb();
      if (e.key === 'ArrowLeft')  stepLb(-1);
      if (e.key === 'ArrowRight') stepLb(1);
      trapLb(e);
    });

    $('#lb-buy').addEventListener('click', function (e) {
      var g = current();
      if (!g) return;
      burst(e.clientX || innerWidth / 2, e.clientY || innerHeight / 2);
      setAttached(g.img, g.name);
      closeLb();
      goToOrder(true);
    });
  }

  /* ------------------------------------------------------------------
     The design carried into the order form
     ------------------------------------------------------------------ */
  var attached  = null;   // { img: slug, name: 'Pink Ribbon Lambeth' }
  var attachedFile = null;   // the same photo as a File, fetched up front

  /* navigator.share() has to be called while the click is still "active". If
     we fetched the image inside the handler, the await would spend that
     activation and the share sheet would be refused — so the bytes are
     fetched the moment a cake is picked instead. */
  function preloadFile(slug) {
    attachedFile = null;
    if (!canShareFiles) return;
    fetch('assets/img/' + slug + '.jpg')
      .then(function (r) { return r.blob(); })
      .then(function (blob) {
        var f = new File([blob], slug + '.jpg', { type: blob.type || 'image/jpeg' });
        if (attached && attached.img === slug) attachedFile = f;
      })['catch'](function () { attachedFile = null; });
  }

  /* Sharing an actual file needs the Web Share API with file support, which is
     where the cake photo can genuinely travel with the message. */
  var canShareFiles = (function () {
    try {
      if (!(navigator.canShare && navigator.share && window.File)) return false;
      var probe = new File([new Blob(['x'], { type: 'image/jpeg' })], 'p.jpg', { type: 'image/jpeg' });
      return navigator.canShare({ files: [probe] });
    } catch (e) { return false; }
  })();

  function setAttached(slug, name) {
    attached = { img: slug, name: name };
    preloadFile(slug);
    var box = $('#oAttach');
    if (box) {
      $('#oAttachImg').src = 'assets/img/' + slug + '-sm.jpg';
      $('#oAttachImg').alt = name;
      $('#oAttachName').textContent = name;
      box.hidden = false;
    }
    var share = $('#sendShare');
    if (share) share.hidden = !canShareFiles;
    toast('“' + name + '” added — now pick the size and flavour');
  }

  function clearAttached() {
    attached = null;
    attachedFile = null;
    var box = $('#oAttach');
    if (box) box.hidden = true;
    var share = $('#sendShare');
    if (share) share.hidden = true;
  }

  /* `toForm` lands straight on the form itself, which is what you want after
     picking a cake — the how-it-works steps above it are not the point then. */
  function goToOrder(toForm) {
    var t = (toForm && $('#orderForm')) || $('#order');
    if (t) t.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }

  /* ------------------------------------------------------------------
     Order form
     ------------------------------------------------------------------ */
  var kind = '';

  var SIZE_TO_KIND = { bento: 'Bento cake', half: 'Half kg cake', one: '1 kg cake' };
  var KIND_TO_SIZE = { 'Bento cake': 'bento', 'Half kg cake': 'half', '1 kg cake': 'one' };

  function buildForm() {
    var kb = $('#oKind');
    if (kb) {
      kb.innerHTML = SHOP.orderKinds.map(function (k) {
        return '<button type="button" aria-pressed="false" data-k="' + k + '">' + k + '</button>';
      }).join('');
      kb.addEventListener('click', function (e) {
        var b = e.target.closest('button');
        if (!b) return;
        setKind(b.dataset.k);
        syncTotal();
      });
    }

    var fs = $('#oFlavour');
    if (fs) {
      fs.innerHTML = '<option value="">Not sure yet</option>' +
        SHOP.flavours.map(function (f) {
          return '<option value="' + f.label + '">' + f.label + '</option>';
        }).join('');
      fs.addEventListener('change', syncTotal);
    }

    var ss = $('#oSize');
    if (ss) {
      ss.innerHTML = '<option value="">Not sure yet</option>' +
        SHOP.sizes.map(function (s) {
          return '<option value="' + s.id + '">' + s.label + ' — ' + s.serves.toLowerCase() + '</option>';
        }).join('');
      ss.addEventListener('change', function () {
        if (SIZE_TO_KIND[ss.value]) setKind(SIZE_TO_KIND[ss.value]);
        syncTotal();
      });
    }

    var d = $('#oDate');
    if (d) {
      var t = new Date();
      d.min = t.getFullYear() + '-' +
              String(t.getMonth() + 1).padStart(2, '0') + '-' +
              String(t.getDate()).padStart(2, '0');
    }

    var x = $('#oAttachClear');
    if (x) x.addEventListener('click', clearAttached);

    syncTotal();
  }

  function syncTotal() {
    var strip = $('#oTotal');
    if (!strip) return;
    var sizeId  = $('#oSize') ? $('#oSize').value : '';
    var flavour = $('#oFlavour') ? $('#oFlavour').value : '';
    var size    = SHOP.sizes.filter(function (s) { return s.id === sizeId; })[0];
    var fl      = SHOP.flavours.filter(function (f) { return f.label === flavour; })[0];

    if (size && fl && size.price[fl.id] != null) {
      $('#oTotalLabel').textContent = size.label + ' · ' + fl.label + ' — list price';
      $('#oTotalVal').textContent   = money(size.price[fl.id]);
    } else if (size && fl) {
      /* A real combination she does not make in that size, e.g. a bento red
         velvet. Say so rather than showing a price that does not exist. */
      $('#oTotalLabel').textContent = fl.label + ' is not made in ' + size.label + ' — ask her';
      $('#oTotalVal').textContent   = 'on request';
    } else {
      $('#oTotalLabel').textContent = 'Pick a size and flavour to see the list price';
      $('#oTotalVal').textContent   = 'from ' + money(SHOP.startsFrom);
    }
  }

  /* Assembles the message that gets sent to Mariya. */
  function buildMessage() {
    var val = function (id) { var e = $(id); return e ? e.value.trim() : ''; };
    var sizeId  = val('#oSize');
    var flavour = val('#oFlavour');
    var size    = SHOP.sizes.filter(function (s) { return s.id === sizeId; })[0];
    var fl      = SHOP.flavours.filter(function (f) { return f.label === flavour; })[0];

    var L = [];
    L.push('Hi ' + SHOP.brand + '! 🎂');
    L.push('I would like to place an order from your website.');
    L.push('');
    if (val('#oName')) L.push('Name: ' + val('#oName'));
    if (kind)          L.push('Item: ' + kind);
    if (attached)      L.push('Design: ' + attached.name);
    if (size)          L.push('Size: ' + size.label + ' (' + size.serves.toLowerCase() + ')');
    if (flavour)       L.push('Flavour: ' + flavour);
    if (size && fl && size.price[fl.id] != null) {
      L.push('List price: ' + money(size.price[fl.id]));
    } else if (size && fl) {
      L.push('(I know ' + fl.label + ' may not come in ' + size.label + ' — please advise.)');
    }
    if (val('#oDate')) L.push('Needed on: ' + val('#oDate'));
    if (val('#oMsg'))  L.push('Message on the cake: "' + val('#oMsg') + '"');
    if (val('#oNotes')) { L.push(''); L.push('Details:'); L.push(val('#oNotes')); }

    if (attached) {
      var url = photoUrl(attached.img);
      if (url) { L.push(''); L.push('Photo of the cake I mean: ' + url); }
    }

    L.push('');
    L.push('Could you confirm if this works and what the final price is? Thank you!');
    return L.join('\n');
  }

  function toast(msg) {
    var t = $('#toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('on');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.classList.remove('on'); }, 3400);
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:0;left:-9999px';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      ok ? resolve() : reject();
    });
  }

  function wireSend() {
    var wa = $('#sendWa');
    if (wa) {
      wa.addEventListener('click', function () {
        window.open(SHOP.waUrl(buildMessage()), '_blank', 'noopener');
      });
    }

    var ig = $('#sendIg');
    if (ig) {
      ig.addEventListener('click', function () {
        copyText(buildMessage())
          .then(function () { toast('Order copied — paste it in the DM'); })
          ['catch'](function () { toast('Could not copy — please type it in the DM'); });
        /* Open the DM either way, so the button always does something. */
        window.open(SHOP.dmUrl, '_blank', 'noopener');
      });
    }

    /* Hands the phone's share sheet the actual photo plus the written order,
       so WhatsApp or Instagram receives the picture, not just a link. */
    var sh = $('#sendShare');
    if (sh) {
      sh.addEventListener('click', function () {
        if (!attached) return;
        var text = buildMessage();

        /* The good path: the phone's share sheet gets the real JPEG plus the
           written order, and WhatsApp or Instagram receives both. */
        if (attachedFile && navigator.canShare && navigator.canShare({ files: [attachedFile] })) {
          navigator.share({ files: [attachedFile], text: text })
            ['catch'](function (err) {
              if (err && err.name === 'AbortError') return;
              fallbackSend(text);
            });
          return;
        }
        fallbackSend(text);
      });
    }

    /* No file sharing here (most desktop browsers). The message still carries
       a link to the photo, and the picture is opened in a tab so it can be
       dragged straight into the chat. */
    function fallbackSend(text) {
      var url = attached ? photoUrl(attached.img) : '';
      copyText(text)['catch'](function () {});
      window.open(SHOP.waUrl(text), '_blank', 'noopener');
      if (url) {
        window.open(url, '_blank', 'noopener');
        toast('WhatsApp opened with the link. The photo is in the other tab.');
      } else {
        toast('Order copied. Attach the photo yourself in the chat.');
      }
    }

    var cp = $('#copyOrder');
    if (cp) {
      cp.addEventListener('click', function () {
        copyText(buildMessage())
          .then(function () { toast('Order copied to your clipboard'); })
          ['catch'](function () { toast('Could not copy on this browser'); });
      });
    }
  }

  /* Deep links from the price cards and the specials tiles into the form. */
  function wireJumps() {
    document.addEventListener('click', function (e) {
      var sizeBtn = e.target.closest('[data-order-size]');
      var itemBtn = e.target.closest('[data-order-item]');
      if (!sizeBtn && !itemBtn) return;

      if (sizeBtn) {
        var id = sizeBtn.dataset.orderSize;
        if ($('#oSize')) $('#oSize').value = id;
        setKind(SIZE_TO_KIND[id]);
      }

      if (itemBtn) {
        var name = itemBtn.dataset.orderItem;
        var map  = {
          'Cupcakes': 'Cupcakes',
          'Cake + cupcake combo': 'Combo',
          'Cake bouquet': 'Something custom',
          'Tier cake': 'Tier cake',
          'Biscoff cheesecake cups': 'Cheesecake cups',
          'Dessert box': 'Something custom'
        };
        setKind(map[name] || 'Something custom');
        if (itemBtn.dataset.orderImg) setAttached(itemBtn.dataset.orderImg, name);
        burst(e.clientX, e.clientY);
      }

      syncTotal();
      goToOrder(true);
    });
  }

  /* Choosing an item also settles the size, so the message can never say
     "Tier cake" and "1/2 Kg" in the same breath. */
  function setKind(k) {
    if (SHOP.orderKinds.indexOf(k) < 0) return;
    kind = k;
    $$('#oKind button').forEach(function (b) {
      var on = b.dataset.k === k;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    var ss = $('#oSize');
    if (ss) ss.value = KIND_TO_SIZE[k] || '';
  }

  /* ------------------------------------------------------------------
     Go
     ------------------------------------------------------------------ */
  buildPrices();
  buildSpecials();
  buildGallery();
  buildForm();
  wireSend();
  wireJumps();
  watchReveals();
  petals();
  onScroll();

  var yr = $('#yr');
  if (yr) yr.textContent = new Date().getFullYear();
})();
