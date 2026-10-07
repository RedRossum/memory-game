import './main.scss'
import ElementBuilder from "./ElementBuilder.js";
import Leaderboard from './Leaderboard';
import Modal from './Modal';

class Game {
    #cardData = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8];
    #totalPairs = 8;

    //game state
    #firstCard = null;
    #secondCard = null;
    #isLockBoard = false;
    #movesCount = 0;
    #pairsFound = 0;
    #mismatchTimeoutId = null;
    // DOM
    #movesCounterText = null;
    #pairsCounterText = null;
    #gameGridContainer = null;

    #leaderboardService = new Leaderboard();

    #shuffle(array) {
        const arr = [...array];
        const cryptoArray = new Uint32Array(arr.length);
        window.crypto.getRandomValues(cryptoArray);

        for (let i = arr.length - 1; i > 0; i--) {
            const j = cryptoArray[i] % (i + 1);
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    #updateCounters() {
        this.#movesCounterText.textContent = `Ходов: ${this.#movesCount}`;
        this.#pairsCounterText.textContent = `Найдено пар: ${this.#pairsFound} из ${this.#totalPairs}`;
    }

    startNewGame = () => { //auto binds this
        if (this.#mismatchTimeoutId) { clearTimeout(this.#mismatchTimeoutId); }
        this.#movesCount = 0;
        this.#pairsFound = 0;
        this.#resetTurn();
        this.#updateCounters();
        this.#gameGridContainer.replaceChildren();

        const shuffledCards = this.#shuffle(this.#cardData);
        shuffledCards.forEach((value, index) => {
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

            this.#movesCount++;        // add counters
            this.#updateCounters();

            this.#checkMatch();
        });

        return cardElement;
    }

    #checkMatch() {
        const { cardValue: firstValue } = this.#firstCard.dataset;
        const { cardValue: secondValue } = this.#secondCard.dataset;

        if (firstValue === secondValue) {
            this.#pairsFound++;
            this.#updateCounters();
            this.#resetTurn();

            if (this.#pairsFound === this.#totalPairs) {
                setTimeout(() => this.#handleVictory(), 500);
            }
        } else {
            this.#isLockBoard = true;
            this.#mismatchTimeoutId = setTimeout(() => {
                this.#firstCard.classList.remove('flipped');
                this.#secondCard.classList.remove('flipped');
                this.#resetTurn();
                this.#mismatchTimeoutId = null;
            }, 1000);
        }
    }

    #handleVictory() {
        this.#leaderboardService.save(this.#movesCount);

        const newGameModalBtn = ElementBuilder.createElement('button', { class: 'btn btn-primary' }, 'Новая игра');
        const closeModalBtn = ElementBuilder.createElement('button', { class: 'btn btn-secondary' }, 'Закрыть');
        const actionContainer = ElementBuilder.createElement('div', { class: 'modal-actions' }, newGameModalBtn, closeModalBtn);

        const content = ElementBuilder.createElement('div', {},
            ElementBuilder.createElement('p', {}, `Вы нашли все пары за ${this.#movesCount} ходов!`),
            actionContainer
        );

        const victoryModal = new Modal('Победа!', content);

        newGameModalBtn.addEventListener('click', () => {
            victoryModal.close();
            this.startNewGame();
        });
        closeModalBtn.addEventListener('click', () => victoryModal.close());
        victoryModal.open();
    }

    #resetTurn() {
        this.#firstCard = null;
        this.#secondCard = null;
        this.#isLockBoard = false;
    }

    showLeaderboard = () => {
        let leaderboardModal;
        const content = this.#leaderboardService.renderTableElement(() => leaderboardModal.close());
        leaderboardModal = new Modal('Таблица лидеров', content);
        leaderboardModal.open();
    };

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

        leaderboardHeaderBtn.addEventListener('click', this.showLeaderboard);

        this.startNewGame();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    game.init();
});



