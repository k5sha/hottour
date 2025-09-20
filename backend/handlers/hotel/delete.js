import { FORBIDDEN, INTERNAL_ERROR, NOT_FOUND, WRONG_INPUT } from "#lib/utils/error_messages"
import { QueryExecutor } from "#lib/utils/database"
import * as security from '#lib/utils/security'
import config from 'config'
import { join } from 'path'
import fs from 'node:fs/promises'

const UPLOADS_DIRECTORY = config.get('path.uploads')

export async function deleteCall({ send, error, db, data, user, files }) {
    try { data.price = parseFloat(data?.price) } catch (e) { }
    if (!security.valid(data, ['public_id']))
        return error(WRONG_INPUT, true);

    let { public_id } = data;

    if(!user.is_admin)
        return error(FORBIDDEN)

    let { result: prev_hotel } = await QueryExecutor('hotels', db)
        .select('image')
        .where('public_id = ?', public_id)
        .runGetFirst()

    if(prev_hotel == undefined)
            return error(NOT_FOUND)

    await fs.unlink(join(UPLOADS_DIRECTORY, prev_hotel.image))

    let { ok } = await QueryExecutor('hotels', db)
        .delete()
        .where('public_id = ?', public_id)
        .run()

    if (!ok)
        return error(INTERNAL_ERROR, true);

    return send({})
}