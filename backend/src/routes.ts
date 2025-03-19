import express from 'express';
import { ErrorHandlerMiddlerware } from './lib/middlewares';
import HealthController from './controllers/HealthController';
import { contestRouter } from './modules/contest';

const router: express.Router = express.Router();


// health check
router.get('/health', HealthController.check);

// contest routes
router.use('/contest', contestRouter);

// Handles '404 not found'
router.use(ErrorHandlerMiddlerware.notFound);

export default router;
