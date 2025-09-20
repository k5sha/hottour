import { FORBIDDEN, INTERNAL_ERROR, WRONG_INPUT } from "#lib/utils/error_messages"
import { QueryExecutor } from "#lib/utils/database"
import * as security from '#lib/utils/security'


export async function create({ send, error, db, data, user, files }) {
    try{ data.rating = parseFloat(data.rating) } catch(e){}
    if (!security.valid(data, ['reference_id', 'reference_type', 'comment', 'created_at'], ['rating']))
        return error(WRONG_INPUT, true);

    let review = {
        public_id: security.uniqid(),
        user_id: user.public_id,
        ...data
    };

    let { ok } = await QueryExecutor('reviews', db)
        .insert(review)
        .run()

    if (!ok)
        return error(INTERNAL_ERROR, true);

    return send(review)
}