export default () => ({
  port: parseInt(process.env.PORT, 10) || 5000,
  database: {
    MONGODB_URI: process.env.MONGODB_URI,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  },
})
