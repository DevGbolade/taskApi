import {
  Application,
  json,
  urlencoded,
  Request,
  Response,
  NextFunction,
} from "express";
import { StatusCodes as HTTP_STATUS } from "http-status-codes";
import http from "http";
import hpp from "hpp";
import { config } from "./config/config";
import Logger from "bunyan";
import helmet from "helmet";
import cors from "cors";
import cookieSession from "cookie-session";
import compression from "compression";
import { serveSwagger, setupSwagger } from "./docs/swagger";
import { rateLimiterMiddleware } from "./middleware/rateLimit.middleware";
import authRoutes from "./routes/auth.routes";
import { taskRoutes } from "./routes/task.routes";
const SERVER_PORT = 5070;
const log: Logger = config.createLogger("server");

export class Server {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }
  public start() {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routeMiddleware(this.app);
    this.globalErrorHandler(this.app);
    this.startServer(this.app);
  }

  private async securityMiddleware(app: Application) {
    app.use(
      cors({
        origin: "http://localhost:3000",
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      })
    );
    app.use(
      cookieSession({
        name: "session",
        keys: [config.SECRET_KEY_ONE!, config.SECRET_KEY_TWO!],
        maxAge: 24 * 7 * 3600000,
        secure: config.NODE_ENV !== "development",
      })
    );
    app.use(helmet());
    app.use(hpp());
    app.use(rateLimiterMiddleware);
   
  }
  private async standardMiddleware(app: Application) {
    app.use(compression());
    app.use(json({ limit: "50mb" }));
    app.use(urlencoded({ extended: true, limit: "50mb" }));
  }
  private globalErrorHandler(app: Application): void {
    app.all("*", (req: Request, res: Response) => {
      res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: `${req.originalUrl} not found` });
    });

    app.use(
      (error: any, _req: Request, _res: Response, next: NextFunction): void => {
        log.error(error);
        next();
      }
    );
  }
  private async startServer(app: Application) {
    try {
      const httpServer: http.Server = new http.Server(app);
      this.startHttpServer(httpServer);
    } catch (error) {
      log.error(error);
    }
  }
  private startHttpServer(httpServer: http.Server) {
    log.info(`Server has started with process ${process.pid}`);
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Server running on port ${SERVER_PORT}`);
    });
  }

  private async routeMiddleware(app: Application) {
    app.use("/api/docs", serveSwagger, setupSwagger);
    app.use('/api/auth', authRoutes);
    app.use('/api/tasks', taskRoutes);

  }
  private async apiMonitoring(_app: Application) {}
}
