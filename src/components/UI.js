
import { BaseComponent } from './BaseComponent.js';

export class UI extends BaseComponent {
    static createSettingsModal() {
        const content = `
            <div class="settings-content">
                <div class="setting-item">
                    <label for="gridSizeRange">Grid Size:</label>
                    <input 
                        type="range" 
                        id="gridSizeRange" 
                        min="30" 
                        max="70" 
                        value="50"
                        aria-label="Adjust grid size"
                        aria-valuemin="30"
                        aria-valuemax="70"
                        aria-valuenow="50">
                    <span id="gridSizeValue" role="status" aria-live="polite">50</span>
                </div>
                <div class="setting-item">
                    <label for="cameraSpeedRange">Camera Speed:</label>
                    <input 
                        type="range" 
                        id="cameraSpeedRange" 
                        min="1" 
                        max="10" 
                        value="5"
                        aria-label="Adjust camera speed">
                    <span id="cameraSpeedValue">5</span>
                </div>
                <div class="setting-item">
                    <label for="showGridLines">Show Grid Lines:</label>
                    <input type="checkbox" id="showGridLines" checked>
                </div>
            </div>`;

        return Modal.createModal('configModal', 'Game Settings', content);
    }

    static createTopBar() {
        const topBar = this.createElement('div', 'top-bar');
        const settingsBtn = this.createButton('⚙️ Settings', 'settings-button');
        settingsBtn.id = 'configBtn';
        
        topBar.appendChild(settingsBtn);
        return topBar;
    }
}
