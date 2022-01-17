import dotenv from 'dotenv';
import fs from 'fs-extra';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

const ignore = [
  '.swc',
  '.turbo',
  'node_modules',
  'package',
  'scripts',
  'src',
  'composer.json',
  'composer.lock',
  'package.json',
];

let src = path.join(process.cwd(), '.');
let dest = path.join(process.env.SYNC_PATH, '/styrsomissionskyrka');

let items = await fs.readdir(src);
for (let item of items) {
  if (item.startsWith('.') || ignore.includes(item)) continue;
  await fs.copy(path.join(src, item), path.join(dest, item));
}
