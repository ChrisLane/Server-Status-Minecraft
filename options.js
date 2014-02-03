var servers;
var ip = new Array();
var port = new Array();

function createPage () {
	loadSettings();
	document.getElementById("refresh").value = rInterval;
	
	for(var i=0; i < servers; i++) {
		document.getElementById("options").innerHTML += '<input class="ip" id="ip' + i + '" type="text" value="' + ip[i] + '" />'
		+ '<input class="port" id="port' + i + '" type="text" value="' + port[i] + '" />'
		+ '<br>';
	}
}

function loadSettings () {
	servers = localStorage["servers"];
	if (!servers || servers == 0) {
		servers = 1;
	}
	rInterval = localStorage["refresh"];
	if (!rInterval) {
		rInterval = 60;
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

function addServer() {
	if(!localStorage["servers"]) {
		localStorage["servers"] = 2;
	} else {
		localStorage["servers"] = ip.length + 1;
	}
	document.getElementById("options").innerHTML = "";
	createPage();
}

function save_options () {
	var e = "Options Saved!";
	
	var c = 0;
	var s = servers;
	for(var i=0; i < servers; i++) {
		if(document.getElementById("ip" + i).value != "" && document.getElementById("port" + i).value != "") {
			localStorage["ip" + c] = document.getElementById("ip" + i).value;
			localStorage["port" + c] = document.getElementById("port" + i).value;
			c++;
		} else {
			localStorage["ip" + c] = "";
			localStorage["port" + c] = "";
			servers--;
		}
	}
	
	localStorage["servers"] = servers;
	
	var r = document.getElementById("refresh").value;
	if(!isNaN(r) && r >= 1 && r <= 600) {
		localStorage["refresh"] = document.getElementById("refresh").value;
	} else {
		e = "Refresh interval is invalid! Must be a number between 1 and 600!<br />";
	}
	
	document.getElementById("saved").innerHTML = e;
	chrome.extension.sendMessage({restart: true});
	setTimeout(function() {
		document.getElementById("saved").innerHTML = "";
	}, 2000);
	document.getElementById("options").innerHTML = "";
	createPage();
}

document.querySelector('#add').addEventListener('click', addServer);
document.querySelector('#save').addEventListener('click', save_options);
document.addEventListener('DOMContentLoaded', function () {
	createPage();
});