import { FORBIDDEN, INTERNAL_ERROR, WRONG_INPUT } from "#lib/utils/error_messages"
import { QueryExecutor } from "#lib/utils/database"
import * as security from '#lib/utils/security'
import { now } from "#lib/utils/datetime";


export async function create({ send, error, db, data, user, files }) {
    try{ data.rating = parseFloat(data.rating) } catch(e){}
    if (!security.valid(data, ['reference_id', 'reference_type', 'comment'], ['rating']))
        return error(WRONG_INPUT, true);

    data.rating = Math.max(0, Math.min(data.rating, 5))

    let review = {
        public_id: security.uniqid(),
        user_id: user.public_id,
        reference_id: data.reference_id,
        reference_type: data.reference_type,
        comment: data.comment,
        rating: data.rating,
        created_at: now()
    };

    let { ok } = await QueryExecutor('reviews', db)
        .insert(review)
        .run()

    if (!ok)
        return error(INTERNAL_ERROR, true);

    return send(review)
}