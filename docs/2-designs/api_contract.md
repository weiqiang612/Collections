# 接口设计与契约 (API Contract)

## 1. 全局设计原则 (API Design Guidelines)
作品集大部分为静态流式模拟，仅有一个对接外部大模型 Agent 的接口服务代理。

## 2. 已扫描的接口清单 (Scanned API Endpoints)

### `POST /api/chat`
*   **用途**：智能简历 Agent 代理请求接口（仅在配置 `VITE_API_BASE_URL` 时触发远程调用，默认为前端模拟）。
*   **请求格式**：`application/json`
*   **请求体**：
    ```json
    {
      "message": "询问项目的并发优化实现..."
    }
    ```
*   **响应体**：
    ```json
    {
      "reply": "在高并发本地生活交易平台中，我利用 Redis 执行 Lua 脚本完成秒杀预扣减与一人一单原子化校验...",
      "sources": ["hm-dianping", "Redis Stream"]
    }
    ```
