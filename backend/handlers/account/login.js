import { now, timestamp } from '#lib/utils/datetime'
import * as security from '#lib/utils/security'
import bcrypt from 'bcryptjs'

import { QueryExecutor } from '#lib/utils/database'
import { INTERNAL_ERROR, USER_NOT_FOUND, WRONG_INPUT, WRONG_PASSWORD } from '#lib/utils/error_messages'
import { createAuthToken } from '#handlers/account/_utils'

export async function login({ send, error, db, data }) {
    if (!security.valid(data, ['login', 'password']))
        return error(WRONG_INPUT, true)

    var { login, password } = data
    let query;

    if (login.includes("@"))
        query = QueryExecutor('users', db)
            .select()
            .where('email = ?', login)
    else
        query = QueryExecutor('users', db)
            .select()
            .where('username = ?', login)

    let { result: user, ok: user_ok } = await query.runGetFirst()

    if (!user_ok) return error(INTERNAL_ERROR)
    if (user == undefined) return error(USER_NOT_FOUND)
    if (!bcrypt.compareSync(password, user.password)) return error(WRONG_PASSWORD)

    var session_key = security.gen(128)

    let { ok } = await QueryExecutor('users', db)
        .update({ session_key })
        .where('public_id = ?', user.public_id)
        .run()

    if (!ok) return error(INTERNAL_ERROR)

    return send({
        auth_token: createAuthToken(user.public_id, session_key),
        session_key: session_key,
        username: user.username,
        options: user.options
    })
}
