import ElementBuilder from "./ElementBuilder.js";

export default class Leaderboard {
    static #STORAGE_KEY = 'memory_game_leaderboard';

    #getResults() {
        const data = localStorage.getItem(Leaderboard.#STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    #saveResults(results) {
        localStorage.setItem(Leaderboard.#STORAGE_KEY, JSON.stringify(results));
    }

    save(movesCount) {
        const leaderboard = this.#getResults();

        const dateStr = new Intl.DateTimeFormat('ru-RU').format(new Date());

        const newResult = {
            id: window.crypto.randomUUID(),
            moves: movesCount,
            date: dateStr,
            timestamp: Date.now()
        };

        leaderboard.push(newResult);

        leaderboard.sort((a, b) => {
            if (a.moves !== b.moves) {
                return a.moves - b.moves;
            }
            return a.timestamp - b.timestamp;
        });

        this.#saveResults(leaderboard.slice(0, 10));
    }

    renderTableElement(onCloseClickCallback) {
        const leaderboard = this.#getResults();
        let container;

        if (leaderboard.length === 0) {
            container = ElementBuilder.createElement('p', { class: 'no-results' }, 'Пока нет результатов');
        } else {
            const tableHeader = ElementBuilder.createElement('tr', {},
                ElementBuilder.createElement('th', {}, 'Место'),
                ElementBuilder.createElement('th', {}, 'Ходы'),
                ElementBuilder.createElement('th', {}, 'Дата')
            );

            const tableRows = leaderboard.map((item, index) => {
                return ElementBuilder.createElement('tr', {},
                    ElementBuilder.createElement('td', {}, `${index + 1}`),
                    ElementBuilder.createElement('td', {}, `${item.moves}`),
                    ElementBuilder.createElement('td', {}, item.date)
                );
            });

            const table = ElementBuilder.createElement('table', { class: 'leaderboard-table' }, tableHeader, ...tableRows);
            container = ElementBuilder.createElement('div', {}, table);
        }

        const closeModalBtn = ElementBuilder.createElement('button', { class: 'btn btn-secondary btn-center' }, 'Закрыть');
        closeModalBtn.addEventListener('click', onCloseClickCallback);

        container.appendChild(ElementBuilder.createElement('div', { class: 'modal-actions' }, closeModalBtn));
        return container;
    }
}