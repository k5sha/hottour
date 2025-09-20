import { create } from "#handlers/tour/create";
import { edit } from "#handlers/tour/edit";
import { deleteCall } from "#handlers/tour/delete";
import { get } from "#handlers/tour/get";

export const tour = {
    create,
    edit,
    delete: deleteCall,
    get
}