'use strict';

let express = require('express');
let router = express.Router();
let cl = require("../config/sphinx-client.js"),
    util = require('util'),
    config = require('../config/config');

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {
        title: 'Full text search'
    });
});

router.get('/search', function (req, res) {
    let keyword = req.param('s'),
        page = req.param('p') || 1;
    let link = req.url;
    let regex = new RegExp('&p=');
    if (regex.test(link))
        link = link.replace(/&p=(\d)+/, '&p={page}');
    else link += '&p={page}';

    if (keyword != undefined && keyword != '') {
        let index = (req.param('type') == 'book') ? 'bookIndex' : 'jobIndex';
        //Search
        cl.SetLimits(0, 10000);
        cl.AddQuery(keyword, index);
        cl.RunQueries(function (err, result) {
            //console.log(util.inspect(result, false, null, true));
            if (result) {
                let ids = [];
                result[0].matches.forEach(function (item) {
                    ids.push(item.id);
                });
                if(index=='bookIndex') {
                    __models.book.findAndCountAll({
                        where: {
                            id: {
                                in: ids
                            }
                        },
                        limit: config.pagination.number_item,
                        offset: (page - 1) * config.pagination.number_item
                    }).then(function (posts) {
                        let totalPage = Math.ceil(posts.count / config.pagination.number_item);
                        res.render('search', {
                            keyword: keyword,
                            items: posts.rows,
                            total: posts.count,
                            totalPage: totalPage,
                            currentPage: page,
                            link: link,
                            type: req.param('type'),
                            title: "Tìm kiếm: " + keyword
                        });
                    });
                } else {
                    __models.job.findAndCountAll({
                        where: {
                            id: {
                                in: ids
                            }
                        },
                        limit: config.pagination.number_item,
                        offset: (page - 1) * config.pagination.number_item
                    }).then(function (posts) {
                        let totalPage = Math.ceil(posts.count / config.pagination.number_item);
                        res.render('search', {
                            keyword: keyword,
                            items: posts.rows,
                            total: posts.count,
                            totalPage: totalPage,
                            currentPage: page,
                            link: link,
                            type: req.param('type'),
                            title: "Tìm kiếm: " + keyword
                        });
                    });
                }

            } else {
                res.render('search', {
                    title: "Tìm kiếm: " + keyword,
                    keyword: keyword,
                    total: 0
                });
            }

        });
    } else {
        res.redirect('/');
    }
});

module.exports = router;
