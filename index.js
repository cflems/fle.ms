const express = require('express');
const mongoose = require('mongoose');
const config = require('./config.js');
const routes = require('./routes.js');
const apiRoutes = require('./api-routes.js');

async function serve() {
    try {
        await mongoose.connect(config.MONGO_URI, {
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

    app.use('/css', express.static(__dirname+'/static/css'));
    app.use('/js', express.static(__dirname+'/static/js'));
    app.use('/img', express.static(__dirname+'/static/img'));
    app.use('/api', apiRoutes);
    app.use('/', routes);
    
    const PORT = config.PORT || 80;
    app.listen(PORT, () => {
        console.log('[express] Webserver started.');
    });    
}

serve();
