# 新能源车充电小程序 - 设计系统文档

## 技术栈
- **框架**: 纯 HTML + Tailwind CSS (CDN)
- **字体**: Google Fonts - Fira Sans / Fira Code
- **图标**: Heroicons (SVG inline, outline 风格)
- **页面数**: 8 页

---

## 设计系统概览

### 配色方案
| 用途 | Token | 颜色值 | 说明 |
|------|-------|--------|------|
| Primary | `primary` | #0891B2 | 电能蓝 - 品牌主色，导航高亮、选中态、主要数据 |
| Secondary | `secondary` | #22D3EE | 青色 - 辅助强调，次要数据 |
| CTA | `cta` | #22C55E | 充电绿 - 行动按钮、快充标签、正面变化 |
| Background | `app-bg` | #ECFEFF | 极浅青 - 页面背景 |
| Text | `app-text` | #164E63 | 深青 - 正文/标题文字 |
| Warning | `amber-*` | #F59E0B/#D97706 | 警告橙 - 费用相关、排行金 |
| Danger | `red-*` | #EF4444 | 危险红 - 费用上涨、异常 |
| Neutral | `slate-*` | #64748B/#94A3B8/#CBD5E1 | 中性灰 - 辅助文字、分割线、边框 |

### 图表专用配色
| 用途 | 渐变色 | 说明 |
|------|--------|------|
| 充电量柱 | #DD847E → #E8A8A3 | 珊瑚色渐变 (R221 G132 B126)，暖色充电量 |
| 费用柱 | #A7D398 → #C2E4B8 | 鼠尾草绿渐变 (R167 G211 B152)，清新费用 |
| 时段分布 | #5F8EC5 / #74A3D4 / #8FB8DA / #A3C0E0 / #B8CFE8 / #D4E2F1 | 单色蓝明度阶梯 (#74A3D4 系) |
| 饼图-超充 | #164E63 | 深青 (app-text 色) |
| 饼图-快充 | #0891B2 | Primary |
| 饼图-慢充 | #22C55E | CTA 绿 |

### 字体
| 用途 | 字体 | 字重 |
|------|------|------|
| 标题 | Fira Sans | 500-700 |
| 正文 | Fira Sans | 300-400 |
| 数据/数字 | Fira Code (等宽) | 400-600 |

### 图标规范
- 来源: Heroicons (outline 风格, 24x24 viewBox)
- 尺寸: `w-6 h-6`(标准) / `w-5 h-5`(紧凑) / `w-4 h-4`(内联) / `w-3.5 h-3.5`(微型)
- 颜色: 继承父元素 text-* 或直接指定主题色
- 不使用 emoji 作为图标

---

## 视觉风格: Glassmorphism

### 核心效果
```css
.glass-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
}
```

### 设计变量
| 变量 | 值 | 用途 |
|------|----|------|
| --blur-amount | 10px | 磨砂玻璃模糊度 |
| --glass-opacity | 0.85 | 卡片背景透明度 |
| --border-color | rgba(255,255,255,0.5) | 玻璃边框 |
| --card-radius-sm | 12px (rounded-xl) | 普通卡片圆角 |
| --card-radius-lg | 16px (rounded-2xl) | 大卡片圆角 |

### 注意事项
- 浅色模式下透明度需 >= 0.8，确保文字对比度 4.5:1
- 卡片悬停: `hover:shadow-md transition-shadow`
- 可点击元素: `cursor-pointer`
- 过渡动画: `transition-colors` 或 `transition-shadow`，时长 200ms

---

## 通用组件

### 状态栏
两种风格:
- **Primary 背景** (首页、个人中心): `bg-primary text-white`，含天气/电池 SVG 图标
- **白色背景** (其他页面): `bg-white text-slate-600 border-b border-slate-100`，仅文字

### 头部
两种风格:
- **Primary 背景** (首页、个人中心): 包含用户信息、通知/设置按钮
- **白色背景 sticky** (其他页面): `bg-white px-4 py-4 border-b border-slate-100 sticky top-0 z-40`
  - 左侧: 返回箭头按钮 `w-10 h-10` 或无
  - 中间: 页面标题 `text-lg font-semibold text-app-text`
  - 右侧: 筛选按钮 / 时间切换 / 占位 `w-10`

### 底部导航
5 项固定底部 `fixed bottom-0 bg-white border-t border-slate-200`:
| 位置 | 图标 | 文字 | 特殊样式 |
|------|------|------|---------|
| 首页 | 房屋 | 首页 | 当前页高亮 `text-primary font-medium` |
| 记录 | 时钟 | 记录 | `text-slate-400` |
| 录入 | 加号 | 录入 | **CTA 圆形突出** `w-14 h-14 bg-cta rounded-full -mt-4 shadow-lg shadow-cta/30` |
| 分析 | 柱状图 | 分析 | `text-slate-400` |
| 我的 | 人像 | 我的 | `text-slate-400` |

### Glass Card 表单分组
每个表单区块使用 `glass-card rounded-xl p-4` 包裹:
- 左上角: `w-4 h-4 text-primary` 图标 + `text-sm font-medium text-slate-600` 标签
- 输入控件: `w-full h-12 px-4 bg-white border border-slate-200 rounded-lg`
- Focus: `focus:border-primary focus:ring-2 focus:ring-primary/20`
- 提交按钮: `w-full h-14 bg-cta text-white rounded-xl shadow-lg shadow-cta/20`

---

## 页面详细文档

### 1. 首页仪表盘 (dashboard.html)

**布局** (从上到下):

#### 状态栏 + 头部
- Primary 色背景，白色文字
- 问候语 + 用户名
- 右上: 通知铃铛 + 设置齿轮 (各 `w-10 h-10 bg-white/10 rounded-full`)

#### 车辆信息卡
**位置**: 头部 Primary 背景内的 glassmorphism 卡片

| 区域 | 内容 | 样式 |
|------|------|------|
| 左侧图标 | 车辆 SVG | `w-12 h-12 bg-primary/10 rounded-xl` |
| 中间文字 | 车型名称 + 配置 | `font-semibold` + `text-sm text-slate-600 truncate` |
| 右侧信息 | 上次充电 kWh + 时间 | 闪电图标 `w-3.5 h-3.5 text-cta` + kWh数值 + 日期 |

> **设计决策**: 右侧不显示"当前电量"，改为"上次充电"数据。原因: App 无法获取车辆实时 SOC。

**交互**: 点击整个卡片 → profile.html

#### 快捷入口
4 宫格 `grid grid-cols-4`，每项: 图标(48x48) + 文字

| 入口 | 图标背景 | 图标色 | 跳转 |
|------|---------|--------|------|
| 新增记录 | cta/10 | text-cta | add-record.html |
| 扫码充电 | primary/10 | text-primary | 无 (占位) |
| 附近电站 | amber-100 | text-amber-600 | 无 (占位) |
| 统计分析 | violet-100 | text-violet-600 | analytics.html |

#### 本月概览
2 列网格 `grid grid-cols-2`，卡片结构: 图标(32x32) + 指标名 + 数值 + 同比

| 指标 | 图标背景 | 数值示例 | 变化色规则 |
|------|---------|---------|-----------|
| 充电次数 | primary/10 | 12次 | 正面↑=cta绿, 负面↑=红 |
| 充电量 | cta/10 | 386 kWh | 同上 |
| 充电费用 | amber-100 | ¥582.50 | 费用↑=红(负面) |
| 平均单价 | secondary/10 | ¥1.51/kWh | ↓=cta绿(正面) |
| 充电总时长 | violet-100 | 28小时 | ↑=cta绿 |
| 百公里电耗 | rose-100 | 15.2 kWh | ↓=cta绿(正面) |
| 百公里成本 | emerald-100 (col-span-2) | ¥22.95 | ↓=cta绿(正面) |

#### 充电日历
交互式月历组件:
- 月份导航: 左右箭头 `w-9 h-9 min-w-[44px]` (满足触摸目标)
- 星期表头: 一~五 `text-slate-400`, 六日 `text-primary/60`
- 日历网格: `grid grid-cols-7 gap-1.5`, 每格 `h-11`
- 三种日期状态:
  - 今天+已充电: `bg-primary shadow-md shadow-primary/25` + 闪电 + 白色文字
  - 今天+未充电: `bg-primary/10 border-2 border-primary`
  - 已充电: `bg-primary/10 border border-primary/20` + 闪电标记
  - 未充电: `bg-white/50 border border-slate-100` + 浅灰文字
- 底部: 月度合计 kWh + 3色图例
- JavaScript: `renderCalendar(year, month)` 渲染，左右切换按钮触发

#### 最近充电记录
每项: 充电站图标(40x40) + 名称/时间 + kWh/费用
- 记录卡片为 `<a href="record-detail.html">`，可点击跳转详情页

---

### 2. 充电录入页 (add-record.html)

**头部**: 白色 sticky，左返回箭头 → dashboard.html

**表单分组** (每个 glass-card 包裹):

| 分组 | 字段 | 控件类型 | 特殊说明 |
|------|------|---------|---------|
| 选择车辆 | 车辆 | select 下拉 | 选项: 特斯拉 Model 3 / 蔚来 ES6 |
| 充电站 | 充电站名称 | text input | placeholder: "输入或选择充电站" |
|  | 充电类型 | 3选1 radio card | 超充(violet)/快充(primary,默认)/慢充(emerald) |
| 充电时间 | 开始时间 | datetime-local |  |
|  | 结束时间 | datetime-local |  |
|  | 充电时长 | 自动计算显示 | `bg-primary/5 rounded-lg` |
| 充电量与费用 | 充电量 | number input | 后缀 "kWh" |
|  | 充电费用 | number input | 前缀 "¥" |
|  | 单价 | 自动计算 | `bg-amber-50/80`, text-amber-600 |
|  | 平均功率 | 自动计算 | text-primary |
| 电量信息 | 起始电量 | range slider | `value=35`, 显示百分比 |
|  | 结束电量 | range slider | `value=90`, 显示百分比 |
|  | 电量提升 | 自动计算 | `bg-cta/5`, text-cta |
| 仪表盘总里程 | 总里程 | number input | 后缀 "km", 辅助文字: "用于计算百公里电耗和成本" |
| 备注 | 备注 | textarea (3行) | placeholder: "添加备注信息..." |

**充电类型 Radio Card**:
3 列网格 `grid grid-cols-3`，每项 `h-14` 卡片:
- 未选中: `border-slate-200` + `text-slate-400`
- 超充选中: `border-violet-500 bg-violet-50` + `text-violet-500`
- 快充选中: `border-primary bg-primary/5` + `text-primary`
- 慢充选中: `border-emerald-500 bg-emerald-50` + `text-emerald-500`

**Range Slider 自定义样式**:
```css
input[type="range"] { -webkit-appearance: none; height: 8px; background: #e2e8f0; border-radius: 4px; }
input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 24px; height: 24px; background: #0891B2; border-radius: 50%; }
```

**提交按钮**: `w-full h-14 bg-cta text-white rounded-xl shadow-lg shadow-cta/20` + 勾选图标

**底部导航**: 中间"录入"高亮 `text-primary font-medium`

---

### 3. 充电记录列表 (history.html)

**头部**: 白色 sticky，标题 + 筛选按钮 (漏斗图标)

**筛选标签**: 水平滚动药丸 `rounded-full`
| 标签 | 选中态 | 未选中态 |
|------|--------|---------|
| 全部 (默认) | `bg-primary text-white` | — |
| 本周/本月/快充/慢充 | — | `bg-slate-100 text-slate-600` hover `bg-slate-200` |

**统计概览卡**: glass-card，左: 充电次数，右: 充电量/费用

**记录列表**: 按日期分组 ("今天"/"昨天"/"本周")

> **导航**: 每条记录使用 `<a href="record-detail.html" class="block glass-card ...">`，点击跳转充电详情页。

每条记录结构:
```
┌─────────────────────────────────────┐
│ [图标48x48]  充电站名称    [快充标签] │
│              时间 · 时长              │
│  充电量      电量变化       费用       │
│ ─────────────────────────────────── │
│  ⚡充电损耗 -2.1%    📈平均功率 36.5kW│
└─────────────────────────────────────┘
```

| 元素 | 样式 |
|------|------|
| 图标 | 快充: `bg-cta/10 text-cta` / 慢充: `bg-primary/10 text-primary` |
| 类型标签 | 快充: `bg-cta/10 text-cta` / 慢充: `bg-primary/10 text-primary` |
| 费用 | `text-amber-600` |
| 充电损耗 | 正常: `text-cta` / 异常: `text-red-500` + 警告图标 |
| 平均功率 | `text-app-text` |
| 分隔线 | `border-t border-slate-100` |

**加载更多**: `text-primary` 文字按钮

---

### 4. 充电详情页 (record-detail.html)

**入口**: history.html 记录卡片点击 → 此页面; dashboard.html 最近充电卡片点击 → 此页面

**双模式切换**: 查看模式 ↔ 编辑模式

#### 查看模式 (默认)
头部右侧显示编辑图标 (铅笔)，点击进入编辑模式。

各信息卡片纯展示:
| 卡片 | 内容 |
|------|------|
| 车辆信息 | 车型名+配置，`bg-primary/5` 卡片 |
| 充电站 | 站名 + 类型标签 (快充 `bg-cta/10 text-cta`) |
| 充电时间 | 时间段 + 日期 + 时长 (font-mono text-primary) |
| 电量变化 | **电池可视化** (见下) |
| 充电量与费用 | 3 列: 充电量(primary) / 费用(amber) / 单价(cta) |
| 充电效率 | 2 列: 充电损耗(cta) / 平均功率(app-text) |
| 里程 | 总里程 + 百公里电耗 |
| 备注 | 文字展示 |

**电池可视化** (核心组件):
- 电池外壳: `bg-slate-100 rounded-lg border border-slate-200`, 高度 `h-14`
- 未充部分: `bg-slate-200`，宽度 = startSOC%
- 充电部分: `bg-gradient-to-r from-cta/80 to-cta`，left = startSOC%，width = (endSOC - startSOC)%
- 百分比标注: startSOC 位置显示灰色，充电区域内显示白色
- 刻度线: 25/50/75/100
- 下方: 起始电量(灰) → `+Δ%` (cta 绿色药丸) → 结束电量(cta)

**底部**: 删除记录按钮 (红色文字 + 垃圾桶图标)

#### 编辑模式
头部: 隐藏编辑图标，显示"取消"按钮 (`bg-slate-100`)；底部显示"保存修改"按钮 (`bg-cta`)。

各卡片内字段变为表单控件:
| 卡片 | 编辑控件 | 样式 |
|------|---------|------|
| 充电站 | text input | 同 add-record.html |
|  | 充电类型 | 3选1 radio card (超充violet/快充primary/慢充emerald) |
| 充电时间 | 2个 datetime-local | 同 add-record.html |
|  | 时长计算 | `bg-primary/5` 展示区 |
| 电量变化 | 2个 range slider | 同 add-record.html, 自定义 thumb |
| 充电量与费用 | number × 2 | kWh + ¥，单价/功率计算展示 |
| 里程 | number input | km 后缀 |
| 备注 | textarea | 同 add-record.html |

**交互**: 查看模式 `.view-field` → 编辑模式 `.edit-field`，JavaScript toggle 显示/隐藏，CSS `transition: all 0.2s ease`

**删除确认**: 底部抽屉式弹窗 (`fixed bottom bg-white rounded-t-2xl`)，含: 标题 + 说明 + 红色删除按钮 + 灰色取消按钮

**Toast 提示**: 保存/删除后显示 `fixed top-16 bg-app-text text-white px-5 py-3 rounded-xl`，1.5s 后淡出

---

### 5. 统计分析页 (analytics.html)

**头部**: 白色 sticky，标题 + 时间切换 (本月/本年)

**核心指标卡**: 3 列，中间列 `border-x border-slate-100` 分隔
| 指标 | 颜色 | 数值 |
|------|------|------|
| 总充电量 | text-primary | 386 kWh |
| 总费用 | text-cta | ¥582 |
| 充电次数 | text-amber-600 | 12 |

#### 月度充电趋势 (分组柱状图)
- **充电量柱**: `linear-gradient(180deg, #DD847E, #E8A8A3)` (珊瑚色渐变)
- **费用柱**: `linear-gradient(180deg, #A7D398, #C2E4B8)` (鼠尾草绿渐变)
- 当月高亮: 加 `shadow-sm shadow-[#DD847E]/30` (充电量) / `shadow-[#A7D398]/30` (费用)
- Y轴: 5 档 (200/150/100/50/0), `text-slate-400`
- 网格线: `border-slate-100`, 底线 `border-slate-200`
- 图例: 渐变色方块 `w-3 h-3 rounded` + 文字

#### 充电时段分布
4 列小柱状图，统一 `bg-cyan-50/40` 背景:
| 时段 | 柱体渐变 | 占比 |
|------|---------|------|
| 0-6点 | #B8CFE8 → #D4E2F1 (最浅) | 8% |
| 6-12点 | #8FB8DA → #B8CFE8 (中浅) | 25% |
| 12-18点 | #5F8EC5 → #8FB8DA (最深) | 42% |
| 18-24点 | #74A3D4 → #A3C0E0 (中深) | 25% |

> 设计原则: 以 #74A3D4 蓝色 (R116 G163 B212) 为底色的单色明度阶梯，越活跃越深。柱体背景 `bg-[#74A3D4]/10`。

#### 充电类型占比 (环形图)
SVG `circle` 实现，`-rotate-90`，中心显示总次数:

| 类型 | 颜色 | 次数 | 占比 |
|------|------|------|------|
| 超充 | #164E63 (深青) | 2次 | 17% |
| 快充 | #0891B2 (Primary) | 6次 | 50% |
| 慢充 | #22C55E (CTA绿) | 4次 | 33% |

> 设计原则: 三色形成 深→中→亮 的青-绿渐变，避免使用无关色系。

#### 效率统计
3 列 `grid-cols-3`:
| 指标 | 背景色 | 文字色 | 数值 |
|------|--------|--------|------|
| 平均单价/kWh | bg-primary/5 | text-primary | ¥1.51 |
| 平均充电时长 | bg-cta/5 | text-cta | 1.5h |
| 平均充电量 | bg-amber-50 | text-amber-600 | 32.2 |

#### 常用充电站排行
| 排名 | 徽章样式 |
|------|---------|
| #1 | `bg-amber-100 text-amber-600` |
| #2 | `bg-slate-100 text-slate-600` |
| #3 | `bg-cyan-50 text-primary` |

每项: 排名徽章 + 站名/次·kWh + 费用

---

### 6. 个人中心 (profile.html)

**头部**: Primary 背景
- 用户头像: `w-16 h-16 bg-white/20 rounded-full` + 人像 SVG
- 用户名 + 手机号 `text-white/80`
- 设置按钮: `w-10 h-10 bg-white/10 rounded-full`

**统计卡**: glass-card, 3 列 `divide-x divide-slate-200`
| 累计充电(kWh) | 累计费用 | 充电天数 |
|:---:|:---:|:---:|
| 386 | ¥582 | 42 |

#### 我的车辆
glass-card 分组列表:
- 默认车辆: 右侧 `bg-cta/10 text-cta rounded` "默认"标签
- 图标: 默认车 `bg-primary/10 text-primary`，其他车 `bg-secondary/10 text-secondary`
- "添加" 链接 → add-car.html

#### 数据管理
| 项目 | 图标色 | 右侧 |
|------|--------|------|
| 导出数据 | violet-100/violet-600 | 右箭头 |
| 数据备份 | primary/10/primary | 右箭头 |

#### 设置
| 项目 | 图标色 | 右侧控件 |
|------|--------|---------|
| 通知提醒 | amber-100/amber-600 | Toggle 开关 `bg-cta rounded-full` |
| 费用预算提醒 | cta/10/cta | 副标题 "每月 ¥800" + 右箭头 |
| 主题设置 | slate-100/slate-600 | 当前值 "浅色" + 右箭头 |
| 关于 | primary/10/primary | 版本号 "v1.0.0" + 右箭头 |

**退出登录**: `w-full text-red-500 hover:bg-red-50 rounded-xl`

---

### 7. 添加车辆页 (add-car.html)

**头部**: 白色 sticky，左返回箭头 → profile.html

**表单**: 级联选择 (品牌→型号→款式→电池容量)
每个字段独立 glass-card，含图标 + 标签 + 下拉:

| 字段 | 图标 | 级联依赖 | placeholder |
|------|------|---------|-------------|
| 品牌 | 标签 | 无 | 请选择品牌 |
| 型号 | 芯片 | 品牌 | 请先选择品牌 (初始 disabled) |
| 款式 | 收纳盒 | 型号 | 请先选择型号 (初始 disabled) |
| 电池容量 | 闪电 | 款式 | 请先选择款式 (初始 disabled, 自动匹配+手动修改) |
| 车牌号 | 文档 | 无 | 如：沪A·12345 (font-mono) |

**电池容量逻辑**: 选择款式后自动填充，同时显示其他常见容量选项，底部提示 "根据款式自动匹配，也可手动修改"

**品牌数据库** (JavaScript `vehicleData` 对象):
- 特斯拉: Model 3/Y/S/X
- 蔚来: ES6/ET5/ES8/ET7
- 比亚迪: 汉EV/海豹/元PLUS/唐EV
- 小鹏: P7/G6/G9
- 理想: L7/L8/L9/MEGA
- 极氪: 001/007/009

**反馈区**: `bg-primary/5 rounded-xl`，提示未找到车型可发邮件

**提交按钮**: 同充电录入页风格

---

### 8. 导航页 (index.html)

**用途**: 桌面端页面导航总览，非小程序内页面

**布局**: 固定顶部导航 + 卡片网格 + 设计亮点

**导航链接**: 仪表盘 / 录入 / 记录 / 分析 / 我的 / 加车 / 设计规范

> **注意**: 导航页未列出"充电详情页"(record-detail.html)，因该页由记录列表/首页卡片点击进入，非独立入口。

**页面卡片**: glass-card (opacity 0.8, border 0.3), 3 列网格，每卡: 图标 + 标题 + 描述 + 标签

**设计亮点**: 4 项 (电能主题 / 最小44px触摸 / 数据可视化 / 移动优先)

---

## 响应式断点

| 设备 | 宽度 | 布局 |
|------|------|------|
| 手机竖屏 | 375px | 单列 (小程序主要尺寸) |
| 手机横屏 | 667px | 单列 |
| 平板 | 768px | 双列 |
| 桌面 | 1024px+ | 多列 (导航页专用) |

## 交互规范

### 触摸目标
- 最小尺寸: 44x44px (`min-w-[44px] min-h-[44px]`)
- 按钮间距: 8px+
- 日历导航按钮已满足 44px 要求

### 加载状态
- 首次加载: 骨架屏
- 下拉刷新: 刷新指示器
- 提交表单: 按钮禁用 + 加载动画
- 列表底部: "加载更多" 按钮

### 反馈
- 操作成功: Toast 提示 (2秒)
- 操作失败: 错误提示 + 重试选项
- 删除操作: 二次确认弹窗

### 过渡动画
- 卡片悬停: `transition-shadow duration-200`
- 按钮悬停: `transition-colors`
- 导航切换: `transition-colors`
- 避免使用 `scale` 变换导致布局偏移

### 表单交互
- select 下拉: `appearance-none` + 自定义箭头 SVG
- 级联选择: 子级初始 `disabled`，父级 change 后启用
- Radio card: `peer sr-only` + `peer-checked:` 选中态样式
- Range slider: WebKit 自定义 thumb + track

---

## 设计决策记录

| 日期 | 决策 | 原因 |
|------|------|------|
| 2026-05-29 | 车辆卡右侧移除"当前电量"，替换为"上次充电 kWh + 时间" | App 无法获取车辆实时 SOC 数据，显示虚假电量无意义；上次充电数据来自用户录入记录，真实可靠 |
| 2026-05-29 | 分析页图表配色统一为品牌色系 | 原配色 (indigo/violet/rose/sky/orange) 与品牌青色主题脱节，改为 primary-cyan 双色 + 单色 cyan 明度阶梯 + 青绿渐变饼图 |
| 2026-05-29 | 记录列表和首页最近记录改为 `<a>` 链接跳转详情页 | 需要点击记录查看详情，history.html 和 dashboard.html 中记录卡片改为 `<a href="record-detail.html">` |
| 2026-05-29 | 新增充电详情页 (record-detail.html)，查看/编辑双模式 | 需要记录详情查看和编辑功能，采用 CSS class toggle (.view-field/.edit-field) 实现模式切换 |
