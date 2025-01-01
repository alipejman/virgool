namespace NodeJS {
    interface ProcessEnv {
        // application Port
        PORT:number;
        // Database
        DB_URL: string;
        DB_PORT:number;
        DB_HOST: string;
        DB_USERNAME: string;
        DB_PASSWORD: string;
        DB_NAME: string;
        // Secret key
        SECRET_KEY: string;
        OTP_TOKEN_SECRET: string;
    }
}