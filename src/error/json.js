const express = require('express');

const app = express();

module.exports = (err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        if (err.type === 'entity.parse.failed') {
            let data = req.body || req.query;
            try {
                JSON.parse(data); // <-- reproduce error in order to catch it
            } catch (error) {
                // get the first line of error which is "SyntaxError: Unexpected string in JSON at position 59"
                let message = error.toString().split("\n")[0];
                return res.status(400).send({ message: message }); // Bad request
            }
        }            
        else return res.status(400).send(err); // Bad request
    }
    next();
};