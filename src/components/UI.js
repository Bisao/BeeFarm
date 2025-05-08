
export class UI {
    static createSettingsModal() {
        return `
            <div class="modal-overlay" id="configModal">
                <div class="settings-modal">
                    <h2>Game Settings</h2>
                    <div class="settings-content">
                        <div class="setting-item">
                            <label>Grid Size:</label>
                            <input type="range" id="gridSizeRange" min="30" max="70" value="50">
                            <span id="gridSizeValue">50</span>
                        </div>
                        <div class="setting-item">
                            <label>Camera Speed:</label>
                            <input type="range" id="cameraSpeedRange" min="1" max="10" value="5">
                            <span id="cameraSpeedValue">5</span>
                        </div>
                        <div class="setting-item">
                            <label>Show Grid Lines:</label>
                            <input type="checkbox" id="showGridLines" checked>
                        </div>
                    </div>
                    <button class="button" id="configCloseBtn">Close</button>
                </div>
            </div>`;
    }

    static createTopBar() {
        return `
            <div class="top-bar">
                <button class="settings-button" id="configBtn">⚙️ Settings</button>
            </div>`;
    }
}
