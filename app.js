(function () {
  var CHIP_ORDER = ["all", "sick", "hurt", "skin", "feeding", "sleep", "behavior", "care", "growing", "pregnancy"];
  var state = { cat: "all", q: "" };

  var $ = function (id) { return document.getElementById(id); };
  var home = $("home"), detail = $("detail"), grid = $("grid"), chips = $("chips");

  function el(tag, attrs, text) {
    var n = document.createElement(tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;
    return n;
  }

  function renderChips() {
    chips.innerHTML = "";
    CHIP_ORDER.forEach(function (id) {
      var label = id === "all" ? "Everything" : CATS[id].label;
      var b = el("button", { type: "button", "class": "chip", "aria-pressed": String(state.cat === id) }, label);
      b.addEventListener("click", function () { state.cat = id; renderChips(); renderGrid(); });
      chips.appendChild(b);
    });
  }

  function matches(d) {
    if (state.cat !== "all" && d.cat !== state.cat) return false;
    var q = state.q.trim().toLowerCase();
    if (!q) return true;
    var hay = (d.label + " " + d.keys).toLowerCase();
    return q.split(/\s+/).every(function (w) { return hay.indexOf(w) !== -1; });
  }

  function renderGrid() {
    grid.innerHTML = "";
    var list = DATA.filter(matches);
    list.forEach(function (d) {
      var c = CATS[d.cat];
      var a = el("a", { href: "#" + d.id, "class": "tile" });
      a.style.background = c.bg;
      var tag = el("span", { "class": "tag" }, c.label);
      tag.style.color = c.tag;
      a.appendChild(tag);
      a.appendChild(el("span", { "class": "tile-label" }, d.label));
      grid.appendChild(a);
    });
    $("empty").hidden = list.length > 0;
    $("count").textContent = list.length === DATA.length ? DATA.length + " situations" : list.length + " of " + DATA.length + " situations";
  }

  function fillList(ul, items) {
    ul.innerHTML = "";
    items.forEach(function (t) { ul.appendChild(el("li", {}, t)); });
  }

  function showDetail(d) {
    var c = CATS[d.cat];
    $("d-cat").textContent = c.label;
    $("d-cat").style.color = c.tag;
    $("detail-title").textContent = "My baby is " + d.label;
    $("d-normal").textContent = d.normal;
    fillList($("d-now"), d.now);
    fillList($("d-doc"), d.callDoc);
    fillList($("d-try"), d.tryList);
    $("d-now-wrap").hidden = d.now.length === 0;
    $("d-now-wrap").style.display = d.now.length ? "" : "none";
    $("d-calm").style.display = d.now.length ? "none" : "";
    $("d-fine").textContent = d.cat === "pregnancy"
      ? "Unsure? Trust your gut and call your OB, midwife, or labor and delivery. They are there 24 hours a day."
      : "Unsure? Trust your gut and call your pediatrician. Most offices have a 24-hour nurse line.";
    home.hidden = true;
    detail.hidden = false;
    document.title = "My baby is " + d.label + " | help! My baby is:";
    window.scrollTo(0, 0);
    $("detail-title").setAttribute("tabindex", "-1");
    $("detail-title").focus({ preventScroll: true });
  }

  function showHome() {
    detail.hidden = true;
    home.hidden = false;
    document.title = "help! My baby is:";
  }

  function route() {
    var id = location.hash.slice(1);
    var d = DATA.find(function (x) { return x.id === id; });
    if (d) { showDetail(d); return; }
    showHome();
    if (id === "numbers") { var n = $("numbers"); if (n) n.scrollIntoView(); }
  }

  $("search").addEventListener("input", function (e) { state.q = e.target.value; renderGrid(); });

  // Pediatrician number, kept only in this browser
  function loadPed() {
    var num = "";
    try { num = localStorage.getItem("ped-number") || ""; } catch (e) {}
    var span = $("ped-num"), nurse = $("qb-nurse");
    if (num) {
      span.innerHTML = "";
      span.appendChild(el("a", { href: "tel:" + num.replace(/[^\d+]/g, "") }, num));
      $("ped").value = num;
      nurse.href = "tel:" + num.replace(/[^\d+]/g, "");
    } else {
      span.textContent = "add it below";
      nurse.href = "#numbers";
    }
  }
  $("ped-form").addEventListener("submit", function (e) {
    e.preventDefault();
    try { localStorage.setItem("ped-number", $("ped").value.trim()); } catch (err) {}
    loadPed();
  });

  window.addEventListener("hashchange", route);
  renderChips();
  renderGrid();
  loadPed();
  route();
})();
