var FeedParser = require('feedparser');
var request = require('request'); // for fetching the feed 
var fs = require('fs'); 
 
 module.exports = (cb)=>{
    var req = request('http://rss.cnn.com/rss/cnn_topstories.xml')
    var feedparser = new FeedParser({});
    
    req.on('error', function (error) {
      console.error(error);
    });
    
    req.on('response', function (res) {
      var stream = this; // `this` is `req`, which is a stream 
    
      if (res.statusCode !== 200) {
        this.emit('error', new Error('Bad status code'));
      }
      else {
        stream.pipe(feedparser);
      }
    });



    feedparser.on('error', function (error) {
      console.error(error);
    });

    var news = "";
    feedparser.on('readable', function () {
      // This is where the action is! 
      var stream = this; // `this` is `feedparser`, which is a stream 
      var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance 
      var item;

      while (item = stream.read()) {
        news += "          " + item.title;
      }
    });

    req.on('end', ()=>{
        fs.writeFile("results.txt", news, err=>{
            if(err){
                console.error("unable to write to results.txt");
                cb(err);
            }
            else{
              cb();
            }
        });
    });
 };
