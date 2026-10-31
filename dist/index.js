var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/catalog.ts
var catalog_exports = {};
__export(catalog_exports, {
  REFUSES_OFF_MODEL_IDS: () => REFUSES_OFF_MODEL_IDS,
  fallbackModelsFor: () => fallbackModelsFor,
  nativeImageInput: () => nativeImageInput
});
function fallbackModelsFor(region) {
  return region === "global" ? FALLBACK_GLOBAL : FALLBACK_CN;
}
function nativeImageInput(modelId) {
  if (NATIVE_MULTIMODAL.has(modelId)) return true;
  if (NATIVE_TEXT.has(modelId)) return false;
  return void 0;
}
var FALLBACK_CN, FALLBACK_GLOBAL, NATIVE_MULTIMODAL, NATIVE_TEXT, REFUSES_OFF_MODEL_IDS;
var init_catalog = __esm({
  "src/catalog.ts"() {
    "use strict";
    FALLBACK_CN = [
      { id: "hy3", name: "Hy3", contextWindow: 192e3, maxTokens: 64e3 },
      { id: "glm-5v-turbo", name: "GLM-5v-Turbo", contextWindow: 2e5, maxTokens: 64e3 },
      { id: "glm-5.3", name: "GLM-5.3", contextWindow: 1e6, maxTokens: 48e3 },
      { id: "glm-5.2", name: "GLM-5.2", contextWindow: 1e6, maxTokens: 48e3 },
      { id: "glm-5.1", name: "GLM-5.1", contextWindow: 2e5, maxTokens: 48e3 },
      { id: "minimax-m3", name: "MiniMax-M3", contextWindow: 512e3, maxTokens: 128e3 },
      { id: "kimi-k3-1", name: "Kimi-K3", contextWindow: 1e6, maxTokens: 32e3 },
      { id: "kimi-k2.7", name: "Kimi-K2.7-Code", contextWindow: 256e3, maxTokens: 32e3 },
      { id: "kimi-k2.6", name: "Kimi-K2.6", contextWindow: 256e3, maxTokens: 32e3 },
      { id: "deepseek-v4-flash", name: "Deepseek-V4-Flash", contextWindow: 1e6, maxTokens: 5e4 },
      { id: "deepseek-v4-pro", name: "Deepseek-V4-Pro", contextWindow: 1e6, maxTokens: 5e4 }
    ];
    FALLBACK_GLOBAL = [
      { id: "fast-model", name: "Fast", contextWindow: 2e5, maxTokens: 32e3, creditMultiplier: 0.34 },
      { id: "balanced-model", name: "Balanced", contextWindow: 256e3, maxTokens: 32e3, creditMultiplier: 0.59 },
      { id: "primary-model", name: "Primary", contextWindow: 272e3, maxTokens: 72e3, creditMultiplier: 3.31 },
      { id: "deep-model", name: "Deep", contextWindow: 176e3, maxTokens: 24e3, creditMultiplier: 3.33 },
      { id: "deepseek-v4.1-flash", name: "Deepseek-V4.1-Flash", contextWindow: 1e6, maxTokens: 128e3, creditMultiplier: 0 },
      { id: "gpt-6-astra", name: "GPT-6-Astra", contextWindow: 1e6, maxTokens: 128e3, creditMultiplier: 6.67 },
      { id: "hy4-preview", name: "Hy4 preview", contextWindow: 1e6, maxTokens: 64e3, creditMultiplier: 0 },
      { id: "hy3", name: "Hy3", contextWindow: 192e3, maxTokens: 64e3, creditMultiplier: 0 },
      { id: "gpt-5.6-sol", name: "GPT-5.6-Sol", contextWindow: 1e6, maxTokens: 128e3, creditMultiplier: 3.47 },
      { id: "gpt-5.6-terra", name: "GPT-5.6-Terra", contextWindow: 1e6, maxTokens: 128e3, creditMultiplier: 1.39 },
      { id: "gpt-5.6-luna", name: "GPT-5.6-Luna", contextWindow: 1e6, maxTokens: 128e3, creditMultiplier: 0.14 },
      { id: "gpt-5.5", name: "GPT-5.5", contextWindow: 1e6, maxTokens: 128e3, creditMultiplier: 3.31 },
      { id: "gpt-5.4", name: "GPT-5.4", contextWindow: 272e3, maxTokens: 72e3, creditMultiplier: 1.65 },
      { id: "gpt-5.3-codex", name: "GPT-5.3-Codex", contextWindow: 272e3, maxTokens: 72e3, creditMultiplier: 1.25 },
      { id: "gemini-3.5-flash", name: "Gemini-3.5-Flash", contextWindow: 1e6, maxTokens: 65536, creditMultiplier: 0.99 },
      { id: "glm-5.3", name: "GLM-5.3", contextWindow: 1e6, maxTokens: 48e3, creditMultiplier: 0.79 },
      { id: "glm-5.2", name: "GLM-5.2", contextWindow: 1e6, maxTokens: 48e3, creditMultiplier: 0.79 },
      { id: "kimi-k3", name: "Kimi-K3", contextWindow: 1e6, maxTokens: 32e3, creditMultiplier: 1.62 },
      { id: "kimi-k2.6", name: "Kimi-K2.6", contextWindow: 256e3, maxTokens: 32e3, creditMultiplier: 0.52 }
    ];
    NATIVE_MULTIMODAL = /* @__PURE__ */ new Set([
      "deepseek-v4.1-flash",
      "glm-5.3-flash",
      "glm-5v-turbo",
      "kimi-k2.6",
      "kimi-k2.7",
      "kimi-k3-1",
      "minimax-m3"
    ]);
    NATIVE_TEXT = /* @__PURE__ */ new Set([
      "deepseek-v4-pro",
      "glm-5.1",
      "glm-5.2",
      "glm-5.3",
      "hy3",
      "hy4-preview"
    ]);
    REFUSES_OFF_MODEL_IDS = /* @__PURE__ */ new Set([
      "deepseek-v4.1-flash",
      "deepseek-v4.1-flash-sg",
      "deepseek-v4-pro",
      "primary-model",
      "gpt-6-astra",
      "gpt-5.6-sol",
      "gpt-5.6-terra",
      "gpt-5.6-luna",
      "gemini-3.5-flash"
    ]);
  }
});

// src/upstream.ts
function regionOf(domain) {
  const lowered = domain.trim().toLowerCase();
  if (lowered === "workbuddy.ai" || lowered.endsWith(".workbuddy.ai")) return "global";
  if (lowered === "codebuddy.ai" || lowered.endsWith(".codebuddy.ai")) return "global";
  return "cn";
}
function globalBase(domain) {
  const lowered = domain.trim().toLowerCase();
  if (lowered === "codebuddy.ai" || lowered.endsWith(".codebuddy.ai")) return GLOBAL_CODEBUDDY_BASE;
  return GLOBAL_BASE;
}
function chatBase(credential) {
  return regionOf(credential.domain) === "global" ? globalBase(credential.domain) : CN_CHAT_BASE;
}
var CN_CHAT_BASE, CN_BILLING_BASE, GLOBAL_BASE, GLOBAL_CODEBUDDY_BASE, MODELS_CATALOG_PATH, GLOBAL_CONFIG_PATH, CHAT_PATH, REFRESH_PATH, CHECKIN_STATUS_PATHS, DAILY_CHECKIN_PATH, CLIENT_UA, JSON_TIMEOUT_MS, ERROR_BODY_LIMIT;
var init_upstream = __esm({
  "src/upstream.ts"() {
    "use strict";
    CN_CHAT_BASE = "https://copilot.tencent.com";
    CN_BILLING_BASE = "https://www.codebuddy.cn";
    GLOBAL_BASE = "https://www.workbuddy.ai";
    GLOBAL_CODEBUDDY_BASE = "https://www.codebuddy.ai";
    MODELS_CATALOG_PATH = "/v2/enterprises/personal/models";
    GLOBAL_CONFIG_PATH = "/v3/config";
    CHAT_PATH = "/v2/chat/completions";
    REFRESH_PATH = "/v2/plugin/auth/token/refresh";
    CHECKIN_STATUS_PATHS = [
      "/v2/billing/meter/checkin-activity-status",
      "/v2/billing/meter/checkin-status"
    ];
    DAILY_CHECKIN_PATH = "/v2/billing/meter/daily-checkin";
    CLIENT_UA = "WorkBuddy/5.9.3 WorkBuddy/5.9.3 CLI/2.165.0";
    JSON_TIMEOUT_MS = 3e4;
    ERROR_BODY_LIMIT = 4096;
  }
});

// src/auth.ts
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
function defaultDesktopAuthDirs(platform = process.platform, home = homedir(), env = process.env) {
  if (platform === "darwin") {
    return [join(home, "Library", "Application Support", "CodeBuddyExtension", "Data", "Public", "auth")];
  }
  if (platform === "win32") {
    const local = nonEmpty(env["LOCALAPPDATA"]) ?? join(home, "AppData", "Local");
    const roaming = nonEmpty(env["APPDATA"]) ?? join(home, "AppData", "Roaming");
    return [
      join(local, "CodeBuddyExtension", "Data", "Public", "auth"),
      join(roaming, "CodeBuddyExtension", "Data", "Public", "auth")
    ];
  }
  if (platform === "linux") {
    const config = nonEmpty(env["XDG_CONFIG_HOME"]) ?? join(home, ".config");
    return [join(config, "CodeBuddyExtension", "Data", "Public", "auth")];
  }
  return [];
}
function defaultDesktopAuthCandidates() {
  return defaultDesktopAuthDirs().map((dir) => join(dir, WORKBUDDY_LIVE_FILENAME));
}
function expiryToMs(value) {
  if (value <= 0) return 0;
  return value > 1e12 ? value : value * 1e3;
}
function nonEmpty(value) {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : void 0;
}
function workbuddyAccountId(credential) {
  const basis = credential.uin !== void 0 && credential.uin !== "" ? credential.uin : credential.uid;
  return createHash("sha256").update(basis).digest("hex").slice(0, 16);
}
function parseWorkBuddyAuth(text, source, filePath, openField) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return void 0;
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return void 0;
  const document = parsed;
  let auth;
  let identity;
  if (typeof document["auth"] === "object" && document["auth"] !== null) {
    auth = document["auth"];
    identity = typeof document["account"] === "object" && document["account"] !== null ? document["account"] : {};
  } else {
    auth = document;
    identity = document;
  }
  const accessToken = openField !== void 0 ? openField(auth["accessToken"]) : asString(auth["accessToken"]);
  const refreshToken = openField !== void 0 ? openField(auth["refreshToken"]) : asString(auth["refreshToken"]);
  if (accessToken === void 0 || accessToken === "") return void 0;
  const expiresAtMs = typeof auth["expiresAt"] === "number" ? expiryToMs(auth["expiresAt"]) : 0;
  return {
    accessToken,
    refreshToken: refreshToken ?? "",
    expiresAtMs,
    domain: (openField !== void 0 ? openField(auth["domain"]) : asString(auth["domain"])) ?? "",
    uid: (openField !== void 0 ? openField(identity["uid"]) : asString(identity["uid"])) ?? "",
    ...optionalField("enterpriseId", openField !== void 0 ? openField(identity["enterpriseId"]) : asString(identity["enterpriseId"])),
    ...optionalField("nickname", openField !== void 0 ? openField(identity["nickname"]) : asString(identity["nickname"])),
    ...optionalField("displayName", openField !== void 0 ? openField(identity["displayName"]) : asString(identity["displayName"])),
    ...optionalField("uin", openField !== void 0 ? openField(identity["uin"]) : asString(identity["uin"])),
    source,
    filePath
  };
}
function asString(value) {
  if (typeof value !== "string" || value === "") return void 0;
  return value;
}
function optionalField(key, value) {
  return value === void 0 ? {} : { [key]: value };
}
function desktopAuthCandidates(env = process.env) {
  const fromEnv = nonEmpty(env[WORKBUDDY_AUTH_FILE_ENV]);
  if (fromEnv !== void 0) return [fromEnv];
  return defaultDesktopAuthCandidates();
}
function readDesktopCredential(region, openField, env = process.env) {
  const candidates = desktopAuthCandidates(env);
  const skipped = [];
  for (const filePath of candidates) {
    if (!existsSync(filePath)) {
      skipped.push({ path: filePath, reason: "\u4E0D\u5B58\u5728" });
      continue;
    }
    let text;
    try {
      text = readFileSync(filePath, "utf8");
    } catch (error) {
      skipped.push({ path: filePath, reason: `\u8BFB\u4E0D\u4E86: ${String(error)}` });
      continue;
    }
    const credential = parseWorkBuddyAuth(text, "desktop", filePath, openField);
    if (credential === void 0) {
      const encrypted = text.includes("$wbEncrypted");
      skipped.push({
        path: filePath,
        reason: encrypted && openField === void 0 ? "\u5B57\u6BB5\u5DF2\u52A0\u5BC6\u4E14\u62FF\u4E0D\u5230\u5BC6\u94A5\uFF08\u9700\u8981\u5DF2\u5B89\u88C5\u7684 WorkBuddy \u684C\u9762\u7AEF\uFF09" : "\u6CA1\u6709\u53EF\u7528 token"
      });
      continue;
    }
    const credentialRegion = regionOf(credential.domain);
    if (credentialRegion !== region) {
      skipped.push({ path: filePath, reason: `\u5C5E\u4E8E\u53E6\u4E00\u4E2A\u5730\u533A\uFF08${credentialRegion === "global" ? "\u56FD\u9645\u7248" : "\u56FD\u5185\u7248"}\uFF09` });
      continue;
    }
    return { credential, candidates: skipped };
  }
  return { candidates: skipped };
}
function pluginDataDir() {
  const override = nonEmpty(process.env["WORKBUDDY_PLUGIN_DATA_DIR"]);
  if (override !== void 0) return override;
  const piDir = nonEmpty(process.env["PI_CODING_AGENT_DIR"]) ?? join(homedir(), ".pi", "agent");
  return join(piDir, "workbuddy");
}
function ownAuthPath(region) {
  const override = nonEmpty(process.env[WORKBUDDY_PLUGIN_AUTH_ENV]);
  if (override !== void 0) return override;
  return join(pluginDataDir(), `auth.${region}.json`);
}
function vaultDir(region) {
  return join(pluginDataDir(), "workbuddy-vault", region);
}
function serializeCredential(credential, accountKey) {
  return JSON.stringify({
    format: 1,
    accountId: accountKey,
    auth: {
      accessToken: credential.accessToken,
      refreshToken: credential.refreshToken,
      expiresAt: credential.expiresAtMs,
      domain: credential.domain
    },
    account: {
      uid: credential.uid,
      ...optionalField("enterpriseId", credential.enterpriseId),
      ...optionalField("nickname", credential.nickname),
      ...optionalField("displayName", credential.displayName),
      ...optionalField("uin", credential.uin)
    }
  }, null, 2);
}
function saveOwnCredential(region, credential) {
  const filePath = ownAuthPath(region);
  try {
    mkdirSync(join(filePath, ".."), { recursive: true });
  } catch {
  }
  const tmp = `${filePath}.tmp`;
  writeFileSync(tmp, serializeCredential(credential, workbuddyAccountId(credential)), "utf8");
  try {
    renameSync(tmp, filePath);
  } catch {
    writeFileSync(filePath, serializeCredential(credential, workbuddyAccountId(credential)), "utf8");
  }
}
function readOwnCredential(region) {
  const filePath = ownAuthPath(region);
  if (!existsSync(filePath)) return void 0;
  try {
    return parseWorkBuddyAuth(readFileSync(filePath, "utf8"), "plugin", filePath);
  } catch {
    return void 0;
  }
}
function readVaultAccount(region, fileName) {
  const filePath = join(vaultDir(region), fileName);
  try {
    return parseWorkBuddyAuth(readFileSync(filePath, "utf8"), "oauth", filePath);
  } catch {
    return void 0;
  }
}
function readVaultAccounts(region) {
  const accounts = /* @__PURE__ */ new Map();
  const dir = vaultDir(region);
  if (!existsSync(dir)) return accounts;
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return accounts;
  }
  for (const fileName of entries) {
    if (!fileName.endsWith(".json")) continue;
    const credential = readVaultAccount(region, fileName);
    if (credential === void 0) continue;
    accounts.set(workbuddyAccountId(credential), credential);
  }
  return accounts;
}
function saveVaultAccount(region, credential) {
  const accountId = workbuddyAccountId(credential);
  mkdirSync(vaultDir(region), { recursive: true });
  writeFileSync(join(vaultDir(region), `${accountId}.json`), serializeCredential(credential, accountId), "utf8");
  return accountId;
}
var WORKBUDDY_LIVE_FILENAME, WORKBUDDY_AUTH_FILE_ENV, WORKBUDDY_PLUGIN_AUTH_ENV;
var init_auth = __esm({
  "src/auth.ts"() {
    "use strict";
    init_upstream();
    WORKBUDDY_LIVE_FILENAME = "workbuddy-desktop.info";
    WORKBUDDY_AUTH_FILE_ENV = "WORKBUDDY_AUTH_FILE";
    WORKBUDDY_PLUGIN_AUTH_ENV = "WORKBUDDY_PLUGIN_AUTH_FILE";
  }
});

// src/at-rest.ts
var at_rest_exports = {};
__export(at_rest_exports, {
  WORKBUDDY_APP_EXECUTABLE_ENV: () => WORKBUDDY_APP_EXECUTABLE_ENV,
  clearAtRestKeyCache: () => clearAtRestKeyCache,
  deriveAtRestKey: () => deriveAtRestKey,
  deriveAtRestKeyId: () => deriveAtRestKeyId,
  fetchAtRestKeyPayload: () => fetchAtRestKeyPayload,
  findWorkbuddyAppExecutable: () => findWorkbuddyAppExecutable,
  isEncryptedFieldWrapper: () => isEncryptedFieldWrapper,
  macosBundleExecutable: () => macosBundleExecutable,
  normalizeRegistryExecutable: () => normalizeRegistryExecutable,
  openEncryptedField: () => openEncryptedField,
  readAtRestKey: () => readAtRestKey,
  workbuddyAppExecutableCandidates: () => workbuddyAppExecutableCandidates
});
import { execFile } from "node:child_process";
import { createDecipheriv, createHash as createHash2 } from "node:crypto";
import { existsSync as existsSync2, readFileSync as readFileSync2 } from "node:fs";
import { homedir as homedir2 } from "node:os";
import { join as join2, win32 } from "node:path";
function encodeUint32(value) {
  const bytes = Buffer.allocUnsafe(4);
  bytes.writeUInt32BE(value);
  return bytes;
}
function encodeLengthPrefixed(value) {
  const bytes = Buffer.from(value, "utf8");
  return Buffer.concat([encodeUint32(bytes.length), bytes]);
}
function fieldAad(keyId, suite, scheme = SYMMETRIC_SCHEME) {
  if (!/^[0-9a-f]{16}$/u.test(keyId)) throw new Error("workbuddy: envelope keyId is malformed");
  return Buffer.concat([
    AAD_DOMAIN,
    Buffer.from([1]),
    encodeLengthPrefixed(STANDARD_FORMAT_ID["field"]),
    encodeLengthPrefixed(scheme),
    encodeUint32(suite),
    encodeLengthPrefixed(keyId),
    Buffer.from([FRAMING_CODE["field"]]),
    Buffer.from([0]),
    // no sequence in field framing
    Buffer.from([0])
    // final === undefined
  ]);
}
function isEncryptedFieldWrapper(value) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const wrapper = value;
  const keys = Object.keys(wrapper).sort();
  return keys.length === 2 && keys[0] === "$wbEncrypted" && keys[1] === "envelope" && wrapper["$wbEncrypted"] === 1 && typeof wrapper["envelope"] === "string";
}
function deriveAtRestKeyId(key) {
  return createHash2("sha256").update(key).digest("hex").slice(0, 16);
}
function deriveAtRestKey(payloadJson) {
  let payload;
  try {
    payload = JSON.parse(payloadJson);
  } catch {
    throw new Error("workbuddy: at-rest key payload is not valid JSON");
  }
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    throw new Error("workbuddy: at-rest key payload is not an object");
  }
  const secret = payload["atRestSecretKey"];
  if (typeof secret !== "string" || secret === "") {
    throw new Error("workbuddy: at-rest key payload carries no atRestSecretKey");
  }
  return createHash2("sha256").update(secret, "utf8").digest();
}
function openEncryptedField(field, key) {
  let envelope;
  try {
    envelope = JSON.parse(Buffer.from(field.envelope, "base64").toString("utf8"));
  } catch {
    throw new Error("workbuddy: encrypted field envelope is not valid JSON");
  }
  if (typeof envelope !== "object" || envelope === null || Array.isArray(envelope)) {
    throw new Error("workbuddy: encrypted field envelope is not an object");
  }
  const record = envelope;
  const suite = record["suite"];
  const keyId = record["keyId"];
  const nonce = record["nonce"];
  const authTag = record["authTag"];
  const ciphertext = record["ciphertext"];
  if (typeof suite !== "number" || typeof keyId !== "string") {
    throw new Error("workbuddy: encrypted field envelope is missing suite or keyId");
  }
  if (typeof nonce !== "string" || typeof authTag !== "string" || typeof ciphertext !== "string") {
    throw new Error("workbuddy: encrypted field envelope is missing nonce, authTag or ciphertext");
  }
  const expectedKeyId = deriveAtRestKeyId(key);
  if (keyId !== expectedKeyId) {
    throw new Error(`workbuddy: encrypted field belongs to key ${keyId}, not the available key ${expectedKeyId}`);
  }
  const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(nonce, "base64"), { authTagLength: 16 });
  decipher.setAAD(fieldAad(keyId, suite));
  decipher.setAuthTag(Buffer.from(authTag, "base64"));
  return Buffer.concat([
    decipher.update(Buffer.from(ciphertext, "base64")),
    decipher.final()
  ]).toString("utf8");
}
function macosBundleExecutable(bundle) {
  let plist;
  try {
    plist = readFileSync2(join2(bundle, "Contents", "Info.plist"), "utf8");
  } catch {
    return void 0;
  }
  const match = /<key>CFBundleExecutable<\/key>\s*<string>([^<]+)<\/string>/u.exec(plist);
  const name = match?.[1]?.trim();
  if (name === void 0 || name === "") return void 0;
  const executable = join2(bundle, "Contents", "MacOS", name);
  return existsSync2(executable) ? executable : void 0;
}
function normalizeRegistryExecutable(value) {
  const unquoted = stripRegistryQuotes(value);
  if (unquoted === void 0 || unquoted === "") return void 0;
  const withoutIndex = unquoted.replace(/,\s*-?\d+\s*$/u, "");
  if (withoutIndex === "") return void 0;
  const base = win32.basename(withoutIndex).toLowerCase();
  if (!APP_EXECUTABLE_NAMES.some((name) => name.toLowerCase() === base)) return void 0;
  return withoutIndex;
}
function stripRegistryQuotes(value) {
  const trimmed = value.trim();
  if (trimmed === "") return void 0;
  if (!trimmed.startsWith('"')) return trimmed;
  const closing = trimmed.indexOf('"', 1);
  if (closing === -1) return void 0;
  return trimmed.slice(1, closing).trim();
}
function workbuddyAppExecutableCandidates(platform = process.platform, home = homedir2(), env = process.env, readBundleExecutable = macosBundleExecutable) {
  const candidates = [env[WORKBUDDY_APP_EXECUTABLE_ENV]?.trim()];
  if (platform === "win32") {
    const local = env["LOCALAPPDATA"]?.trim();
    const programFiles = env["ProgramFiles"]?.trim();
    const programFilesX86 = env["ProgramFiles(x86)"]?.trim();
    const bases = [local, programFiles, programFilesX86].filter((base) => base !== void 0 && base !== "");
    for (const base of bases) {
      for (const subdirectory of WINDOWS_APP_SUBDIRECTORIES) {
        for (const name of APP_EXECUTABLE_NAMES) {
          candidates.push(win32.join(base, ...subdirectory, name));
        }
      }
    }
  } else if (platform === "darwin") {
    for (const name of MACOS_APP_BUNDLE_NAMES) {
      candidates.push(
        readBundleExecutable(join2("/Applications", name)),
        readBundleExecutable(join2(home, "Applications", name))
      );
    }
  }
  return candidates.filter((candidate) => candidate !== void 0 && candidate !== "");
}
function findWorkbuddyAppExecutable(platform = process.platform, home = homedir2(), env = process.env) {
  for (const candidate of workbuddyAppExecutableCandidates(platform, home, env)) {
    if (existsSync2(candidate)) return candidate;
  }
  return void 0;
}
function fetchAtRestKeyPayload(executable) {
  return new Promise((resolve, reject) => {
    const source = "try{process.stdout.write(process._linkedBinding('electron_browser_workbuddy_storage').loggerGet())}catch(e){process.exitCode=3;process.stderr.write(String(e&&e.message||e))}";
    execFile(
      executable,
      ["-e", source],
      {
        env: { ...process.env, ELECTRON_RUN_AS_NODE: "1" },
        timeout: KEY_FETCH_TIMEOUT_MS,
        windowsHide: true,
        maxBuffer: 1024 * 1024
      },
      (error, stdout, stderr) => {
        if (error !== null) {
          reject(new Error(`workbuddy: the desktop app did not provide its at-rest key (${stderr.trim() || error.message})`));
          return;
        }
        const payload = stdout.trim();
        if (payload === "") {
          reject(new Error("workbuddy: the desktop app returned an empty at-rest key payload"));
          return;
        }
        resolve(payload);
      }
    );
  });
}
function readAtRestKey() {
  if (cachedKey !== void 0) return Promise.resolve(cachedKey);
  if (inflightKey !== void 0) return inflightKey;
  if (failedKeyAtMs !== 0 && Date.now() - failedKeyAtMs < AT_REST_KEY_FAILURE_TTL_MS) {
    return Promise.resolve(void 0);
  }
  inflightKey = (async () => {
    const executable = findWorkbuddyAppExecutable();
    if (executable === void 0) return void 0;
    const payload = await fetchAtRestKeyPayload(executable);
    return deriveAtRestKey(payload);
  })().then((key) => {
    cachedKey = key;
    failedKeyAtMs = key === void 0 ? Date.now() : 0;
    return key;
  }, (error) => {
    failedKeyAtMs = Date.now();
    throw error;
  }).finally(() => {
    inflightKey = void 0;
  });
  return inflightKey;
}
function clearAtRestKeyCache() {
  cachedKey = void 0;
  inflightKey = void 0;
  failedKeyAtMs = 0;
}
var FRAMING_CODE, STANDARD_FORMAT_ID, AAD_DOMAIN, SYMMETRIC_SCHEME, WORKBUDDY_APP_EXECUTABLE_ENV, KEY_FETCH_TIMEOUT_MS, APP_EXECUTABLE_NAMES, WINDOWS_APP_SUBDIRECTORIES, MACOS_APP_BUNDLE_NAMES, cachedKey, inflightKey, failedKeyAtMs, AT_REST_KEY_FAILURE_TTL_MS;
var init_at_rest = __esm({
  "src/at-rest.ts"() {
    "use strict";
    FRAMING_CODE = { file: 1, field: 2, record: 3, stream: 4 };
    STANDARD_FORMAT_ID = {
      file: "WBEF1",
      field: "WBEV1",
      record: "WBER1",
      stream: "WBES1"
    };
    AAD_DOMAIN = Buffer.from("WB-AAD\0", "ascii");
    SYMMETRIC_SCHEME = "sym-v1";
    WORKBUDDY_APP_EXECUTABLE_ENV = "WORKBUDDY_APP_EXECUTABLE";
    KEY_FETCH_TIMEOUT_MS = 1e4;
    APP_EXECUTABLE_NAMES = ["WorkBuddy.exe", "WorkBuddyAI.exe"];
    WINDOWS_APP_SUBDIRECTORIES = [
      ["Programs", "WorkBuddy"],
      ["WorkBuddy"],
      ["Programs", "WorkBuddyAI"],
      ["WorkBuddyAI"]
    ];
    MACOS_APP_BUNDLE_NAMES = ["WorkBuddy.app", "WorkBuddy AI.app"];
    failedKeyAtMs = 0;
    AT_REST_KEY_FAILURE_TTL_MS = 6e4;
  }
});

// src/auth-io.ts
var auth_io_exports = {};
__export(auth_io_exports, {
  clearStoredCredentials: () => clearStoredCredentials
});
import { existsSync as existsSync4, rmSync } from "node:fs";
import { join as join4 } from "node:path";
function clearStoredCredentials(region) {
  const dir = pluginDataDir();
  for (const path of [
    join4(dir, `auth.${region}.json`),
    join4(dir, "workbuddy-vault", region)
  ]) {
    try {
      if (existsSync4(path)) rmSync(path, { recursive: true, force: true });
    } catch {
    }
  }
}
var init_auth_io = __esm({
  "src/auth-io.ts"() {
    "use strict";
    init_auth();
  }
});

// src/index.ts
init_catalog();

// src/store.ts
init_auth();
init_upstream();
init_at_rest();
var WorkBuddyCredentialStore = class {
  constructor(region, log) {
    this.region = region;
    this.log = log;
  }
  region;
  log;
  /** Cache of the last resolved credential, keyed by region. */
  resolved = /* @__PURE__ */ new Map();
  getRegion() {
    return this.region;
  }
  /**
   * Resolve the credential for the next request, refreshing when the token
   * is expired (or has no stated expiry and was never refreshed). Throws a
   * plain Error with the actionable advice when nothing usable exists.
   */
  async resolve() {
    const cached = this.resolved.get(this.region);
    if (cached !== void 0 && !this.needsRefresh(cached)) return cached;
    const own = readOwnCredential(this.region);
    const desktop = await this.readDesktop();
    const vault = readVaultAccounts(this.region);
    const best = this.pickBest(own, desktop, vault);
    if (best === void 0) {
      throw new Error(
        `workbuddy ${this.region}: no usable credential. Sign in to the WorkBuddy desktop app (or run /login workbuddy${this.region === "global" ? "-global" : ""}), then retry.`
      );
    }
    let credential = best;
    if (this.needsRefresh(credential) && credential.refreshToken !== "") {
      try {
        credential = await this.refresh(credential);
        saveOwnCredential(this.region, credential);
      } catch (error) {
        this.log?.(`workbuddy ${this.region}: token refresh failed: ${String(error)}`);
        if (credential.expiresAtMs !== 0 && credential.expiresAtMs <= Date.now()) {
          throw error;
        }
      }
    }
    this.resolved.set(this.region, credential);
    return credential;
  }
  /** Current status, without network I/O (reads the at-rest key lazily). */
  async status() {
    const desktop = await this.readDesktop();
    const own = readOwnCredential(this.region);
    const vault = readVaultAccounts(this.region);
    const best = this.pickBest(own, desktop, vault);
    return {
      region: this.region,
      signedIn: best !== void 0,
      ...best === void 0 ? {} : {
        label: best.nickname ?? best.displayName ?? best.uid,
        expiresAtMs: best.expiresAtMs,
        source: best.source
      },
      candidates: desktop.candidates
    };
  }
  /** Invalidate the cached resolution (after a credential rejection). */
  invalidate() {
    this.resolved.delete(this.region);
  }
  /** Run the OAuth flow's collected account through the vault + selection. */
  acceptOAuthCredential(credential) {
    const accountId = saveVaultAccount(this.region, credential);
    this.resolved.set(this.region, credential);
    return accountId;
  }
  needsRefresh(credential) {
    if (credential.refreshToken === "") return false;
    if (credential.expiresAtMs === 0) return true;
    return credential.expiresAtMs <= Date.now() + 6e4;
  }
  async readDesktop() {
    let openField;
    try {
      const key = await readAtRestKey();
      if (key !== void 0) {
        const { isEncryptedFieldWrapper: isEncryptedFieldWrapper2, openEncryptedField: openEncryptedField2 } = await Promise.resolve().then(() => (init_at_rest(), at_rest_exports));
        openField = (value) => {
          if (typeof value === "string") return value === "" ? void 0 : value;
          if (!isEncryptedFieldWrapper2(value)) return void 0;
          try {
            return openEncryptedField2(value, key);
          } catch {
            return void 0;
          }
        };
      }
    } catch {
    }
    return readDesktopCredential(this.region, openField);
  }
  /** Best of the available sources; the desktop live file wins ties only on rank. */
  pickBest(own, desktop, vault) {
    const candidates = [];
    if (own !== void 0) candidates.push({ ...own, source: "plugin" });
    if (desktop?.credential !== void 0) candidates.push(desktop.credential);
    candidates.push(...vault.values());
    if (candidates.length === 0) return void 0;
    const rank = { plugin: 0, desktop: 1, oauth: 2, env: 3 };
    return candidates.sort((a, b) => rank[a.source] - rank[b.source] || b.expiresAtMs - a.expiresAtMs)[0];
  }
  /**
   * POST the refresh endpoint. The refresh token travels here and NOWHERE
   * else; chat requests never see it.
   */
  async refresh(credential) {
    const headers = {
      "Accept": "application/json, text/plain, */*",
      "X-Requested-With": "XMLHttpRequest",
      "X-Refresh-Token": credential.refreshToken,
      "X-Auth-Refresh-Source": "workbuddy"
    };
    if (credential.enterpriseId !== void 0 && credential.enterpriseId !== "") {
      headers["X-Enterprise-Id"] = credential.enterpriseId;
    }
    const response = await fetch(`${chatBase(credential)}${REFRESH_PATH}`, {
      method: "POST",
      headers,
      signal: AbortSignal.timeout(JSON_TIMEOUT_MS)
    });
    const text = await response.text();
    let envelope;
    try {
      envelope = JSON.parse(text);
    } catch {
      throw new Error(`workbuddy token refresh returned non-JSON (http ${response.status})`);
    }
    const code = typeof envelope["code"] === "number" ? envelope["code"] : 0;
    if (!response.ok || code !== 0) {
      throw new Error(`workbuddy token refresh failed (http ${response.status}): ${text.slice(0, 160)}`);
    }
    const data = typeof envelope["data"] === "object" && envelope["data"] !== null ? envelope["data"] : {};
    const accessToken = typeof data["accessToken"] === "string" ? data["accessToken"] : "";
    if (accessToken === "") {
      throw new Error("workbuddy token refresh returned no accessToken; sign in again in the WorkBuddy app");
    }
    const expiresIn = typeof data["expiresIn"] === "number" && data["expiresIn"] > 0 ? data["expiresIn"] : void 0;
    return {
      ...credential,
      accessToken,
      ...typeof data["refreshToken"] === "string" && data["refreshToken"] !== "" ? { refreshToken: data["refreshToken"] } : {},
      expiresAtMs: expiresIn !== void 0 ? Date.now() + expiresIn * 1e3 : credential.expiresAtMs,
      ...typeof data["domain"] === "string" && data["domain"] !== "" ? { domain: data["domain"] } : {},
      source: "plugin"
    };
  }
};
function parseCreditMultiplier(value) {
  if (typeof value !== "string") return void 0;
  const match = /x\s*([0-9]*\.?[0-9]+)/iu.exec(value);
  if (match === null) return void 0;
  const parsed = Number(match[1]);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : void 0;
}
var SINGULAR_EFFORT_LADDER = ["low", "medium", "high", "xhigh", "max"];
function parseReasoning(value) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return void 0;
  const raw = value;
  const effort = typeof raw["effort"] === "string" ? raw["effort"] : void 0;
  const supportedEfforts = Array.isArray(raw["supportedEfforts"]) ? raw["supportedEfforts"].filter((entry) => typeof entry === "string") : effort !== void 0 ? SINGULAR_EFFORT_LADDER.includes(effort) ? [...SINGULAR_EFFORT_LADDER] : [effort] : void 0;
  const defaultEffort = typeof raw["defaultEffort"] === "string" ? raw["defaultEffort"] : effort;
  const canDisableThinking = typeof raw["canDisableThinking"] === "boolean" ? raw["canDisableThinking"] : effort !== void 0 && !Array.isArray(raw["supportedEfforts"]) && typeof raw["defaultEffort"] !== "string" ? true : void 0;
  if (supportedEfforts === void 0 && defaultEffort === void 0 && canDisableThinking === void 0) {
    return void 0;
  }
  return {
    ...supportedEfforts === void 0 || supportedEfforts.length === 0 ? {} : { supportedEfforts },
    ...defaultEffort === void 0 ? {} : { defaultEffort },
    ...canDisableThinking === void 0 ? {} : { canDisableThinking }
  };
}
var ROUTER_MODEL_IDS = /* @__PURE__ */ new Set(["auto", "default-model"]);
function parseUpstreamModel(value) {
  if (typeof value !== "object" || value === null) return void 0;
  const raw = value;
  const id = typeof raw["id"] === "string" ? raw["id"] : "";
  if (id === "" || raw["disabled"] === true) return void 0;
  const input = typeof raw["maxInputTokens"] === "number" ? raw["maxInputTokens"] : 0;
  const output = typeof raw["maxOutputTokens"] === "number" ? raw["maxOutputTokens"] : 0;
  if (input <= 0 || output <= 0) return void 0;
  const name = typeof raw["name"] === "string" && raw["name"] !== "" ? raw["name"] : id;
  const creditMultiplier = parseCreditMultiplier(raw["credits"]);
  const reasoning = parseReasoning(raw["reasoning"]);
  const supportsImages = raw["disabledMultimodal"] === true ? false : typeof raw["supportsImages"] === "boolean" ? raw["supportsImages"] : void 0;
  return {
    id,
    name,
    contextWindow: input,
    maxTokens: output,
    ...creditMultiplier === void 0 ? {} : { creditMultiplier },
    ...supportsImages === void 0 ? {} : { supportsImages },
    ...reasoning === void 0 ? {} : { reasoning }
  };
}
function selectCliModels(rawModels, agents) {
  const byId = /* @__PURE__ */ new Map();
  for (const model of Array.isArray(rawModels) ? rawModels : []) {
    const parsed = parseUpstreamModel(model);
    if (parsed !== void 0) byId.set(parsed.id, parsed);
  }
  let cliIds;
  for (const agent of Array.isArray(agents) ? agents : []) {
    if (typeof agent === "object" && agent !== null) {
      const wrapped = agent;
      if (wrapped["name"] === "cli" && Array.isArray(wrapped["models"])) {
        cliIds = wrapped["models"].filter((id) => typeof id === "string");
        break;
      }
    }
  }
  const ids = cliIds !== void 0 && cliIds.length > 0 ? cliIds : [...byId.keys()];
  return ids.filter((id) => !ROUTER_MODEL_IDS.has(id)).map((id) => byId.get(id)).filter((model) => model !== void 0);
}

// src/client.ts
init_upstream();
import { gzipSync } from "node:zlib";

// src/wire.ts
init_upstream();

// src/wire-profile.ts
var WORKBUDDY_CHAT_API = "workbuddy-api";
var WORKBUDDY_MESSAGES_API = "workbuddy-anthropic";
var DEFAULT_APP_VERSION = "5.9.3";
var DEFAULT_CLI_VERSION = "2.165.0";
var OPENAI_SDK_VERSION = "6.25.0";
var DESKTOP_NODE_VERSION = "v22.21.1";
function envValue(name, fallback) {
  const value = process.env[name]?.trim();
  return value === void 0 || value === "" ? fallback : value;
}
var APP_VERSION = envValue("WORKBUDDY_APP_VERSION", DEFAULT_APP_VERSION);
var CLI_VERSION = envValue("WORKBUDDY_CLI_VERSION", DEFAULT_CLI_VERSION);
function wireProfileFor(region) {
  const appName = region === "global" ? "workbuddy-ai" : "WorkBuddy";
  return {
    region,
    appVersion: APP_VERSION,
    cliVersion: CLI_VERSION,
    appName,
    runtime: "local-agent",
    userAgent: `WorkBuddy/${APP_VERSION} ${appName}/${APP_VERSION} CLI/${CLI_VERSION}`,
    openAISdkVersion: OPENAI_SDK_VERSION,
    nodeVersion: DESKTOP_NODE_VERSION
  };
}
function usesMessagesApi(region, modelId) {
  return region === "cn" && /^claude-/iu.test(modelId);
}
function apiForModel(region, modelId) {
  return usesMessagesApi(region, modelId) ? WORKBUDDY_MESSAGES_API : WORKBUDDY_CHAT_API;
}

// src/wire-headers.ts
init_upstream();
function chatBase2(credential) {
  return regionOf(credential.domain) === "global" ? globalBase(credential.domain) : CN_CHAT_BASE;
}
function accountDomain(credential, region) {
  const stated = credential.domain.trim();
  if (stated !== "") return stated;
  return new URL(region === "global" ? GLOBAL_BASE : CN_CHAT_BASE).host;
}

// src/wire.ts
var SDK_OS = {
  aix: "AIX",
  android: "Android",
  cygwin: "Windows",
  darwin: "MacOS",
  freebsd: "FreeBSD",
  haiku: "Haiku",
  linux: "Linux",
  netbsd: "NetBSD",
  openbsd: "OpenBSD",
  sunos: "SunOS",
  win32: "Windows"
};
var SDK_ARCH = {
  arm: "arm",
  arm64: "arm64",
  ia32: "x32",
  x32: "x32",
  x64: "x64"
};
function accountHeaders(credential, region) {
  const enterpriseId = credential.enterpriseId?.trim() ?? "";
  return {
    "Authorization": `Bearer ${credential.accessToken}`,
    "X-User-Id": credential.uid,
    ...enterpriseId === "" ? {} : {
      "X-Enterprise-Id": enterpriseId,
      "X-Tenant-Id": enterpriseId
    },
    "X-Domain": accountDomain(credential, region)
  };
}
function attributionHeaders(credential) {
  const profile = wireProfileFor(regionOf(credential.domain));
  return {
    "User-Agent": profile.userAgent,
    "X-Requested-With": "XMLHttpRequest",
    "X-Product": "SaaS",
    "X-IDE-Type": "WorkBuddy",
    "X-IDE-Name": "WorkBuddy",
    "X-IDE-Version": profile.appVersion,
    "X-Agent-Intent": "craft",
    "X-Agent-Purpose": "conversation"
  };
}
function modelRequestHeaders(credential) {
  const profile = wireProfileFor(regionOf(credential.domain));
  return {
    "X-Agent-Type": "main",
    ...profile.runtime === "" ? {} : { "X-Agent-Runtime": profile.runtime },
    "X-Stainless-Retry-Count": "0",
    "X-Stainless-Timeout": "1200",
    "X-Stainless-Lang": "js",
    "X-Stainless-Package-Version": profile.openAISdkVersion,
    "X-Stainless-OS": SDK_OS[process.platform] ?? `Other:${process.platform}`,
    "X-Stainless-Arch": SDK_ARCH[process.arch] ?? `other:${process.arch}`,
    "X-Stainless-Runtime": "node",
    "X-Stainless-Runtime-Version": profile.nodeVersion
  };
}
function workBuddyModelHeaders(credential, identity) {
  return {
    "Accept": "application/json",
    "Content-Type": "application/json",
    ...accountHeaders(credential, regionOf(credential.domain)),
    ...attributionHeaders(credential),
    ...modelRequestHeaders(credential),
    "X-Conversation-ID": identity.conversationId,
    "X-Conversation-Request-ID": identity.turnId,
    "X-Conversation-Message-ID": identity.messageId,
    "X-Request-ID": identity.requestId
  };
}
function workBuddyCatalogHeaders(credential) {
  return {
    "Accept": "application/json",
    ...accountHeaders(credential, regionOf(credential.domain)),
    ...attributionHeaders(credential)
  };
}

// src/client.ts
var HARD_CREDIT_MARKERS = [
  "insufficient credit",
  "no credit",
  "credit exhausted",
  "credits exhausted",
  "out of credit",
  "quota exceeded",
  "quota exhaust",
  "payment required",
  "credit not enough",
  "not enough credit",
  "credits not enough",
  "\u79EF\u5206\u4E0D\u8DB3",
  "\u989D\u5EA6\u4E0D\u8DB3",
  "\u4F59\u989D\u4E0D\u8DB3",
  "\u79EF\u5206\u7528\u5B8C",
  "\u989D\u5EA6\u7528\u5C3D",
  "\u6CA1\u6709\u79EF\u5206"
];
var CREDITS_EXHAUSTED_CODE = 14018;
var SESSION_DEAD_MARKERS = ["Offline user session not found", "12153"];
var CONTENT_POLICY_CODE = 11140;
var ACCOUNT_RESTRICTED_MARKERS = [
  "\u8D26\u53F7\u5B58\u5728\u5F02\u5E38\u884C\u4E3A",
  "restricted due to unusual activity"
];
var CHANNEL_REJECT_CODE = 11128;
var CHANNEL_REJECT_MARKERS = ["unapproved channel", "illegal api invocation"];
var MODEL_BUSY_CODE = 14003;
var QUEUE_CODES = [6020, 6021, 6022];
var CONTEXT_OVERFLOW_MARKER = "prompt is too long (upstream code 11115)";
function businessCodeOf(body) {
  let parsed;
  try {
    parsed = JSON.parse(body);
  } catch {
    const match = /"code"\s*:\s*"?(\d{4,6}(?!\d))/u.exec(body);
    return match?.[1] === void 0 ? void 0 : Number(match[1]);
  }
  if (typeof parsed !== "object" || parsed === null) return void 0;
  const raw = parsed;
  const direct = asBusinessCode(raw["code"]);
  if (direct !== void 0) return direct;
  const error = raw["error"];
  if (typeof error === "object" && error !== null) {
    const data2 = error["data"];
    if (typeof data2 === "object" && data2 !== null) return asBusinessCode(data2["code"]);
  }
  const data = raw["data"];
  if (typeof data === "object" && data !== null) return asBusinessCode(data["code"]);
  return void 0;
}
function asBusinessCode(value) {
  if (typeof value === "number" && Number.isInteger(value)) return value;
  if (typeof value === "string" && /^\d{4,6}$/u.test(value.trim())) return Number(value.trim());
  return void 0;
}
function isAccountRestrictedBody(body) {
  if (businessCodeOf(body) !== CONTENT_POLICY_CODE) return false;
  const lower = body.toLowerCase();
  return ACCOUNT_RESTRICTED_MARKERS.some((marker) => lower.includes(marker.toLowerCase()));
}
function isChannelRejectBody(body) {
  const lower = body.toLowerCase();
  return lower.includes(String(CHANNEL_REJECT_CODE)) && CHANNEL_REJECT_MARKERS.some((marker) => lower.includes(marker));
}
function isModelBusyBody(body) {
  return businessCodeOf(body) === MODEL_BUSY_CODE;
}
function isContextTooLongBody(body) {
  return businessCodeOf(body) === 11115;
}
function parseQueueAnswer(text) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return void 0;
  }
  const read = (code, data2) => {
    if (typeof code !== "number" || !QUEUE_CODES.includes(code)) return void 0;
    const record = typeof data2 === "object" && data2 !== null ? data2 : {};
    const position = typeof record["queue_position"] === "number" ? record["queue_position"] : void 0;
    const size = typeof record["queue_size"] === "number" ? record["queue_size"] : void 0;
    return { code, ...position === void 0 ? {} : { position }, ...size === void 0 ? {} : { size } };
  };
  if (typeof parsed !== "object" || parsed === null) return void 0;
  const envelope = parsed;
  const direct = read(envelope["code"], envelope["data"]);
  if (direct !== void 0) return direct;
  const data = envelope["data"];
  if (typeof data === "object" && data !== null) {
    const inner = data;
    return read(inner["code"], inner["data"] ?? inner);
  }
  return void 0;
}
function queueNoticeText(report) {
  if (report.code === 6020) {
    const position = report.position === void 0 ? "\u672A\u77E5" : `${report.position}`;
    const size = report.size === void 0 ? "" : `\uFF0C\u961F\u5217\u5171 ${report.size} \u4E2A\u8BF7\u6C42`;
    return `\u6A21\u578B\u6392\u961F\u4E2D\uFF1A\u4F60\u6392\u5728\u7B2C ${position} \u4F4D${size}\u3002\u8BF7\u7A0D\u540E\u91CD\u65B0\u53D1\u9001\u8FD9\u6761\u6D88\u606F\uFF0C\u6216\u6362\u4E00\u4E2A\u6A21\u578B`;
  }
  if (report.code === 6021) return "\u6A21\u578B\u6392\u961F\u5DF2\u6EE1\uFF1A\u5F53\u524D\u961F\u5217\u4E0D\u518D\u63A5\u53D7\u65B0\u7684\u8BF7\u6C42\u3002\u8BF7\u7A0D\u540E\u91CD\u8BD5\uFF0C\u6216\u6362\u4E00\u4E2A\u6A21\u578B";
  return "\u8BE5\u8D26\u53F7\u5728\u6B64\u6A21\u578B\u4E0A\u7684\u6392\u961F\u8BF7\u6C42\u5DF2\u8FBE\u4E0A\u9650\uFF1A\u8BF7\u7B49\u5F85\u5728\u9014\u8BF7\u6C42\u5B8C\u6210\uFF0C\u6216\u6362\u4E00\u4E2A\u6A21\u578B";
}
function classifyUpstreamError(status, body) {
  if (status === 402) return "hard_credit";
  const lower = body.toLowerCase();
  for (const marker of HARD_CREDIT_MARKERS) {
    if (lower.includes(marker.toLowerCase()) || body.includes(marker)) return "hard_credit";
  }
  if (businessCodeOf(body) === CREDITS_EXHAUSTED_CODE) return "hard_credit";
  for (const marker of SESSION_DEAD_MARKERS) {
    if (body.includes(String(marker))) return "session_dead";
  }
  if (isAccountRestrictedBody(body)) return "account_restricted";
  if (businessCodeOf(body) === CONTENT_POLICY_CODE) return "policy_reject";
  if (isChannelRejectBody(body)) return "channel_reject";
  if (isModelBusyBody(body)) return "model_busy";
  if (parseQueueAnswer(body) !== void 0) return "model_queue";
  if (status === 429) return "soft_rate";
  if (status === 404) return "not_found";
  if (status >= 500) return "server";
  if (status >= 400) return "client";
  return "client";
}
var KIND_STATUS = {
  hard_credit: 402,
  soft_rate: 429,
  model_busy: 429,
  session_dead: 401,
  policy_reject: 403,
  account_restricted: 403,
  channel_reject: 400,
  model_queue: 429,
  not_found: 502,
  server: 502,
  client: 400
};
function failureMessage(kind, status, body) {
  const queue = parseQueueAnswer(body);
  if (kind === "model_queue" && queue !== void 0) return `${queueNoticeText(queue)}\uFF08\u4E0A\u6E38 code ${queue.code}\uFF09`;
  const clipped = body.length > 400 ? `${body.slice(0, 400)}\u2026` : body;
  const prefix = `workbuddy \u4E0A\u6E38\u5931\u8D25\uFF08http ${status}\uFF09\uFF1A`;
  const overflow = isContextTooLongBody(body) ? `${CONTEXT_OVERFLOW_MARKER}\u3002` : "";
  switch (kind) {
    case "hard_credit":
      return `${prefix}${clipped}\u3002\u79EF\u5206\u5DF2\u7528\u5C3D\uFF0C\u8BF7\u5145\u503C\u6216\u66F4\u6362\u8D26\u53F7`;
    case "soft_rate":
      return `${prefix}${clipped}\u3002\u8BE5\u8D26\u53F7\u7684\u7528\u91CF\u9650\u5236\u5C06\u5728\u4E0A\u6E38\u58F0\u660E\u7684\u65F6\u523B\u91CD\u7F6E\uFF08\u4E0E\u6A21\u578B\u8D1F\u8F7D\u65E0\u5173\uFF09\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5\u6216\u6362\u4E00\u4E2A\u8D26\u53F7`;
    case "model_busy":
      return `${prefix}${clipped}\u3002\u8FD9\u4E0D\u662F\u8D26\u53F7\u88AB\u9650\u6D41\uFF0C\u4E0E\u79EF\u5206\u3001\u989D\u5EA6\u65E0\u5173\u2014\u2014\u540C\u4E00\u51ED\u636E\u4E0B\u6362\u4E00\u4E2A\u6A21\u578B\u5373\u53EF\uFF1B\u8BF7\u7B49\u5F85\u7EA6 1 \u5206\u949F\u540E\u91CD\u8BD5\uFF0C\u6216\u5207\u6362\u5230\u8D1F\u8F7D\u8F83\u4F4E\u7684\u6A21\u578B`;
    case "session_dead":
      return `${prefix}${clipped}\u3002\u767B\u5F55\u6001\u5DF2\u5931\u6548\uFF0C\u8BF7\u5728 WorkBuddy \u684C\u9762\u7AEF\u91CD\u65B0\u767B\u5F55\uFF0C\u6216\u7528 /login \u91CD\u65B0\u626B\u7801`;
    case "account_restricted":
      return `${prefix}${clipped}\u3002\u8BE5\u8D26\u53F7\u5DF2\u88AB WorkBuddy \u4E0A\u6E38\u6309\u8D26\u53F7\u9650\u5236\uFF0C\u4E0E\u672C\u6B21\u8BF7\u6C42\u5185\u5BB9\u3001\u7F51\u7EDC\u548C\u989D\u5EA6\u65E0\u5173\uFF1B\u91CD\u65B0\u767B\u5F55\u4E0D\u6539\u53D8\u8FD9\u4E00\u5224\u5B9A`;
    case "policy_reject":
      return `${prefix}${clipped}\u3002\u8BE5\u8BF7\u6C42\u88AB\u670D\u52A1\u7AEF\u7B56\u7565\u62D2\u7EDD\uFF1B\u82E5\u8BF4\u660E\u6307\u5411\u5185\u5BB9\uFF0C\u8BF7\u8C03\u6574\u540E\u91CD\u8BD5`;
    case "channel_reject":
      return `${prefix}${clipped}\u3002\u8BE5\u8BF7\u6C42\u88AB\u7F51\u5173\u7684\u6E20\u9053\u6821\u9A8C\u62E6\u622A\uFF1A\u7F51\u5173\u5339\u914D\u7684\u662F system/assistant \u6D88\u606F\u7684\u5F00\u5934\u6307\u7EB9\uFF0C\u4E0E\u8D26\u53F7\u3001\u79EF\u5206\u3001\u989D\u5EA6\u90FD\u65E0\u5173\uFF0C\u6362\u8D26\u53F7\u4E5F\u4E0D\u4F1A\u6539\u53D8\u7ED3\u679C`;
    default:
      return `${prefix}${overflow}${clipped}`;
  }
}
var WORKBUDDY_FALLBACK_SYSTEM_PROMPT = "You are a helpful assistant.";
var UNAPPROVED_CHANNEL_OPENINGS = [
  "you are an ai agent powered by deepseek harness",
  "you are claude code, anthropic's official cli for claude"
];
function isUnapprovedChannelOpening(text) {
  const opening = text.replace(/^\s+/u, "").toLowerCase();
  return UNAPPROVED_CHANNEL_OPENINGS.some((prefix) => opening.startsWith(prefix));
}
function scansOpening(role) {
  if (typeof role !== "string") return false;
  const name = role.trim().toLowerCase();
  return name === "system" || name === "assistant" || name === "developer";
}
function neutralizeChannelFingerprints(obj) {
  const messages = obj["messages"];
  if (!Array.isArray(messages)) return;
  for (const value of messages) {
    if (typeof value !== "object" || value === null || Array.isArray(value)) continue;
    const message = value;
    if (!scansOpening(message["role"])) continue;
    const content = message["content"];
    if (typeof content === "string") {
      if (isUnapprovedChannelOpening(content)) {
        message["content"] = `${WORKBUDDY_FALLBACK_SYSTEM_PROMPT}

${content}`;
      }
      continue;
    }
    if (!Array.isArray(content)) continue;
    for (const part of content) {
      if (typeof part !== "object" || part === null || Array.isArray(part)) continue;
      const record = part;
      if (record["type"] !== "text" || typeof record["text"] !== "string") continue;
      if (isUnapprovedChannelOpening(record["text"])) {
        record["text"] = `${WORKBUDDY_FALLBACK_SYSTEM_PROMPT}

${record["text"]}`;
      }
    }
  }
}
function ensureSystemHead(obj) {
  const messages = obj["messages"];
  if (!Array.isArray(messages) || messages.length === 0) return;
  const head = messages[0];
  if (typeof head !== "object" || head === null || Array.isArray(head)) return;
  const role = head["role"];
  if (typeof role === "string" && (role === "system" || role === "developer")) return;
  messages.unshift({ role: "system", content: WORKBUDDY_FALLBACK_SYSTEM_PROMPT });
}
function normalizeToolChoice(obj) {
  const present = "tool_choice" in obj;
  if (!present) return;
  const choice = obj["tool_choice"];
  if (typeof choice === "string") {
    if (choice.trim().toLowerCase() === "none") {
      delete obj["tool_choice"];
      delete obj["tools"];
      delete obj["functions"];
    }
    return;
  }
  if (typeof choice === "object" && choice !== null) {
    const record = choice;
    if (record["type"] === "function") {
      const fn = typeof record["function"] === "object" && record["function"] !== null ? record["function"] : {};
      const name = typeof fn["name"] === "string" ? fn["name"].trim() : "";
      if (name !== "") {
        obj["tool_choice"] = name;
        return;
      }
    }
  }
  delete obj["tool_choice"];
}
function prepareChatBody(source) {
  let body;
  try {
    body = JSON.parse(source);
  } catch {
    return source;
  }
  if (typeof body !== "object" || body === null || Array.isArray(body)) return source;
  const obj = body;
  obj["stream"] = true;
  if (Array.isArray(obj["messages"])) {
    for (const value of obj["messages"]) {
      if (typeof value !== "object" || value === null || Array.isArray(value)) continue;
      const message = value;
      if (message["role"] === "developer") message["role"] = "system";
    }
  }
  ensureSystemHead(obj);
  neutralizeChannelFingerprints(obj);
  normalizeToolChoice(obj);
  return JSON.stringify(obj);
}
async function readEnvelope(response) {
  const text = await response.text();
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error(`workbuddy upstream returned non-JSON (http ${response.status}): ${text.slice(0, 160)}`);
  }
  if (typeof parsed !== "object" || parsed === null) {
    throw new Error(`workbuddy upstream returned an unexpected document (http ${response.status})`);
  }
  const document = parsed;
  const code = typeof document["code"] === "number" ? document["code"] : 0;
  if (!response.ok || code !== 0) {
    const msg = typeof document["msg"] === "string" ? document["msg"] : text.slice(0, 160);
    throw new Error(`workbuddy upstream error (http ${response.status}): ${msg}`);
  }
  return document;
}
function envelopeData(document) {
  const data = document["data"];
  return typeof data === "object" && data !== null && !Array.isArray(data) ? data : {};
}
function safeProviderHeaders(input) {
  if (input === void 0) return {};
  const out = {};
  new Headers(input).forEach((value, name) => {
    if (name.startsWith("anthropic-") && name !== "anthropic-dangerous-direct-browser-access") {
      out[name] = value;
    }
  });
  return out;
}
var WorkBuddyUpstreamClient = class {
  /** POST the chat endpoint; a successful answer is the raw SSE response. */
  async chatStream(credential, bodyJson, identity, signal, extraHeaders) {
    return this.modelStream(
      credential,
      `${chatBase2(credential)}${CHAT_PATH}`,
      bodyJson,
      identity,
      true,
      signal,
      extraHeaders
    );
  }
  /** POST the Anthropic Messages route; this route is never gzipped. */
  async messagesStream(credential, bodyJson, identity, signal, extraHeaders) {
    return this.modelStream(
      credential,
      `${chatBase2(credential)}/v1/messages`,
      bodyJson,
      identity,
      false,
      signal,
      extraHeaders
    );
  }
  async modelStream(credential, url, bodyJson, identity, compress, signal, extraHeaders) {
    let response;
    try {
      const headers = {
        ...safeProviderHeaders(extraHeaders),
        ...workBuddyModelHeaders(credential, identity)
      };
      const body = compress ? gzipSync(Buffer.from(bodyJson, "utf8")) : bodyJson;
      if (compress) headers["Content-Encoding"] = "gzip";
      response = await fetch(url, {
        method: "POST",
        headers,
        body,
        ...signal === void 0 ? {} : { signal }
      });
    } catch (error) {
      return { ok: false, status: 0, kind: "server", message: `transport error: ${String(error)}` };
    }
    if (response.ok) return { ok: true, status: response.status, response };
    const text = (await response.text()).slice(0, ERROR_BODY_LIMIT);
    return {
      ok: false,
      status: response.status,
      kind: classifyUpstreamError(response.status, text),
      message: text
    };
  }
  /**
   * Read the model directory for the credential's region.
   *
   * Both regions read `/v3/config` as the APP's product identity — the CLI
   * channel's answer is a strict subset and publishes no promotion feed. CN
   * falls back to the legacy `/v2` document so a gateway that stops serving
   * the modern one degrades instead of emptying the region.
   */
  async fetchModels(credential, signal) {
    const timeout = signal ?? AbortSignal.timeout(JSON_TIMEOUT_MS);
    const readCatalog = async (path) => {
      const response = await fetch(`${chatBase2(credential)}${path}`, {
        headers: workBuddyCatalogHeaders(credential),
        signal: timeout
      });
      const envelope = await readEnvelope(response);
      const data = envelopeData(envelope);
      return selectCliModels(data["models"], data["agents"]);
    };
    try {
      return await readCatalog(GLOBAL_CONFIG_PATH);
    } catch (error) {
      if (regionOf(credential.domain) === "global") throw error;
      console.warn(
        `[pi-provider-workbuddy] CN catalog ${GLOBAL_CONFIG_PATH} failed; falling back to ${MODELS_CATALOG_PATH}:`,
        error instanceof Error ? error.message : error
      );
      return await readCatalog(MODELS_CATALOG_PATH);
    }
  }
  /**
   * Read the remaining credit (read-only, no cost). Personal accounts read
   * `/v2/billing/meter/get-user-resource`; enterprise members read
   * `/billing/meter/get-enterprise-user-usage` (no `/v2` prefix), where
   * REMAINING is `limitNum - credit`.
   */
  async fetchCredits(credential) {
    const base = regionOf(credential.domain) === "global" ? globalBase(credential.domain) : "https://www.codebuddy.cn";
    const headers = {
      "Authorization": `Bearer ${credential.accessToken}`,
      "Accept": "application/json",
      "Content-Type": "application/json",
      ...credential.uid !== "" ? { "X-User-Id": credential.uid } : {},
      ...credential.enterpriseId !== void 0 && credential.enterpriseId !== "" ? { "X-Enterprise-Id": credential.enterpriseId, "X-Tenant-Id": credential.enterpriseId } : {},
      ...credential.domain !== "" ? { "X-Domain": credential.domain } : {}
    };
    if (credential.enterpriseId !== void 0 && credential.enterpriseId !== "") {
      const response2 = await fetch(`${base}/billing/meter/get-enterprise-user-usage`, {
        method: "POST",
        headers,
        body: "{}",
        signal: AbortSignal.timeout(JSON_TIMEOUT_MS)
      });
      const envelope2 = await readEnvelope(response2);
      const wrapper2 = envelopeData(envelope2);
      const inner2 = typeof wrapper2["Data"] === "object" && wrapper2["Data"] !== null ? wrapper2["Data"] : wrapper2;
      const limit = typeof inner2["limitNum"] === "number" ? inner2["limitNum"] : void 0;
      const used = typeof inner2["credit"] === "number" ? inner2["credit"] : void 0;
      if (limit !== void 0 && used !== void 0) return { total: Math.max(0, limit - used) };
      return {};
    }
    const now = /* @__PURE__ */ new Date();
    const format = (date) => [
      date.getFullYear().toString().padStart(4, "0"),
      (date.getMonth() + 1).toString().padStart(2, "0"),
      date.getDate().toString().padStart(2, "0")
    ].join(" ") + " " + [
      date.getHours().toString().padStart(2, "0"),
      date.getMinutes().toString().padStart(2, "0"),
      date.getSeconds().toString().padStart(2, "0")
    ].join(":");
    const response = await fetch(`${base}/v2/billing/meter/get-user-resource`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        PageNumber: 1,
        PageSize: 100,
        ProductCode: "p_tcaca",
        Status: [0, 3],
        PackageEndTimeRangeBegin: format(now),
        PackageEndTimeRangeEnd: format(new Date(now.getTime() + 365 * 101 * 24 * 3600 * 1e3))
      }),
      signal: AbortSignal.timeout(JSON_TIMEOUT_MS)
    });
    const envelope = await readEnvelope(response);
    const wrapper = envelopeData(envelope);
    const data = typeof wrapper["Response"] === "object" && wrapper["Response"] !== null ? wrapper["Response"] : {};
    const inner = typeof data["Data"] === "object" && data["Data"] !== null ? data["Data"] : {};
    const accounts = Array.isArray(inner["Accounts"]) ? inner["Accounts"] : [];
    let total = 0;
    for (const raw of accounts) {
      if (typeof raw !== "object" || raw === null) continue;
      const account = raw;
      const precise = (key) => {
        const preciseRaw = account[`${key}Precise`];
        if (typeof preciseRaw === "string" && preciseRaw !== "") {
          const parsed = Number.parseFloat(preciseRaw);
          if (Number.isFinite(parsed)) return parsed;
        }
        if (typeof preciseRaw === "number" && Number.isFinite(preciseRaw)) return preciseRaw;
        return typeof account[key] === "number" ? account[key] : 0;
      };
      const monthly = account["CapacityType"] === 4;
      const hasCycle = account["CycleCapacityRemain"] !== void 0;
      const remain = hasCycle ? precise("CycleCapacityRemain") : precise("CapacityRemain");
      const capped = remain < 0 ? 0 : remain;
      if (!monthly && capped <= 0) continue;
      total += capped;
    }
    return { total, raw: JSON.stringify({ total }) };
  }
};

// src/stream.ts
import {
  anthropicMessagesApi,
  createAssistantMessageEventStream,
  getCurrentTools,
  openAICompletionsApi
} from "@earendil-works/pi-ai/compat";

// src/dsml.ts
import { randomUUID } from "node:crypto";
var FULLWIDTH_BAR = "\uFF5C";
var MARKUP_RE = new RegExp(`${FULLWIDTH_BAR}${FULLWIDTH_BAR}?DSML${FULLWIDTH_BAR}${FULLWIDTH_BAR}?`, "g");
var MARKUP_PREFIXES = [
  `${FULLWIDTH_BAR}${FULLWIDTH_BAR}DSML${FULLWIDTH_BAR}${FULLWIDTH_BAR}`,
  "||DSML||",
  "|DSML|"
];
var ASCII_PREFIXES = ["||DSML||", "|DSML|"];
var BLOCK_TAGS = ["tool_calls", "invoke"];
var KEYWORD_TAGS = ["tool_calls", "tool-calls", "toolcalls", "invoke", "parameter", "calls", "tool"];
var CANONICAL_TAG_NAMES = /* @__PURE__ */ new Map([
  ["tool_calls", "tool_calls"],
  ["tool-calls", "tool_calls"],
  ["toolcalls", "tool_calls"],
  ["invoke", "invoke"],
  ["parameter", "parameter"]
]);
var MARKER_ONLY_TAG_NAMES = /* @__PURE__ */ new Set(["tool-calls", "toolcalls"]);
var FENCE_MARKERS = ["```", "~~~"];
function ignoredSpans(text) {
  const spans = [];
  let i = 0;
  let fence;
  let fenceStart = 0;
  while (i < text.length) {
    const atLineStart = i === 0 || text.charAt(i - 1) === "\n";
    if (fence !== void 0) {
      if (atLineStart && text.startsWith(fence, i)) {
        const lineEnd = text.indexOf("\n", i);
        const end = lineEnd === -1 ? text.length : lineEnd + 1;
        spans.push({ start: fenceStart, end, open: false });
        fence = void 0;
        i = end;
        continue;
      }
      i += 1;
      continue;
    }
    if (atLineStart) {
      const marker = FENCE_MARKERS.find((candidate) => text.startsWith(candidate, i));
      if (marker !== void 0) {
        fence = marker;
        fenceStart = i;
        i += marker.length;
        continue;
      }
    }
    if (text.charAt(i) === "`") {
      const end = codeSpanEnd(text, i);
      if (end === -1) {
        spans.push({ start: i, end: text.length, open: true });
        break;
      }
      spans.push({ start: i, end, open: false });
      i = end;
      continue;
    }
    const xml = xmlIgnoredEnd(text, i);
    if (xml !== void 0) {
      spans.push(xml);
      if (xml.end >= text.length && xml.open) break;
      i = xml.end;
      continue;
    }
    i += 1;
  }
  if (fence !== void 0) spans.push({ start: fenceStart, end: text.length, open: true });
  return spans;
}
function codeSpanEnd(text, start) {
  let ticks = 0;
  let i = start;
  while (i < text.length && text.charAt(i) === "`") {
    ticks += 1;
    i += 1;
  }
  if (ticks === 0 || ticks >= 3) return -1;
  let end = i;
  while (end < text.length) {
    if (text.charAt(end) !== "`") {
      end += 1;
      continue;
    }
    let closingTicks = 0;
    let j = end;
    while (j < text.length && text.charAt(j) === "`") {
      closingTicks += 1;
      j += 1;
    }
    if (closingTicks === ticks) return j;
    end = j;
  }
  return -1;
}
function xmlIgnoredEnd(text, index) {
  const forms = [
    ["<![CDATA[", "]]>"],
    ["<!--", "-->"],
    ["<?", "?>"]
  ];
  for (const [open, close] of forms) {
    if (!text.startsWith(open, index)) continue;
    const found = text.indexOf(close, index + open.length);
    if (found === -1) return { start: index, end: text.length, open: true };
    return { start: index, end: found + close.length, open: false };
  }
  return void 0;
}
function skipIgnored(spans, index, cursor) {
  while (cursor.at < spans.length) {
    const span = spans[cursor.at];
    if (span === void 0 || index < span.start) return index;
    if (index < span.end) return span.end;
    cursor.at += 1;
  }
  return index;
}
function normalizeFullwidth(text) {
  let normalized = "";
  for (const character of text) {
    const code = character.codePointAt(0) ?? 0;
    normalized += code >= 65281 && code <= 65374 ? String.fromCodePoint(code - 65248) : character;
  }
  return normalized;
}
function prefixLengthAt(text, index) {
  for (const prefix of MARKUP_PREFIXES) {
    if (text.startsWith(prefix, index)) return prefix.length;
  }
  const normalized = normalizeFullwidth(text.slice(index, index + 8));
  for (const prefix of ASCII_PREFIXES) {
    if (normalized.startsWith(prefix)) return prefix.length;
  }
  return 0;
}
function isPartialMarker(body) {
  const trimmed = body.trimStart();
  if (trimmed === "") return true;
  const forms = [...MARKUP_PREFIXES, ...ASCII_PREFIXES];
  const candidates = [trimmed, normalizeFullwidth(trimmed.slice(0, 8))];
  return candidates.some((candidate) => candidate !== "" && forms.some((form) => form.startsWith(candidate) && candidate.length < form.length));
}
function readName(text, index) {
  const prefixLength = prefixLengthAt(text, index);
  const marked = prefixLength > 0;
  let position = index + prefixLength;
  while (position < text.length && /\s/.test(text.charAt(position))) position += 1;
  const start = position;
  while (position < text.length && /[\p{L}\p{N}_-]/u.test(text.charAt(position))) position += 1;
  if (position === start) return { name: "", end: index, marked };
  return { name: text.slice(start, position).toLowerCase(), end: position, marked };
}
function scanTag(text, index) {
  if (text.charAt(index) !== "<") return void 0;
  let position = index + 1;
  let closing = false;
  if (text.charAt(position) === "/") {
    closing = true;
    position += 1;
  }
  while (position < text.length && /\s/.test(text.charAt(position))) position += 1;
  const read = readName(text, position);
  if (read.name === "") return void 0;
  const canonical = CANONICAL_TAG_NAMES.get(read.name);
  const name = canonical !== void 0 && !(MARKER_ONLY_TAG_NAMES.has(read.name) && !read.marked) ? canonical : read.name;
  const attributesStart = read.end;
  let selfClosing = false;
  let cursor = read.end;
  while (cursor < text.length) {
    const character = text.charAt(cursor);
    if (character === ">") {
      return { start: index, end: cursor, name, closing, selfClosing, marked: read.marked, attributes: text.slice(attributesStart, cursor).trim() };
    }
    if (character === "/" && text.charAt(cursor + 1) === ">") {
      selfClosing = true;
      return { start: index, end: cursor + 1, name, closing, selfClosing, marked: read.marked, attributes: text.slice(attributesStart, cursor).trim() };
    }
    cursor += 1;
  }
  return void 0;
}
function findTag(text, spans, from) {
  const cursor = { at: 0 };
  let index = Math.max(from, 0);
  while (index < text.length) {
    const skipped = skipIgnored(spans, index, cursor);
    if (skipped !== index) {
      index = skipped;
      continue;
    }
    if (text.charAt(index) === "<") {
      const tag = scanTag(text, index);
      if (tag !== void 0) return tag;
    }
    index += 1;
  }
  return void 0;
}
function findMatchingClose(text, spans, open) {
  let depth = 1;
  let index = open.end + 1;
  while (index < text.length) {
    const tag = findTag(text, spans, index);
    if (tag === void 0) return void 0;
    if (tag.name === open.name) {
      if (tag.closing) {
        depth -= 1;
        if (depth === 0) return tag;
      } else if (!tag.selfClosing) {
        depth += 1;
      }
    }
    index = tag.end + 1;
  }
  return void 0;
}
function findFirstOpener(text, spans) {
  let index = 0;
  while (index < text.length) {
    const tag = findTag(text, spans, index);
    if (tag === void 0) return void 0;
    if (!tag.closing && BLOCK_TAGS.includes(tag.name)) {
      const close = findMatchingClose(text, spans, tag);
      return close === void 0 ? { open: tag } : { open: tag, close };
    }
    index = tag.end + 1;
  }
  return void 0;
}
function decodeEntities(text) {
  if (!text.includes("&")) return text;
  const named = /* @__PURE__ */ new Map([
    ["amp", "&"],
    ["lt", "<"],
    ["gt", ">"],
    ["quot", '"'],
    ["apos", "'"]
  ]);
  return text.replace(/&(#[0-9]+|#x[0-9a-f]+|[a-z]+);/gi, (whole, body) => {
    if (body.startsWith("#")) {
      const hex = body.charAt(1).toLowerCase() === "x";
      const digits = hex ? body.slice(2) : body.slice(1);
      const code = Number.parseInt(digits, hex ? 16 : 10);
      if (!Number.isFinite(code) || code <= 0 || code > 1114111) return whole;
      return String.fromCodePoint(code);
    }
    return named.get(body.toLowerCase()) ?? whole;
  });
}
function parseAttributes(text) {
  const attributes = {};
  const pattern = /([a-z0-9_:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
  let match = pattern.exec(text);
  while (match !== null) {
    const key = match[1];
    const value = match[2] ?? match[3];
    if (key !== void 0 && value !== void 0) attributes[key] = decodeEntities(value);
    match = pattern.exec(text);
  }
  return attributes;
}
function parseParameters(body) {
  const parameters = {};
  const spans = ignoredSpans(body);
  let index = 0;
  while (index < body.length) {
    const tag = findTag(body, spans, index);
    if (tag === void 0) break;
    if (tag.closing || tag.selfClosing) {
      index = tag.end + 1;
      continue;
    }
    const close = findMatchingClose(body, spans, tag);
    if (close === void 0) {
      index = tag.end + 1;
      continue;
    }
    const value = body.slice(tag.end + 1, close.start).trim();
    const attributes = parseAttributes(tag.attributes);
    const explicitName = tag.name === "parameter" ? attributes["name"] : void 0;
    const name = explicitName ?? tag.name;
    if (name !== void 0 && name !== "" && (explicitName !== void 0 || parameters[name] === void 0)) {
      parameters[name] = value.startsWith("<![CDATA[") && value.endsWith("]]>") ? value.slice(9, -3) : nestedOrText(value);
    }
    index = close.end + 1;
  }
  return parameters;
}
function nestedOrText(value) {
  if (!value.includes("<") || !value.includes(">")) return decodeEntities(value);
  const nested = parseParameters(value);
  return Object.keys(nested).length > 0 ? nested : decodeEntities(value);
}
function parseInvoke(open, close, block, gate) {
  const attributes = parseAttributes(open.attributes);
  const declared = attributes["name"];
  if (declared === void 0 || declared === "") return void 0;
  if (!gate.declaredNames.has(declared)) return void 0;
  const pinned = gate.pinnedToolName;
  if (pinned !== void 0 && pinned !== "auto" && pinned !== "required" && pinned !== "none" && pinned !== declared) {
    return void 0;
  }
  const parameters = parseParameters(block.slice(open.end + 1, close.start));
  const required = gate.requiredParameters?.get(declared);
  if (required !== void 0 && required.some((parameter) => parameters[parameter] === void 0)) return void 0;
  return {
    id: `call_${randomUUID().replace(/-/g, "").slice(0, 24)}`,
    name: declared,
    arguments: JSON.stringify(parameters)
  };
}
function parseToolCalls(text, gate) {
  if (gate.declaredNames.size === 0) return [];
  const calls = [];
  let remaining = text;
  while (remaining !== "") {
    const found = findFirstOpener(remaining, ignoredSpans(remaining));
    if (found === void 0 || found.close === void 0) break;
    const block = remaining.slice(found.open.start, found.close.end + 1);
    const spans = ignoredSpans(block);
    let index = 0;
    while (index < block.length) {
      const tag = findTag(block, spans, index);
      if (tag === void 0) break;
      if (!tag.closing && tag.name === "invoke") {
        const close = findMatchingClose(block, spans, tag);
        if (close === void 0) break;
        const call = parseInvoke(tag, close, block, gate);
        if (call !== void 0) calls.push(call);
        index = close.end + 1;
        continue;
      }
      index = tag.end + 1;
    }
    remaining = remaining.slice(found.close.end + 1);
  }
  return calls;
}
function stripMarkup(text) {
  const spans = ignoredSpans(text);
  const cursor = { at: 0 };
  let result = "";
  let index = 0;
  while (index < text.length) {
    const skipped = skipIgnored(spans, index, cursor);
    if (skipped !== index) {
      result += text.slice(index, skipped);
      index = skipped;
      continue;
    }
    const tag = text.charAt(index) === "<" ? scanTag(text, index) : void 0;
    if (tag === void 0 || !tag.marked) {
      result += text.charAt(index);
      index += 1;
      continue;
    }
    const bracketed = !tag.closing && !tag.selfClosing && KEYWORD_TAGS.includes(tag.name);
    const close = bracketed ? findMatchingClose(text, spans, tag) : void 0;
    index = close === void 0 ? tag.end + 1 : close.end + 1;
  }
  return result;
}
function hasProse(text) {
  return stripMarkup(text).trim() !== "";
}
function looksLikeTagStart(tail) {
  if (!tail.startsWith("<")) return false;
  if (tail.includes(">")) return false;
  let body = tail.slice(1);
  if (body.startsWith("/")) body = body.slice(1);
  if (body === "" || isPartialMarker(body)) return true;
  const prefixLength = prefixLengthAt(body, 0);
  if (prefixLength > 0) return true;
  body = body.slice(prefixLength).trim().toLowerCase();
  if (body === "" || isPartialMarker(body)) return true;
  const openers = ["tool", "invoke", "tool_calls", "tool-calls", "toolcalls", "tool_call", "tool-call"];
  return openers.some((opener) => opener.startsWith(body) || body.startsWith(opener));
}
function holdFrom(text, spans) {
  let hold = text.length;
  const lastLt = text.lastIndexOf("<");
  if (lastLt !== -1 && looksLikeTagStart(text.slice(lastLt))) hold = Math.min(hold, lastLt);
  for (const span of spans) {
    if (span.open) hold = Math.min(hold, span.start);
  }
  return hold;
}
var DsmlStreamBuffer = class {
  pending = "";
  gate;
  constructor(gate) {
    this.gate = gate;
  }
  /** Feed one `delta.content` chunk; returns text and any call it completed. */
  add(chunk) {
    this.pending += chunk;
    if (this.gate.declaredNames.size === 0) {
      const text = this.pending;
      this.pending = "";
      return { text, prose: hasProse(text) };
    }
    const parts = [];
    const calls = [];
    for (; ; ) {
      const found = findFirstOpener(this.pending, ignoredSpans(this.pending));
      if (found === void 0) break;
      if (found.open.start > 0) parts.push(this.pending.slice(0, found.open.start));
      if (found.close === void 0) {
        this.pending = this.pending.slice(found.open.start);
        return finish(parts, calls);
      }
      const block = this.pending.slice(found.open.start, found.close.end + 1);
      const blockCalls = parseToolCalls(block, this.gate);
      if (blockCalls.length > 0) calls.push(...blockCalls);
      else parts.push(block);
      this.pending = this.pending.slice(found.close.end + 1);
    }
    const hold = holdFrom(this.pending, ignoredSpans(this.pending));
    if (hold > 0) parts.push(this.pending.slice(0, hold));
    this.pending = this.pending.slice(hold);
    return finish(parts, calls);
  }
  /** End of stream: hand back everything still held. */
  flush() {
    const text = this.pending;
    this.pending = "";
    return { text, prose: hasProse(text) };
  }
};
function finish(parts, calls) {
  const text = parts.join("");
  const outcome = { text, prose: hasProse(text) };
  if (calls.length > 0) outcome.calls = [...calls];
  return outcome;
}

// src/stream.ts
init_upstream();

// src/wire-identity.ts
import { createHash as createHash3, randomBytes } from "node:crypto";
var SALT = randomBytes(16).toString("hex");
function randomId() {
  return randomBytes(16).toString("hex");
}
function stableId(kind, account, ...parts) {
  const hash = createHash3("sha256");
  hash.update(`${SALT}|${kind}|`);
  hash.update(account.uid);
  hash.update("|");
  hash.update(account.enterpriseId ?? "");
  hash.update("|");
  hash.update(account.domain);
  for (const part of parts) {
    hash.update("|");
    hash.update(part);
  }
  return hash.digest("hex").slice(0, 32);
}
function userMessageKey(message) {
  const content = message.content;
  if (typeof content === "string") return content;
  const hash = createHash3("sha256");
  let meaningful = false;
  for (const part of content) {
    if (part.type === "text") {
      meaningful ||= part.text.trim() !== "";
      hash.update("text\0");
      hash.update(part.text);
      hash.update("\0");
      continue;
    }
    meaningful = true;
    hash.update("image\0");
    hash.update(part.mimeType);
    hash.update("\0");
    hash.update(part.data);
    hash.update("\0");
  }
  return meaningful ? `parts:${hash.digest("hex")}` : "";
}
function userTurnKey(message) {
  const content = userMessageKey(message);
  return content === "" ? "" : `${message.timestamp}:${content}`;
}
function deriveWireIdentity(credential, messages, sessionId) {
  const users = messages.filter(
    (message) => message.role === "user" && userMessageKey(message) !== ""
  );
  const firstUser = users[0];
  const lastUser = users.at(-1);
  const conversationKey = sessionId !== void 0 && sessionId.trim() !== "" ? `session:${sessionId}` : firstUser === void 0 ? `anonymous:${randomId()}` : `first-user:${userTurnKey(firstUser)}`;
  const conversationId = stableId("conversation", credential, conversationKey);
  const turnId = lastUser === void 0 ? randomId() : stableId("turn", credential, conversationId, userTurnKey(lastUser));
  const messageId = randomId();
  return {
    conversationId,
    turnId,
    messageId,
    requestId: messageId
  };
}

// src/stream.ts
function bodyText(body) {
  if (typeof body === "string") return body;
  if (body instanceof ArrayBuffer) return new TextDecoder().decode(body);
  if (ArrayBuffer.isView(body)) {
    return new TextDecoder().decode(new Uint8Array(body.buffer, body.byteOffset, body.byteLength));
  }
  throw new Error(`WorkBuddy request body is not JSON text (${Object.prototype.toString.call(body)})`);
}
function usesNativeMessages(model, credential) {
  return model.api === WORKBUDDY_MESSAGES_API || usesMessagesApi(regionOf(credential.domain), model.id);
}
function placeholderMessage(model, errorMessage, aborted) {
  return {
    role: "assistant",
    content: [],
    api: model.api,
    provider: model.provider,
    model: model.id,
    usage: {
      input: 0,
      output: 0,
      cacheRead: 0,
      cacheWrite: 0,
      totalTokens: 0,
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 }
    },
    stopReason: aborted ? "aborted" : "error",
    errorMessage,
    timestamp: Date.now()
  };
}
function createWorkBuddyStream(resolveCredential) {
  return (model, context, options) => {
    const stream = createAssistantMessageEventStream();
    void (async () => {
      try {
        const credential = await resolveCredential();
        const nativeMessages = usesNativeMessages(model, credential);
        const identity = deriveWireIdentity(credential, context.messages, options?.sessionId);
        const headers = workBuddyModelHeaders(credential, identity);
        const base = `${chatBase2(credential)}`;
        const currentTools = getCurrentTools(context.messages);
        const gateNames = new Set(currentTools.map((tool) => tool.name));
        const buffer = !nativeMessages && gateNames.size > 0 ? new DsmlStreamBuffer({
          declaredNames: gateNames,
          requiredParameters: new Map(currentTools.map((tool) => {
            const parameters = tool.parameters;
            return [tool.name, Array.isArray(parameters?.required) ? parameters.required : []];
          })),
          acceptedParameters: new Map(currentTools.map((tool) => {
            const parameters = tool.parameters;
            return [tool.name, new Set(Object.keys(parameters?.properties ?? {}))];
          }))
        }) : void 0;
        const upstream = new WorkBuddyUpstreamClient();
        const innerOptions = {
          ...options,
          apiKey: "workbuddy-managed",
          headers,
          maxRetries: 0,
          timeoutMs: 12e5,
          onPayload: (payload) => {
            if (nativeMessages) return payload;
            const params = payload;
            params["stream"] = true;
            return params;
          },
          fetch: (async (_input, init) => {
            const signal = init?.signal ?? options?.signal;
            const bodyJson = bodyText(init?.body);
            const result = nativeMessages ? await upstream.messagesStream(credential, bodyJson, identity, signal, init?.headers) : await upstream.chatStream(
              credential,
              prepareChatBody(bodyJson),
              identity,
              signal,
              init?.headers
            );
            if (!result.ok) {
              const kind = result.kind ?? "server";
              const status = KIND_STATUS[kind];
              const message = failureMessage(kind, result.status, result.message ?? "");
              const error = new Error(message);
              error.status = status;
              const responseHeaders = new Headers();
              if (kind === "model_queue") responseHeaders.set("x-should-retry", "false");
              error.headers = responseHeaders;
              throw error;
            }
            if (nativeMessages || buffer === void 0 || result.response === void 0) {
              return result.response ?? new Response(null, { status: 200 });
            }
            return transformSse(result.response, buffer);
          })
        };
        const api = nativeMessages ? anthropicMessagesApi() : openAICompletionsApi();
        const inner = api.streamSimple(
          { ...model, baseUrl: nativeMessages ? `${base}/v1` : base },
          context,
          innerOptions
        );
        for await (const event of inner) stream.push(event);
        stream.end();
      } catch (error) {
        stream.push({
          type: "error",
          reason: options?.signal?.aborted ? "aborted" : "error",
          error: placeholderMessage(model, error instanceof Error ? error.message : String(error), options?.signal?.aborted === true)
        });
        stream.end();
      }
    })();
    return stream;
  };
}
function transformSse(response, buffer) {
  const decoder = new TextDecoder();
  let carry = "";
  const reader = response.body.getReader();
  const textStream = new ReadableStream({
    async pull(controller) {
      try {
        const { done, value } = await reader.read();
        if (done) {
          const flushed = buffer.flush();
          if (flushed.text !== "") {
            controller.enqueue(encodeFrame(contentDeltaFrame(flushed.text)));
          }
          controller.enqueue(ENCODER.encode("data: [DONE]\n\n"));
          controller.close();
          return;
        }
        carry += decoder.decode(value, { stream: true });
        let newline;
        while ((newline = carry.indexOf("\n\n")) !== -1) {
          const frame = carry.slice(0, newline + 2);
          carry = carry.slice(newline + 2);
          for (const rewritten of processFrame(frame, buffer)) {
            controller.enqueue(encodeFrame(rewritten));
          }
        }
      } catch (error) {
        controller.error(error);
      }
    },
    cancel(reason) {
      return reader.cancel(reason);
    }
  });
  return new Response(textStream, {
    status: response.status,
    headers: response.headers
  });
}
var ENCODER = new TextEncoder();
function encodeFrame(frame) {
  return ENCODER.encode(frame.endsWith("\n\n") ? frame : frame.endsWith("\n") ? `${frame}
` : `${frame}

`);
}
function contentDeltaFrame(text) {
  const chunk = {
    choices: [{ index: 0, delta: { content: text }, finish_reason: null }]
  };
  return `data: ${JSON.stringify(chunk)}

`;
}
function processFrame(frame, buffer) {
  if (!frame.startsWith("data:")) return [frame];
  const payload = frame.slice(5).trim();
  if (payload === "" || payload === "[DONE]") return [frame];
  let parsed;
  try {
    parsed = JSON.parse(payload);
  } catch {
    return [frame];
  }
  if (typeof parsed !== "object" || parsed === null) return [frame];
  const chunk = parsed;
  const choices = chunk["choices"];
  if (!Array.isArray(choices) || choices.length === 0) return [frame];
  const choice = choices[0];
  const delta = typeof choice["delta"] === "object" && choice["delta"] !== null ? choice["delta"] : void 0;
  if (delta === void 0) return [frame];
  const content = delta["content"];
  if (typeof content !== "string" || content === "") {
    return [frame];
  }
  const outcome = buffer.add(content);
  delta["content"] = outcome.text;
  if (outcome.calls !== void 0 && outcome.calls.length > 0) {
    const toolCalls = outcome.calls.map((call, index) => ({
      index,
      id: call.id,
      type: "function",
      function: { name: call.name, arguments: call.arguments }
    }));
    delta["tool_calls"] = toolCalls;
  }
  return [`data: ${JSON.stringify(chunk)}

`];
}

// src/oauth.ts
init_upstream();
import { randomUUID as randomUUID2 } from "node:crypto";
var CN_BILLING_BASE2 = "https://www.codebuddy.cn";
var GLOBAL_BILLING_BASE = "https://www.workbuddy.ai";
var API_PREFIX = "/v2/plugin";
var OAUTH_LOGIN_TIMEOUT_SECONDS = 600;
function oauthBillingBase(region, explicitBase) {
  if (region === "cn") return CN_BILLING_BASE2;
  const trimmed = explicitBase?.trim();
  if (trimmed !== void 0 && trimmed !== "") return trimmed.replace(/\/+$/, "");
  return GLOBAL_BILLING_BASE;
}
var sessions = /* @__PURE__ */ new Map();
async function readJson(response) {
  try {
    const parsed = JSON.parse(await response.text());
    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
  }
  return void 0;
}
function envelopeData2(document) {
  const data = document["data"];
  return typeof data === "object" && data !== null && !Array.isArray(data) ? data : {};
}
function firstString(source, keys) {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim() !== "") return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }
  return "";
}
function optionalString(source, keys) {
  const value = firstString(source, keys);
  return value === "" ? void 0 : value;
}
function expiryMs(source, absoluteKeys, ttlKeys) {
  for (const key of absoluteKeys) {
    const value = source[key];
    if (typeof value === "number" && value > 0) return value > 1e12 ? value : value * 1e3;
    if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value))) {
      const parsed = Number(value);
      return parsed > 1e12 ? parsed : parsed * 1e3;
    }
  }
  for (const key of ttlKeys) {
    const value = source[key];
    if (typeof value === "number" && value > 0) return Date.now() + value * 1e3;
  }
  return void 0;
}
async function oauthStart(region, options) {
  const base = oauthBillingBase(region, options?.base);
  let response;
  try {
    response = await fetch(`${base}${API_PREFIX}/auth/state?platform=workbuddy`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: "{}",
      signal: AbortSignal.timeout(3e4)
    });
  } catch (error) {
    return { error: `could not reach ${base} to start the sign-in (${error instanceof Error ? error.message : String(error)})` };
  }
  const document = await readJson(response);
  if (document === void 0) {
    return { error: `the sign-in service answered with a non-JSON body (http ${response.status})` };
  }
  const data = envelopeData2(document);
  const state = firstString(data, ["state", "State"]);
  if (state === "") {
    return { error: `the sign-in service did not issue a state (http ${response.status})` };
  }
  const authUrl = firstString(data, ["authUrl", "auth_url", "url", "Url"]) || `${base}/login?state=${encodeURIComponent(state)}`;
  const loginId = `wbo_${randomUUID2().replaceAll("-", "")}`;
  sessions.set(loginId, {
    region,
    base,
    state,
    expiresAtMs: Date.now() + OAUTH_LOGIN_TIMEOUT_SECONDS * 1e3,
    done: false
  });
  return { loginId, verificationUri: authUrl, expiresIn: OAUTH_LOGIN_TIMEOUT_SECONDS };
}
async function oauthPoll(loginId, region) {
  const session = sessions.get(loginId);
  if (session === void 0) return { done: true, error: "sign-in session not found; start a new one" };
  if (session.region !== region) return { done: true, error: "sign-in session belongs to another region" };
  if (session.done) return terminalOf(session);
  if (Date.now() > session.expiresAtMs) {
    sessions.delete(loginId);
    return { done: true, error: "the sign-in timed out; start again" };
  }
  let response;
  try {
    response = await fetch(`${session.base}${API_PREFIX}/auth/token?state=${encodeURIComponent(session.state)}`, {
      method: "GET",
      headers: { "Accept": "application/json" },
      signal: AbortSignal.timeout(3e4)
    });
  } catch {
    return { done: false };
  }
  const document = await readJson(response);
  if (document === void 0) return { done: false };
  const code = typeof document["code"] === "number" ? document["code"] : -1;
  if (code !== 0 && code !== 200) return { done: false };
  const data = envelopeData2(document);
  const accessToken = firstString(data, ["accessToken", "access_token", "AccessToken"]);
  if (accessToken === "") return { done: false };
  session.done = true;
  try {
    const account = await collectAccount(session, accessToken, data);
    sessions.delete(loginId);
    return { done: true, account };
  } catch (error) {
    sessions.delete(loginId);
    return { done: true, error: error instanceof Error ? error.message : String(error) };
  }
}
function terminalOf(session) {
  if (session.result !== void 0) return { done: true, account: session.result };
  return { done: true, error: session.error ?? "the sign-in ended without a result" };
}
async function collectAccount(session, accessToken, tokenData) {
  const headers = { "Authorization": `Bearer ${accessToken}`, "Accept": "application/json" };
  const domain = firstString(tokenData, ["domain", "Domain"]);
  if (domain !== "") headers["X-Domain"] = domain;
  let profile = {};
  try {
    const response = await fetch(`${session.base}${API_PREFIX}/login/account`, {
      method: "GET",
      headers,
      signal: AbortSignal.timeout(3e4)
    });
    const document = await readJson(response);
    if (document !== void 0) profile = envelopeData2(document);
  } catch {
  }
  const refresh = firstString(tokenData, ["refreshToken", "refresh_token", "RefreshToken"]);
  return {
    accessToken,
    refreshToken: refresh,
    expiresAtMs: expiryMs(tokenData, ["expiresAt", "expires_at"], ["expiresIn", "expires_in"]) ?? 0,
    // The token's own domain comes first: it decides which gateway accepts
    // this credential. The profile echo is only a fallback.
    domain: domain !== "" ? domain : firstString(profile, ["domain", "Domain"]),
    uid: firstString(profile, ["uid", "Uid", "userId", "UserID"]),
    ...optionalString(profile, ["nickname", "NickName", "ScreenName"]) === void 0 ? {} : { nickname: optionalString(profile, ["nickname", "NickName", "ScreenName"]) },
    ...optionalString(profile, ["uin", "Uin"]) === void 0 ? {} : { uin: optionalString(profile, ["uin", "Uin"]) },
    ...optionalString(profile, ["enterpriseId", "EnterpriseId"]) === void 0 ? {} : { enterpriseId: optionalString(profile, ["enterpriseId", "EnterpriseId"]) }
  };
}
function regionOfOAuthAccount(account) {
  return regionOf(account.domain);
}

// src/index.ts
init_upstream();

// src/checkin.ts
init_auth();
init_upstream();
import { existsSync as existsSync3, mkdirSync as mkdirSync2, readFileSync as readFileSync3, renameSync as renameSync2, writeFileSync as writeFileSync2 } from "node:fs";
import { join as join3 } from "node:path";
var CHECKIN_ALREADY = 1001;
var CHECKIN_INELIGIBLE = 1002;
var CHECKIN_ENDED = 1003;
var WorkBuddyCheckinError = class extends Error {
  constructor(message, code, httpStatus) {
    super(message);
    this.code = code;
    this.httpStatus = httpStatus;
    this.name = "WorkBuddyCheckinError";
  }
  code;
  httpStatus;
  /** A 401 — the sign-in, not the campaign, is what refused us. */
  get unauthorized() {
    return this.httpStatus === 401;
  }
};
function billingHeaders(credential) {
  return {
    "Authorization": `Bearer ${credential.accessToken}`,
    "Accept": "application/json",
    "Content-Type": "application/json",
    "User-Agent": CLIENT_UA,
    ...credential.uid === "" ? {} : { "X-User-Id": credential.uid },
    ...credential.enterpriseId === void 0 || credential.enterpriseId === "" ? {} : { "X-Enterprise-Id": credential.enterpriseId, "X-Tenant-Id": credential.enterpriseId },
    ...credential.domain === "" ? {} : { "X-Domain": credential.domain }
  };
}
async function billingPost(credential, path, body = {}, signal) {
  const timeout = signal ?? AbortSignal.timeout(JSON_TIMEOUT_MS);
  const response = await fetch(`${CN_BILLING_BASE}${path}`, {
    method: "POST",
    headers: billingHeaders(credential),
    body: JSON.stringify(body),
    signal: timeout
  });
  const text = await response.text();
  let envelope;
  try {
    const parsed = JSON.parse(text);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) throw new Error("not an object");
    envelope = parsed;
  } catch {
    throw new WorkBuddyCheckinError(
      `\u7B7E\u5230\u63A5\u53E3\u8FD4\u56DE\u4E86\u975E JSON \u54CD\u5E94\uFF08http ${response.status}\uFF09\uFF1A${text.slice(0, 160)}`,
      0,
      response.status
    );
  }
  const code = typeof envelope["code"] === "number" ? envelope["code"] : 0;
  const data = typeof envelope["data"] === "object" && envelope["data"] !== null && !Array.isArray(envelope["data"]) ? envelope["data"] : {};
  const message = typeof envelope["msg"] === "string" ? envelope["msg"] : typeof envelope["message"] === "string" ? envelope["message"] : void 0;
  return {
    httpStatus: response.status,
    code,
    ...message === void 0 || message === "" ? {} : { message },
    data
  };
}
function expectOk(answer, what) {
  if (answer.httpStatus === 401) {
    throw new WorkBuddyCheckinError(
      `${what}\u88AB\u4E0A\u6E38\u62D2\u7EDD\uFF08http 401\uFF0C${answer.message ?? "\u4F1A\u8BDD\u5DF2\u5931\u6548"}\uFF09\u3002\u8BF7\u5728 WorkBuddy \u684C\u9762\u7AEF\u91CD\u65B0\u767B\u5F55\uFF0C\u6216\u8FD0\u884C /login workbuddy \u91CD\u65B0\u626B\u7801`,
      answer.code,
      401
    );
  }
  if (!answer.httpStatus || answer.httpStatus >= 400 || answer.code !== 0) {
    const detail = answer.message === void 0 ? `code=${answer.code}` : `code=${answer.code} ${answer.message}`;
    throw new WorkBuddyCheckinError(`${what}\u5931\u8D25\uFF08http ${answer.httpStatus}\uFF09\uFF1A${detail}`, answer.code, answer.httpStatus);
  }
  return answer;
}
function boolOf(source, ...keys) {
  for (const key of keys) {
    if (!(key in source)) continue;
    const value = source[key];
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value !== 0;
    if (typeof value === "string") return value === "true" || value === "1";
  }
  return false;
}
function intOf(source, ...keys) {
  for (const key of keys) {
    if (!(key in source)) continue;
    const value = source[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value))) return Number(value);
  }
  return void 0;
}
function strOf(source, ...keys) {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value !== "") return value;
  }
  return void 0;
}
function optional(key, value) {
  return value === void 0 ? {} : { [key]: value };
}
function parseCheckinStatus(data) {
  return {
    active: boolOf(data, "active", "Active"),
    todayCheckedIn: boolOf(data, "today_checked_in", "todayCheckedIn"),
    ...optional("streakDays", intOf(data, "streak_days", "streakDays")),
    ...optional("dailyCredit", intOf(data, "daily_credit", "dailyCredit")),
    ...optional("todayCredit", intOf(data, "today_credit", "todayCredit")),
    ...optional("totalCredits", intOf(data, "total_credits", "totalCredits")),
    ...optional("weekCheckinDays", intOf(data, "week_checkin_days", "weekCheckinDays")),
    ...optional("activityName", strOf(data, "activity_name", "activityName"))
  };
}
function parseCheckinClaim(data) {
  return {
    ...optional("credit", intOf(data, "credit", "Credit")),
    ...optional("streakDays", intOf(data, "streak_days", "streakDays")),
    ...optional("isStreakDay", "is_streak_day" in data || "isStreakDay" in data ? boolOf(data, "is_streak_day", "isStreakDay") : void 0),
    ...optional("creditDelayed", "credit_delayed" in data || "creditDelayed" in data ? boolOf(data, "credit_delayed", "creditDelayed") : void 0),
    ...optional("message", strOf(data, "message", "Message"))
  };
}
async function fetchCheckinStatus(credential, signal) {
  let lastError;
  for (const path of CHECKIN_STATUS_PATHS) {
    try {
      const answer = expectOk(await billingPost(credential, path, {}, signal), "\u67E5\u8BE2\u7B7E\u5230\u72B6\u6001");
      return parseCheckinStatus(answer.data);
    } catch (error) {
      lastError = error;
      if (error instanceof WorkBuddyCheckinError && error.unauthorized) throw error;
    }
  }
  throw lastError instanceof Error ? lastError : new WorkBuddyCheckinError("\u67E5\u8BE2\u7B7E\u5230\u72B6\u6001\u5931\u8D25", 0, 0);
}
async function claimDailyCheckin(credential, signal) {
  const answer = await billingPost(credential, DAILY_CHECKIN_PATH, {}, signal);
  if (answer.httpStatus === 401) {
    throw new WorkBuddyCheckinError(
      `\u7B7E\u5230\u8BF7\u6C42\u88AB\u4E0A\u6E38\u62D2\u7EDD\uFF08http 401\uFF0C${answer.message ?? "\u4F1A\u8BDD\u5DF2\u5931\u6548"}\uFF09\u3002\u8BF7\u5728 WorkBuddy \u684C\u9762\u7AEF\u91CD\u65B0\u767B\u5F55\uFF0C\u6216\u8FD0\u884C /login workbuddy \u91CD\u65B0\u626B\u7801`,
      answer.code,
      401
    );
  }
  if (answer.httpStatus >= 400) {
    throw new WorkBuddyCheckinError(
      `\u7B7E\u5230\u5931\u8D25\uFF08http ${answer.httpStatus}\uFF09\uFF1A${answer.message ?? `code=${answer.code}`}`,
      answer.code,
      answer.httpStatus
    );
  }
  if (answer.code !== 0) {
    return {
      claimed: false,
      code: answer.code,
      ...answer.message === void 0 ? {} : { message: answer.message }
    };
  }
  return { claimed: true, claim: parseCheckinClaim(answer.data), code: 0 };
}
function streakText(streakDays) {
  return streakDays === void 0 ? "" : `\uFF08\u8FDE\u7B7E ${streakDays} \u5929\uFF09`;
}
async function runDailyCheckin(credential, signal) {
  const status = await fetchCheckinStatus(credential, signal);
  if (!status.active) {
    return {
      outcome: "inactive",
      status,
      message: "\u5F53\u524D\u6CA1\u6709\u8FDB\u884C\u4E2D\u7684\u7B7E\u5230\u6D3B\u52A8\uFF08\u6216\u6D3B\u52A8\u5DF2\u7ED3\u675F\uFF09\uFF0C\u4ECA\u5929\u6CA1\u6709\u53EF\u9886\u53D6\u7684\u79EF\u5206"
    };
  }
  if (status.todayCheckedIn) {
    return {
      outcome: "done",
      status,
      ...optional("credit", status.todayCredit),
      ...optional("streakDays", status.streakDays),
      message: `\u4ECA\u5929\u5DF2\u7ECF\u7B7E\u5230\u8FC7\u4E86${streakText(status.streakDays)}` + (status.todayCredit === void 0 ? "" : `\uFF0C\u4ECA\u65E5\u83B7\u5F97 ${status.todayCredit} \u79EF\u5206`)
    };
  }
  const claimed = await claimDailyCheckin(credential, signal);
  const credit = claimed.claim?.credit ?? status.dailyCredit;
  const streakDays = claimed.claim?.streakDays ?? status.streakDays;
  if (claimed.claimed) {
    const delayed = claimed.claim?.creditDelayed === true ? "\uFF08\u4E0A\u6E38\u63D0\u793A\u79EF\u5206\u7A0D\u540E\u5230\u8D26\uFF09" : "";
    return {
      outcome: "claimed",
      status,
      ...claimed.claim === void 0 ? {} : { claim: claimed.claim },
      ...optional("credit", credit),
      ...optional("streakDays", streakDays),
      message: `\u7B7E\u5230\u6210\u529F\uFF0C\u4ECA\u65E5\u83B7\u5F97 ${credit === void 0 ? "\uFF08\u4E0A\u6E38\u672A\u8BF4\u660E\uFF09" : credit} \u79EF\u5206${streakText(streakDays)}${delayed}`
    };
  }
  const detail = claimed.message === void 0 ? `code=${claimed.code}` : claimed.message;
  switch (claimed.code) {
    case CHECKIN_ALREADY:
      return {
        outcome: "done",
        status,
        ...optional("credit", credit),
        ...optional("streakDays", streakDays),
        message: `\u4ECA\u5929\u5DF2\u7ECF\u7B7E\u5230\u8FC7\u4E86${streakText(streakDays)}\uFF08\u4E0A\u6E38 code ${claimed.code}\uFF09`
      };
    case CHECKIN_INELIGIBLE:
      return {
        outcome: "ineligible",
        status,
        message: `\u8BE5\u8D26\u53F7\u4E0D\u80FD\u53C2\u4E0E\u672C\u6B21\u7B7E\u5230\u6D3B\u52A8\uFF1A${detail}`
      };
    case CHECKIN_ENDED:
      return { outcome: "inactive", status, message: `\u7B7E\u5230\u6D3B\u52A8\u5DF2\u7ED3\u675F\uFF1A${detail}` };
    default:
      return { outcome: "failed", status, message: `\u7B7E\u5230\u5931\u8D25\uFF1A${detail}` };
  }
}
function beijingDay(at = Date.now()) {
  return new Date(at + 8 * 3600 * 1e3).toISOString().slice(0, 10);
}
function checkinRecordPath() {
  return join3(pluginDataDir(), "workbuddy-checkin.json");
}
function recordKey(region, credential) {
  return `${region}|${workbuddyAccountId(credential)}`;
}
function readRecords() {
  const path = checkinRecordPath();
  if (!existsSync3(path)) return {};
  try {
    const parsed = JSON.parse(readFileSync3(path, "utf8"));
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return {};
    return parsed;
  } catch {
    return {};
  }
}
function saveCheckinRecord(region, credential, record) {
  const file = readRecords();
  file[recordKey(region, credential)] = record;
  const path = checkinRecordPath();
  try {
    mkdirSync2(join3(path, ".."), { recursive: true });
  } catch {
    return;
  }
  const tmp = `${path}.tmp`;
  try {
    writeFileSync2(tmp, JSON.stringify(file, null, 2), "utf8");
    renameSync2(tmp, path);
  } catch {
  }
}
function readCheckinRecord(region, credential) {
  return readRecords()[recordKey(region, credential)];
}
function recordCheckedIn(record, day) {
  return record !== void 0 && record.day === day && (record.outcome === "claimed" || record.outcome === "done");
}
async function describeCheckinToday(region, credential, signal) {
  const day = beijingDay();
  const recorded = readCheckinRecord(region, credential);
  try {
    const status = await fetchCheckinStatus(credential, signal);
    if (!status.active) {
      return recordCheckedIn(recorded, day) ? `\u4ECA\u65E5\u7B7E\u5230: \u5F53\u524D\u6CA1\u6709\u8FDB\u884C\u4E2D\u7684\u7B7E\u5230\u6D3B\u52A8\uFF08\u672C\u5730\u8BB0\u5F55\u663E\u793A\u4ECA\u65E5\u5DF2\u7B7E\u5230\uFF1A${recorded?.message ?? "\u5DF2\u7B7E\u5230"}\uFF09` : "\u4ECA\u65E5\u7B7E\u5230: \u5F53\u524D\u6CA1\u6709\u8FDB\u884C\u4E2D\u7684\u7B7E\u5230\u6D3B\u52A8";
    }
    if (status.todayCheckedIn) {
      const gained = status.todayCredit === void 0 ? "" : `\uFF0C\u4ECA\u65E5 +${status.todayCredit} \u79EF\u5206`;
      const streak = status.streakDays === void 0 ? "" : `\uFF0C\u8FDE\u7B7E ${status.streakDays} \u5929`;
      return `\u4ECA\u65E5\u7B7E\u5230: \u5DF2\u7B7E\u5230\uFF08${day}${gained}${streak}\uFF09`;
    }
    return "\u4ECA\u65E5\u7B7E\u5230: \u672A\u7B7E\u5230\uFF08\u8FD0\u884C /workbuddy.sign \u9886\u53D6\u4ECA\u65E5\u79EF\u5206\uFF09";
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    if (recordCheckedIn(recorded, day)) {
      return `\u4ECA\u65E5\u7B7E\u5230: \u5DF2\u7B7E\u5230\uFF08\u672C\u5730\u8BB0\u5F55\uFF1A${recorded?.message ?? "\u5DF2\u7B7E\u5230"}\uFF1B\u4E0A\u6E38\u72B6\u6001\u67E5\u8BE2\u5931\u8D25\uFF1A${detail}\uFF09`;
    }
    return `\u4ECA\u65E5\u7B7E\u5230: \u65E0\u6CD5\u786E\u8BA4\uFF08\u4E0A\u6E38\u72B6\u6001\u67E5\u8BE2\u5931\u8D25\uFF1A${detail}\uFF09`;
  }
}

// src/index.ts
var PROVIDER_IDS = {
  cn: "workbuddy",
  global: "workbuddy-global"
};
var PROVIDER_NAMES = {
  cn: "WorkBuddy (CN)",
  global: "WorkBuddy AI (Global)"
};
var REGIONS = ["cn", "global"];
var stores = /* @__PURE__ */ new Map();
var catalogs = /* @__PURE__ */ new Map();
var catalogFetchedAt = /* @__PURE__ */ new Map();
var CATALOG_REFRESH_MS = 10 * 60 * 1e3;
function storeFor(region) {
  let store = stores.get(region);
  if (store === void 0) {
    store = new WorkBuddyCredentialStore(region, (message) => console.warn(`[pi-provider-workbuddy] ${message}`));
    stores.set(region, store);
  }
  return store;
}
function workBuddyDisplayName(info) {
  return info.creditMultiplier === void 0 ? info.name : `${info.name} \xB7 x${info.creditMultiplier.toFixed(2)}`;
}
function thinkingLevelMapFor(info) {
  const supported = info.reasoning?.supportedEfforts?.filter((effort) => ["off", "minimal", "low", "medium", "high", "xhigh", "max"].includes(effort));
  if (supported === void 0 || supported.length === 0) return void 0;
  const map = {};
  for (const level of ["minimal", "low", "medium", "high", "xhigh", "max"]) {
    map[level] = supported.includes(level) ? level : null;
  }
  map["off"] = info.reasoning?.canDisableThinking === true && !REFUSES_OFF_MODEL_IDS.has(info.id) ? "off" : null;
  return map;
}
function toModelConfigs(region, models) {
  return models.map((info) => {
    const image = nativeImageInput(info.id);
    const thinkingLevelMap = thinkingLevelMapFor(info);
    const api = apiForModel(region, info.id);
    return {
      id: info.id,
      name: workBuddyDisplayName(info),
      api,
      reasoning: thinkingLevelMap !== void 0,
      ...thinkingLevelMap === void 0 ? {} : { thinkingLevelMap },
      input: image === true ? ["text", "image"] : ["text"],
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
      contextWindow: info.contextWindow,
      maxTokens: info.maxTokens,
      ...api === WORKBUDDY_CHAT_API ? {
        compat: {
          // The gateways reject the `developer` role (11128) and count
          // `reasoning_effort` from the model's own ladder only.
          supportsDeveloperRole: false,
          supportsReasoningEffort: thinkingLevelMap !== void 0,
          maxTokensField: "max_tokens",
          supportsStore: false
        }
      } : {}
    };
  });
}
async function fetchCatalog(region, force = false) {
  const fetchedAt = catalogFetchedAt.get(region) ?? 0;
  const cached = catalogs.get(region);
  if (!force && cached !== void 0 && Date.now() - fetchedAt < CATALOG_REFRESH_MS) return cached;
  const store = storeFor(region);
  try {
    const credential = await store.resolve();
    const client = new WorkBuddyUpstreamClient();
    const models = await client.fetchModels(credential);
    if (models.length > 0) {
      catalogs.set(region, models);
      catalogFetchedAt.set(region, Date.now());
      return models;
    }
  } catch (error) {
    console.warn(
      `[pi-provider-workbuddy] ${region} catalog refresh failed:`,
      error instanceof Error ? error.message : error
    );
  }
  if (cached !== void 0) return cached;
  const { fallbackModelsFor: fallbackModelsFor2 } = await Promise.resolve().then(() => (init_catalog(), catalog_exports));
  const fallback = fallbackModelsFor2(region);
  catalogs.set(region, fallback);
  catalogFetchedAt.set(region, Date.now());
  return fallback;
}
async function index_default(pi) {
  const streamFor = (region) => createWorkBuddyStream(async () => storeFor(region).resolve());
  const registerRegion = (region, models) => {
    pi.registerProvider(PROVIDER_IDS[region], {
      name: PROVIDER_NAMES[region],
      baseUrl: region === "cn" ? CN_CHAT_BASE : GLOBAL_BASE,
      api: WORKBUDDY_CHAT_API,
      models: toModelConfigs(region, models),
      oauth: {
        name: PROVIDER_NAMES[region],
        async login(callbacks) {
          const region2 = region;
          const started = await oauthStart(region2);
          if ("error" in started) throw new Error(started.error);
          callbacks.onAuth({
            url: started.verificationUri,
            instructions: "\u5728\u6D4F\u89C8\u5668\u4E2D\u6253\u5F00\u8BE5\u94FE\u63A5\u5E76\u767B\u5F55 WorkBuddy\uFF08\u56FD\u5185\u7248\u626B\u7801\uFF0C\u56FD\u9645\u7248\u7F51\u9875\u767B\u5F55\uFF09\uFF0C\u5B8C\u6210\u540E\u6B64\u5904\u4F1A\u81EA\u52A8\u7EE7\u7EED"
          });
          callbacks.onProgress?.("\u7B49\u5F85\u4F60\u5728\u6D4F\u89C8\u5668\u4E2D\u5B8C\u6210\u767B\u5F55\u2026");
          const deadline = Date.now() + started.expiresIn * 1e3;
          while (Date.now() < deadline) {
            if (callbacks.signal?.aborted) throw new Error("\u767B\u5F55\u5DF2\u53D6\u6D88");
            await new Promise((resolve) => setTimeout(resolve, 2e3));
            const polled = await oauthPoll(started.loginId, region2);
            if (!polled.done) continue;
            if ("error" in polled) throw new Error(polled.error);
            const account = polled.account;
            const credentialRegion = regionOfOAuthAccount(account);
            if (credentialRegion !== region2) {
              throw new Error(`\u8BE5\u8D26\u53F7\u5C5E\u4E8E${credentialRegion === "global" ? "\u56FD\u9645\u7248" : "\u56FD\u5185\u7248"}\uFF0C\u8BF7\u4F7F\u7528\u5BF9\u5E94\u7684 /login \u5165\u53E3`);
            }
            const store = storeFor(region2);
            store.acceptOAuthCredential({
              accessToken: account.accessToken,
              refreshToken: account.refreshToken,
              expiresAtMs: account.expiresAtMs,
              domain: account.domain,
              uid: account.uid,
              ...account.nickname === void 0 ? {} : { nickname: account.nickname },
              ...account.uin === void 0 ? {} : { uin: account.uin },
              ...account.enterpriseId === void 0 ? {} : { enterpriseId: account.enterpriseId },
              source: "oauth",
              filePath: "(oauth)"
            });
            const models2 = await fetchCatalog(region2, true);
            pi.registerProvider(PROVIDER_IDS[region2], {
              name: PROVIDER_NAMES[region2],
              baseUrl: region2 === "cn" ? CN_CHAT_BASE : GLOBAL_BASE,
              api: WORKBUDDY_CHAT_API,
              models: toModelConfigs(region2, models2)
            });
            return {
              refresh: account.refreshToken,
              access: account.accessToken,
              expires: account.expiresAtMs,
              domain: account.domain,
              uid: account.uid
            };
          }
          throw new Error("\u767B\u5F55\u8D85\u65F6\uFF0C\u8BF7\u91CD\u8BD5");
        },
        async refreshToken(credentials, signal) {
          const store = storeFor(region);
          store.invalidate();
          const credential = await store.resolve();
          void signal;
          return {
            refresh: credential.refreshToken || credentials.refresh,
            access: credential.accessToken,
            expires: credential.expiresAtMs || Date.now() + 3600 * 1e3,
            domain: credential.domain,
            uid: credential.uid
          };
        },
        getApiKey: (credentials) => credentials.access
      },
      streamSimple: streamFor(region)
    });
  };
  for (const region of REGIONS) {
    const store = storeFor(region);
    try {
      const status = await store.status();
      if (status.signedIn) {
        const models = await fetchCatalog(region, true);
        registerRegion(region, models);
      } else {
        const { fallbackModelsFor: fallbackModelsFor2 } = await Promise.resolve().then(() => (init_catalog(), catalog_exports));
        registerRegion(region, fallbackModelsFor2(region).slice(0, 3));
      }
    } catch (error) {
      console.warn(
        `[pi-provider-workbuddy] ${region} startup failed:`,
        error instanceof Error ? error.message : error
      );
    }
  }
  try {
    const compat = await import("@earendil-works/pi-ai/compat");
    const register = compat.registerApiProvider;
    if (typeof register === "function") {
      for (const api of [WORKBUDDY_CHAT_API, WORKBUDDY_MESSAGES_API]) {
        register(
          {
            api,
            stream: (model, context, options) => {
              const region = providerRegionOf(model);
              return streamFor(region)(model, context, options);
            },
            streamSimple: (model, context, options) => {
              const region = providerRegionOf(model);
              return streamFor(region)(model, context, options);
            }
          },
          "provider:workbuddy"
        );
      }
    }
  } catch (error) {
    console.warn("[pi-provider-workbuddy] api registration failed:", error instanceof Error ? error.message : error);
  }
  pi.registerCommand("workbuddy.status", {
    description: "Show WorkBuddy sign-in status and credit balance for both regions",
    handler: async (_args, ctx) => {
      const lines = [];
      for (const region of REGIONS) {
        const store = storeFor(region);
        const status = await store.status();
        const label = PROVIDER_NAMES[region];
        if (!status.signedIn) {
          lines.push(`${label}: \u672A\u767B\u5F55\uFF08\u8FD0\u884C /login ${PROVIDER_IDS[region]} \u767B\u5F55\uFF09`);
          for (const candidate of status.candidates) {
            lines.push(`  \xB7 ${candidate.path}: ${candidate.reason}`);
          }
          continue;
        }
        lines.push(`${label}: ${status.label ?? "\u5DF2\u767B\u5F55"}\uFF08\u6765\u6E90 ${status.source}\uFF09`);
        if (status.expiresAtMs !== void 0 && status.expiresAtMs > 0) {
          const minutes = Math.round((status.expiresAtMs - Date.now()) / 6e4);
          lines.push(`  token ${minutes >= 0 ? `${minutes} \u5206\u949F\u540E\u8FC7\u671F` : "\u5DF2\u8FC7\u671F\uFF0C\u5C06\u5728\u4E0B\u6B21\u8BF7\u6C42\u65F6\u5237\u65B0"}`);
        }
        let credential;
        try {
          credential = await store.resolve();
          const client = new WorkBuddyUpstreamClient();
          const credits = await client.fetchCredits(credential);
          if (credits.total !== void 0) lines.push(`  \u79EF\u5206\u4F59\u989D: ${credits.total}`);
        } catch (error) {
          lines.push(`  \u79EF\u5206\u67E5\u8BE2\u5931\u8D25: ${error instanceof Error ? error.message : String(error)}`);
        }
        if (region === "cn" && credential !== void 0) {
          lines.push(`  ${await describeCheckinToday(region, credential)}`);
        }
      }
      await ctx.ui.notify(lines.join("\n"), "info");
    }
  });
  pi.registerCommand("workbuddy.sign", {
    description: "WorkBuddy\uFF08\u56FD\u5185\u7248\uFF09\u6BCF\u65E5\u7B7E\u5230\uFF0C\u9886\u53D6\u4ECA\u65E5\u79EF\u5206\uFF1B\u5DF2\u7B7E\u5230\u4F1A\u5982\u5B9E\u8BF4\u660E",
    handler: async (args, ctx) => {
      const target = args.trim().toLowerCase();
      if (target === "global") {
        await ctx.ui.notify("\u56FD\u9645\u7248\u6CA1\u6709\u6BCF\u65E5\u7B7E\u5230\u6D3B\u52A8\uFF0C\u65E0\u9700\u7B7E\u5230\uFF08\u79EF\u5206\u6765\u81EA\u5957\u9910\u4E0E\u4E00\u6B21\u6027 trial\uFF09", "warning");
        return;
      }
      if (target !== "" && target !== "cn") {
        await ctx.ui.notify("\u7528\u6CD5\uFF1A/workbuddy.sign [cn]\uFF08\u76EE\u524D\u53EA\u6709\u56FD\u5185\u7248\u6709\u7B7E\u5230\u6D3B\u52A8\uFF09", "warning");
        return;
      }
      const store = storeFor("cn");
      const status = await store.status();
      if (!status.signedIn) {
        await ctx.ui.notify(`${PROVIDER_NAMES["cn"]}: \u672A\u767B\u5F55\uFF0C\u8BF7\u5148\u8FD0\u884C /login ${PROVIDER_IDS["cn"]}`, "warning");
        return;
      }
      try {
        const credential = await store.resolve();
        const day = beijingDay();
        const result = await runDailyCheckin(credential);
        if (result.outcome !== "failed") {
          saveCheckinRecord("cn", credential, {
            day,
            at: Date.now(),
            outcome: result.outcome,
            ...result.credit === void 0 ? {} : { credit: result.credit },
            ...result.streakDays === void 0 ? {} : { streakDays: result.streakDays },
            ...result.message === "" ? {} : { message: result.message }
          });
        }
        await ctx.ui.notify(
          `WorkBuddy (CN) \u7B7E\u5230\uFF08\u5317\u4EAC\u65F6\u95F4 ${day}\uFF09\uFF1A${result.message}`,
          result.outcome === "failed" ? "error" : "info"
        );
      } catch (error) {
        await ctx.ui.notify(
          `WorkBuddy (CN) \u7B7E\u5230\u5931\u8D25\uFF1A${error instanceof Error ? error.message : String(error)}`,
          "error"
        );
      }
    }
  });
  pi.registerCommand("workbuddy.refresh", {
    description: "Refresh the WorkBuddy model catalog from the upstream",
    handler: async (_args, ctx) => {
      const parts = [];
      for (const region of REGIONS) {
        const models = await fetchCatalog(region, true);
        parts.push(`${PROVIDER_NAMES[region]}: ${models.length} \u4E2A\u6A21\u578B`);
      }
      await ctx.ui.notify(parts.join("\n"), "info");
      ctx.reload();
    }
  });
  pi.registerCommand("workbuddy.logout", {
    description: "Clear the stored WorkBuddy credential for a region (cn | global, default both)",
    handler: async (args, ctx) => {
      const target = args.trim().toLowerCase();
      const regions = target === "cn" ? ["cn"] : target === "global" ? ["global"] : REGIONS;
      const { clearStoredCredentials: clearStoredCredentials2 } = await Promise.resolve().then(() => (init_auth_io(), auth_io_exports));
      for (const region of regions) {
        clearStoredCredentials2(region);
        stores.get(region)?.invalidate();
        catalogs.delete(region);
      }
      await ctx.ui.notify(`\u5DF2\u6E05\u9664 ${regions.map((region) => PROVIDER_IDS[region]).join(", ")} \u7684\u672C\u5730\u51ED\u636E\uFF08\u4E0D\u5F71\u54CD\u684C\u9762\u7AEF\u767B\u5F55\uFF09`, "info");
    }
  });
}
function providerRegionOf(model) {
  return model.provider === "workbuddy-global" ? "global" : "cn";
}
export {
  index_default as default
};
