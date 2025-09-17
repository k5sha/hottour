import config from 'config'
// @ts-ignore
import mysql from 'mysql2/promise';
import QueryBuilder from './QueryBuilder.js';
import { tryParseJSONObject } from './tools.js';

const connectionString = {
  host: config.get("db.host"),
  user: config.get('db.user'),
  database: config.get('db.database'),
  password: config.get('db.password'),
  connectionLimit: 10,
  maxIdle: 5,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
  waitForConnections: true,

  // Object SQL-injection protection (specific for Node applications); https://flattsecurity.medium.com/finding-an-unseen-sql-injection-by-bypassing-escape-functions-in-mysqljs-mysql-90b27f6542b4
  stringifyObjects: true,
};

// due to NodeJS specifications new connection will be available only throught getter
var pool;
export async function getConnection() {
  try {
    return await pool.getConnection();
  } catch (err) {
    console.log("(DB) ERROR => getConnection() => " + JSON.stringify(err));
  }
  return undefined;
}

export function releaseConnection(c) {
  if (c == undefined) return;
  // pool.releaseConnection(c)
  c.release()
}

export async function beginTransaction(client) {
  await client.query('BEGIN')
}

export async function commit(client) {
  await client.query('COMMIT')
}

export async function rollback(client) {
  await client.query('ROLLBACK')
}

export function escape(data) {
  return mysql.escape(data);
}

var connectionAttempts = 0;
var prevError = undefined;
// replace with Connection Pools in future for more stability and performance ( https://sidorares.github.io/node-mysql2/docs#using-connection-pools )
export async function connectMySql() {
  if (connectionAttempts >= 100) {
    console.log("(!!! 1) => FATAL ERROR DATABASE IS NOT RESPONDING AFTER 100 ATTEMPTS <= (!!!)")
    console.log("(!!! 2) => FATAL ERROR DATABASE IS NOT RESPONDING AFTER 100 ATTEMPTS <= (!!!)")
    console.log("(!!! 3) => FATAL ERROR DATABASE IS NOT RESPONDING AFTER 100 ATTEMPTS <= (!!!)")
    console.log("(!) => FATAL ERROR → RESTART APP!")
    return;
  }
  console.log("(DB) INFO => Creating connection pool (attempt " + connectionAttempts + ")....");
  connectionAttempts++;

  try {
    pool = await mysql.createPool(connectionString);
    console.log("(DB) INFO => Connection pool has been SUCCESSFULLY created");
    connectionAttempts = 0
  } catch (err) {
    if (prevError != err) {
      prevError = err
      console.log("(DB) ERROR => connectMySql() => " + JSON.stringify(err));
    }
    await connectMySql()
  }
}

export async function stopDB() {
  await pool.end()
}

// await connectMySql();



/**
 * Query Builder & Executor
 */
class QueryExecutorClass extends QueryBuilder {
  constructor(table, connection) {
    super(table)
    this.connection = connection;
  }

  /**
   * Runs query
   * @returns array of objects (json) and status (ok: boolean, error: object)
   */
  async run() {
    // this.log()
    try {
      const result = await this.connection.query(this.query, this.args)

      // convert to json
      for (let i = 0; i < result[0].length; i++) {
        Object.keys(result[0][i]).forEach(key => {
          result[0][i][key] = tryParseJSONObject(result[0][i][key])
        })
      }

      return { result: result[0], ok: true }
    } catch (e) {
      console.error(e)
      // console.log("(QueryExecutor) ERROR => "+JSON.stringify(e))
      return { result: [], ok: false, error: e }
    }
  }

  /**
   * Sets result limit to 1
   * @returns first element as an JSON object (not array of objects)
   */
  async runGetFirst() {
    this.limit(1)
    var data = await this.run()
    data.result = data.result[0]
    return data
  }
}

export function QueryExecutor(table, connection) {
  // TODO: implement table name check for SQL-injection
  return new QueryExecutorClass(table, connection)
}