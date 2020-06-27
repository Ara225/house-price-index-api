const mysql = require('mysql2');
// Hack to make iconv load the encodings module, otherwise jest crashes. Compare
// https://github.com/sidorares/node-mysql2/issues/489
require('iconv-lite').encodingExists('foo');

global.pool = null

exports.handler = async function (event, context, callback) {
    if (!global.pool) {
        if (process.env.localTest) {
            var rds_password = process.env.RDS_PASSWORD
        }
        else {
            var AWS = require('aws-sdk');
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
        global.pool = mysql.createPool({
            host: process.env.RDS_ENDPOINT,
            user: process.env.RDS_USERNAME,
            password: rds_password,
            database: process.env.RDS_DATABASE
        });
    }
    if (!process.env.localTest) {
    context.callbackWaitsForEmptyEventLoop = false;
    }
    return await new Promise((resolve, reject) => {
        global.pool.getConnection(function (err, connection) {
            return connection.query('select DISTINCT RegionName from main', function (error, results, fields) {
                // And done with the connection.
                connection.release();

                return error ? reject(error) : resolve(results);
            })
    });
    })}