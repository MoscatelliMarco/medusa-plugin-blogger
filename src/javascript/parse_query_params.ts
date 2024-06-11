export const parseQueryString = (queryString) => {
    const params = new URLSearchParams(queryString);
    const result = {};

    function setNestedObject(obj, keys, value) {
        const key = keys.shift();
        if (!keys.length) {
            if (Array.isArray(obj[key])) {
                obj[key].push(value);
            } else if (obj[key] !== undefined) {
                obj[key] = [obj[key], value];
            } else {
                obj[key] = value;
            }
            return;
        }
        if (!obj[key]) {
            obj[key] = {};
        }
        setNestedObject(obj[key], keys, value);
    }

    for (const [key, value] of params) {
        let parsedValue;
        try {
            parsedValue = JSON.parse(value);
        } catch (e) {
            parsedValue = value;
        }

        const keys = key.split(/[\[\]]+/).filter(k => k);
        setNestedObject(result, keys, parsedValue);
    }

    return result;
}

export const objectToQueryString = (obj) => {
    return Object.keys(obj)
        .map(key => {
            if (Array.isArray(obj[key]) || typeof obj[key] == "object") {
                encodeURIComponent(key) + '=' + encodeURIComponent(JSON.stringify(obj[key]))
            } else {
                encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])
            }
        }).join('&');
}