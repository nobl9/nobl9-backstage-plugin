import {
  createComponentExtension,
  createPlugin,
} from '@backstage/core-plugin-api';
import { Entity } from '@backstage/catalog-model';
import { rootRouteRef } from './routes';
import { ANNOTATION_NOBL9_PROJECT } from './components/constants';

export const nobl9Plugin = createPlugin({
  id: 'nobl9',
  routes: {
    root: rootRouteRef,
  },
});

export const Nobl9Page = nobl9Plugin.provide(
  createComponentExtension({
    name: 'Nobl9Page',
    component: {
      lazy: () => import('./components/SloPage').then(m => m.SloPage),
    },
  }),
);

export const isNobl9Available = (entity: Entity) =>
  !!entity?.metadata.annotations?.[ANNOTATION_NOBL9_PROJECT];
