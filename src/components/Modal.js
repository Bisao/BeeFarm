
import { BaseComponent } from './BaseComponent.js';

export class Modal extends BaseComponent {
    static createModal(id, title, content, onClose) {
        const modal = this.createElement('div', 'modal-overlay', { id });
        const modalContent = this.createElement('div', 'modal-content');
        
        const titleElement = this.createElement('h2');
        titleElement.textContent = title;
        
        const body = this.createElement('div', 'modal-body');
        body.innerHTML = content;
        
        const closeButton = this.createButton('Close', '', () => {
            modal.classList.remove('visible');
            setTimeout(() => {
                modal.remove();
                if (onClose) onClose();
            }, 300);
        });
        closeButton.setAttribute('aria-label', `Close ${title}`);
        closeButton.id = `${id}CloseBtn`;

        modalContent.append(titleElement, body, closeButton);
        modal.appendChild(modalContent);
        
        return modal;
    }
}
