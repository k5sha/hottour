// @ts-ignore
import moment from "moment";
// import moment from "../node_modules/moment/moment";

export function now() {
  // return moment().utc().format("YYYY-MM-DD HH:mm:ss");
  return moment().format("YYYY-MM-DD HH:mm:ss");
}

export function formatTimeDB(m) {
  return m.format("YYYY-MM-DD HH:mm:ss")
}

export function timestamp() {
    return moment().unix()
}