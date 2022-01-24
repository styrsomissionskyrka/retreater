import { execSync } from 'child_process';
import * as path from 'path';

import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

let base = process.env.SYNC_PATH.split('/wp-content')[0];
let sitename = path.basename(base);

const configurations = [
  ['WP_ENVIRONMENT_TYPE', 'local'],
  ['WP_DEBUG', 'true'],
  ['SCRIPT_DEBUG', 'true'],
  ['STRIPE_SECRET_KEY', process.env.STRIPE_SECRET_KEY],
  ['SMK_CLIENT_BASE_URL', process.env.SMK_CLIENT_BASE_URL],
];

for (let [key, value] of configurations) {
  wp(`config set ${key} ${value}`);
}

const plugins = ['wordpress-beta-tester'];
wp(`plugin install ${plugins.join(' ')} --activate`);

function wp(script) {
  return execSync(
    `docker exec -u www-data -it devkinsta_fpm bash -c "wp --path='/www/kinsta/public/${sitename}' ${script}"`,
    { stdio: 'inherit' },
  );
}
