import { check } from "#handlers/account/check";
import { login } from "#handlers/account/login";
import { register } from "#handlers/account/register";
import { logout } from "#handlers/account/logout";
import { bookings } from "#handlers/account/bookings";
import { me } from "#handlers/account/me";
import { get } from "#handlers/account/get";

export const account = {
    check,
    login,
    logout,
    register,
    bookings,
    me,
    get
}