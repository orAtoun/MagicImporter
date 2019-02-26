var mysql = require('mysql');

class dbService {
    constructor() {
        this.connection = mysql.createConnection({
            host     : 'ec2-18-221-149-115.us-east-2.compute.amazonaws.com',
            user     : 'root',
            password : 'Aa123456',
            database : 'ad'
        });
    }


    query( sql, args ) {
        return new Promise( ( resolve, reject ) => {
            this.connection.query( sql, args, ( err, rows ) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    }
    close() {
        return new Promise( ( resolve, reject ) => {
            this.connection.end( err => {
                if ( err )
                    return reject( err );
                resolve();
            } );
        } );
    }
}

module.exports = dbService;















