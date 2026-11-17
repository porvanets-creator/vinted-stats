'use strict';
/* ===== config ===== */
const GH = { owner: 'porvanets-creator', repo: 'vinted-stats-data', path: 'data.json', branch: 'main' };
const MONTHS = ['Січень','Лютий','Березень','Квітень','Травень','Червень','Липень','Серпень','Вересень','Жовтень','Листопад','Грудень'];
const MONTHS_SHORT = ['Січ','Лют','Бер','Кві','Тра','Чер','Лип','Сер','Вер','Жов','Лис','Гру'];
const DOW = ['Нд','Пн','Вт','Ср','Чт','Пт','Сб'];
const CATS = ['Закупка (секонд)','Просування Vinted','Пакування','Пошта','Інше'];
const ACC_COLORS = ['#262626','#7a7a7a','#b0b0b0','#4f6d5c','#c9c9c9'];

const ICONS = {
  home:'<svg viewBox="0 0 24 24"><path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z"/></svg>',
  user:'<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
  wallet:'<svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="14" rx="3"/><path d="M16 13h2M3 10h18M6 6l9-3 1 3"/></svg>',
  clock:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
  gear:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M4.2 6.5l2.6 1.5M17.2 16l2.6 1.5M4.2 17.5l2.6-1.5M17.2 8l2.6-1.5"/></svg>',
  chart:'<svg viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
  cal:'<svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="15" rx="3"/><path d="M4 10h16M9 3v4M15 3v4"/></svg>',
  box:'<svg viewBox="0 0 24 24"><path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/></svg>',
  star:'<svg viewBox="0 0 24 24"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/></svg>',
  trophy:'<svg viewBox="0 0 24 24"><path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 20h8"/></svg>',
  target:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/></svg>',
  trend:'<svg viewBox="0 0 24 24"><path d="M3 17l6-6 4 4 8-8M15 7h6v6"/></svg>',
  swap:'<svg viewBox="0 0 24 24"><path d="M7 7h13l-4-4M17 17H4l4 4"/></svg>',
  plus:'<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
  check:'<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  coin:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M15 9.5c-.5-1-1.6-1.5-3-1.5-1.7 0-3 .9-3 2s1.3 1.7 3 2 3 .9 3 2-1.3 2-3 2c-1.4 0-2.5-.5-3-1.5M12 6v2M12 16v2"/></svg>'
};

/* ===== state ===== */
const S = { data: null, sha: null, route: 'panel', month: null, saving: false, charts: [] };
const $ = s => document.querySelector(s);
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
  del(k) { try { localStorage.removeItem(k); } catch (e) {} }
};
const isLocal = ['localhost', '127.0.0.1'].includes(location.hostname);

/* ===== helpers ===== */
const r2 = n => Math.round((n + Number.EPSILON) * 100) / 100;
const nf2 = new Intl.NumberFormat('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const money = n => nf2.format(r2(n || 0)) + ' zł';
const moneyShort = n => Math.abs(n) >= 1000 ? (n / 1000).toLocaleString('uk-UA', { maximumFractionDigits: 1 }) + 'k' : String(Math.round(n));
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ymOf = d => d.slice(0, 7);
const dmy = d => `${d.slice(8, 10)}.${d.slice(5, 7)}.${d.slice(0, 4)}`;
const monthName = ym => `${MONTHS[+ym.slice(5, 7) - 1]} ${ym.slice(0, 4)}`;
const shiftYM = (ym, k) => { let y = +ym.slice(0, 4), m = +ym.slice(5, 7) - 1 + k; y += Math.floor(m / 12); m = ((m % 12) + 12) % 12; return `${y}-${String(m + 1).padStart(2, '0')}`; };
const daysIn = ym => new Date(+ym.slice(0, 4), +ym.slice(5, 7), 0).getDate();
const todayISO = () => { const t = new Date(); return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`; };
const hm = min => { if (min == null) return '—'; const h = Math.floor(min / 60), m = Math.round(min % 60); return `${h} год ${String(m).padStart(2, '0')} хв`; };
const hmShort = min => { if (!min) return '0:00'; const h = Math.floor(min / 60), m = Math.round(min % 60); return `${h}:${String(m).padStart(2, '0')}`; };
const sum = (arr, f) => r2(arr.reduce((a, x) => a + (+f(x) || 0), 0));
const uid = p => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
function pct(cur, prev) {
  if (!prev) return '<span class="chg flat">— немає даних для порівняння</span>';
  const p = cur / prev - 1, v = Math.round(p * 100);
  if (v === 0) return '<span class="chg flat">→ 0%</span>';
  return `<span class="chg ${v > 0 ? 'up' : 'down'}">${v > 0 ? '↑ +' : '↓ −'}${Math.abs(v)}%</span>`;
}
function diffHtml(cur, prev) {
  if (!prev) return '<div class="mid flat">немає даних</div>';
  const d = r2(cur - prev);
  return `<div class="mid ${d > 0 ? 'up' : d < 0 ? 'down' : ''}">${d > 0 ? '+' : d < 0 ? '−' : ''}${money(Math.abs(d))}</div>`;
}
function toast(msg, ms = 2200) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), ms); }

/* ===== data access ===== */
const sales = acc => S.data.sales.filter(s => !acc || s.account === acc);
const inYM = (arr, ym) => arr.filter(x => ymOf(x.date) === ym);
const inRange = (arr, a, b) => arr.filter(x => x.date >= a && x.date <= b);
function byDay(arr) { const m = {}; arr.forEach(s => { m[s.date] = r2((m[s.date] || 0) + s.amount); }); return Object.entries(m).map(([date, amount]) => ({ date, amount })); }
function byMonth(arr) { const m = {}; arr.forEach(s => { const k = ymOf(s.date); m[k] = r2((m[k] || 0) + s.amount); }); return m; }
function ytd(arr, ym) { const y = ym.slice(0, 4); return sum(inRange(arr, `${y}-01-01`, `${ym}-31`), s => s.amount); }
function ytdPrev(arr, ym) { const y = +ym.slice(0, 4) - 1; return sum(inRange(arr, `${y}-01-01`, `${y}${ym.slice(4)}-31`), s => s.amount); }
function monthsAvailable() {
  const set = new Set([ymOf(todayISO())]);
  ['sales', 'expenses', 'work'].forEach(k => S.data[k].forEach(x => set.add(ymOf(x.date))));
  const list = [...set].sort();
  const first = list[0], last = list[list.length - 1], out = [];
  for (let ym = first; ym <= last; ym = shiftYM(ym, 1)) out.push(ym);
  return out.reverse();
}

/* ===== GitHub storage ===== */
const b64enc = s => { const bytes = new TextEncoder().encode(s); let bin = ''; for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000)); return btoa(bin); };
const b64dec = b => new TextDecoder().decode(Uint8Array.from(atob(b.replace(/\n/g, '')), c => c.charCodeAt(0)));
const ghUrl = () => `https://api.github.com/repos/${GH.owner}/${GH.repo}/contents/${GH.path}`;
const ghHeaders = () => ({ Authorization: `Bearer ${store.get('vs_token')}`, Accept: 'application/vnd.github+json' });

async function load() {
  const token = store.get('vs_token');
  if (token) {
    const r = await fetch(`${ghUrl()}?ref=${GH.branch}&t=${Date.now()}`, { headers: ghHeaders(), cache: 'no-store' });
    if (r.status === 401 || r.status === 403 || r.status === 404) throw new Error('token');
    if (!r.ok) throw new Error('net');
    const j = await r.json();
    S.sha = j.sha; S.data = JSON.parse(b64dec(j.content)); S.mode = 'github';
    store.set('vs_cache', JSON.stringify(S.data));
    return;
  }
  if (isLocal) {
    const r = await fetch('data.local.json', { cache: 'no-store' });
    if (r.ok) { S.data = await r.json(); S.mode = 'local'; return; }
  }
  throw new Error('token');
}

async function save(message, mutate) {
  if (S.saving) return false;
  const backup = JSON.stringify(S.data);
  mutate(S.data);
  if (S.mode === 'offline') { S.data = JSON.parse(backup); toast('Немає інтернету — зберегти не вийде. Спробуйте пізніше.', 4000); return false; }
  if (S.mode !== 'github') { toast('Тестовий режим: зміни не зберігаються'); render(); return true; }
  S.saving = true; toast('Зберігаю…', 10000);
  try {
    const body = { message, content: b64enc(JSON.stringify(S.data, null, 1)), sha: S.sha, branch: GH.branch };
    const r = await fetch(ghUrl(), { method: 'PUT', headers: { ...ghHeaders(), 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (r.status === 409 || r.status === 422) { S.data = JSON.parse(backup); await load(); render(); toast('Дані змінились на іншому пристрої. Оновив — повторіть, будь ласка.', 4000); return false; }
    if (!r.ok) throw new Error(r.status);
    const j = await r.json(); S.sha = j.content.sha;
    store.set('vs_cache', JSON.stringify(S.data));
    toast('Збережено ✓'); render(); return true;
  } catch (e) {
    S.data = JSON.parse(backup); render();
    toast('Не вдалося зберегти. Перевірте інтернет і спробуйте ще раз.', 4000); return false;
  } finally { S.saving = false; }
}

/* ===== nav ===== */
function routes() {
  const acc = S.data ? S.data.accounts : [];
  return [{ id: 'panel', label: 'Панель', icon: 'home' }]
    .concat(acc.map(a => ({ id: 'acc:' + a.id, label: a.id, icon: 'user', tag: a.status === 'archive' ? 'архів' : '' })))
    .concat([null, { id: 'expenses', label: 'Витрати', icon: 'wallet' }, { id: 'work', label: 'Час роботи', icon: 'clock' }]);
}
function renderNav() {
  $('#nav').innerHTML = routes().map(r => r ? `<a href="#${r.id}" class="${S.route === r.id ? 'active' : ''}">${ICONS[r.icon]}<span>${esc(r.label)}</span>${r.tag ? `<span class="tag">${r.tag}</span>` : ''}</a>` : '<hr>').join('');
  $('#navFoot').innerHTML = `<a href="#settings" class="${S.route === 'settings' ? 'active' : ''}">${ICONS.gear}<span>Налаштування</span></a>`;
}
function openDrawer(v) { $('#drawer').classList.toggle('open', v); $('#scrim').classList.toggle('show', v); }
$('#menuBtn').onclick = () => openDrawer(true);
$('#scrim').onclick = () => openDrawer(false);
window.addEventListener('hashchange', () => { S.route = decodeURIComponent(location.hash.slice(1)) || 'panel'; openDrawer(false); render(); window.scrollTo(0, 0); });
$('#monthSel').onchange = e => { S.month = e.target.value; store.set('vs_month', S.month); render(); };

/* ===== charts ===== */
function killCharts() { S.charts.forEach(c => c.destroy()); S.charts = []; }
function cssVar(n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }
function chart(id, cfg) {
  if (!window.Chart) return;
  const el = document.getElementById(id); if (!el) return;
  Chart.defaults.font.family = getComputedStyle(document.body).fontFamily;
  Chart.defaults.color = cssVar('--muted');
  S.charts.push(new Chart(el, cfg));
}
const gridOpts = () => ({ grid: { color: cssVar('--line') }, border: { display: false } });

/* ===== periods ===== */
const MONTHS_GEN = ['січня','лютого','березня','квітня','травня','червня','липня','серпня','вересня','жовтня','листопада','грудня'];
const pad2 = n => String(n).padStart(2, '0');
const lc = s => s.charAt(0).toLowerCase() + s.slice(1);
// P = { kind, start, end, prev:{start,end}, same:{start,end}|null, ... labels }
function period(key) {
  const today = todayISO();
  if (key.startsWith('Y')) {
    const y = +key.slice(1), start = `${y}-01-01`, end = `${y}-12-31`;
    const ongoing = today >= start && today <= end;
    let sameEnd = `${y - 1}${today.slice(4)}`; if (sameEnd.endsWith('02-29')) sameEnd = `${y - 1}-02-28`;
    return { kind: 'year', key, year: String(y), start, end, ongoing,
      prev: { start: `${y - 1}-01-01`, end: `${y - 1}-12-31` },
      same: ongoing ? { start: `${y - 1}-01-01`, end: sameEnd } : null,
      unit: 'рік', name: `${y} рік`, cmpTitle: 'Порівняння з минулим роком',
      sameLabel: `1 січня – ${+today.slice(8)} ${MONTHS_GEN[+today.slice(5, 7) - 1]} ${y - 1}`,
      wholeLabel: ongoing ? `весь ${y - 1} рік` : `${y - 1} рік`, prevName: `${y - 1} рік` };
  }
  const ym = key, pym = shiftYM(ym, -1), dP = daysIn(pym);
  const ongoing = ym === ymOf(today), day = Math.min(+today.slice(8), dP);
  return { kind: 'month', key, ym, year: ym.slice(0, 4), start: `${ym}-01`, end: `${ym}-${pad2(daysIn(ym))}`, ongoing,
    prev: { start: `${pym}-01`, end: `${pym}-${pad2(dP)}` },
    same: ongoing ? { start: `${pym}-01`, end: `${pym}-${pad2(day)}` } : null,
    unit: 'місяць', name: monthName(ym), cmpTitle: 'Порівняння з минулим місяцем',
    sameLabel: `1–${day} ${MONTHS_GEN[+pym.slice(5) - 1]}`,
    wholeLabel: ongoing ? `весь ${lc(MONTHS[+pym.slice(5) - 1])}` : monthName(pym), prevName: monthName(pym) };
}
const P = () => period(S.month);
const forP = (arr, p) => inRange(arr, p.start, p.end);
// one comparison line
function cmpLine(cur, prev, label, invert) {
  if (!prev) return `<div class="cmp"><span class="chg flat">—</span><span class="sub">немає даних · ${label}</span></div>`;
  const v = Math.round((cur / prev - 1) * 100);
  const good = invert ? v < 0 : v > 0;
  const cls = v === 0 ? 'flat' : good ? 'up' : 'down';
  const txt = v === 0 ? '→ 0%' : v > 0 ? `↑ +${v}%` : `↓ −${Math.abs(v)}%`;
  return `<div class="cmp"><span class="chg ${cls}">${txt}</span><span class="sub">${label}</span></div>`;
}
// f(start,end) → number; shows "same period" line (if period is ongoing) + "whole previous period" line
function cmp(cur, f, p, invert) {
  if (!f(p.prev.start, p.prev.end)) return `<div class="cmps"><div class="cmp"><span class="chg flat">—</span><span class="sub">немає даних за ${p.kind === 'year' ? p.prevName : lc(p.prevName)} для порівняння</span></div></div>`;
  let h = '';
  const mode = cmpMode();
  if (p.same && mode !== 'whole') h += cmpLine(cur, f(p.same.start, p.same.end), `vs ${p.sameLabel}`, invert);
  if (!p.same || mode !== 'same') h += cmpLine(cur, f(p.prev.start, p.prev.end), `vs ${p.wholeLabel}`, invert);
  return `<div class="cmps">${h}</div>`;
}
function diffBlock(cur, prev, title, sub) {
  const d = r2(cur - prev);
  const val = !prev ? '<div class="mid flat">немає даних</div>'
    : `<div class="mid ${d > 0 ? 'up' : d < 0 ? 'down' : ''}">${d > 0 ? '+' : d < 0 ? '−' : ''}${money(Math.abs(d))}</div>`;
  return `<div class="diff"><div class="sub">${title}</div>${val}<div class="sub">${sub}</div></div>`;
}
function monthOptions() {
  const months = monthsAvailable(), out = [];
  let lastY = null;
  months.forEach(ym => { const y = ym.slice(0, 4); if (y !== lastY) { out.push({ v: 'Y' + y, t: `Весь ${y} рік` }); lastY = y; } out.push({ v: ym, t: monthName(ym) }); });
  return out;
}
function focusDate(date) { if (!(S.month.startsWith('Y') && S.month.slice(1) === date.slice(0, 4))) S.month = ymOf(date); store.set('vs_month', S.month); }
const dowOf = d => DOW[new Date(d + 'T12:00').getDay()];
const sepRow = (k, cols, extra) => `<tr class="sep"><td colspan="${cols}">${monthName(k)}${extra ? ` · ${extra}` : ''}</td></tr>`;

/* ===== views ===== */
function render() {
  killCharts(); renderNav();
  const r = S.route, fab = $('#fab');
  $('#monthWrap').hidden = r === 'settings';
  if (S.data) {
    const opts = monthOptions(), vals = opts.map(o => o.v);
    if (!S.month || !vals.includes(S.month)) S.month = vals.includes(store.get('vs_month')) ? store.get('vs_month') : ymOf(todayISO());
    $('#monthSel').innerHTML = opts.map(o => `<option value="${o.v}" ${o.v === S.month ? 'selected' : ''}>${o.t}</option>`).join('');
  }
  $('#pageStatus').textContent = ''; $('#pageStatus').className = 'status';
  fab.hidden = true;
  if (r === 'settings' || !S.data) return viewSettings();
  if (r.startsWith('acc:')) { fab.hidden = false; fab.onclick = () => saleForm(r.slice(4)); return viewAccount(r.slice(4)); }
  if (r === 'expenses') { fab.hidden = false; fab.onclick = () => expenseForm(); return viewExpenses(); }
  if (r === 'work') { fab.hidden = false; fab.onclick = () => workForm(); return viewWork(); }
  return viewPanel();
}
function setTitle(t) { $('#pageTitle').textContent = t; document.title = `${t} · Vinted`; }
function kpi(icon, label, value, extra = '', cls = '') {
  return `<div class="card ${cls}"><div class="label">${ICONS[icon]}${label}</div><div class="big">${value}</div>${extra}</div>`;
}
const perLabel = (p, m, y) => p.kind === 'year' ? y : m;

function viewAccount(id) {
  const acc = S.data.accounts.find(a => a.id === id);
  if (!acc) { location.hash = 'panel'; return; }
  setTitle(id);
  const st = $('#pageStatus'); st.textContent = acc.status === 'archive' ? '● Архів' : '● Активний'; st.className = 'status' + (acc.status === 'archive' ? ' archive' : '');
  const p = P(), all = sales(id), cur = forP(all, p);
  const S_ = (a, b) => sum(inRange(all, a, b), x => x.amount), I_ = (a, b) => sum(inRange(all, a, b), x => x.items);
  const A_ = (a, b) => { const i = I_(a, b); return i ? S_(a, b) / i : 0; };
  const sCur = sum(cur, x => x.amount), iCur = sum(cur, x => x.items), avg = iCur ? sCur / iCur : 0;
  const allSum = sum(all, x => x.amount), allItems = sum(all, x => x.items);
  const firstDate = all.length ? all.map(x => x.date).sort()[0] : null;
  const bm = Object.entries(byMonth(all)).sort((a, b) => b[1] - a[1])[0];
  const best = byDay(cur).sort((a, b) => b.amount - a.amount).slice(0, 3);
  const totalAll = sum(forP(sales(), p), x => x.amount);
  const sorted = [...cur].sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
  const runMap = {}, mTot = {}; let run = 0, lastM = null;
  sorted.forEach(s => { const m = ymOf(s.date); if (m !== lastM) { run = 0; lastM = m; } run = r2(run + s.amount); runMap[s.id] = run; mTot[m] = run; });
  let rowsHtml = '', lm = null;
  [...sorted].reverse().forEach(s => {
    const m = ymOf(s.date);
    if (p.kind === 'year' && m !== lm) { rowsHtml += sepRow(m, 3, money(mTot[m])); lm = m; }
    rowsHtml += `<tr class="tap" data-id="${s.id}"><td>${dmy(s.date)} <span class="muted">${dowOf(s.date)}</span></td><td>${s.items}</td><td><b>${money(s.amount)}</b><div class="sub">${money(runMap[s.id])}</div></td></tr>${prodLine(s)}`;
  });
  const sP = S_(p.prev.start, p.prev.end), sS = p.same ? S_(p.same.start, p.same.end) : 0;

  $('#view').innerHTML = `
  <div class="grid g4">
    ${kpi('chart', 'Продажі за весь час', money(allSum), `<div class="sub">${allItems} речей${firstDate ? ` · з ${dmy(firstDate)}` : ''}</div>`, 'dark')}
    ${kpi('cal', perLabel(p, 'Продажі за місяць', 'Продажі за рік'), money(sCur), cmp(sCur, S_, p))}
    ${kpi('box', 'Кількість проданих речей', iCur, cmp(iCur, I_, p))}
    ${kpi('star', 'Середній чек', money(avg), cmp(avg, A_, p))}
  </div>
  <div class="grid g3">
    <div class="card span2-m"><div class="card-head"><div class="label">${ICONS.swap}${p.cmpTitle}</div>${p.same ? `<button class="mini-btn" id="cmpMode" aria-label="Що показувати">${ICONS.plus}</button>` : ''}</div>
      ${!sP ? `<div class="mid flat">немає даних</div><div class="sub">за ${p.kind === 'year' ? p.prevName : lc(p.prevName)} продажів не записано</div>` : `
      ${p.same && cmpMode() !== 'whole' ? diffBlock(sCur, sS, `За той самий час (${p.sameLabel})`, `${p.sameLabel}: ${money(sS)}`) : ''}
      ${!p.same || cmpMode() !== 'same' ? diffBlock(sCur, sP, p.same ? `За ${p.wholeLabel}` : `Проти: ${p.prevName}`, `${p.prevName}: ${money(sP)}`) : ''}`}
    </div>
    <div class="card span2-m"><div class="label">${ICONS.trophy}Найкращий місяць</div>${bm ? `<div class="mid">${monthName(bm[0])}</div><div class="chg up">${money(bm[1])}</div>` : '<div class="mid flat">—</div>'}<div class="sub">за весь час</div></div>
    <div class="card span2-m"><div class="label">${ICONS.star}${perLabel(p, 'Найкращі дні місяця', 'Найкращі дні року')}</div><div class="list-days">${best.length ? best.map(b => `<div><span>${dmy(b.date)}</span><b>${money(b.amount)}</b></div>`).join('') : '<div class="sub">ще немає продажів</div>'}</div></div>
  </div>
  <div class="card">
    <div class="section-title"><h2>Продажі акаунта</h2><span class="sub">${totalAll ? `${Math.round(sCur / totalAll * 100)}% усіх продажів` : ''}</span></div>
    ${sorted.length ? `<div class="scroll-x"><table class="table"><thead><tr><th>Дата</th><th>Речей</th><th>Сума<br><span style="font-weight:400">наростаючим за місяць</span></th></tr></thead><tbody>${rowsHtml}</tbody></table></div>`
      : `<div class="empty">${acc.status === 'archive' ? 'Дані цього акаунта ще не перенесені.' : `За ${p.kind === 'year' ? 'цей рік' : 'цей місяць'} ще немає продажів.<br>Натисніть «+», щоб додати.`}</div>`}
  </div>`;
  $('#view').querySelectorAll('tr.tap').forEach(tr => tr.onclick = () => saleForm(id, S.data.sales.find(s => s.id === tr.dataset.id)));
  if ($('#cmpMode')) $('#cmpMode').onclick = () => cmpModeSheet(p);
}
const cmpMode = () => ['same', 'whole', 'both'].includes(store.get('vs_cmpmode')) ? store.get('vs_cmpmode') : 'both';
function cmpModeSheet(p) {
  const cur = cmpMode();
  const opt = (v, t, d) => `<button class="opt ${cur === v ? 'on' : ''}" data-v="${v}"><span><b>${t}</b><small>${d}</small></span>${cur === v ? ICONS.check : ''}</button>`;
  openSheet(`<h3>Що показувати в порівнянні</h3><div class="src">Діє на всі картки на всіх сторінках</div>
    ${opt('same', 'За той самий час', `наприклад, ${p.sameLabel}`)}
    ${opt('whole', `За ${p.kind === 'year' ? 'весь минулий рік' : 'весь минулий місяць'}`, `наприклад, ${p.wholeLabel}`)}
    ${opt('both', 'Обидва варіанти', 'один під одним')}
    <button class="btn ghost" id="cancel">Закрити</button>`, el => {
    el.querySelector('#cancel').onclick = closeSheet;
    el.querySelectorAll('.opt').forEach(b => b.onclick = () => { store.set('vs_cmpmode', b.dataset.v); closeSheet(); render(); });
  });
}

function viewPanel() {
  setTitle('Панель');
  const p = P(), year = p.year, all = sales(), cur = forP(all, p);
  const S_ = (a, b) => sum(inRange(all, a, b), x => x.amount);
  const E_ = (a, b) => sum(inRange(S.data.expenses, a, b), x => x.amount);
  const M_ = (a, b) => sum(inRange(S.data.work, a, b), x => x.minutes);
  const PR_ = (a, b) => r2(S_(a, b) - E_(a, b));
  const H_ = (a, b) => { const m = M_(a, b); return m ? PR_(a, b) / (m / 60) : 0; };
  const sCur = sum(cur, x => x.amount), iCur = sum(cur, x => x.items);
  const eCur = E_(p.start, p.end), mCur = M_(p.start, p.end), profit = r2(sCur - eCur), hourly = mCur ? profit / (mCur / 60) : 0;
  const goal = (+S.data.settings.goal || 0) * (p.kind === 'year' ? 12 : 1), goalP = goal ? Math.min(100, sCur / goal * 100) : 0;
  const today = todayISO();
  let forecast = sCur;
  if (p.ongoing) {
    const t0 = new Date(p.start + 'T12:00'), t1 = new Date(p.end + 'T12:00'), tn = new Date(today + 'T12:00');
    const done = Math.round((tn - t0) / 864e5) + 1, total = Math.round((t1 - t0) / 864e5) + 1;
    forecast = sCur / done * total;
  }
  const bestDay = byDay(cur).sort((a, b) => b.amount - a.amount)[0];
  const bm = Object.entries(byMonth(all)).sort((a, b) => b[1] - a[1])[0];
  const accs = S.data.accounts.map((a, i) => { const x = forP(sales(a.id), p); return { ...a, s: sum(x, y => y.amount), n: sum(x, y => y.items), c: ACC_COLORS[i % ACC_COLORS.length] }; });
  const months = []; for (let m = 1; m <= 12; m++) months.push(`${year}-${pad2(m)}`);
  const mrows = months.map(k => {
    const sl = inYM(all, k), s = sum(sl, x => x.amount), n = sum(sl, x => x.items), e = sum(inYM(S.data.expenses, k), x => x.amount), w = sum(inYM(S.data.work, k), x => x.minutes);
    return { k, s, n, e, p: r2(s - e), w };
  });

  $('#view').innerHTML = `
  <div class="grid g3">
    <div class="card dark span2-m"><div class="card-head"><div class="label">${ICONS.cal}${perLabel(p, 'Продажі за місяць', 'Продажі за рік')}</div>${p.same ? `<button class="mini-btn" id="cmpMode" aria-label="Що порівнювати">${ICONS.plus}</button>` : ''}</div><div class="big">${money(sCur)}</div>${cmp(sCur, S_, p)}<div class="sub" style="margin-top:6px">${iCur} речей · середній чек ${money(iCur ? sCur / iCur : 0)}</div></div>
    ${kpi('chart', 'Продажі за весь час', money(sum(all, x => x.amount)), `<div class="sub">${sum(all, x => x.items)} речей · усі акаунти</div>`)}
    ${kpi('wallet', perLabel(p, 'Витрати за місяць', 'Витрати за рік'), money(eCur), cmp(eCur, E_, p, true))}
    ${kpi('coin', 'Чистий прибуток', money(profit), cmp(profit, PR_, p))}
    ${kpi('clock', 'Вартість години', mCur ? money(hourly) : '—', `${mCur ? cmp(hourly, H_, p) : ''}<div class="sub">${hmShort(mCur)} год роботи (приблизно)</div>`)}
    <div class="card span2-m"><div class="label">${ICONS.target}${perLabel(p, 'Ціль на місяць', 'Ціль на рік')}</div><div class="mid">Виконано ${Math.round(goalP)}%</div>
      <div class="progress"><i style="width:${goalP}%"></i></div>
      <div class="goal-row"><span>${money(sCur)}</span><span>з ${money(goal)}</span></div>
      <div class="sub" style="margin-top:8px">${ICONS.trend.replace('<svg', '<svg style="width:14px;height:14px;vertical-align:-2px"')} Прогноз на кінець ${p.kind === 'year' ? 'року' : 'місяця'}: <b style="color:var(--ink)">${money(forecast)}</b></div></div>
  </div>
  <div class="card">
    <div class="section-title"><h2>Продажі по місяцях</h2><span class="sub">${year}</span></div>
    <div class="chart-box"><canvas id="cMonths"></canvas></div>
  </div>
  <div class="grid g3">
    <div class="card span2"><div class="section-title"><h2>${p.kind === 'year' ? 'Ріст суми за рік' : 'Ріст суми за місяць'}</h2><span class="sub">${p.kind === 'year' ? `${year} vs ${year - 1}` : `${lc(MONTHS[+p.ym.slice(5) - 1])} vs ${lc(MONTHS[+p.prev.start.slice(5, 7) - 1])}`}</span></div><div class="chart-box small"><canvas id="cRun"></canvas></div></div>
    <div class="card span2-m"><div class="section-title"><h2>Акаунти</h2><span class="sub">${p.name}</span></div>
      ${sCur ? `<div class="chart-box small"><canvas id="cAcc"></canvas></div>` : ''}
      ${accs.map(a => `<a href="#acc:${a.id}" style="color:inherit;text-decoration:none"><div class="acc-row"><span class="dot" style="background:${a.c}"></span><span class="name">${esc(a.id)}<small>${a.n} речей${a.status === 'archive' ? ' · архів' : ''}</small></span><b>${money(a.s)}</b></div></a>`).join('')}
      <div class="acc-row"><span class="dot" style="background:transparent"></span><span class="name">Разом</span><b>${money(sCur)}</b></div>
    </div>
  </div>
  <div class="grid">
    <div class="card"><div class="label">${ICONS.star}${perLabel(p, 'Найкращий день місяця', 'Найкращий день року')}</div>${bestDay ? `<div class="mid">${dmy(bestDay.date)}</div><div class="chg up">${money(bestDay.amount)}</div>` : '<div class="mid flat">—</div>'}</div>
    <div class="card"><div class="label">${ICONS.trophy}Найкращий місяць</div>${bm ? `<div class="mid">${monthName(bm[0])}</div><div class="chg up">${money(bm[1])}</div>` : '<div class="mid flat">—</div>'}<div class="sub">за весь час</div></div>
  </div>
  <div class="card">
    <div class="section-title"><h2>Підсумок по місяцях</h2><span class="sub">${year}</span></div>
    <div class="scroll-x"><table class="table"><thead><tr><th>Місяць</th><th>Речей</th><th>Продажі</th><th>Витрати</th><th>Прибуток</th><th>Години</th><th>Δ</th></tr></thead><tbody>
    ${mrows.filter(m => m.s || m.e || m.w).reverse().map(m => { const pr = mrows.find(x => x.k === shiftYM(m.k, -1)); const ps = pr ? pr.s : 0; return `<tr><td>${MONTHS[+m.k.slice(5) - 1]}</td><td>${m.n}</td><td><b>${money(m.s)}</b></td><td class="muted">${money(m.e)}</td><td>${money(m.p)}</td><td class="muted">${hmShort(m.w)}</td><td>${ps ? pct(m.s, ps) : '<span class="chg flat">—</span>'}</td></tr>`; }).join('') || '<tr><td colspan="7" class="empty">Немає даних</td></tr>'}
    </tbody></table></div>
  </div>`;

  const ink = cssVar('--ink'), muted = cssVar('--muted');
  chart('cMonths', { type: 'bar', data: { labels: MONTHS_SHORT, datasets: [{ data: mrows.map(m => m.s), backgroundColor: mrows.map(m => p.kind === 'month' && m.k === p.ym ? muted : ink), borderRadius: 10, borderSkipped: false, maxBarThickness: 34 }] },
    options: { maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => money(c.raw) } } }, scales: { x: { grid: { display: false }, border: { display: false } }, y: { ...gridOpts(), ticks: { callback: v => moneyShort(v) } } } } });
  let labels, curSeries, prevSeries, curName, prevName;
  if (p.kind === 'month') {
    const series = k => { const days = daysIn(k), byD = {}; inYM(all, k).forEach(s => { const d = +s.date.slice(8); byD[d] = (byD[d] || 0) + s.amount; }); let a = 0; const out = []; const lim = k === ymOf(today) ? +today.slice(8) : days; for (let d = 1; d <= days; d++) { a += byD[d] || 0; out.push(d <= lim ? r2(a) : null); } return out; };
    const pym = ymOf(p.prev.start), n = Math.max(daysIn(p.ym), daysIn(pym));
    labels = Array.from({ length: n }, (_, i) => i + 1); curSeries = series(p.ym); prevSeries = series(pym); curName = monthName(p.ym); prevName = monthName(pym);
  } else {
    const series = y => { let a = 0; const out = []; for (let m = 1; m <= 12; m++) { const k = `${y}-${pad2(m)}`; a += sum(inYM(all, k), x => x.amount); out.push(k <= ymOf(today) ? r2(a) : null); } return out; };
    labels = MONTHS_SHORT; curSeries = series(year); prevSeries = series(year - 1); curName = `${year}`; prevName = `${year - 1}`;
  }
  chart('cRun', { type: 'line', data: { labels, datasets: [
    { label: curName, data: curSeries, borderColor: ink, backgroundColor: ink, tension: .3, pointRadius: 0, borderWidth: 2.5 },
    { label: prevName, data: prevSeries, borderColor: muted, borderDash: [5, 4], tension: .3, pointRadius: 0, borderWidth: 1.8 }] },
    options: { maintainAspectRatio: false, interaction: { mode: 'index', intersect: false }, plugins: { legend: { labels: { boxWidth: 10, boxHeight: 10 } }, tooltip: { callbacks: { label: c => `${c.dataset.label}: ${money(c.raw)}` } } }, scales: { x: { grid: { display: false }, border: { display: false }, ticks: { maxTicksLimit: 8 } }, y: { ...gridOpts(), ticks: { callback: v => moneyShort(v) } } } } });
  if ($('#cmpMode')) $('#cmpMode').onclick = () => cmpModeSheet(p);
  if (sCur) chart('cAcc', { type: 'doughnut', data: { labels: accs.map(a => a.id), datasets: [{ data: accs.map(a => a.s), backgroundColor: accs.map(a => a.c), borderWidth: 0 }] },
    options: { maintainAspectRatio: false, cutout: '68%', plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => `${c.label}: ${money(c.raw)}` } } } } });
}

function viewExpenses() {
  setTitle('Витрати');
  const st = $('#pageStatus'); st.textContent = 'спільні для всіх акаунтів'; st.className = 'status archive';
  const p = P(), ex = S.data.expenses, cur = forP(ex, p);
  const isBuy = e => e.category === 'Закупка (секонд)';
  const E_ = (a, b) => sum(inRange(ex, a, b), e => e.amount), N_ = (a, b) => inRange(ex, a, b).filter(isBuy).length;
  const buys = cur.filter(isBuy), sBuys = sum(buys, e => e.amount);
  const sCur = sum(cur, e => e.amount);
  const rows = [...cur].sort((a, b) => b.date.localeCompare(a.date));
  let body = '', lm = null;
  rows.forEach(e => {
    const m = ymOf(e.date);
    if (p.kind === 'year' && m !== lm) { body += sepRow(m, 3, money(sum(inYM(cur, m), x => x.amount))); lm = m; }
    body += `<tr class="tap" data-id="${e.id}"><td>${dmy(e.date)} <span class="muted">${dowOf(e.date)}</span></td><td class="muted">${esc(e.category)}</td><td><b>${money(e.amount)}</b></td></tr>${e.desc ? `<tr class="tap" data-id="${e.id}"><td colspan="3" class="desc">${esc(e.desc)}</td></tr>` : ''}${e.note ? `<tr class="tap" data-id="${e.id}"><td colspan="3" class="note">${esc(e.note)}</td></tr>` : ''}`;
  });
  $('#view').innerHTML = `
  <div class="grid g4">
    ${kpi('wallet', perLabel(p, 'Витрати за місяць', 'Витрати за рік'), money(sCur), cmp(sCur, E_, p, true), 'dark')}
    ${kpi('chart', 'Витрати за весь час', money(sum(ex, e => e.amount)))}
    ${kpi('box', perLabel(p, 'Закупок за місяць', 'Закупок за рік'), buys.length, cmp(buys.length, N_, p, true) + '<div class="sub">тільки секонд</div>')}
    ${kpi('star', 'Середньо за закупку', money(buys.length ? sBuys / buys.length : 0), '<div class="sub">тільки секонд</div>')}
  </div>
  <div class="card">
    <div class="section-title"><h2>Записи</h2><span class="sub">${p.name}</span></div>
    ${rows.length ? `<div class="scroll-x"><table class="table"><thead><tr><th>Дата</th><th>На що</th><th>Сума</th></tr></thead><tbody>${body}</tbody></table></div>`
      : `<div class="empty">За ${p.kind === 'year' ? 'цей рік' : 'цей місяць'} витрат немає.<br>Натисніть «+», щоб додати.</div>`}
  </div>`;
  $('#view').querySelectorAll('tr.tap').forEach(tr => tr.onclick = () => expenseForm(ex.find(e => e.id === tr.dataset.id)));
}

function viewWork() {
  setTitle('Час роботи');
  const p = P(), w = S.data.work, cur = forP(w, p);
  const M_ = (a, b) => sum(inRange(w, a, b), x => x.minutes);
  const mCur = sum(cur, x => x.minutes), days = cur.filter(x => x.minutes > 0).length;
  const rows = [...cur].sort((a, b) => b.date.localeCompare(a.date));
  let body = '', lm = null;
  rows.forEach(x => {
    const m = ymOf(x.date);
    if (p.kind === 'year' && m !== lm) { body += sepRow(m, 3, hmShort(sum(inYM(cur, m), y => y.minutes)) + ' год'); lm = m; }
    body += `<tr class="tap" data-id="${x.id}"><td>${dmy(x.date)} <span class="muted">${dowOf(x.date)}</span></td><td><b>${x.dayoff ? '—' : hmShort(x.minutes)}</b></td><td class="muted">${x.dayoff ? 'вихідний' : ''}</td></tr>${x.note ? `<tr class="tap" data-id="${x.id}"><td colspan="3" class="note">${esc(x.note)}</td></tr>` : ''}`;
  });
  $('#view').innerHTML = `
  <div class="grid g4">
    ${kpi('clock', perLabel(p, 'Години за місяць', 'Години за рік'), hmShort(mCur), cmp(mCur, M_, p), 'dark')}
    ${kpi('chart', 'Всього годин', hmShort(sum(w, x => x.minutes)), '<div class="sub">години приблизні</div>')}
    ${kpi('cal', 'Робочих днів', days, `<div class="sub">вихідних: ${cur.filter(x => x.dayoff).length}</div>`)}
    ${kpi('star', 'Середньо за робочий день', hmShort(days ? mCur / days : 0))}
  </div>
  <div class="card">
    <div class="section-title"><h2>Записи</h2><span class="sub">${p.name}</span></div>
    ${rows.length ? `<div class="scroll-x"><table class="table"><thead><tr><th>Дата</th><th>Час</th><th></th></tr></thead><tbody>${body}</tbody></table></div>`
      : `<div class="empty">За ${p.kind === 'year' ? 'цей рік' : 'цей місяць'} записів немає.<br>Натисніть «+», щоб додати.</div>`}
  </div>`;
  $('#view').querySelectorAll('tr.tap').forEach(tr => tr.onclick = () => workForm(w.find(x => x.id === tr.dataset.id)));
}

function viewSettings(err) {
  setTitle('Налаштування'); $('#monthWrap').hidden = true; $('#fab').hidden = true;
  const has = !!store.get('vs_token');
  $('#view').innerHTML = `
  ${err ? `<div class="card" style="border:1px solid var(--red)"><b class="down">${err}</b></div>` : ''}
  <div class="card help">
    <div class="section-title"><h2>Підключення до даних</h2><span class="sub">${has ? '<span class="up">● підключено</span>' : '<span class="down">● не підключено</span>'}</span></div>
    <p>Дані зберігаються у вашому приватному сховищі GitHub <code>${GH.repo}</code>. Щоб сайт міг їх читати й записувати, на кожному пристрої (телефон, комп'ютер) один раз вставте ключ доступу.</p>
    <label class="field"><span>Ключ доступу GitHub</span><input id="tok" type="password" autocomplete="off" placeholder="${has ? 'вже збережено — вставте новий, щоб замінити' : 'github_pat_…'}"></label>
    <button class="btn" id="saveTok">Зберегти ключ</button>
    ${has ? '<button class="btn danger" id="delTok">Вийти на цьому пристрої</button>' : ''}
  </div>
  ${S.data ? `<div class="card">
    <div class="section-title"><h2>Ціль на місяць</h2></div>
    <label class="field"><span>Сума, zł</span><input id="goal" type="number" inputmode="decimal" value="${S.data.settings.goal || ''}"></label>
    <button class="btn" id="saveGoal">Зберегти ціль</button>
  </div>
  <div class="card">
    <div class="section-title"><h2>Резервна копія</h2></div>
    <p class="sub">Кожна зміна вже зберігається окремою версією в GitHub. Додатково можна завантажити файл для Excel.</p>
    <button class="btn ghost" id="csv">Завантажити продажі (CSV для Excel)</button>
    <button class="btn ghost" id="json">Завантажити всі дані (JSON)</button>
  </div>` : ''}`;
  $('#saveTok').onclick = async () => {
    const v = $('#tok').value.trim(); if (!v) return toast('Вставте ключ');
    store.set('vs_token', v); toast('Перевіряю…');
    try { await load(); toast('Підключено ✓'); location.hash = 'panel'; render(); }
    catch (e) { store.del('vs_token'); viewSettings(e.message === 'token' ? 'Ключ не підходить. Перевірте, що він має доступ до vinted-stats-data (Contents: Read and write).' : 'Немає з’єднання з GitHub. Спробуйте пізніше.'); }
  };
  if ($('#delTok')) $('#delTok').onclick = () => { if (confirm('Видалити ключ з цього пристрою?')) { store.del('vs_token'); store.del('vs_cache'); location.reload(); } };
  if ($('#saveGoal')) $('#saveGoal').onclick = () => { const g = r2(+$('#goal').value); if (!(g > 0)) return toast('Вкажіть суму'); save(`Ціль на місяць: ${g} zł`, d => { d.settings.goal = g; }); };
  if ($('#csv')) $('#csv').onclick = () => {
    const lines = ['Акаунт;Дата;Кількість речей;Сума (zł)'].concat([...S.data.sales].sort((a, b) => a.date.localeCompare(b.date)).map(s => `${s.account};${dmy(s.date)};${s.items};${String(s.amount).replace('.', ',')}`));
    download('vinted-prodazhi.csv', '﻿' + lines.join('\r\n'), 'text/csv');
  };
  if ($('#json')) $('#json').onclick = () => download('vinted-dani.json', JSON.stringify(S.data, null, 1), 'application/json');
}
function download(name, text, type) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); }

/* ===== forms ===== */
function openSheet(html, bind) {
  $('#sheet').innerHTML = `<div class="grab"></div>${html}`;
  $('#sheetWrap').hidden = false;
  bind($('#sheet'));
}
function closeSheet() { $('#sheetWrap').hidden = true; }
$('#sheetWrap').addEventListener('click', e => { if (e.target.id === 'sheetWrap') closeSheet(); });
const num = v => { const n = parseFloat(String(v).replace(',', '.').replace(/\s/g, '')); return isFinite(n) ? n : NaN; };

function prodLine(s) {
  if (!s.products || !s.products.length) return '';
  return `<tr class="tap prod" data-id="${s.id}"><td colspan="3" class="prods"><div>${s.products.map(p => esc(p.name)).join(' · ')}</div></td></tr>`;
}
function prodList(s) {
  if (!s || !s.products || !s.products.length) return '';
  return `<div class="plist"><div class="sub" style="margin-bottom:6px">Що продано (${s.products.length})</div>${s.products.map(p => `<div class="pitem"><span>${esc(p.name)}${p.shipped ? ' <span class="tag-mini">в дорозі</span>' : ''}${p.note ? `<small class="down">${esc(p.note)}</small>` : ''}</span>${p.price != null ? `<b>${money(p.price)}</b>` : ''}</div>`).join('')}</div>`;
}
function saleForm(acc, s) {
  const edit = !!s;
  openSheet(`<h3>${edit ? 'Редагувати продаж' : 'Новий продаж'} · ${esc(acc)}</h3>
    <label class="field"><span>Дата</span><input id="fDate" type="date" value="${s ? s.date : todayISO()}"></label>
    ${prodList(s)}
    <div class="row2"><label class="field"><span>Кількість речей</span><input id="fItems" type="number" inputmode="numeric" min="0" step="1" value="${s ? s.items : ''}" placeholder="1"></label>
    <label class="field"><span>Сума, zł</span><input id="fAmt" type="text" inputmode="decimal" value="${s ? String(s.amount).replace('.', ',') : ''}" placeholder="0,00"></label></div>
    ${s && s.products && s.products.some(p => p.price != null) ? '' : `<label class="field"><span>Що продано (необов'язково, кожна річ з нового рядка)</span><textarea id="fNames" rows="3" placeholder="Bluza Nike M&#10;Koszula Ralph Lauren L">${s && s.products ? esc(s.products.map(p => p.name).join('\n')) : ''}</textarea></label>`}
    <button class="btn" id="ok">${edit ? 'Зберегти зміни' : 'Додати продаж'}</button>
    ${edit ? '<button class="btn danger" id="del">Видалити запис</button>' : ''}
    <button class="btn ghost" id="cancel">Скасувати</button>`, el => {
    el.querySelector('#cancel').onclick = closeSheet;
    if (!edit) setTimeout(() => el.querySelector('#fItems').focus(), 250);
    el.querySelector('#ok').onclick = async () => {
      const date = el.querySelector('#fDate').value, items = parseInt(el.querySelector('#fItems').value, 10), amount = r2(num(el.querySelector('#fAmt').value));
      if (!date) return toast('Вкажіть дату'); if (!(items >= 0)) return toast('Вкажіть кількість речей'); if (!(amount >= 0)) return toast('Вкажіть суму');
      const ta = el.querySelector('#fNames'), names = ta ? ta.value.split('\n').map(x => x.trim()).filter(Boolean) : null;
      const extra = names && names.length ? { products: names.map(name => ({ name })) } : {};
      closeSheet();
      if (edit) await save(`Змінено продаж ${acc} ${dmy(date)}: ${items} шт, ${amount} zł (було ${dmy(s.date)}: ${s.items} шт, ${s.amount} zł)`, d => Object.assign(d.sales.find(x => x.id === s.id), { date, items, amount }, extra));
      else await save(`Продаж ${acc} ${dmy(date)}: ${items} шт, ${amount} zł`, d => d.sales.push({ id: uid('s'), account: acc, date, items, amount, ...extra }));
      focusDate(date); render();
    };
    if (edit) el.querySelector('#del').onclick = async () => { if (!confirm(`Видалити продаж ${dmy(s.date)} на ${money(s.amount)}?`)) return; closeSheet(); await save(`Видалено продаж ${acc} ${dmy(s.date)}: ${s.items} шт, ${s.amount} zł`, d => { d.sales = d.sales.filter(x => x.id !== s.id); }); };
  });
}

function expenseForm(e) {
  const edit = !!e;
  openSheet(`<h3>${edit ? 'Редагувати витрату' : 'Нова витрата'}</h3>
    ${e && e.source ? `<div class="src">Запис у нотатці: ${esc(e.source)}</div>` : ''}
    <div class="row2"><label class="field"><span>Дата</span><input id="fDate" type="date" value="${e ? e.date : todayISO()}"></label>
    <label class="field"><span>Сума, zł</span><input id="fAmt" type="text" inputmode="decimal" value="${e ? String(e.amount).replace('.', ',') : ''}" placeholder="0,00"></label></div>
    <label class="field"><span>На що</span><select id="fCat">${CATS.map(c => `<option ${e && e.category === c ? 'selected' : ''}>${c}</option>`).join('')}</select></label>
    <label class="field"><span>Примітка (необов'язково)</span><input id="fNote" type="text" value="${e ? esc(e.note || '') : ''}"></label>
    <button class="btn" id="ok">${edit ? 'Зберегти зміни' : 'Додати витрату'}</button>
    ${edit ? '<button class="btn danger" id="del">Видалити запис</button>' : ''}
    <button class="btn ghost" id="cancel">Скасувати</button>`, el => {
    el.querySelector('#cancel').onclick = closeSheet;
    el.querySelector('#ok').onclick = async () => {
      const date = el.querySelector('#fDate').value, amount = r2(num(el.querySelector('#fAmt').value)), category = el.querySelector('#fCat').value, note = el.querySelector('#fNote').value.trim();
      if (!date) return toast('Вкажіть дату'); if (!(amount >= 0)) return toast('Вкажіть суму');
      closeSheet();
      if (edit) await save(`Змінено витрату ${dmy(date)}: ${amount} zł (${category})`, d => Object.assign(d.expenses.find(x => x.id === e.id), { date, amount, category, note }));
      else await save(`Витрата ${dmy(date)}: ${amount} zł (${category})`, d => d.expenses.push({ id: uid('e'), date, category, amount, note }));
      focusDate(date); render();
    };
    if (edit) el.querySelector('#del').onclick = async () => { if (!confirm(`Видалити витрату ${dmy(e.date)} на ${money(e.amount)}?`)) return; closeSheet(); await save(`Видалено витрату ${dmy(e.date)}: ${e.amount} zł`, d => { d.expenses = d.expenses.filter(x => x.id !== e.id); }); };
  });
}

function workForm(w) {
  const edit = !!w, h = w && w.minutes != null ? Math.floor(w.minutes / 60) : '', m = w && w.minutes != null ? Math.round(w.minutes % 60) : '';
  openSheet(`<h3>${edit ? 'Редагувати час' : 'Час роботи'}</h3>
    ${w && w.source ? `<div class="src">Запис у нотатці: ${esc(w.source)}</div>` : ''}
    <label class="field"><span>Дата</span><input id="fDate" type="date" value="${w ? w.date : todayISO()}"></label>
    <div class="row2"><label class="field"><span>Години</span><input id="fH" type="number" inputmode="numeric" min="0" value="${h}" placeholder="0"></label>
    <label class="field"><span>Хвилини</span><input id="fM" type="number" inputmode="numeric" min="0" max="59" value="${m}" placeholder="0"></label></div>
    <label class="check"><input id="fOff" type="checkbox" ${w && w.dayoff ? 'checked' : ''}> Вихідний</label>
    <label class="field"><span>Примітка (необов'язково)</span><input id="fNote" type="text" value="${w ? esc(w.note || '') : ''}"></label>
    <button class="btn" id="ok">${edit ? 'Зберегти зміни' : 'Додати'}</button>
    ${edit ? '<button class="btn danger" id="del">Видалити запис</button>' : ''}
    <button class="btn ghost" id="cancel">Скасувати</button>`, el => {
    el.querySelector('#cancel').onclick = closeSheet;
    el.querySelector('#ok').onclick = async () => {
      const date = el.querySelector('#fDate').value, off = el.querySelector('#fOff').checked, note = el.querySelector('#fNote').value.trim();
      const hh = parseInt(el.querySelector('#fH').value || '0', 10), mm = parseInt(el.querySelector('#fM').value || '0', 10);
      if (!date) return toast('Вкажіть дату'); if (!(hh >= 0 && mm >= 0 && mm < 60)) return toast('Перевірте години і хвилини');
      const minutes = off && !hh && !mm ? null : hh * 60 + mm;
      closeSheet();
      if (edit) await save(`Змінено час роботи ${dmy(date)}: ${off ? 'вихідний' : hmShort(minutes)}`, d => Object.assign(d.work.find(x => x.id === w.id), { date, minutes, dayoff: off, note }));
      else await save(`Час роботи ${dmy(date)}: ${off ? 'вихідний' : hmShort(minutes)}`, d => d.work.push({ id: uid('w'), date, minutes, dayoff: off, note }));
      focusDate(date); render();
    };
    if (edit) el.querySelector('#del').onclick = async () => { if (!confirm(`Видалити запис за ${dmy(w.date)}?`)) return; closeSheet(); await save(`Видалено час роботи ${dmy(w.date)}`, d => { d.work = d.work.filter(x => x.id !== w.id); }); };
  });
}

/* ===== start ===== */
(async function start() {
  S.route = decodeURIComponent(location.hash.slice(1)) || 'panel';
  renderNav();
  try { await load(); render(); }
  catch (e) {
    const cache = store.get('vs_cache');
    if (e.message === 'net' && cache) { S.data = JSON.parse(cache); S.mode = 'offline'; render(); toast('Немає інтернету — показую останні збережені дані', 4000); }
    else { S.route = 'settings'; viewSettings(e.message === 'token' && store.get('vs_token') ? 'Ключ доступу не підходить або застарів. Вставте новий.' : ''); }
  }
})();
