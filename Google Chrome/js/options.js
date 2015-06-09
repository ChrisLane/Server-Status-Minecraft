var servers;
var ip = new Array();
var label = new Array();

function createPage () {
    $('tbody').html("");
    for (var i = 0; i < servers; i++) {
        $('tbody').append('<tr>'
            + '<td class="action"><a href="#" type="button" id="remove' + i + '" class="btn btn-primary">&#10006;</button></td>'
            + '<td><input type="text" class="form-control" id="name' + i + '" value="' + label[i] + '" placeholder="My Server"></td>'
            + '<td><input type="text" class="form-control" id="ip' + i + '" value="' + ip[i] + '" placeholder="localhost:25565"></td>'
            + '</tr>');
    }
}

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
            ip[i] = 'localhost:25565';
        }
    }
}

function addServer() {
    servers++;
    
    $('tbody').append('<tr>'
        + '<td class="action"><a href="#" type="button" id="remove' + (servers-1) + '" class="btn btn-primary">&#10006;</button></td>'
        + '<td><input type="text" class="form-control" id="name' + (servers-1) + '" value="" placeholder="My Server"></td>'
        + '<td><input type="text" class="form-control" id="ip' + (servers-1) + '" value="" placeholder="localhost:25565"></td>'
        + '</tr>');
}

function removeServer(id) {
    var s = parseInt(id.replace("remove",""));
    var k = 0;
    
    for (var i = 0; i < servers; i++) {
        if (i === s) {
            label[i] = label[k + 1];
            ip[i] = ip[k + 1];
            k += 2;
        } else {
            label[i] = label[k];
            ip[i] = ip[k];
            k++;
        }
    }
    servers--;
    
    createPage();
}

function save() {
    localStorage['servers'] = servers;
    
    for(var i = 0; i < servers; i++) {
        localStorage['label' + i] = $('#name' + i).val();
        localStorage['ip' + i] = $('#ip' + i).val();
    }
    
    $('#saved').html('Succesfully saved!');
    setTimeout(function() {
        $('#saved').html('');
    }, 2000);
    chrome.extension.sendMessage({restart: true});
    
    loadSettings();
    createPage();
}

$(document).ready(function() {
    loadSettings();
    createPage();

    $(document).delegate('a', 'click', function(){
        var id = $(this).attr('id');

        if (id.indexOf('add') !== -1) {
            addServer();
            return false;
        } else if (id.indexOf('save') !== -1) {
            save();
            return false;
        } else if (id.indexOf('remove') !== -1) {
            removeServer(id);
            return false;
        }
    });
});