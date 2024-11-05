import { rootHttpRouterServiceFactory } from '@backstage/backend-defaults/rootHttpRouter';
import { BackendFeature, LoggerService } from '@backstage/backend-plugin-api';

import { NextFunction, Request, RequestHandler, Response } from 'express';

type addTestHeaderMiddlewareProps = {
  logger: LoggerService;
};

const addTestHeaderMiddleware = ({
  logger,
}: addTestHeaderMiddlewareProps): RequestHandler => {
  logger.info('Adding custom middleware to http router');
  return async (req: Request, _res: Response, next: NextFunction) => {
    const path = `${req.baseUrl}${req.path}`;
    if (!path.startsWith('/api/simple-chat')) {
      next();
      return;
    }
    if (req.method !== 'GET') {
      if (!req.headers['x-proxy-test-header']) {
        logger.info('Received simple chat message request with no test header');
        req.headers['x-proxy-test-header'] = 'goodbye';
      } else {
        logger.info(
          'Received simple chat message request with existing test header',
        );
      }
    }
    try {
      next();
    } catch (err) {
      logger.info(`Error caught by test header middleware: ${err}`);
    }
  };
};

export const customRootHttpServerFactory: BackendFeature =
  rootHttpRouterServiceFactory({
    configure: ({ app, routes, middleware, logger }) => {
      logger.info(
        'Using custom root HttpRouterServiceFactory configure function',
      );
      app.use(middleware.helmet());
      app.use(middleware.cors());
      app.use(middleware.compression());
      app.use(middleware.logging());
      app.use(addTestHeaderMiddleware({ logger }));
      app.use(routes);
      app.use(middleware.notFound());
      app.use(middleware.error());
    },
  });

export default customRootHttpServerFactory;
