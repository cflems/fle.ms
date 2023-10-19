const express = require('express');
const path = require('path');
const Url = require('./db/url-schema.js');
const utils = require('./utils.js');
const router = express.Router();

router.get('/', async (req, res) => {
    utils.sendFile(res, 'static/index.html');
});

router.get('/:slug', async (req, res) => {
    try {
        const url = await Url.findOne({slug: req.params.slug.toLowerCase()});
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
});

module.exports = router;
