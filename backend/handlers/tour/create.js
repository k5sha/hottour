import { FORBIDDEN, INTERNAL_ERROR, WRONG_INPUT} from "#lib/utils/error_messages"
import { QueryExecutor } from "#lib/utils/database"
import * as security from '#lib/utils/security'


export async function create({ send, error, db, data, user, files }) {
    try{
        data.price = parseFloat(data?.price)
        data.participents_limit = parseFloat(data?.participents_limit)
    } catch (e) {}
    
    if (!security.valid(data, ['title', 'location', 'description', 'from_datetime', 'to_datetime'], ['price', 'participents_limit']))
        return error(WRONG_INPUT, true);
    
    let { from_datetime, to_datetime, title, location, price, description, participents_limit } = data;

    if(!user.is_admin)
        return error(FORBIDDEN)

    let tour = {
        public_id: security.uniqid(),
        image: files?.[0]?.filename,
        title,
        location,
        price,
        description,
        participents_limit,
        from_datetime,
        to_datetime,
    };

    let { ok } = await QueryExecutor('tour', db)
        .insert(tour)
        .run()

    if (!ok)
        return error(INTERNAL_ERROR, true);

    return send(tour)
}