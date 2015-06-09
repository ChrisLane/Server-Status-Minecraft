var ip;
var timer;

var IPRegex = new RegExp("^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$");
var HostnameRegex = new RegExp("^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$");

function loadExtension () {
    ip = localStorage['ip0'];
    if (!ip) {
        ip = 'localhost:25565';
    }
    
    var split = ip.split(":");
    
    if ((IPRegex.test(split[0]) || HostnameRegex.test(split[0])) && split[0].indexOf("localhost") === -1 && split[0].indexOf("127.0.0.1") === -1 && ((!isNaN(split[1]) && split[1] >= 0 && split[1] <= 65535) || split.length === 1)) {
        checkState();
    } else {
        chrome.browserAction.setIcon({path: 'images/down.png'});
        chrome.browserAction.setBadgeText({text: 'OFF' });
    }
}

function checkState () {
    $.get('http://198.50.146.38/ping.php?ip=' + ip, function(data) {
        if (data.max !== null) {
            chrome.browserAction.setIcon({path: 'images/up.png'});
            chrome.browserAction.setBadgeText({text: '' + data.online});
        } else {
            chrome.browserAction.setIcon({path: 'images/down.png'});
            chrome.browserAction.setBadgeText({text: 'OFF' });
        }
    });
    
    timer = setTimeout(checkState, 1000*300);
}

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    switch (true) {
        case request.restart:
            timer = null;
            loadExtension();
            break;
    }
    return true;
});

$(document).ready(function() {
    loadExtension();
});