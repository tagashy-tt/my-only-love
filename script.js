/* =========================================================
   Para Lucy — comportamiento
   1) CONFIG: lo único que tienes que editar.
   2) Cielo animado (estrellas, luciérnagas, estrellas fugaces).
   3) Constelación en forma de corazón.
   4) Textos en español, portugués y japonés (objeto "dict").
   5) Easter eggs (la lista completa está en el README).
   ========================================================= */
(function () {
  "use strict";

  /* ---------- 1) CONFIG ---------- */
  var CONFIG = {
    // Fecha desde la que están juntos, por ejemplo "2025-02-14T00:00:00".
    // Si la dejas vacía, la sección del contador no se muestra.
    since: ""
  };

  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- 2) Cielo ---------- */
  var cv = $("sky");
  var cx = cv.getContext("2d");
  var W = 0, H = 0, stars = [], flies = [], shoots = [], sparks = [], hearts = [];
  var last = 0, nextShoot = 3;
  var starColor = "#fff5ea", flyColor = "#ffd9a0";

  function readColors() {
    var cs = getComputedStyle(root);
    starColor = cs.getPropertyValue("--star").trim() || starColor;
    flyColor = cs.getPropertyValue("--fly").trim() || flyColor;
  }
  function size() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    stars = [];
    var n = Math.min(220, Math.round(W * H / 8000));
    for (var i = 0; i < n; i++) {
      stars.push({ x: Math.random() * W, y: Math.random() * H, r: 0.4 + Math.random() * 1.1,
        d: 0.2 + Math.random() * 0.8, p: Math.random() * 6.28, s: 0.5 + Math.random() * 1.6 });
    }
    flies = [];
    var m = W < 600 ? 16 : 28;
    for (var j = 0; j < m; j++) {
      flies.push({ x: Math.random() * W, y: Math.random() * H, r: 1 + Math.random() * 2,
        vy: 6 + Math.random() * 14, sway: 8 + Math.random() * 20, p: Math.random() * 6.28, s: 0.4 + Math.random() * 0.9 });
    }
  }
  function burst(x, y, n) {
    if (reduce) return;
    var cols = ["#fff1dc", "#ffc98a", "#ff8fb1"];
    for (var i = 0; i < n; i++) {
      var a = Math.random() * 6.283, v = 40 + Math.random() * 140;
      sparks.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 20, life: 0,
        max: 0.8 + Math.random() * 0.8, r: 1 + Math.random() * 2, c: cols[i % 3] });
    }
  }
  function shootNow() {
    if (reduce) return;
    shoots.push({ x: W * (0.6 + Math.random() * 0.35), y: H * (0.05 + Math.random() * 0.2), vx: -560, vy: 280, life: 0 });
  }
  function rain() {
    if (reduce) return;
    var cols = ["#ff8fb1", "#ffc98a", "#fff1dc", "#d9a8ff"];
    for (var i = 0; i < 90; i++) {
      hearts.push({ x: Math.random() * W, y: -20 - Math.random() * H * 0.8, vy: 60 + Math.random() * 120,
        s: 6 + Math.random() * 12, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 2,
        c: cols[i % 4], sway: Math.random() * 30, p: Math.random() * 6.28 });
    }
  }
  function drawHeart(x, y, s, rot, color) {
    cx.save();
    cx.translate(x, y); cx.rotate(rot * 0.3); cx.scale(s / 10, s / 10);
    cx.beginPath();
    cx.moveTo(0, 4);
    cx.bezierCurveTo(-9, -2, -5, -9, 0, -3);
    cx.bezierCurveTo(5, -9, 9, -2, 0, 4);
    cx.closePath();
    cx.fillStyle = color; cx.fill();
    cx.restore();
  }
  function draw(t, dt) {
    cx.clearRect(0, 0, W, H);
    var sy = window.scrollY || 0, i, o;
    cx.shadowBlur = 0; cx.fillStyle = starColor;
    for (i = 0; i < stars.length; i++) {
      o = stars[i];
      var y = (((o.y - sy * o.d * 0.25) % H) + H) % H;
      cx.globalAlpha = 0.3 + 0.6 * (0.5 + 0.5 * Math.sin(t * o.s + o.p));
      cx.beginPath(); cx.arc(o.x, y, o.r, 0, 6.283); cx.fill();
    }
    cx.shadowColor = flyColor; cx.shadowBlur = 12; cx.fillStyle = flyColor;
    for (i = 0; i < flies.length; i++) {
      o = flies[i];
      o.y -= o.vy * dt;
      if (o.y < -10) { o.y = H + 10; o.x = Math.random() * W; }
      cx.globalAlpha = 0.2 + 0.6 * (0.5 + 0.5 * Math.sin(t * o.s + o.p));
      cx.beginPath(); cx.arc(o.x + Math.sin(t * 0.5 + o.p) * o.sway, o.y, o.r, 0, 6.283); cx.fill();
    }
    cx.shadowBlur = 0;
    if (t > nextShoot) { shootNow(); nextShoot = t + 5 + Math.random() * 5; }
    cx.lineWidth = 1.6; cx.lineCap = "round";
    for (i = shoots.length - 1; i >= 0; i--) {
      o = shoots[i]; o.life += dt; o.x += o.vx * dt; o.y += o.vy * dt;
      if (o.life > 0.9) { shoots.splice(i, 1); continue; }
      cx.globalAlpha = 1 - o.life / 0.9; cx.strokeStyle = "#fff1dc";
      cx.beginPath(); cx.moveTo(o.x, o.y); cx.lineTo(o.x - o.vx * 0.09, o.y - o.vy * 0.09); cx.stroke();
    }
    cx.shadowBlur = 8;
    for (i = sparks.length - 1; i >= 0; i--) {
      o = sparks[i]; o.life += dt; o.x += o.vx * dt; o.y += o.vy * dt; o.vy += 60 * dt;
      if (o.life > o.max) { sparks.splice(i, 1); continue; }
      cx.globalAlpha = 1 - o.life / o.max; cx.fillStyle = o.c; cx.shadowColor = o.c;
      cx.beginPath(); cx.arc(o.x, o.y, o.r, 0, 6.283); cx.fill();
    }
    cx.shadowBlur = 0; cx.globalAlpha = 0.9;
    for (i = hearts.length - 1; i >= 0; i--) {
      o = hearts[i]; o.y += o.vy * dt; o.rot += o.vr * dt;
      if (o.y > H + 30) { hearts.splice(i, 1); continue; }
      drawHeart(o.x + Math.sin(t + o.p) * o.sway, o.y, o.s, o.rot, o.c);
    }
    cx.globalAlpha = 1;
  }
  function frame(now) {
    var t = now / 1000, dt = Math.min(t - last, 0.1);
    last = t; draw(t, dt);
    requestAnimationFrame(frame);
  }

  /* ---------- Avisos ---------- */
  var toastTimer;
  function toast(msg) {
    var t = $("toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 3800);
  }

  /* ---------- 4) Textos ---------- */
  var N = 12;
  var dict = {
    es: {
      lang: "es", start: 0,
      label: "Una constelación para ti", title: "Enciende las estrellas", hint: "Toca cada estrella.",
      count: function (n) { return n + " de " + N; },
      done: "Esta constelación se llama Lucy.", sub: "Hecha de luz, como tu nombre.", again: "Volver a empezar", star: "Estrella",
      greet: ["Buenos días", "Buenas tardes", "Buenas noches"], greetEnd: ", Lucy.",
      togetherLabel: "Nuestro tiempo", togetherTitle: "Llevamos juntos", units: ["días", "horas", "min", "seg"],
      nameLabel: "Tu nombre en tres idiomas", nameTitle: "En todos significa luz",
      etym: "Viene del latín lux, que significa luz. Toca un nombre para leer la carta en ese idioma.",
      orbToast: ["Luz: en español y en portugués.", "Lux: en latín, de donde viene Lucía.", "光 se lee «hikari»: luz en japonés.", "ひかり también es «hikari». Otra vez, luz."],
      rainToast: "Lluvia de corazones, solo para ti.",
      jarLabel: "Para cuando lo necesites",
      rzTitle: "Una razón", rzHint: "Toca para sacar una razón al azar.", rzBtn: "Sacar una razón",
      wsTitle: "Un deseo", wsHint: "Toca y mira cómo cruza una estrella.", wsBtn: "Pedir un deseo",
      pdText: "Si llegaste hasta aquí abajo, gracias por buscar en cada rincón. Cierra los ojos un segundo. Eso que sientes ahora es un abrazo largo, enviado con todo mi cariño.",
      close: "Cerrar", secretLabel: "Estrella escondida", dawn: "Cambiar a modo amanecer", night: "Cambiar a modo noche",
      reasons: [
        "Porque contigo hasta lo difícil se siente posible.",
        "Porque tu risa le gana a cualquier mal día.",
        "Porque me escuchas como si cada palabra importara.",
        "Porque contigo puedo ser quien soy, sin esforzarme.",
        "Porque me haces querer cuidar las cosas buenas.",
        "Porque tu forma de ver las cosas cambia la mía.",
        "Porque estar a tu lado se siente como llegar a casa.",
        "Porque no necesito un plan perfecto si estás tú.",
        "Porque eres paciente conmigo, incluso cuando me pierdo en la pantalla.",
        "Porque tu nombre es luz, y eso lo explica todo.",
        "Porque me haces sonreír sin que me dé cuenta.",
        "Porque sí. Porque eres tú."
      ],
      wishes: [
        "Que hoy tengas un día liviano.",
        "Que alguien te diga hoy lo bien que lo haces.",
        "Que tus mejores ideas lleguen justo a tiempo.",
        "Que nunca te falte alguien que te escuche.",
        "Que descanses y despiertes con ganas.",
        "Que lo que te preocupa se acomode solo.",
        "Un abrazo largo, entregado en cuanto nos veamos.",
        "Que siempre encuentres tu luz, incluso de noche."
      ]
    },
    pt: {
      lang: "pt-BR", start: 0,
      label: "Uma constelação para você", title: "Acenda as estrelas", hint: "Toque em cada estrela.",
      count: function (n) { return n + " de " + N; },
      done: "Esta constelação se chama Lucy.", sub: "Feita de luz, como o seu nome.", again: "Começar de novo", star: "Estrela",
      greet: ["Bom dia", "Boa tarde", "Boa noite"], greetEnd: ", Lucy.",
      togetherLabel: "Nosso tempo", togetherTitle: "Estamos juntos há", units: ["dias", "horas", "min", "seg"],
      nameLabel: "O seu nome em três idiomas", nameTitle: "Em todos quer dizer luz",
      etym: "Vem do latim lux, que significa luz. Toque em um nome para ler a carta nesse idioma.",
      orbToast: ["Luz: em português e em espanhol.", "Lux: em latim, de onde vem Lucía.", "光 se lê «hikari»: luz em japonês.", "ひかり também é «hikari». De novo, luz."],
      rainToast: "Chuva de corações, só para você.",
      jarLabel: "Para quando precisar",
      rzTitle: "Uma razão", rzHint: "Toque para tirar uma razão ao acaso.", rzBtn: "Tirar uma razão",
      wsTitle: "Um desejo", wsHint: "Toque e veja uma estrela cruzar o céu.", wsBtn: "Fazer um pedido",
      pdText: "Se você chegou até aqui embaixo, agradeço por procurar em cada cantinho. Feche os olhos por um segundo. O que você sente agora é um abraço longo, enviado com todo o meu carinho.",
      close: "Fechar", secretLabel: "Estrela escondida", dawn: "Mudar para o modo amanhecer", night: "Mudar para o modo noite",
      reasons: [
        "Porque com você até o difícil parece possível.",
        "Porque a sua risada vence qualquer dia ruim.",
        "Porque você me ouve como se cada palavra importasse.",
        "Porque com você eu posso ser quem sou, sem esforço.",
        "Porque você me faz querer cuidar das coisas boas.",
        "Porque o seu jeito de ver as coisas muda o meu.",
        "Porque estar ao seu lado é como chegar em casa.",
        "Porque eu não preciso de um plano perfeito se você está comigo.",
        "Porque você tem paciência comigo, até quando eu me perco na tela.",
        "Porque o seu nome é luz, e isso explica tudo.",
        "Porque você me faz sorrir sem eu perceber.",
        "Porque sim. Porque é você."
      ],
      wishes: [
        "Que hoje você tenha um dia leve.",
        "Que alguém diga hoje o quanto você faz bem as coisas.",
        "Que as suas melhores ideias cheguem na hora certa.",
        "Que nunca falte alguém para te ouvir.",
        "Que você descanse e acorde com vontade.",
        "Que o que te preocupa se ajeite sozinho.",
        "Um abraço longo, entregue assim que a gente se ver.",
        "Que você sempre encontre a sua luz, até de noite."
      ]
    },
    ja: {
      lang: "ja", start: 2,
      label: "あなたのための星座", title: "星を灯してください", hint: "ひとつずつ星に触れてください。",
      count: function (n) { return n + " / " + N; },
      done: "この星座の名前は、ルーシー。", sub: "あなたの名前と同じ、光でできています。", again: "もう一度", star: "星",
      greet: ["おはよう", "こんにちは", "こんばんは"], greetEnd: "、ルーシー。",
      togetherLabel: "私たちの時間", togetherTitle: "一緒に過ごした時間", units: ["日", "時間", "分", "秒"],
      nameLabel: "三つの言葉で、あなたの名前", nameTitle: "どの言葉でも、意味は光",
      etym: "ラテン語の lux（光）に由来します。名前に触れると、その言語で手紙を読めます。",
      orbToast: ["「luz」はスペイン語とポルトガル語で光。", "「lux」はラテン語。ルシアの語源です。", "「光」は「ひかり」と読みます。", "「ひかり」も光。もう一度、光。"],
      rainToast: "あなただけに、ハートの雨を。",
      jarLabel: "必要なときのために",
      rzTitle: "ひとつの理由", rzHint: "タップして、理由をひとつ引いてください。", rzBtn: "理由を引く",
      wsTitle: "ひとつの願い", wsHint: "タップすると、星が流れます。", wsBtn: "願いごとをする",
      pdText: "ここまで探してくれて、ありがとう。少しだけ目を閉じてみてください。今感じているのは、心を込めて送った、長いハグです。",
      close: "閉じる", secretLabel: "隠れた星", dawn: "夜明けモードにする", night: "夜モードにする",
      reasons: [
        "あなたといると、難しいことも出来そうな気がするから。",
        "あなたの笑い声は、どんな悪い日にも勝つから。",
        "あなたは、一言一言を大切に聞いてくれるから。",
        "あなたの前では、頑張らなくても自分らしくいられるから。",
        "あなたは、大切なものを守りたいと思わせてくれるから。",
        "あなたのものの見方が、私の見方を変えてくれるから。",
        "あなたのそばは、家に帰ったような気持ちになるから。",
        "あなたがいれば、完璧な計画はいらないから。",
        "画面に夢中になっていても、あなたは待ってくれるから。",
        "あなたの名前は光で、それがすべてを説明しているから。",
        "気づかないうちに、あなたは私を笑顔にしてくれるから。",
        "理由はいらない。あなたがあなただから。"
      ],
      wishes: [
        "今日が、軽やかな一日になりますように。",
        "今日、誰かがあなたの頑張りを伝えてくれますように。",
        "いちばん良いアイデアが、ちょうど良いときに届きますように。",
        "話を聞いてくれる人が、いつもそばにいますように。",
        "ゆっくり休んで、元気に目覚められますように。",
        "心配ごとが、自然と収まりますように。",
        "長い長いハグを、会えたらすぐに届けます。",
        "夜でも、あなたの光が見つかりますように。"
      ]
    }
  };
  var cur = "es";

  /* ---------- 3) Constelación ---------- */
  var NS = "http://www.w3.org/2000/svg";
  var svg = $("heart");
  var lit = [], segs = [], starEls = [];
  function hx(t) { return 160 + 8.6 * 16 * Math.pow(Math.sin(t), 3); }
  function hy(t) {
    var f = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    return 150 - 8.6 * (f + 2.5);
  }
  function el(name, attrs, parent) {
    var e = document.createElementNS(NS, name);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  var d = "";
  for (var j = 0; j <= 120; j++) {
    var tt = j * 2 * Math.PI / 120;
    d += (j ? "L" : "M") + hx(tt).toFixed(1) + " " + hy(tt).toFixed(1);
  }
  el("path", { d: d + "Z", "class": "h-fill" }, svg);
  var pts = [];
  for (var i = 0; i < N; i++) { var t0 = i * 2 * Math.PI / N; pts.push([hx(t0), hy(t0)]); lit.push(false); }
  for (i = 0; i < N; i++) {
    var b = pts[(i + 1) % N];
    segs.push(el("line", { x1: pts[i][0], y1: pts[i][1], x2: b[0], y2: b[1], "class": "seg" }, svg));
  }
  var constSec = $("const");
  function count() { var n = 0; for (var k = 0; k < N; k++) if (lit[k]) n++; return n; }
  function refresh() {
    var n = count();
    for (var k = 0; k < N; k++) {
      starEls[k].classList.toggle("on", lit[k]);
      segs[k].classList.toggle("on", lit[k] && lit[(k + 1) % N]);
    }
    $("cCount").textContent = dict[cur].count(n);
    constSec.classList.toggle("done", n === N);
    $("cDone").hidden = n !== N;
  }
  function light(k) {
    if (lit[k]) return;
    lit[k] = true;
    var r = starEls[k].getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, 14);
    refresh();
    if (count() === N) {
      var c = svg.getBoundingClientRect();
      burst(c.left + c.width / 2, c.top + c.height / 2, 60);
    }
  }
  pts.forEach(function (p, k) {
    var g = el("g", { "class": "star", tabindex: "0", role: "button", transform: "translate(" + p[0].toFixed(1) + " " + p[1].toFixed(1) + ")" }, svg);
    g.style.setProperty("--dl", (k * 0.27).toFixed(2) + "s");
    el("circle", { "class": "halo", r: 16 }, g);
    el("circle", { "class": "core2", r: 4.5 }, g);
    el("circle", { r: 22, fill: "transparent" }, g);
    g.addEventListener("click", function () { light(k); });
    g.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); light(k); }
    });
    starEls.push(g);
  });
  $("cAgain").addEventListener("click", function () {
    for (var k = 0; k < N; k++) lit[k] = false;
    refresh();
  });
  // Easter egg: con la constelación completa, tocar el corazón lo hace latir.
  svg.addEventListener("click", function () {
    if (count() !== N) return;
    constSec.classList.remove("beat");
    void constSec.offsetWidth;
    constSec.classList.add("beat");
  });

  /* ---------- Razón y deseo ---------- */
  var lastR = -1, lastW = -1;
  function pick(list, lastIdx) {
    var k;
    do { k = Math.floor(Math.random() * list.length); } while (k === lastIdx && list.length > 1);
    return k;
  }
  function show(outId, text) {
    var o = $(outId);
    o.classList.add("swap");
    setTimeout(function () {
      o.textContent = text;
      o.classList.remove("hint-text", "swap");
    }, 280);
  }
  $("rzBtn").addEventListener("click", function () {
    lastR = pick(dict[cur].reasons, lastR);
    show("rzOut", dict[cur].reasons[lastR]);
  });
  $("wsBtn").addEventListener("click", function () {
    lastW = pick(dict[cur].wishes, lastW);
    shootNow();
    show("wsOut", dict[cur].wishes[lastW]);
  });

  /* ---------- Idioma ---------- */
  var sections = document.querySelectorAll("[data-lang]");
  var buttons = document.querySelectorAll("[data-go]");
  var orbWord = $("orbWord");
  var orbList = ["luz", "lux", "光", "ひかり"], orbI = 0;
  function setOrb(i) {
    orbI = i;
    var w = orbList[i];
    orbWord.textContent = w;
    orbWord.classList.toggle("jp", w === "光" || w === "ひかり");
  }
  function greeting(m) {
    var h = new Date().getHours();
    var p = (h >= 5 && h < 12) ? 0 : (h >= 12 && h < 19) ? 1 : 2;
    var g = $("greet");
    g.textContent = m.greet[p] + m.greetEnd;
    g.lang = m.lang;
  }
  function apply(key) {
    if (!dict[key]) key = "es";
    cur = key;
    var m = dict[key];
    sections.forEach(function (s) { s.hidden = s.getAttribute("data-lang") !== key; });
    buttons.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-go") === key)); });
    root.lang = m.lang;
    ["const", "nombre", "jar", "together", "modal"].forEach(function (id) { $(id).lang = m.lang; });
    document.querySelectorAll("[data-i]").forEach(function (n) {
      var v = m[n.getAttribute("data-i")];
      if (typeof v === "string") n.textContent = v;
    });
    ["uD", "uH", "uM", "uS"].forEach(function (id, k) { $(id).textContent = m.units[k]; });
    starEls.forEach(function (g, k) { g.setAttribute("aria-label", m.star + " " + (k + 1)); });
    $("secret").setAttribute("aria-label", m.secretLabel);
    setOrb(m.start);
    greeting(m);
    if ($("rzOut").classList.contains("hint-text")) $("rzOut").textContent = m.rzHint;
    else if (lastR >= 0) $("rzOut").textContent = m.reasons[lastR];
    if ($("wsOut").classList.contains("hint-text")) $("wsOut").textContent = m.wsHint;
    else if (lastW >= 0) $("wsOut").textContent = m.wishes[lastW];
    setModeLabel();
    refresh();
    tick();
  }
  buttons.forEach(function (b) {
    b.addEventListener("click", function () { location.hash = b.getAttribute("data-go"); });
  });
  document.querySelectorAll("[data-pick]").forEach(function (b) {
    b.addEventListener("click", function () {
      location.hash = b.getAttribute("data-pick");
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
  });
  window.addEventListener("hashchange", function () { apply(location.hash.slice(1)); });

  /* ---------- Modo noche / amanecer ---------- */
  function setModeLabel() {
    var dawn = root.getAttribute("data-mode") === "dawn";
    $("modeBtn").setAttribute("aria-label", dawn ? dict[cur].night : dict[cur].dawn);
    $("modeUse").setAttribute("href", dawn ? "#i-moon" : "#i-sun");
  }
  function setMode(m) {
    root.setAttribute("data-mode", m);
    try { localStorage.setItem("lucy-mode", m); } catch (e) {}
    readColors(); setModeLabel();
    if (reduce) draw(0, 0);
  }
  $("modeBtn").addEventListener("click", function () {
    setMode(root.getAttribute("data-mode") === "dawn" ? "night" : "dawn");
  });
  var saved = "night";
  try { saved = localStorage.getItem("lucy-mode") || "night"; } catch (e) {}
  root.setAttribute("data-mode", saved === "dawn" ? "dawn" : "night");

  /* ---------- Tiempo juntos ---------- */
  var sinceMs = CONFIG.since ? new Date(CONFIG.since).getTime() : NaN;
  function tick() {
    var box = $("together");
    if (isNaN(sinceMs) || Date.now() < sinceMs) { box.hidden = true; return; }
    box.hidden = false;
    var diff = Date.now() - sinceMs;
    var s = Math.floor(diff / 1000);
    $("tD").textContent = Math.floor(s / 86400);
    $("tH").textContent = Math.floor(s % 86400 / 3600);
    $("tM").textContent = Math.floor(s % 3600 / 60);
    $("tS").textContent = s % 60;
  }
  if (!isNaN(sinceMs)) setInterval(tick, 1000);

  /* ---------- 5) Easter eggs ---------- */
  // Toca el orbe: luz → lux → 光 → ひかり
  var orb = $("orb");
  orb.addEventListener("click", function () {
    setOrb((orbI + 1) % orbList.length);
    toast(dict[cur].orbToast[orbI]);
    orb.classList.remove("pulse"); void orb.offsetWidth; orb.classList.add("pulse");
    var r = orb.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, 16);
  });

  // Toca "Lucy": Lucy → Lucía → Lúcia → ルシア
  var forms = ["Lucy", "Lucía", "Lúcia", "ルシア"], formI = 0, titleEl = $("title");
  titleEl.addEventListener("click", function () {
    formI = (formI + 1) % forms.length;
    titleEl.textContent = forms[formI];
    titleEl.classList.toggle("jpname", formI === 3);
  });

  // Konami (↑ ↑ ↓ ↓ ← → ← → B A) o escribir "lucy": lluvia de corazones
  var konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65], ki = 0, typed = "";
  function surprise() { rain(); toast(dict[cur].rainToast); }
  window.addEventListener("keydown", function (e) {
    if (e.keyCode === konami[ki]) { ki++; if (ki === konami.length) { ki = 0; surprise(); } }
    else { ki = e.keyCode === konami[0] ? 1 : 0; }
    if (e.key && e.key.length === 1) {
      typed = (typed + e.key.toLowerCase()).slice(-4);
      if (typed === "lucy") { typed = ""; surprise(); }
    }
    if (e.key === "Escape") closeModal();
  });

  // Estrella escondida al final de la página: la posdata
  var modal = $("modal"), opener = null;
  function openModal() { opener = document.activeElement; modal.hidden = false; $("pdClose").focus(); burst(W / 2, H / 2, 30); }
  function closeModal() { if (modal.hidden) return; modal.hidden = true; if (opener && opener.focus) opener.focus(); }
  $("secret").addEventListener("click", openModal);
  $("pdClose").addEventListener("click", closeModal);
  modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });

  // Pista para quien abra la consola
  try {
    console.log("%cPara Lucy", "font: italic 700 28px Georgia; color:#ff8fb1");
    console.log("Hecho con cariño. Si buscas secretos: toca el orbe, toca su nombre, escribe su nombre, y baja hasta el final.");
  } catch (e) {}

  /* ---------- Brillo del cursor, destellos y progreso ---------- */
  var glow = $("glow");
  window.addEventListener("pointermove", function (e) {
    glow.classList.add("on");
    glow.style.transform = "translate(" + e.clientX + "px," + e.clientY + "px) translate(-50%,-50%)";
  });
  window.addEventListener("pointerdown", function (e) { burst(e.clientX, e.clientY, 10); });
  var bar = $("progress"), ticking = false;
  function progress() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = "scaleX(" + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ")";
    ticking = false;
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(progress); } }, { passive: true });

  /* ---------- Aparición al hacer scroll ---------- */
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    items.forEach(function (n) { io.observe(n); });
  } else {
    items.forEach(function (n) { n.classList.add("in"); });
  }

  /* ---------- Arranque ---------- */
  size(); readColors();
  window.addEventListener("resize", function () { size(); if (reduce) draw(0, 0); });
  apply(location.hash.slice(1));
  progress();
  if (reduce) { draw(0, 0); } else { requestAnimationFrame(function (n) { last = n / 1000; frame(n); }); }
})();
