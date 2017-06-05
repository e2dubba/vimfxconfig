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
    vim.notify(`Authority copied! ${pastetext}`)
    pastetext = encodeURIComponent(pastetext);
    var viafURL = "http://viaf.org/viaf/search?query=local.names+all+\"{{s}}\"&sortKeys=holdingscount&recordSchema=BriefVIAF".replace('{{s}}', pastetext);
    var atlaURL = "http://nova.atla.com/admin/workbench/search?product=&type=authority&query=%s&heading=&series=&author=&subject=&class=&lang=&keydate=&id_type=&value=&ed_state=&image=&acqu=&assignee_uid=&x=&x_past=&uid=&created%5Bgte%5D=&created%5Blte%5D=&vid_uid=&changed%5Bgte%5D=&changed%5Blte%5D=".replace('%s', pastetext);
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
    pastetext = pastetext.replace('Authority: ', '');
    return pastetext
};

// the next few lines will have to be changed to `browser.tabs.create({url: gurl})`
// if vimfx updates to webextensions
function openTab(url) {
    var currentWindow = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator).getMostRecentWindow("navigator:browser");
    var currBrowser = currentWindow.getBrowser();
    currBrowser.addTab(url);
};
