#!/bin/env node

var cc          = require('config-multipaas'),
    restify     = require('restify'),
    fetchUrl    = require("fetch").fetchUrl,
    fs          = require('fs'),
    url         = require('url'),
    yaml        = require('js-yaml'),
    Feed        = require('feed'),
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
app.use(restify.queryParser());
app.use(restify.CORS());
app.use(restify.fullResponse());

// Routes
app.get('/api/addons', function(req, res) {
    res.json(allAddons());
});

app.get('/api/docs', function(req, res) {
    res.json(allDocs());
});

app.get('/api/docs/:docsId', function (req,res) {
    var item = findById(allDocs(),req.params.docsId);
    if (!item) {
        res.status(404);
        res.end();
    } else { 
        res.json(item);
    }
});

app.get('/api/docs/:docsId/contents', function (req,res) {
    fetchContents(allDocs(),req.params.docsId,res);
});

app.get('/api/docs/:docsId/toc', function(req, res) {
    fetchTOC(allDocs(), req.params.docsId, res);
});

app.get('/api/news', function(req, res) {
    res.json(allNews());
});

app.get('/api/news/:newsId/contents', function(req, res) {
    fetchContents(allNews(), req.params.newsId, res);
});

app.get('/api/news/:newsId', function (req,res) {
    var item = findById(allNews(),req.params.newsId);
    if (!item) {
        res.status(404);
        res.end();
    } else { 
        res.json(item);
    }
});

app.get('/api/news/:newsId/toc', function(req, res) {
    fetchTOC(allNews(), req.params.newsId, res);
});

app.get('/api/metadata', function(req, res) {
    var body = fs.readFileSync(config.get('FORGE_WEBSITE_DATA_DIR') + "/metadata.yaml");
    var data = yamlLoadAll(body);
    res.json(data[0]);
});

/** Github hook */
/** Pull from the website-data repository*/
app.post('/api/v2/webhooks/cache_invalidate', function(req, res) {
    Git.pull(config.get('FORGE_WEBSITE_DATA_DIR'));
    res.status(200);
    res.end();
});

/** Atom feed */
app.get('/atom.xml', function (req,res) {
    var feed = new Feed({
        title: 'JBoss Forge Blog Feed',
        description: 'Stay up to date on JBoss Forge',
        link: 'http://forge.jboss.org/',
        copyright: 'Copyright 2015 Red Hat, Inc. and/or its affiliates',
        author: {
            name: 'JBoss Forge Team'
        }
    });
    allNews().forEach(function (newsItem) {
        feed.addItem({
            title: newsItem.title,
            link: 'http://forge.jboss.org/#/news/' + newsItem.id, 
            author: {
                name: newsItem.author
            },
            description: newsItem.summary,
            date: newsItem.date
        });
    });
    res.status(200);
    res.header("Content-Type", "text/xml");
    res.write(feed.render('atom-1.0'));
    res.end();
});

// Legacy URLs
app.get('/documentation', function(req, res) {
    res.header('Location', '/#/documentation');
    res.send(302);
});

// Everything except the already defined routes. IMPORTANT: this should be the last route
app.get(/\/?.*/, restify.serveStatic({default: 'index.html', directory: './app/'}));

// Start the server
app.listen(config.get('PORT'), config.get('IP'), function () {
    // Clone the website-data repository
    Git.clone(config.get('FORGE_WEBSITE_DATA_URL'), config.get('FORGE_WEBSITE_DATA_DIR'));    
    console.log( "Listening on %s, port %s", config.get('IP'), config.get('PORT') );
});

/** Auxiliary functions **/
function allAddons() { 
    var communityAddons = yamlLoadAll(fs.readFileSync(config.get('FORGE_WEBSITE_DATA_DIR') + "/addons-community.yaml"));
    var coreAddons = yamlLoadAll(fs.readFileSync(config.get('FORGE_WEBSITE_DATA_DIR') + "/addons-core.yaml"));

    var addons = { 'community': communityAddons, 'core' : coreAddons};
    return addons;
}

function allNews() { 
    var body = fs.readFileSync(config.get('FORGE_WEBSITE_DATA_DIR') + "/docs-news.yaml");
    var data = yamlLoadAll(body).map(function (item) {
        // Add an ID to the news 
        item.id = generateId(item.title);
        return item;
    });
    return data;
}

function allDocs() { 
    var body = fs.readFileSync(config.get('FORGE_WEBSITE_DATA_DIR') + "/docs.yaml");
    var data = yamlLoadAll(body).map(function (item) {
        // Add an ID to the doc
        item.id = generateId(item.title);
        return item;
    });
    return data;
}

function fetchContents(col, id, res){
    var item = findById(col,id);
    if (!item) {
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
            repo : item.repo,
            ref : item.ref,
            path: item.path
        }
    };
    fetchUrl(url.format(urlOptions), function(error, meta, response) { 
        if (meta.status == 200)
            res.write(response);
        res.end();
    });
}

function fetchTOC(col, id, res) {
    var item = findById(col,id);
    if (!item) {
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
            repo : item.repo,
            ref : item.ref,
            path: item.path
        }
    };
    fetchUrl(url.format(urlOptions), function(error, meta, response) { 
        if (meta.status == 200) {
            res.write(response);
        }
        res.end();
    });
}

function findById(col, id) {
    return col.filter(function (item) {
        return item.id == id;
    })[0];
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