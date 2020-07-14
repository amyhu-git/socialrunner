(function() {
    var db_info = {
        url: 'localhost:2222',
        username: "mydb_userna,e",
        password: "12345",
        database: 'mydb_name'
    };

    var moduleExports = { db_info: db_info };

    if (typeof __dirname != 'undefined')
        module.exports = moduleExports;
}());