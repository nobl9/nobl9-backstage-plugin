import React from 'react';
import { createFrontendPlugin } from '@backstage/frontend-plugin-api';
import { EntityContentBlueprint } from '@backstage/plugin-catalog-react/alpha';
import { ANNOTATION_NOBL9_PROJECT } from './components/constants';

const nobl9EntityContent = EntityContentBlueprint.make({
  name: 'slos',
  params: {
    path: '/slos',
    title: 'SLOs',
    filter: {
      [`metadata.annotations.${ANNOTATION_NOBL9_PROJECT}`]: { $exists: true },
    },
    loader: () => import('./components/SloPage').then(m => <m.SloPage />),
  },
});

/**
 * Nobl9 plugin for the new Backstage frontend system.
 *
 * @alpha
 */
export default createFrontendPlugin({
  pluginId: 'nobl9',
  extensions: [nobl9EntityContent],
});
