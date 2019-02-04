const rp = require('request-promise'),
xml2js = require('xml2js'),
dateFormat = require('dateformat'),
uuid = require('uuid/v5'),
tokenizer = require('sbd'),
util = require('util');

const parseStringAsync = util.promisify(xml2js.parseString);

const FEED_URL = "";

let dataCache = {};
let newsItems = [];

const options = {
    "newline_boundaries" : false,
    "html_boundaries"    : false,
    "sanitize"           : true,
    "allowed_tags"       : false,
    "preserve_whitespace" : true,
    "abbreviations"      : null
}

rp(FEED_URL).then(xml => parseStringAsync(xml)).then(result => {
        const item = result.rss.channel[0].item;
        
        var i = 0;
        const len = item.length;
        for (; i < len; i++){
            newsItems.push({
                uid: uuid(item[i].link[0], uuid.URL),
                updateDate: dateFormat(item[i].pubDate[0], `UTC:yyyy-mm-dd'T'HH:MM:ss'.0Z'`),
                titleText: item[i].title[0],
                mainText: item[i].title[0] + ". " + tokenizer.sentences(item[i].description[0], options).splice(0,2).join(""),
                redirectionURL: item[i].link[0]
            })
        }
        dataCache = newsItems;
        console.log(JSON.stringify(dataCache, null, 4));
}).catch(console.log);