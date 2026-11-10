<?php declare(strict_types=1);

namespace App\Presentation\Page;

use App\Model\GameCatalog;
use Nette\Application\UI\Form;
use Nette\Application\UI\Presenter;

final class PagePresenter extends Presenter
{
    public function __construct(private GameCatalog $catalog)
    {
        parent::__construct();
    }

    protected function beforeRender(): void
    {
        parent::beforeRender();
        $this->getTemplate()->getLatte()->setAutoRefresh(true);
        $this->template->pages = [
            'home' => ['Home', 'house'], 'games' => ['Games', 'controller'],
            'reviews' => ['Reviews', 'chat-square-text'], 'genres' => ['Genres', 'grid'],
            'planner' => ['Play Planner', 'calendar-check'], 'about' => ['About', 'info-circle'],
        ];
        $this->template->pageTitle = $this->template->pages[$this->getAction()][0];
        $this->template->games = $this->catalog->getAll();
        $this->template->featured = $this->catalog->getFeatured();
        $this->template->staticPreview = getenv('APP_EXPORT') === '1';
    }

    public function renderPlanner(): void
    {
        $this->template->plan = getenv('APP_EXPORT') === '1' ? null : $this->getSession('planner')->plan;
    }

    protected function createComponentPlannerForm(): Form
    {
        $form = new Form;
        if (getenv('APP_EXPORT') !== '1') {
            $form->addProtection('Your session has expired. Reload the page and try again.');
        }
        $form->addText('planName', 'Plan name')->setRequired('Enter a plan name.')->addRule(Form::MaxLength, 'Use at most 80 characters.', 80);
        $form->addSelect('game', 'Game', array_column($this->catalog->getAll(), 'title', 'id'))->setPrompt('Choose a game')->setRequired('Choose a game.');
        $form->addText('nickname', 'Nickname (optional)')->addRule(Form::MaxLength, 'Use at most 40 characters.', 40);
        $form->addSelect('platform', 'Platform', ['PC' => 'PC', 'PlayStation' => 'PlayStation', 'Xbox' => 'Xbox', 'Switch' => 'Nintendo Switch'])->setRequired();
        $form->addText('startDate', 'Start date')->setHtmlType('date')->setRequired('Choose a start date.')
            ->addRule(static fn($input): bool => preg_match('/^\d{4}-\d{2}-\d{2}$/', $input->value) === 1
                && (bool) \DateTimeImmutable::createFromFormat('!Y-m-d', $input->value)
                && \DateTimeImmutable::createFromFormat('!Y-m-d', $input->value)->format('Y-m-d') === $input->value, 'Choose a valid date.');
        $form->addInteger('sessions', 'Sessions per week')->setDefaultValue(3)->setRequired()->addRule(Form::Range, 'Choose 1 to 7 sessions.', [1, 7]);
        $form->addInteger('minutes', 'Session length')->setDefaultValue(60)->setRequired()->addRule(Form::Range, 'Choose 15 to 240 minutes.', [15, 240]);
        $form->addRadioList('mode', 'Play style', ['solo' => 'Solo', 'friends' => 'With friends'])->setDefaultValue('solo')->setRequired();
        $form->addSelect('pace', 'Pace', ['Relaxed' => 'Relaxed', 'Balanced' => 'Balanced', 'Challenging' => 'Challenging'])->setDefaultValue('Balanced');
        $form->addText('goal', 'Session goal')->setRequired('Enter a small goal.')->addRule(Form::MaxLength, 'Use at most 120 characters.', 120);
        $form->addTextArea('notes', 'Notes (optional)')->addRule(Form::MaxLength, 'Use at most 2000 characters.', 2000);
        $form->addCheckbox('breaks', 'Include a break between sessions')->setDefaultValue(true);
        $form->addCheckbox('confirm', 'I understand that this plan is saved for this browser only.')->setRequired('Confirm where your plan is saved.');
        $form->addSubmit('save', 'Save');

        if (getenv('APP_EXPORT') !== '1' && $this->getSession('planner')->plan) {
            $form->setDefaults($this->getSession('planner')->plan);
        }
        $form->onSuccess[] = function (Form $form, \stdClass $values): void {
            $this->getSession('planner')->plan = (array) $values;
            $this->flashMessage('Your plan has been saved for this browser session.', 'success');
            $this->redirect('planner');
        };
        return $form;
    }
}
