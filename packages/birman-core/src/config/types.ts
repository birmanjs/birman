import { RouteType } from '../route/types';

export type ConfigType = {
  singular?: boolean;
  outputPath?: string;
  publicPath?: string;
  title?: string;
  mountElementId?: string;
  routes?: RouteType[];
  exportStatic?: {
    htmlSuffix?: boolean;
    dynamicRoot?: boolean;
  };
};
