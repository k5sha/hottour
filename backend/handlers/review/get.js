import { FORBIDDEN, INTERNAL_ERROR, WRONG_INPUT} from "#lib/utils/error_messages"
import { QueryExecutor } from "#lib/utils/database"
import * as security from '#lib/utils/security'

export async function get({ send, error, db, data, user, files }) {
    let { public_id } = data;

    let reviews = []
    if(public_id != undefined){
        let { result, ok } = await QueryExecutor('reviews', db)
            .select()
            .where('public_id = ?', public_id)
            .runGetFirst()

        if (!ok)
            return error(INTERNAL_ERROR, true);

        reviews = result
    }else {
        let { result, ok } = await QueryExecutor('reviews', db)
            .select()
            .run()

        if (!ok)
            return error(INTERNAL_ERROR, true);

        reviews = result
    }

    return send(reviews)
}