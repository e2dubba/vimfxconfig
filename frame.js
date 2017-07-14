vimfx.listen('getURL', callback => {
    var url = content.location.href.toString();
    console.log(url);
    callback(url)
});

vimfx.listen('authhelper', ({example}, callback) => {
    console.log('initialized!')
    var pageTitle = document.getElementByClassName('page-title');
    console.log('hello?')
    pageTitle = pageTitle.innerHTML;
    var controlNum = document.getElementByClass('table-fieldgroup__column ')
        console.log(controlNum);
    callback(pageTitle)
});



    
