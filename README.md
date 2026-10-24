# pi-provider-workbuddy

<p align="center">
  <b>把本机登录的 WorkBuddy（CodeBuddy）模型接入 pi —— 国内版与国际版两个 provider 并行注册，OAuth 扫码登录，模型目录带真实积分倍率，只读积分查询。</b>
</p>

---

## 功能

- **双区域并行接入**：`workbuddy`（国内版，`copilot.tencent.com`）与 `workbuddy-global`（国际版，`workbuddy.ai`）同时注册，各自持有凭据、目录与模型，互不干扰。哪个区域有账号，哪个区域的模型就出现在 pi 的模型选择器里。
- **登录即用**：`/login` 一条命令完成扫码（国内版）或网页登录（国际版），无需手动配置 API key。
- **自动发现桌面端登录**：已安装 WorkBuddy 桌面 App 的机器上，插件自动读取它的登录状态（**始终只读**，永远不会改动桌面端的凭据）。Windows 新版桌面端加密的凭据字段，通过调用已安装 App 自身的解密能力读取；App 未安装时如实报告，不会谎报「未登录」。
- **模型名内嵌积分倍率**：模型显示为 `GLM-5.3 · x0.79` 这样的形式，倍率完全来自上游目录，插件不写死也不猜。
- **只读积分查询**：`/workbuddy.status` 查看两个区域的登录状态、token 有效期与积分余额，不花积分。
- **工具调用恢复**：上游偶尔把工具调用写进正文文本而不是结构化字段，插件按严格的四道闸（已闭合、名字已声明、请求有工具、无缺参）把它恢复成真正的工具调用；不满足条件的原样展示，从不猜测。
- **错误说得清楚**：排队时告诉你排在第几位；积分耗尽、模型负载高、登录失效各有各的提示，不把「模型忙」说成「余额不足」。

> **⚠️ 风险提示**：WorkBuddy 已开始限制非官方客户端请求，上游一旦收紧，本插件可能随时失效。每一次调用都消耗**你自己账号**的积分，按上游给出的倍率真实扣费——插件不提供账号、不共享凭据、不绕过计费。使用官方 WorkBuddy 客户端始终是最安全的选择，请自行评估账号风险后再安装。

## 安装

**方式一：从 npm 安装（推荐）**

```bash
pi install npm:pi-provider-workbuddy
```

**方式二：从 GitHub 安装**

```bash
pi install git:github.com/lorlike/pi-provider-workbuddy
```

安装完成后重启 pi（或运行 `/reload`），然后运行 `pi list` 确认 `pi-provider-workbuddy` 出现在列表里。

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
| `/workbuddy.status` | 登录状态、凭据来源、token 有效期与积分余额（只读） |
| `/workbuddy.refresh` | 从上游刷新模型目录并重载 |
| `/workbuddy.logout [cn\|global]` | 清除插件自己存的凭据（不影响桌面端登录）；不带参数默认清两个区域 |

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

这是上游网关对请求内容的指纹校验，与账号、积分、网络都无关，换账号也不会改变结果。插件已对已知的第三方 agent 提示词做归一化处理；如果仍被拦截，请到 [Issues](https://github.com/lorlike/pi-provider-workbuddy/issues) 反馈。

**Q：插件会把我的凭据传到哪里？**

凭据只在本机流转：桌面端文件只读，刷新得到的 token 写在 `~/.pi/agent/workbuddy/` 下，请求只发往 WorkBuddy 自己的网关。插件没有任何遥测，也不经过任何第三方服务器。

## 工作原理

```text
pi（openai-completions 内建实现）
  → 自定义 fetch 覆盖层：
      · prepareChatBody：强制 stream:true、tool_choice 压平、
        developer→system、保证 system 头、已测得的渠道指纹前置中性头
      · WorkBuddy 头：Bearer token、会话身份三件套（每请求现生成）、
        CLI UA、X-User-Id / X-Enterprise-Id / X-Domain
  → 国内版 https://copilot.tencent.com/v2/chat/completions
    国际版 https://www.workbuddy.ai（或 codebuddy.ai，按凭据域路由）
  → SSE 流过 DSML 恢复缓冲（见「功能」第 6 条）
  → 错误分类：排队（6020-6022，报位次并禁止无意义重试）、积分耗尽（14018）、
    模型负载（14003，可自动重试）、会话失效（12153）、账号受限（11140 + 措辞）、
    渠道指纹（11128）、上下文超长（11115 → pi 可识别的溢出标记，触发压缩自救）

模型目录：/v3/config（App 通道 UA；国内版失败时降级 /v2 旧文档）
积分查询：/v2/billing/meter/get-user-resource（企业席位走企业表）
```

更多实现细节：

- **思考档位**：只映射上游为该模型声明过的档位；`off` 档位只在模型声明可关闭思考、且不在实测拒绝名单（9 个模型对 `reasoning_effort: "off"` 回 400，勾上等于每次压缩摘要都失败）时提供。
- **图片输入**：按厂商文档核验表判定，而不是上游平台侧的 `supportsImages` 声明（真实数据里它对纯文本模型也是 `true`）；未核实的模型不声明 image 输入。
- **上下文超长**：上游 11115 的错误信息是中文而 pi 的溢出检测读英文，错误消息前置 `prompt is too long (upstream code 11115)`，让 pi 的压缩自救能触发。

## 从源码构建

```bash
git clone https://github.com/lorlike/pi-provider-workbuddy.git
cd pi-provider-workbuddy
npm install
npm run typecheck   # 类型检查
npm run build       # 构建到 dist/
```

## 致谢

上游协议（端点、线格式、错误码、渠道闸、DSML 恢复的四道闸纪律）与大量实测结论来自 [dingminhua/dsh-connect-workbuddy](https://github.com/dingminhua/dsh-connect-workbuddy)（MIT），该项目致谢 corrinehu/dsh-workbuddy-connect、Sliverkiss/workbuddy2api 与 hawklithm/workbuddy2api（均 MIT）。感谢这些项目的作者把测量记录写得如此完整。

## 免责声明

本项目与腾讯 / WorkBuddy / CodeBuddy 官方没有任何关联，也不是官方客户端。使用本插件产生的一切账号后果（限流、限制、封禁等）由使用者自行承担。

## License

[MIT](LICENSE)
