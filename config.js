const atlaAuthUrl = "http://nova.atla.com/admin/workbench/search?product=&type=authority&query=%s&heading=&series=&author=&subject=&class=&lang=&keydate=&id_type=&value=&ed_state=&image=&acqu=&assignee_uid=&x=&x_past=&uid=&created%5Bgte%5D=&created%5Blte%5D=&vid_uid=&changed%5Bgte%5D=&changed%5Blte%5D="
vimfx.addCommand({
    name: 'nodeyanker',
    description: 'Yank the last node in the url',
}, ({vim}) => {
    var currentWindow = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator).getMostRecentWindow("navigator:browser");
    var currBrowser = currentWindow.getBrowser();
    var currURL = currBrowser.currentURI.spec;
    var node = currURL.split('/').pop()
    var gClipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper);
    gClipboardHelper.copyString(node);
    vim.notify(`Copied: ${node}`)
    
    console.log(node)
});

vimfx.set('custom.mode.normal.nodeyanker', 'Y');


vimfx.addCommand({
    name: 'shulgi',
    description: 'Open Clipboard data in Google Translate without new lines',
}, ({vim}) => {
    var pastetext = getClipData();
    pastetext = pastetext.replace(/\-\r?\n/g, '');
    pastetext = pastetext.replace(/\r?\n/g, ' ');
    vim.notify(`Opening Google Translate`)
    var gurl = 'https://translate.google.com/#auto/en/';
    gurl += encodeURIComponent(pastetext);
    openTab(gurl)
});


vimfx.set('custom.mode.normal.shulgi', 'U');

vimfx.addCommand({
    name: 'atla',
    description: 'Look up names in different places'
}, ({vim}) => {
    var pastetext = authClipData();
    vim.notify(`Authority Search! ${pastetext}`)
    pastetext = encodeURIComponent(pastetext);
    var viafURL = "http://viaf.org/viaf/search?query=local.names+all+\"{{s}}\"&sortKeys=holdingscount&recordSchema=BriefVIAF".replace('{{s}}', pastetext);
    var atlaURL = atlaAuthUrl.replace('%s', pastetext);
    openTab(atlaURL);
    openTab(viafURL);

});

vimfx.set('custom.mode.normal.atla', 'au');

vimfx.addCommand({
    name: 'authcopy',
    description: 'reformat authority titles'
}, ({vim}) => {
    var pastetext = authClipData();
    const gClipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper);
    gClipboardHelper.copyString(pastetext);
    vim.notify(`Fixed and copied: ${pastetext}`)
});

vimfx.set('custom.mode.normal.authcopy', 'ay')

vimfx.addCommand({
    name: 'authauthsearch',
    description: 'search for just authority titles'
}, ({vim}) => {
    var pastetext = authClipData();
    pastetext = encodeURIComponent(pastetext);
    var atlaURL = atlaAuthUrl.replace('%s', pastetext);
    openTab(atlaURL)
});

vimfx.set('custom.mode.normal.authauthsearch', 'aA');




function getClipData() {
    var trans = Components.classes["@mozilla.org/widget/transferable;1"].createInstance(Components.interfaces.nsITransferable);
    trans.init(null)
    trans.addDataFlavor("text/unicode");
    Services.clipboard.getData(trans, Services.clipboard.kGlobalClipboard);
    var str = {};
    var strLength = {};
    trans.getTransferData("text/unicode", str, strLength);
    if (str) {
        var pastetext = str.value.QueryInterface(Components.interfaces.nsISupportsString).data;
    };
    return pastetext 
};

function authClipData() {
    let pastetext = getClipData();
    // pastetext = pastetext.replace('Authority: ', '');
    pastetext = pastetext.replace(/[A-Z]\w*: /, '');

    return pastetext
};

// the next few lines will have to be changed to `browser.tabs.create({url: gurl})`
// if vimfx updates to webextensions
function openTab(url) {
    var currentWindow = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator).getMostRecentWindow("navigator:browser");
    var currBrowser = currentWindow.getBrowser();
    currBrowser.addTab(url);
};

vimfx.addCommand({
    name: "authsearch",
    description: "search database for control number, or phrase"
}, ({vim}) => {
    var pastetext = authClipData();
    pastetext = encodeURIComponent(pastetext);
    var atlaURL = 'http://nova.atla.com/admin/workbench/search?product=&type=&query=%s&heading=&series=&author=&subject=&class=&lang=&keydate=&id_type=&value=&ed_state=&image=&acqu=&assignee_uid=&x=&x_past=&uid=&created%5Bgte%5D=&created%5Blte%5D=&vid_uid=&changed%5Bgte%5D=&changed%5Blte%5D='.replace('%s', pastetext);
    openTab(atlaURL);

    vim.notify(`Searching atla: ${pastetext}`)
});

vimfx.set('custom.mode.normal.authsearch', 'aa')

vimfx.addCommand({
    name: "booksearch",
    description: "search database for book search"
}, ({vim}) => {
    var pastetext = authClipData();
    pastetext = pastetext.replace('.', '').toLowerCase().replace(/:/g, ' ').replace(/\?/g, '\\?');
    pastetext = encodeURIComponent(pastetext);
    var atlaURL = 'http://nova.atla.com/admin/workbench/search?product=&type=book&query=%s&heading=&series=&author=&subject=&class=&lang=&keydate=&id_type=&value=&ed_state=&image=&acqu=&assignee_uid=&x=&x_past=&uid=&created%5Bgte%5D=&created%5Blte%5D=&vid_uid=&changed%5Bgte%5D=&changed%5Blte%5D=&search=Search'.replace('%s', pastetext);
    openTab(atlaURL);
    vim.notify(`Searching atla: ${pastetext}`)
});

vimfx.set('custom.mode.normal.booksearch', 'ab')


vimfx.addCommand({
    name: 'clipshow',
    description: 'show clipboard contents'
}, ({vim}) => {
    var cliptext = getClipData();
    vim.notify(`Clipboard: ${cliptext}`)
});

vimfx.set('custom.mode.normal.clipshow', 'sy')

vimfx.addCommand({
    name: 'viafauthlookup',
    description: 'look up authority records in viaf'
}, ({vim}) => {
    var pastetext = authClipData();
    pastetext = encodeURIComponent(pastetext);
    var viafURL = "http://viaf.org/viaf/search?query=local.names+all+\"{{s}}\"&sortKeys=holdingscount&recordSchema=BriefVIAF".replace('{{s}}', pastetext);
    openTab(viafURL)
});

vimfx.set('custom.mode.normal.viafauthlookup', 'aV')

vimfx.addCommand({
    name: 'authhelper',
    description: 'Help gather Auth Data'
}, ({vim}) => {
    console.log('triggered');
    vimfx.send(vim, 'authhelper', {example: 5}, authdata => {
        console.log('page title: ', authdata)
    })
});

vimfx.set('custom.mode.normal.authhelper', 'ap')
    
