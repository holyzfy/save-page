var config = require('config');
var {promisify} = require('util');
var express = require('express');
var puppeteer = require('puppeteer');
var fs = require('fs-extra');
var path = require('path');
var to = require('await-to-js').default;

var app;

function start(callback) {
    app = initApp();
    app.listen(config.port, callback);
}

function initApp() {
    var app = express();
    app.get('/save', save);
    return app;
}

async function save(req, res) {
    var {url, filename, sign} = req.query;
    if(!validSign(sign)) {
        return res.send({
            status: 19000,
            message: '签名错误',
        });
    }
    if(!url) {
        return res.send({
            status: 10001,
            message: '参数错误',
            data: {
                url: '请填写网址'
            }
        });
    }

    filename = filename || Date.now();
    var [error] = await to(savePage(url, filename));
    if(error) {
        return res.send({
            status: 10002,
            message: error.message
        }); 
    }
    res.send({
        status: 0,
        data: {
            filename,
        },
    });
}

function validSign(sign) {
    return sign === config.sign;
}

async function savePage(url, filename) {
    var browser = await puppeteer.launch({
        //headless: false,
        executablePath: config.executablePath
    });
    var page = await browser.newPage();
    await page.goto(url);
    await fixStyle(page);
    await fixImg(page);
    await page.$$eval('script', items => {
        Array.from(items).forEach(el => el.parentNode.removeChild(el));
    });
    var html = await page.content();
    var filename = (filename || Date.now()) + '.html';
    var output = path.join(config.output, filename);
    fs.ensureDir(path.dirname(output));
    fs.outputFileSync(output, html);
    await browser.close();
}

async function fixStyle(page) {
    await page.$$eval('link', items => {
        Array.from(items).forEach(el => {
            var href = el.getAttribute('href');
            if(!href) {
                return;
            }
            if(href.startsWith('http') || href.startsWith('//')) {
                return; 
            }
            el.href = location.protocol + '//' + location.host + href;
        });
    });
}

async function fixImg(page) {
    await page.$$eval('img', items => {
        Array.from(items).forEach(el => {
            var href = el.getAttribute('src');
            if(!href) {
                return;
            }
            if(href.startsWith('http') || href.startsWith('//')) {
                return; 
            }
            el.src = location.protocol + '//' + location.host + href;
        });
    });
}

module.exports = start;
