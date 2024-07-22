import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config();

const app = express();

console.log(
  'Client ID:',
  process.env.AZURE_CLIENT_ID || 'd4790e58-c1a7-43d4-864a-dcc3c0ce4315',
);
console.log(
  'Tenant ID:',
  process.env.AZURE_TENANT_ID ||
    'https://login.microsoftonline.com/720b637a-655a-40cf-816a-f22f40755c2c',
);
console.log(
  'Redirect URI:',
  process.env.AZURE_REDIRECT_URI || 'http://localhost:3000/',
);

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 5001;

app.get('/api/auth-config', (_req: Request, res: Response) => {
  res.json({
    clientId:
      process.env.AZURE_CLIENT_ID || 'd4790e58-c1a7-43d4-864a-dcc3c0ce4315',
    tenantId:
      process.env.AZURE_TENANT_ID ||
      'https://login.microsoftonline.com/720b637a-655a-40cf-816a-f22f40755c2c',
    redirectUri: process.env.AZURE_REDIRECT_URI || 'http://localhost:3000/',
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
