import { check } from "#handlers/account/check";
import { login } from "#handlers/account/login";
import { register } from "#handlers/account/register";
import { logout } from "#handlers/account/logout";

export const account = {
    check,
    login,
    logout,
    register
}