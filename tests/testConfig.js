require.config({
  baseUrl: '/lib',
  //urlArgs: 'cb=' + Math.random(),                   // Cache buster
  paths: {
    async: '/tests/lib/async',
    jasmine: '/tests/lib/jasmine',
    'jasmine-html': '/tests/lib/jasmine-html',
    spec: '/tests/spec',
    mocks: '/tests/mocks',
    matchers: '/tests/lib/matchers',
    testErrors: '/tests/errors',
    testUtils: '/tests/testUtils',
    sinon: '/tests/lib/sinon',
    jquery: '/tests/lib/jquery-1.10.2',
  },
  shim: {
    jasmine: {
      exports: 'jasmine'
    },
    'jasmine-html': {
      deps: ['jasmine'],
      exports: 'jasmine'
    },
    'sinon': {
      exports: 'sinon'
    }
  },
  config: {
    aeris: {
      apiId: 'ezHWL0MiLsxwlN2ik8U4c',
      apiSecret: 'uCDMeSj91lBfIKCmeQkpeZjsAwUUQJHuKesCvqTm'
    }
  }
});