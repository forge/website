#!/bin/env node

var cc          = require('config-multipaas'),
    restify     = require('restify'),
    fs          = require('fs')

var config      = cc(),
    app         = restify.createServer()

app.use(restify.queryParser())
app.use(restify.CORS())
app.use(restify.fullResponse())

var indexHTML = fs.readFileSync(__dirname + '/app/index.html');

// Routes
app.get('/status', function (req, res, next)
{
  res.send("{status: 'ok'}");
});

app.get('/', function (req, res, next)
{
  res.status(200);
  res.header('Content-Type', 'text/html');
  res.end(indexHTML);
});

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

var news = [
{   
    title : "Forge 2.16.0.Final (Spear) is here",
    summary: "JBoss Forge 2.16.0.Final is now available. Grab it while it is hot!",
    date: new Date(),
    repo: "https://github.com/forge/docs.git",
    ref: "master",
    path: "/news/2015-04-15-forge-2.16.0.final.asciidoc",
    author: "Forge Team",
    email: "forge-dev@lists.jboss.org",
    photo:"http://leapingstag.wdfiles.com/local--files/the-forge/Forge%20Fire%20small.JPG"
},
{   
    title : "Forge 2.15.0.Final (Morning Star) is here",
    summary: "JBoss Forge 2.15.0.Final is now available. Grab it while it is hot!",
    date: new Date(),
    repo: "https://github.com/forge/docs.git",
    ref: "master",
    path: "/news/2015-04-15-forge-2.14.0.final.asciidoc",
    author: "Forge Team",
    email: "forge-dev@lists.jboss.org"
}
];




app.get('/addons', function(req, res) {
  res.json(addons);
});

app.get('/docs', function(req, res) {
  res.json(docs);
});

app.get('/news', function(req, res) {
  res.json(news);
});

app.listen(config.get('PORT'), config.get('IP'), function () {
  console.log( "Listening on " + config.get('IP') + ", port " + config.get('PORT') )
});
