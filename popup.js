var servers;
var ip = new Array();
var port = new Array();

function loadSettings () {
	servers = localStorage["servers"];
	if (!servers || servers == 0) {
		servers = 1;
	}
	
	for(var i=0; i < servers; i++) {
		ip[i] = localStorage["ip" + i];
		if (!ip[i]) {
			ip[i] = "localhost";
		}
		
		port[i] = localStorage["port" + i];
		if (!port[i]) {
			port[i] = "25565";
		}
	}
}

function createPage () {
	var l = chrome.extension.getURL('options.html');
	document.getElementById("options").innerHTML = "<a href='" + l + "'>Options</a>";
	
	for(var i=0; i < servers; i++) {
		retrieveInfo(ip[i],port[i]);
	}
}

function retrieveInfo (ip, port) {
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
				document.getElementById("status").innerHTML += "<fieldset><legend><span id='title'>" + ip + ":" + port + " (<b>" + data.players.online + "/" + data.players.max + "</b>)</span></legend><div id='" + ip + "'>";
				var xhrs = new XMLHttpRequest();
				if(port == "25565") {
					xhrs.open("GET", "http://minecraft-api.com/v1/players/?server=" + ip, true);
				} else {
					xhrs.open("GET", "http://minecraft-api.com/v1/players/?server=" + ip + ":" + port, true);
				}
				xhrs.onreadystatechange = function() {
					if (xhrs.readyState == 4) {
						datas = JSON.parse(xhrs.responseText);
						if (datas.players != null) {
							for(var i=0; i<datas.players.length; i++) {
								document.getElementById(ip).innerHTML += "<img src='http://cravatar.eu/avatar/" + datas.players[i] + "/24.png' alt='" + datas.players[i] + "'> " + datas.players[i] + "<br>";
							}
						}
					}
				}
				xhrs.send();
				document.getElementById("status").innerHTML += "</div></fieldset>";
			} else {
				document.getElementById("status").innerHTML += "<fieldset><legend><span id='title'>" + ip + ":" + port + "</span></legend>"
				+ "<h2><font color='#990000'>Server offline!</font></h2>"
				+ "</fieldset>";
			}
		}
	}
	xhr.send();
}

document.addEventListener('DOMContentLoaded', function () {
	chrome.extension.sendMessage({restart: true});
	loadSettings();
	createPage();
});