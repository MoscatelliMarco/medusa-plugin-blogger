export const MySqlSanitization = (value) => {
    if (typeof value === 'string') {
        return value.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, char => {
            switch (char) {
                case "\0": return "\\0";
                case "\x08": return "\\b";
                case "\x09": return "\\t";
                case "\x1a": return "\\z";
                case "\n": return "\\n";
                case "\r": return "\\r";
                case "\"": return "\\\"";
                case "'": return "\\'";
                case "\\": return "\\\\";
                case "%": return "\\%";
                default: return char;
            }
        });
    }
    return value; // For non-string values, return as is
};

export const MySqlSanitizationObj = (obj) => {
    const sanitizedObj = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            sanitizedObj[key] = MySqlSanitization(obj[key]);
        }
    }
    return sanitizedObj;
};