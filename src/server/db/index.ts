import * as schema from './schema';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { drizzle } from 'drizzle-orm/d1';

export default async () =>
  drizzle((await getCloudflareContext({ async: true })).env.DB, { schema });
