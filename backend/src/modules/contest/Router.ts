import express from 'express';
import ContestController from './Controller';

class ControllerRouter {
  private static instance: ControllerRouter;

  public router: express.Router;

  private readonly contestController: ContestController;

  private constructor() {
    this.router = express.Router();
    this.contestController = new ContestController();
    this.setupRoutes();
  }

  static getInstance(): ControllerRouter {
    if (!ControllerRouter.instance) {
      ControllerRouter.instance = new ControllerRouter();
    }

    return ControllerRouter.instance;
  }

  private setupRoutes(): void {
    // Get all users
    this.router.post('/', this.contestController.getContest);
  }
}

const routerInstance: express.Router = ControllerRouter.getInstance().router;
export default routerInstance;
