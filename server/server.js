// import express from 'express';
// import fs from 'fs';
// import path from 'path'
// import React from 'react';
// import ReactDOMServer from 'react-dom/server'
// import App from '../src/App'

// const app = express()
// const PORT = 8000

// app.use('^/$', (req, res, next)=>{
//     fs.readFile(path.resolve('./build/index.html'), 'utf-8', (err,data) => {
//         if(err){
//             console.log(err);
//             return res.status(500).send('Some error Occure')
//         }
//         return res.send(data.replace('<div id="root"></div>', `<div id="root">${ReactDOMServer.renderToString(<App/>)}</div>`))
//     })
// })

// app.use(express.static(path.resolve(__dirname, '..', 'build')))

// app.listen(PORT, ()=>{
//     console.log(`App Launce at port ${PORT}`)
// })


// This example uses React Router v4, although it should work
// equally well with other routers that support SSR
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { ApolloProvider } from '@apollo/react-common';
import 'cross-fetch/polyfill';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import Express from 'express';
import { StaticRouter } from 'react-router';
import { InMemoryCache } from "apollo-cache-inmemory";
import { renderToStringWithData } from "@apollo/react-ssr";
import Layout from './routes/Layout';
import fetch from 'node-fetch'
// import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';


// Note you don't have to use any particular http server, but
// we're using Express in this example
const basePort = 8000
const app = new Express();



app.use((req, res) => {
  const link = createHttpLink({ uri: '/graphql', fetch: fetch });
  const client = new ApolloClient({
    ssrMode: true,
    // fetch,
    
    link: createHttpLink({
      uri: 'http://localhost:4000',
      fetch,
      credentials: 'same-origin',
      headers: {
        cookie: req.header('Cookie'),
      },
    }),
    cache: new InMemoryCache(),
  });

  const context = {};

  const App = (
    <ApolloProvider client={client}>
      <StaticRouter location={req.url} context={context}>
        <Layout />
      </StaticRouter>
    </ApolloProvider>
  );
  function Html({ content, state }) {
    return (
      <html>
        <body>
          <div id="root" dangerouslySetInnerHTML={{ __html: content }} />
          <script dangerouslySetInnerHTML={{
            __html: `window.__APOLLO_STATE__=${JSON.stringify(state).replace(/</g, '\\u003c')};`,
          }} />
        </body>
      </html>
    );
  }

  // getDataFromTree(App).then(() => {
  //   // We are ready to render for real
  //   const content = ReactDOM.renderToString(App);
  //   const initialState = client.extract();

  //   const html = <Html content={content} state={initialState} />;

  //   res.status(200);
  //   res.send(`<!doctype html>\n${ReactDOM.renderToStaticMarkup(html)}`);
  //   res.end();
  // });

  renderToStringWithData(App).then((content) => {
    const initialState = client.extract();
    const html = <Html content={content} state={initialState} />;

    res.status(200);
    res.send(`<!doctype html>\n${ReactDOMServer.renderToStaticMarkup(html)}`);
    res.end();
  });


});

app.listen(basePort, () => console.log( // eslint-disable-line no-console
  `app Server is now running on http://localhost:${basePort}`
));
