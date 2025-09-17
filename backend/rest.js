import * as db from '#lib/utils/database'
import * as tools from '#lib/utils/tools'
import express from 'express'
import { getClientIp } from 'request-ip'
import { INTERNAL_ERROR, NOT_FOUND } from '#lib/utils/error_messages'
import { account } from '#handlers/account/_router'
import { service } from '#handlers/service/_router'

const auth_router = express.Router()
const router = express.Router()

function payload(req, res, next) {
    const clientIp = getClientIp(req); 

    let sendFunction = function (response) {
        return tools.send(res, next, response)
    };

    let errorFunction = function (response, writeLog) {
        if (response == INTERNAL_ERROR) writeLog = true
        return tools.error(req, res, next, response, writeLog)
    };

    let logFunction = function (info) {
        return tools.logError({
            url: req.url,
            request: tools.read(req),
            info: info,
        })
    }

    let redirectFunction = async function(url) {
        const client = req.webapp.db
        await db.commit(client)
        db.releaseConnection(client)

        return res.redirect(url)
    }

    let sendFunctionDirect = function (response) {
        return tools.send(res, undefined, response)
    };

    let errorFunctionDirect = function (response, writeLog) {
        if (response == INTERNAL_ERROR) writeLog = true
        return tools.error(req, res, undefined, response, writeLog)
    };
    
    return {
        db: req.webapp.db,
        data: tools.read(req),
        user: req?.penwrite?.user,
        ip: clientIp,
        send: sendFunction,
        error: errorFunction,
        log: logFunction,
        redirect: redirectFunction,
        direct: function (custom_data) {
            return {
                ...this,
                data: {
                    ...this.data,
                    ...custom_data
                },
                send: sendFunctionDirect,
                error: errorFunctionDirect,
                log: logFunction,
            };
        }
    }
}

/**
 * Middleware: security, database
 */

auth_router.use(async function (req, res, next) {
    res.webapp = {}
    req.webapp = {}

    req.webapp.db = await db.getConnection()
    if (req.webapp.db == undefined) {
        tools.logError({
            url: req.url,
            request: tools.read(req),
            info: "Cound not establish connection to database",
        })
        res.send(tools.error(req, res, undefined, INTERNAL_ERROR))
        return;
    }

    await db.beginTransaction(req.webapp.db)

    next()
})

router.use(async function (req, res, next) {
    res.webapp = {}
    req.webapp = {}

    req.webapp.db = await db.getConnection()
    if (req.webapp.db == undefined) {
        tools.logError({
            url: req.url,
            request: tools.read(req),
            info: "Cound not establish connection to database",
        })
        res.send(tools.error(req, res, undefined, INTERNAL_ERROR))
        return;
    }

    const user = await account.check(payload(req, res, next).direct())
    if (!user.ok) {
        db.releaseConnection(req.webapp.db)
        res.send(tools.error(req, res, undefined, user.error))
        return;
    }

    req.penwrite = { user }

    await db.beginTransaction(req.webapp.db)

    next()
})

/**
 * Routes
 */

auth_router.post('/login', (req, res, next) => account.login(payload(req, res, next)))
auth_router.post('/register', (req, res, next) => account.register(payload(req, res, next)))

router.post('/logout', (req, res, next) => account.logout(payload(req, res, next)))
router.post('/settings', (req, res, next) => account.settings(payload(req, res, next)))
auth_router.post('/example', (req, res, next) => service.example(payload(req, res, next)))

/**
 * Exports & send response
 */

async function router_exit(req, res, next) {
    const client = req.webapp.db

    if (res.webapp?.response?.ok)
        await db.commit(client)
    else
        await db.rollback(client)

    db.releaseConnection(client)
    res.send(res.webapp.response ?? { ok: false, error: NOT_FOUND })
}

auth_router.use(router_exit)
router.use(router_exit)

export {
    router,
    auth_router
}