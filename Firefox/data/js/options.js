var servers;

$("#save").click(function() {
    save();
    return false;
});
$("#add").click(function() {
    addServer();
    return false;
});

self.port.on("getServers", function(data) {
    servers = data[0].length;
    
    for (var i = 0; i < data[0].length; i++) {
        $('tbody')
            .append($('<tr>')
                .append($('<td>')
                    .append($('<a>', { href: '#', type: 'button', class: 'btn btn-primary', text: 'X' })
                        .click(function() { $(this).parent().parent().remove(); return false; })))
                .append($('<td>').append($('<input>', { type: 'text', class: 'form-control name' }).val(data[0][i])))
                .append($('<td>').append($('<input>', { type: 'text', class: 'form-control ip' }).val(data[1][i]))));
    }
});

function addServer() {
    $('tbody')
        .append($('<tr>')
            .append($('<td>')
                .append($('<a>', { href: '#', type: 'button', class: 'btn btn-primary', text: 'X' })
                    .click(function() { $(this).parent().parent().remove(); return false; })))
            .append($('<td>').append($('<input>', { type: 'text', class: 'form-control name', value: 'My Server' })))
            .append($('<td>').append($('<input>', { type: 'text', class: 'form-control ip', value: 'SERVER_IP' }))));
    servers++;
}

function save() {
    var data = [[],[]];
    
    var i = 0;
    $(".name").each(function() {
        var name = $(this).val();
        data[0][i] = name;
        i++;
    });
    
    i = 0;
    $(".ip").each(function() {
        var ip = $(this).val();
        data[1][i] = ip;
        i++;
    });
    
    if (data[0].length === 0) {
        self.port.emit("saveServers", [["My Server"],["SERVER_IP"]]);
    } else {
        self.port.emit("saveServers", data);
    }
}