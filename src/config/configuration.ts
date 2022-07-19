export default () => ({
  port: parseInt(process.env.PORT, 10) || 5000,
  hasSaltSize: parseInt(process.env.SALTSIZE) || 20,
  secretJwt: process.env.SECRET_JWT,
  database: {
    MONGODB_URI: process.env.MONGODB_URI,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    redisHost: process.env.REDIS_HOST,
    redisPort: parseInt(process.env.REDIS_PORT),
    redisTtl: parseInt(process.env.REDIS_TTL) || 5,
  },
})
