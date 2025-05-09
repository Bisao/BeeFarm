import { Scene } from '../core/baseScene.js';

export class CharacterSelectScene extends Scene {
    constructor() {
        super();
        this.container = document.getElementById('game-container');
        this.selectedCharacter = null;
        this.handleResize = this.handleResize.bind(this);
    }

    enter() {
        window.addEventListener('resize', this.handleResize);
        this.render();
    }

    handleResize() {
        this.render();
    }

    render() {
        const isMobile = window.innerWidth <= 768;
        const gridColumns = isMobile ? '1fr' : 'repeat(2, 1fr)';
        const padding = isMobile ? '1rem' : '2rem';
        const imageSize = isMobile ? '150px' : '200px';

        this.container.innerHTML = `
            <div class="character-select-scene" style="padding: ${padding};">
                <h1 style="font-size: ${isMobile ? '1.5rem' : '2rem'};">Choose Your Character</h1>
                <div class="character-grid" style="grid-template-columns: ${gridColumns}; gap: 1rem;">
                    <div class="character-card" data-type="farmer">
                        <img src="src/assets/images/structures/🌱 FarmerHouseLeft.PNG" alt="Farmer" style="max-width: ${imageSize};">
                        <h3>Farmer</h3>
                    </div>
                    <div class="character-card" data-type="lumberjack">
                        <img src="src/assets/images/structures/🪓 LumberJackHouseLeft.PNG" alt="Lumberjack" style="max-width: ${imageSize};">
                        <h3>Lumberjack</h3>
                    </div>
                    <div class="character-card" data-type="miner">
                        <img src="src/assets/images/structures/⛏️ MinerHouseLeft.PNG" alt="Miner" style="max-width: ${imageSize};">
                        <h3>Miner</h3>
                    </div>
                    <div class="character-card" data-type="fisherman">
                        <img src="src/assets/images/structures/🎣 FisherManHouseLeft.PNG" alt="Fisherman" style="max-width: ${imageSize};">
                        <h3>Fisherman</h3>
                    </div>
                </div>
            </div>`;

        const cards = this.container.querySelectorAll('.character-card');
        cards.forEach(card => {
            card.addEventListener('click', async () => {
                try {
                    if (this.manager && this.manager.gameState) {
                        this.manager.gameState.characterType = card.dataset.type;
                        this.container.innerHTML = `
                            <div class="loading-screen">
                                <h2>Loading ${card.dataset.type}...</h2>
                                <div class="progress-bar"></div>
                            </div>`;

                        await new Promise(resolve => setTimeout(resolve, 2000));
                        this.manager.changeScene('game');
                    } else {
                        throw new Error('Game manager not properly initialized');
                    }
                } catch (error) {
                    console.error('Failed to load character:', error);
                    this.container.innerHTML = `
                        <div class="error-screen">
                            <h2>Failed to load character</h2>
                            <p>${error.message}</p>
                            <button class="button" onclick="location.reload()">Retry</button>
                        </div>`;
                }
            });
        });
    }

    exit() {
        window.removeEventListener('resize', this.handleResize);
        this.container.innerHTML = '';
    }
}