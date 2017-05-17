vimfx.listen('getURL', callback => {
    var url = content.location.href.toString();
    console.log(url);
    callback(url)
})
    
