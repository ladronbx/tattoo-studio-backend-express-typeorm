export { }

export interface TokenDecoded {
  id: number,
  role: string,
  email: string
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production';
            JWT_SECRET: string;

        }
    }

    namespace Express {
        export interface Request {
            // decoded token
            token: TokenDecoded;
        }
    }
}

export interface dataUpdate {
    name?: string,
    email?: string,
    password?: string,
    phone?: number,
}