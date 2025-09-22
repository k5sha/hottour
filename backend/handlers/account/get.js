import { now, timestamp } from '#lib/utils/datetime'
import * as security from '#lib/utils/security'

import { QueryExecutor } from '#lib/utils/database'
import { FORBIDDEN, INTERNAL_ERROR, USER_NOT_FOUND, WRONG_INPUT, WRONG_PASSWORD } from '#lib/utils/error_messages'
import { createAuthToken } from '#handlers/account/_utils'

export async function get({ send, error, db, data, user }) {
    if (!security.valid(data, ['public_id']))
        return error(WRONG_INPUT, true)

    let { result, ok } = await QueryExecutor('users', db)
        .select()
        .where('public_id = ?', data.public_id)
        .runGetFirst()

    if (!ok)
        return error(INTERNAL_ERROR)
    if (result == undefined)
        return error(USER_NOT_FOUND)
    if (!user.is_admin && user.public_id != result.public_id)
        return error(FORBIDDEN)

    delete result.session_key;
    delete result.password;
    delete result.id;

    return send(result)
}
