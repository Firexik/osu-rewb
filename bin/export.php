<?php declare(strict_types=1);

// Render the Nette homepage so the static preview shares the same templates.
$root = dirname(__DIR__);
$output = $root . '/dist/automisto';
foreach ([$output, $root . '/temp'] as $directory) {
    if (!is_dir($directory)) { mkdir($directory, 0770, true); }
}
$port = 8047;
$log = fopen($root . '/temp/export-server.log', 'w');
$process = proc_open([PHP_BINARY, '-S', "127.0.0.1:$port", '-t', $root . '/www', $root . '/www/router.php'], [['pipe', 'r'], $log, $log], $pipes, $root);
if (!is_resource($process)) {
    throw new RuntimeException('Cannot start the PHP export server.');
}
fclose($pipes[0]);
try {
    for ($attempt = 0; $attempt < 50; $attempt++) {
        if (!proc_get_status($process)['running']) {
            throw new RuntimeException('Export server stopped. Check that port 8047 is free.');
        }
        $connection = @fsockopen('127.0.0.1', $port);
        if ($connection) { fclose($connection); break; }
        usleep(100000);
    }
    $html = file_get_contents("http://127.0.0.1:$port/");
    if (!$html || !str_contains($html, '<html lang="cs"')) {
        throw new RuntimeException('Failed to render the homepage.');
    }
    file_put_contents($output . '/index.html', $html);
    echo "Exported $output/index.html\n";
    $copy = function (string $from, string $to) use (&$copy): void {
        if (!is_dir($to)) { mkdir($to, 0770, true); }
        foreach (new DirectoryIterator($from) as $file) {
            if ($file->isDot()) { continue; }
            $file->isDir() ? $copy($file->getPathname(), $to . '/' . $file->getFilename())
                : copy($file->getPathname(), $to . '/' . $file->getFilename());
        }
    };
    $copy($root . '/www/assets', $output . '/assets');
    file_put_contents($output . '/.nojekyll', '');
} finally {
    proc_terminate($process);
    proc_close($process);
    fclose($log);
}
