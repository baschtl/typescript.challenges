const flattenObject = (obj: object, prefix: string = ''): Record<string, any> => {
    const result: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(obj)) {
        const path = prefix ? `${prefix}.${key}` : key;

        if (value instanceof Object && value !== null) {
            Object.assign(result, flattenObject(value, path));
        } else {
            result[path] = value;
        }
    }

    return result;
}

let obj1 = { a: { b: { c: 1 } }, d: 2 };
console.log(flattenObject(obj1));

const obj2 = { a: { b: { c: 1 } }, d: 2, e: [10, { f: 20 }]};
console.log(flattenObject(obj2));

console.log(flattenObject({
    a: { b: { c: 1 } },
    d: [2, 3],
    e: null,
    f: new Date("2020-01-01") // Dates, Maps, Sets not supported
  }));