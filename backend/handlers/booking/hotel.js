import { FORBIDDEN, INTERNAL_ERROR, NOT_FOUND, WRONG_INPUT } from "#lib/utils/error_messages"
import { QueryExecutor } from "#lib/utils/database"
import * as security from '#lib/utils/security'


export async function hotel({ send, error, db, data, user, log, files }) {
    if (!security.valid(data, ['hotel_id', 'from_date', 'to_date']))
        return error(WRONG_INPUT, true);

    let { hotel_id, from_date, to_date } = data;

    let { result: hotel } = await QueryExecutor('hotels', db)
        .select()
        .where('public_id = ?', hotel_id)
        .runGetFirst()

    if (hotel == undefined)
        return error(NOT_FOUND)

    // Потрібно додати кількість номерів до готелів, щоб був сенс слідкувати за овербукингом
    // let { result: overlappedBooking } = await QueryExecutor('hotel_bookings', db)
    //     .select()
    //     .where('from_date <= ? AND to_date >= ?', to_date, from_date)
    //     .runGetFirst()

    // if(overlappedBooking) {
    //     log('Overlaped booking:', overlappedBooking)
    //     return error(OVERLAPPED_BOOKING)
    // }

    let booking = {
        public_id: security.uniqid(),
        user_id: user.public_id,
        hotel_id,
        from_date,
        to_date
    }

    let { ok } = await QueryExecutor('hotel_bookings', db)
        .insert(booking)
        .run()

    if (!ok)
        return error(INTERNAL_ERROR, true);

    return send(booking)
}