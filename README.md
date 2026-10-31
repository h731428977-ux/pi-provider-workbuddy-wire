# pi-provider-workbuddy-wire

<p align="center">
  <b>把 WorkBuddy（CodeBuddy）接入 Pi，并按桌面客户端的请求身份、会话 ID、gzip 和接口路由发送模型请求。</b>
</p>

---

## 这是什么

本包基于 [lorlike/pi-provider-workbuddy](https://github.com/lorlike/pi-provider-workbuddy)，保留其 Pi Provider、OAuth、模型目录、积分与签到能力；请求层参考 [magpie-community/plugins](https://github.com/magpie-community/plugins/tree/main/packages/workbuddy) 的 WorkBuddy 桌面客户端行为重做。

重点不是“能返回 200”，而是让请求满足 WorkBuddy 后台识别所需的条件：

- 请求来自哪个客户端
- 哪一轮用户发送
- 一次工具循环应该算一次请求还是多次
- 哪些模型应走 Chat Completions，哪些应走 Anthropic Messages

> 上述行为已通过模拟请求、适配器测试和真实账号端到端验证；后台“使用端”和请求计数均已确认正常。

## 功能

- **桌面客户端请求身份**：发送 `X-IDE-Type`、`X-IDE-Name`、`X-IDE-Version`、`X-Agent-Purpose`、`X-Agent-Intent`、`X-Agent-Type`、`X-Agent-Runtime` 与 OpenAI SDK 风格请求头。
- **稳定会话身份**：`X-Conversation-ID` 绑定 Pi 会话；`X-Conversation-Request-ID` 绑定一次用户发送，工具调用和重试保持同一个 ID；每次 HTTP 请求使用新的 `X-Conversation-Message-ID` 和 `X-Request-ID`。
- **Chat gzip**：普通 Chat Completions 请求使用 gzip；Claude Messages 和图片请求不压缩。
- **Claude 原生路由**：国内版 `claude-*` 模型走 `/v1/messages`，其他模型走 `/v2/chat/completions`。
- **双区域并行接入**：`workbuddy`（国内版，`copilot.tencent.com`）与 `workbuddy-global`（国际版，`workbuddy.ai`）同时注册，各自持有凭据、目录与模型，互不干扰。哪个区域有账号，哪个区域的模型就出现在 pi 的模型选择器里。
- **登录即用**：`/login` 一条命令完成扫码（国内版）或网页登录（国际版），无需手动配置 API key。
- **自动发现桌面端登录**：已安装 WorkBuddy 桌面 App 的机器上，插件自动读取它的登录状态（**始终只读**，永远不会改动桌面端的凭据）。Windows 新版桌面端加密的凭据字段，通过调用已安装 App 自身的解密能力读取；App 未安装时如实报告，不会谎报「未登录」。
- **模型名内嵌积分倍率**：模型显示为 `GLM-5.3 · x0.79` 这样的形式，倍率完全来自上游目录，插件不写死也不猜。
- **只读积分查询**：`/workbuddy.status` 查看两个区域的登录状态、token 有效期、积分余额，以及国内版**今天有没有签到**，不花积分。
- **每日签到**：`/workbuddy.sign` 领取国内版（WorkBuddy CN）的每日签到积分。先查活动状态，活动进行中且今天未领才领取——重复执行不会重复领，也不会把「今天已签」报成失败。
- **工具调用恢复**：上游偶尔把工具调用写进正文文本而不是结构化字段，插件按严格的四道闸（已闭合、名字已声明、请求有工具、无缺参）把它恢复成真正的工具调用；不满足条件的原样展示，从不猜测。
- **错误说得清楚**：排队时告诉你排在第几位；积分耗尽、模型负载高、登录失效各有各的提示，不把「模型忙」说成「余额不足」。

> **⚠️ 风险提示**：WorkBuddy 已开始限制非官方客户端请求，上游一旦收紧，本插件可能随时失效。每一次调用都消耗**你自己账号**的积分，按上游给出的倍率真实扣费——插件不提供账号、不共享凭据、不绕过计费。使用官方 WorkBuddy 客户端始终是最安全的选择，请自行评估账号风险后再安装。

## 安装

**npm（发布后推荐）**

```bash
pi install npm:pi-provider-workbuddy-wire
```

**Git 仓库**

仓库已公开，另一台电脑不需要 GitHub 登录或仓库权限：

1. 安装 Pi 1.4+ 和 Node.js 22.19+。
2. 安装插件。

```powershell
pi install git:github.com/h731428977-ux/pi-provider-workbuddy-wire
pi list
```

安装完成后启动 `pi`，再执行 `/login workbuddy` 登录 WorkBuddy 账号。

**本地源码目录**

首次安装或修改源码后：

```powershell
npm install
npm run verify
pi install "D:/path/to/pi-provider-workbuddy-wire"
```

**离线安装包**

Pi 的本地安装需要展开后的目录。拿到 `pi-provider-workbuddy-wire-0.3.0.tgz` 后：

```powershell
New-Item -ItemType Directory -Force .\pi-provider-workbuddy-wire | Out-Null
tar -xzf .\pi-provider-workbuddy-wire-0.3.0.tgz -C .\pi-provider-workbuddy-wire
pi install ".\pi-provider-workbuddy-wire\package"
```

安装完成后重启 pi（或运行 `/reload`），然后运行 `pi list` 确认 `pi-provider-workbuddy-wire` 出现在列表里。

## 快速开始

### 1. 登录

两个 provider 都已注册，用 pi 的 `/login` 选择对应入口：

```text
/login workbuddy          # 国内版：弹出链接，浏览器打开后扫码
/login workbuddy-global   # 国际版：弹出链接，浏览器打开后网页登录
```

登录窗口会自动打开授权页；被浏览器拦截时复制链接手动打开即可。完成后插件自动拿到凭据并刷新模型目录。

> 也可以什么都不做：如果本机已登录 WorkBuddy 桌面 App，插件启动时会自动发现该账号。

### 2. 选模型

`/model` 里找 `WorkBuddy (CN)` 或 `WorkBuddy AI (Global)` 分组，模型名后面的 `· x0.79` 就是积分倍率。

没有账号的区域不会列出可发起请求的模型——列出来也只会点到就失败。登录对应区域后模型自动出现。

### 3. 日常命令

| 命令 | 说明 |
| --- | --- |
| `/workbuddy.sign` | 国内版每日签到（领今日积分）；已签到 / 活动未开启会如实说明 |
| `/workbuddy.status` | 登录状态、凭据来源、token 有效期、积分余额，以及今日签到状态（只读） |
| `/workbuddy.refresh` | 从上游刷新模型目录并重载 |
| `/workbuddy.logout [cn\|global]` | 清除插件自己存的凭据（不影响桌面端登录）；不带参数默认清两个区域 |

### 签到（目前只有国内版）

```text
/workbuddy.sign      # 领取今天的签到积分
/workbuddy.status    # 看今天签到了没有
```

行为说明：

- **先问状态再领**：`/workbuddy.sign` 先查活动状态（`checkin-activity-status`，旧端点 `checkin-status` 作后备），活动进行中且今天未领才调 `daily-checkin`。所以它**幂等**，一天跑几次都只有第一次真正领取。
- **按北京时间算一天**：签到日以 UTC+8 划分（固定偏移，不依赖系统时区数据库）。
- **如实报告**：上游会区分「已签到（code 1001）」「账号不能参与（1002）」「活动已结束（1003）」，插件照原样转述，不把拒绝说成网络失败。
- **本地只记结论**：结果写在 `~/.pi/agent/workbuddy/workbuddy-checkin.json`，只存「哪天 / 结论 / 积分 / 连签天数」，**不存昵称也不存 token**。上游查不到状态时，`/workbuddy.status` 只会显示**当天**的本地记录，并明确标注是本地记录——没看到的一天绝不会被说成「已签到」。
- **国际版没有这个活动**：上游国际版出厂即关闭签到，`/workbuddy.sign global` 会直接说明，不浪费一次请求。

## 常见问题

**Q：启动时报「No API key found for workbuddy」？**

还没有登录。运行 `/login workbuddy`（国内版）或 `/login workbuddy-global`（国际版）。这是 pi 对未认证 provider 的标准提示，不代表插件没装好。

**Q：桌面端明明登录了，插件却说未登录？**

运行 `/workbuddy.status`，未登录区域会列出探测过的每一条路径和跳过原因（不存在 / 读不了 / 字段已加密拿不到密钥 / 属于另一个地区）。常见情况：

- **字段已加密且拿不到密钥** → 需要已安装的 WorkBuddy 桌面 App 在场（插件通过它自身的解密能力读凭据），确认 App 已安装且版本较新；
- **属于另一个地区** → 登录信息是真实可用的，只是挂在另一个区域下，用对应的 `/login` 入口即可。

**Q：国际版报错「该账号属于国内版」或反过来？**

两个区域的凭据互不通用（国际版还有 `workbuddy.ai` 与 `codebuddy.ai` 两个品牌域名的区分），请用对应区域的 `/login` 入口重新登录。

**Q：模型请求返回渠道校验错误（code 11128）？**

这是上游网关对请求内容的指纹校验，与账号、积分、网络都无关，换账号也不会改变结果。插件已对已知的第三方 agent 提示词做归一化处理；如果仍被拦截，请到本项目的 Issue 区反馈。

**Q：插件会把我的凭据传到哪里？**

凭据只在本机流转：桌面端文件只读，刷新得到的 token 写在 `~/.pi/agent/workbuddy/` 下，请求只发往 WorkBuddy 自己的网关。插件没有任何遥测，也不经过任何第三方服务器。

## 工作原理

```text
Pi ExtensionAPI
  → workbuddy-chat（普通模型）
      · OpenAI Chat Completions 适配器
      · /v2/chat/completions + gzip
  → workbuddy-anthropic（国内版 Claude）
      · Pi Anthropic Messages 适配器
      · /v1/messages，不压缩
  → WorkBuddy Wire 层：
      · 桌面客户端 UA / X-IDE-* / X-Agent-* / X-Stainless-*
      · Pi sessionId → 稳定 X-Conversation-ID
      · 最后一条真实用户消息 → 稳定 X-Conversation-Request-ID
      · 每次请求新生成 Message ID，并令 X-Request-ID 与它一致
      · prepareChatBody：强制 stream:true、tool_choice 压平、
        developer→system、保证 system 头、已测得的渠道指纹前置中性头
  → 国内版 https://copilot.tencent.com
    国际版 https://www.workbuddy.ai（或 codebuddy.ai，按凭据域路由）
  → Chat SSE 流过 DSML 恢复缓冲
  → 错误分类：排队（6020-6022，报位次并禁止无意义重试）、积分耗尽（14018）、
    模型负载（14003，可自动重试）、会话失效（12153）、账号受限（11140 + 措辞）、
    渠道指纹（11128）、上下文超长（11115 → pi 可识别的溢出标记，触发压缩自救）

模型目录：/v3/config（桌面客户端身份；国内版失败时降级 /v2 旧文档）
积分查询：/v2/billing/meter/get-user-resource（企业席位走企业表）
每日签到：/v2/billing/meter/checkin-activity-status → /v2/billing/meter/daily-checkin（国内版）
```

更多实现细节：

- **思考档位**：只映射上游为该模型声明过的档位；`off` 档位只在模型声明可关闭思考、且不在实测拒绝名单（9 个模型对 `reasoning_effort: "off"` 回 400，勾上等于每次压缩摘要都失败）时提供。
- **图片输入**：按厂商文档核验表判定，而不是上游平台侧的 `supportsImages` 声明（真实数据里它对纯文本模型也是 `true`）；未核实的模型不声明 image 输入。
- **上下文超长**：上游 11115 的错误信息是中文而 pi 的溢出检测读英文，错误消息前置 `prompt is too long (upstream code 11115)`，让 pi 的压缩自救能触发。

## Wire Profile 维护

当前默认跟随 WorkBuddy `5.9.3`、CLI `2.165.0`。客户端升级但插件尚未发版时，可以临时覆盖：

```powershell
$env:WORKBUDDY_APP_VERSION = "5.9.4"
$env:WORKBUDDY_CLI_VERSION = "2.166.0"
```

固定版本配置位于 `src/wire-profile.ts`。升级时应同步验证：

1. 后台“使用端”是否显示正常客户端名称。
2. 一次用户发送经过多轮工具调用时，后台是否只统计为一次请求。
3. Chat 请求仍接受 gzip。
4. 国内版 Claude 仍可用 `/v1/messages`。

## 从源码构建

```bash
npm install
npm run verify      # 类型检查 + 测试 + 构建 + 发布包校验
```

发布流程见 [RELEASING.md](RELEASING.md)，版本记录见 [CHANGELOG.md](CHANGELOG.md)。

## 致谢

- [lorlike/pi-provider-workbuddy](https://github.com/lorlike/pi-provider-workbuddy)：Pi Provider、OAuth、模型目录、积分、签到与 DSML 恢复基础。
- [magpie-community/plugins](https://github.com/magpie-community/plugins/tree/main/packages/workbuddy)：桌面客户端请求头、稳定会话 ID、gzip 与 Claude Messages 路由的协议参考。
- [dingminhua/dsh-connect-workbuddy](https://github.com/dingminhua/dsh-connect-workbuddy)：上游端点、错误码、渠道闸与大量实测记录。

以上项目均采用 MIT 许可。原项目的版权与许可声明继续保留。

## 免责声明

本项目与腾讯 / WorkBuddy / CodeBuddy 官方没有任何关联，也不是官方客户端。使用本插件产生的一切账号后果（限流、限制、封禁等）由使用者自行承担。

## License

[MIT](LICENSE)
