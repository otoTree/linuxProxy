# LinuxProxy API 文档

## 1. 文档头部信息

- **项目名称**: LinuxProxy
- **API 版本号**: v1.0.0
- **最后更新时间**: 2025-12-18
- **文档维护者**: 开发团队

## 2. 基础信息部分

### 2.1 API 服务地址

- **开发环境**: `http://localhost:3001`
- **生产环境**: 取决于部署配置 (默认端口 3001)

### 2.2 认证方式

API 使用 **Bearer Token** 进行身份验证。需要在请求头中携带 `Authorization` 字段。

格式:
```
Authorization: Bearer <your-api-token>
```

Token 配置:
- Token 值由环境变量 `API_TOKEN` 设置。

### 2.3 请求头要求

对于所有 POST 请求，需设置以下请求头：

- `Content-Type`: `application/json`
- `Authorization`: `Bearer <token>` (仅受保护接口)

### 2.4 通用状态码说明

| 状态码 | 说明 |
|:-------|:-----|
| 200 | 请求成功 |
| 400 | 请求参数错误 (Bad Request) |
| 401 | 未授权 (Unauthorized) - Token 缺失 |
| 403 | 禁止访问 (Forbidden) - Token 无效 |
| 404 | 资源不存在 (Not Found) |
| 500 | 服务器内部错误 (Internal Server Error) |

---

## 3. API 端点详细说明

### 3.1 健康检查 (Health Check)

用于检查服务是否正常运行。

- **接口路径**: `/`
- **HTTP 方法**: `GET`
- **权限要求**: 无
- **速率限制**: 无

#### 请求参数

无

#### 请求示例

```bash
curl -X GET http://localhost:3001/
```

#### 响应结构

- **数据类型**: `text/plain`
- **说明**: 返回简单的欢迎信息。

#### 成功响应示例 (200 OK)

```text
Hello World from Bun + Express + TypeScript!
```

---

### 3.2 执行 Shell 命令 (Execute Command)

在服务器上执行指定的 Shell 命令并返回结果。

- **接口路径**: `/cmd`
- **HTTP 方法**: `POST`
- **权限要求**: 需要有效 API Token
- **速率限制**: 取决于服务器负载，建议避免高频调用

#### 请求参数

| 参数名 | 位置 | 类型 | 必填 | 说明 |
|:-------|:-----|:-----|:-----|:-----|
| command | Body | string | 是 | 需要执行的 Shell 命令 |

#### 请求示例

```bash
curl -X POST http://localhost:3001/cmd \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret-token" \
  -d '{
    "command": "ls -la"
  }'
```

#### 响应结构 (JSON)

| 字段名 | 类型 | 说明 |
|:-------|:-----|:-----|
| stdout | string | 命令执行的标准输出 |
| stderr | string | 命令执行的标准错误输出 |
| error | string | (仅出错时) 错误描述信息 |

#### 成功响应示例 (200 OK)

```json
{
  "stdout": "total 40\ndrwxr-xr-x  8 user  staff  256 Dec 18 10:00 .\n...",
  "stderr": ""
}
```

#### 错误响应示例

**400 Bad Request (缺少 command 参数)**

```json
{
  "error": "Command is required"
}
```

**401 Unauthorized (缺少 Token)**

```json
{
  "error": "Authorization header missing"
}
```

**403 Forbidden (Token 无效)**

```json
{
  "error": "Invalid token"
}
```

**500 Internal Server Error (命令执行失败)**

```json
{
  "error": "Command failed: non-existent-command\n/bin/sh: non-existent-command: command not found\n",
  "stderr": "/bin/sh: non-existent-command: command not found\n",
  "stdout": ""
}
```

## 4. 附录

### 4.1 错误代码对照表

本 API 主要使用标准 HTTP 状态码来表示错误类别，具体错误信息会在响应 Body 的 `error` 字段中说明。

| HTTP 状态码 | 错误信息 (Error Message) | 含义 |
|:------------|:-------------------------|:-----|
| 400 | Command is required | 请求体中缺少 `command` 字段 |
| 401 | Authorization header missing | 请求头中未包含 `Authorization` |
| 403 | Invalid token | 提供的 Token 与环境变量 `API_TOKEN` 不匹配 |
| 500 | Server configuration error | 服务器未配置 `API_TOKEN` |
| 500 | [系统错误信息] | `child_process.exec` 执行出错 |

### 4.2 常见问题解答 (FAQ)

**Q: 如何设置 API Token?**
A: 在启动服务前，设置环境变量 `API_TOKEN`。例如：`export API_TOKEN="my-secret"`。如果未设置，受保护的接口将返回 500 错误。

**Q: 是否支持交互式命令?**
A: 不支持。命令是通过 `child_process.exec` 执行的，不支持需要用户交互的命令 (如 `top`, `vim` 等)。建议仅执行一次性返回结果的命令。

**Q: 命令执行超时怎么办?**
A: 目前 API 采用默认的超时设置。如果命令执行时间过长，可能会导致连接超时。对于耗时任务，建议寻找其他异步处理方案。

### 4.3 变更日志

- **2025-12-18**: v1.0.0 发布
    - 初始版本发布
    - 支持 `/` 健康检查
    - 支持 `/cmd` 远程命令执行
    - 支持 API Token 认证
