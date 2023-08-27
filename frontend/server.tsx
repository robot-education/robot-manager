import express from 'express';
import { renderPage } from 'vite-plugin-ssr/server';

const isProduction = process.env.NODE_ENV === 'production';
const root = `${__dirname}`;

startServer();

async function startServer() {
  // Create an Express.js server
  const app = express();

  // Vite integration
  if (!isProduction) {
    // We instantiate Vite's development server and integrate its middleware to our server.
    // ⚠️ We instantiate it only in development. (It isn't needed in production and it
    // would unnecessarily bloat our production server.)
    const vite = await import('vite');
    const viteDevMiddleware = (await vite.createServer({
      root,
      server: { middlewareMode: true }
    })).middlewares;
    app.use(viteDevMiddleware);
  } else {
    // In production, we need to serve our static assets ourselves.
    // (In dev, Vite's middleware serves our static assets.)
    app.use(express.static(`${root}/${outDir}/client`));
  }

  // ...
  // Other middlewares (e.g. some RPC middleware such as Telefunc)
  // ...

  app.get('*', async (req, res, next) => {
    const pageContextInit = { urlOriginal: req.originalUrl };
    const pageContext = await renderPage(pageContextInit);
    if (pageContext.httpResponse === null) return next();
    const { body, statusCode, headers } = pageContext.httpResponse;
    headers.forEach(([name, value]) => res.setHeader(name, value));
    res.status(statusCode).send(body);
  })

  const port = 3000;
  app.listen(port);
  console.log(`Server running at http://localhost:${port}`);
}