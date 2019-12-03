import { Config } from '@walrus/pansy';

const config: Config = {
  input: {
    dev: 'src/dev.ts',
    build: 'src/build.ts',
    'webpack-config': 'src/webpack-config/index.ts'
  }
}

export default config;
