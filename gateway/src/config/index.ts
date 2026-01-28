interface ServiceConfig {
  url: string;
  path: string;
}

interface Config {
  port: number;
  services: Record<string, ServiceConfig>;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  services: {
    auth: {
      url: process.env.AUTH_SERVICE_URL || 'http://auth-service:3001',
      path: '/api/auth',
    },
    user: {
      url: process.env.USER_SERVICE_URL || 'http://user-service:3002',
      path: '/api/users',
    },
  },
};

export default config;
