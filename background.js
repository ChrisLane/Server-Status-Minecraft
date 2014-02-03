var ip;
var port;
var t;

function loadExtension () {
	ip = localStorage["ip0"];
	if (!ip) {
		ip = "localhost";
	}
	port = localStorage["port0"];
	if (!port) {
		port = "25565";
	}
	checkState();
}

function checkState () {
	var xhr = new XMLHttpRequest();
	if(port == "25565") {
		xhr.open("GET", "http://minecraft-api.com/v1/get/?server=" + ip, true);
	} else {
		xhr.open("GET", "http://minecraft-api.com/v1/get/?server=" + ip + ":" + port, true);
	}
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			data = JSON.parse(xhr.responseText);
			if (data.status) {
				chrome.browserAction.setIcon({path: "up.png"});
				chrome.browserAction.setBadgeText({text: "" + data.players.online});
			} else {
				chrome.browserAction.setIcon({path: "down.png"});
				chrome.browserAction.setBadgeText({text: "down" });
			}
		}
	}
	xhr.send();
	if(localStorage["refresh"] != null) {
		t = setTimeout(checkState, 1000*localStorage["refresh"]);
	} else {
		t = setTimeout(checkState, 1000*60);
	}
}

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    switch (true) {
        case request.restart:
		t = null;
		loadExtension();
		break;
    }
    return true;
});

loadExtension();