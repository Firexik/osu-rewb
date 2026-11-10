<?php declare(strict_types=1);

namespace App;

use Nette\Bootstrap\Configurator;
use Nette\DI\Container;

final class Bootstrap
{
    public static function boot(): Container
    {
        $root = dirname(__DIR__);
        foreach (['temp', 'temp/sessions', 'log'] as $directory) {
            if (!is_dir($root . '/' . $directory)) {
                mkdir($root . '/' . $directory, 0770, true);
            }
        }

        $configurator = new Configurator;
        $configurator->setDebugMode(false);
        $configurator->enableTracy($root . '/log');
        $configurator->setTempDirectory($root . '/temp');
        $configurator->addConfig($root . '/config/common.neon');
        return $configurator->createContainer();
    }
}
