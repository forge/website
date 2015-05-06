#!/bin/env node

var cc          = require('config-multipaas'),
    restify     = require('restify'),
    fetchUrl    = require("fetch").fetchUrl,
    fs          = require('fs'),
    url         = require('url'),
    yaml        = require('js-yaml'),
    exec        = require('child_process').exec;
// Git utilities
var Git         = 
    { 
        clone: function(gitUrl, gitDir) { 
            exec( 'rm -rf '+ gitDir +' && git clone -q ' + gitUrl + ' ' + gitDir);        
        },
        pull : function (gitDir) {
            exec( 'cd ' + gitDir + ' && git pull', function ( err, stdout, stderr ){
                console.log(stdout);
            });
        }
    };
var config      = cc()
                    .add(
                        {
                            "REDOCULOUS_HOST": 'redoculous-forge.rhcloud.com',
                            "FORGE_WEBSITE_DATA_URL": 'https://github.com/forge/website-data',
                            "FORGE_WEBSITE_DATA_DIR": (process.env.OPENSHIFT_TMP_DIR || '/tmp')  + '/website-data'
                        }),
    app         = restify.createServer()

app.use(restify.gzipResponse());
app.use(restify.queryParser())
app.use(restify.CORS())
app.use(restify.fullResponse())

// Routes
app.get('/api/addons', function(req, res) {
    var communityAddons = yamlLoadAll(fs.readFileSync(config.get('FORGE_WEBSITE_DATA_DIR') + "/addons-community.yaml"));
    var coreAddons = yamlLoadAll(fs.readFileSync(config.get('FORGE_WEBSITE_DATA_DIR') + "/addons-core.yaml"));

    var addons = { 'community': communityAddons, 'core' : coreAddons};
    res.json(addons);
});

app.get('/api/docs', function(req, res) {
    var docs = [
    {
        level: 'beginner',
        group: 'core',
        doc: 'blogpost',
        title: 'Forge shell with Cygwin and Wildfly',
        summary: 'Running Forge shell with Cygwin and deploying the generated app in Wildfly'
    },
    {
        level: 'expert',
        group: 'core',
        doc: 'tutorial',
        title: 'Write a Java EE Web Application - Advanced',
        summary: 'Use Forge to create a entire Java EE Web application.'
    },  
    {
        level: 'expert',
        group: 'core',
        doc: 'tutorial',
        title: 'Write a Java EE Web Application - Advanced',
        summary: 'Use Forge to create a entire Java EE Web application.'
    }
    ];
    res.json(docs);
});

/** /api/news/{id} */
app.get('/api/news', function(req, res) {
    res.json(getNews());
});

app.get('/api/news/:newsId/contents', function(req, res) {
    var newsItem = getNews().filter(function (item) {
        return item.id == req.params.newsId;
    }).shift();
    if (!newsItem) {
        res.status(404);
        res.end();
        return;            
    }
    // Fetching from Redoculous
    var urlOptions = {
        protocol: 'http:',
        host : config.get('REDOCULOUS_HOST'),
        pathname: "/api/v1/serve",
        query : {
            repo : newsItem.repo,
            ref : newsItem.ref,
            path: newsItem.path
        }
    };
    fetchUrl(url.format(urlOptions), function(error, meta, response) { 
        if (meta.status == 200)
            res.write(response);
        res.end();
    });
});

app.get('/api/news/:newsId/toc', function(req, res) {
    var newsItem = getNews().filter(function (item) {
        return item.id == req.params.newsId;
    }).shift();
    if (!newsItem) {
        res.status(404);
        res.end();
        return;            
    }
    // Fetching from Redoculous
    var urlOptions = {
        protocol: 'http:',
        host : config.get('REDOCULOUS_HOST'),
        pathname: "/api/v1/serve/toc",
        query : {
            repo : newsItem.repo,
            ref : newsItem.ref,
            path: newsItem.path
        }
    };
    fetchUrl(url.format(urlOptions), function(error, meta, response) { 
        if (meta.status == 200) {
            res.write(response);
        }
        res.end();
    });
});

app.get('/api/metadata', function(req, res) {
    var body = fs.readFileSync(config.get('FORGE_WEBSITE_DATA_DIR') + "/metadata.yaml");
    var data = yamlLoadAll(body);
    res.json(data.shift());
});

/** Github hook */
/** Pull from the website-data repository*/
app.post('/api/v2/webhooks/cache_invalidate', function(req, res) {
    Git.pull(config.get('FORGE_WEBSITE_DATA_DIR'));
    res.status(200);
    res.end();
});

// Everything except the already defined routes. IMPORTANT: this should be the last route
app.get(/\/?.*/, restify.serveStatic({default: 'index.html', directory: './app/'}));

// Start the server
app.listen(config.get('PORT'), config.get('IP'), function () {
  console.log( "Listening on %s, port %s", config.get('IP'), config.get('PORT') );
});


/** Auxiliary functions **/
function getNews() { 
    var body = fs.readFileSync(config.get('FORGE_WEBSITE_DATA_DIR') + "/docs-news.yaml");
    var data = yamlLoadAll(body).map(function (item) {
        // Add an ID to the news 
        item.id = generateId(item.title);
        return item;
    });
    return data;
}
/** Loads the YAML content into a JS object */
function yamlLoadAll(body) {
    var allEntries = [];
    yaml.safeLoadAll(body, function (entry) {
        if (entry)
            allEntries.push(entry);
    });
    return allEntries;
}
/** Generate an URL-friendly ID based on the content */
function generateId(content) { 
    return content.toLowerCase().replace(/ /g,'-');
}

/** Clone the website-data repository*/
Git.clone(config.get('FORGE_WEBSITE_DATA_URL'), config.get('FORGE_WEBSITE_DATA_DIR'));