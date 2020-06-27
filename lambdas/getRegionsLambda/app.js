const mysql = require('mysql2');
// Hack to make iconv load the encodings module, otherwise jest crashes. Compare
// https://github.com/sidorares/node-mysql2/issues/489
require('iconv-lite').encodingExists('foo');

exports.handler = async function (event) {
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
                WithDecryption: true}, function (err, data) {
                if (err) {
                  reject(JSON.stringify(err));
                } else {
                  success(data["Parameter"]["Value"]);
                }
              });
            });
    }
    var regions = await new Promise((resolve, reject) => {
        const connection = mysql.createConnection({
            host: process.env.RDS_ENDPOINT,
            user: process.env.RDS_USERNAME,
            password: rds_password,
            database: process.env.RDS_DATABASE
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