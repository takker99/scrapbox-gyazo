/** `ok`が`true`のときに正常値、`false`のとき異常値を返す */
export type Result<T, E> = ({ ok: true } & T) | ({ ok: false } & E);
