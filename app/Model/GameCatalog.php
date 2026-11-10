<?php declare(strict_types=1);

namespace App\Model;

final class GameCatalog
{
    public function getAll(): array
    {
        return json_decode(file_get_contents(__DIR__ . '/../../data/games.json'), true, 512, JSON_THROW_ON_ERROR);
    }

    public function getFeatured(): array
    {
        return array_values(array_filter($this->getAll(), fn(array $game): bool => isset($game['image'])));
    }
}
