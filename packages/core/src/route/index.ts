import { lodash, winPath } from '@birman/utils';
import { join } from 'path';
import { ConfigType, RouteType } from '..';
import assert from 'assert';
import getConventionalRoutes from './get-conventional-routes';
import routesToJSON from './routes-to-json';

interface Opts {
  onPatchRoutesBefore?: Function;
  onPatchRoutes?: Function;
  onPatchRouteBefore?: Function;
  onPatchRoute?: Function;
}

interface GetRoutesOpts {
  config: ConfigType;
  // root 通常是 src/pages 目录
  root: string;
  componentPrefix?: string;
  isConventional?: boolean;
  parentRoute?: RouteType;
}

class Route {
  opts: Opts;
  constructor(opts?: Opts) {
    this.opts = opts || {};
  }

  async getRoutes(opts: GetRoutesOpts) {
    const { config, root, componentPrefix } = opts;
    // 避免修改配置里的 routes，导致重复 patch
    let routes = lodash.cloneDeep(config.routes);
    let isConventional = false;
    if (!routes) {
      assert(root, `opts.root must be supplied for conventional routes.`);
      routes = this.getConventionRoutes({
        root: root!,
        config,
        componentPrefix
      });
      isConventional = true;
    }
    await this.patchRoutes(routes, {
      ...opts,
      isConventional
    });
    return routes;
  }

  // TODO:
  // 1. 移动 /404 到最后，并处理 component 和 redirect
  async patchRoutes(routes: RouteType[], opts: GetRoutesOpts) {
    if (this.opts.onPatchRoutesBefore) {
      await this.opts.onPatchRoutesBefore({
        routes,
        parentRoute: opts.parentRoute
      });
    }
    for (const route of routes) {
      await this.patchRoute(route, opts);
    }
    if (this.opts.onPatchRoutes) {
      await this.opts.onPatchRoutes({
        routes,
        parentRoute: opts.parentRoute
      });
    }
  }

  async patchRoute(route: RouteType, opts: GetRoutesOpts) {
    if (this.opts.onPatchRouteBefore) {
      await this.opts.onPatchRouteBefore({
        route,
        parentRoute: opts.parentRoute
      });
    }

    // route.path 的修改需要在子路由 patch 之前做
    if (route.path && route.path.charAt(0) !== '/') {
      route.path = winPath(join(opts.parentRoute?.path || '/', route.path));
    }
    if (route.redirect && route.redirect.charAt(0) !== '/') {
      route.redirect = winPath(join(opts.parentRoute?.path || '/', route.redirect));
    }

    if (route.routes) {
      await this.patchRoutes(route.routes, {
        ...opts,
        parentRoute: route
      });
    } else {
      if (!('exact' in route)) {
        // exact by default
        route.exact = true;
      }
    }

    // resolve component path
    if (
      route.component &&
      !opts.isConventional &&
      typeof route.component === 'string' &&
      !route.component.startsWith('@/') &&
      !route.component.startsWith('/')
    ) {
      route.component = winPath(join(opts.root, route.component));
    }

    // resolve wrappers path
    if (route.wrappers) {
      route.wrappers = route.wrappers.map((wrapper) => {
        if (wrapper.startsWith('@/') || wrapper.startsWith('/')) {
          return wrapper;
        } else {
          return winPath(join(opts.root, wrapper));
        }
      });
    }

    if (this.opts.onPatchRoute) {
      await this.opts.onPatchRoute({
        route,
        parentRoute: opts.parentRoute
      });
    }
  }

  getConventionRoutes(opts: any): RouteType[] {
    return getConventionalRoutes(opts);
  }

  getJSON(opts: { routes: RouteType[]; config: ConfigType; cwd: string }) {
    return routesToJSON(opts);
  }

  getPaths({ routes }: { routes: RouteType[] }): string[] {
    return lodash.uniq(
      routes.reduce((memo: string[], route) => {
        if (route.path) memo.push(route.path);
        if (route.routes) memo = memo.concat(this.getPaths({ routes: route.routes }));
        return memo;
      }, [])
    );
  }
}

export default Route;
