import { deepClone } from "./deepClone";

describe("deepClone.ts", () => {
  it("should clone", () => {
    const fn = () => 1;
    const fn2 = function() {};
    expect(deepClone(fn)).toBe(fn);
    expect(deepClone(fn2)).toBe(fn2);

    const obj = {
      a: 1,
      b: 2,
      c: {
        d: 3
      }
    };
    expect(deepClone(obj)).not.toBe(obj);
    expect(deepClone(obj)).toMatchInlineSnapshot(`
      Object {
        "a": 1,
        "b": 2,
        "c": Object {
          "d": 3,
        },
      }
    `);

    const arr = [1, 2, 3];
    expect(deepClone(arr)).not.toBe(arr);
    expect(deepClone(arr)).toMatchInlineSnapshot(`
      Array [
        1,
        2,
        3,
      ]
    `);

    const arrObj = {
      a: 1,
      b: 2,
      c: [3, 4, 5]
    };
    expect(deepClone(arrObj)).not.toBe(arrObj);
    expect(deepClone(arrObj)).toMatchInlineSnapshot(`
      Object {
        "a": 1,
        "b": 2,
        "c": Array [
          3,
          4,
          5,
        ],
      }
    `);

    const date = new Date("2020-01-01 00:00:00");
    expect(deepClone(date)).not.toBe(date);
    expect(deepClone(date)).toMatchInlineSnapshot(`2019-12-31T16:00:00.000Z`);

    const objDate = {
      date: new Date("2020-01-01 00:00:00")
    };
    expect(deepClone(objDate)).not.toBe(objDate);
    expect(deepClone(objDate)).toMatchInlineSnapshot(`
      Object {
        "date": 2019-12-31T16:00:00.000Z,
      }
    `);
  });
});
