var cnn = require('./cnn');
setInterval(()=>{
    cnn((err)=>{
        if(err) console.error(err);
        console.log('ended');
    })
}, 5000)