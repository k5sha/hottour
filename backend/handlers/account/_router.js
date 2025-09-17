import { check } from "#handlers/account/check";
import { login } from "#handlers/account/login";
import { register } from "#handlers/account/register";
import { settings } from "#handlers/account/settings";
import { logout } from "#handlers/account/logout";

export const account = {
    check,
    login,
    logout,
    register,
    settings
}