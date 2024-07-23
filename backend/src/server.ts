import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';

const app = express();

const clientId =
  process.env.AZURE_CLIENT_ID || 'd4790e58-c1a7-43d4-864a-dcc3c0ce4315';
const tenantId =
  process.env.AZURE_TENANT_ID ||
  'https://login.microsoftonline.com/720b637a-655a-40cf-816a-f22f40755c2c';
const redirectUri = process.env.AZURE_REDIRECT_URI || 'http://localhost:3000/';

console.log('Client ID:', clientId);
console.log('Tenant ID:', tenantId);
console.log('Redirect URI:', redirectUri);

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, '../../dist')));

// Serve assets from the src/assets directory
app.use('/assets', express.static(path.join(__dirname, '../../dist/assets')));

app.get('/api/auth-config', (_req: Request, res: Response) => {
  res.json({
    clientId: clientId,
    tenantId: tenantId,
    redirectUri: redirectUri,
  });
});

// For any other requests, send back the index.html file from the dist directory
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
