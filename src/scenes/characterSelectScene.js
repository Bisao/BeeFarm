
import { Scene } from '../core/baseScene.js';

export export class CharacterSelectScene extends Scene {
    constructor() {
        super();
        this.container = document.getElementById('game-container');
        this.selectedCharacter = null;
    }

    enter() {
        this.container.innerHTML = `
            <div class="character-select-scene">
                <h1>Choose Your Character</h1>
                <div class="character-grid">
                    <div class="character-card" data-type="farmer">
                        <img src="src/assets/images/structures/🌱 FarmerHouseLeft.PNG" alt="Farmer">
                        <h3>Farmer</h3>
                    </div>
                    <div class="character-card" data-type="lumberjack">
                        <img src="src/assets/images/structures/🪓 LumberJackHouseLeft.PNG" alt="Lumberjack">
                        <h3>Lumberjack</h3>
                    </div>
                    <div class="character-card" data-type="miner">
                        <img src="src/assets/images/structures/⛏️ MinerHouseLeft.PNG" alt="Miner">
                        <h3>Miner</h3>
                    </div>
                    <div class="character-card" data-type="fisherman">
                        <img src="src/assets/images/structures/🎣 FisherManHouseLeft.PNG" alt="Fisherman">
                        <h3>Fisherman</h3>
                    </div>
                </div>
            </div>
        `;

        const cards = document.querySelectorAll('.character-card');
        cards.forEach(card => {
            card.addEventListener('click', () => this.selectCharacter(card.dataset.type));
        });
    }

    async selectCharacter(type) {
        this.selectedCharacter = type;
        
        this.container.innerHTML = `
            <div class="loading-screen">
                <h2>Loading Game...</h2>
                <div class="progress-bar"></div>
                <p class="loading-tip">Preparing your adventure...</p>
            </div>
        `;

        await new Promise(resolve => setTimeout(resolve, 2000));
        this.manager.changeScene('game', { characterType: type });
    }

    exit() {
        this.container.innerHTML = '';
    }
}
