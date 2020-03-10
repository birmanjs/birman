<h1 align="center">@birman/babel-plugin-auto-css-modules</h1>

处理样式文件引入，例如

```
import styles from 'a.less'; // >> 处理为import styles from "a.less?modules

import 'a.less'; // 不处理
```

## 🏗 安装

```
// npm
npm install @birman/babel-plugin-auto-css-modules --save --dev

// yarn
yarn add @birman/babel-plugin-auto-css-modules
```

## 🔨 使用

通过 `.babelrc` 或者 `babel-loader`。

{
"plugins": [["auto-css-modules", options]]
}

## options

options 为一个对象。

```
{
  flag?: string; // 默认为modules
}
```
