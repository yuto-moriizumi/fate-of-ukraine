export default abstract class Util {
  /**
   * [最小値,最大値]の乱数を生成します
   * デフォルトでは[0,1]がの乱数が返されます
   * @static
   * @param {number} [max=1]
   * @param {number} [min=0]
   * @returns
   * @memberof Util
   */
  public static getRandomInt(min = 0, max = 1) {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
  }

  public static getRandom<T>(arr: Array<T>) {
    if (arr.length === 0) return undefined;
    return arr[Math.floor(Math.random() * arr.length)];
  }
}

export function hex2rgb(hex: string) {
  if (hex.slice(0, 1) == '#') hex = hex.slice(1);
  if (hex.length == 3)
    hex =
      hex.slice(0, 1) +
      hex.slice(0, 1) +
      hex.slice(1, 2) +
      hex.slice(1, 2) +
      hex.slice(2, 3) +
      hex.slice(2, 3);

  return [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)].map((str) =>
    parseInt(str, 16)
  );
}
