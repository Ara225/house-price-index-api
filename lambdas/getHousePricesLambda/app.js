const mysql = require('mysql2');
const AWS = require('aws-sdk');
var columns = {
    Detached: [
        'DetachedPrice',
        'DetachedIndex',
        "DetachedOneMonthChange",
        "DetachedTwelveMonthChange"
    ],
    SemiDetached: [
        "SemiDetachedPrice",
        "SemiDetachedIndex",
        "SemiDetachedOneMonthChange",
        "SemiDetachedTwelveMonthChange"
    ],
    Terraced: [
        "TerracedPrice", 
        "TerracedIndex", 
        "TerracedOneMonthChange", 
        "TerracedTwelveMonthChange"
    ],
    Flat: [
        "FlatPrice", 
        "FlatIndex", 
        "FlatOneMonthChange", 
        "FlatTwelveMonthChange"
    ],
    New: [
        "NewPrice", 
        "NewIndex", 
        "NewOneMonthChange", 
        "NewTwelveMonthChange", 
        "NewSalesVolume"
    ],
    Old: [
        "OldPrice", 
        "OldIndex", 
        "OldOneMonthChange", 
        "OldTwelveMonthChange", 
        "OldSalesVolume"
    ],
    Cash: [
        "CashPrice", 
        "CashIndex", 
        "CashOneMonthChange", 
        "CashTwelveMonthChange", 
        "CashSalesVolume"
    ],
    Mortgage: [
        "MortgagePrice",
        "MortgageIndex", 
        "MortgageOneMonthChange", 
        "MortgageTwelveMonthChange", 
        "MortgageSalesVolume"
    ],
    FTB: [
        "FTBPrice", 
        "FTBIndex", 
        "FTBOneMonthChange", 
        "FTBTwelveMonthChange"
    ],
    FOO: [
        "FOOPrice", 
        "FOOIndex", 
        "FOOOneMonthChange", 
        "FOOTwelveMonthChange"
    ]
}
// Hack to make iconv load the encodings module, otherwise jest crashes. Compare
// https://github.com/sidorares/node-mysql2/issues/489
require('iconv-lite').encodingExists('foo');

async function getConnection() {
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
    return mysql.createConnection({
        host: process.env.RDS_ENDPOINT,
        user: process.env.RDS_USERNAME,
        password: rds_password,
        database: process.env.RDS_DATABASE
    })
}

function constructQuery(event, connection) {
    /*maxDate 
    minDate
    RegionName 
    AreaCode
    houseType ["Detached", "SemiDetached", "Terraced", "Flat", "New", "Old"]
    purchaseType ["Cash", "Mortgage", "FTB", "FOO"]
    startId
    limit*/
    var query = ["", []]
    var params = event.multiValueQueryStringParameters ? event.multiValueQueryStringParameters : {}
    var limit = params.limit ? parseInt(connection.escape(params.limit)) : 5
    var startId = params.startId ? parseInt(connection.escape(params.startId)) : 1
    if (!((params.limit || params.startId) & Object.keys(params).length < 1) & !((params.limit & params.startId) & Object.keys(params).length == 2)) {
        if (!params.houseType & !params.purchaseType) {
            query[0] = 'SELECT *'
        }
        else {
            query[0] = 'SELECT Date,RegionName,AreaCode,id '
        }
        if (params.houseType) {
            for (i in params.houseType) {
                if (columns[params.houseType[i]]) {
                    query[0] += columns[params.houseType[i]].join(",")
                }
                else {
                    throw Error("Item  " + params.houseType[i].toString() + " in the houseType param")
                }
            }
        }
        if (params.purchaseType) {
            for (i in params.purchaseType) {
                if (columns[params.purchaseType[i]]) {
                    query[0] += columns[params.purchaseType[i]].join(",")
                }
                else {
                    throw Error("Item  " + params.purchaseType[i].toString() + " in the purchaseType param")
                }
            }
        }
        query[0] += ' FROM main '
        if (params.RegionName) {
            query[0] += "AND RegionName = ? "
            query[1].push(connection.escape(params.RegionName[0]))
        }
        if (params.AreaCode) {
            query[0] += "AND AreaCode = ? "
            query[1].push(connection.escape(params.AreaCode[0]))
        }
        if (params.maxDate) {
            query[0] += "AND Date < ? "
            query[1].push(connection.escape(params.maxDate[0]))
        }
        if (params.minDate) {
            query[0] += "AND Date > ? "
            query[1].push(connection.escape(params.minDate[0]))
        }
        if (!params.maxDate & !params.minDate & !params.RegionName & !params.AreaCode) {
            query[0] += 'AND (ID > ? AND ID <= ?) '
            query[1].push(startId.toString())
            query[1].push((limit + startId).toString())
        }
        else {
            query[0] += 'LIMIT ? OFFSET ? '
            query[1].push(limit.toString())
            query[1].push(startId.toString())
        }
    }
    else {
        query[0] = 'SELECT * FROM main WHERE (ID > ? AND ID <= ?)'
        query[1].push(startId.toString())
        query[1].push((limit + startId).toString())
    }
    query[0] = query[0].replace("main AND", "main WHERE")
    console.log(query)
    return query
}

exports.handler = async (event) => {
    var connection = await getConnection()
    connection.connect()
    try {
        var query = constructQuery(event, connection)
    }
    catch(e) {
        console.log(e)
        return {
            statusCode: 500,
            body: JSON.stringify({message: "Invalid query parameters", "Error":e.toString()}),
        }
    }
    if (query[1].length > 0) {
        return new Promise((resolve, reject) => {
            connection.query(query[0], query[1], function (error, results, fields) {
                connection.end(err => {
                    if (err) {
                        return reject(err)
                    }

                    const response = {
                        statusCode: 200,
                        body: JSON.stringify(results),
                    }
                    resolve(response)
                })
            })
        })
    }
    else {
        return new Promise((resolve, reject) => {
            connection.query(query[0], function (error, results, fields) {
                connection.end(err => {
                    if (err) {
                        return reject(err)
                    }
                    const response = {
                        statusCode: 200,
                        body: JSON.stringify(results),
                    }
                    resolve(response)
                })
            })
        })
    }
}