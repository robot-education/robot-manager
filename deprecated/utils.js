function environment(key) {
    if (process.env[key]) {
        return process.env[key];
    }
    throw new Error('Environment variable ' + key + ' not set');
}

module.exports = {
    environment
}