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

export interface HtmlConfig {
  metas?: HTMLTag[];
  links?: Partial<HTMLLinkElement>[];
  styles?: Partial<Style>[];
  headScripts?: HTMLTag[];
  scripts?: HTMLTag[];
}

export interface Script extends Partial<HTMLScriptElement> {
  content?: string;
}

export interface GetContentArgs extends HtmlConfig {
  route: RouteType;
  headJSFiles?: string[];
  jsFiles?: string[];
  cssFiles?: string[];
  tplPath?: string;
  modifyHTML?: ModifyHTML;
}

export type ScriptConfig = Array<Script | string>;
export type StyleConfig = Array<Style | string>;
