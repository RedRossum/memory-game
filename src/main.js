import './main.scss'
import ElementBuilder from "./ElementBuilder.js";

class Game {
    // DOM
    #movesCounterText = null;
    #pairsCounterText = null;
    #gameGridContainer = null;

    init() {
        const newGameHeaderBtn = ElementBuilder.createElement('button', { class: 'btn btn-primary' }, 'Новая игра');
        const leaderboardHeaderBtn = ElementBuilder.createElement('button', { class: 'btn btn-secondary' }, 'Таблица лидеров');

        const header = ElementBuilder.createElement('header', { class: 'game-header' }, newGameHeaderBtn, leaderboardHeaderBtn);

        this.#movesCounterText = ElementBuilder.createElement('div', { class: 'counter-item' });
        this.#pairsCounterText = ElementBuilder.createElement('div', { class: 'counter-item' });
        const scoreboard = ElementBuilder.createElement('div', { class: 'game-scoreboard' }, this.#movesCounterText, this.#pairsCounterText);

        this.#gameGridContainer = ElementBuilder.createElement('div', { class: 'game-grid' });

        const appContainer = ElementBuilder.createElement('main', { class: 'app-container' }, header, scoreboard, this.#gameGridContainer);
        document.body.appendChild(appContainer);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    game.init();
});



