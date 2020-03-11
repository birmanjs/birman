import { ConfigType, RouteType } from '..';

export interface HTMLTag {
  [key: string]: string;
}

export interface AddHTML<T> {
  (memo: T, args: { route?: RouteType }): Promise<T>;
}

export interface ModifyHTML {
  (memo: any, args: any): Promise<any>;
}

export interface Style extends Partial<HTMLStyleElement> {
  content: string;
}

export interface Opts {
  config: ConfigType;
  tplPath?: string;
  addHTMLHeadScripts?: AddHTML<HTMLTag[]>;
  addHTMLScripts?: AddHTML<HTMLTag[]>;
  addHTMLMetas?: AddHTML<HTMLTag[]>;
  addHTMLLinks?: AddHTML<Partial<HTMLLinkElement>[]>;
  addHTMLStyles?: AddHTML<Partial<Style>[]>;
  modifyHTML?: ModifyHTML;
}
