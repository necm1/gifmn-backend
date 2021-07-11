import * as redisStore from 'cache-manager-redis-store';

export const environment = {
  production: false,

  http: {
    host: '127.0.0.1',
    port: 1337,
    logger: true
  },

  database: {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    name: 'gifmn'
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
    use: true,
    store: redisStore,
    host: 'localhost',
    port: 6379,
    ttl: 3000
  },

  upload: {
    allowedImages: [
      'gif', 'jpeg', 'jpg', 'jfif', 'pjpeg', 'pjp', 'png', 'webp'
    ]
  }
};
