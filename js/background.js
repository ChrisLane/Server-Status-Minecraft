var ip;
var timer;

function loadExtension () {
	ip = localStorage['ip0'];
	if (!ip) {
		ip = 'localhost:25565';
	}
	
	checkState();
}

function checkState () {
	$.get('http://198.50.146.38/ping.php?ip=' + ip, function(data) {
		if (data.max != null) {
			chrome.browserAction.setIcon({path: 'images/up.png'});
			chrome.browserAction.setBadgeText({text: '' + data.online});
		} else {
			chrome.browserAction.setIcon({path: 'images/down.png'});
			chrome.browserAction.setBadgeText({text: 'OFF' });
		}
	});
	
	timer = setTimeout(checkState, 1000*60);
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