import { ref, onUnmounted, getCurrentScope } from "vue";

/**
 * useStreamSmoother
 * 
 * 适用于 Agent SSE / 大模型流式输出的前端平滑打字机缓冲队列。
 * 解决大模型生成 Token 突发跳跃（Bursty Chunks）与固定间隔打字机造成的延迟积压问题。
 * 
 * @param {Object} options
 * @param {Function} [options.onUpdate] 每次字符吐出并更新时的回调（常用于自动滚动触底）
 * @param {Function} [options.onFinish] 缓冲区全部排空且流结束时的回调
 */
export function useStreamSmoother(options = {}) {
  const { onUpdate, onFinish } = options;

  // 状态定义（严格使用 ref，禁止 reactive）
  const displayText = ref("");
  const isSmoothing = ref(false);
  const queueLength = ref(0);

  // 内部队列与调度控制
  let queue = [];
  let rafId = null;
  let hasFinishedStream = false;

  /**
   * 动态计算当前帧消费步长（字符数）
   * 采用梯度自适应算法消除“假延迟”
   */
  function calculateStep(remainingLength, isStreamEnded) {
    if (isStreamEnded) {
      // 流已结束：以平滑加速曲线快速清空剩余字符收尾
      return Math.max(2, Math.ceil(remainingLength / 6));
    }
    if (remainingLength > 60) {
      // 队列严重积压（后端突发大 chunk）：提速至 6~10 字/帧
      return Math.min(10, Math.ceil(remainingLength / 8));
    }
    if (remainingLength > 25) {
      // 中等积压：3~4 字/帧
      return 3;
    }
    if (remainingLength > 8) {
      // 轻度积压：2 字/帧
      return 2;
    }
    // 低积压：保持匀速 1 字/帧
    return 1;
  }

  /**
   * 消费循环调度器（基于 requestAnimationFrame）
   */
  function scheduleDrain() {
    if (rafId !== null) return;

    rafId = requestAnimationFrame(() => {
      rafId = null;

      if (queue.length > 0) {
        const step = calculateStep(queue.length, hasFinishedStream);
        const charsToConsume = queue.splice(0, step);
        displayText.value += charsToConsume.join("");
        queueLength.value = queue.length;

        if (typeof onUpdate === "function") {
          onUpdate(displayText.value);
        }

        // 队列仍有剩余，继续排定下一帧
        if (queue.length > 0) {
          scheduleDrain();
          return;
        }
      }

      // 队列已清空
      if (hasFinishedStream) {
        isSmoothing.value = false;
        if (typeof onFinish === "function") {
          onFinish(displayText.value);
        }
      } else {
        // 流尚未结束但当前 Buffer 暂时抽空，暂停 RAF 等待下一次 push 唤醒
        isSmoothing.value = false;
      }
    });
  }

  /**
   * 生产者推送 chunk
   * @param {string} chunk - 后端 SSE delta 文本片段
   */
  function push(chunk) {
    if (!chunk || typeof chunk !== "string") return;

    // 使用 Array.from 正确拆分字符，保护 Emoji 与 Unicode 代理对（Surrogate pairs）
    const chars = Array.from(chunk);
    if (chars.length === 0) return;

    queue.push(...chars);
    queueLength.value = queue.length;
    isSmoothing.value = true;

    scheduleDrain();
  }

  /**
   * 通知流结束（如收到 SSE [DONE] 或请求完毕）
   */
  function finish() {
    hasFinishedStream = true;
    if (queue.length > 0) {
      isSmoothing.value = true;
      scheduleDrain();
    } else {
      isSmoothing.value = false;
      if (typeof onFinish === "function") {
        onFinish(displayText.value);
      }
    }
  }

  /**
   * 强制中止（取消正在排队的帧并清空缓冲区）
   */
  function abort() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    queue = [];
    queueLength.value = 0;
    hasFinishedStream = false;
    isSmoothing.value = false;
  }

  /**
   * 重置所有状态与显示文本
   */
  function reset() {
    abort();
    displayText.value = "";
  }

  // 绑定 Vue 作用域生命周期，组件卸载时自动清理
  if (getCurrentScope()) {
    onUnmounted(() => {
      abort();
    });
  }

  return {
    displayText,
    isSmoothing,
    queueLength,
    push,
    finish,
    abort,
    reset,
  };
}
