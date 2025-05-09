
export class BaseComponent {
    static createElement(tag, className = '', attributes = {}) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
        return element;
    }

    static createButton(text, className = '', onClick = null) {
        const button = this.createElement('button', `button ${className}`.trim());
        button.textContent = text;
        if (onClick) button.addEventListener('click', onClick);
        return button;
    }
}
