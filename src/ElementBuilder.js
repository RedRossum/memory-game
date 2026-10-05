export default class ElementBuilder {
    static createElement(tagName, attributes = {}, ...children) {
        const element = document.createElement(tagName);

        Object.assign(element, attributes);

        Object.entries(attributes)
            .filter(([key]) => key.startsWith('aria-'))
            .forEach(([key, value]) => element.setAttribute(key, value));

        element.append(...children);
        return element;
    }
}