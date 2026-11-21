require('dotenv').config({ quiet: true });

const env = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  sessionSecret: process.env.SESSION_SECRET,
  databasePath: process.env.DATABASE_PATH || './server/database/studysync.db',
};

module.exports = env;