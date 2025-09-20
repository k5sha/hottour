import { FORBIDDEN, INTERNAL_ERROR, WRONG_INPUT } from "#lib/utils/error_messages"
import { QueryExecutor } from "#lib/utils/database"
import * as security from '#lib/utils/security'

export async function bookings({ send, error, db, data, user, files }) {
    let { type } = data;

    let table = 'hotel_bookings'
    if (type == 'hotels') {
        table = 'hotel_bookings'
    } else if (type == 'tours') {
        table = 'tour_bookings'
    }

    let { result, ok } = await QueryExecutor(table, db)
        .select()
        .where('user_id = ?', user.public_id)
        .run()

    if (!ok)
        return error(INTERNAL_ERROR, true);

    return send(result)
}