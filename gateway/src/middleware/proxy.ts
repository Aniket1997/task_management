import { createProxyMiddleware, RequestHandler } from 'http-proxy-middleware';
import { IncomingMessage } from 'http';
import { ClientRequest } from 'http';
import config from '../config';

export const createServiceProxy = (serviceName: string): RequestHandler => {
  const service = config.services[serviceName];
  return createProxyMiddleware({
    target: service.url,
    changeOrigin: true,
    on: {
      proxyReq: (proxyReq: ClientRequest, req: IncomingMessage & { body?: Record<string, unknown> }) => {
        if (req.body && Object.keys(req.body).length > 0) {
          const bodyData = JSON.stringify(req.body);
          proxyReq.setHeader('Content-Type', 'application/json');
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
        }
      },
    },
  });
};
