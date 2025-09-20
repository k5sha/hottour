import { FORBIDDEN, INTERNAL_ERROR, WRONG_INPUT} from "#lib/utils/error_messages"
import { QueryExecutor } from "#lib/utils/database"
import * as security from '#lib/utils/security'

export async function get({ send, error, db, data, user, files }) {
    let { public_id, type } = data;

    let table = 'hotel_bookings'
    if(type == 'hotels') {
        table = 'hotel_bookings'
    }else if(type == 'tours') {
        table = 'tour_bookings'
    }

    let hotels = []
    if(public_id != undefined){
        let { result, ok } = await QueryExecutor(table, db)
            .select()
            .where('public_id = ?', public_id)
            .runGetFirst()

        if(!user.is_admin && user.public_id != result.user_id)
            return error(FORBIDDEN);

        if (!ok)
            return error(INTERNAL_ERROR, true);

        hotels = result
    }else {
        if(!user.is_admin)
            return error(FORBIDDEN)

        let { result, ok } = await QueryExecutor(table, db)
            .select()
            .run()

        if (!ok)
            return error(INTERNAL_ERROR, true);

        hotels = result
    }

    return send(hotels)
}