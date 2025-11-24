import type { Request, Response } from '@google-cloud/functions-framework';

const embeddingModel = 'text-embedding-004';

const readRequestBody = async (req: Request): Promise<string> => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk: Buffer) => {
      body += chunk.toString();
    });
    req.on('end', () => resolve(body));
    req.on('error', (err: Error) => reject(err));
  });
};

export const embed = async (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const isKeyConfigured = Boolean(apiKey);
  console.info('GEMINI_API_KEY configured for /api/embed:', isKeyConfigured);
  if (!apiKey) {
    res.status(500).json({ error: 'Server embedding key is not configured.' });
    return;
  }

  try {
    const rawBody = await readRequestBody(req);
    let payload: any = {};

    try {
      payload = rawBody ? JSON.parse(rawBody) : {};
    } catch (error) {
      res.status(400).json({ error: 'Invalid JSON payload.' });
      return;
    }

    const text = typeof payload.text === 'string' ? payload.text : '';
    if (!text) {
      res.status(400).json({ error: 'Text is required.' });
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
      res.status(upstreamResponse.status).json({
        error: 'Embedding provider request failed.',
        details: errorText
      });
      return;
    }

    const data = await upstreamResponse.json();
    const values = data?.embedding?.values;
    res.status(200).json({ values });
  } catch (error) {
    console.error('Failed to handle /api/embed request', error);
    res.status(500).json({ error: 'Failed to generate embedding.' });
  }
};
