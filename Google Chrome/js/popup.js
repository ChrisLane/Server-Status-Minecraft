var servers;
var label = new Array();
var ip = new Array();

var IPRegex = new RegExp("^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$");
var HostnameRegex = new RegExp("^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$");

function loadSettings () {
    servers = localStorage['servers'];
    if (!servers || servers === 0) {
        servers = 1;
    }
    
    for (var i = 0; i < servers; i++) {
        label[i] = localStorage['label' + i];
        if (!label[i]) {
            label[i] = 'My Server';
        }
        
        ip[i] = localStorage['ip' + i];
        if (!ip[i]) {
            ip[i] = 'SERVER_IP';
        }
    }
}

function createPage () {
    for (var i = 0; i < servers; i++) {
        $('#status').append('<a id="s' + i + '" href="#" class="list-group-item active">'
            + '<span id="o' + i + '" class="badge"></span>'
            + label[i]
            + '</a>'
            + '<li class="list-group-item" id="ps' + i + '">'
            + '</li>');
        
        if (i > 0) {
            $('#ps' + i).hide();
        }
        
        var split = ip[i].split(":");
        
        if ((IPRegex.test(split[0]) || HostnameRegex.test(split[0])) && split[0].indexOf("SERVER_IP") === -1 && ((!isNaN(split[1]) && split[1] >= 0 && split[1] <= 65535) || split.length === 1)) {
            retrieveInfo(i, ip[i]);
        } else if (split[0].indexOf("localhost") !== -1 || split[0].indexOf("127.0.0.1") !== -1) {
            $('#o' + i).html('ERROR');
            $('#ps' + i).html('<p>This extension does not work on local servers!</p>');
        } else {
            $('#o' + i).html('ERROR');
            $('#ps' + i).html('<p>Invalid IP, port or hostname!</p>');
        }
    }
}

function retrieveInfo (id, ip) {
    $.get('https://www.mineyc.com/tools/ping.php?ip=' + ip, function(data) {
        if (data.max !== null) {
            $("#o" + id).html(data.online + '/' + data.max);
            if (data.online === 0) {
                $('#ps' + id).html('<p>Nobody :(</p>');
            }
            if (data.sample !== null) {
                for (var i = 0; i < data.sample.length; i++) {
                    $('#ps' + id).append('<p><img src="https://cravatar.eu/helmavatar/' + data.sample[i].name + '/24.png" alt="' + data.sample[i].name + '"> ' + data.sample[i].name + '</p>');
                }
            }
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
        if ($(this).attr('id').indexOf('s') !== -1) {
            toggleServer(this); return false;
        }
    });
});
