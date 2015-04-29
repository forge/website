#!/bin/env node

var cc          = require('config-multipaas'),
    restify     = require('restify'),
    fs          = require('fs'),
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

app.get('/api/news', function(req, res) {
    var body = fs.readFileSync(config.get('FORGE_WEBSITE_DATA_DIR') + "/docs-news.yaml");
    res.json(yamlLoadAll(body));
});

app.get('/api/metadata', function(req, res) {
    var body = fs.readFileSync(config.get('FORGE_WEBSITE_DATA_DIR') + "/metadata.yaml");
    res.json(yamlLoadAll(body).shift());
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

/** Loads the YAML content into a JS object */
function yamlLoadAll(body) {
    var allEntries = [];
    yaml.safeLoadAll(body, function (entry) {
        if (entry)
            allEntries.push(entry);
    });
    return allEntries;
}

/** Clone the website-data repository*/
Git.clone(config.get('FORGE_WEBSITE_DATA_URL'), config.get('FORGE_WEBSITE_DATA_DIR'));