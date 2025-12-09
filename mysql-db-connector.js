// Get an instance of mysql we can use in the app
var mysql = require('mysql2')

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'animal_shelter'
})

// Export it for use in our application
module.exports.pool = pool;