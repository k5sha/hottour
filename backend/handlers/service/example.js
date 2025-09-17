import { INTERNAL_ERROR, WRONG_INPUT} from "#lib/utils/error_messages"
import { QueryExecutor } from "#lib/utils/database"
import * as security from '#lib/utils/security'

/**
 * data -- вхідні дані
 * user -- аутентифікований користувач
 * (можна довіряти даним; account/check.js)
 * 
 * send -- надіслати ОК з відповіддю
 * error -- надіслати помилку
 * 
 * security.valid(data, string[], number[], boolean[])
 * -- перевірка наявності полів у data
 * 
 */
export async function example({ send, error, db, data, user }) {
    let { username, password, email } = data;

    if (!security.valid(data, ['username', 'password', 'email']))
        return error(WRONG_INPUT, true);

    let { result, ok } = await QueryExecutor('users', db)
        .update({
            session_key: null
        })
        .where('public_id = ?', user.public_id)
        .run()

    // let { result, ok } = await QueryExecutor('users', db)
    //     .sql('UPDATE users SET session_key = NULL WHERE public_id = ?', [user.public_id])
    //     .run()

    if (!ok)
        return error(INTERNAL_ERROR, true);

    return send({})
}