import { create } from "#handlers/review/create";
import { edit } from "#handlers/review/edit";
import { deleteCall } from "#handlers/review/delete";
import { get } from "#handlers/review/get";

export const review = {
    create,
    edit,
    delete: deleteCall,
    get
}