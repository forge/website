#!/bin/env node

var cc          = require('config-multipaas'),
    restify     = require('restify'),
    fs          = require('fs'),
    yaml        = require('js-yaml'),
    exec        = require('child_process').exec;
var config      = cc()
                    .add(
                        {
                            "FORGE_WEBSITE_DATA_URL": 'https://github.com/forge/website-data',
                            "FORGE_WEBSITE_DATA_DIR": (process.env.OPENSHIFT_TMP_DIR || '/tmp')  + '/website-data'
                        }),
    app         = restify.createServer()

app.use(restify.queryParser())
app.use(restify.CORS())
app.use(restify.fullResponse())

// Routes
app.get('/api/addons', function(req, res) {
    var addons = 
    { 
        'community':
        [
        {
            id: 'org.jboss.forge.addon:reflections',
            name: 'Reflections', 
            description: 'Enables the usage of the Reflections library as project facets for Java runtime metadata analysis', 
            author:'George Gastaldi', 
            rating: 5,
        }
        ], 
        'core':
        [
        {
            id: 'org.jboss.forge.addon:gradle',
            name: 'Gradle', 
            description: 'Enables Grade in your project', 
            author:'Lincoln Baxter III', 
            rating: 3,
            logo: 'https://pbs.twimg.com/profile_images/2149314222/square.png',
        }
        ]
    };    
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
    var allEntries = yamlLoad(body);
    res.json(allEntries);
});

app.post('/api/v2/webhooks/cache_invalidate', function(req, res) {
    gitPullWebsiteData();
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
function yamlLoad(body) {
    var allEntries = [];
    yaml.safeLoadAll(body, function (entry) {
        if (entry)
            allEntries.push(entry);
    });
    return allEntries;
}
/** Clone the website-data repository*/
function gitCloneWebsiteData() { 
    var gitUrl = config.get('FORGE_WEBSITE_DATA_URL');
    var gitDir = config.get('FORGE_WEBSITE_DATA_DIR');

    exec( 'rm -rf '+ gitDir +' && git clone -q ' + gitUrl + ' ' + gitDir);
}

/** Pull from the website-data repository*/
function gitPullWebsiteData() { 
    var gitDir = config.get('FORGE_WEBSITE_DATA_DIR');
    exec( 'cd ' + gitDir + ' && git pull', function ( err, stdout, stderr ){
        console.log(stdout);
    });
}

// Start by cloning the github repository
gitCloneWebsiteData();