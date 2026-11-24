<?php declare(strict_types=1);

namespace App\Presentation\Page;

use Nette\Application\UI\Presenter;

final class PagePresenter extends Presenter
{
    public function renderHome(): void
    {
        $this->getTemplate()->getLatte()->setAutoRefresh(true);
        $projects = require __DIR__ . '/../../../data/projects.php';
        $this->template->domesticProjects = $projects['domestic'];
        $this->template->coastalProjects = $projects['coastal'];
    }
}
