export type ServicePathKeys =
  | 'cwd'
  | 'absNodeModulesPath'
  | 'absOutputPath'
  | 'absSrcPath'
  | 'absPagesPath'
  | 'absTmpPath';

export type ServicePaths = {
  [key in ServicePathKeys]: string;
};
