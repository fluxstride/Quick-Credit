import cors from 'cors';
import express, { Application, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import pageNotFoundMiddleware from './middlewares/404.middleware';
import errorMiddleware from './middlewares/error.middleware';
import controller from './utils/interfaces/controller.interface';

class App {
  express: Application;

  port: number;

  constructor(controllers: controller[], port: number) {
    this.express = express();
    this.port = port;

    this.initializeMiddlewares();
    this.intializeControllers(controllers);
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    this.express.use(cors());
    this.express.use(morgan('dev'));
    this.express.use(helmet());
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
  }

  private intializeControllers(controllers: controller[]): void {
    this.express.get('/', (_, res: Response) => {
      res.json('Welcome to quick_credit api');
    });

    this.express.get('/api', (_, res: Response) => {
      res.redirect('/');
    });

    controllers.forEach(({ router }) => {
      this.express.use('/api/v1', router);
    });
  }

  private initializeErrorHandling(): void {
    // catch 404 and forward to error handler
    this.express.use(pageNotFoundMiddleware);

    // error handler
    this.express.use(errorMiddleware);
  }

  public listen(): void {
    this.express.listen(this.port, () => {
      // eslint-disable-next-line no-console
      console.log(`app listening on port ${this.port}`);
    });
  }
}

export default App;
