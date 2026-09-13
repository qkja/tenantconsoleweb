/** unix 秒 → 本地时间字符串；空 / 0 返回 —。 */
export function format_unix_time(seconds: number): string {
  if (seconds == null || seconds === 0) {
    return '—';
  }
  return new Date(seconds * 1000).toLocaleString();
}
