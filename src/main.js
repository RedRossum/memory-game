import './main.scss'
import ElementBuilder from "./ElementBuilder.js";

class Game {
    #cardData = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8];

    //game state
    #firstCard = null;
    #secondCard = null;
    #isLockBoard = false;
    // DOM
    #movesCounterText = null;
    #pairsCounterText = null;
    #gameGridContainer = null;

    startNewGame = () => { //auto binds this
        this.#gameGridContainer.replaceChildren();

        this.#cardData.forEach((value, index) => {
            const cardElement = this.#createCardElement(value, index);
            this.#gameGridContainer.appendChild(cardElement);
        });
    };

    #createCardElement(value, index) {
        const cardInner = ElementBuilder.createElement('div', { class: 'card-inner' },
            ElementBuilder.createElement('div', { class: 'card-front' }),
            ElementBuilder.createElement('div', { class: 'card-back' }, value)
        );

        const cardElement = ElementBuilder.createElement('div', { class: 'game-card', 'aria-label': `Карточка ${index + 1}` }, cardInner);
        cardElement.dataset.cardValue = value;

        cardElement.addEventListener('click', () => {
            if (this.#isLockBoard || cardElement.classList.contains('flipped') || cardElement === this.#firstCard) {
                return;
            }

            cardElement.classList.add('flipped');

            if (!this.#firstCard) {
                this.#firstCard = cardElement;
                return;
            }

            this.#secondCard = cardElement;
            this.#checkMatch();
        });

        return cardElement;
    }

    #checkMatch() {
        const { cardValue: firstValue } = this.#firstCard.dataset;
        const { cardValue: secondValue } = this.#secondCard.dataset;

        if (firstValue === secondValue) {
            this.#resetTurn();
        } {
            this.#isLockBoard = true;
            setTimeout(() => {
                this.#firstCard.classList.remove('flipped');
                this.#secondCard.classList.remove('flipped');
                this.#resetTurn();
            }, 1000);
        }
    }

    #resetTurn() {
        this.#firstCard = null;
        this.#secondCard = null;
        this.#isLockBoard = false;
    }

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

        newGameHeaderBtn.addEventListener('click', this.startNewGame);

        this.startNewGame();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    game.init();
});



