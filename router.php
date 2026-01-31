<?php
// Router pro PHP built-in server s podporou Range requests pro video

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Pokud je to video soubor, obsloužit s podporou Range requests
if (preg_match('/\.(mp4|webm|ogg)$/i', $uri)) {
    $filepath = __DIR__ . $uri;
    
    if (!file_exists($filepath)) {
        http_response_code(404);
        exit;
    }
    
    $filesize = filesize($filepath);
    $offset = 0;
    $length = $filesize;
    
    // Podpora Range requests
    if (isset($_SERVER['HTTP_RANGE'])) {
        preg_match('/bytes=(\d+)-(\d*)/', $_SERVER['HTTP_RANGE'], $matches);
        $offset = intval($matches[1]);
        $end = $matches[2] ? intval($matches[2]) : $filesize - 1;
        $length = $end - $offset + 1;
        
        header('HTTP/1.1 206 Partial Content');
        header("Content-Range: bytes $offset-$end/$filesize");
    }
    
    header("Content-Length: $length");
    header('Accept-Ranges: bytes');
    header('Content-Type: ' . mime_content_type($filepath));
    
    $fp = fopen($filepath, 'rb');
    fseek($fp, $offset);
    echo fread($fp, $length);
    fclose($fp);
    exit;
}

// Pro ostatní soubory použít standardní chování
if (file_exists(__DIR__ . $uri) && !is_dir(__DIR__ . $uri)) {
    return false; // Serve the file as-is
}

// Jinak přesměrovat na index.html
require_once __DIR__ . '/index.html';

