const TOKEN_KEY = "auth_token"

export function SetToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

export function AddToken(json) {
    const token = localStorage.getItem(TOKEN_KEY);
    json["auth_token"] = token

    return json
}