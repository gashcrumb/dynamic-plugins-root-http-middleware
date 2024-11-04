import { MiddlewareFactory } from '@backstage/backend-defaults/rootHttpRouter';
import { createLegacyAuthAdapters } from '@backstage/backend-common';
import {
  DiscoveryService,
  HttpAuthService,
  LoggerService,
} from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import express from 'express';
import Router from 'express-promise-router';

export interface RouterOptions {
  logger: LoggerService;
  config: Config;
  discovery: DiscoveryService;
  httpAuth?: HttpAuthService;
}

type ChatMessage = {
  nickname: string;
  timestamp: string;
  message: string;
};

const messages: ChatMessage[] = [];

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, config } = options;
  const { httpAuth } = createLegacyAuthAdapters(options);

  const router = Router();
  router.use(express.json());

  router.post('/', async (req, res) => {
    await httpAuth.credentials(req, { allow: ['user'] });
    const { nickname, message } = await req.body;
    const proxyTestHeader = req.headers['x-proxy-test-header'] as
      | string
      | undefined;
    messages.push({
      nickname,
      timestamp: new Date().toLocaleTimeString('en-US'),
      message: proxyTestHeader
        ? `"${message}" with test header value "${proxyTestHeader}"`
        : message,
    });
    res.end();
  });

  router.get('/', async (req, res) => {
    await httpAuth.credentials(req, { allow: ['user'] });
    res.status(200).json({ messages });
  });

  const middleware = MiddlewareFactory.create({ logger, config });

  router.use(middleware.error());
  return router;
}
