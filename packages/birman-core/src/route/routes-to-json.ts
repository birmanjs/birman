import { lodash, winPath } from '@birman/utils';
import { RouteType } from './types';

interface Opts {
  routes: RouteType[];
  config: any;
  cwd?: string;
}

const SEPARATOR = '^^^';
const EMPTY_PATH = '_';

function lastSlash(str: string) {
  return str[str.length - 1] === '/' ? str : `${str}/`;
}

export default function({ routes, config, cwd }: Opts) {
  const clonedRoutes = lodash.cloneDeep(routes);

  if (config.dynamicImport) {
    patchRoutes(clonedRoutes);
  }

  function patchRoutes(routes: RouteType[]) {
    routes.forEach(patchRoute);
  }

  function patchRoute(route: RouteType) {
    if (route.component && !isFunctionComponent(route.component)) {
      const webpackChunkName = route.component
        .replace(new RegExp(`^${lastSlash(winPath(cwd || '/'))}`), '')
        .replace(/^.(\/|\\)/, '')
        .replace(/(\/|\\)/g, '__')
        .replace(/\.jsx?$/, '')
        .replace(/\.tsx?$/, '')
        .replace(/^src__/, '')
        // 插件层的文件也可能是路由组件，比如 plugin-layout 插件
        .replace(/^.birman-production__/, 't__')
        .replace(/^pages__/, 'p__')
        .replace(/^page__/, 'p__');

      route.component = [route.component, webpackChunkName, route.path || EMPTY_PATH].join(
        SEPARATOR
      );

      if (route.routes) {
        patchRoutes(route.routes);
      }
    }
  }

  function replacer(key: string, value: any) {
    switch (key) {
      case 'component':
        if (isFunctionComponent(value)) return value;
        if (config.dynamicImport) {
          const [component, webpackChunkName, path] = value.split(SEPARATOR);
          let loading = '';
          if (config.dynamicImport.loading) {
            loading = `, loading: require('${config.dynamicImport.loading}').default`;
          }
          return `dynamic({ loader: () => import(/* webpackChunkName: '${webpackChunkName}' */'${component}')${loading}})`;
        } else {
          return `require('${value}').default`;
        }
      case 'wrappers':
        const wrappers = value.map((wrapper: string) => {
          return `require('${wrapper}').default`;
        });
        return `[${wrappers.join(', ')}]`;
      default:
        return value;
    }
  }

  /**
   * 检查组件是否是 function component
   * @param component
   */
  function isFunctionComponent(component: string): boolean {
    return (
      /^\((.+)?\)(\s+)?=>/.test(component) ||
      /^function([^\(]+)?\(([^\)]+)?\)([^{]+)?{/.test(component)
    );
  }

  return JSON.stringify(clonedRoutes, replacer, 2)
    .replace(/\"component\": (\"(.+?)\")/g, (global, m1, m2) => {
      return `"component": ${m2.replace(/\^/g, '"')}`;
    })
    .replace(/\"wrappers\": (\"(.+?)\")/g, (global, m1, m2) => {
      return `"wrappers": ${m2.replace(/\^/g, '"')}`;
    })
    .replace(/\\r\\n/g, '\r\n')
    .replace(/\\n/g, '\r\n');
}
