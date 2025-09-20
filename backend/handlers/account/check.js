import * as security from '#lib/utils/security'

import { EXPIRED_SESSION, INTERNAL_ERROR, USER_NOT_FOUND, WRONG_INPUT } from '#lib/utils/error_messages';
import { QueryExecutor } from '#lib/utils/database';
import { extractAuthToken, validAuthToken } from '#handlers/account/_utils';


export async function check({ data, send, error, db }) {
    if (!security.valid(data, ['auth_token']) || !validAuthToken(data.auth_token))
        return error(WRONG_INPUT);

    const { public_id, session_key } = extractAuthToken(data.auth_token)

    var { result: user, ok } = await QueryExecutor('users', db)
        .select()
        .where('public_id = ?', public_id)
        .runGetFirst()

    if (!ok) return error(INTERNAL_ERROR)
    if (user == undefined) return error(USER_NOT_FOUND)
    if (user.session_key !== session_key) return error(EXPIRED_SESSION)

    delete user.session_key;
    delete user.password;
    delete user.id;

    return send({
        ...user
    })
}
