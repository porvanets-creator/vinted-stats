'use strict';
/* ===== config ===== */
const GH = { owner: 'porvanets-creator', repo: 'vinted-stats-data', path: 'data.json', branch: 'main' };
const MONTHS = ['Січень','Лютий','Березень','Квітень','Травень','Червень','Липень','Серпень','Вересень','Жовтень','Листопад','Грудень'];
const MONTHS_SHORT = ['Січ','Лют','Бер','Кві','Тра','Чер','Лип','Сер','Вер','Жов','Лис','Гру'];
const DOW = ['Нд','Пн','Вт','Ср','Чт','Пт','Сб'];
const CATS = ['Закупка (секонд)','Закупка (Vinted)','Просування Vinted','Просування eBay','Пакування','Пошта','Інше'];
const ACC_COLORS = ['#262626','#7a7a7a','#b0b0b0','#4f6d5c','#c9c9c9','#8a6d4f'];

const ICONS = {
  home:'<svg viewBox="0 0 24 24"><path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z"/></svg>',
  user:'<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
  wallet:'<svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="14" rx="3"/><path d="M16 13h2M3 10h18M6 6l9-3 1 3"/></svg>',
  clock:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
  dl:'<svg viewBox="0 0 24 24"><path d="M12 4v11M7 11l5 5 5-5M5 20h14"/></svg>',
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
  users:'<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 19.5c1-3.5 3.5-5.5 6.5-5.5s5.5 2 6.5 5.5"/><path d="M15.5 4.8a3.5 3.5 0 0 1 0 6.4M18 14.3c1.7.9 2.9 2.6 3.5 5.2"/></svg>',
  chev:'<svg class="chev" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>',
  id:'<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="3"/><circle cx="9" cy="11" r="2.2"/><path d="M5.8 16c.6-1.6 1.8-2.4 3.2-2.4s2.6.8 3.2 2.4M14.5 10h4M14.5 13.5h3"/></svg>',
  mail:'<svg viewBox="0 0 24 24"><rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M4 7l8 6 8-6"/></svg>',
  phone:'<svg viewBox="0 0 24 24"><rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/></svg>',
  pen:'<svg viewBox="0 0 24 24"><path d="M4 20l4-1 10.5-10.5a2.1 2.1 0 0 0-3-3L5 16z"/><path d="M14 7l3 3"/></svg>',
  bag:'<svg viewBox="0 0 24 24"><path d="M5 8h14l-1 12H6z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg>',
  globe:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.6 3.7 5.4 3.7 8.5s-1.2 5.9-3.7 8.5c-2.5-2.6-3.7-5.4-3.7-8.5S9.5 6.1 12 3.5z"/></svg>',
  bank:'<svg viewBox="0 0 24 24"><path d="M3 9.5L12 4l9 5.5M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18"/></svg>',
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
const m0 = n => Math.round(n || 0).toLocaleString("uk-UA") + " zł";
const moneyShort = n => Math.abs(n) >= 1000 ? (n / 1000).toLocaleString('uk-UA', { maximumFractionDigits: 1 }) + 'k' : String(Math.round(n));
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ymOf = d => d.slice(0, 7);
const dmy = d => `${d.slice(8, 10)}.${d.slice(5, 7)}.${d.slice(0, 4)}`;
const monthName = ym => `${MONTHS[+ym.slice(5, 7) - 1]} ${ym.slice(0, 4)}`;
const shiftYM = (ym, k) => { let y = +ym.slice(0, 4), m = +ym.slice(5, 7) - 1 + k; y += Math.floor(m / 12); m = ((m % 12) + 12) % 12; return `${y}-${String(m + 1).padStart(2, '0')}`; };
const daysIn = ym => new Date(+ym.slice(0, 4), +ym.slice(5, 7), 0).getDate();
const todayISO = () => { const t = new Date(); return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`; };
const hm = min => { if (min == null) return '—'; const h = Math.floor(min / 60), m = Math.round(min % 60); return `${h} год ${String(m).padStart(2, '0')} хв`; };
const hmShort = min => { if (!min) return '0 год'; const t = Math.round(min), h = Math.floor(t / 60), m = t % 60; return h && m ? `${h} год ${m} хв` : h ? `${h} год` : `${m} хв`; };
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
  if (S.saving) { toast('Зачекайте, зберігаю…'); return false; }
  const backup = JSON.stringify(S.data);
  try { mutate(S.data); }
  catch (e) { S.data = JSON.parse(backup); toast('Не вдалося зберегти: помилка в даних. Спробуйте ще раз.', 4000); return false; }
  if (S.mode === 'offline') { S.data = JSON.parse(backup); toast('Немає інтернету — зберегти не вийде. Спробуйте пізніше.', 4000); return false; }
  if (S.mode !== 'github') { toast('Тестовий режим: зміни не зберігаються'); render(); return true; }
  S.saving = true; toast('Зберігаю…', 10000);
  try {
    const body = { message, content: b64enc(JSON.stringify(S.data, null, 1)), sha: S.sha, branch: GH.branch };
    const r = await fetch(ghUrl(), { method: 'PUT', headers: { ...ghHeaders(), 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (r.status === 409) { S.data = JSON.parse(backup); try { await load(); } catch (_) {} render(); toast('Дані змінились на іншому пристрої. Оновив — повторіть, будь ласка.', 4000); return false; }
    if (!r.ok) { const er = new Error('http'); er.status = r.status; throw er; }
    const j = await r.json(); S.sha = j.content.sha;
    store.set('vs_cache', JSON.stringify(S.data));
    toast('Збережено ✓'); render(); return true;
  } catch (e) {
    S.data = JSON.parse(backup); render();
    toast(e && e.status ? `Не вдалося зберегти (код ${e.status})` : 'Не вдалося зберегти. Перевірте інтернет і спробуйте ще раз.', 4000); return false;
  } finally { S.saving = false; }
}

/* ===== nav ===== */
function routes() {
  const acc = S.data ? S.data.accounts : [];
  return [{ id: 'panel', label: 'Панель', icon: 'home' }]
    .concat(acc.map(a => ({ id: 'acc:' + a.id, label: a.id, icon: 'user', tag: a.status === 'archive' ? 'архів' : '' })))
    .concat([null, { id: 'expenses', label: 'Витрати', icon: 'wallet' }, { id: 'work', label: 'Час роботи', icon: 'clock' }]);
}
const OWNER_ORDER = ['Роман', 'Влад', 'Марія'];
function renderNav() {
  const link = (id, icon, label, tag) => `<a href="#${id}" class="${S.route === id ? 'active' : ''}">${ICONS[icon]}<span>${esc(label)}</span>${tag ? `<span class="tag">${tag}</span>` : ''}</a>`;
  const accs = S.data ? S.data.accounts : [];
  const vAccs = accs.filter(a => (a.platform || 'vinted') === 'vinted'), eAccs = accs.filter(a => a.platform === 'ebay');
  const owners = [...new Set(vAccs.map(a => a.owner || 'Інші'))].sort((a, b) => (OWNER_ORDER.indexOf(a) + 1 || 99) - (OWNER_ORDER.indexOf(b) + 1 || 99));
  let html = link('panel', 'home', 'Головна') + link('items', 'chart', 'Аналітика товарів'), inner = '';
  owners.forEach(o => {
    const list = vAccs.filter(a => (a.owner || 'Інші') === o);
    const open = store.get('vs_grp_' + o) === '1' || list.some(a => S.route === 'acc:' + a.id);
    inner += `<button class="nav-group ${open ? 'open' : ''}" data-owner="${esc(o)}">${ICONS.users}<span>${esc(o)}</span><small>${list.length}</small>${ICONS.chev}</button>
      <div class="nav-sub" ${open ? '' : 'hidden'}>${list.map(a => link('acc:' + a.id, 'user', a.id, a.status === 'archive' ? 'архів' : '')).join('')}</div>`;
  });
  const vOpen = store.get('vs_grp_Vinted') !== '0' || vAccs.some(a => S.route === 'acc:' + a.id);
  html += `<button class="nav-group top ${vOpen ? 'open' : ''}" data-owner="Vinted">${ICONS.bag}<span>Vinted</span><small>${vAccs.length}</small>${ICONS.chev}</button>
    <div class="nav-sub" ${vOpen ? '' : 'hidden'}>${inner}</div>`;
  if (eAccs.length) {
    const eOpen = store.get('vs_grp_eBay') === '1' || eAccs.some(a => S.route === 'acc:' + a.id);
    html += `<button class="nav-group top ${eOpen ? 'open' : ''}" data-owner="eBay">${ICONS.globe}<span>eBay</span><small>${eAccs.length}</small>${ICONS.chev}</button>
      <div class="nav-sub" ${eOpen ? '' : 'hidden'}>${eAccs.map(a => link('acc:' + a.id, 'user', a.id, a.status === 'archive' ? 'архів' : '')).join('')}</div>`;
  }
  html += link('data', 'id', 'Дані');
  html += link('taxes', 'coin', 'Податки');
  html += '<hr>' + link('expenses', 'wallet', 'Витрати') + link('work', 'clock', 'Час роботи', S.data && S.data.timer ? 'іде' : '');
  $('#nav').innerHTML = html;
  $('#nav').querySelectorAll('.nav-group').forEach(b => b.onclick = () => {
    const o = b.dataset.owner, sub = b.nextElementSibling, open = sub.hidden;
    sub.hidden = !open; b.classList.toggle('open', open); store.set('vs_grp_' + o, open ? '1' : '0');
  });
  const sw = (key, icon, label, on) => `<button class="nav-switch" data-sw="${key}" aria-pressed="${on}">${ICONS[icon]}<span>${label}</span><i class="sw ${on ? 'on' : ''}"></i></button>`;
  $('#navFoot').innerHTML = `<div class="nav-cap">Показувати</div>
    ${sw('cmp', 'swap', 'Порівняння', !cmpOff())}
    ${sw('avg', 'star', 'Середній чек', show('avg'))}
    ${sw('bestm', 'trophy', 'Найкращий місяць', show('bestm'))}
    ${sw('bestd', 'cal', 'Найкращі дні', show('bestd'))}
    ${sw('goal', 'target', 'Ціль', show('goal'))}
    ${sw('hourly', 'clock', 'Вартість години', show('hourly'))}
    ${sw('buys', 'box', 'Закупки', show('buys'))}
    <hr>
    <a href="#" id="navExport">${ICONS.dl}<span>Вивантажити в Excel</span></a>
    <a href="#settings" class="${S.route === 'settings' ? 'active' : ''}">${ICONS.gear}<span>Налаштування</span></a>`;
  $('#navExport').onclick = e => { e.preventDefault(); openDrawer(false); exportSheet(); };
  $('#navFoot').querySelectorAll('[data-sw]').forEach(b => b.onclick = () => {
    const k = b.dataset.sw;
    if (k === 'cmp') store.set('vs_cmp_off', cmpOff() ? '0' : '1');
    else store.set('vs_hide_' + k, show(k) ? '1' : '0');
    render();
  });
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
  if (key === 'ALL') {
    const ds = ['sales', 'expenses', 'work'].flatMap(k => S.data[k].map(x => x.date)).sort();
    const last = ds.length ? ds[ds.length - 1] : today;
    return { kind: 'all', key, year: today.slice(0, 4), start: ds[0] || today, end: last > today ? last : today, ongoing: false,
      prev: null, same: null, unit: 'весь час', name: 'За весь час', cmpTitle: '' };
  }
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
  if (!p.prev || cmpOff()) return '';
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
  const months = monthsAvailable(), out = [{ v: 'ALL', t: 'За весь час' }];
  let lastY = null;
  months.forEach(ym => { const y = ym.slice(0, 4); if (y !== lastY) { out.push({ v: 'Y' + y, t: `Весь ${y} рік` }); lastY = y; } out.push({ v: ym, t: monthName(ym) }); });
  return out;
}
function focusDate(date) { if (S.month !== 'ALL' && !(S.month.startsWith('Y') && S.month.slice(1) === date.slice(0, 4))) S.month = ymOf(date); store.set('vs_month', S.month); }
const dowOf = d => DOW[new Date(d + 'T12:00').getDay()];
const sepRow = (k, cols, extra) => `<tr class="sep"><td colspan="${cols}">${monthName(k)}${extra ? ` · ${extra}` : ''}</td></tr>`;

/* ===== views ===== */
function render() {
  killCharts(); clearInterval(S.timerIv); renderNav();
  const r = S.route, fab = $('#fab');
  $('#monthWrap').hidden = r === 'settings' || r === 'data' || r === 'taxes';
  if (S.data) {
    const opts = monthOptions(), vals = opts.map(o => o.v);
    if (!S.month || !vals.includes(S.month)) S.month = vals.includes(store.get('vs_month')) ? store.get('vs_month') : ymOf(todayISO());
    $('#monthSel').innerHTML = opts.map(o => `<option value="${o.v}" ${o.v === S.month ? 'selected' : ''}>${o.t}</option>`).join('');
  }
  $('#pageStatus').textContent = ''; $('#pageStatus').className = 'status';
  fab.hidden = true;
  if (r === 'settings' || !S.data) return viewSettings();
  if (r === 'data') return viewData();
  if (r === 'taxes') return viewTaxes();
  if (r === 'items') return viewItems();
  if (r.startsWith('acc:')) { fab.hidden = false; fab.onclick = () => saleForm(r.slice(4)); return viewAccount(r.slice(4)); }
  if (r === 'expenses') { fab.hidden = false; fab.onclick = () => expenseForm(); return viewExpenses(); }
  if (r === 'work') { fab.hidden = false; fab.onclick = () => workForm(); return viewWork(); }
  return viewPanel();
}
function setTitle(t) { $('#pageTitle').textContent = t; document.title = `${t} · Sell Analytics`; }
function kpi(icon, label, value, extra = '', cls = '') {
  return `<div class="card ${cls}"><div class="label">${ICONS[icon]}${label}</div><div class="big">${value}</div>${extra}</div>`;
}
const perLabel = (p, m, y) => p.kind === 'all' ? y.replace('за рік', 'за весь час').replace(' року', ' за весь час') : p.kind === 'year' ? y : m;
const isBuyCat = c => String(c || '').startsWith('Закупка');
function buyCard(p) {
  const ex = S.data.expenses, buys = forP(ex, p).filter(e => isBuyCat(e.category)), withQ = buys.filter(e => e.qty > 0);
  if (!withQ.length) return '';
  const n = sum(withQ, e => e.qty), tot = sum(withQ, e => e.amount), first = ex.filter(e => e.qty > 0).map(e => e.date).sort()[0];
  return `<div class="card"><div class="section-title"><h2>Закупки</h2><span class="sub">${esc(p.name)}</span></div>
    <div class="list-days"><div><span>Куплено речей</span><b>${n}</b></div><div><span>Сума</span><b>${money(tot)}</b></div><div><span>Середня ціна речі</span><b>${money(tot / n)}</b></div></div>
    ${withQ.length < buys.length ? `<div class="sub" style="margin-top:8px">рахуємо з ${dmy(first)} — у старих закупках кількість не вказана</div>` : ''}</div>`;
}
const perWord = p => p.kind === 'month' ? 'цей місяць' : p.kind === 'year' ? 'цей рік' : 'весь час';

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
    if (p.kind !== 'month' && m !== lm) { rowsHtml += sepRow(m, 3, money(mTot[m])); lm = m; }
    rowsHtml += `<tr class="tap" data-id="${s.id}"><td>${dmy(s.date)} <span class="muted">${dowOf(s.date)}</span></td><td>${s.items}</td><td><b>${money(s.amount)}</b><div class="sub">${money(runMap[s.id])}</div></td></tr>${prodLine(s)}`;
  });
  const sP = p.prev ? S_(p.prev.start, p.prev.end) : 0, sS = p.same ? S_(p.same.start, p.same.end) : 0;
  const dayCount = byDay(cur).length;

  $('#view').innerHTML = `
  <div class="grid ${show('avg') ? 'g3' : ''}">
    ${kpi('cal', perLabel(p, 'Продажі за місяць', 'Продажі за рік'), money(sCur), cmp(sCur, S_, p) + (p.kind === 'all' && firstDate ? `<div class="sub">з ${dmy(firstDate)}</div>` : ''), 'dark')}
    ${kpi('box', 'Кількість проданих речей', iCur, cmp(iCur, I_, p))}
    ${show('avg') ? kpi('star', 'Середній чек', money(avg), cmp(avg, A_, p), 'span2-m') : ''}
  </div>
  <div class="grid g3">
    ${!p.prev || cmpOff() ? '' : `<div class="card span2-m"><div class="card-head"><div class="label">${ICONS.swap}${p.cmpTitle}</div>${p.same ? `<button class="mini-btn" id="cmpMode" aria-label="Що показувати">${ICONS.plus}</button>` : ''}</div>
      ${!sP ? `<div class="mid flat">немає даних</div><div class="sub">за ${p.kind === 'year' ? p.prevName : lc(p.prevName)} продажів не записано</div>` : `
      ${p.same && cmpMode() !== 'whole' ? diffBlock(sCur, sS, `За той самий час (${p.sameLabel})`, `${p.sameLabel}: ${money(sS)}`) : ''}
      ${!p.same || cmpMode() !== 'same' ? diffBlock(sCur, sP, p.same ? `За ${p.wholeLabel}` : `Проти: ${p.prevName}`, `${p.prevName}: ${money(sP)}`) : ''}`}
    </div>`}
    ${!show('bestm') ? '' : `<div class="card span2-m"><div class="label">${ICONS.trophy}Найкращий місяць</div>${bm ? `<div class="mid">${monthName(bm[0])}</div><div class="chg up">${money(bm[1])}</div>` : '<div class="mid flat">—</div>'}<div class="sub">за весь час</div></div>`}
    ${!show('bestd') ? '' : `<div class="card span2-m"><div class="label">${ICONS.star}${perLabel(p, 'Найкращі дні місяця', 'Найкращі дні року')}</div><div class="list-days">${best.length ? best.map(b => `<div><span>${dmy(b.date)}</span><b>${money(b.amount)}</b></div>`).join('') : '<div class="sub">ще немає продажів</div>'}</div></div>`}
  </div>
  <div class="card">
    <div class="section-title"><h2>Продажі акаунта</h2><span class="sub">${totalAll ? `${Math.round(sCur / totalAll * 100)}% усіх продажів` : ''}</span></div>
    ${sorted.length ? `<div class="scroll-x"><table class="table"><thead><tr><th>Дата</th><th>Речей</th><th>Сума<br><span style="font-weight:400">наростаючим за місяць</span></th></tr></thead><tbody>${rowsHtml}</tbody></table></div>`
      : `<div class="empty">${acc.status === 'archive' && !all.length ? 'Дані цього акаунта ще не перенесені.' : `За ${perWord(p)} ще немає продажів.<br>Натисніть «+», щоб додати.`}</div>`}
  </div>`;
  if (acc.platform === 'ebay') {
    const promoE = forP(S.data.expenses, p).filter(e => e.account === id && e.category === 'Просування eBay');
    const netPln = r2(sCur - sum(promoE, e => e.amount));
    const eurIn = sum(cur, x => x.eur || 0), eurOut = sum(promoE, e => e.eur || 0), hasEur = cur.some(x => x.eur != null);
    const firstGrid = $('#view .grid');
    firstGrid.insertAdjacentHTML('afterend', `<div class="card"><div class="label">${ICONS.coin}Сума чистими / оподатковувана</div>
      <div class="big">${money(netPln)}</div>
      ${hasEur ? `<div class="sub">${nf2.format(r2(eurIn - eurOut))} € на рахунку eBay</div>` : ''}
      <div class="sub" style="margin-top:6px">Продажі після комісії eBay (${money(sCur)}) мінус просування eBay (${money(sum(promoE, e => e.amount))}). Перераховано за курсом НБП.</div></div>`);
  }
  const pays = (S.data.payouts || []).filter(x => x.account === id && x.date >= p.start && x.date <= p.end).sort((a, b) => b.date.localeCompare(a.date));
  if (pays.length) $('#view').insertAdjacentHTML('beforeend', `<div class="card"><div class="section-title"><h2>Виплати на банк</h2><span class="sub">${p.name}</span></div>
    <div class="list-days">${pays.map(x => `<div><span>${dmy(x.date)} <span class="muted">· ${esc(x.bank || '')}</span></span><b>${nf2.format(x.amount)} ${x.currency === 'EUR' ? '€' : esc(x.currency || '')}</b></div>`).join('')}</div>
    <div class="sub" style="margin-top:8px">Коли гроші прийшли на рахунок. На суми продажів не впливає.</div></div>`);
  $('#view').querySelectorAll('tr.tap').forEach(tr => tr.onclick = () => saleForm(id, S.data.sales.find(s => s.id === tr.dataset.id)));
  if ($('#cmpMode')) $('#cmpMode').onclick = () => cmpModeSheet(p);
}
function viewTaxes() {
  setTitle('Податки');
  const tax = S.data.tax;
  if (!tax) { $('#view').innerHTML = '<div class="card"><div class="empty">Дані про податки ще не додані.</div></div>'; return; }
  const rate = tax.rate || 0, pays = tax.payments || [], ebay = tax.ebayIncome || [];
  const st = $('#pageStatus'); st.textContent = `ryczałt ${r2(rate * 100)}%`; st.className = 'status archive';
  const ids = new Set(S.data.accounts.filter(a => a.owner === tax.owner && (a.platform || 'vinted') === 'vinted').map(a => a.id));
  const rev = {};
  S.data.sales.forEach(s => { if (ids.has(s.account)) rev[ymOf(s.date)] = r2((rev[ymOf(s.date)] || 0) + (+s.amount || 0)); });
  ebay.forEach(e => { rev[e.period] = r2((rev[e.period] || 0) + (+e.amount || 0)); });
  const ryc = pays.filter(p => p.type === 'ryczalt');
  const today = todayISO(), curYM = ymOf(today), year = today.slice(0, 4);
  const starts = [...Object.keys(rev).filter(k => rev[k] > 0), ...pays.map(p => p.period)].filter(Boolean).sort();
  const firstPaid = tax.start || ryc.map(p => p.period).filter(Boolean).sort()[0] || '0000-00';
  const months = [];
  if (starts.length) for (let m = starts[0]; m <= curYM; m = shiftYM(m, 1)) months.push(m);
  const rows = months.map(m => {
    const income = rev[m] || 0, due = income * rate, dueR = Math.round(due);
    const mp = ryc.filter(p => p.period === m), paid = sum(mp, p => p.amount);
    return { m, income, due, dueR, paid, hasPaid: mp.length > 0, dates: mp.map(p => p.date).sort(), diff: r2(paid - dueR), nodata: m < firstPaid, ongoing: m === curYM, pays: pays.filter(p => p.period === m).length };
  }).filter(x => (x.income > 0 || x.pays > 0) && (!tax.start || x.m >= tax.start)).reverse();
  const yr = rows.filter(x => x.m.startsWith(year) && !x.nodata && !x.ongoing);
  const dueYear = sum(yr, x => x.dueR), paidYear = sum(yr, x => x.paid), diffYear = r2(paidYear - dueYear);
  const next = [...rows].reverse().find(x => x.income > 0 && !x.hasPaid && !x.nodata && !x.ongoing);
  let nextHtml = '<div class="mid flat">—</div><div class="sub">усе сплачено</div>';
  if (next) {
    const dl = shiftYM(next.m, 1), late = today > `${dl}-20`;
    nextHtml = `<div class="mid">${monthName(next.m)}</div><div class="chg ${late ? 'down' : 'flat'}">${money(next.dueR)}</div><div class="sub">до 20.${dl.slice(5, 7)}.${dl.slice(0, 4)}${late ? ' · <span class="down">прострочено</span>' : ''}</div>`;
  }
  const closed = rows.filter(x => !x.nodata && !x.ongoing);
  const leftParts = closed.map(x => ({ m: x.m, v: r2(Math.max(0, x.dueR - x.paid)) })).filter(x => x.v > 0);
  const leftTotal = sum(leftParts, x => x.v), over = sum(closed, x => Math.max(0, x.paid - x.dueR));
  const leftHtml = `<div class="label">${ICONS.swap}Залишилось сплатити</div>
    ${leftTotal ? `<div class="big down">${money(leftTotal)}</div><div class="sub">${leftParts.map(x => `${MONTHS[+x.m.slice(5) - 1]} ${money(x.v)}`).join(' · ')}</div>` : '<div class="big up">усе сплачено</div>'}
    ${over ? `<div class="sub up">переплата ${money(over)}</div>` : ''}`;
  const pill = x => {
    if (x.ongoing) return '<span class="pill muted">Триває</span>';
    if (x.nodata) return '<span class="pill muted">немає даних</span>';
    if (x.hasPaid) return x.paid >= x.dueR ? '<span class="pill ok">✓ Сплачено</span>' : `<span class="pill bad">Недоплата ${money(x.dueR - x.paid)}</span>`;
    const dl = shiftYM(x.m, 1);
    return today > `${dl}-20` ? '<span class="pill bad">Не сплачено</span>' : `<span class="pill wait">До сплати до 20.${dl.slice(5, 7)}</span>`;
  };
  const diffCls = v => v > 0 ? 'up' : v < 0 ? 'down' : 'flat';
  const diffTxt = v => v === 0 ? 'сплачено' : `${v > 0 ? '+' : '−'}${money(Math.abs(v))}`;
  const list = (type, empty) => {
    const arr = pays.filter(p => p.type === type).sort((a, b) => b.date.localeCompare(a.date));
    if (!arr.length) return `<div class="sub">${empty}</div>`;
    const tot = sum(arr.filter(p => p.date.startsWith(year)), p => p.amount);
    return `<div class="list-days">${arr.map(p => `<div><span>${dmy(p.date)} · ${p.period ? monthName(p.period) : ''}${p.note ? `<div class="sub down">${esc(p.note)}</div>` : ''}</span><b>${money(p.amount)}</b></div>`).join('')}</div>
      <div class="sub" style="margin-top:8px">Разом за ${year} рік: <b>${money(tot)}</b></div>`;
  };
  $('#view').innerHTML = `
  <div class="grid g3">
    ${kpi('coin', `Податок за ${year} (закриті міс.)`, money(dueYear), `<div class="sub">сплачено ${money(paidYear)}</div>`, 'dark')}
    <div class="card">${leftHtml}</div>
    <div class="card span2-m"><div class="label">${ICONS.cal}Наступний платіж</div>${nextHtml}</div>
  </div>
  ${tax.start ? `<div class="sub" style="margin:-4px 4px 12px">Облік податку з ${MONTHS_GEN[+tax.start.slice(5) - 1]} ${tax.start.slice(0, 4)} — з цього місяця зареєстрована діяльність (JDG).</div>` : firstPaid !== '0000-00' ? `<div class="sub" style="margin:-4px 4px 12px">рахується з ${monthName(firstPaid)} — раніше немає даних про оплату</div>` : ''}
  <div class="card">
    <div class="section-title"><h2>По місяцях</h2><span class="sub">ryczałt ${r2(rate * 100)}%</span></div>
    ${rows.length ? rows.map(x => `<div class="tax-month">
      <div class="tm-head"><b>${monthName(x.m)}</b>${pill(x)}</div>
      <div class="tm-row sub"><span>Дохід ${money(x.income)}</span><span>${r2(rate * 100)}% → до сплати <b>${money(x.dueR)}</b></span></div>
      ${x.hasPaid ? `<div class="tm-row sub"><span>Сплачено ${money(x.paid)} · ${x.dates.map(dmy).join(', ')}</span></div>` : ''}
    </div>`).join('') : '<div class="empty">Ще немає даних за місяцями.</div>'}
  </div>
  <div class="card"><div class="section-title"><h2>ZUS (здоровотний внесок)</h2></div>${list('zus', 'платежів ще немає')}</div>
  <div class="card"><div class="section-title"><h2>Бухгалтерка</h2></div>${list('ksiegowa', 'платежів ще немає')}</div>
  ${tax.note ? `<div class="card"><div class="sub">${esc(tax.note)}</div></div>` : ''}`;
}
function viewData() {
  setTitle('Дані');
  const accs = S.data.accounts.filter(a => a.status !== 'archive');
  const owners = [...new Set(accs.map(a => a.owner || 'Інші'))].sort((a, b) => (OWNER_ORDER.indexOf(a) + 1 || 99) - (OWNER_ORDER.indexOf(b) + 1 || 99));
  const row = (icon, label, v) => `<div class="info-row" ${v ? `data-copy="${esc(v)}"` : ''}>${ICONS[icon]}<span class="muted">${label}</span><b>${v ? esc(v) : '<span class="muted">не вказано</span>'}</b></div>`;
  $('#view').innerHTML = owners.map(o => `<div class="card">
      <div class="section-title"><h2>${esc(o)}</h2><span class="sub">${accs.filter(a => (a.owner || 'Інші') === o).length} акаунт.</span></div>
      ${accs.filter(a => (a.owner || 'Інші') === o).map(a => `<div class="acc-data">
        <div class="card-head"><a class="acc-name" href="#acc:${a.id}">${ICONS.user}<span>${esc(a.id)}</span>${a.platform === 'ebay' ? '<span class="tag-mini">eBay</span>' : '<span class="tag-mini">Vinted</span>'}</a>
        <button class="mini-btn" data-edit="${a.id}" aria-label="Змінити дані ${esc(a.id)}">${ICONS.pen}</button></div>
        ${row('mail', 'Пошта', a.email)}${row('phone', 'Телефон', a.phone)}${row('bank', 'Рахунок', a.bank)}
      </div>`).join('')}
    </div>`).join('') + '<div class="sub" style="text-align:center">Натисніть на пошту чи телефон, щоб скопіювати</div>';
  $('#view').querySelectorAll('[data-edit]').forEach(b => b.onclick = () => accountDataForm(accs.find(a => a.id === b.dataset.edit)));
  $('#view').querySelectorAll('[data-copy]').forEach(r => r.onclick = async () => { try { await navigator.clipboard.writeText(r.dataset.copy); toast('Скопійовано'); } catch (e) { toast(r.dataset.copy); } });
}
function accountDataForm(acc) {
  openSheet(`<h3>Дані · ${esc(acc.id)}</h3>
    <label class="field"><span>Пошта</span><input id="fMail" type="email" autocomplete="off" value="${esc(acc.email || '')}" placeholder="name@gmail.com"></label>
    <label class="field"><span>Телефон</span><input id="fPhone" type="tel" autocomplete="off" value="${esc(acc.phone || '')}" placeholder="+48 …"></label>
    <label class="field"><span>Банківський рахунок</span><input id="fBank" type="text" inputmode="text" autocomplete="off" value="${esc(acc.bank || '')}" placeholder="PL.. .... .... ...."></label>
    <button class="btn" id="ok">Зберегти</button>
    <button class="btn ghost" id="cancel">Скасувати</button>`, el => {
    el.querySelector('#cancel').onclick = closeSheet;
    el.querySelector('#ok').onclick = async () => {
      const email = el.querySelector('#fMail').value.trim(), phone = el.querySelector('#fPhone').value.trim(), bank = el.querySelector('#fBank').value.trim();
      if (await save(`Дані акаунта ${acc.id}`, d => Object.assign(d.accounts.find(a => a.id === acc.id), { email, phone, bank }))) closeSheet();
    };
  });
}
const cmpOff = () => store.get('vs_cmp_off') === '1';
const show = k => store.get('vs_hide_' + k) !== '1';
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
  setTitle('Головна');
  const p = P(), year = p.year, all = sales(), cur = forP(all, p);
  const S_ = (a, b) => sum(inRange(all, a, b), x => x.amount);
  const E_ = (a, b) => sum(inRange(S.data.expenses, a, b), x => x.amount);
  const M_ = (a, b) => sum(inRange(S.data.work, a, b), x => x.minutes);
  const PR_ = (a, b) => r2(S_(a, b) - E_(a, b));
  const A_ = (a, b) => { const sl = inRange(all, a, b), i = sum(sl, x => x.items); return i ? sum(sl, x => x.amount) / i : 0; };
  const wFirst = S.data.work.length ? S.data.work.map(x => x.date).sort()[0] : '9999-12-31';
  const H_ = (a, b) => { const a2 = a < wFirst ? wFirst : a; const m = M_(a2, b); return m ? PR_(a2, b) / (m / 60) : 0; };
  const sCur = sum(cur, x => x.amount), iCur = sum(cur, x => x.items);
  const eCur = E_(p.start, p.end), mCur = M_(p.start, p.end), profit = r2(sCur - eCur), hourly = H_(p.start, p.end);
  const goal = (+S.data.settings.goal || 0) * (p.kind === 'year' ? 12 : 1), goalRaw = goal ? sCur / goal * 100 : 0, goalP = Math.min(100, goalRaw);
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
  const months = [];
  if (p.kind === 'all') { for (let k = ymOf(p.start); k <= ymOf(today); k = shiftYM(k, 1)) months.push(k); }
  else for (let m = 1; m <= 12; m++) months.push(`${year}-${pad2(m)}`);
  const mLabel = k => p.kind === 'all' ? `${MONTHS_SHORT[+k.slice(5) - 1]} ${k.slice(2, 4)}` : MONTHS_SHORT[+k.slice(5) - 1];
  const thisYear = today.slice(0, 4), yearSales = all.filter(x => x.date.startsWith(thisYear));
  const mrows = months.map(k => {
    const sl = inYM(all, k), s = sum(sl, x => x.amount), n = sum(sl, x => x.items), e = sum(inYM(S.data.expenses, k), x => x.amount), w = sum(inYM(S.data.work, k), x => x.minutes);
    return { k, s, n, e, p: r2(s - e), w };
  });

  const halves = [
    show('avg') && (c => kpi('star', 'Середній чек', money(iCur ? sCur / iCur : 0), cmp(iCur ? sCur / iCur : 0, A_, p), c)),
    c => kpi('wallet', perLabel(p, 'Витрати за місяць', 'Витрати за рік'), money(eCur), cmp(eCur, E_, p, true), c),
    c => kpi('coin', 'Чистий прибуток', money(profit), cmp(profit, PR_, p), c),
    show('hourly') && (c => kpi('clock', 'Вартість години', mCur ? money(hourly) : '—', `${mCur ? cmp(hourly, H_, p) : ''}<div class="sub">${hmShort(mCur)} роботи (приблизно)${mCur && p.start < wFirst ? ` · рахується з ${dmy(wFirst)}` : ''}</div>`, c))
  ].filter(Boolean);
  $('#view').innerHTML = `
  <div class="grid g3">
    <div class="card dark span2-m"><div class="card-head"><div class="label">${ICONS.cal}${perLabel(p, 'Продажі за місяць', 'Продажі за рік')}</div>${p.same && !cmpOff() ? `<button class="mini-btn" id="cmpMode" aria-label="Що порівнювати">${ICONS.plus}</button>` : ''}</div><div class="big">${money(sCur)}</div>${cmp(sCur, S_, p)}<div class="sub" style="margin-top:6px">${iCur} речей</div></div>
    ${halves.map((h, i) => h(i === halves.length - 1 && halves.length % 2 ? 'span2-m' : '')).join('')}
    ${p.kind === 'all' || !show('goal') ? '' : `<div class="card span2-m"><div class="label">${ICONS.target}${perLabel(p, 'Ціль на місяць', 'Ціль на рік')}</div><div class="mid">Виконано ${Math.round(goalRaw)}%</div>
      <div class="progress"><i style="width:${goalP}%"></i></div>
      <div class="goal-row"><span>${money(sCur)}</span><span>з ${money(goal)}</span></div>
      <div class="sub" style="margin-top:8px">${ICONS.trend.replace('<svg', '<svg style="width:14px;height:14px;vertical-align:-2px"')} Прогноз на кінець ${p.kind === 'year' ? 'року' : 'місяця'}: <b style="color:var(--ink)">${money(forecast)}</b></div></div>`}
  </div>
  ${show('buys') ? buyCard(p) : ''}
  ${show('bestd') || show('bestm') ? `<div class="grid">
    ${!show('bestd') ? '' : `<div class="card ${show('bestm') ? '' : 'span2'}"><div class="label">${ICONS.star}${perLabel(p, 'Найкращий день місяця', 'Найкращий день року')}</div>${bestDay ? `<div class="mid">${dmy(bestDay.date)}</div><div class="chg up">${money(bestDay.amount)}</div>` : '<div class="mid flat">—</div>'}</div>`}
    ${!show('bestm') ? '' : `<div class="card ${show('bestd') ? '' : 'span2'}"><div class="label">${ICONS.trophy}Найкращий місяць</div>${bm ? `<div class="mid">${monthName(bm[0])}</div><div class="chg up">${money(bm[1])}</div>` : '<div class="mid flat">—</div>'}<div class="sub">за весь час</div></div>`}
  </div>` : ''}
  <div class="grid">
    <div class="card span2"><div class="section-title"><h2>Акаунти</h2><span class="sub">${p.name}</span></div>
      ${sCur ? `<div class="chart-box small"><canvas id="cAcc"></canvas></div>` : ''}
      ${accs.map(a => `<a href="#acc:${a.id}" style="color:inherit;text-decoration:none"><div class="acc-row"><span class="dot" style="background:${a.c}"></span><span class="name">${esc(a.id)}<small>${a.n} речей${a.status === 'archive' ? ' · архів' : ''}</small></span><b>${money(a.s)}</b></div></a>`).join('')}
      <div class="acc-row"><span class="dot" style="background:transparent"></span><span class="name">Разом</span><b>${money(sCur)}</b></div>
    </div>
  </div>
  <div class="card">
    <div class="section-title"><h2>Підсумок по місяцях</h2><span class="sub">${p.kind === 'all' ? 'весь час' : year}</span></div>
    <div class="scroll-x"><table class="table"><thead><tr><th>Місяць</th><th>Речей</th><th>Продажі</th><th>Витрати</th><th>Прибуток</th><th>Години</th>${cmpOff() ? '' : '<th>Δ</th>'}</tr></thead><tbody>
    ${mrows.filter(m => m.s || m.e || m.w).reverse().map(m => { const pp = period(m.k), ps = pp.same ? S_(pp.same.start, pp.same.end) : sum(inYM(all, shiftYM(m.k, -1)), x => x.amount); return `<tr><td>${p.kind === 'all' ? monthName(m.k) : MONTHS[+m.k.slice(5) - 1]}</td><td>${m.n}</td><td><b>${money(m.s)}</b></td><td class="muted">${money(m.e)}</td><td>${money(m.p)}</td><td class="muted">${hmShort(m.w)}</td>${cmpOff() ? '' : `<td>${ps ? pct(m.s, ps) : '<span class="chg flat">—</span>'}${pp.same ? `<div class="sub">1–${+pp.same.end.slice(8)}</div>` : ''}</td>`}</tr>`; }).join('') || '<tr><td colspan="7" class="empty">Немає даних</td></tr>'}
    </tbody></table></div>
  </div>`;

  const ink = cssVar('--ink'), muted = cssVar('--muted');
  chart('cMonths', { type: 'bar', data: { labels: months.map(mLabel), datasets: [{ data: mrows.map(m => m.s), backgroundColor: mrows.map(m => p.kind === 'month' && m.k === p.ym ? muted : ink), borderRadius: 10, borderSkipped: false, maxBarThickness: 34 }] },
    options: { maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => money(c.raw) } } }, scales: { x: { grid: { display: false }, border: { display: false } }, y: { ...gridOpts(), ticks: { callback: v => moneyShort(v) } } } } });
  let labels, curSeries, prevSeries, curName, prevName;
  if (p.kind === 'month') {
    const series = k => { const days = daysIn(k), byD = {}; inYM(all, k).forEach(s => { const d = +s.date.slice(8); byD[d] = (byD[d] || 0) + s.amount; }); let a = 0; const out = []; const lim = k === ymOf(today) ? +today.slice(8) : days; for (let d = 1; d <= days; d++) { a += byD[d] || 0; out.push(d <= lim ? r2(a) : null); } return out; };
    const pym = ymOf(p.prev.start), n = Math.max(daysIn(p.ym), daysIn(pym));
    labels = Array.from({ length: n }, (_, i) => i + 1); curSeries = series(p.ym); prevSeries = series(pym); curName = monthName(p.ym); prevName = monthName(pym);
  } else if (p.kind === 'all') {
    let a = 0; labels = months.map(mLabel); curSeries = mrows.map(m => { a += m.s; return r2(a); }); prevSeries = null; curName = 'За весь час';
  } else {
    const series = y => { let a = 0; const out = []; for (let m = 1; m <= 12; m++) { const k = `${y}-${pad2(m)}`; a += sum(inYM(all, k), x => x.amount); out.push(k <= ymOf(today) ? r2(a) : null); } return out; };
    labels = MONTHS_SHORT; curSeries = series(year); prevSeries = series(year - 1); curName = `${year}`; prevName = `${year - 1}`;
  }
  chart('cRun', { type: 'line', data: { labels, datasets: [
    { label: curName, data: curSeries, borderColor: ink, backgroundColor: ink, tension: .3, pointRadius: 0, borderWidth: 2.5 },
    ...(prevSeries ? [{ label: prevName, data: prevSeries, borderColor: muted, borderDash: [5, 4], tension: .3, pointRadius: 0, borderWidth: 1.8 }] : [])] },
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
  const isPromo = e => e.category === 'Просування Vinted';
  const PROMO_ = (a, b) => sum(inRange(ex, a, b).filter(isPromo), e => e.amount);
  const promos = cur.filter(isPromo), promoCur = sum(promos, e => e.amount);
  const kindOf = e => e.kind || (/показ/.test(e.desc || '') ? 'expo' : 'bump');
  const accOf = e => e.account || (e.desc || '').split(' · ')[0] || '—';
  const promoAccs = S.data.accounts.map((a, i) => ({ id: a.id, c: ACC_COLORS[i % ACC_COLORS.length], s: sum(promos.filter(e => accOf(e) === a.id), e => e.amount), n: promos.filter(e => accOf(e) === a.id).length }));
  const cats = CATS.map(c => ({ c, s: sum(cur.filter(e => e.category === c), e => e.amount) })).filter(x => x.s);
  const rows = [...cur].sort((a, b) => b.date.localeCompare(a.date));
  let body = '', lm = null;
  rows.forEach(e => {
    const m = ymOf(e.date);
    if (p.kind !== 'month' && m !== lm) { body += sepRow(m, 3, money(sum(inYM(cur, m), x => x.amount))); lm = m; }
    body += `<tr class="tap" data-id="${e.id}"><td>${dmy(e.date)} <span class="muted">${dowOf(e.date)}</span></td><td class="muted">${esc(e.category)}${e.qty ? ` <span class="sub">· ${e.qty} шт.</span>` : ''}</td><td><b>${money(e.amount)}</b></td></tr>${e.desc ? `<tr class="tap" data-id="${e.id}"><td colspan="3" class="desc">${esc(e.desc)}</td></tr>` : ''}${e.note ? `<tr class="tap" data-id="${e.id}"><td colspan="3" class="note">${esc(e.note)}</td></tr>` : ''}`;
  });
  $('#view').innerHTML = `
  <div class="grid g4">
    ${kpi('wallet', perLabel(p, 'Витрати за місяць', 'Витрати за рік'), money(sCur), cmp(sCur, E_, p, true), 'dark')}
    ${kpi('trend', perLabel(p, 'Просування за місяць', 'Просування за рік'), money(promoCur), cmp(promoCur, PROMO_, p, true) + '<div class="sub">на Vinted</div>')}
    ${kpi('box', perLabel(p, 'Закупок за місяць', 'Закупок за рік'), buys.length, cmp(buys.length, N_, p, true) + '<div class="sub">тільки секонд</div>')}
    ${kpi('star', 'Середньо за закупку', money(buys.length ? sBuys / buys.length : 0), '<div class="sub">тільки секонд</div>')}
  </div>
  ${buyCard(p)}
  <div class="grid g3">
    <div class="card span2"><div class="section-title"><h2>Просування на Vinted</h2><span class="sub">${p.name}</span></div>
      ${promos.length ? `<div class="list-days">
        <div><span>Підняття оголошень <span class="muted">· ${promos.filter(e => kindOf(e) === 'bump').length} раз</span></span><b>${money(sum(promos.filter(e => kindOf(e) === 'bump'), e => e.amount))}</b></div>
        <div><span>Показ профілю (Ekspozycja) <span class="muted">· ${promos.filter(e => kindOf(e) === 'expo').length} раз</span></span><b>${money(sum(promos.filter(e => kindOf(e) === 'expo'), e => e.amount))}</b></div>
      </div>
      <div class="sub" style="margin:12px 0 2px">По акаунтах</div>
      ${promoAccs.map(a => `<div class="acc-row"><span class="dot" style="background:${a.c}"></span><span class="name">${esc(a.id)}<small>${a.n} оплат</small></span><b>${money(a.s)}</b></div>`).join('')}
      <div class="acc-row"><span class="dot" style="background:transparent"></span><span class="name">Разом</span><b>${money(promoCur)}</b></div>`
      : `<div class="empty">За ${perWord(p)} оплат за просування немає.</div>`}
    </div>
    <div class="card span2-m"><div class="section-title"><h2>За категоріями</h2><span class="sub">${p.name}</span></div>
      ${cats.length ? `<div class="list-days">${cats.map(x => `<div><span>${esc(x.c)} <span class="muted">· ${sCur ? Math.round(x.s / sCur * 100) : 0}%</span></span><b>${money(x.s)}</b></div>`).join('')}</div>` : '<div class="sub">немає витрат</div>'}
    </div>
  </div>
  <div class="card">
    <div class="section-title"><h2>Записи</h2><span class="sub">${p.name}</span></div>
    ${rows.length ? `<div class="scroll-x"><table class="table"><thead><tr><th>Дата</th><th>На що</th><th>Сума</th></tr></thead><tbody>${body}</tbody></table></div>`
      : `<div class="empty">За ${perWord(p)} витрат немає.<br>Натисніть «+», щоб додати.</div>`}
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
    if (p.kind !== 'month' && m !== lm) { body += sepRow(m, 3, hmShort(sum(inYM(cur, m), y => y.minutes))); lm = m; }
    body += `<tr class="tap" data-id="${x.id}"><td>${dmy(x.date)} <span class="muted">${dowOf(x.date)}</span></td><td><b>${x.dayoff ? '—' : hmShort(x.minutes)}</b></td><td class="muted">${x.dayoff ? 'вихідний' : ''}</td></tr>${x.note ? `<tr class="tap" data-id="${x.id}"><td colspan="3" class="note">${esc(x.note)}</td></tr>` : ''}`;
  });
  const tm = S.data.timer, tmMin = tm ? Math.max(0, Math.round((Date.now() - new Date(tm.start)) / 60000)) : 0;
  const timerCard = `<div class="card dark"><div class="label">Таймер роботи</div>${tm
    ? `<div class="big">Працюєте з ${tm.start.slice(11, 16)}</div><div class="sub" id="tmEl">${hmShort(tmMin)}</div><button class="btn" id="tmStop" style="margin-top:10px">■ Закінчити</button><button class="btn ghost" id="tmCancel">Скасувати</button>`
    : `<div class="big">Не запущено</div><button class="btn" id="tmStart" style="margin-top:10px">▶ Почати роботу</button>`}</div>`;
  $('#view').innerHTML = timerCard + `
  <div class="grid g4">
    ${kpi('clock', perLabel(p, 'Години за місяць', 'Години за рік'), hmShort(mCur), cmp(mCur, M_, p), 'dark')}
    ${kpi('chart', 'Всього годин', hmShort(sum(w, x => x.minutes)), '<div class="sub">години приблизні</div>')}
    ${kpi('cal', 'Робочих днів', days, `<div class="sub">вихідних: ${cur.filter(x => x.dayoff).length}</div>`)}
    ${kpi('star', 'Середньо за робочий день', hmShort(days ? mCur / days : 0))}
  </div>
  <div class="card">
    <div class="section-title"><h2>Записи</h2><span class="sub">${p.name}</span></div>
    ${rows.length ? `<div class="scroll-x"><table class="table"><thead><tr><th>Дата</th><th>Час</th><th></th></tr></thead><tbody>${body}</tbody></table></div>`
      : `<div class="empty">За ${perWord(p)} записів немає.<br>Натисніть «+», щоб додати.</div>`}
  </div>`;
  $('#view').querySelectorAll('tr.tap').forEach(tr => tr.onclick = () => workForm(w.find(x => x.id === tr.dataset.id)));
  if ($('#tmStart')) $('#tmStart').onclick = timerStart;
  if ($('#tmStop')) $('#tmStop').onclick = timerStop;
  if ($('#tmCancel')) $('#tmCancel').onclick = timerCancel;
  if (tm) S.timerIv = setInterval(() => { const el = $('#tmEl'), t = S.data && S.data.timer; if (el && t) el.textContent = hmShort(Math.max(0, Math.round((Date.now() - new Date(t.start)) / 60000))); }, 30000);
}
const isoLocal = d => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
async function timerStart() {
  if (S.data.timer) return;
  await save('Таймер: старт роботи', d => { d.timer = { start: isoLocal(new Date()) }; });
}
async function timerCancel() {
  if (!S.data.timer || !confirm('Скасувати таймер без запису часу?')) return;
  await save('Таймер: скасовано', d => { delete d.timer; });
}
async function timerStop() {
  const t = S.data.timer; if (!t) return;
  const date = t.start.slice(0, 10), min = Math.round((Date.now() - new Date(t.start)) / 60000);
  if (min < 1) { if (await save('Таймер: менше хвилини, не записано', d => { delete d.timer; })) toast('Менше хвилини — не записано'); return; }
  if (min > 960 && !confirm(`Таймер працював ${Math.round(min / 60)} год. Записати все?`)) {
    const ex = S.data.work.find(x => x.date === date);
    return workForm(ex, { minutes: (ex && ex.minutes || 0) + min, clearTimer: true, date });
  }
  const ok = await save(`Таймер: ${dmy(date)} +${hmShort(min)}`, d => {
    const w = d.work.find(x => x.date === date);
    if (w) { w.minutes = (w.minutes || 0) + min; w.dayoff = false; } else d.work.push({ id: uid('w'), date, minutes: min, dayoff: false, note: '' });
    delete d.timer;
  });
  if (ok) toast(`Записано ${hmShort(min)} за ${dmy(date).slice(0, 5)}`);
}

/* ===== items analytics ===== */
/* categorizer (port of build/build_items.py) */
const normT = t => String(t || '').toLowerCase().replace(/ł/g, 'l').normalize('NFKD').replace(/[̀-ͯ]/g, '');
const CAT_DEFS = [
  ['Піджаки', String.raw`marynark\w*|blazer\w*|garnitur(?!ow\w*|u)|sakko|suit jacket`],
  ['Жилети', String.raw`bezrekawnik\w*|kamizelk\w*|vest|gilet|sleeveless`],
  ['Куртки', String.raw`kurtk\w*|jacket|parka|wiatrowk\w*|softshell|puchowk\w*|plaszcz\w*|coat|anorak|windbreaker|bomber\w*|harrington|puffer|jacke|mantel|ocieplan\w*|pikowan\w*|blouson|trucker`],
  ['Спортивні костюми', String.raw`dres komplet\w*|komplet dresow\w*|tracksuit|komplet`],
  ['Лонгсліви', String.raw`longsleeve|long sleeve|longslv|dlugi rekaw`],
  ['Фліси', String.raw`polar\w*|fleece|flis\w*`],
  ['Поло', String.raw`polo shirt|koszulka polo|polo koszulka|poloshirt|polowka`],
  ['Худі та світшоти', String.raw`bluz\w*|hoodie\w*|sweatshirt\w*|crewneck|crew neck|swetshirt|kaptur\w*|half zip|quarter zip|1/4 zip`],
  ['Светри', String.raw`sweter\w*|sweater\w*|pullover|kardigan\w*|cardigan\w*|knit\w*|jumper|dzianin\w*`],
  ['Футболки', String.raw`podkoszulk\w*|t-shirt\w*|tshirt\w*|t shirt|koszulk\w*|tee|jersey|tank top|crop top|singlet|podkoszulek\w*|trikot`],
  ['Сорочки', String.raw`koszul\w*|shirt\w*|flanel\w*`],
  ['Поло', String.raw`polo(?! ralph| by)|polo ralph laurent`],
  ['Шорти', String.raw`spodenk\w*|szort\w*|shorts?|bermud\w*|kapielowk\w*`],
  ['Штани', String.raw`spodni\w*|spodnie|jeans\w*|dzins\w*|chinos?|jogger\w*|trousers?|pants|cargo\w*|legginsy|leggings|dresy|sztruks\w*|denim|ogrodniczk\w*`],
  ['Взуття', String.raw`buty|sneaker\w*|adidasy|trampki|shoes?|boty|kapcie|klapki|sandal\w*|obuwie|boots?|botki|kozaki|halowki|korki|czlowenk\w*|chuck taylor|high top|ortholite|paraboot|polbut\w*|mokasyn\w*|loafer\w*|szpilk\w*|czolenk\w*|oxford\w*|oksford\w*|brogs\w*|sztyblet\w*|sztybet\w*|derby|kowbojk\w*|klaps\w*|mule|balerink\w*|baleriny|snickers\w*|gel-\w+|xt-6|speedgoat|hoka|sandaly|monk strap|mary jane|wsuwane|balenciaga track|air max|air force|jordan|ultra boost|ultraboost|samba|gazelle|campus|superstar|stan smith|dunk|nmd|yeezy`],
  ['Сумки та аксесуари', String.raw`torb\w*|plecak\w*|czapk\w*|kapelusz\w*|szalik\w*|rekawiczk\w*|pasek|nerk\w*|saszetk\w*|cap|beanie|bag|backpack|hat|scarf|gloves?|belt|wallet|portfel\w*|krawat\w*|szal|pierscien\w*|krzyzyk\w*|nalokietnik\w*|pas z\w*|torebk\w*|daszek|rekawic\w*|holder|sunglasses|kart holder|blind haki|haki|okulary|zegarek|bandana|opaska|skarpet\w*|socks?|snapback|komin\w*|listonoszk\w*`],
  ['Книги', String.raw`ksiazk\w*|book|harry potter|powiesc|komiks\w*|manga|podrecznik\w*`]
];
let CAT_RX = null;
const CAT_OVERRIDES = { 'Kurtka garnitur Yohji Yamamoto Y-3': 'Куртки', 'Stone Island grey long opium swag': 'Лонгсліви' };
function categorize(title) {
  if (!CAT_RX) CAT_RX = CAT_DEFS.map(([n, p]) => [n, new RegExp('(?<![a-z0-9])(?:' + p + ')(?![a-z0-9])')]);
  const t = normT(title), raw = String(title || '').trim();
  for (const k in CAT_OVERRIDES) if (raw.startsWith(k)) return CAT_OVERRIDES[k];
  for (const [n, rx] of CAT_RX) if (rx.test(t)) return n;
  return 'Інше';
}
const BRAND_LIST = ['Polo Ralph Lauren', 'Ralph Lauren', 'The North Face', 'Tommy Hilfiger', 'Tommy Jeans', 'Calvin Klein', 'Hugo Boss', 'Under Armour', 'New Balance', 'Helly Hansen', 'Jack Wolfskin', 'Stone Island', 'Fred Perry', "Levi's", 'Levis', 'Nike', 'Adidas', 'Puma', 'Lacoste', 'Carhartt', 'Mammut', 'Patagonia', 'Columbia', 'Champion', 'Reebok', 'Napapijri', 'Salomon', 'Diesel', 'Guess', 'Superdry', 'Fila', 'Umbro', 'Kappa', 'Ellesse', 'Asics', 'Converse', 'Vans', 'Wrangler', 'Armani', 'Versace', 'Gant', 'Barbour', 'Timberland', 'Dickies', 'Russell Athletic', 'Starter', 'Mizuno', 'Quiksilver', 'Billabong', 'Oakley', "Arc'teryx", 'Marmot', 'Berghaus', 'Regatta', 'Craghoppers', 'Fjallraven', 'Sergio Tacchini', 'Lonsdale', 'Lyle & Scott', 'Pepe Jeans', 'Replay', 'Hollister', 'Abercrombie', 'Tom Tailor', 'Esprit', 'Peak Performance', 'Jordan', 'Supreme', 'Stussy', 'Moncler', 'Burberry', 'Nautica', 'Henri Lloyd', 'Slazenger', 'Hummel', 'Diadora', 'Joma', 'Erima', 'Jako', 'Gildan', 'Fruit of the Loom', 'Tommy'];
const BRAND_CANON = { 'levis': "Levi's", 'polo ralph lauren': 'Ralph Lauren', 'ralph lauren': 'Ralph Lauren', 'tommy': 'Tommy Hilfiger', 'tommy jeans': 'Tommy Hilfiger', 'adidas': 'Adidas', 'boss': 'Hugo Boss', 'fjallraven': 'Fjällräven' };
let BRAND_RX = null;
function guessBrand(title) {
  if (!BRAND_RX) BRAND_RX = BRAND_LIST.map(b => [b, new RegExp('(?<![a-z0-9])' + normT(b).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?![a-z0-9])')]);
  const t = normT(title);
  for (const [b, rx] of BRAND_RX) if (rx.test(t)) return BRAND_CANON[normT(b)] || b;
  return null;
}
/* items = products of current sales; cat/brand taken from data.items when row matches, otherwise computed */
function buildItems() {
  const meta = new Map();
  (Array.isArray(S.data.items) ? S.data.items : []).forEach(it => { if (it && it.sale != null) meta.set(it.sale + '#' + it.idx, it); });
  const items = [], bare = [];
  S.data.sales.forEach(sl => {
    if (!sl.products || !sl.products.length) { bare.push(sl); return; }
    sl.products.forEach((pr, i) => {
      if (pr.price == null || isNaN(+pr.price)) return;
      const name = String(pr.name || '').trim(), m = meta.get(sl.id + '#' + i), ok = m && String(m.name || '').trim() === name;
      items.push({ sale: sl.id, idx: i, acc: sl.account, date: sl.date, name, price: +pr.price, cat: (ok && m.cat) || categorize(name), brand: (ok && m.brand) || guessBrand(name) });
    });
  });
  return { items, bare };
}
const itemCat = it => it.cat || 'Інше';
const itemsWho = () => store.get('vs_items_who') || 'all';
function itemsGroup(arr, keyFn) {
  const m = new Map();
  arr.forEach(it => { const k = keyFn(it); if (k == null) return; if (!m.has(k)) m.set(k, []); m.get(k).push(it); });
  return [...m.entries()].map(([k, list]) => { const total = sum(list, x => x.price); return { k, list, n: list.length, total, avg: list.length ? total / list.length : 0 }; });
}
function itemsSheet(title, list) {
  const rows = [...list].sort((a, b) => b.date.localeCompare(a.date));
  openSheet(`<h3>${esc(title)}</h3>
    <div class="plist" style="max-height:60vh">${rows.map(x => `<div class="pitem"><span>${esc(x.name || '—')}<small class="sub">${dmy(x.date)} · ${esc(x.acc || '')}</small></span><b>${money(x.price)}</b></div>`).join('')}</div>
    <button class="btn ghost" id="cancel">Закрити</button>`, el => { el.querySelector('#cancel').onclick = closeSheet; });
}
function viewItems() {
  setTitle('Аналітика товарів');
  const { items: all, bare: bareAll } = buildItems();
  if (!all.length && !bareAll.length) { $('#view').innerHTML = '<div class="card"><div class="empty">Дані про товари ще не додані.</div></div>'; return; }
  // who filter
  const accs = S.data.accounts || [], owners = [...new Set(accs.map(a => a.owner).filter(Boolean))].sort((a, b) => (OWNER_ORDER.indexOf(a) + 1 || 99) - (OWNER_ORDER.indexOf(b) + 1 || 99));
  const whoOpts = [{ v: 'all', t: 'Усі' }].concat(owners.map(o => ({ v: 'o:' + o, t: o })), accs.map(a => ({ v: 'a:' + a.id, t: a.id })));
  let who = itemsWho(); if (!whoOpts.some(o => o.v === who)) who = 'all';
  const accOk = who === 'all' ? null : who.startsWith('o:') ? new Set(accs.filter(a => a.owner === who.slice(2)).map(a => a.id)) : new Set([who.slice(2)]);
  const p = P();
  const inF = it => (!accOk || accOk.has(it.acc)) && (p.kind === 'all' || (it.date >= p.start && it.date <= p.end));
  const items = all.filter(inF), bare = bareAll.filter(x => inF({ acc: x.account, date: x.date }));
  const bareNote = bare.length ? `<div class="sub" style="margin:4px 4px 12px;text-align:center">Без назв речей: ${bare.length} продаж(і), ${sum(bare, x => x.items)} речей, ${money(sum(bare, x => x.amount))} (не враховано)</div>` : '';
  const head = `<div class="card"><label class="field" style="margin:0"><span>Хто</span><select id="itWho">${whoOpts.map(o => `<option value="${esc(o.v)}" ${o.v === who ? 'selected' : ''}>${esc(o.t)}</option>`).join('')}</select></label></div>`;
  const bind = () => { $('#itWho').onchange = e => { store.set('vs_items_who', e.target.value); render(); }; };
  if (!items.length) { $('#view').innerHTML = head + `<div class="card"><div class="empty">За цей період немає проданих речей.</div></div>` + bareNote; bind(); return; }

  const cats = itemsGroup(items, itemCat), cnt = items.length, total = sum(items, x => x.price);
  const sortedCats = [...cats].sort((a, b) => b.n - a.n || b.total - a.total);
  const topCat = sortedCats[0], maxN = topCat.n;
  const rich = cats.filter(c => c.n >= 3).sort((a, b) => b.avg - a.avg)[0];


  const brands = itemsGroup(items, x => x.brand ? String(x.brand).trim() : null).sort((a, b) => b.n - a.n || b.total - a.total).slice(0, 10);

  $('#view').innerHTML = head + `
  <div class="grid">
    ${kpi('box', 'Продано речей', cnt, `<div class="sub">на ${money(total)}</div>`, 'dark')}
    ${kpi('star', 'Середній чек речі', money(total / cnt))}
    ${kpi('trophy', 'Найпопулярніше', esc(topCat.k), `<div class="sub">${topCat.n} шт.</div>`)}
    ${kpi('trend', 'Найдорожче в середньому', rich ? esc(rich.k) : '—', `<div class="sub">${rich ? `≈${money(rich.avg)}` : 'потрібно від 3 речей'}</div>`)}
  </div>
  <div class="card">
    <div class="section-title"><h2>Що продається найбільше</h2><span class="sub">${esc(p.name)}</span></div>
    <div class="scroll-x"><table class="table"><thead><tr><th>Тип</th><th>Шт.</th><th>Сума</th><th>Сер. чек</th></tr></thead><tbody>${sortedCats.map((c, i) => `<tr class="tap" data-c="${i}"><td>${esc(c.k)}<div class="hbar"><i style="width:${Math.round(c.n / maxN * 100)}%"></i></div></td><td>${c.n}</td><td>${m0(c.total)}</td><td>${m0(c.avg)}</td></tr>`).join('')}</tbody></table></div>
    <div class="sub" style="margin-top:8px">Натисніть на рядок, щоб побачити речі</div>
  </div>
  <div class="card">
    <div class="section-title"><h2>Топ брендів</h2><span class="sub">топ 10</span></div>
    ${brands.length ? `<div class="scroll-x"><table class="table"><thead><tr><th>Бренд</th><th>Шт.</th><th>Сума</th><th>Сер. чек</th></tr></thead><tbody>${brands.map(b => `<tr><td>${esc(b.k)}</td><td>${b.n}</td><td>${m0(b.total)}</td><td>${m0(b.avg)}</td></tr>`).join('')}</tbody></table></div>` : '<div class="empty">Бренди не вказані</div>'}
  </div>` + bareNote;
  bind();
  $('#view').querySelectorAll('tr.tap[data-c]').forEach(tr => tr.onclick = () => { const c = sortedCats[+tr.dataset.c]; itemsSheet(`${c.k} · ${c.n} шт.`, c.list); });
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
const num = v => {
  let t = String(v ?? '').replace(/[\s\u00a0]/g, '');
  const c = t.lastIndexOf(','), d = t.lastIndexOf('.');
  if (c >= 0 && d >= 0) t = c > d ? t.replace(/\./g, '').replace(',', '.') : t.replace(/,/g, '');
  else t = t.replace(',', '.');
  return /^[+-]?(\d+\.?\d*|\.\d+)$/.test(t) ? parseFloat(t) : NaN;
};

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
      const ok = edit ? await save(`Змінено продаж ${acc} ${dmy(date)}: ${items} шт, ${amount} zł (було ${dmy(s.date)}: ${s.items} шт, ${s.amount} zł)`, d => Object.assign(d.sales.find(x => x.id === s.id), { date, items, amount }, extra))
        : await save(`Продаж ${acc} ${dmy(date)}: ${items} шт, ${amount} zł`, d => d.sales.push({ id: uid('s'), account: acc, date, items, amount, ...extra }));
      if (!ok) return;
      closeSheet(); focusDate(date); render();
    };
    if (edit) el.querySelector('#del').onclick = async () => { if (!confirm(`Видалити продаж ${dmy(s.date)} на ${money(s.amount)}?`)) return; if (await save(`Видалено продаж ${acc} ${dmy(s.date)}: ${s.items} шт, ${s.amount} zł`, d => { d.sales = d.sales.filter(x => x.id !== s.id); })) closeSheet(); };
  });
}

const promoPlat = c => !String(c || '').startsWith('Просування') ? null : /ebay/i.test(c) ? 'ebay' : 'vinted';
function promoAccOpts(cat, sel) {
  const pl = promoPlat(cat), list = S.data.accounts.filter(a => (a.platform || 'vinted') === pl);
  const def = sel && list.some(a => a.id === sel) ? sel : (list.find(a => a.status !== 'archive') || list[0] || {}).id;
  return list.map(a => `<option value="${esc(a.id)}" ${a.id === def ? 'selected' : ''}>${esc(a.id)}</option>`).join('');
}
function expenseForm(e) {
  const edit = !!e, eAcc = e ? (e.account || (e.desc || '').split(' · ')[0]) : null;
  openSheet(`<h3>${edit ? 'Редагувати витрату' : 'Нова витрата'}</h3>
    ${e && e.source ? `<div class="src">Запис у нотатці: ${esc(e.source)}</div>` : ''}
    <div class="row2"><label class="field"><span>Дата</span><input id="fDate" type="date" value="${e ? e.date : todayISO()}"></label>
    <label class="field"><span>Сума, zł</span><input id="fAmt" type="text" inputmode="decimal" value="${e ? String(e.amount).replace('.', ',') : ''}" placeholder="0,00"></label></div>
    <label class="field"><span>На що</span><select id="fCat">${CATS.map(c => `<option ${e && e.category === c ? 'selected' : ''}>${c}</option>`).join('')}</select></label>
    <label class="field" id="fAccWrap" ${e && promoPlat(e.category) ? '' : 'style="display:none"'}><span>Акаунт</span><select id="fAcc">${e && promoPlat(e.category) ? promoAccOpts(e.category, eAcc) : ''}</select></label>
    <label class="field" id="fQtyWrap" ${e && isBuyCat(e.category) ? '' : 'style="display:none"'}><span>Кількість речей (необов'язково)</span><input id="fQty" type="number" inputmode="numeric" min="1" step="1" value="${e && e.qty ? e.qty : ''}"></label>
    <label class="field"><span>Примітка (необов'язково)</span><input id="fNote" type="text" value="${e ? esc(e.note || '') : ''}"></label>
    <button class="btn" id="ok">${edit ? 'Зберегти зміни' : 'Додати витрату'}</button>
    ${edit ? '<button class="btn danger" id="del">Видалити запис</button>' : ''}
    <button class="btn ghost" id="cancel">Скасувати</button>`, el => {
    el.querySelector('#cancel').onclick = closeSheet;
    el.querySelector('#fCat').onchange = ev => {
      const c = ev.target.value, aw = el.querySelector('#fAccWrap'), as = el.querySelector('#fAcc');
      el.querySelector('#fQtyWrap').style.display = isBuyCat(c) ? '' : 'none';
      if (promoPlat(c)) { as.innerHTML = promoAccOpts(c, as.value || eAcc); aw.style.display = ''; } else aw.style.display = 'none';
    };
    el.querySelector('#ok').onclick = async () => {
      const date = el.querySelector('#fDate').value, amount = r2(num(el.querySelector('#fAmt').value)), category = el.querySelector('#fCat').value, note = el.querySelector('#fNote').value.trim();
      const q = parseInt(el.querySelector('#fQty').value, 10), qty = isBuyCat(category) && q >= 1 ? q : null;
      if (!date) return toast('Вкажіть дату'); if (!(amount >= 0)) return toast('Вкажіть суму');
      const promo = !!promoPlat(category), account = promo ? el.querySelector('#fAcc').value : null;
      if (promo && !account) return toast('Вкажіть акаунт');
      const ok = edit ? await save(`Змінено витрату ${dmy(date)}: ${amount} zł (${category})`, d => {
          const x = Object.assign(d.expenses.find(y => y.id === e.id), { date, amount, category, note });
          if (promo) { x.account = account; if (category === 'Просування Vinted' && !x.kind) x.kind = 'other'; }
          if (qty) x.qty = qty; else delete x.qty;
        })
        : await save(`Витрата ${dmy(date)}: ${amount} zł (${category})`, d => d.expenses.push({ id: uid('e'), date, category, amount, note, ...(qty ? { qty } : {}), ...(promo ? { account } : {}), ...(category === 'Просування Vinted' ? { kind: 'other' } : {}) }));
      if (!ok) return;
      closeSheet(); focusDate(date); render();
    };
    if (edit) el.querySelector('#del').onclick = async () => { if (!confirm(`Видалити витрату ${dmy(e.date)} на ${money(e.amount)}?`)) return; if (await save(`Видалено витрату ${dmy(e.date)}: ${e.amount} zł`, d => { d.expenses = d.expenses.filter(x => x.id !== e.id); })) closeSheet(); };
  });
}

function workForm(w, pre) {
  const edit = !!w, mn = pre ? pre.minutes : w ? w.minutes : null, h = mn != null ? Math.floor(mn / 60) : '', m = mn != null ? Math.round(mn % 60) : '';
  const ct = d => { if (pre && pre.clearTimer) delete d.timer; };
  openSheet(`<h3>${edit ? 'Редагувати час' : 'Час роботи'}</h3>
    ${w && w.source ? `<div class="src">Запис у нотатці: ${esc(w.source)}</div>` : ''}
    <label class="field"><span>Дата</span><input id="fDate" type="date" value="${pre ? pre.date : w ? w.date : todayISO()}"></label>
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
      const ok = edit ? await save(`Змінено час роботи ${dmy(date)}: ${off ? 'вихідний' : hmShort(minutes)}`, d => Object.assign(d.work.find(x => x.id === w.id), { date, minutes, dayoff: off, note }, ct(d)))
        : await save(`Час роботи ${dmy(date)}: ${off ? 'вихідний' : hmShort(minutes)}`, d => { d.work.push({ id: uid('w'), date, minutes, dayoff: off, note }); ct(d); });
      if (!ok) return;
      closeSheet(); focusDate(date); render();
    };
    if (edit) el.querySelector('#del').onclick = async () => { if (!confirm(`Видалити запис за ${dmy(w.date)}?`)) return; if (await save(`Видалено час роботи ${dmy(w.date)}`, d => { d.work = d.work.filter(x => x.id !== w.id); })) closeSheet(); };
  });
}

/* ===== export to Excel ===== */
const XLSX_URL = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
function loadXLSX() {
  if (window.XLSX) return Promise.resolve();
  return new Promise((res, rej) => { const s = document.createElement('script'); s.src = XLSX_URL; s.onload = res; s.onerror = () => rej(new Error('xlsx')); document.head.appendChild(s); });
}
function exportSheet() {
  if (!S.data) return;
  const today = todayISO(), accs = S.data.accounts || [];
  const owners = [...new Set(accs.map(a => a.owner).filter(Boolean))].sort((a, b) => (OWNER_ORDER.indexOf(a) + 1 || 99) - (OWNER_ORDER.indexOf(b) + 1 || 99));
  const whoOpts = [{ v: 'all', t: 'Усі' }].concat(owners.map(o => ({ v: 'o:' + o, t: o })), accs.map(a => ({ v: 'a:' + a.id, t: a.id })));
  const sel = S.month ? P() : null;
  openSheet(`<h3>Вивантажити в Excel</h3>
    <label class="field"><span>Період</span><select id="xPer">
      <option value="month">Цей місяць</option>
      ${sel ? `<option value="sel" selected>Обраний зверху: ${esc(sel.name)}</option>` : ''}
      <option value="year">Весь ${today.slice(0, 4)} рік</option>
      <option value="all">За весь час</option>
      <option value="custom">Свій період</option></select></label>
    <div class="row2" id="xCust" style="display:none"><label class="field"><span>Від</span><input id="xFrom" type="date" value="${today.slice(0, 7)}-01"></label>
    <label class="field"><span>До</span><input id="xTo" type="date" value="${today}"></label></div>
    <label class="field"><span>Хто</span><select id="xWho">${whoOpts.map(o => `<option value="${esc(o.v)}">${esc(o.t)}</option>`).join('')}</select></label>
    <button class="btn" id="ok">Завантажити .xlsx</button>
    <button class="btn ghost" id="cancel">Скасувати</button>`, el => {
    el.querySelector('#cancel').onclick = closeSheet;
    const per = el.querySelector('#xPer');
    per.onchange = () => { el.querySelector('#xCust').style.display = per.value === 'custom' ? '' : 'none'; };
    el.querySelector('#ok').onclick = async () => {
      let from, to;
      if (per.value === 'month') { const ym = ymOf(today); from = `${ym}-01`; to = `${ym}-${pad2(daysIn(ym))}`; }
      else if (per.value === 'sel') { from = sel.start; to = sel.end; }
      else if (per.value === 'year') { from = `${today.slice(0, 4)}-01-01`; to = `${today.slice(0, 4)}-12-31`; }
      else if (per.value === 'all') { const a = period('ALL'); from = a.start; to = a.end; }
      else { from = el.querySelector('#xFrom').value; to = el.querySelector('#xTo').value; }
      if (!from || !to || from > to) return toast('Перевірте період');
      toast('Готую файл…', 10000);
      try { await loadXLSX(); buildXlsx(from, to, el.querySelector('#xWho').value); closeSheet(); toast('Файл готовий ✓'); }
      catch (e) { toast('Не вдалося підготувати файл. Перевірте інтернет.', 4000); }
    };
  });
}
function buildXlsx(from, to, who) {
  const accs = S.data.accounts || [], accBy = Object.fromEntries(accs.map(a => [a.id, a]));
  const accOk = who === 'all' ? null : who.startsWith('o:') ? new Set(accs.filter(a => a.owner === who.slice(2)).map(a => a.id)) : new Set([who.slice(2)]);
  const R = arr => inRange(arr, from, to), byDate = (a, b) => a.date.localeCompare(b.date);
  const D = iso => ({ t: 'n', v: (Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10)) - Date.UTC(1899, 11, 30)) / 864e5, z: 'dd.mm.yyyy' });
  const N = v => ({ t: 'n', v: r2(v || 0), z: '#,##0.00' });
  const hmm = min => `${Math.floor(min / 60)}:${pad2(Math.round(min % 60))}`;
  const sl = R(sales()).filter(x => !accOk || accOk.has(x.account)).sort(byDate);
  const its = buildItems().items.filter(x => x.date >= from && x.date <= to && (!accOk || accOk.has(x.acc))).sort(byDate);
  const exAll = R(S.data.expenses).sort(byDate);
  const ex = accOk ? exAll.filter(e => accOk.has(e.account || (e.desc || '').split(' · ')[0])) : exAll;
  const wk = who === 'all' ? R(S.data.work).sort(byDate) : null;
  const wb = XLSX.utils.book_new();
  const add = (name, rows, cols) => { const ws = XLSX.utils.aoa_to_sheet(rows); ws['!cols'] = cols.map(wch => ({ wch })); XLSX.utils.book_append_sheet(wb, ws, name); };
  const sAmt = sum(sl, x => x.amount), sItems = sum(sl, x => x.items);
  add('Продажі', [['Дата', 'Акаунт', 'Платформа', 'Власник', 'Речей', 'Сума, zł']]
    .concat(sl.map(x => { const a = accBy[x.account] || {}; return [D(x.date), x.account, (a.platform || 'vinted') === 'ebay' ? 'eBay' : 'Vinted', a.owner || '', x.items, N(x.amount)]; }))
    .concat([['Разом', '', '', '', sItems, N(sAmt)]]), [12, 18, 12, 12, 8, 12]);
  add('Речі', [['Дата', 'Акаунт', 'Назва', 'Ціна, zł', 'Тип', 'Бренд']]
    .concat(its.map(x => [D(x.date), x.acc, x.name, N(x.price), itemCat(x), x.brand || ''])), [12, 18, 44, 12, 16, 16]);
  const eSum = sum(ex, x => x.amount);
  const exRows = [['Дата', 'Категорія', 'На що/опис', 'Акаунт', 'Кількість речей', 'Сума, zł', 'Примітка']]
    .concat(ex.map(e => [D(e.date), e.category, e.desc || '', e.account || '', e.qty || '', N(e.amount), e.note || ''])).concat([['Разом', '', '', '', '', N(eSum), '']]);
  if (accOk) exRows.push(['Інші витрати спільні — не включені']);
  add('Витрати', exRows, [12, 20, 28, 18, 10, 12, 30]);
  if (wk) {
    const wMin = sum(wk, x => x.minutes);
    add('Час роботи', [['Дата', 'Хвилини', 'Години (г:хх)', 'Вихідний', 'Примітка']]
      .concat(wk.map(x => [D(x.date), x.minutes == null ? '' : x.minutes, x.minutes == null ? '' : hmm(x.minutes), x.dayoff ? 'так' : 'ні', x.note || '']))
      .concat([['Разом', wMin, hmm(wMin), '', '']]), [12, 10, 14, 10, 30]);
  }
  const sum_ = [['Місяць', 'Продажі, zł', 'Речей', 'Витрати, zł', 'Прибуток, zł', 'Години']];
  for (let k = ymOf(from); k <= ymOf(to); k = shiftYM(k, 1)) {
    const s = sum(inYM(sl, k), x => x.amount), n = sum(inYM(sl, k), x => x.items), e = sum(inYM(ex, k), x => x.amount), w = wk ? sum(inYM(wk, k), x => x.minutes) : null;
    sum_.push([monthName(k), N(s), n, N(e), N(r2(s - e)), w == null ? '' : hmm(w)]);
  }
  sum_.push(['Разом', N(sAmt), sItems, N(eSum), N(r2(sAmt - eSum)), wk ? hmm(sum(wk, x => x.minutes)) : '']);
  add('Підсумок', sum_, [18, 14, 8, 14, 14, 10]);
  XLSX.writeFile(wb, `Sell-Analytics_${from}_${to}.xlsx`);
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
