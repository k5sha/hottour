export function read(req) {
    let data = {...req.query, ...req.body}

    if (req.params != undefined)
        return { ...data, ...req.params }

    return data
}

export function send(res, next, response) {
    if (response.ok == undefined) response.ok = true

    if (next != undefined) {
        res.webapp.response = response
        next()
    } else return response
}

export function error(req, res, next, response, writeLog = false) {
    if (writeLog) {
        console.log("Error >> ")
        console.log({
            url: req.url,
            body: req.body,
            query: req.query,
            error: (response)
        })
    }

    return send(res, next, {
        ok: false,
        error: response
    })
}

export function logError(data) {
    console.log("Error >> ")
    console.log(data)
}

export function variables(req, data) {
    var isDataInBody = req.body != undefined;
    Object.keys(data).forEach(key => {
        if (isDataInBody) req.body[key] = data[key]
        else req.query[key] = data[key]
    });
    return req
}

/**
 * Deep Equal of JSONs
 */
export function deepEqual(obj1, obj2, limit = 1000) {
    if (limit <= 0) return undefined;

    if (obj1 === obj2) return true;

    if (typeof obj1 !== "object" || typeof obj2 !== "object" || obj1 === null || obj2 === null) return false;

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (const key of keys1) {
        if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key], limit - 1)) return false;
    }

    return true;
}

/**
 * EG, 'true' -> false
 *     '123' -> false
 *     'null' -> false
 *     '"I'm a string"' -> false
 */
export function tryParseJSONObject(jsonString) {
    if (typeof jsonString !== 'string') return jsonString

    jsonString = jsonString.trim()
    if (jsonString[0] != '{' && jsonString[0] != '[') {
        return jsonString;
    }
    try {
        var o = JSON.parse(jsonString);

        // Handle non-exception-throwing cases:
        // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
        // but... JSON.parse(null) returns null, and typeof null === "object", 
        // so we must check for that, too. Thankfully, null is falsey, so this suffices:
        if (o && typeof o === "object") {
            return o;
        }
    }
    catch (e) { }

    return jsonString;
};

export function removeEmptyStrings(obj) {
    Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'string' && obj[key].trim().length == 0) {
            delete obj[key];
        }
    });
    return obj;
}