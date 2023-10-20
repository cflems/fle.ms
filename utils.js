const path = require('path');
const config = require('./config.js');

const helperFunctions = {
    sendFile : function (res, fileName) {
        res.sendFile(fileName, {
            root: path.join(__dirname)
        }, err => {
            if (!err) return;
            utils.sendNotFoundError(res)
        });
    },
    sendNotFoundError : function (res) {
        if (!res.headersSent) res.status(404);
        const statusJson = {status: "ERROR", statusCode: 404, errorType: "NOT FOUND", errorMessage: "Not Found"};
        res.sendFile('static/notfound.html', {root: path.join(__dirname)},
        err => {
            if (!err) return;

            console.error('[express] Encountered an error:', err);
            if (!res.headersSent) res.json(statusJson);
            else res.send(JSON.stringify(statusJson));
        });
    },
    sendBadRequestError : function (res, errorMessage) {
        res.status(400).json({status: "ERROR", statusCode: 400, errorType: "BAD REQUEST", errorMessage});
    },
    sendInternalServerError : function (res) {
        res.status(404).json({status: "ERROR", statusCode: 500, errorType: "INTERNAL", errorMessage: "Internal Server Error"});
    },
    sendSuccessfulSlugCreation : function (res, slug) {
        res.status(201).json({status: "SUCCESS", statusCode: 201, data: {shortUrl: config.BASE+slug}});
    },
    isAlphaNumeric : function (str) {
        return str.match(/^[a-zA-Z0-9]+$/) !== null;
    },
    isUrlFormatted : function (str) {
        try {
            new URL(str);
            return true;
        } catch (err) {
            return false;
        }
    }
};

module.exports = helperFunctions;
