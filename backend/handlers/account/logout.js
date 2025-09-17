import { INTERNAL_ERROR} from "#lib/utils/error_messages"
import { QueryExecutor } from "#lib/utils/database"

export async function logout({ send, error, db, data, user }) {
    let { ok: updated_user } = await QueryExecutor('users', db)
        .update({
            session_key: null
        })
        .where('public_id = ?', user.public_id)
        .run()

    if (!updated_user)
        return error(INTERNAL_ERROR, true);

    return send({})
}