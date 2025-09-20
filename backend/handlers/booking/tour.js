import { FORBIDDEN, INTERNAL_ERROR, NOT_FOUND, SIZE_LIMIT, WRONG_INPUT } from "#lib/utils/error_messages"
import { QueryExecutor } from "#lib/utils/database"
import * as security from '#lib/utils/security'


export async function tour({ send, error, db, data, user, log, files }) {
    try{ data.number_of_people = parseFloat(data.number_of_people) }catch(e){}
    if (!security.valid(data, ['tour_id'], ['number_of_people']))
        return error(WRONG_INPUT, true);

    let { tour_id, number_of_people } = data;

    let { result: tour } = await QueryExecutor('tour', db)
        .select()
        .where('public_id = ?', tour_id)
        .runGetFirst()

    if (tour == undefined)
        return error(NOT_FOUND)

    let { result: participents } = await QueryExecutor('tour_bookings', db)
        .sql("SELECT sum(number_of_people) AS total_count FROM tour_bookings WHERE tour_id = ?", tour_id)
        // .select('sum(number_of_people) as total_count')
        // .where('tour_id = ?', tour_id)
        .run()

    if(parseFloat(participents?.[0]?.total_count ?? 0) + number_of_people > tour.participents_limit)
        return error(SIZE_LIMIT)

    let booking = {
        public_id: security.uniqid(),
        user_id: user.public_id,
        tour_id,
        number_of_people
    }

    let { ok } = await QueryExecutor('tour_bookings', db)
        .insert(booking)
        .run()

    if (!ok)
        return error(INTERNAL_ERROR, true);

    return send(booking)
}