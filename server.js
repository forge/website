#!/bin/env node

var cc          = require('config-multipaas'),
    NodeCache   = require('node-cache'),
    restify     = require('restify'),
    fetchUrl    = require("fetch").fetchUrl,
    fs          = require('fs'),
    url         = require('url'),
    yaml        = require('js-yaml'),
    Feed        = require('feed'),
    exec        = require('child_process').exec,
    moment      = require('moment'),
    cheerio     = require('cheerio'),
    asciidoctor = require('asciidoctor.js')(),
    util = require('util');
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
                            'FORGE_CONTRIBUTORS_URL' : 'https://api.github.com/repos/forge/core/contributors',
                            'FORGE_SH_URL' : 'https://raw.githubusercontent.com/forge/core/master/forge-install.sh',
                            'REDOCULOUS_HOST': 'redoculous-forge.rhcloud.com',
                            'FORGE_WEBSITE_DATA_URL': 'https://github.com/forge/website-data',
                            'FORGE_WEBSITE_DATA_DIR': (process.env.OPENSHIFT_DATA_DIR || '/tmp')  + '/website-data'
                        }),
    app         = restify.createServer(),
    cache       = new NodeCache({stdTTL: 1000, checkperiod: 120 }),
    processor   = asciidoctor.Asciidoctor(true);

app.use(restify.gzipResponse());
app.use(restify.queryParser());
app.use(restify.CORS());
app.use(restify.fullResponse());

// Routes
app.get('/api/addons', function(req, res) {
    res.json(allAddons());
});

app.get('/api/addons/:addonsId', function (req,res) {
    var addons = allAddons();
    var item = findById(addons['community'],req.params.addonsId);
    if (!item) {
        item = findById(addons['core'],req.params.addonsId);
    }
    if (!item) {
        res.status(404);
        res.end();
    } else { 
        res.json(item);            
    }
});

app.get('/api/addons/:addonsId/docs', function (req,res) {
    var docs = findAddonDocSections(req.params.addonsId);
    if (!docs) {
        res.status(404);
        res.end();
    } else { 
        // Return the IDs only
        res.json(Object.keys(docs));
    }
});

app.get('/api/addons/:addonsId/docs/:docSection', function (req,res) {
    var docs = findAddonDocSections(req.params.addonsId);
    if (!docs) {
        res.status(404);
        res.end();
    } else { 
        var value = docs[req.params.docSection];
        if (!value) { 
            res.status(404);
            res.end();
            return;
        }
        if (!value['contents']) {
            renderAsciidoc(value, res, function(data) {
                value['contents'] = data;
                res.header("Content-Type", "text/html");
                res.write(value['contents']);
                res.end();
            });
        } else { 
            res.header("Content-Type", "text/html");
            res.write(value['contents']);
            res.end();
        }
    }
});

app.get('/api/contributors', function(req, res) {
    var contrib = cache.get('allContributors');
    if (!contrib) {
        fetchUrl(config.get('FORGE_CONTRIBUTORS_URL'), function(error, meta, response) { 
            if (meta.status == 200) {
                cache.set('allContributors',response);
                res.header("Content-Type", "application/json");
                res.write(response);
            }
            res.end();
        });
    } else { 
        res.header("Content-Type", "application/json");
        res.write(contrib);
        res.end();
    }
});

app.get('/api/docs', function(req, res) {
    res.json(allDocs());
});

app.get('/api/docs/:docsId', function (req,res) {
    var docs = allDocs();
    var item = findById(docs,req.params.docsId);
    if (!item) {
        res.status(404);
        res.end();
    } else { 
        //Add related docs
        item.relatedDocs = [];
        while (item.relatedDocs.length < 5 && docs.length != 0) { 
             var idx = Math.floor(Math.random() * docs.length); 
             var elem = docs[idx];
             if (elem.type === item.type && elem.id != item.id) {
                item.relatedDocs.push({id: elem.id, title: elem.title});
             }
             docs.splice(idx, 1);
        }
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
    var data = yamlLoadAll(body)[0];
    data.latestReleaseMoment = moment(data.latestReleaseDate).fromNow();
    res.json(data);
});

/** Github hook */
/** Pull from the website-data repository*/
app.post('/api/v2/webhooks/cache_invalidate', function(req, res) {
    Git.pull(config.get('FORGE_WEBSITE_DATA_DIR'));
    cache.flushAll();
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
            link: 'http://forge.jboss.org/news/' + newsItem.id, 
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

/** SH Script */
app.get('/sh', function(req,res) {
    fetchUrl(config.get('FORGE_SH_URL'), function(error, meta, response) { 
        if (meta.status == 200) {
            res.write(response);
        }
        res.end();
    });
});

app.get(/\/?.*(\/1.x\/?)|([.](js|css|png|ico|html|jpg|ttf|wof))/, restify.serveStatic({default: 'index.html', directory: './app/', cache: true}));

// Everything except the already defined routes. IMPORTANT: this should be the last route
app.get(/\/?.*/, function(req,res) {
    fs.readFile('app/index.html', 'utf-8', function (err,file){
        if (err) {
           res.send(500);
           res.end();
        }
        res.status(200);
        res.header("Content-Type", "text/html");
        res.write(file);
        res.end();
    });
});

// Start the server
app.listen(config.get('PORT'), config.get('IP'), function () {
    // Clone the website-data repository
    Git.clone(config.get('FORGE_WEBSITE_DATA_URL'), config.get('FORGE_WEBSITE_DATA_DIR'));    
    console.log( "Listening on %s, port %s", config.get('IP'), config.get('PORT') );
});

/** Auxiliary functions **/
function allAddons() {
    var addons = cache.get('allAddons');
    if (!addons) {
        var communityAddons = yamlLoadAll(fs.readFileSync(config.get('FORGE_WEBSITE_DATA_DIR') + "/addons-community.yaml"))
            .map(function (item) {
                item.type = 'community';
                item.installCmd = (item.installCmd || 'addon-install-from-git --url '+item.repo+' --coordinate '+item.id+ (item.ref != 'master' ? ' --ref '+item.ref : ''));
                if (!util.isArray(item.installCmd)) {
                    item.installCmd = [item.installCmd];
                }
                if (item.tags) {
                    item.tags = item.tags.split(',').map(function(elem){return elem.trim().toLowerCase();});
                }
                return item;
            });
        var coreAddons = yamlLoadAll(fs.readFileSync(config.get('FORGE_WEBSITE_DATA_DIR') + "/addons-core.yaml"))
            .map(function (item) {
                item.type = 'core';
                item.installCmd = (item.installCmd || 'addon-install --coordinate '+item.id);
                if (!util.isArray(item.installCmd)) {
                    item.installCmd = [item.installCmd];
                }                
                if (item.tags) {
                    item.tags = item.tags.split(',').map(function(elem){return elem.trim().toLowerCase();});
                }
                return item;
            });
        addons = { 'community': communityAddons, 'core' : coreAddons};
        cache.set('allAddons',addons);
    }
    return addons;
}

function findAddonDocSections(addonId) {
    var cacheKey = 'docs_'+addonId;
    var docs = cache.get(cacheKey);
    if (!docs) {
        var addons = allAddons();
        var item = findById(addons['community'],addonId);
        if (!item) {
            item = findById(addons['core'],addonId);
        }
        if (item) {
            // TODO: Pick only addon doc sections that exist
            docs =  { 
                // 'stats' : {path: 'README.asciidoc', repo: item.repo, ref: item.ref},
                // 'reviews' : {path: 'README.asciidoc', repo: item.repo, ref: item.ref},
                // 'changelog' : {path: 'CHANGELOG.asciidoc', repo: item.repo, ref: item.ref},
                'Readme' : {path: ((item.path || '') +'/README.asciidoc'), repo: item.repo, ref: item.ref},
                // 'support' : {path: 'README.asciidoc', repo: item.repo, ref: item.ref}
            }
            cache.set(cacheKey, docs);
        }
    }
    return docs;
}

function allNews() { 
    var news = cache.get('allNews');
    if (!news) {
        var body = fs.readFileSync(config.get('FORGE_WEBSITE_DATA_DIR') + "/news.yaml");
        news = yamlLoadAll(body).map(function (item) {
            // Add an ID to the news 
            item.id = generateId(item.title);
            return item;
        });
        cache.set('allNews',news);
    }
    return news;
}

function allDocs() { 
    var docs = cache.get('allDocs');
    if (!docs){
        var body = fs.readFileSync(config.get('FORGE_WEBSITE_DATA_DIR') + "/docs.yaml");
        docs = yamlLoadAll(body).map(function (item) {
            // Add an ID to the doc
            item.id = generateId(item.title);
            return item;
        });
        cache.set('allDocs',docs);
    }
    return docs;
}

function fetchContents(col, id, res){
    var item = findById(col,id);
    if (!item) {
        res.status(404);
        res.end();
        return;            
    }
    renderAsciidoc(item,res);
}

function renderAsciidoc(item, res, _callback) { 
    if (item.renderedBy === 'redoculous') {
        renderUsingRedoculous(item,res,_callback);
    } else { 
        renderUsingAsciidoctor(item, res, _callback);
    }
}

function renderUsingAsciidoctor(item, res, _callback) { 
    // Using Asciidoctor.js
    var urlOptions = {
        protocol: 'https:',
        host : 'raw.githubusercontent.com',
        pathname: item.repo.replace('https://github.com/','').replace('.git','/') + item.ref + item.path
    };
    fetchUrl(url.format(urlOptions), function(error, meta, response) { 
        if (meta.status == 200) {
            response = processor.$convert(response.toString());
            response = transposeImages(item, response);
            if (_callback) {
                _callback(response);
            } else { 
                res.write(response);
            }
        } else { 
            res.status(meta.status);
            res.header("Content-Type", "text/html");
            if (error) 
                res.write(error);
            res.write("\nStatus: "+meta.status+" - "+url.format(urlOptions));
        }
        res.end();        
    });
}

function renderUsingRedoculous(item, res, _callback) { 
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
        if (meta.status == 200) {
            response = transposeImages(item, response);
            response = fixEncodingIssues(response);
            if (_callback) {
                _callback(response);
            } else { 
                res.write(response);
            }
        } else { 
            res.status(meta.status);
            res.header("Content-Type", "text/html");
            if (error) 
                res.write(error);
            res.write("\nStatus: "+meta.status+" - "+url.format(urlOptions));
        }
        res.end();        
    });
}
function fixEncodingIssues(response) {
    return response.replace(/&#xE2;&#x80;&#x99;/g,'&#8217;').replace(/&#xC3;&#xA0;/g,'à');
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

function transposeImages(urlInfo, response) {
     $ = cheerio.load(response);
     $('img').each(function (index, element) {
        var imgSrc = $(this).attr('src');
        if (imgSrc.indexOf("./") == 0) imgSrc = imgSrc.substring(1);
        if (imgSrc.indexOf('http') != 0) {
            //FIXME : This won't work for images outside forge/docs
            var newSrc = 'https://raw.githubusercontent.com/forge/docs/master/' + urlInfo.path.substring(0,urlInfo.path.lastIndexOf('/')) + "/" + imgSrc;
            $(this).attr('src',newSrc);
        }
     });
     return $.html();
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
