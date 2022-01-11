import './package.mjs';
import dotenv from 'dotenv';
import fs from 'fs-extra';
import * as path from 'path';

dotenv.config({ path: '.env.local' });
await fs.copy(
  './package/styrsomissionskyrka',
  path.join(process.env.SYNC_PATH, '/styrsomissionskyrka'),
);
