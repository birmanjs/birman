import isUrl from '@pansy/is-url';

/**
 * 检查字符串是否是一个Url
 * @param path
 */
export default function(path: string): boolean {
  return isUrl(path);
}