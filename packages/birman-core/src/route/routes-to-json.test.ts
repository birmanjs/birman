import routesToJson from './routes-to-json';

test('normal', () => {
  const ret = routesToJson({
    routes: [{ path: '/', component: '@/pages/index.ts' }],
    config: {}
  });
  expect(ret).toEqual(
    `
[
  {
    "path": "/",
    "component": require('@/pages/index.ts').default
  }
]
  `.trim()
  );
});

test('normal with dynamicImport', () => {
  const ret = routesToJson({
    routes: [{ path: '/', component: '@/pages/index.ts' }],
    config: {
      dynamicImport: true
    }
  });
  expect(ret).toEqual(
    `
[
  {
    "path": "/",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__index' */'@/pages/index.ts')})
  }
]
  `.trim()
  );
});

test('component with arrow function', () => {
  expect(
    routesToJson({
      routes: [{ path: '/', component: '()=><div>loading...</div>' }],
      config: {}
    })
  ).toEqual(
    `
[
  {
    "path": "/",
    "component": ()=><div>loading...</div>
  }
]
  `.trim()
  );
  expect(
    routesToJson({
      routes: [{ path: '/', component: '(props) => <div>loading...</div>' }],
      config: {}
    })
  ).toEqual(
    `
[
  {
    "path": "/",
    "component": (props) => <div>loading...</div>
  }
]
  `.trim()
  );
});

test('component with function', () => {
  expect(
    routesToJson({
      routes: [
        {
          path: '/',
          component: 'function(){ return <div>loading...</div>; }'
        }
      ],
      config: {}
    })
  ).toEqual(
    `
[
  {
    "path": "/",
    "component": function(){ return <div>loading...</div>; }
  }
]
  `.trim()
  );
  expect(
    routesToJson({
      routes: [
        {
          path: '/',
          component: 'function abc(props) { return <div>loading...</div>; }'
        }
      ],
      config: {}
    })
  ).toEqual(
    `
[
  {
    "path": "/",
    "component": function abc(props) { return <div>loading...</div>; }
  }
]
  `.trim()
  );
});
