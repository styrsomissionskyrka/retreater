import * as path from 'path';
import fs from 'fs-extra';

let cwd = process.cwd();
let pkgDir = path.join(cwd, 'package/styrsomissionskyrka');
let items = await fs.readdir(cwd);

let ignored = ['node_modules', 'package', 'scripts', 'src', 'package.json'];

items = items.filter(
  (item) => !ignored.includes(item) && !item.startsWith('.'),
);

if (await exists(path.dirname(pkgDir))) {
  await fs.rm(path.dirname(pkgDir), { recursive: true });
}
await fs.mkdir(pkgDir, { recursive: true });

for (let item of items) {
  let src = path.join(cwd, item);
  let dest = path.join(pkgDir, item);
  await fs.copy(src, dest, { recursive: true });
}

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch (error) {
    return false;
  }
}
