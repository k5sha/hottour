import * as db from '#lib/utils/database'
import { connectMySql } from "#lib/utils/database";


export async function testInput(data){
    await connectMySql();
    const connection = await db.getConnection()

    return {
        send: function (response) {
            console.log(response)
        },
        error: function (response) {
            console.log(response)
        },
        log: function (response) {
            console.log(response)
        },
        db: connection,
        data: data
    }
}