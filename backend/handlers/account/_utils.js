import * as security from '#lib/utils/security'

export function extractAuthToken(auth_token){
    let data = auth_token.split("@")
    return {
        public_id: data[0],
        session_key: data[1]
    }
}

export function validAuthToken(auth_token){
    let data = extractAuthToken(auth_token)
    if(!security.valid(data, ['public_id', 'session_key']))
        return false
    return true
}

export function createAuthToken(id, session_key){
    return [id, session_key].join('@')
}