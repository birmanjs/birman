import chokidar, { FSWatcher } from 'chokidar';

// 按 key 存，值为数组
const watchers = {};

/**
 * 监听文件变化
 * @param key
 * @param files
 */
export function watch(key: string, files: string[]) {
  if (process.env.WATCH_FILES === 'none') return;
  if (!watchers[key]) {
    watchers[key] = [];
  }
  const watcher = chokidar.watch(files, {
    ignoreInitial: true
  });
  watchers[key].push(watcher);
  return watcher;
}

/**
 * 去除监听文件
 * @param key
 */
export function unwatch(key: string) {
  if (!key) {
    return Object.keys(watchers).forEach(unwatch);
  }
  if (watchers[key]) {
    watchers[key].forEach((watcher: FSWatcher) => {
      watcher.close();
    });
    delete watchers[key];
  }
}
