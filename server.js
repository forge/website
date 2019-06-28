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
    marked      = require('marked'),
    util = require('util');
// Git utilities
var Git         = 
    { 
        clone: function(gitUrl, gitDir) { 
            exec( 'rm -rf '+ gitDir +' && git clone ' + gitUrl + ' ' + gitDir);
        },
        checkout: function(branch, gitDir) {
	    //Change to execSync
            exec( 'cd '+gitDir+' && git checkout '+branch);
        },
        pull : function (gitDir) {
            exec( 'cd ' + gitDir + ' && git pull');
        }
    };
var config      = cc()
                    .add(
                        {
                            'FORGE_CONTRIBUTORS_URL' : 'https://api.github.com/repos/forge/core/contributors',
                            'FORGE_SH_URL' : 'https://raw.githubusercontent.com/forge/core/master/forge-install.sh',
                            'REDOCULOUS_HOST': (process.env.REDOCULOUS_HOST || 'redoculous.forge.svc:8080'),
                            'FORGE_WEBSITE_DATA_URL': 'https://github.com/forge/website-data',
                            'FORGE_WEBSITE_DATA_DIR': (process.env.OPENSHIFT_DATA_DIR || '/tmp')  + '/website-data'
                        }),
    app         = restify.createServer(),
    cache       = new NodeCache({stdTTL: 1000, checkperiod: 120 }),
    processor   = asciidoctor.Asciidoctor(true);

    marked.setOptions({
      renderer: new marked.Renderer(),
      sanitize: true,
      smartLists: true,
      smartypants: false
    });

app.use(restify.gzipResponse());
app.use(restify.queryParser());
app.use(restify.CORS());
app.use(restify.fullResponse());
// Add security headers
app.use(function(req, res, next) {
    //res.header("Content-Security-Policy","default-src 'self'; script-src 'self' https://www.google-analytics.com; object-src 'none'; frame-ancestors 'none'; style-src 'self' 'unsafe-inline'; frame-src 'self' https://player.vimeo.com https://www.youtube.com https://ghbtns.com; img-src 'self' https://www.google-analytics.com https://asciinema.org");
    res.header("X-Frame-Options", "DENY");
    next.call();
});
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
            render(value, res, function(data) {
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
    if (data.experimental)
        data.experimental.releaseMoment = moment(data.experimental.releaseDate).fromNow();
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
        copyright: 'Copyright '+new Date().getFullYear()+' Red Hat, Inc. and/or its affiliates',
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
    res.write(feed.atom1());
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

app.get('/docs/index.html', function (req,res) {
    res.header('Location', '/documentation');
    res.send(302);
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
    //Git.checkout('split',config.get('FORGE_WEBSITE_DATA_DIR'));
    console.log( "Listening on %s, port %s", config.get('IP'), config.get('PORT') );
});

/** Auxiliary functions **/
function allAddons() {
    var addons = cache.get('allAddons');
    if (!addons) {
        var communityAddons = yamlLoadAllFiles(config.get('FORGE_WEBSITE_DATA_DIR') + "/addons/community/")
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
        var coreAddons = yamlLoadAllFiles(config.get('FORGE_WEBSITE_DATA_DIR') + "/addons/core/")
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
                'Readme' : {path: ((item.path || '') + '/' + (item.home || 'README.asciidoc')), repo: item.repo, ref: item.ref},
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
        news = yamlLoadAllFiles(config.get('FORGE_WEBSITE_DATA_DIR') + "/news/")
            .reverse()
            .map(function (item) {
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
        docs = yamlLoadAllFiles(config.get('FORGE_WEBSITE_DATA_DIR') + "/docs/")
            .map(function (item) {
                // Add an ID to the doc
                item.id = generateId(item.title);
                item.editURL = url.format({
                       protocol: 'https:',
                        host : 'github.com',
                        pathname: item.repo.replace('https://github.com/','').replace('.git','/edit/') +  item.ref + item.path
                });
                item.historyURL = url.format({
                       protocol: 'https:',
                        host : 'github.com',
                        pathname: item.repo.replace('https://github.com/','').replace('.git','/commits/') +  item.ref + item.path
                });
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
    render(item,res);
}

function render(item, res, _callback) { 
    if (item.renderedBy === 'markdown') {
        renderUsingMarkdown(item, res, _callback);
    } else if (item.renderedBy === 'redoculous') {
        renderUsingRedoculous(item,res, _callback);
    } else { 
        renderUsingAsciidoctor(item, res, _callback);
    }
}

function renderUsingMarkdown(item, res,_callback) {
    var urlOptions = {
        protocol: 'https:',
        host : 'raw.githubusercontent.com',
        pathname: item.repo.replace('https://github.com/','').replace('.git','/') + item.ref + item.path
    };
    fetchUrl(url.format(urlOptions), function(error, meta, response) { 
        if (meta.status == 200) {
            response = marked(response.toString());
            response = transposeImages(url.format(urlOptions).replace(item.path, item.linkTransposition || ''), response);
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
            response = transposeImages(url.format(urlOptions).replace(item.path, item.linkTransposition || ''), response);
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
            var baseUrlOptions = {
                protocol: 'https:',
                host : 'raw.githubusercontent.com',
                pathname: item.repo.replace('https://github.com/','').replace('.git','/') + item.ref + item.linkTransposition
            };            
            response = transposeImages(url.format(baseUrlOptions), response);
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

function transposeImages(baseUrl, response) {
     $ = cheerio.load(response);
     $('img').each(function (index, element) {
        var imgSrc = $(this).attr('src');
        if (imgSrc.indexOf("./") == 0) imgSrc = imgSrc.substring(1);
        if (imgSrc.indexOf('http') != 0) {
            var newSrc = baseUrl + "/" + imgSrc;
            $(this).attr('src',newSrc);
        }
     });
     return $.html();
}

/** Loads all the YAML file contents into a single JS array */
function yamlLoadAllFiles(path) {
    var allEntries = [];
    var files = fs.readdirSync(path);
    files.forEach(function (file) {
        var body  = fs.readFileSync(path + file);
        yamlLoadAll(body, allEntries);
    }); 
    return allEntries;
}

function yamlLoadAll(body, entries) {
    var allEntries = entries || [];
    yaml.safeLoadAll(body, function (entry) {
    	if (entry) {
    	   allEntries.push(entry);
	}
    });
    return allEntries;
}

/** Generate an URL-friendly ID based on the content */
function generateId(content) { 
    return content.toLowerCase().replace(/ /g,'-');
}
