import { create } from "#handlers/hotel/create";
import { edit } from "#handlers/hotel/edit";
import { deleteCall } from "#handlers/hotel/delete";
import { get } from "#handlers/hotel/get";

export const hotel = {
    create,
    edit,
    delete: deleteCall,
    get
}