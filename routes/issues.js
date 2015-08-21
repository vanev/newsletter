var express = require('express');
var router = express.Router();
var Trello = require("node-trello");
var async = require('async');
var marked = require('marked');

/* GET issues index */
router.get('/', function(req, res) {
    var t = new Trello(process.env.NEWSLETTER_TRELLO_KEY, req.cookies.trello_token);
    t.get("/1/organizations/" + process.env.NEWSLETTER_TRELLO_ORGANIZATION_NAME + "/boards", function(err, data) {
        if (err) throw err;
        res.render('issues/index', { issues: data });
    });
});

/* GET issue show */
router.get('/:id', function(req, res) {
    var t = new Trello(process.env.NEWSLETTER_TRELLO_KEY, req.cookies.trello_token);
    async.parallel({
        issue: function(callback) {
            t.get("/1/boards/" + req.params.id, callback);
        },
        cards: function(callback) {
            t.get("/1/boards/" + req.params.id + "/cards", { attachments: true }, callback);
        }
    }, function(err, data) {
        if (err) throw err;

        data.cards.filter(function(card) {
            return card.name.match(/(^_[a-zA-Z]*)/);
        }).forEach(function(card) {
            var name = card.name.match(/^_([a-zA-Z]*)/)[1];
            data[name] = card;
        });

        data.articles = data.cards.map(function(card) {
            card.desc = marked(card.desc);
            return card;
        }).filter(function(card) {
            return !card.name.match(/(^_[a-zA-Z]*)/);
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
