const express = require('express');
const Url = require('./db/url-schema.js');
const utils = require('./utils.js');
const router = express.Router();

router.all('/', async (req, res) => {
    utils.sendBadRequestError(res, 'Nothing to be done at API root.');
});

router.put('/:slug', async (req, res) => {
    try {
        const {url} = req.body;
        const slug = req.params.slug.toLowerCase();
        if (!utils.isUrlFormatted(url))
            return utils.sendBadRequestError(res, 'URL "'+url+'" is malformatted. Must be a valid URL.');
        if (!utils.isAlphaNumeric(slug))
            return utils.sendBadRequestError(res, 'Slug "'+slug+'" is malformatted. Must be alphanumeric.');
        if (await Url.exists({slug: slug}))
            return utils.sendBadRequestError(res, 'Slug "'+slug+'" already exists. Updates are not supported at this time.');
        
        await new Url({url, slug}).save();
        utils.sendSuccessfulSlugCreation(res, slug);
    } catch (err) {
        utils.sendInternalServerError(res);
    }
});

router.all('/*', async (req, res) => {
    utils.sendNotFoundError(res);
});

module.exports = router;
