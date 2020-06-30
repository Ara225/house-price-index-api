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

/**
 * Get connection to the database
 */
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

/**
 * Construct the SQL query. Uses prepared statements and escaping to avoid SQL injection
 * @param {Dict} event AWS Lambda Format Event
 * @param {mysql.Connection} connection Connection to DB
 */
function constructQuery(event, connection) {
    var query = ["", []]
    var params = event.multiValueQueryStringParameters ? event.multiValueQueryStringParameters : {}
    var limit = params.limit ? parseInt(connection.escape(params.limit)) : 50;
    var startFromId = params.startFromId ? parseInt(connection.escape(params.startFromId)) : 0;
    if (limit > 100) {
        throw Error("Limit was over 100, unable to process query")
    }
    // If we have parameters and the parameters don't consist purely of startFromId and limit
    if (!((params.limit || params.startFromId) & Object.keys(params).length < 1) & !((params.limit & params.startFromId) & Object.keys(params).length == 2)) {
        // Select all columns if no column limit is supplied
        if (!params.houseType & !params.purchaseType) {
            query[0] = 'SELECT *'
        }
        else {
            // Start query with basic columns otherwise
            query[0] = 'SELECT Date,RegionName,AreaCode,id, '
        }
        // Parse houseType
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
        // Parse purchaseType
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
        // Table to query
        query[0] += ' FROM main '
        // Where clauses
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
            query[1].push(connection.escape(params.maxDate[0]).replace(/'/g, ""))
        }
        if (params.minDate) {
            query[0] += "AND Date > ? "
            query[1].push(connection.escape(params.minDate[0]).replace(/'/g, ""))
        }
        // If we have no where clauses, filter by ID instead of using limit (more efficient)
        if (!params.maxDate & !params.minDate & !params.RegionName & !params.AreaCode) {
            query[0] += 'AND (ID > ? AND ID <= ?) '
            query[1].push(startFromId)
            query[1].push((limit + startFromId))
        }
        else {
            query[0] += 'LIMIT ? OFFSET ? '
            query[1].push(limit)
            query[1].push(startFromId)
        }
    }
    else {
        query[0] = 'SELECT * FROM main WHERE (ID > ? AND ID <= ?)'
        query[1].push(startFromId)
        query[1].push((limit + startFromId))
    }
    query[0] = query[0].replace("main AND", "main WHERE")
    return query
}
/**
 * Actual Lambda function handler
 * @param {Dict} event AWS Lambda Format Event
 */
exports.handler = async (event) => {
    var connection = await getConnection()
    connection.connect()
    try {
        var query = constructQuery(event, connection)
    }
    catch(e) {
        console.log(e)
        return new Promise((resolve, reject) => {
                connection.end(err => {
                    if (err) {
                        return reject(err)
                    }
                    const response =  {
                            statusCode: 500,
                            body: JSON.stringify({message: "Invalid query parameters", error: e.toString()}),
                        }
                    resolve(response)
                })
            })
    }
    return new Promise((resolve, reject) => {
        connection.query(query[0], query[1], function (error, results, fields) {
            if (error) {
                return reject(error)
            }
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