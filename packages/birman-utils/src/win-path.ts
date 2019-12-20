import slash from 'slash';

/**
 * 将windows反斜杠路径转换为斜杠路径
 * @param path
 */
export default function(path: string): string {
  return slash(path);
}
