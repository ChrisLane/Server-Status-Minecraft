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
	$.get('https://aron.li/mss/ping.php?ip=' + ip, function(data) {
		if (data.max != null) {
			$("#o" + id).html(data.online + '/' + data.max);
			if (data.online == 0)
				$('#ps' + id).html('<p>Nobody :(</p>');
			if (data.sample != null)
				for (var i = 0; i < data.sample.length; i++)
					$('#ps' + id).append('<p><img src="http://cravatar.eu/avatar/' + data.sample[i].name + '/24.png" alt="' + data.sample[i].name + '"> ' + data.sample[i].name + '</p>');
		} else {
			$('#o' + id).html('OFFLINE');
			$('#ps' + id).html('<p>Server offline</p>');
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