import bcrypt from 'bcryptjs'
import { now } from "#lib/utils/datetime"
import { EMAIL_TAKEN, INTERNAL_ERROR, PHONE_TAKEN, USER_ALREADY_EXISTS, WRONG_INPUT } from "#lib/utils/error_messages"
import * as security from "#lib/utils/security"
import { createAuthToken } from "#handlers/account/_utils"
import { QueryExecutor } from "#lib/utils/database"

export async function register(penwrite) {
    const { send, error, db, data } = penwrite

    if (!security.valid(data, ['full_name', 'sex', 'email', 'phone', 'birth_date', 'password']))
        return error(WRONG_INPUT, true)

    var { full_name, sex, email, phone, birth_date, password } = data

    let { result: existing_user, ok: existing_user_ok } = await QueryExecutor('users', db)
        .select()
        .where('email = ? OR phone = ?', email, phone)
        .runGetFirst()

    if (!existing_user_ok) return error(INTERNAL_ERROR)

    if (existing_user != undefined) {
        if (existing_user.phone.toLowerCase() == phone.toLowerCase())
            return error(PHONE_TAKEN)
        else if (existing_user.email.toLowerCase() == email.toLowerCase())
            return error(EMAIL_TAKEN)
        else
            return error(INTERNAL_ERROR)
    }

    var public_id = security.uniqid();
    var session_key = security.gen(128);
    var join_date = now();

    let user_data = {
        public_id,
        full_name,
        sex,
        email,
        phone,
        birth_date,
        session_key,
        is_admin: false,
        join_date,
        password: (await bcrypt.hash(password, 12)).toString(),
    }

    let { ok: created_user } = await QueryExecutor('users', db)
        .insert(user_data)
        .run()

    if (!created_user)
        return error(INTERNAL_ERROR, true);

    penwrite.user = {
        auth_token: createAuthToken(public_id, session_key),
        ...user_data
    }

    delete penwrite.user.password;
    delete penwrite.user.session_key;

    return send(penwrite.user)
}