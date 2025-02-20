import { CacheService, LoggerService } from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import express from 'express';
import Router from 'express-promise-router';
import { MiddlewareFactory } from '@backstage/backend-defaults/rootHttpRouter';
import { groupBy } from './utils';

const defaultTokenTTL = 55 * 60000;
const slosPerPage = 500;

export interface Nobl9Configuration {
  baseUrl: string;
  organization: string;
  clientId: string;
  clientSecret: string;
}

export interface RouterOptions {
  logger: LoggerService;
  cache: CacheService;
  config: Config;
}

const getAccessToken = async (
  nobl9Config: Nobl9Configuration,
  cache: CacheService,
  logger: LoggerService,
) => {
  const token = await cache.get('accessToken');
  if (token) {
    logger.debug('found accessToken in cache');
    return token;
  }

  logger.debug('accessToken not present in cache, fetching from api');

  const credentials = Buffer.from(
    `${nobl9Config.clientId}:${nobl9Config.clientSecret}`,
  ).toString('base64');
  const response = await fetch(`${nobl9Config.baseUrl}/api/accessToken`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      Organization: nobl9Config.organization,
    },
  });

  if (!response.ok) {
    throw new Error(`accessToken couldn't not be fetched`);
  }
  const data = await response.json();
  cache.set('accessToken', data.access_token, { ttl: defaultTokenTTL });
  return data.access_token;
};

const getAllSlos = async (
  url: string,
  accessToken: string,
  organization: string,
  previousResponse: any,
): Promise<any> => {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Organization: organization,
    },
  });
  if (!res.ok) {
    return res;
  }

  const { data, links } = await res.json();
  const response = [...previousResponse, ...data];

  if (links.next) {
    return await getAllSlos(links.next, accessToken, organization, response);
  }

  return { ok: true, data: response };
};

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  console.log('starting Nobl9 backend plugin');
  const { logger, cache, config } = options;

  const nobl9Config = {
    baseUrl: config.getConfig('nobl9').get('baseUrl')?.toString() || '',
    organization:
      config.getConfig('nobl9').get('organization')?.toString() || '',
    clientId: config.getConfig('nobl9').get('clientId')?.toString() || '',
    clientSecret:
      config.getConfig('nobl9').get('clientSecret')?.toString() || '',
  };
  const router = Router();
  router.use(express.json());

  router.get('/health', (_: any, response: any) => {
    logger.info('PONG!');
    response.json({ status: 'ok' });
  });

  router.get('/slos', async (req: any, response: any) => {
    const accessToken = await getAccessToken(nobl9Config, cache, logger);
    const project = req.query.project;
    const slos = req.query.slos?.split(',') || [];
    const services = req.query.services?.split(',') || [];

    const result = await getAllSlos(
      `${nobl9Config.baseUrl}/api/v1/slos?limit=${slosPerPage}`,
      accessToken,
      nobl9Config.organization,
      [],
    );
    if (!result.ok) {
      logger.error(result);
      response.status(500);
    }
    const filteredData = result.data.filter(
      (slo: any) =>
        slo.project === project &&
        (!slos.length || slos.includes(slo.name)) &&
        (!services.length || services.includes(slo.service)),
    );

    response.json(groupBy(filteredData, (slo: any) => slo.service));
  });

  const middleware = MiddlewareFactory.create({ logger, config });
  router.use(middleware.error());
  return router;
}
