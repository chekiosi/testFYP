var db = require('./databaseConfig.js');
var RegionalofficeDB = {
    getOfficeNameById: function (id) {
        return new Promise( ( resolve, reject ) => {
            var conn = db.getConnection();
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    return reject(err);
                }
                else {
                    var sql = 'SELECT * FROM regionalofficeentity r WHERE r.ID=?';
                    conn.query(sql, [id], function (err, result) {
                        if (err) {
                            return reject(err);
                        } else {
                            return resolve(result[0].NAME);
                        }
                    });
                }
            });
        });
    }
};
module.exports = RegionalofficeDB