import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { cacheToPluginCacheManager } from '@backstage/backend-common';
import { createRouter } from './service/router';

/**
 * nobl9BackendPlugin backend plugin
 *
 * @public
 */
export const nobl9BackendPlugin = createBackendPlugin({
  pluginId: 'nobl9-backend',
  register(env) {
    env.registerInit({
      deps: {
        httpRouter: coreServices.httpRouter,
        logger: coreServices.logger,
        cache: coreServices.cache,
        config: coreServices.rootConfig,
      },
      async init({ httpRouter, logger, cache, config }) {
        httpRouter.use(
          await createRouter({
            logger,
            cache: cacheToPluginCacheManager(cache),
            config,
          }),
        );
        httpRouter.addAuthPolicy({
          path: '/health',
          allow: 'unauthenticated',
        });
      },
    });
  },
});
