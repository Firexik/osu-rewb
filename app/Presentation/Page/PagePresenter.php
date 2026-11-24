<?php declare(strict_types=1);

namespace App\Presentation\Page;

use Nette\Application\UI\Presenter;

final class PagePresenter extends Presenter
{
    public function renderHome(): void
    {
        $this->getTemplate()->getLatte()->setAutoRefresh(true);
        $catalog = require __DIR__ . '/../../../data/cars.php';
        $this->template->bodyStyles = $catalog['bodyStyles'];
        $this->template->cars = $catalog['cars'];
    }
}
