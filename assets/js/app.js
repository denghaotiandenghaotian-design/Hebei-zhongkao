/* =====================================================================
 * 一建机电 · 学习复习系统 · 应用引擎
 * 纯前端单页应用（IIFE，零外部依赖，可离线 / file:// 运行）
 * 模块：学习概览 / 题库练习 / 章节复习 / 错题收藏 / 模拟考试 / 进度跟踪
 *       / 考点知识库 / 名师讲课
 * 持久化：localStorage（key yj_jd_state_v1）
 * ===================================================================== */
"use strict";
(function () {
  const DATA = window.YJ_DATA && window.YJ_DATA.mechanical;
  const KNOWLEDGE = (window.YJ_DATA && window.YJ_DATA.knowledge) || [];
  const LECTURES = (window.YJ_DATA && window.YJ_DATA.lectures) || [];
  if (!DATA) { document.getElementById("content").innerHTML = '<div class="empty">数据加载失败，请确认 assets/js/data_*.js 已正确引入。</div>'; return; }

  /* ---------------- 工具 ---------------- */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  const pad = n => (n < 10 ? "0" + n : "" + n);
  const dateStr = dt => dt.getFullYear() + "-" + pad(dt.getMonth() + 1) + "-" + pad(dt.getDate());
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function yesterdayOf(d) { const x = new Date(d); x.setDate(x.getDate() - 1); return dateStr(x); }

  /* ---------------- 数据归一化 ---------------- */
  const Q = (DATA.questions || []).map(normQ).filter(Boolean);
  const QMAP = {}; Q.forEach(q => QMAP[q.id] = q);
  const CHAPTERS = DATA.chapters || [];
  const CHMAP = {}; CHAPTERS.forEach(c => CHMAP[c.code] = c);
  const getCh = code => CHMAP[code] || { code, name: code, knowledge: [] };
  function partOf(code) {
    if (/^1H41[1-4]/.test(code)) return "第1篇 机电工程技术";
    if (/^1H43[12]/.test(code)) return "第2篇 机电工程相关法规与标准";
    if (/^1H420/.test(code)) return "第3篇 机电工程项目管理实务";
    return "其他";
  }
  function normQ(q) {
    if (!q) return null;
    const type = q.type || "single";
    const opts = (q.options || []).slice();
    let ans = Array.isArray(q.answer) ? q.answer.slice() : (typeof q.answer === "string" ? q.answer.split("") : []);
    const o = {
      id: q.id, chapter: q.chapter || "", type,
      stem: q.stem || q.content || "",
      options: opts,
      answer: ans.map(x => String(x).trim().toUpperCase()),
      analysis: q.analysis || q.explanation || "",
      difficulty: q.difficulty || 3,
      freq: q.freq || "mid"
    };
    if (type === "case") o.subQuestions = q.subQuestions || [];
    return o;
  }
  const byType = t => Q.filter(q => q.type === t);
  const singleQ = byType("single"), multiQ = byType("multiple"), caseQ = byType("case");

  /* ---------------- 状态持久化 ---------------- */
  const STAT_KEY = "yj_jd_state_v1";
  let state = loadState();
  function loadState() {
    try { const s = JSON.parse(localStorage.getItem(STAT_KEY)); if (s && s.version === 1) return s; } catch (e) {}
    return defaultState();
  }
  function defaultState() { return { version: 1, attempts: [], wrong: {}, favorites: {}, exams: [], studyDays: {}, streak: { cur: 0, last: "" }, settings: {} }; }
  function save() { try { localStorage.setItem(STAT_KEY, JSON.stringify(state)); } catch (e) {} }

  function logStudy(q, correct, sec) {
    const d = dateStr(new Date());
    const s = state.studyDays[d] || { q: 0, correct: 0, min: 0 };
    s.q += q; s.correct += correct; s.min += Math.max(1, Math.round((sec || 0) / 60));
    state.studyDays[d] = s; updateStreak(d);
  }
  function updateStreak(d) {
    const last = state.streak.last;
    if (last === d) { if ((state.streak.cur || 0) <= 0) state.streak.cur = 1; return; }
    state.streak.cur = (last === yesterdayOf(d)) ? (state.streak.cur || 0) + 1 : 1;
    state.streak.last = d;
  }
  function addAttempt(chapter, type, correct, sec) {
    state.attempts.push({ ts: Date.now(), chapter, type, correct: !!correct, timeSec: sec || 0 });
    if (state.attempts.length > 6000) state.attempts = state.attempts.slice(-6000);
    logStudy(1, correct ? 1 : 0, sec || 0); save();
  }
  function recordWrong(qid, correct) {
    if (correct) {
      const w = state.wrong[qid];
      if (w) { w.consec = (w.consec || 0) + 1; w.lastCorrect = Date.now(); if (w.consec >= 3) w.eliminated = true; }
    } else {
      const w = state.wrong[qid] || { qid, count: 0, firstWrong: Date.now(), consec: 0, fav: !!state.favorites[qid], eliminated: false };
      w.count = (w.count || 0) + 1; w.lastWrong = Date.now(); w.consec = 0;
      state.wrong[qid] = w;
    }
    save();
  }

  /* ---------------- 统计辅助 ---------------- */
  function overallAcc() {
    const a = state.attempts.filter(x => x.type !== "case");
    if (!a.length) return { acc: 0, total: 0 };
    const c = a.filter(x => x.correct).length;
    return { acc: Math.round(c / a.length * 100), total: a.length, correct: c };
  }
  function chapterAcc(code) {
    const a = state.attempts.filter(x => x.chapter === code && x.type !== "case");
    if (!a.length) return null;
    return Math.round(a.filter(x => x.correct).length / a.length * 100);
  }
  function coveredChapters() { const s = new Set(state.attempts.map(x => x.chapter)); return s.size; }
  function learningPower() {
    const o = overallAcc();
    const cover = Math.min(100, Math.round(coveredChapters() / CHAPTERS.length * 100));
    const st = Math.min(100, (state.streak.cur || 0) * 10);
    const pw = Math.round(o.acc * 0.5 + cover * 0.3 + st * 0.2);
    return { pw: Math.max(0, Math.min(100, pw)), acc: o.acc, cover, streak: state.streak.cur || 0 };
  }
  const freqLabel = { high: "高频", mid: "中频", low: "低频" };
  const freqColor = { high: "chip-red", mid: "chip-blue", low: "chip-gray" };
  const typeLabel = { single: "单选", multiple: "多选", case: "案例" };

  /* ---------------- SVG 图表 ---------------- */
  function ringChart(pct) {
    pct = Math.max(0, Math.min(100, pct));
    return `<div class="force-ring" style="--p:${pct}"><div class="inner"><div class="v">${pct}</div><div class="t">学习力</div></div></div>`;
  }
  function lineChart(vals, w, h, color) {
    w = w || 560; h = h || 180; color = color || "#e2a252";
    if (!vals.length) return '<div class="muted" style="padding:20px">暂无数据</div>';
    const max = Math.max(100, ...vals), min = 0;
    const n = vals.length, pad = 28;
    const x = i => pad + i * (w - pad * 2) / Math.max(1, n - 1);
    const y = v => h - pad - (v - min) / (max - min) * (h - pad * 2);
    const pts = vals.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
    const area = `${pad},${h - pad} ${pts} ${w - pad},${h - pad}`;
    let grid = "";
    for (let g = 0; g <= 4; g++) { const gy = pad + g * (h - pad * 2) / 4; grid += `<line x1="${pad}" y1="${gy}" x2="${w - pad}" y2="${gy}" stroke="#2c3e66" stroke-width="1"/>`; }
    let dots = "";
    vals.forEach((v, i) => { if (i % Math.ceil(n / 10 || 1) === 0 || i === n - 1) dots += `<circle cx="${x(i).toFixed(1)}" cy="${y(v).toFixed(1)}" r="3" fill="${color}"/>`; });
    return `<svg viewBox="0 0 ${w} ${h}" width="100%" style="display:block"><defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".35"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>${grid}<polygon points="${area}" fill="url(#lg)"/><polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2.4"/>${dots}</svg>`;
  }
  function hBars(list, w) {
    w = w || 560;
    if (!list.length) return '<div class="muted" style="padding:14px">暂无数据</div>';
    const max = Math.max(100, ...list.map(x => x.v));
    return list.map(it => {
      const pct = Math.round(it.v / max * 100);
      const col = it.v >= 70 ? "#3ec98a" : it.v >= 50 ? "#e2a252" : "#e8604c";
      return `<div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;font-size:12.5px;color:var(--text-dim)"><span>${esc(it.name)}</span><span class="hl">${it.v}%</span></div><div class="bar"><i style="width:${pct}%;background:${col}"></i></div></div>`;
    }).join("");
  }

  /* ---------------- 渲染调度 ---------------- */
  const VIEWS = { dashboard: "学习概览", practice: "题库练习", review: "章节复习", wrongbook: "错题收藏", exam: "模拟考试", progress: "进度跟踪", knowledge: "考点知识库", lectures: "名师讲课" };
  let CURRENT = "dashboard";
  const content = () => $("#content");

  function setView(v) {
    CURRENT = v;
    $$(".nav-item").forEach(b => b.classList.toggle("active", b.dataset.view === v));
    $("#viewTitle").textContent = VIEWS[v] || "";
    document.body.classList.remove("nav-open");
    SESSION = null; EXAM = null;
    ({ dashboard: renderDashboard, practice: renderPractice, review: renderReview, wrongbook: renderWrongbook, exam: renderExam, progress: renderProgress, knowledge: renderKnowledge, lectures: renderLectures }[v] || renderDashboard)();
    content().scrollTop = 0;
  }

  /* ============== 学习概览 ============== */
  function renderDashboard() {
    const o = overallAcc(); const lp = learningPower();
    const wrongActive = Object.values(state.wrong).filter(w => !w.eliminated).length;
    const fav = Object.keys(state.favorites).length;
    const examCount = state.exams.length;
    const lastExam = examCount ? state.exams[examCount - 1] : null;
    const ach = computeAchievements();
    const unlocked = ach.filter(a => a.ok).length;
    const html = `
      <div class="grid grid-3" style="margin-bottom:18px">
        <div class="card" style="display:flex;gap:18px;align-items:center">
          ${ringChart(lp.pw)}
          <div>
            <div class="muted">学习力指数</div>
            <div class="stat-big" style="margin-top:6px"><span class="num">${lp.pw}</span><span class="lbl">综合掌握度评分</span></div>
            <div class="muted" style="margin-top:8px">正确率 ${lp.acc}% · 覆盖 ${lp.cover}% 章节 · 连续 ${lp.streak} 天</div>
          </div>
        </div>
        <div class="card"><div class="section-title">刷题概况</div>
          <div class="grid grid-2">
            <div class="stat-big"><span class="num">${o.total}</span><span class="lbl">累计刷题（客观题）</span></div>
            <div class="stat-big"><span class="num">${o.acc}%</span><span class="lbl">平均正确率</span></div>
            <div class="stat-big"><span class="num" style="color:var(--red)">${wrongActive}</span><span class="lbl">当前待消灭错题</span></div>
            <div class="stat-big"><span class="num">${examCount}</span><span class="lbl">完成模拟考试</span></div>
          </div>
        </div>
        <div class="card"><div class="section-title">快捷入口</div>
          <div style="display:flex;flex-direction:column;gap:10px;margin-top:6px">
            <button class="btn btn-primary" data-go="practice">📝 开始刷题</button>
            <button class="btn btn-ghost" data-go="exam">🏛️ 来一套模拟考</button>
            <button class="btn btn-ghost" data-go="review">📚 章节复习</button>
            <button class="btn btn-ghost" data-go="wrongbook">📕 我的错题本</button>
          </div>
        </div>
      </div>

      <div class="grid grid-2">
        <div class="card">
          <div class="section-title">最近学习趋势（每日正确率）</div>
          <div class="chart-wrap">${trendChart()}</div>
        </div>
        <div class="card">
          <div class="section-title">成就里程碑（${unlocked}/${ach.length}）</div>
          <div class="grid grid-2" style="margin-top:4px">
            ${ach.map(a => `<div class="badge ${a.ok ? "" : "locked"}"><div class="ico">${a.ico}</div><div><div class="bt">${a.name}</div><div class="bd">${a.desc}</div></div></div>`).join("")}
          </div>
        </div>
      </div>

      ${lastExam ? `<div class="card" style="margin-top:18px"><div class="section-title">最近一次模拟考试</div>
        <div class="grid grid-4">
          <div class="stat-big"><span class="num">${lastExam.score}</span><span class="lbl">总分 / 满分 ${lastExam.total}</span></div>
          <div class="stat-big"><span class="num">${Math.round(lastExam.score / lastExam.total * 100)}%</span><span class="lbl">得分率</span></div>
          <div class="stat-big"><span class="num" style="color:${lastExam.score >= DATA.passScore ? "var(--green)" : "var(--red)"}">${lastExam.score >= DATA.passScore ? "已通过" : "未通过"}</span><span class="lbl">合格线 ${DATA.passScore}</span></div>
          <div class="stat-big"><span class="num">${fav}</span><span class="lbl">收藏题数</span></div>
        </div></div>` : ""}
    `;
    content().innerHTML = html;
    $$("[data-go]").forEach(b => b.onclick = () => setView(b.dataset.go));
  }
  function trendChart() {
    const days = dailyAccLast(14);
    return lineChart(days.map(d => d.acc), 560, 180);
  }
  function dailyAccLast(n) {
    const out = []; const today = new Date();
    for (let i = n - 1; i >= 0; i--) {
      const dt = new Date(today); dt.setDate(dt.getDate() - i);
      const k = dateStr(dt); const s = state.studyDays[k];
      if (s && s.q) out.push({ d: k.slice(5), acc: s.q ? Math.round(s.correct / s.q * 100) : 0 });
    }
    return out.length ? out : [{ d: "-", acc: 0 }];
  }

  /* ============== 题库练习 ============== */
  let SESSION = null;
  function renderPractice() {
    if (SESSION) { renderQuiz(); return; }
    const chapterOpts = CHAPTERS.map(c => `<option value="${c.code}">${esc(c.code)} ${esc(c.name)}</option>`).join("");
    content().innerHTML = `
      <div class="card" style="max-width:720px">
        <div class="section-title">组卷设置</div>
        <div class="field" style="margin-bottom:16px">
          <span class="field-l">练习模式</span>
          <div class="seg" id="modeSeg">
            <button class="seg-btn active" data-mode="random">随机练习</button>
            <button class="seg-btn" data-mode="chapter">章节练习</button>
            <button class="seg-btn" data-mode="weak">薄弱优先</button>
          </div>
        </div>
        <div class="field" id="chField" style="display:none;margin-bottom:16px">
          <span class="field-l">选择章节</span>
          <select class="select" id="chSel" style="width:100%">${chapterOpts}</select>
        </div>
        <div class="mock-row" style="margin-bottom:16px">
          <div class="field"><span class="field-l">题目数量</span><input class="select" id="qNum" type="number" value="20" min="5" max="80" style="width:120px"></div>
          <div class="field"><span class="field-l">题型</span>
            <select class="select" id="qType" style="width:140px">
              <option value="all">全部题型</option><option value="single">仅单选</option><option value="multiple">仅多选</option><option value="case">仅案例</option>
            </select></div>
        </div>
        <button class="btn btn-primary" id="startP">▶ 开始练习</button>
      </div>
      <div class="card" style="max-width:720px;margin-top:16px">
        <div class="muted">说明：练习采用即时判分，答错自动收录进错题本；案例题为自测型（显示标准答案与采分点）。</div>
      </div>`;
    const seg = $("#modeSeg");
    seg.onclick = e => { const b = e.target.closest(".seg-btn"); if (!b) return; $$(".seg-btn", seg).forEach(x => x.classList.remove("active")); b.classList.add("active"); $("#chField").style.display = b.dataset.mode === "chapter" ? "block" : "none"; };
    $("#startP").onclick = startPractice;
  }
  function startPractice() {
    const mode = ($(".seg-btn.active") || {}).dataset?.mode || "random";
    let num = Math.max(5, Math.min(80, parseInt($("#qNum").value) || 20));
    const type = $("#qType").value;
    let pool = Q.filter(q => type === "all" ? true : q.type === type);
    if (mode === "chapter") { const c = $("#chSel").value; pool = pool.filter(q => q.chapter === c); }
    if (mode === "weak") {
      const weakCh = weakChapters();
      pool = pool.filter(q => weakCh.includes(q.chapter));
      if (pool.length < num) pool = pool.concat(Q.filter(q => q.type === type || type === "all"));
    }
    if (!pool.length) { alert("该范围暂无题目，请调整设置。"); return; }
    const list = shuffle(pool).slice(0, Math.min(num, pool.length));
    SESSION = { list, idx: 0, picks: {}, revealed: {}, results: [], start: Date.now() };
    renderQuiz();
  }
  function weakChapters() {
    const map = {};
    state.attempts.filter(x => x.type !== "case").forEach(a => { (map[a.chapter] = map[a.chapter] || { c: 0, t: 0 }); map[a.chapter].t++; if (!a.correct) map[a.chapter].c++; });
    return Object.keys(map).filter(c => map[c].t >= 3 && map[c].c / map[c].t >= 0.4);
  }
  function renderQuiz() {
    const s = SESSION; const q = s.list[s.idx];
    const total = s.list.length;
    const picked = s.picks[q.id] || [];
    const revealed = s.revealed[q.id];
    let head = `<div class="q-head"><div><span class="chip chip-gold">${typeLabel[q.type]}</span> <span class="chip ${freqColor[q.freq] || 'chip-gray'}">${freqLabel[q.freq]}</span> <span class="chip chip-gray">${esc(getCh(q.chapter).code)} ${esc(getCh(q.chapter).name)}</span></div><div class="muted">第 ${s.idx + 1} / ${total} 题</div></div>`;
    let body = "";
    if (q.type === "case") {
      body = `<div class="q-stem">${esc(q.stem)}</div><div style="margin-top:10px">` +
        q.subQuestions.map((sq, i) => `
          <div class="card" style="margin-bottom:12px;background:var(--bg-2)">
            <div class="sub-q"><b>问${i + 1}（${sq.score}分）：</b>${esc(sq.q)}</div>
            <div class="sub-a">标准答案：${esc(sq.a)}</div>
          </div>`).join("") + `</div>`;
      if (!revealed) body += `<button class="btn btn-primary" id="revBtn">显示答案并计入练习</button>`;
      else body += `<div class="muted">✓ 已完成本题自测</div>`;
    } else {
      body = `<div class="q-stem">${esc(q.stem)}</div>` + q.options.map((op, i) => {
        const letter = String.fromCharCode(65 + i);
        let cls = "option";
        if (revealed) {
          if (q.answer.includes(letter)) cls += " correct";
          else if (picked.includes(letter)) cls += " wrong";
        } else if (picked.includes(letter)) cls += " sel";
        const tag = revealed ? (q.answer.includes(letter) ? '<span class="tag ok">✓</span>' : (picked.includes(letter) ? '<span class="tag no">✗</span>' : "")) : "";
        return `<button class="${cls}" data-opt="${letter}">${letter}. ${esc(op)} ${tag}</button>`;
      }).join("");
      if (!revealed) body += `<button class="btn btn-primary" id="subBtn">提交答案</button>`;
      else body += `<div class="explain"><b>解析：</b>${esc(q.analysis)}</div>`;
    }
    const prog = `<div class="progress-line"><span>进度 ${s.idx + 1}/${total}</span><span>${s.results.filter(r => r.correct).length} 正确 · ${s.results.length - s.results.filter(r => r.correct).length} 错误</span></div>`;
    const nav = `<div style="display:flex;justify-content:space-between;margin-top:18px">
      <button class="btn btn-ghost" id="prevBtn" ${s.idx === 0 ? "disabled style=opacity:.5" : ""}>← 上一题</button>
      ${s.idx < total - 1 ? `<button class="btn btn-primary" id="nextBtn">下一题 →</button>` : `<button class="btn btn-primary" id="endBtn">完成练习 ✓</button>`}
    </div>`;
    content().innerHTML = `<div class="card" style="max-width:860px;margin:0 auto">${prog}${head}${body}${nav}</div>`;

    if (q.type === "case") {
      if (!revealed) $("#revBtn").onclick = () => { s.revealed[q.id] = true; s.results.push({ id: q.id, correct: true, type: "case" }); addAttempt(q.chapter, "case", true, 0); renderQuiz(); };
      else { bindQuizNav(); }
    } else {
      if (!revealed) {
        $$(".option").forEach(b => b.onclick = () => {
          const L = b.dataset.opt;
          if (q.type === "multiple") { const i = picked.indexOf(L); if (i >= 0) picked.splice(i, 1); else picked.push(L); }
          else { picked.length = 0; picked.push(L); }
          s.picks[q.id] = picked.slice(); renderQuiz();
        });
        $("#subBtn").onclick = () => {
          if (!picked.length) { alert("请先选择答案"); return; }
          const correct = q.type === "single" ? (picked.length === 1 && picked[0] === q.answer[0]) : (picked.length === q.answer.length && picked.every(p => q.answer.includes(p)));
          s.revealed[q.id] = true; s.results.push({ id: q.id, correct });
          addAttempt(q.chapter, q.type, correct, 0); recordWrong(q.id, correct);
          renderQuiz();
        };
      } else { bindQuizNav(); }
    }
    function bindQuizNav() {
      const p = $("#prevBtn"); if (p && !p.disabled) p.onclick = () => { SESSION.idx--; renderQuiz(); };
      const n = $("#nextBtn"); if (n) n.onclick = () => { SESSION.idx++; renderQuiz(); };
      const e = $("#endBtn"); if (e) e.onclick = finishPractice;
    }
  }
  function finishPractice() {
    const s = SESSION; const obj = s.results.filter(r => r.type !== "case");
    const c = obj.filter(r => r.correct).length, t = obj.length;
    const acc = t ? Math.round(c / t * 100) : 0;
    content().innerHTML = `<div class="card" style="max-width:720px;margin:0 auto;text-align:center">
      <div class="section-title" style="justify-content:center">练习完成</div>
      <div class="force-ring" style="--p:${acc}"><div class="inner"><div class="v">${acc}%</div><div class="t">正确率</div></div></div>
      <p class="muted" style="margin:14px 0">共 ${t} 道客观题，答对 ${c} 道；错题已自动收录至错题本。</p>
      <div style="display:flex;gap:12px;justify-content:center">
        <button class="btn btn-primary" id="again">再来一组</button>
        <button class="btn btn-ghost" id="toWrong">查看错题本</button>
        <button class="btn btn-ghost" id="toDash">返回首页</button>
      </div></div>`;
    $("#again").onclick = () => { SESSION = null; renderPractice(); };
    $("#toWrong").onclick = () => setView("wrongbook");
    $("#toDash").onclick = () => setView("dashboard");
    SESSION = null;
  }

  /* ============== 章节复习 ============== */
  function renderReview() {
    const parts = {};
    CHAPTERS.forEach(c => { const p = partOf(c.code); (parts[p] = parts[p] || []).push(c); });
    let html = '<div class="muted" style="margin-bottom:14px">按官方教材结构浏览章节与高频考点速记卡，点击章节展开；可一键进入该章练习。</div>';
    Object.keys(parts).forEach(p => {
      html += `<div class="card" style="margin-bottom:16px"><div class="section-title">${esc(p)}（${parts[p].length} 章）</div>`;
      parts[p].forEach(c => {
        const kp = (c.knowledge || []).map((k, i) => `<div class="kp">${esc(k)}</div>`).join("");
        html += `<div class="chapter" data-code="${c.code}">
          <div class="ch-head"><span class="code">${esc(c.code)}</span><span>${esc(c.name)}</span><span class="cnt">${c.knowledge ? c.knowledge.length : 0} 考点</span></div>
          <div class="kp-list" style="display:none"><div class="kb-kp">${kp}</div>
            <button class="btn btn-sm btn-ghost" data-prac="${c.code}">▶ 本章练习（随机10题）</button></div>
        </div>`;
      });
      html += `</div>`;
    });
    content().innerHTML = html;
    $$(".ch-head").forEach(h => h.onclick = () => { const ch = h.parentElement; ch.classList.toggle("open"); const lst = $(".kp-list", ch); lst.style.display = ch.classList.contains("open") ? "block" : "none"; });
    $$("[data-prac]").forEach(b => b.onclick = e => { e.stopPropagation(); startChapterPractice(b.dataset.prac); });
  }
  function startChapterPractice(code) {
    const pool = Q.filter(q => q.chapter === code);
    if (!pool.length) { alert("该章节暂未配置题目。"); return; }
    SESSION = { list: shuffle(pool).slice(0, Math.min(10, pool.length)), idx: 0, picks: {}, revealed: {}, results: [], start: Date.now() };
    renderQuiz();
  }

  /* ============== 错题收藏 ============== */
  function renderWrongbook() {
    content().innerHTML = `
      <div class="seg" id="wbSeg">
        <button class="seg-btn active" data-tab="wrong">📕 错题本（${Object.values(state.wrong).filter(w => !w.eliminated).length}）</button>
        <button class="seg-btn" data-tab="fav">★ 我的收藏（${Object.keys(state.favorites).length}）</button>
        <button class="seg-btn" data-tab="done">✅ 已消灭（${Object.values(state.wrong).filter(w => w.eliminated).length}）</button>
      </div>
      <div id="wbBody"></div>`;
    $("#wbSeg").onclick = e => { const b = e.target.closest(".seg-btn"); if (!b) return; $$(".seg-btn", $("#wbSeg")).forEach(x => x.classList.remove("active")); b.classList.add("active"); renderWbBody(b.dataset.tab); };
    renderWbBody("wrong");
  }
  function renderWbBody(tab) {
    const body = $("#wbBody");
    if (tab === "fav") {
      const ids = Object.keys(state.favorites);
      if (!ids.length) { body.innerHTML = '<div class="empty">还没有收藏的题目，在错题或练习中点击 ★ 即可收藏。</div>'; return; }
      body.innerHTML = ids.map(id => questionRow(QMAP[id], { favOnly: true })).join("");
      bindRows(body, { favOnly: true });
      return;
    }
    let list = Object.values(state.wrong).filter(w => tab === "done" ? w.eliminated : !w.eliminated);
    list.sort((a, b) => (b.count || 0) - (a.count || 0));
    if (!list.length) { body.innerHTML = tab === "wrong" ? '<div class="empty">🎉 当前没有待消灭的错题，继续保持！</div>' : '<div class="empty">暂无已消灭的错题。</div>'; return; }
    body.innerHTML = list.map(w => {
      const q = QMAP[w.qid]; if (!q) return "";
      const d = w.lastWrong ? new Date(w.lastWrong) : null;
      return `<div class="row" data-wid="${w.qid}">
        <div class="main-flex">
          <div class="ttl"><span class="chip ${freqColor[q.freq] || 'chip-gray'}">${typeLabel[q.type]}</span> ${esc(q.stem.slice(0, 60))}${q.stem.length > 60 ? "…" : ""}</div>
          <div class="sub">${esc(getCh(q.chapter).code)} ${esc(getCh(q.chapter).name)} · 错 ${w.count || 0} 次 · 连对 ${w.consec || 0}/3 ${d ? "· 最后 " + dateStr(d).slice(5) : ""}</div>
        </div>
        <button class="btn btn-sm btn-ghost" data-act="redo">重做</button>
        <button class="star-btn ${state.favorites[w.qid] ? "on" : ""}" data-act="fav" title="收藏">★</button>
        <button class="btn btn-sm btn-ghost" data-act="del" title="移除">✕</button>
      </div>`;
    }).join("");
    $$(".row", body).forEach(r => {
      const wid = r.dataset.wid;
      const fav = $(".star-btn", r);
      fav.onclick = () => { toggleFav(wid); fav.classList.toggle("on"); };
      const del = $("[data-act=del]", r);
      del.onclick = () => { delete state.wrong[wid]; save(); renderWrongbook(); };
      const redo = $("[data-act=redo]", r);
      redo.onclick = () => openRedo(wid);
    });
  }
  function bindRows(body, opt) {
    $$(".row", body).forEach(r => {
      const id = r.dataset.qid;
      const fav = $(".star-btn", r);
      if (fav) fav.onclick = () => { toggleFav(id); fav.classList.toggle("on"); };
      const show = $("[data-act=show]", r);
      if (show) show.onclick = () => showAnswer(id);
      const del = $("[data-act=del]", r);
      if (del) del.onclick = () => { delete state.favorites[id]; save(); renderWbBody("fav"); };
    });
  }
  function questionRow(q, opt) {
    if (!q) return "";
    const isFav = !!state.favorites[q.id];
    let detail = "";
    if (q.type === "case") detail = `<div class="sub-a" style="margin-top:6px">${q.subQuestions.map((s, i) => `问${i + 1}（${s.score}分）：${esc(s.a)}`).join("<br>")}</div>`;
    else detail = `<div class="explain" style="margin-top:8px">${q.options.map((o, i) => String.fromCharCode(65 + i) + ". " + esc(o)).join("　")}<br><b>答案：</b>${q.answer.join("、")}<br><b>解析：</b>${esc(q.analysis)}</div>`;
    return `<div class="row" data-qid="${q.id}" style="flex-direction:column;align-items:stretch">
      <div style="display:flex;align-items:center;gap:12px">
        <div class="main-flex"><div class="ttl"><span class="chip ${freqColor[q.freq] || 'chip-gray'}">${typeLabel[q.type]}</span> ${esc(q.stem.slice(0, 70))}${q.stem.length > 70 ? "…" : ""}</div>
        <div class="sub">${esc(getCh(q.chapter).code)} ${esc(getCh(q.chapter).name)}</div></div>
        ${opt && opt.favOnly ? `<button class="star-btn ${isFav ? "on" : ""}" data-act="fav">★</button><button class="btn btn-sm btn-ghost" data-act="del">✕</button>` : ""}
        ${!opt ? `<button class="btn btn-sm btn-ghost" data-act="show">显示答案</button>` : ""}
      </div>
      <div class="qa-detail" style="display:none">${detail}</div>
    </div>`;
  }
  function showAnswer(id) {
    const row = $(`.row[data-qid="${id}"]`); if (!row) return;
    const d = $(".qa-detail", row); d.style.display = d.style.display === "none" ? "block" : "none";
  }
  function toggleFav(id) {
    if (state.favorites[id]) delete state.favorites[id]; else state.favorites[id] = true;
    if (state.wrong[id]) state.wrong[id].fav = !!state.favorites[id];
    save();
  }
  function openRedo(qid) {
    const q = QMAP[qid]; if (!q) return;
    let detail = "";
    if (q.type === "case") detail = `<div class="muted" style="margin:10px 0">${q.subQuestions.map((s, i) => `<div class="sub-a">问${i + 1}（${s.score}分）：${esc(s.a)}</div>`).join("")}</div>`;
    else detail = `<div class="q-stem">${esc(q.stem)}</div>` + q.options.map((o, i) => `<div class="opt-line">${String.fromCharCode(65 + i)}. ${esc(o)}</div>`).join("") + (q.analysis ? `<div class="explain">答案：${q.answer.join("、")}<br>${esc(q.analysis)}</div>` : "");
    showModal(`重做错题 · ${esc(getCh(q.chapter).name)}`, `
      ${detail}
      <div class="mock-acts" style="margin-top:14px">
        <button class="btn btn-primary" id="redoOk">我答对了 ✓</button>
        <button class="btn btn-ghost" id="redoNo">我还错了 ✗</button>
      </div>`);
    $("#redoOk").onclick = () => { recordWrong(qid, true); closeModal(); renderWrongbook(); };
    $("#redoNo").onclick = () => { recordWrong(qid, false); closeModal(); renderWrongbook(); };
  }

  /* ============== 模拟考试 ============== */
  let EXAM = null;
  function renderExam() {
    if (EXAM) { EXAM.phase === "report" ? renderReport() : renderPaper(); return; }
    content().innerHTML = `
      <div class="card" style="max-width:760px">
        <div class="section-title">模拟考试设置</div>
        <div class="mock-row">
          <div class="field"><span class="field-l">试卷规模</span>
            <select class="select" id="exSize" style="width:200px">
              <option value="std">标准卷（单选20·多选10·案例5）</option>
              <option value="half">半卷（单选10·多选5·案例3）</option>
              <option value="custom">自定义</option>
            </select></div>
        </div>
        <div id="customField" style="display:none" class="mock-row">
          <div class="field"><span class="field-l">单选</span><input class="select" id="cS" type="number" value="20" min="0" max="40" style="width:90px"></div>
          <div class="field"><span class="field-l">多选</span><input class="select" id="cM" type="number" value="10" min="0" max="20" style="width:90px"></div>
          <div class="field"><span class="field-l">案例</span><input class="select" id="cC" type="number" value="5" min="0" max="10" style="width:90px"></div>
        </div>
        <div class="mock-row">
          <div class="field"><span class="field-l">计时方式</span>
            <select class="select" id="exTime" style="width:200px">
              <option value="timed">全真限时（${DATA.examMinutes}分钟）</option>
              <option value="untimed">练习不限时</option>
            </select></div>
        </div>
        <label class="chk" style="margin-bottom:14px"><input type="checkbox" id="exWeak" checked> 优先从薄弱/高频章节抽取</label>
        <button class="btn btn-primary" id="startExam">▶ 开始模拟考试</button>
        <div class="muted" style="margin-top:12px">评分规则：单选每题1分；多选全对2分、少选每对0.5分、错选0分；案例按采分点自评分。合格线 ${DATA.passScore} / ${DATA.fullScore}。</div>
      </div>`;
    $("#exSize").onchange = e => { $("#customField").style.display = e.target.value === "custom" ? "flex" : "none"; };
    $("#startExam").onclick = startExam;
  }
  function startExam() {
    const size = $("#exSize").value;
    let ns = 20, nm = 10, nc = 5;
    if (size === "half") { ns = 10; nm = 5; nc = 3; }
    if (size === "custom") { ns = Math.max(0, +$("#cS").value || 0); nm = Math.max(0, +$("#cM").value || 0); nc = Math.max(0, +$("#cC").value || 0); }
    const weak = $("#exWeak").checked ? weakChapters() : [];
    const pick = (arr, n, prefer) => {
      if (!n) return [];
      const prefQ = prefer && prefer.length ? arr.filter(q => prefer.includes(q.chapter)) : [];
      const rest = arr.filter(q => !prefQ.includes(q));
      let out = shuffle(prefQ).slice(0, Math.min(n, prefQ.length));
      if (out.length < n) out = out.concat(shuffle(rest).slice(0, n - out.length));
      return out.slice(0, n);
    };
    const singles = pick(singleQ, ns, weak);
    const multis = pick(multiQ, nm, weak);
    const cases = pick(caseQ, nc, weak);
    if (!singles.length && !multis.length && !cases.length) { alert("题库不足，无法组卷。"); return; }
    EXAM = { singles, multis, cases, picks: {}, revealed: false, timeMode: $("#exTime").value === "timed", deadline: 0, phase: "paper", start: Date.now(), caseScores: {} };
    if (EXAM.timeMode) EXAM.deadline = Date.now() + DATA.examMinutes * 60000;
    renderPaper();
  }
  function examQuestions() { const e = EXAM; return [].concat(e.singles, e.multis, e.cases); }
  function renderPaper() {
    const e = EXAM; const all = examQuestions();
    const timerHtml = e.timeMode ? `<div class="timer" id="examTimer">--:--</div>` : `<div class="muted">不限时练习</div>`;
    const palette = all.map((q, i) => `<div class="pc" data-go="${i}">${i + 1}</div>`).join("");
    let sec = "";
    let qi = 0;
    const block = (arr, label, score) => {
      if (!arr.length) return "";
      let h = `<div class="section-title" style="margin-top:18px">${label}</div>`;
      arr.forEach(q => { h += examQuestionHtml(q, qi++); });
      return h;
    };
    sec += block(e.singles, `一、单项选择题（每题 ${DATA.paper.singleScore} 分，共 ${e.singles.length} 题）`);
    sec += block(e.multis, `二、多项选择题（每题 ${DATA.paper.multipleScore} 分，共 ${e.multis.length} 题）`);
    sec += block(e.cases, `三、案例分析题（共 ${e.cases.length} 题）`);
    content().innerHTML = `
      <div class="exam-bar">
        <div><b>机电工程管理与实务 · 模拟考试</b></div>
        ${timerHtml}
        <button class="btn btn-primary" id="submitExam">交卷</button>
      </div>
      <div class="palette">${palette}</div>
      <div id="examSec">${sec}</div>`;
    $$(".pc").forEach(p => p.onclick = () => { const t = $(".mock-q", $("#examSec")).length ? null : null; const qs = $$(".mock-q", $("#examSec")); if (qs[p.dataset.go]) qs[p.dataset.go].scrollIntoView({ behavior: "smooth", block: "center" }); });
    bindExamOptions();
    $("#submitExam").onclick = submitExam;
    if (e.timeMode) startTimer();
  }
  function examQuestionHtml(q, i) {
    const picks = EXAM.picks[q.id] || [];
    let inner = "";
    if (q.type === "case") {
      inner = `<div class="q-stem">${esc(q.stem)}</div>` + q.subQuestions.map((sq, k) => `
        <div class="card" style="margin:10px 0;background:var(--bg-2)">
          <div class="sub-q"><b>问${k + 1}（${sq.score}分）：</b>${esc(sq.q)}</div>
          <div class="sub-a">标准答案：${esc(sq.a)}</div>
        </div>`).join("");
    } else {
      inner = `<div class="q-stem">${esc(q.stem)}</div>` + q.options.map((op, j) => {
        const L = String.fromCharCode(65 + j); const sel = picks.includes(L) ? "sel" : "";
        return `<button class="option ${sel}" data-qid="${q.id}" data-opt="${L}">${L}. ${esc(op)}</button>`;
      }).join("");
    }
    return `<div class="mock-q" id="eq${i}" style="margin-bottom:18px">${inner}</div>`;
  }
  function bindExamOptions() {
    $$(".option", $("#examSec")).forEach(b => b.onclick = () => {
      const q = QMAP[b.dataset.qid]; const L = b.dataset.opt;
      const picks = EXAM.picks[q.id] || [];
      if (q.type === "multiple") { const i = picks.indexOf(L); if (i >= 0) picks.splice(i, 1); else picks.push(L); }
      else { picks.length = 0; picks.push(L); }
      EXAM.picks[q.id] = picks.slice();
      b.classList.toggle("sel");
      if (q.type !== "multiple") $$(".option", b.parentElement).forEach(o => { if (o !== b) o.classList.remove("sel"); });
    });
  }
  function startTimer() {
    const t = $("#examTimer"); if (!t) return;
    EXAM._iv = setInterval(() => {
      const left = EXAM.deadline - Date.now();
      if (left <= 0) { clearInterval(EXAM._iv); t.textContent = "00:00"; submitExam(true); return; }
      const m = Math.floor(left / 60000), s = Math.floor(left / 1000) % 60;
      t.textContent = pad(m) + ":" + pad(s);
    }, 1000);
  }
  function gradeExam() {
    const e = EXAM; let sScore = 0, mScore = 0;
    e.singles.forEach(q => { const p = e.picks[q.id] || []; if (p.length === 1 && p[0] === q.answer[0]) sScore += DATA.paper.singleScore; });
    e.multis.forEach(q => {
      const p = (e.picks[q.id] || []).map(x => x.toUpperCase());
      const ans = q.answer;
      if (p.some(x => !ans.includes(x))) { /* 错选 0 分 */ }
      else { mScore += p.filter(x => ans.includes(x)).length * 0.5; }
    });
    let cScore = 0;
    e.cases.forEach(q => { q.subQuestions.forEach((sq, k) => { cScore += (e.caseScores[q.id + "_" + k] || 0); }); });
    return { sScore, mScore: Math.round(mScore * 10) / 10, cScore: Math.round(cScore * 10) / 10, total: Math.round((sScore + mScore + cScore) * 10) / 10 };
  }
  function submitExam(auto) {
    if (EXAM._iv) clearInterval(EXAM._iv);
    if (!auto) { if (!confirm("确认交卷？交卷后将生成成绩报告。")) { if (EXAM.timeMode) startTimer(); return; } }
    EXAM.phase = "report"; EXAM.revealed = true;
    renderReport();
  }
  function renderReport() {
    const e = EXAM; const g = gradeExam();
    const pass = g.total >= DATA.passScore;
    // type accuracy preview (objective)
    const objTotal = e.singles.length * DATA.paper.singleScore + e.multis.length * DATA.paper.multipleScore;
    // case scoring UI
    let caseHtml = "";
    e.cases.forEach(q => {
      caseHtml += `<div class="card" style="margin-bottom:14px"><div class="mock-q-n">${esc(getCh(q.chapter).name)} · 案例</div><div class="sub-q" style="white-space:pre-wrap">${esc(q.stem).slice(0, 120)}…</div>`;
      q.subQuestions.forEach((sq, k) => {
        const key = q.id + "_" + k; const cur = e.caseScores[key] || 0;
        caseHtml += `<div style="margin:8px 0;padding:8px 10px;background:var(--bg-2);border-radius:8px">
          <div class="sub-q"><b>问${k + 1}（${sq.score}分）</b> ${esc(sq.q)}</div>
          <div class="sub-a">标准：${esc(sq.a)}</div>
          <div class="mock-acts" style="margin-top:6px">
            <button class="btn btn-sm btn-ghost" data-cs="${key}" data-v="${sq.score}">满分 ${sq.score}</button>
            <button class="btn btn-sm btn-ghost" data-cs="${key}" data-v="${(sq.score / 2).toFixed(1)}">半分 ${(sq.score / 2).toFixed(1)}</button>
            <button class="btn btn-sm btn-ghost" data-cs="${key}" data-v="0">0分</button>
            <span class="hl" id="csv-${key}">当前 ${cur}</span>
          </div></div>`;
      });
      caseHtml += `</div>`;
    });
    content().innerHTML = `
      <div class="card" style="max-width:880px">
        <div class="section-title">成绩报告</div>
        <div class="grid grid-4">
          <div class="stat-big"><span class="num">${g.total}</span><span class="lbl">总分 / ${DATA.fullScore}</span></div>
          <div class="stat-big"><span class="num">${g.sScore}</span><span class="lbl">单选（${e.singles.length * DATA.paper.singleScore}分）</span></div>
          <div class="stat-big"><span class="num">${g.mScore}</span><span class="lbl">多选（${e.multis.length * DATA.paper.multipleScore}分）</span></div>
          <div class="stat-big"><span class="num">${g.cScore}</span><span class="lbl">案例（自评分）</span></div>
        </div>
        <div style="margin:12px 0"><span class="chip ${pass ? 'chip-green' : 'chip-red'}">${pass ? '✓ 已通过（合格线 ' + DATA.passScore + '）' : '✗ 未通过（差 ' + (DATA.passScore - g.total) + ' 分）'}</span></div>
        <div class="mock-export">
          <button class="btn btn-primary" id="saveExam">保存本次成绩</button>
          <button class="btn btn-ghost" id="exportPdf">📄 导出本卷 PDF</button>
          <button class="btn btn-ghost" id="redoExam">再做一套</button>
        </div>
      </div>
      <div class="card" style="max-width:880px;margin-top:16px">
        <div class="section-title">案例题评分（点击自评采分点）</div>
        ${caseHtml || '<div class="muted">本卷无案例题</div>'}
        <div style="margin-top:10px" class="hl">案例当前合计：${g.cScore} 分（修改上方评分后点击「刷新合计」）</div>
        <button class="btn btn-sm btn-ghost" id="refreshCase" style="margin-top:8px">刷新案例合计</button>
      </div>
      <div id="printArea"></div>`;
    $$("[data-cs]").forEach(b => b.onclick = () => { e.caseScores[b.dataset.cs] = parseFloat(b.dataset.v); $("#csv-" + b.dataset.cs).textContent = "当前 " + b.dataset.v; });
    $("#refreshCase").onclick = renderReport;
    $("#saveExam").onclick = () => {
      state.exams.push({ ts: Date.now(), score: g.total, total: DATA.fullScore, sScore: g.sScore, mScore: g.mScore, cScore: g.cScore, pass });
      logStudy(1, pass ? 1 : 0, Math.round((Date.now() - e.start) / 1000));
      save(); alert("已保存成绩。"); renderDashboard();
    };
    $("#redoExam").onclick = () => { EXAM = null; renderExam(); };
    $("#exportPdf").onclick = () => exportExamPdf(g);
  }
  function exportExamPdf(g) {
    const e = EXAM; const all = examQuestions();
    let html = `<div class="print-head"><h1>一建机电 · 模拟考试试卷及答案</h1>
      <div class="print-meta">科目：${DATA.name} ｜ 总分：<b>${g.total}</b> / ${DATA.fullScore} ｜ 合格线 ${DATA.passScore}</div>
      <div class="print-note">单选${e.singles.length}题·多选${e.multis.length}题·案例${e.cases.length}题</div></div>`;
    let n = 0;
    const renderQ = (q) => {
      n++;
      let s = `<div class="print-q"><div class="pq-h">${n}. <span class="pq-ch">[${typeLabel[q.type]}]</span></div>`;
      s += `<div class="pq-stem">${esc(q.stem)}</div>`;
      if (q.type === "case") {
        q.subQuestions.forEach((sq, k) => { s += `<div class="pq-sub"><b>问${k + 1}（${sq.score}分）：</b>${esc(sq.q)}</div><div class="pq-ans">参考答案：${esc(sq.a)}</div>`; });
      } else {
        q.options.forEach((o, i) => { s += `<div class="pq-opt">${String.fromCharCode(65 + i)}. ${esc(o)}</div>`; });
        s += `<div class="pq-ans">答案：${q.answer.join("、")}</div><div class="pq-exp">解析：${esc(q.analysis)}</div>`;
      }
      return s + `</div>`;
    };
    html += `<div class="print-q-list">${e.singles.map(renderQ).join("")}${e.multis.map(renderQ).join("")}${e.cases.map(renderQ).join("")}</div>`;
    const pa = $("#printArea"); pa.innerHTML = html; pa.style.display = "block";
    window.print();
    setTimeout(() => { pa.style.display = "none"; }, 500);
  }

  /* ============== 进度跟踪 ============== */
  function renderProgress() {
    const lp = learningPower(); const o = overallAcc();
    const days = lastNDays(30);
    const trend = days.map(d => { const s = state.studyDays[d.k]; return s && s.q ? Math.round(s.correct / s.q * 100) : 0; });
    const qPerDay = days.map(d => state.studyDays[d.k] ? state.studyDays[d.k].q : 0);
    const activeWrong = Object.values(state.wrong).filter(w => !w.eliminated).length;
    const killed = Object.values(state.wrong).filter(w => w.eliminated).length;
    const totalWrong = activeWrong + killed;
    const killRate = totalWrong ? Math.round(killed / totalWrong * 100) : 0;
    const chBars = CHAPTERS.map(c => { const a = chapterAcc(c.code); return a == null ? null : { name: c.code + " " + c.name.slice(0, 6), v: a }; }).filter(Boolean).slice(0, 16);
    const ach = computeAchievements();
    content().innerHTML = `
      <div class="grid grid-4" style="margin-bottom:18px">
        <div class="card" style="text-align:center">${ringChart(lp.pw)}<div class="muted" style="margin-top:8px">学习力指数</div></div>
        <div class="card"><div class="section-title">累计数据</div>
          <div class="grid grid-2"><div class="stat-big"><span class="num">${o.total}</span><span class="lbl">刷题数</span></div><div class="stat-big"><span class="num">${o.acc}%</span><span class="lbl">正确率</span></div>
          <div class="stat-big"><span class="num">${state.exams.length}</span><span class="lbl">模考次数</span></div><div class="stat-big"><span class="num">${coveredChapters()}</span><span class="lbl">覆盖章节</span></div></div></div>
        <div class="card"><div class="section-title">错题消灭</div>
          <div class="grid grid-2"><div class="stat-big"><span class="num" style="color:var(--red)">${activeWrong}</span><span class="lbl">待消灭</span></div><div class="stat-big"><span class="num" style="color:var(--green)">${killed}</span><span class="lbl">已消灭</span></div></div>
          <div class="bar" style="margin-top:12px"><i style="width:${killRate}%"></i></div><div class="muted" style="margin-top:6px">消灭率 ${killRate}%</div></div>
        <div class="card" style="display:flex;flex-direction:column;justify-content:center"><div class="section-title">连续学习</div>
          <div style="font-size:42px;font-weight:800;color:var(--gold-soft)">🔥 ${state.streak.cur || 0}</div><div class="muted">天 · 坚持就是胜利</div></div>
      </div>
      <div class="grid grid-2">
        <div class="card"><div class="section-title">近30天正确率趋势</div><div class="chart-wrap">${lineChart(trend, 560, 180)}</div></div>
        <div class="card"><div class="section-title">近30天刷题量</div><div class="chart-wrap">${barTrend(qPerDay)}</div></div>
      </div>
      <div class="card" style="margin-top:18px"><div class="section-title">各章节掌握度（已练习章节）</div>${hBars(chBars, 900)}</div>
      <div class="card" style="margin-top:18px"><div class="section-title">成就（${ach.filter(a => a.ok).length}/${ach.length}）</div><div class="grid grid-3" style="margin-top:4px">${ach.map(a => `<div class="badge ${a.ok ? "" : "locked"}"><div class="ico">${a.ico}</div><div><div class="bt">${a.name}</div><div class="bd">${a.desc}</div></div></div>`).join("")}</div></div>`;
  }
  function lastNDays(n) { const out = []; const t = new Date(); for (let i = n - 1; i >= 0; i--) { const d = new Date(t); d.setDate(d.getDate() - i); out.push({ k: dateStr(d), label: (d.getMonth() + 1) + "/" + d.getDate() }); } return out; }
  function barTrend(vals) {
    const w = 560, h = 180, pad = 24, max = Math.max(1, ...vals);
    const bw = (w - pad * 2) / vals.length * 0.7;
    const gap = (w - pad * 2) / vals.length;
    let bars = "";
    vals.forEach((v, i) => { const bh = v / max * (h - pad * 2); const x = pad + i * gap + (gap - bw) / 2; const y = h - pad - bh; bars += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(0, bh).toFixed(1)}" rx="3" fill="#5b8def"/>`; });
    return `<svg viewBox="0 0 ${w} ${h}" width="100%" style="display:block"><line x1="${pad}" y1="${h - pad}" x2="${w - pad}" y2="${h - pad}" stroke="#2c3e66"/>${bars}</svg>`;
  }

  /* ============== 考点知识库 ============== */
  function renderKnowledge() {
    const cats = ["高频速记", "数字考点", "考试规则", "教材变动"];
    const tabs = cats.map((c, i) => `<button class="seg-btn ${i === 0 ? "active" : ""}" data-cat="${c}">${c}</button>`).join("");
    content().innerHTML = `<div class="muted" style="margin-bottom:12px">机电实务核心资料库：高频速记、数字考点、考试规则与教材变动，点击卡片查看详情。</div>
      <div class="seg" id="kbSeg">${tabs}</div><div id="kbList" class="grid grid-2" style="margin-top:6px"></div>
      <div id="kbDetail" style="display:none"></div>`;
    $("#kbSeg").onclick = e => { const b = e.target.closest(".seg-btn"); if (!b) return; $$(".seg-btn", $("#kbSeg")).forEach(x => x.classList.remove("active")); b.classList.add("active"); renderKbList(b.dataset.cat); };
    renderKbList("高频速记");
  }
  function renderKbList(cat) {
    const list = KNOWLEDGE.filter(k => k.cat === cat);
    const el = $("#kbList");
    if (!list.length) { el.innerHTML = '<div class="empty">暂无内容</div>'; return; }
    el.innerHTML = list.map((k, i) => `<div class="kb-card" data-i="${i}"><div class="kb-card-h"><span class="code">${esc(k.code || "")}</span>${esc(k.title)}</div><div class="kb-card-m">${esc((k.body || "").slice(0, 40).replace(/\\n/g, " "))}…</div><div class="kb-card-go">查看详情 →</div></div>`).join("");
    $$(".kb-card", el).forEach(c => c.onclick = () => showKbDetail(cat, +c.dataset.i));
  }
  function showKbDetail(cat, i) {
    const k = KNOWLEDGE.filter(x => x.cat === cat)[i]; if (!k) return;
    const pts = (k.points || []).map(p => `<span class="chip chip-gold">${esc(p)}</span>`).join(" ");
    $("#kbList").style.display = "none"; $("#kbSeg").style.display = "none";
    const d = $("#kbDetail"); d.style.display = "block";
    d.innerHTML = `<button class="btn btn-ghost btn-sm" id="kbBack" style="margin-bottom:12px">← 返回列表</button>
      <div class="kb-detail"><span class="kb-detail-cat">${esc(k.cat)}</span>
      <div class="kb-detail-title"><span class="code">${esc(k.code || "")}</span>${esc(k.title)}</div>
      <div class="kb-detail-body">${esc(k.body).replace(/\\n/g, "<br>")}</div>
      ${pts ? `<div style="margin-top:14px">${pts}</div>` : ""}</div>`;
    $("#kbBack").onclick = () => { d.style.display = "none"; $("#kbList").style.display = "grid"; $("#kbSeg").style.display = "flex"; };
  }

  /* ============== 名师讲课 ============== */
  function renderLectures() {
    const cards = LECTURES.map(l => `<div class="card lec-card">
      <div class="lec-top"><div class="lec-ava">${esc((l.teacher || "师").charAt(0))}</div>
      <div class="lec-info"><div class="lec-title">${esc(l.title)}</div><div class="lec-by">${esc(l.teacher)} · <span class="chip chip-gold">${esc(l.tag || "")}</span></div></div></div>
      <div class="lec-intro">${esc(l.intro)}</div>
      <div class="lec-acts"><span class="muted">资源：</span><span class="hl">${esc(l.link || "各网校/平台")}</span></div>
    </div>`).join("");
    content().innerHTML = `<div class="muted" style="margin-bottom:12px">名师资源整理自网络公开渠道，按备考阶段推荐。请以各平台最新课程为准。</div>
      <div class="grid grid-2">${cards}</div>`;
  }

  /* ============== 成就 ============== */
  function computeAchievements() {
    const o = overallAcc();
    const examPass = state.exams.some(e => e.pass);
    const killed = Object.values(state.wrong).filter(w => w.eliminated).length;
    return [
      { ico: "🌱", name: "初出茅庐", desc: "完成首次刷题", ok: o.total >= 1 },
      { ico: "📚", name: "小有成就", desc: "累计刷题 100 道", ok: o.total >= 100 },
      { ico: "🔥", name: "刷题狂人", desc: "累计刷题 500 道", ok: o.total >= 500 },
      { ico: "🎯", name: "错题克星", desc: "消灭 10 道错题", ok: killed >= 10 },
      { ico: "🏛️", name: "模考达人", desc: "完成 5 套模拟考", ok: state.exams.length >= 5 },
      { ico: "🏆", name: "过关斩将", desc: "模拟考达合格线", ok: examPass },
      { ico: "📅", name: "持之以恒", desc: "连续学习 7 天", ok: (state.streak.cur || 0) >= 7 },
      { ico: "🗺️", name: "全章覆盖", desc: "覆盖 20+ 章节", ok: coveredChapters() >= 20 }
    ];
  }

  /* ---------------- 弹窗 ---------------- */
  function showModal(title, bodyHtml) {
    let m = $("#modalMask");
    if (!m) { m = document.createElement("div"); m.className = "modal-mask"; m.id = "modalMask"; document.body.appendChild(m); }
    m.innerHTML = `<div class="modal"><h3>${esc(title)}</h3><div id="modalBody">${bodyHtml}</div></div>`;
    m.classList.add("show");
    m.onclick = e => { if (e.target === m) closeModal(); };
  }
  function closeModal() { const m = $("#modalMask"); if (m) m.classList.remove("show"); }

  /* ---------------- 初始化 ---------------- */
  function init() {
    $("#viewTitle").textContent = VIEWS.dashboard;
    $("#streakBox").textContent = "🔥 连续学习 " + (state.streak.cur || 0) + " 天";
    $$(".nav-item").forEach(b => b.onclick = () => setView(b.dataset.view));
    const mb = $("#menuBtn"); if (mb) mb.onclick = () => document.body.classList.toggle("nav-open");
    $("#resetBtn").onclick = () => { if (confirm("确认清空本地全部学习记录（错题、进度、模考成绩）？此操作不可恢复。")) { state = defaultState(); save(); $("#streakBox").textContent = "🔥 连续学习 0 天"; setView("dashboard"); alert("已重置。"); } };
    setView("dashboard");
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
