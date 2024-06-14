export const parseQueryString = (queryString) => {
    const params = new URLSearchParams(queryString);
    let result = {};

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

    // If the element was an array an so the keys are 0, 1, 2, 3, 4, 5, transform it into an array
    result = objectToList(result);

    return result;
}

function objectToList(obj) {
    const keys = Object.keys(obj);
    
    let is_list = true;
    let supposed_next_value = 0;
    for (let key of keys) {
        if (parseInt(key) == supposed_next_value) {
            supposed_next_value += 1;
        } else{
            is_list = false;
            break;
        }
    }
    
    if (!is_list) {
        return obj;
    }
    
    let list_result = [];
    for (let key of keys) {
        list_result.push(obj[key]);
    }
    return list_result;
}

export const objectToQueryString = (obj) => {
    return Object.keys(obj)
        .map(key => {
            if (Array.isArray(obj[key]) || typeof obj[key] == "object") {
                return encodeURIComponent(key) + '=' + encodeURIComponent(JSON.stringify(obj[key]))
            } else {
                return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])
            }
        }).join('&');
}