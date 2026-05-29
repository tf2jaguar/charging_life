# 新能源车充电小程序设计方案

## 项目概述
设计一个功能完善的新能源车充电管理小程序，包含充电录入、数据分析、统计报表等核心功能。

## 技术栈
- 框架：uni-app (Vue 3 + TypeScript)
- UI组件：自定义设计系统 ui-ux-pro-max
- 状态管理：Pinia
- 图表：uCharts / ECharts

## 页面结构

### 1. 首页 (pages/index)
- 顶部：用户信息 + 当前车辆卡片
- 中部：本月充电概览（充电次数、总电量、总费用）
- 底部：最近充电记录列表（快捷入口）
- 浮动按钮：快速录入充电

### 2. 充电录入页 (pages/charging/add)
- 表单字段：
  - 充电时间（日期+时间选择器）
  - 开始SOC / 结束SOC（滑块输入）
  - 充电电量（自动计算或手动输入）
  - 充电费用（金额输入）
  - 充电桩位置（地图选择/手动输入）
  - 充电类型（快充/慢充）
  - 备注（可选）
- 底部：保存按钮

### 3. 充电记录列表 (pages/charging/list)
- 筛选栏：时间范围、车辆筛选
- 列表项：时间、电量、费用、充电桩
- 支持左滑删除、点击编辑

### 4. 数据分析页 (pages/analysis)
- Tab切换：日/周/月/年
- 图表区域：
  - 充电费用趋势图（折线图）
  - 电量消耗分布（柱状图）
  - 充电时段分布（饼图）
- 统计卡片：
  - 平均单次充电电量
  - 平均单次费用
  - 每公里成本（需输入里程）

### 5. 统计报表页 (pages/report)
- 时间选择器
- 费用统计：总费用、峰谷平费用分布
- 电量统计：总电量、平均SOC变化
- 导出功能：生成PDF/图片分享

### 6. 车辆管理页 (pages/vehicle)
- 车辆列表
- 添加车辆表单：车牌、品牌、车型、电池容量
- 设置默认车辆

### 7. 个人中心 (pages/profile)
- 用户信息
- 设置项：提醒设置、数据备份、关于

## UI设计规范 (ui-ux-pro-max)

### 色彩体系
```css
/* 新能源主题色 */
--primary: #00B578;        /* 主色-绿色 */
--primary-light: #E8F8F2;  /* 浅绿背景 */
--warning: #FF9500;        /* 警示色-橙色 */
--danger: #FF4D4F;         /* 危险色-红色 */
--success: #52C41A;        /* 成功色 */

/* 中性色 */
--text-primary: #1A1A1A;
--text-secondary: #666666;
--text-placeholder: #999999;
--bg-page: #F5F5F5;
--bg-card: #FFFFFF;
```

### 组件库
1. **ev-card** - 数据卡片组件
2. **ev-stat** - 统计数字组件
3. **ev-chart** - 图表容器组件
4. **ev-form** - 表单组件
5. **ev-input-number** - 数字输入组件
6. **ev-slider-soc** - SOC滑块组件
7. **ev-record-item** - 记录列表项组件
8. **ev-empty** - 空状态组件

## 数据结构

### 充电记录
```typescript
interface ChargingRecord {
  id: string;
  vehicleId: string;
  datetime: string;
  startSoc: number;      // 0-100
  endSoc: number;        // 0-100
  energy: number;        // kWh
  cost: number;          // 元
  location?: string;
  chargerType: 'fast' | 'slow';
  remark?: string;
  createdAt: string;
}
```

### 车辆信息
```typescript
interface Vehicle {
  id: string;
  plateNumber: string;
  brand: string;
  model: string;
  batteryCapacity: number;  // kWh
  isDefault: boolean;
}
```

## 文件结构
```
src/
├── pages/
│   ├── index/index.vue           # 首页
│   ├── charging/
│   │   ├── add.vue               # 充电录入
│   │   ├── edit.vue              # 充电编辑
│   │   └── list.vue              # 记录列表
│   ├── analysis/analysis.vue     # 数据分析
│   ├── report/report.vue         # 统计报表
│   ├── vehicle/
│   │   ├── list.vue              # 车辆列表
│   │   └── edit.vue              # 车辆编辑
│   └── profile/profile.vue       # 个人中心
├── components/
│   ├── ev-card/
│   ├── ev-stat/
│   ├── ev-chart/
│   ├── ev-form/
│   └── ev-record-item/
├── stores/
│   ├── charging.ts
│   └── vehicle.ts
├── utils/
│   ├── storage.ts
│   └── chart.ts
└── static/
    └── images/
```

## 实现步骤

### Step 1: 项目初始化
- 创建 uni-app 项目
- 配置 TypeScript
- 安装依赖

### Step 2: 创建UI组件库
- 实现基础组件（ev-card, ev-stat, ev-form等）
- 配置全局样式

### Step 3: 实现核心页面
- 首页布局
- 充电录入表单
- 记录列表

### Step 4: 实现数据分析
- 图表集成
- 数据计算逻辑

### Step 5: 实现车辆管理
- 车辆CRUD
- 默认车辆切换

### Step 6: 数据持久化
- 本地存储
- 数据导入导出

## 验证方式
1. 在 HBuilderX 中运行到微信开发者工具
2. 测试充电录入流程
3. 验证数据统计准确性
4. 测试图表渲染