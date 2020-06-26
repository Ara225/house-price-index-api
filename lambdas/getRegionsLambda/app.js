const mysql = require('mysql2');
// Hack to make iconv load the encodings module, otherwise jest crashes. Compare
// https://github.com/sidorares/node-mysql2/issues/489
require('iconv-lite').encodingExists('foo');

exports.handler = async function (event) {
    var regions = await new Promise((resolve, reject) => {
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'Qazwsx123',
            database: 'houseprices'
        });
        connection.query(
            'select DISTINCT RegionName from main',
            (err, result) => {
                connection.destroy()
                return err ? reject(err) : resolve(result);
            }
        );
    });

    var finalRegions = []
    for (var i = 0; i < regions.length; i++) {
        finalRegions.push(regions[i].RegionName)
    }
    return finalRegions
};