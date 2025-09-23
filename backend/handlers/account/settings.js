import bcrypt from 'bcryptjs'
import { now } from "#lib/utils/datetime"
import { EMAIL_TAKEN, EXPIRED_SESSION, INTERNAL_ERROR, PHONE_TAKEN, USER_ALREADY_EXISTS, WRONG_INPUT } from "#lib/utils/error_messages"
import * as security from "#lib/utils/security"
import { createAuthToken } from "#handlers/account/_utils"
import { QueryExecutor } from "#lib/utils/database"
import * as tools from '#lib/utils/tools' 

export async function settings({ send, error, db, data, user }) {
    var { full_name, birth_date, sex, phone, email, password } = tools.removeEmptyStrings(data)

    if(allEmpty(full_name, sex, phone, email, password))
        return error(WRONG_INPUT)

    let { result, ok: user_ok } = await QueryExecutor('users', db)
        .select()
        .where('phone = ? OR email = ?', phone, email)
        .runGetFirst()

    if (!user_ok) return error(INTERNAL_ERROR)

    if (result != undefined) {
        if (result.phone.toLowerCase() == phone?.toLowerCase())
            return error(PHONE_TAKEN)
        else if (result.email.toLowerCase() == email?.toLowerCase())
            return error(EMAIL_TAKEN)
        else
            return error(INTERNAL_ERROR)
    }

    let { ok: updated_user } = await QueryExecutor('users', db)
        .updateDefined({
            full_name,
            birth_date,
            sex,
            phone,
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