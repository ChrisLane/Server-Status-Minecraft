var servers;
var label = new Array();
var ip = new Array();

function loadSettings () {
	servers = localStorage['servers'];
	if (!servers || servers == 0)
		servers = 1;
	
	for (var i = 0; i < servers; i++) {
		label[i] = localStorage['label' + i];
		if (!label[i])
			label[i] = 'Server';
			
		ip[i] = localStorage['ip' + i];
		if (!ip[i])
			ip[i] = 'localhost';
	}
}

function createPage () {
	for (var i = 0; i < servers; i++) {
		$('#status').append(
			'<a id="s' + i + '" href="#" class="list-group-item active">'
			+ '<span id="o' + i + '" class="badge"></span>'
			+ label[i]
			+ '</a>'
			+ '<li class="list-group-item" id="ps' + i + '">'
			+ '</li>');
		if (i > 0)
			$('#ps' + i).hide();
		retrieveInfo(i, ip[i]);
	}
}

function retrieveInfo (id, ip) {
	$.get('http://minecraft-api.com/v1/get/?server=' + ip, function(data) {
		if (data.status) {
			$("#o" + id).html(data.players.online + '/' + data.players.max);
			if (data.players.online == 0)
				$('#ps' + id).html('<p>Nobody :(</p>');
			$.get('http://minecraft-api.com/v1/players/?server=' + ip, function(pdata) {
				if (pdata.players != null) {
					for (var i = 0; i < pdata.players.length; i++) {
						$('#ps' + id).append('<p><img src="http://cravatar.eu/avatar/' + pdata.players[i] + '/24.png" alt="' + pdata.players[i] + '"> ' + pdata.players[i] + '</p>');
					}
				} else if (pdata.error != null) {
					$('#ps' + id).html('<p>Failed to load players</p>');
				}
			});
		} else {
			$('#o' + id).html('OFFLINE');
			$('#ps' + id).html('<p>Server offline :(</p>');
		}
	});
}

function toggleServer(that) {
	var id = '#p' + $(that).attr('id');
	$(id).toggle();
}

$(document).ready(function() {
	chrome.extension.sendMessage({restart: true});
	loadSettings();
	createPage();
	
	$('a').click(function(){
		if ($(this).attr('id').indexOf('s') != -1)
			toggleServer(this); return false;
	});
});