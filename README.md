# pi-provider-workbuddy

把本机登录的 WorkBuddy（CodeBuddy）模型接入 [pi](https://pi.dev) —— 国内版与国际版两个 provider 并行注册，支持 OAuth 扫码登录、动态模型目录（含积分倍率）、模型行显示真实倍率，以及只读的积分/状态查询。

> **风险提示**：WorkBuddy 已开始限制非官方客户端请求。本项目不保证相关接口长期可用。每一次调用都消耗**你自己账号**的积分，按上游给出的倍率真实扣费；插件不提供账号、不共享凭据、不绕过计费。请自行评估账号风险。

## 安装

```bash
pi install npm:pi-provider-workbuddy
# 或本地路径
pi install ./pi-provider-workbuddy
```

## 使用

两个 provider 始终注册，登录入口即 `/login`：

```bash
/login workbuddy          # 国内版（copilot.tencent.com），扫码登录
/login workbuddy-global   # 国际版（workbuddy.ai），网页登录
```

登录后模型自动出现在选择器里，模型名内嵌上游积分倍率（如 `GLM-5.3 · x0.79`）。本机没有账号的区域不列出可发起请求的模型（列出来只会点到就失败）。

桌面端已登录的账号会被自动发现（Windows 上新版桌面端加密的凭据字段通过调用已安装 App 自身的解密能力读取，App 未安装时如实报告「拿不到密钥」而不是谎报未登录）。桌面端 auth 文件**始终只读**；刷新得到的 token 写到插件自己的目录（`~/.pi/agent/workbuddy/`）。

## 命令

| 命令 | 说明 |
| --- | --- |
| `/workbuddy.status` | 两个区域的登录状态、凭据来源、token 有效期与积分余额（只读） |
| `/workbuddy.refresh` | 从上游刷新模型目录并重载 |
| `/workbuddy.logout [cn\|global]` | 清除插件自己存的凭据（不影响桌面端登录） |

## 工作原理

```text
pi (openai-completions 内建实现)
  → 自定义 fetch 覆盖层：
      · prepareChatBody：强制 stream:true、tool_choice 压平、
        developer→system、保证 system 头、已测得的渠道指纹前置中性头
      · WorkBuddy 头：Bearer token、会话身份三件套（每请求现生成）、
        CLI UA、X-User-Id / X-Enterprise-Id / X-Domain
  → 国内版 https://copilot.tencent.com/v2/chat/completions
    国际版 https://www.workbuddy.ai（或 codebuddy.ai，按凭据域路由）
  → SSE 流过 DSML 恢复缓冲：模型把工具调用写进文本时，
    满足四道闸（闭合、已声明、有工具、无缺参）的块恢复成真正的
    delta.tool_calls；被拒的块原样展示，从不猜测
  → 错误分类：排队（6020-6022，报位次并禁止重试）、积分耗尽（14018）、
    模型负载（14003，可重试）、会话失效（12153）、账号受限（11140 + 措辞）、
    渠道指纹（11128）、上下文超长（11115 → pi 可识别的溢出标记）

模型目录：/v3/config（App 通道 UA；国内版失败时降级 /v2 旧文档）
积分查询：/v2/billing/meter/get-user-resource（企业席位走企业表）
```

## 实现说明

- **双区域并行**：`workbuddy` / `workbuddy-global` 各自持有凭据 store、目录与流实现，互不干扰。国际版两个品牌域名（`workbuddy.ai` / `codebuddy.ai`）的凭据互不通用，按凭据自己的 `domain` 路由。
- **思考档位**：只映射上游为该模型声明过的档位；`off` 只在 `canDisableThinking: true` 且不在实测拒绝名单（9 个模型对 `reasoning_effort: "off"` 回 400）时提供。
- **图片输入**：按厂商文档核验表判定（平台侧 `supportsImages` 在真实数据上对纯文本模型也是 true，不参与判定），未核实的模型不声明 image 输入。
- **上下文超长**：上游 11115 的错误信息是中文，pi 的溢出检测读英文；错误消息前置 `prompt is too long (upstream code 11115)`，让 pi 的压缩自救能跑起来。

## 致谢

上游协议（端点、线格式、错误码、渠道闸、DSML 恢复的四道闸纪律）与大量实测结论来自 [dingminhua/dsh-connect-workbuddy](https://github.com/dingminhua/dsh-connect-workbuddy)（MIT），该项目致谢 corrinehu/dsh-workbuddy-connect、Sliverkiss/workbuddy2api 与 hawklithm/workbuddy2api（均 MIT）。

## License

MIT
