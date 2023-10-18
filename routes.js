const express = require('express');
const path = require('path');
const Url = require('./db/url-schema.js');
const utils = require('./utils.js');
const router = express.Router();

router.get('/', async (req, res) => {
    res.sendFile('static/index.html', {
        root: path.join(__dirname)
    }, () => utils.sendNotFoundError(res));
});

router.get('/:slug', async (req, res) => {
    try {
        const url = await Url.findOne({slug: req.params.slug});
        if (url)
            res.redirect(301, url.url);
        else
            utils.sendNotFoundError(res);
    } catch (err) {
        utils.sendInternalServerError(res);
    }
});

router.all('/*', async (req, res) => {
    utils.sendNotFoundError(res);
})

module.exports = router;
