import dotenv from 'dotenv';
import IServerConfig from './IConfig';

dotenv.config();

// Load configuration from .env file
const serverConfig: IServerConfig = Object.freeze({
  devMode: process.env.DEV_MODE ?? 'development',
  port: parseInt(process.env.PORT ?? '8080', 10),
  morganLogLevel: process.env.MORGAN_LOGLEVEL ?? 'dev',
  apis: {
    leetcode: process.env.API_LEETCODE ?? '',
    codeforces: process.env.API_CODEFORCES ?? '',
    codechef: process.env.API_CODECHEF ?? '',
  },
});

export default serverConfig;
