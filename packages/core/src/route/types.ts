export interface RouteType {
  component?: string;
  exact?: boolean;
  path?: string;
  routes?: RouteType[];
  wrappers?: string[];
  title?: string;
  __toMerge?: boolean;
  __isDynamic?: boolean;
  [key: string]: any;
}
