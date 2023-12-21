export function mergeObjects(obj1: any, obj2: any) {
    let obj1Keys = Object.keys(obj1);
    let obj2Keys = Object.keys(obj2);

    let merged: any = {};

    for (let i = 0; i < obj1Keys.length; i++) {
        if (obj2Keys.includes(obj1Keys[i])) {
            if (typeof obj1[obj1Keys[i]] == 'object') {
                merged[obj1Keys[i]] = mergeObjects(obj1[obj1Keys[i]], obj2[obj1Keys[i]]);
            } else {
                merged[obj1Keys[i]] = obj2[obj1Keys[i]];
            }
        } else {
            merged[obj1Keys[i]] = obj1[obj1Keys[i]];
        }
    }

    for (let i = 0; i < obj2Keys.length; i++) {
        // If already merged, continue on
        if (obj1Keys.includes(obj2Keys[i])) {
            continue;
        }

        merged[obj2Keys[i]] = obj2[obj2Keys[i]];
    }

    return merged;
}