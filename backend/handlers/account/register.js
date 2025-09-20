import bcrypt from 'bcryptjs'
import { now } from "#lib/utils/datetime"
import { EMAIL_TAKEN, INTERNAL_ERROR, USERNAME_TAKEN, USER_ALREADY_EXISTS, WRONG_INPUT } from "#lib/utils/error_messages"
import * as security from "#lib/utils/security"
import { createAuthToken } from "#handlers/account/_utils"
import { QueryExecutor } from "#lib/utils/database"

export async function register(penwrite) {
    const { send, error, db, data } = penwrite

    if (!security.valid(data, ['full_name', 'sex', 'email', 'phone', 'birth_date', 'password']))
        return error(WRONG_INPUT, true)

    var { username, email, password } = data

    let { result: user, ok: user_ok } = await QueryExecutor('users', db)
        .select('username', 'email')
        .where('username = ? OR email = ?', username, email)
        .runGetFirst()

    if (!user_ok) return error(INTERNAL_ERROR)

    if (user != undefined) {
        if (user.username.toLowerCase() == username.toLowerCase())
            return error(USERNAME_TAKEN)
        else if (user.email.toLowerCase() == email.toLowerCase())
            return error(EMAIL_TAKEN)
        else
            return error(USER_ALREADY_EXISTS)
    }

    var public_id = security.uniqid();
    var session_key = security.gen(128);
    var join_date = now();


    let user_data = {
        public_id: public_id,
        username: username,
        join_date: join_date,
        email: email,
        unlimited: null,
        symbols_total: 0,
        is_blocked: false,

        // preferences
        // fontfile, pencolor...

        session_key: session_key,
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

    return send(penwrite.user)
}