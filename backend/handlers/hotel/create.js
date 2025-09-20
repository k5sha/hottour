import { FORBIDDEN, INTERNAL_ERROR, WRONG_INPUT} from "#lib/utils/error_messages"
import { QueryExecutor } from "#lib/utils/database"
import * as security from '#lib/utils/security'


export async function create({ send, error, db, data, user, files }) {
    try{ data.price = parseFloat(data?.price) } catch (e) {}
    
    if (!security.valid(data, ['title', 'location', 'description'], ['price']))
        return error(WRONG_INPUT, true);
    
    let { title, location, price, description } = data;

    if(!user.is_admin)
        return error(FORBIDDEN)

    let hotel = {
        public_id: security.uniqid(),
        image: files?.[0]?.filename,
        title, location, price, description
    };

    let { ok } = await QueryExecutor('hotels', db)
        .insert(hotel)
        .run()

    if (!ok)
        return error(INTERNAL_ERROR, true);

    return send(hotel)
}