import config from 'config'
import express from 'express'
import { auth_router, router, public_router } from '#rest'
import cookieParser from 'cookie-parser'
import { connectMySql } from '#lib/utils/database'
import cors from "cors";
import bodyParser from 'body-parser'

/**
 *      Config
 */

const isProduction = config.get('isProduction')

/**
 *      Database
 */

await connectMySql();

/**
 *      Express
 */

const app = express()

if(!isProduction)
    app.use(cors())


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api", router)
app.use("/auth", auth_router)
app.use("/public/api", public_router)

app.listen(5020, () => {
    console.log("Server started");
    console.log(new Date())
    console.log("http://localhost:5020/api");
    console.log("http://localhost:5020/auth");
});

