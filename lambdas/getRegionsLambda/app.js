const mysql = require('mysql2');
const AWS = require('aws-sdk');

// Hack to make iconv load the encodings module, otherwise jest crashes. Compare
// https://github.com/sidorares/node-mysql2/issues/489
require('iconv-lite').encodingExists('foo');

exports.handler = async (event) => {
    // Get password from an env var if running locally
    if (process.env.localTest) {
        var rds_password = process.env.RDS_PASSWORD
    }
    else {
        // Get password from System Manager Parameter Store if running on AWS
        AWS.config.update({ region: 'eu-west-2' });
        var ssm = new AWS.SSM();
        var rds_password = await new Promise(function (success, reject) {
            ssm.getParameter({
                Name: process.env.RDS_PASSWORD_PARAM,
                WithDecryption: true
            }, function (err, data) {
                if (err) {
                    reject(JSON.stringify(err));
                } else {
                    success(data["Parameter"]["Value"]);
                }
            });
        });
    }
    var connection = mysql.createConnection({
        host: process.env.RDS_ENDPOINT,
        user: process.env.RDS_USERNAME,
        password: rds_password,
        database: process.env.RDS_DATABASE
    })
    var query = 'select DISTINCT RegionName from main'
    connection.connect()

    return new Promise((resolve, reject) => {
        connection.query(query, function (error, results, fields) {
            connection.end(err => {
                if (err) {
                    return reject(err)
                }
                var finalRegions = []
                for (var i = 0; i < results.length; i++) {
                    finalRegions.push(results[i].RegionName)
                }
                const response = {
                    statusCode: 200,
                    body: JSON.stringify(finalRegions),
                }
                resolve(response)
            })
        })
    })
}