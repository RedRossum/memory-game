import ElementBuilder from "./ElementBuilder.js";

export default class Modal {
    #title;
    #contentElement;
    #onCloseCallback;
    #overlayElement;

    constructor(title, contentElement, onCloseCallback = null) {
        this.#title = title;
        this.#contentElement = contentElement;
        this.#onCloseCallback = onCloseCallback;
        this.#overlayElement = null;
    }

    open() {
        document.body.classList.add('modal-open');

        const closeBtn = ElementBuilder.createElement('button', { class: 'modal-close-btn', 'aria-label': 'Закрыть модальное окно' }, '×');
        const modalHeader = ElementBuilder.createElement('div', { class: 'modal-header' },
            ElementBuilder.createElement('h2', {}, this.#title),
            closeBtn
        );

        const modalBody = ElementBuilder.createElement('div', { class: 'modal-body' }, this.#contentElement);
        const modalContent = ElementBuilder.createElement('div', { class: 'modal-content' }, modalHeader, modalBody);

        this.#overlayElement = ElementBuilder.createElement('div', { class: 'modal-overlay' }, modalContent);

        closeBtn.addEventListener('click', () => this.close());
        this.#overlayElement.addEventListener('click', (e) => {
            if (e.target === this.#overlayElement) this.close();
        });

        window.addEventListener('keydown', this.#handleEscape);

        modalContent.addEventListener('click', (e) => e.stopPropagation());

        document.body.appendChild(this.#overlayElement);
    }

    close() {
        if (!this.#overlayElement) return;

        this.#overlayElement.remove();
        this.#overlayElement = null;

        document.body.classList.remove('modal-open');

        window.removeEventListener('keydown', this.#handleEscape);

        if (this.#onCloseCallback) {
            this.#onCloseCallback();
        }
    }

    #handleEscape = (e) => {
        if (e.key === 'Escape') {
            this.close();
        }
    };
}
