import { FORBIDDEN, INTERNAL_ERROR, WRONG_INPUT } from "#lib/utils/error_messages"
import { QueryExecutor } from "#lib/utils/database"
import * as security from '#lib/utils/security'

export async function get({ send, error, db, data, user, files }) {
    let { public_id } = data;

    let hotels = []
    if (public_id != undefined) {
        let { result, ok } = await QueryExecutor('hotels', db)
            .sql(`SELECT
                    t.*,
                    CAST(AVG(r.rating) AS INT) AS rating
                FROM
                    hotels AS t
                LEFT JOIN
                    reviews AS r ON t.public_id = r.reference_id
                WHERE
                    t.public_id = ?
                GROUP BY
                    t.public_id`, public_id)
            .runGetFirst()

        if (!ok)
            return error(INTERNAL_ERROR, true);

        hotels = result
    } else {
        let { result, ok } = await QueryExecutor('hotels', db)
            .sql(`SELECT
                    t.*,
                    CAST(AVG(r.rating) AS INT) AS rating
                FROM
                    hotels AS t
                LEFT JOIN
                    reviews AS r ON t.public_id = r.reference_id
                GROUP BY
                    t.public_id;`)
            .run()

        if (!ok)
            return error(INTERNAL_ERROR, true);

        hotels = result
    }

    return send(hotels)
}