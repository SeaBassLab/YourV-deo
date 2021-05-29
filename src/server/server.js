
import express from 'express';
import dotenv from 'dotenv';
import webpack from 'webpack';
import helmet from 'helmet';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { renderRoutes } from 'react-router-config'
import { StaticRouter } from 'react-router-dom';
import reducer from '../frontend/reducers';
import routes from '../frontend/routes/serverRoutes';
import initialState from '../frontend/initialState';
import getManifest from './getManifest';
import cookieParser from 'cookie-parser';
import boom from '@hapi/boom';
import passport from 'passport';
import axios from 'axios';

dotenv.config();

const { ENV, PORT } = process.env;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

require('./utils/auth/strategies/basic');

if(ENV === 'dev') {
    console.log('Development config');
    const webpackConfig = require('../../webpack.config');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');
    const compiler = webpack(webpackConfig);
    const serverConfig = { serverSideRender: true, publicPath: webpackConfig.output.publicPath };

    app.use(webpackDevMiddleware(compiler, serverConfig));
    app.use(webpackHotMiddleware(compiler));
} else {
    app.use((req, res, next) =>{
        if(!req.hashManifest) req.hashManifest = getManifest();
        next();
    });
    app.use(express.static(`${__dirname}/public/`));
    app.use(helmet());
    app.use(
        helmet.contentSecurityPolicy({
          directives: {
            'default-src': ["'self'"],
            'script-src': ["'self'", "'sha256-0dBS9VE/yg4rSdtabxUlsR0TUq0heO48oqJa0nBS2CM='"],
            'img-src': ["'self'", 'http://dummyimage.com'],
            'style-src-elem': ["'self'", 'https://fonts.googleapis.com'],
            'font-src': ['https://fonts.gstatic.com'],
            'media-src': ['*'],
          },
        }),
      );
    app.use(helmet.permittedCrossDomainPolicies());
    app.disable('x-powered-by');
}

const setResponse = (html, preloadedState, manifest) => {
    const mainStyles = manifest ? manifest['vendors.css'] : 'assets/app.css';
    const mainBuild = manifest ? manifest['main.js'] : 'assets/app.js';
    const vendorBuild = manifest ? manifest['vendors.js'] : 'assets/vendor.js';

    return (`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href=${mainStyles} type="text/css">
        <title>YourVideo</title>
    </head>
    <body>
        <div id="app">${html}</div>
        <script>
            window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
        </script>
        <script src=${mainBuild} type="text/javascript"></script>
        <script src=${vendorBuild} type="text/javascript"></script>
    </body>
    </html>
    `);
};

const renderApp = (req, res) => {
    const store = createStore(reducer, initialState);
    const preloadedState = store.getState();
    const html = renderToString(
        <Provider store={store}>
            <StaticRouter location={req.url} context={{}}>
                {renderRoutes(routes)}
            </StaticRouter>
        </Provider>,
    );

    res.send(setResponse(html, preloadedState, req.hashManifest));
};

app.post("/auth/sign-in", async function(req, res, next) {
    passport.authenticate("basic", function(error, data) {
      try {
        if (error || !data) {
          next(boom.unauthorized());
        }
  
        req.login(data, { session: false }, async function(error) {
          if (error) {
            next(error);
          }
  
          const { token, ...user } = data;
  
          res.cookie("token", token, {
            httpOnly: !config.dev,
            secure: !config.dev
          });
  
          res.status(200).json(user);
        });
      } catch (error) {
        next(error);
      }
    })(req, res, next);
  });
  
  app.post("/auth/sign-up", async function(req, res, next) {
    const { body: user } = req;
  
    try {
      const userData = await axios({
        url: `${process.env.API_URL}/api/auth/sign-up`,
        method: "post",
        data: {
          'email': user.email,
          'name': user.name,
          'password': user.password
        }
      });
  
      res.status(201).json({
        name: req.body.name,
        email: req.body.email,
        id: userData.data.id
      });
    } catch (error) {
      next(error);
    }
  });

app.get('*', renderApp);

app.listen(PORT, (err) => {
    if(err) console.log(err);
    else console.log(`Server is running on port:${PORT}`);
});