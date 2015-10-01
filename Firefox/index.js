var {ToggleButton} = require('sdk/ui/button/toggle');
var {setTimeout, clearTimeout} = require("sdk/timers");
var {XMLHttpRequest} = require("sdk/net/xhr");
var uuid = require('sdk/util/uuid').uuid();
var self = require("sdk/self");
var ss = require("sdk/simple-storage");
var panels = require("sdk/panel");
var self = require("sdk/self");

var servers;
var timer;

var panel;

var IPRegex = new RegExp("^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$");
var HostnameRegex = new RegExp("^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$");

var button = ToggleButton({
    id: "open-popup",
    label: "Server Status Minecraft",
    icon: {
        "16": "./images/icon-16.png",
        "32": "./images/icon-32.png",
        "64": "./images/icon-64.png"
    },
    onChange: handleChange
});

function handleChange(state) {
    if (state.checked) {
        panel = panels.Panel({
            width: 300,
            height: 500,
            contentURL: "./popup.html",
            contentScriptFile: [
                "./js/jquery-1.11.3.min.js",
                "./js/popup.js"
            ],
            onHide: handleHide
        });
        
        panel.show({
            position: button
        });
        
        panel.port.emit("servers", ss.storage.label);
        
        panel.port.on("options", function(message) {
            var optionsPanel = panels.Panel({
                width: 500,
                height: 500,
                contentURL: "./options.html",
                contentScriptFile: [
                    "./js/jquery-1.11.3.min.js",
                    "./js/options.js"
                ]
            });
            
            optionsPanel.show();
            
            optionsPanel.port.emit("getServers", [ss.storage.label, ss.storage.ip]);
            
            optionsPanel.port.on("saveServers", function(servers) {
                delete ss.storage.label;
                delete ss.storage.ip;
                
                ss.storage.label = servers[0];
                ss.storage.ip = servers[1];
                
                loadExtension();
                optionsPanel.destroy();
            });
        });
        
        sendServerData();
    }
}

function handleHide() {
    button.state('window', {checked: false});
    panel.destroy();
}

function loadExtension() {
    if (typeof(ss.storage.ip) === 'undefined') {
        ss.storage.ip = ["SERVER_IP"];
        ss.storage.label = ["My Server"];
    }
    
    clearTimeout(timer);
    backgroundCheck();
    timer = setTimeout(function() { backgroundCheck(); }, 1000*300);
}

function backgroundCheck() {
    var split = ss.storage.ip[0].split(":");
    
    if ((IPRegex.test(split[0]) || HostnameRegex.test(split[0])) && split[0].indexOf("SERVER_IP") === -1 && split[0].indexOf("localhost") === -1 && split[0].indexOf("127.0.0.1") === -1 && ((!isNaN(split[1]) && split[1] >= 0 && split[1] <= 65535) || split.length === 1)) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                var data = JSON.parse(xmlhttp.responseText);
                if (data.online !== null) {
                    button.badge = data.online;
                    button.badgeColor = "#000000";
                    button.icon = { "16": "./images/up.png" };
                } else {
                    button.badge = 'OFF';
                    button.badgeColor = "#700000";
                    button.icon = { "16": "./images/down.png" };
                }
            }
        };
        xmlhttp.open("GET", 'http://mss.aron.li/ping.php?ip=' + ss.storage.ip[0], true);
        xmlhttp.send();
    } else {
        button.badge = 'OFF';
        button.badgeColor = "#700000";
        button.icon = { "16": "./images/down.png" };
    }
}

function sendServerData() {
    for (i = 0; i < ss.storage.ip.length; i++) {
        var split = ss.storage.ip[i].split(":");
        
        if ((IPRegex.test(split[0]) || HostnameRegex.test(split[0])) && split[0].indexOf("SERVER_IP") === -1 && split[0].indexOf("localhost") === -1 && split[0].indexOf("127.0.0.1") === -1 && ((!isNaN(split[1]) && split[1] >= 0 && split[1] <= 65535) || split.length === 1)) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                    var data = JSON.parse(xmlhttp.responseText);
                    if (data.max !== null) {
                        if (data.sample !== null) {
                            panel.port.emit("serverData", [i, data.online, data.max, data.sample]);
                        } else {
                            panel.port.emit("serverData", [i, data.online, data.max]);
                        }
                    } else {
                        panel.port.emit("serverData", [i, -2]);
                    }
                }
            };
            xmlhttp.open("GET", 'http://mss.aron.li/ping.php?ip=' + ss.storage.ip[i], false);
            xmlhttp.send();
        } else if (split[0].indexOf("localhost") !== -1 || split[0].indexOf("127.0.0.1") !== -1) {
            panel.port.emit("serverData", [i, -3]);
        } else {
            panel.port.emit("serverData", [i, -1]);
        }
    }
}

exports.main = function (options, callbacks) {
    loadExtension();
};