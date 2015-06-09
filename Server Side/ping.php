<?php
header('Content-type: application/json');
header('Access-Control-Allow-Origin: *');

require_once('MinecraftPing.php');

$error = false;
if (filter_input(INPUT_GET, "ip") != null) {
    $split = explode(':', filter_input(INPUT_GET, "ip", FILTER_SANITIZE_STRING));
    
    $ip = $split[0];
    if (count($split) == 2) {
        $port = $split[1];
    } else {
        $port = "25565";
    }
    
    $IPRegex = "/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/";
    $HostnameRegex = "/^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/";
    
    if ((preg_match($IPRegex, $ip) || preg_match($HostnameRegex, $ip)) && $ip != "localhost" && $ip != "127.0.0.1" && is_numeric($port) && $port <= 65535 && $port > 0) {
        try {
            $query = new MinecraftPing($ip, $port, 2);
            $data = $query->Query();
            
            die(json_encode($data['players']));
        } catch(MinecraftPingException $e) {
            die('{"error":"Failed to connect or create socket"}');
        }
    } else {
        die('{"error":"Invalid IP or Port"}');
    }
} else {
    die('{"error":"Invalid input"}');
}