/** 网关统一响应信封。code 恒为字符串；"0" 表成功（绝不依赖 HTTP 状态判业务成败）。 */
export interface ApiEnvelope<T> {
  code: string;
  msg: string;
  data: T;
}

/**
 * 分页信封 —— 兼容两份 proto 的差异：
 *   Directory {total, list}
 *   Org/User   {list, total, page, page_size}
 * 消费方按需取用，多余字段忽略。
 */
export interface PageEnvelope<T> {
  list: T[];
  total: number;
  page?: number;
  page_size?: number;
}
