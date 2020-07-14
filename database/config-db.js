(function() {
    var db_info = {
        url: 'localhost:2222',
        username: "ah343",
        password: "kjhbJ3xx",
        database: 'ah343_socialrunner'
    };

    var moduleExports = { db_info: db_info };

    if (typeof __dirname != 'undefined')
        module.exports = moduleExports;
}());