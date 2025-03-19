import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { IServerConfig } from './config';
import router from './routes';

class Server {
  private static instance: Server;

  private readonly app: express.Application;

  private readonly config: IServerConfig;

  private constructor(config: IServerConfig) {
    this.app = express();
    this.config = config;
  }

  public static getInstance(config: IServerConfig): Server {
    if (!Server.instance) {
      Server.instance = new Server(config);
      Server.instance.bootStrap();
    }
    return Server.instance;
  }

  getApp(): express.Application {
    return this.app;
  }

  private bootStrap(): void {
    this.configureMiddlewares();
    this.configureRoutes();
  }

  private configureMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(morgan(this.config.morganLogLevel));
  }

  private configureRoutes(): void {
    this.app.use(router);
  }

  run = async (): Promise<void> => {
    this.app.listen(this.config.port, () => {
      console.info(`Node server running in ${this.config.devMode} on PORT ${this.config.port}`);
    });
  };
}

export default Server;
