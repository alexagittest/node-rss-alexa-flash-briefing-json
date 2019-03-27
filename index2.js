const request = require('request'),
parser = require("fast-xml-parser"),
moment = require("moment"),
uuid = require("uuid/v5"),
tokenizer = require('sbd');

const FEED_URL="https://jokesch.de/rss"

let cache = {}
let alexaItems = []

const options = {
    "newline_boundaries" : false,
    "html_boundaries"    : false,
    "sanitize"           : true,
    "allowed_tags"       : false,
    "preserve_whitespace" : true,
    "abbreviations"      : null
}

request(FEED_URL, function(error, response, body){

    var result = parser.parse(body);

        result.rss.channel.item.forEach(item => {
            var date = moment(item.pubDate)
            if (moment().diff(date, "days") <= 7) {
                alexaItems.push({
                    uid: item.guid,
                    //uid: uuid(item.link, uuid.URL),
                    updateDate: date.format("YYYY-MM-DDTHH:mm:ss:SSS[.0Z]"),
                    titleText: item.title,
                    mainText: item.title + tokenizer.sentences(item.description, options).splice(0,2).join(""),
                    redirectionURL: item.link
                })
            }

        })
        cache = alexaItems
        console.log(cache)

        let response = {
            statusCode: '200',
            body: JSON.stringify({ error: 'you messed up!' }),
            headers: {
                'Content-Type': 'application/json',
        }
};

})