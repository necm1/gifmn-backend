import * as redisStore from 'cache-manager-redis-store';

export const environment = {
  production: false,

  http: {
    host: '127.0.0.1',
    port: 90,
  },

  database: {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'root',
    name: 'test'
  },

  auth: {
    secret: '1337',
    expireIn: '6h'
  },

  cors: {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
  },

  cache: {
    store: redisStore,
    host: 'redis',
    port: 6379,
    ttl: 3000
  }
};
