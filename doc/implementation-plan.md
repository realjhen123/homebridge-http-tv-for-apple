# Homebridge TV Plugin 实现方案

## 概述

为 homebridge 编写插件，通过 HTTP API 控制电视，让 iPhone 的 Remote App 可以操作电视的方向键、确认、返回、信息键和音量。

## 整体架构

```
iPhone Remote App
       ↓
   Homebridge
       ↓
  本插件 (homebridge-homebridge-http-tv-for-apple)
       ↓
   api.ts (HTTP 封装)
       ↓
  http://north.autohome.api.home/tv
       ↓
     电视
```

## 项目结构

```
homebridge-http-tv-for-apple/
├── src/
│   ├── api.ts          # 所有 HTTP API 调用集中管理
│   ├── index.ts        # 插件入口，注册平台
│   └── tv-accessory.ts # TV 配件实现（Television + Speaker）
├── package.json
├── tsconfig.json
└── doc/
    └── implementation-plan.md
```

## Homebridge TV 配件设计

### Television 服务

HAP-NodeJS 提供 `Television` 服务，通过 `RemoteKey` 特征（characteristic）实现遥控器按键映射：

| Remote App 按键 | RemoteKey 值 | 调用的 API |
|-----------------|-------------|-----------|
| 方向上         | ARROW_UP    | /up       |
| 方向下         | ARROW_DOWN  | /down     |
| 方向左         | ARROW_LEFT  | /left     |
| 方向右         | ARROW_RIGHT | /right    |
| 确认/选择      | SELECT      | /sure     |
| 返回           | BACK        | /back     |
| 信息           | INFORMATION | /stream   |

### TelevisionSpeaker 服务

`TelevisionSpeaker` 服务的 `VolumeSelector` 特征处理增量音量调节：

| Remote App 操作 | VolumeSelector 值 | 调用的 API |
|----------------|-------------------|-----------|
| 音量加          | INCREMENT         | /v_up     |
| 音量减          | DECREMENT         | /v_down    |

### 电源控制

| 操作          | 特征                 | 调用的 API |
|--------------|---------------------|-----------|
| 开机          | Active.ACTIVE       | /on       |
| 关机          | Active.INACTIVE     | /off      |

## api.ts 设计

所有 API 调用封装在一个文件中，提供类型安全的函数接口：

```typescript
// 基础请求方法
async function tvRequest(endpoint: string): Promise<void>

// 导出的具体操作方法
export async function powerToggle(): Promise<void>
export async function arrowUp(): Promise<void>
export async function arrowDown(): Promise<void>
export async function arrowLeft(): Promise<void>
export async function arrowRight(): Promise<void>
export async function confirm(): Promise<void>
export async function goBack(): Promise<void>
export async function information(): Promise<void>
export async function volumeUp(): Promise<void>
export async function volumeDown(): Promise<void>
```

## 实现步骤

1. **初始化项目**：创建 `package.json`、`tsconfig.json`，安装 homebridge 依赖
2. **实现 api.ts**：封装所有 HTTP GET 请求
3. **实现 tv-accessory.ts**：创建 Television + TelevisionSpeaker 配件，绑定按键事件到 API 调用
4. **实现 index.ts**：注册 Homebridge 平台，创建 TV 配件实例
5. **编译测试**：`npm run build`，验证 TypeScript 编译通过

## 关键技术点

- **homebridge 依赖**：`homebridge` 和 `hap-nodejs`（homebridge 自带）
- **HTTP 请求**：使用 Node.js 内置 `http` 模块，避免额外依赖
- **平台模式**：使用独立平台（`IndependentPlatformPlugin`），配置简单，无需在 config.json 中单独配置
- **Television 必须搭配 InputSource**：至少需要一个 InputSource 服务并链接到 Television，否则 HomeKit 可能无法识别

## 配置示例

```json
{
  "platforms": [
    {
      "platform": "homebridge-http-tv-for-apple",
      "name": "HTTP TV"
    }
  ]
}
```
