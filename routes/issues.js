var express = require('express');
var router = express.Router();
var Trello = require("node-trello");
var async = require('async');
var marked = require('marked');

var ORGANIZATION_NAME = "groomservice";

/* GET issues index */
router.get('/', function(req, res) {
    var t = new Trello(process.env.GROOM_SERVICE_TRELLO_KEY, req.cookies.gs_trello_token);
    t.get("/1/organizations/" + ORGANIZATION_NAME + "/boards", function(err, data) {
        if (err) throw err;
        res.render('issues/index', { issues: data });
    });
});

/* GET issue show */
router.get('/:id', function(req, res) {
    var t = new Trello(process.env.GROOM_SERVICE_TRELLO_KEY, req.cookies.gs_trello_token);
    async.parallel({
        issue: function(callback) {
            t.get("/1/boards/" + req.params.id, callback);
        },
        articles: function(callback) {
            t.get("/1/boards/" + req.params.id + "/cards", { attachments: true }, callback);
        }
    }, function(err, data) {
        if (err) throw err;
        data.articles.forEach(function(article) {
            article.desc = marked(article.desc);
            console.log(article);
        });
        res.render('issues/show', data);
    });
});

/* POST issue publish */
router.post('/:id/publish', function(req, res) {
    var issue = { id: req.params.id };
    res.send('Success!');
});

module.exports = router;
