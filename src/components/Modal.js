
export class Modal {
    static createModal(id, title, content, onClose) {
        return `
            <div class="modal-overlay" id="${id}">
                <div class="modal-content">
                    <h2>${title}</h2>
                    <div class="modal-body">${content}</div>
                    <button class="button" id="${id}CloseBtn" aria-label="Close ${title}">Close</button>
                </div>
            </div>`;
    }
}
