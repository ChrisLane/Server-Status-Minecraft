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
	$.get('http://minecraft-api.com/v1/get/?server=' + ip, function(data) {
		if (data.status) {
			chrome.browserAction.setIcon({path: 'images/up.png'});
			chrome.browserAction.setBadgeText({text: '' + data.players.online});
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