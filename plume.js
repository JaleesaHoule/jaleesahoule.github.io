/* ---------------------------------------------------------------
   plume.js — a very small odor-plume sketch for the page header.
   Particles are released from a point source and advected by a
   smooth, time-varying wind field. Decorative only.
   --------------------------------------------------------------- */

(function () {
  var canvas = document.getElementById('plume');
  if (!canvas) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var ctx = canvas.getContext('2d');
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0;
  var particles = [];
  var N = 320;
  var t = 0;

  // Teal / sage / clay, weighted toward teal. Earth tones read as
  // stray particles caught in the same flow.
  var LIGHT = [[34, 106, 103], [34, 106, 103], [109, 127, 108], [154, 106, 72]];
  var DARK  = [[108, 181, 174], [108, 181, 174], [142, 166, 140], [193, 143, 105]];

  function palette() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK : LIGHT;
  }

  function resize() {
    var r = canvas.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function spawn(p) {
    // Source sits just off the left edge, mid-height.
    p.x = -10 - Math.random() * 40;
    p.y = H * 0.55 + (Math.random() - 0.5) * H * 0.12;
    p.age = 0;
    p.life = 300 + Math.random() * 400;
    p.r = 0.6 + Math.random() * 1.6;
    p.c = (Math.random() * 4) | 0;
  }

  // Cheap smooth pseudo-noise: sum of a few sines. Good enough to
  // read as gusty rather than uniform.
  function windY(x, y, time) {
    return (
      Math.sin(x * 0.011 + time * 0.9) * 0.36 +
      Math.sin(y * 0.021 - time * 0.6) * 0.24 +
      Math.sin((x + y) * 0.007 + time * 1.4) * 0.22
    );
  }

  function windX(x, time) {
    return 0.85 + 0.35 * Math.sin(x * 0.004 - time * 0.5);
  }

  function init() {
    resize();
    particles = [];
    for (var i = 0; i < N; i++) {
      var p = {};
      spawn(p);
      // Stagger the initial positions so the plume starts already formed.
      p.x = Math.random() * W;
      p.age = Math.random() * p.life;
      particles.push(p);
    }
  }

  function frame() {
    t += 0.006;
    ctx.clearRect(0, 0, W, H);

    var pal = palette();
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += windX(p.x, t) * 1.5;
      p.y += windY(p.x, p.y, t) * 1.5;
      p.age++;

      if (p.x > W + 20 || p.age > p.life || p.y < -20 || p.y > H + 20) {
        spawn(p);
        continue;
      }

      // Fade in quickly, out slowly; thin out downwind.
      var fadeIn = Math.min(1, p.age / 40);
      var fadeOut = 1 - p.age / p.life;
      var alpha = 0.62 * fadeIn * fadeOut * (1 - p.x / (W * 1.7));
      if (alpha <= 0) continue;

      var c = pal[p.c];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + alpha.toFixed(3) + ')';
      ctx.fill();
    }

    raf = requestAnimationFrame(frame);
  }

  var raf = null;

  function start() {
    init();
    if (reduced.matches) {
      frame();                 // draw one static frame
      cancelAnimationFrame(raf);
    } else if (raf === null) {
      raf = requestAnimationFrame(frame);
    }
  }

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      cancelAnimationFrame(raf);
      raf = null;
      start();
    }, 150);
  });

  // Stop burning cycles when the header scrolls out of view.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          if (raf === null && !reduced.matches) raf = requestAnimationFrame(frame);
        } else {
          cancelAnimationFrame(raf);
          raf = null;
        }
      });
    }).observe(canvas);
  }

  start();
})();
