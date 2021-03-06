import http from 'http';
import Logger from '@deity/falcon-logger';

function falconWebServer() {
  const { Server } = require('./server');
  const app = require('./clientApp');
  const bootstrap = require('./clientApp/bootstrap');
  /* eslint-disable */
  const assetsManifest = require(process.env.ASSETS_MANIFEST);
  const loadableStats =
    process.env.NODE_ENV === 'production'
      ? require(process.env.LOADABLE_STATS)
      : __non_webpack_require__(process.env.LOADABLE_STATS);
  /* eslint-enable */

  /**
   * Creates an instance of Falcon web server
   * @param {ServerAppConfig} props Application parameters
   * @return {WebServer} Falcon web server
   */
  return Server({
    App: app.default,
    clientApolloSchema: app.clientApolloSchema,
    bootstrap: bootstrap.default,
    webpackAssets: {
      webmanifest: assetsManifest[''].webmanifest
    },
    loadableStats
  });
}

const port = parseInt(process.env.PORT, 10) || 3000;
const server = falconWebServer();
let currentWebServerHandler = server.callback();

// Use `app#callback()` method here instead of directly
// passing `app` as an argument to `createServer` (or use `app#listen()` instead)
// @see https://github.com/koajs/koa/blob/master/docs/api/index.md#appcallback
const httpServer = http.createServer(currentWebServerHandler);
httpServer.listen(port, error => {
  if (error) {
    Logger.error(error);
  }

  Logger.log(`🚀  Client ready at http://localhost:${port}`);
  server.started();
});

if (module.hot) {
  Logger.log('✅  Server-side HMR Enabled!');

  module.hot.accept(['./server', './clientApp', './clientApp/bootstrap'], () => {
    Logger.log('🔁  HMR: Reloading server...');

    try {
      const newHandler = falconWebServer().callback();
      httpServer.removeListener('request', currentWebServerHandler);
      httpServer.on('request', newHandler);
      currentWebServerHandler = newHandler;
      Logger.log('✅  HMR: Server reloaded.');
    } catch (error) {
      Logger.log('🛑  HMR: Reloading server failed, syntax error!');
    }
  });
}
