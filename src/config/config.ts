import { config as env } from 'dotenv';
import bunyan from 'bunyan';
env({});

class Config {
  public JWT_TOKEN: string | undefined;
  public NODE_ENV: string | undefined;
  public SECRET_KEY_ONE: string | undefined;
  public SECRET_KEY_TWO: string | undefined;
  // Database Properties
  public DB_HOST: string | undefined;
  public DB_PORT: number | undefined;
  public DB_USER: string | undefined;
  public DB_PASSWORD: string | undefined;
  public DB_NAME: string | undefined;
    
  constructor() {
    this.JWT_TOKEN = process.env.JWT_TOKEN || '1234';
    this.NODE_ENV = process.env.NODE_ENV;
    this.SECRET_KEY_ONE = process.env.SECRET_KEY_ONE;
    this.SECRET_KEY_TWO = process.env.SECRET_KEY_TWO;
    this.DB_HOST = process.env.DB_HOST;
    this.DB_PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined;
    this.DB_USER = process.env.DB_USER;
    this.DB_PASSWORD = process.env.DB_PASSWORD;
    this.DB_NAME = process.env.DB_NAME;
  }
    
  public createLogger(name: string): bunyan {
    return bunyan.createLogger({ name, level: 'debug' });
  }

  public validateConfig(): void {
    for (const [key, value] of Object.entries(this)) {
      if (value === undefined) {
        throw new Error(`Configuration ${key} is undefined.`);
      }
    }
  }

 public isProduction(): boolean {
        return this.NODE_ENV === 'production';
    }
}

export const config: Config = new Config();
