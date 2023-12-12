import { Server } from 'http';
import { Logger } from 'winston';
import { CacheManager, createServiceBuilder } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { createRouter } from './router';

export interface ServerOptions {
  port: number;
  enableCors: boolean;
  logger: Logger;
}

export async function startStandaloneServer(
  options: ServerOptions,
): Promise<Server> {
  const config = new ConfigReader({
    nobl9: {
      baseUrl: 'https://app.nobl9.com',
      organization: '',
      clientId: '',
      clientSecret: '',
    },
  });

  const cache = CacheManager.fromConfig(config).forPlugin('nobl9');
  const logger = options.logger.child({ service: 'nobl9-backend' });
  logger.debug('Starting application server...');
  const router = await createRouter({
    logger,
    cache,
    config,
  });

  let service = createServiceBuilder(module)
    .setPort(options.port)
    .addRouter('/nobl9', router);
  if (options.enableCors) {
    service = service.enableCors({ origin: 'http://localhost:3000' });
  }

  return await service.start().catch((err: Error) => {
    logger.error(err);
    process.exit(1);
  });
}

module.hot?.accept();
