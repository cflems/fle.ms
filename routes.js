const express = require('express');
const path = require('path');
const Url = require('./db/url-schema.js');
const utils = require('./utils.js');
const router = express.Router();

async function createRoute(res, url, slug) {
    try {
        if (!utils.isUrlFormatted(url))
            return utils.sendBadRequestError(res, 'URL "'+url+'" is malformatted. Must be a valid URL.', 'Malformed URL');
        if (!utils.isAlphaNumeric(slug))
            return utils.sendBadRequestError(res, 'Slug "'+slug+'" is malformatted. Must be alphanumeric.', 'Malformed Short URL');

        slug = slug.toLowerCase();
        if (await Url.exists({slug: slug}))
            return utils.sendBadRequestError(res, 'Slug "'+slug+'" already exists. Updates are not supported at this time.', 'Already Exists');

        await new Url({url, slug}).save();
        utils.sendSuccessfulSlugCreation(res, slug);
    } catch (err) {
        utils.sendInternalServerError(res, err);
    }
}

router.get('/', async (req, res) => {
    utils.sendFile(res, 'static/index.html');
});

router.post('/', async (req, res) => {
    let slug;
    do {
        slug = utils.generateSlug();
    } while (await Url.exists({slug: slug}));
    await createRoute(res, req.body.url, slug);
});

router.get('/:slug', async (req, res) => {
    try {
        const url = await Url.findOne({slug: req.params.slug.toLowerCase()});
        if (url)
            res.redirect(301, url.url);
        else
            utils.sendNotFoundError(res);
    } catch (err) {
        utils.sendInternalServerError(res, err);
    }
});

router.put('/:slug', async (req, res) => {
    if (!req.params.slug)
        return utils.sendBadRequestError(res, 'Cannot PUT to root path.');
    await createRoute(res, req.body.url, req.params.slug.toLowerCase());
});

router.get('/*', async (req, res) => {
    utils.sendNotFoundError(res);
});

router.all('/*', async (req, res) => {
    utils.sendBadRequestError(res, 'Nothing exists at this endpoint.');
});

module.exports = router;
