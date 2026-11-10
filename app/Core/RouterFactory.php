<?php declare(strict_types=1);

namespace App\Core;

use Nette\Application\Routers\RouteList;

final class RouterFactory
{
    public static function createRouter(): RouteList
    {
        $router = new RouteList;
        $router->addRoute('index.html', 'Page:home');
        $router->addRoute('<action games|reviews|genres|planner|about>.html', 'Page:home');
        $router->addRoute('', 'Page:home');
        return $router;
    }
}
