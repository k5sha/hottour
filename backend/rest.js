import * as db from '#lib/utils/database'
import * as tools from '#lib/utils/tools'
import express from 'express'
import { getClientIp } from 'request-ip'
import { INTERNAL_ERROR, NOT_FOUND } from '#lib/utils/error_messages'
import { account } from '#handlers/account/_router'
import { service } from '#handlers/service/_router'
import config from 'config'
import multer from 'multer'
import { hotel } from '#handlers/hotel/_router'
import path from 'node:path'
import { tour } from '#handlers/tour/_router'
import { booking } from '#handlers/booking/_router'

const UPLOADS_DIRECTORY = config.get('path.uploads')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIRECTORY)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage })

const auth_router = express.Router()
const router = express.Router()
const public_router = express.Router()

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
        },

        file: req.file,
        files: req.files
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

router.use(upload.any(), async function (req, res, next) {
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

public_router.use(async function (req, res, next) {
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

/**
 * Routes
 */

auth_router.post('/login', (req, res, next) => account.login(payload(req, res, next)))
auth_router.post('/register', (req, res, next) => account.register(payload(req, res, next)))
router.post('/me', (req, res, next) => account.me(payload(req, res, next)))
router.post('/bookings', (req, res, next) => account.bookings(payload(req, res, next)))
router.post('/logout', (req, res, next) => account.logout(payload(req, res, next)))

router.post('/hotel/create', (req, res, next) => hotel.create(payload(req, res, next)))
router.post('/hotel/edit', (req, res, next) => hotel.edit(payload(req, res, next)))
router.post('/hotel/delete', (req, res, next) => hotel.delete(payload(req, res, next)))
public_router.post('/hotel/get', (req, res, next) => hotel.get(payload(req, res, next)))

router.post('/tour/create', (req, res, next) => tour.create(payload(req, res, next)))
router.post('/tour/edit', (req, res, next) => tour.edit(payload(req, res, next)))
router.post('/tour/delete', (req, res, next) => tour.delete(payload(req, res, next)))
public_router.post('/tour/get', (req, res, next) => tour.get(payload(req, res, next)))

router.post('/booking/hotel', (req, res, next) => booking.hotel(payload(req, res, next)))
router.post('/booking/tour', (req, res, next) => booking.tour(payload(req, res, next)))
public_router.post('/booking/get', (req, res, next) => booking.get(payload(req, res, next)))

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

    let response = res.webapp.response ?? { ok: false, error: NOT_FOUND }
    if (response.ok) res.send(response)
    else res.status(400).send(response)
}

auth_router.use(router_exit)
router.use(router_exit)
public_router.use(router_exit)

export {
    router,
    auth_router,
    public_router
}