#!/bin/env node

var cc          = require('config-multipaas'),
    restify     = require('restify'),
    fs          = require('fs'),
    yaml        = require('js-yaml')

var config      = cc(),
    app         = restify.createServer()

app.use(restify.queryParser())
app.use(restify.CORS())
app.use(restify.fullResponse())

/* Create a directory, ignoring if already exists */
var mkdirSync = function (path) {
  try {
    fs.mkdirSync(path);
  } catch(e) {
    if ( e.code != 'EEXIST' ) throw e;
  }
}

var websiteDataURL = 'https://github.com/forge/website-data';

// The git directory
var gitDir = (process.env.OPENSHIFT_DATA_DIR || '/tmp')  + '/website-data';

// Caching index.html to minimize IO
var indexHTML = fs.readFileSync(__dirname + '/app/index.html');

// Routes
app.get('/', function (req, res, next)
{
  res.status(200);
  res.header('Content-Type', 'text/html');
  res.end(indexHTML);
});

app.get(/\/1.x\/?.*/, restify.serveStatic({directory: './1.x/'}));
app.get(/\/(css|fonts|images|js|views)\/?.*/, restify.serveStatic({directory: './app/'}));


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

app.get('/addons', function(req, res) {
    res.json(addons);
});

app.get('/docs', function(req, res) {
  res.json(docs);
});

app.get('/news', function(req, res) {
    var body = fs.readFileSync(gitDir + "/docs-news.yaml");
    var allEntries = yamlLoad(body);
    res.json(allEntries);
});

app.listen(config.get('PORT'), config.get('IP'), function () {
  console.log( "Listening on " + config.get('IP') + ", port " + config.get('PORT') )
});


/** Loads the YAML content into a JS object */
function yamlLoad(body) {
    var allEntries = [];
    yaml.safeLoadAll(body, function (entry) {
        if (entry)
            allEntries.push(entry);
    });
    return allEntries;
}

function gitPullWebsiteData() { 
    mkdirSync(gitDir);
    
}

gitPullWebsiteData();