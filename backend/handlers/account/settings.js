import bcrypt from 'bcryptjs'
import { now } from "#lib/utils/datetime"
import { EMAIL_TAKEN, EXPIRED_SESSION, INTERNAL_ERROR, USERNAME_TAKEN, USER_ALREADY_EXISTS, WRONG_INPUT } from "#lib/utils/error_messages"
import * as security from "#lib/utils/security"
import { createAuthToken } from "#handlers/account/_utils"
import { QueryExecutor } from "#lib/utils/database"
import * as tools from '#lib/utils/tools' 

export async function settings({ send, error, db, data, user }) {
    var { username, email, password } = tools.removeEmptyStrings(data)

    if(allEmpty(username, email, password))
        return error(WRONG_INPUT)

    let { result, ok: user_ok } = await QueryExecutor('users', db)
        .select()
        .where('username = ? OR email = ?', username, email)
        .runGetFirst()

    if (!user_ok) return error(INTERNAL_ERROR)

    if (result != undefined) {
        if (result.username.toLowerCase() == username?.toLowerCase())
            return error(USERNAME_TAKEN)
        else if (result.email.toLowerCase() == email?.toLowerCase())
            return error(EMAIL_TAKEN)
        else
            return error(USER_ALREADY_EXISTS)
    }

    let { ok: updated_user } = await QueryExecutor('users', db)
        .updateDefined({
            username,
            email,
            password: (password ? (await bcrypt.hash(password, 12)).toString() : undefined)
        })
        .where('public_id = ?', user.public_id)
        .run()

    if (!updated_user)
        return error(INTERNAL_ERROR, true);

    return send({})
}

function allEmpty(...data){
    return data.every((o) => o == undefined || o.trim().length == 0)
}