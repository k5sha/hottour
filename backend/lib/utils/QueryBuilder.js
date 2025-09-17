export default class QueryBuilder {
    constructor(table) {
        this.table = this.escape(table)
        this.query = ""
        this.args = []
        this.keyIndex = 0
    }

    select(...columns) {
        if (columns.length == 0) {
            this.query += `SELECT * FROM ${this.table}`
        } else {
            columns = columns.map(obj => this.escape(obj))
            this.query += `SELECT ${columns.join(', ')} FROM ${this.table}`
        }
        return this
    }

    where(condition, ...args) {
        condition = this.#replaceAndIncrement(condition, this.keyIndex)

        this.query += ` WHERE ${condition}`
        this.args.push(...args)
        this.keyIndex += args.length
        return this
    }

    /**
     * Ascending order:
     * 1 → 2 → 3
     */
    orderByAscending(column) {
        column = this.escape(column)
        return this.#orderBy(column, 'ASC')
    }

    /**
     * Descending order:
     * 3 → 2 → 1
     */
    orderByDescending(column) {
        column = this.escape(column)
        return this.#orderBy(column, 'DESC')
    }

    #orderBy(column, order) {
        this.query += ` ORDER BY ${column} ${order}`
        return this
    }

    limit(limit) {
        this.query += ` LIMIT ?`
        this.args.push(limit)
        return this
    }

    offset(offset) {
        this.query += ` OFFSET ?`
        this.args.push(offset)
        return this
    }

    #findLargestArray(arr) {
        return arr.reduce((acc, curr) => (curr.length > acc.length ? curr : acc));
    }

    #manyInsert(manyData) {
        var keysArray = manyData.map(obj => Object.keys(obj))
        var keys = this.#findLargestArray(keysArray)
        this.query += `INSERT INTO ${this.table} (${keys.join(', ')}) VALUES `
        var prevCounter = 1
        manyData.forEach(data => {
            var preparedValues = Array.from({ length: keys.length }, (_, i) => '?');
            prevCounter += keys.length
            this.query += `(${preparedValues.join(', ')}),`
            this.args.push(...keys.map(key => {
                var obj = data[key]
                if (obj == null) return undefined;
                return canJSONstringify(obj) ? JSON.stringify(obj) : obj
            }))
        })
        this.query = this.query.substring(0, this.query.length - 1)
        return this
    }

    insert(data) {
        if (data instanceof Array) {
            return this.#manyInsert(data)
        }
        const keys = Object.keys(data)
        const values = Object.values(data).map((obj) => {
            if (obj == null) return undefined;
            return canJSONstringify(obj) ? JSON.stringify(obj) : obj
        })
        const preparedValues = Array.from({ length: keys.length }, (_, i) => '?');

        this.query += `INSERT INTO ${this.table} (${keys.join(', ')}) VALUES (${preparedValues.join(', ')}) `
        this.args.push(...values)
        return this
    }

    delete() {
        this.query += `DELETE FROM ${this.table}`
        return this
    }

    update(data) {
        const keys = Object.keys(data);
        // const values = Object.values(data);
        const values = Object.values(data).map((obj) => {
            if (obj == null) return undefined;
            return canJSONstringify(obj) ? JSON.stringify(obj) : obj
        })
        const updateParts = keys.map((key, index) => `${key} = ?`).join(', ');

        this.query += `UPDATE ${this.table} SET ${updateParts}`;
        this.args.push(...values);
        this.keyIndex += keys.length
        return this
    }

    /**
     * Skips undefined values
     */
    updateDefined(data) {
        data = this.#removeUndefined(data)
        return this.update(data)
    }

    /**
     * Generates custom update query (UPDATE table SET condition; with args)
     * @param {*} condition what should be updated and how, for ex.: "from = from - $1, to = to + $1"
     * @param  {...any} args arguments
     */
    updateQuery(condition, ...args) {
        condition = this.#replaceAndIncrement(condition, this.keyIndex)

        this.query += `UPDATE ${this.table} SET ${condition}`;
        this.args.push(...args);
        this.keyIndex += args.length
        return this
    }

    sql(query, ...args) {
        this.query = query
        this.args = args
        return this
    }

    log() {
        console.log(`Generated Query: ${this.query}`);
        console.log(`Arguments: ${this.args}`)
    }

    /**
     * Removes any character not included in the list:
     * a-z A-Z 0-9 _
     */
    escape(str) {
        if (typeof str !== 'string') {
            return str
        }
        return str.replace(/[^a-zA-Z0-9_]/g, '')
    }

    /**
     * Replaces all $1, $2... with increased by @param increment
     */
    #replaceAndIncrement(str, increment) {
        return str
        // if (increment == 0) return str

        // const regex = /\$(\d+)/g; // Matches $1, $2, etc.
        // let match;
        // let originalString = str;

        // while ((match = regex.exec(originalString)) !== null) {
        //     const groupIndex = parseInt(match[1]);
        //     const replacement = '$' + (groupIndex + increment);
        //     str = str.substring(0, match.index) + replacement + str.substring(match.index + match.length);
        // }

        // return str;
    }

    #removeUndefined(obj) {
        Object.keys(obj).forEach(key => {
            if (obj[key] === undefined) {
                delete obj[key];
            }
        });
        return obj;
    }

    increase(data) {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const updateParts = keys.map((key, index) => `${key} = ${key} + ?`).join(', ');

        this.query += `UPDATE ${this.table} SET ${updateParts}`;
        this.args.push(...values);
        this.keyIndex += keys.length
        return this;
    }

    decrease(data) {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const updateParts = keys.map((key, index) => `${key} = ${key} - ?`).join(', ');

        this.query += `UPDATE ${this.table} SET ${updateParts}`;
        this.args.push(...values);
        this.keyIndex += keys.length
        return this;
    }
}


function canJSONstringify(data) {
    return (typeof data === 'object' && data.constructor === ({}).constructor) || Array.isArray(data)
}