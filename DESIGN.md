# DESIGN.md — 一建机电学习复习系统 · 设计系统规范

> 基于 [awesome-design-md](https://github.com/VoltAgent/awesome-design-md) 规范生成
> 设计系统名称：**深蓝学术（Deep-Blue Academic）** ｜ 风格：深蓝底 + 金色强调，暗色主题，考试/学术/严肃科技感
> 适用范围：`一建机电` 全部界面（H5/桌面端一致）

---

## 1. Visual Theme & Atmosphere（视觉主题与氛围）

- **设计哲学**：以深蓝（#0e1630）为沉浸底色，金色（#e2a252）作为唯一强调色，营造"严肃考试 + 高端学术"的双重气质；信息密度高但不压抑，金色仅用于关键数据、激活态与成就，避免过度装饰。
- **视觉基调**：暗色、稳重、聚焦。借鉴金融/考试类产品的"数据可信感"。
- **核心视觉特征**：① 深蓝渐变背景 ② 金色高对比强调 ③ 卡片化信息分层 ④ 圆角 soft（14px）⑤ 手写 SVG 图表（无外部库）。
- **光影与质感**：纯扁平 + 微阴影（`0 8px 28px rgba(0,0,0,.35)`）；面板用 `linear-gradient(180deg,var(--panel),var(--bg-2))` 制造轻微层次；无毛玻璃、无重投影。

---

## 2. Color Palette & Roles（调色板与角色）

| 角色 | 名称 | HEX | CSS 变量 | 使用场景 |
|------|------|-----|----------|----------|
| 背景底 | Deep Navy | `#0e1630` | `--bg` | 页面最底层背景 |
| 背景次 | Navy 2 | `#16213e` | `--bg-2` | 卡片内底、图表底 |
| 面板 | Panel | `#1b2a4a` | `--panel` | 卡片/侧栏/选项底 |
| 面板高亮 | Panel 2 | `#22335c` | `--panel-2` | 表头/悬停面板 |
| 描边 | Line | `#2c3e66` | `--line` | 所有边框/分隔线 |
| 主强调 | Gold | `#e2a252` | `--gold` | 激活态、关键数字、按钮 |
| 强调柔 | Gold Soft | `#f0c98a` | `--gold-soft` | 标题文字、金色文字 |
| 正文 | Text | `#e8eefc` | `--text` | 主体文字 |
| 正文次 | Text Dim | `#9fb0d0` | `--text-dim` | 描述/元信息 |
| 正文弱 | Text Mute | `#6b7da3` | `--text-mute` | 占位/极弱提示 |
| 成功 | Green | `#3ec98a` | `--green` | 正确/通过/正向 |
| 错误 | Red | `#e8604c` | `--red` | 错误/未通过/负向 |
| 信息蓝 | Blue | `#5b8def` | `--blue` | 中性信息/链接 |

- **Semantic Colors**：成功 `--green`、警告/错误 `--red`、信息 `--blue`；以上三者均配 16% 透明度背景作 chip（如 `rgba(62,201,138,.16)`）。
- **Shadow Colors**：`--shadow: 0 8px 28px rgba(0,0,0,.35)`；图表区无独立阴影。
- 每个颜色均以 HEX + CSS 变量双格式提供，组件样式直接引用变量。

---

## 3. Typography Rules（排版规则）

- **Font Family**：`"PingFang SC","Microsoft YaHei","Segoe UI",system-ui,sans-serif`（中文优先，跨平台回退）。
- **Type Scale**（px / weight / line-height / letter-spacing）：

| 级别 | 用途 | 大小 | 字重 | 行高 | 字距 |
|------|------|------|------|------|------|
| Display | 大数字（学习力/分数） | 30-42px | 800 | 1.0 | 0 |
| Hero Title | 页标题 | 19px | 700 | 1.3 | .5px |
| Section Title | 区块标题 | 15px | 700 | 1.4 | 0（带左侧 4px 金条）|
| Card Title | 卡片标题 | 14.5px | 700 | 1.5 | 0 |
| Body | 正文/题干 | 14.5-16px | 500 | 1.7 | 0 |
| Meta | 元信息/选项 | 13-13.5px | 400 | 1.7 | 0 |
| Chip | 标签 | 11.5px | 600 | 1 | 0 |
| Mini | 极弱提示 | 12px | 400 | 1.5 | 0 |

- **设计哲学**：标题用 700-800 字重 + 金色锚定注意力；正文 500 字重保证阅读清晰；数字一律 `font-variant-numeric:tabular-nums` 等宽对齐（计时器/分数）。

---

## 4. Component Stylings（组件样式）

**Buttons**
- `.btn-primary`：背景 `linear-gradient(135deg,var(--gold),#cf8a36)`，文字 `#1a1305`；hover `filter:brightness(1.06)` + `translateY(-1px)`。
- `.btn-ghost`：背景 `--panel`，文字 `--text-dim`，边框 `--line`；hover 文字 `--text`、边框 `--gold`。
- `.btn-sm`：padding `7px 12px`，字号 12.5px。

**Cards**
- `.card`：背景 `linear-gradient(180deg,var(--panel),var(--bg-2))`，边框 `--line`，圆角 `--radius`(14px)，padding 20px，阴影 `--shadow`。

**Inputs / Select**
- `.select`：背景 `--panel`，文字 `--text`，边框 `--line`，圆角 9px，padding `8px 12px`；focus 由 JS 控制。

**Options（题目选项）**
- `.option`：背景 `--panel`，边框 `--line`，圆角 11px，padding `13px 16px`；hover 边框 `--gold`；`.sel` 边框+淡金底；`.correct` 绿边绿底；`.wrong` 红边红底；右侧 `.tag` 标注 ✓/✗。

**Navigation**
- `.nav-item`：transparent，文字 `--text-dim`；hover 背景 `--panel`；`.active` 金色左条 + 淡金底 + `--gold-soft` 文字。

**Badges / Tags**
- `.chip-gold / -blue / -green / -red / -gray`：圆角 20px，字号 11.5px，对应 16% 透明度底色 + 柔色文字。

**Modal**
- `.modal-mask`：`fixed inset:0` 半透明遮罩 `rgba(5,9,20,.7)`；`.modal` 背景 `--bg-2`、边框 `--line`、圆角 16px、max-width 560px、阴影 `--shadow`。

---

## 5. Layout Principles（布局原则）

- **Spacing System**：4px 基数；常用间距 8/10/12/14/16/18/20/26/30px（对应 CSS 中 padding/gap 取值）。
- **Grid System**：内容容器默认 `padding 26px 30px`；卡片网格 `grid-2/3/4`（2/3/4 列），`gap 18px`；`max-width` 在试卷/练习容器用 720-880px 居中。
- **Container**：`#app` flex 横向；侧栏固定 248px（`position:sticky;height:100vh`）；主区 `flex:1`。
- **Section Spacing**：区块间 `margin 16-18px`。
- **留白哲学**：以卡片为信息单元，单元内留白充足（padding 20px），单元间用 gap 呼吸；避免整屏拥挤。

---

## 6. Depth & Elevation（深度与层级）

- **Shadow System**：仅一层 `--shadow: 0 8px 28px rgba(0,0,0,.35)`，用于卡片/弹窗/侧栏浮层；选项与按钮不使用投影（仅靠边框/底色区分）。
- **Surface Layers**：`bg(#0e1630) → panel(#1b2a4a) → panel-2(#22335c) → overlay(模态/遮罩)`。
- **Z-index Scale**：内容默认 0；`.exam-bar` 吸顶 `z:5`；`.modal-mask` `z:50`；移动端 `.sidebar` `z:60`。
- **Backdrop Effects**：本系统采用纯扁平，无 backdrop-filter（保证离线/低性能设备一致渲染）。

---

## 7. Do's and Don'ts（设计规范与禁忌）

**Do's**
1. 金色仅用于激活态、关键数字、主按钮与成就——保持稀缺性。
2. 所有数值用等宽数字对齐（计时器、分数、百分比）。
3. 题目选项用边框色区分状态（金=选中、绿=正确、红=错误），不依赖颜色 alone（含 ✓/✗ 字符）。
4. 图表一律手写 SVG，颜色取自设计变量，离线可渲染。
5. 持久化状态写入 `localStorage`，失败时静默降级（不阻塞 UI）。

**Don'ts**
1. 不要引入任何外部 CDN / 字体 / 图标库（破坏离线可用）。
2. 不要使用纯红绿表达对错而无文字/符号辅助（色盲不可达）。
3. 不要擅自提高面板亮度或改用浅色主题（统一深蓝+金）。
4. 不要在 `file://` 下使用 fetch / ES module（部分浏览器会拦截）。
5. 不要为装饰添加重投影或毛玻璃（偏离扁平规范）。

---

## 8. Responsive Behavior（响应式行为）

- **Breakpoints**：desktop `>1100px`（grid-3/4 生效）；tablet `760-1100px`（grid 降为 2 列）；mobile `<760px`（单列，侧栏隐藏为抽屉）。
- **Touch Targets**：按钮/选项最小高度约 40-44px，满足触控。
- **折叠策略**：`<1100px` 卡片网格降列；`<760px` 侧栏 `translateX(-100%)` 收起，顶部 ☰ 按钮唤出抽屉（带半透明遮罩）；`.grid-2/3/4` 全部单列。
- **Font Scaling**：移动端保持根字号，仅缩小 padding/标题；大数字不缩放以防溢出。

---

## 9. Agent Prompt Guide（AI 代理提示指南）

**Quick Reference**
- 主题：深蓝底 #0e1630 + 金强调 #e2a252；暗色；扁平 + 单层柔影；手写 SVG。
- 结构：`index.html` 单入口 → `assets/css/styles.css` + `assets/js/{data_*.js, app.js}`。
- 数据：全局 `window.YJ_DATA.mechanical / .knowledge / .lectures`；状态 `localStorage['yj_jd_state_v1']`。

**Component Prompts（可直接复制使用）**
1. 生成一个机电单选题卡片：`type:"single"`、4 选项、answer 单字母数组、附 analysis。
2. 生成案例题：`type:"case"`，stem 含【背景】，subQuestions 每项含 q/a/score（采分点）。
3. 新增章节：`chapters.push({code:"1H4xxxxx", name:"…", knowledge:[…]})`。
4. 增加金色激活态导航项：`.nav-item.active` 左侧 3px 金条 + 淡金底。
5. 新增 SVG 趋势图：调用 `lineChart(vals)` / `barTrend(vals)` / `hBars(list)`，颜色用 `--gold`。
6. 设计错题重做弹窗：复用 `.modal-mask` + `.modal`，按钮"我答对了/我还错了"。
7. 新增章节复习速记卡：沿用 `.kb-kp .kp` + 金色 `•` 列表。

**Iteration Guide**
1. 改动视觉先改 `styles.css` 变量，不要在散落处写死颜色。
2. 新增题型先确认 `app.js` 的 `normQ` 归一化能识别（answer 数组、type 字段）。
3. 题库扩充只动 `data_mechanical.js`，引擎无需改动。
4. 任何新页面需在 `<760px` 与桌面端各验证一次（抽屉/单列）。
5. 保持零外部依赖：新增图表用 SVG/Canvas，不引库。
6. 评分规则与官方一致（多选少选 0.5/错选 0；合格 96/160）。
7. 持久化对象新增字段时兼容旧 `state`（loadState 缺省回退）。
8. 主按钮一律 `.btn-primary`（金），次级 `.btn-ghost`，禁用亮色填充。
