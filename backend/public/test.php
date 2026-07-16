<?php
echo json_encode([
    'php' => PHP_VERSION,
    'status' => 'PHP is running',
    'extensions' => ['pdo' => extension_loaded('pdo'), 'pdo_pgsql' => extension_loaded('pdo_pgsql')],
    'env' => ['PORT' => getenv('PORT'), 'APP_ENV' => getenv('APP_ENV')]
]);
