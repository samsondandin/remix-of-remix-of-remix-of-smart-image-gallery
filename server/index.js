import express from 'express';
import fetch from 'node-fetch';
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 3001;

const HF_TOKEN = process.env.HF_API_TOKEN;
if (!HF_TOKEN) {
  console.warn('Warning: HF_API_TOKEN not set. Inference requests will fail without a token.');
}

app.use(bodyParser.json({ limit: '10mb' }));

async function callHFModel(model, imageUrl) {
  const res = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${HF_TOKEN || ''}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ inputs: imageUrl })
  });

  if (!res.ok) {
    const text = await res.text();
    return { error: text, status: res.status };
  }

  return res.json();
}

app.post('/api/classify', async (req, res) => {
  const { imageUrl } = req.body || {};
  if (!imageUrl) return res.status(400).json({ error: 'imageUrl required' });

  try {
    const data = await callHFModel('onnx-community/mobilenetv4_conv_small.e2400_r224_in1k', imageUrl);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err) });
  }
});

app.post('/api/detect', async (req, res) => {
  const { imageUrl } = req.body || {};
  if (!imageUrl) return res.status(400).json({ error: 'imageUrl required' });

  try {
    const data = await callHFModel('Xenova/detr-resnet-50', imageUrl);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err) });
  }
});

const server = app.listen(port, () => {
  console.log(`HF proxy server listening at http://localhost:${port}`);
});

// Health check
app.get('/', (req, res) => {
  res.type('text').send('HF proxy server is running');
});

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Kill the process using it or change PORT.`);
    process.exit(1);
  }
  console.error('Server error:', err);
});

process.on('SIGINT', () => {
  console.log('Shutting down HF proxy server...');
  server.close(() => process.exit(0));
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception in server:', err);
  process.exit(1);
});
