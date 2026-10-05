export default class ElementBuilder {
    static createElement(tagName, attributes = {}, ...children) {
        const element = document.createElement(tagName);
        const { class: inlineClass, ...restProps } = attributes;

        Object.assign(element, restProps);

        if (inlineClass) {
            element.className = inlineClass;
        }

        Object.entries(restProps)
            .filter(([key]) => key.startsWith('aria-'))
            .forEach(([key, value]) => element.setAttribute(key, value));

        element.append(...children);
        return element;
    }
}