const mongoose = require('mongoose');

const UrlSchema = new mongoose.Schema({
    slug: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    url: {
        type: mongoose.SchemaTypes.String,
        required: true
    }
});

module.exports = mongoose.model('Url', UrlSchema);
