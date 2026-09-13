/** 网关统一响应信封。code 恒为字符串；"0" 表成功（绝不依赖 HTTP 状态判业务成败）。 */
export interface ApiEnvelope<T> {
  code: string;
  msg: string;
  data: T;
}

/** 分页公共结构（PageData）—— 所有列表 data 均为 `PageData + list []<Info>`。 */
export interface PageData {
  total: number;
  page: number;
  page_size: number;
}
