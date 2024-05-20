import React from 'react';
import useAsync from 'react-use/lib/useAsync';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import { Progress, ResponseErrorPanel } from '@backstage/core-components';
import { Entity } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import {
  useApi,
  configApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import { SloGridItem } from '../SloGrid';
import {
  ANNOTATION_NOBL9_PROJECT,
  ANNOTATION_NOBL9_SERVICES,
  ANNOTATION_NOBL9_SLOS,
} from '../constants';
import { N9BackendResponse } from '../../types';

const useStyles = makeStyles(theme => ({
  headerContainer: {
    marginBottom: 34,
  },
  header: {
    fontSize: 24,
  },
  subHeader: {
    color: theme.palette.type === 'dark' ? '#BABBBB' : '#616161',
    fontSize: 14,
    fontWeight: 500,
  },
  projectName: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 4,
  },
  serviceContainer: {
    marginBottom: 16,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 8,
  },
}));

const toQueryStringParams = (entity: Entity) => {
  const project = entity.metadata.annotations?.[ANNOTATION_NOBL9_PROJECT];
  const slos = entity.metadata.annotations?.[ANNOTATION_NOBL9_SLOS];
  const services = entity.metadata.annotations?.[ANNOTATION_NOBL9_SERVICES];

  const params = new URLSearchParams({
    project: project || '',
  });
  if (!!slos) {
    params.append('slos', slos);
  }
  if (!!services) {
    params.append('services', services);
  }
  return params.toString();
};

const getBackendUrl = (config: Config, entity: Entity) => {
  const baseUrl = config.getString('backend.baseUrl');
  const path = config.has('nobl9.backendPluginPath')
    ? config.getString('nobl9.backendPluginPath')
    : '/api/nobl9/slos';
  return `${baseUrl}${path}?${toQueryStringParams(entity)}`;
};

export const SloPage = () => {
  const { entity } = useEntity();
  const config = useApi(configApiRef);
  const identityApi = useApi(identityApiRef);
  const classes = useStyles();

  const { value, loading, error } =
    useAsync(async (): Promise<N9BackendResponse> => {
      const credentials = await identityApi.getCredentials();
      const response = await fetch(getBackendUrl(config, entity), {
        headers: { Authorization: `Bearer ${credentials.token}` },
      });
      return response.json();
    }, [entity]);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return (
    <>
      <div className={classes.headerContainer}>
        <Typography variant="h3" className={classes.header}>
          SLOs
        </Typography>
        <Typography className={classes.subHeader}>
          Service Level Objectives
        </Typography>
      </div>
      <Typography className={classes.projectName}>
        Project: {entity.metadata.annotations?.[ANNOTATION_NOBL9_PROJECT]}
      </Typography>

      {value
        ? Object.entries(value).map(([service, slos]) => (
            <div key={service} className={classes.serviceContainer}>
              <Typography className={classes.serviceName}>
                Service: {service}
              </Typography>
              <Grid container>
                {slos.map(item => (
                  <SloGridItem
                    slo={item}
                    key={item.name}
                    detailsBaseUrl={config.getConfig('nobl9').get('baseUrl')}
                    organization={config.getConfig('nobl9').get('organization')}
                  />
                ))}
              </Grid>
            </div>
          ))
        : null}
    </>
  );
};
