export function format(o, maxLevel, level) {
    level = level ?? 0;
    maxLevel = maxLevel ?? 0;

    var str = '';
    // Remove this if you don't want the pre tag, but make sure to remove
    // the close pre tag on the bottom as well

    var levelStr = '\n';
    for (var x = 0; x < level; x++) {
        levelStr += '    ';   // all those spaces only work with <pre>
    }

    for (var p in o) {
        let value = o[p];
        switch (typeof value) {
            case 'number':
            case 'string':
            case 'boolean':
                str += levelStr + p + ': ' + o[p];
                break;

            case 'object':    // this is where we become recursive
            default:
                str += levelStr + '[ ' + format(o[p], maxLevel, level + 1) + levelStr + ']';
                break;
        }
    }

    return str;
};