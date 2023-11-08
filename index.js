const express = require('express');
const mongoose = require('mongoose');
const config = require('./config.js');
const routes = require('./routes.js');

async function serve() {
    try {
        await mongoose.connect(config.MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('[mongoose] Database connected.')
    } catch (e) {
        console.error('[mongoose]', e);
        process.exit(1);
    }
    
    const app = express();
    
    app.use(express.urlencoded({extended: true}));
    app.use(express.json());

    app.use('/favicon.ico', express.static(__dirname+'/static/favicon.ico'));
    app.use('/css', express.static(__dirname+'/static/css'));
    app.use('/js', express.static(__dirname+'/static/js'));
    app.use('/', routes);
    
    app.listen(config.BIND || 8080, () => {
        console.log('[express] Webserver started.');
    });    
}

serve();
