import { create } from "#handlers/reviews/create";
import { edit } from "#handlers/reviews/edit";
import { deleteCall } from "#handlers/reviews/delete";
import { get } from "#handlers/reviews/get";

export const reviews = {
    create,
    edit,
    delete: deleteCall,
    get
}