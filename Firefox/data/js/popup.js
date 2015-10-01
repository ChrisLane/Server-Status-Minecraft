$('a').click(function(){
    if ($(this).attr('id') === "options") {
        self.port.emit("options", "true");
    }
});

self.port.on("servers", function(labels) {
    for (var i = 0; i < labels.length; i++) {
        $('#status')
            .append($('<a>', { href: '#', class: 'list-group-item active' }).attr('id', 's' + i)
                .append($('<span>', { class: 'badge' }).attr('id', 'o' + i))
                .text(labels[i]))
            .append($('<li>', { class: 'list-group-item' }).attr('id', 'ps' + i));
        
        if (i > 0) {
            $('#ps' + i).hide();
        }
    }
    
    $('a').click(function(){
        if ($(this).attr('id').indexOf('s') !== -1) {
            var id = '#p' + $(this).attr('id');
            $(id).toggle();
            return false;
        }
    });
});

self.port.on("serverData", function(data) {
    var id = data[0];
    var online = data[1];
    
    if (online === -1) {
        $('#s' + id).append($('<span>', { class: 'badge' }).text('ERROR'));
        $('#ps' + id).append($('<p>').text('Invalid IP, port or hostname!'));
    } else if (online === -2) {
        $('#s' + id).append($('<span>', { class: 'badge' }).text('ERROR'));
        $('#ps' + id).append($('<p>').text('Failed to retrieve data!'));
    } else if (online === -3) {
        $('#s' + id).append($('<span>', { class: 'badge' }).text('ERROR'));
        $('#ps' + id).append($('<p>').text('This extension does not work on local servers!'));
    } else {
        var max = data[2];
        var players = data[3];
        
        $("#s" + id).append($('<span>', { class: 'badge' }).text(online + '/' + max));
        
        if (online === 0) {
            $('#ps' + id).append($('<p>').text('Nobody :('));
        } else if (players !== null) {
            for (var i = 0; i < players.length; i++) {
                $('#ps' + id).append($('<p>').text(' ' + players[i].name).prepend($('<img>').attr('src', 'http://cravatar.eu/helmavatar/' + players[i].name + '/24.png').attr('alt', players[i].name))); 
            }
        } else {
            $('#ps' + id).append($('<p>').text('Cannot load individual players for this server.'));
        }
    }
});