import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const embeddingModel = 'text-embedding-004';

const readRequestBody = async (req: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk: Buffer) => {
      body += chunk.toString();
    });
    req.on('end', () => resolve(body));
    req.on('error', (err: Error) => reject(err));
  });
};

const createEmbedRoute = (apiKey: string) => async (req: any, res: any) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }

  if (!apiKey) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Server embedding key is not configured.' }));
    return;
  }

  try {
    const rawBody = await readRequestBody(req);
    let payload: any = {};
    try {
      payload = rawBody ? JSON.parse(rawBody) : {};
    } catch (error) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'Invalid JSON payload.' }));
      return;
    }

    const text = typeof payload.text === 'string' ? payload.text : '';

    if (!text) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'Text is required.' }));
      return;
    }

    const upstreamResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${embeddingModel}:embedContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: embeddingModel,
          content: { parts: [{ text }] }
        })
      }
    );

    if (!upstreamResponse.ok) {
      const errorText = await upstreamResponse.text();
      res.statusCode = upstreamResponse.status;
      res.end(
        JSON.stringify({
          error: 'Embedding provider request failed.',
          details: errorText
        })
      );
      return;
    }

    const data = await upstreamResponse.json();
    const values = data?.embedding?.values;
    res.statusCode = 200;
    res.end(JSON.stringify({ values }));
  } catch (error) {
    console.error('Failed to handle /api/embed request', error);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Failed to generate embedding.' }));
  }
};

export default defineConfig(({ mode }) => {
  const env = {
    ...process.env,
    ...loadEnv(mode, '.', '')
  } as Record<string, string>;
  const embedRoute = createEmbedRoute(env.GEMINI_API_KEY ?? '');

  return {
    server: {
      port: 3000,
      host: '0.0.0.0'
    },
    plugins: [
      {
        name: 'embed-api-proxy',
        configureServer(server) {
          server.middlewares.use('/api/embed', embedRoute);
        },
        configurePreviewServer(server) {
          server.middlewares.use('/api/embed', embedRoute);
        }
      },
      react()
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.')
      }
    }
  };
});
