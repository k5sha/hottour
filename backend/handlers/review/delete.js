import { FORBIDDEN, INTERNAL_ERROR, NOT_FOUND, WRONG_INPUT } from "#lib/utils/error_messages"
import { QueryExecutor } from "#lib/utils/database"
import * as security from '#lib/utils/security'

export async function deleteCall({ send, error, db, data, user, files }) {
    if (!security.valid(data, ['public_id']))
        return error(WRONG_INPUT, true);

    let { public_id } = data;

    let { result: review } = await QueryExecutor('reviews', db)
        .select()
        .where('public_id = ?', public_id)
        .runGetFirst()

    if(review == undefined)
        return error(NOT_FOUND)

    if(!user.is_admin && review.user_id != user.public_id)
        return error(FORBIDDEN)

    let { ok } = await QueryExecutor('reviews', db)
        .delete()
        .where('public_id = ?', public_id)
        .run()

    if (!ok)
        return error(INTERNAL_ERROR, true);

    return send({})
}