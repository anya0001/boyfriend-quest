// Game logic
const Game = {
    canvas: null,
    ctx: null,
    player: {
        x: 100,
        y: 100,
        width: 16,
        height: 16,
        speed: 2,
        direction: 'down', // down, up, left, right
        moving: false,
        frame: 0,
        frameDelay: 0,
        maxFrameDelay: 5
    },
    hearts: [], // Collectible hearts
    obstacles: [], // Trees, rocks, etc.
    heartsCollected: 0,
    totalHearts: 8,
    playerPosition: { x: 100, y: 100 },
    introCompleted: false,
    finalRewardUnlocked: false,
    finalRewardAvailable: false, // Whether the final reward can be accessed
    map: {
        width: 800,
        height: 500
    },
    keysPressed: {},
    showQuiz: false,
    flowerSelectionActive: false,
    currentQuestionIndex: 0,
    quizScore: 0,
    selectedFlower: null,

    init: function() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.loadAssets();
        this.setupEventListeners();
        this.loadGameState();
        this.startGameLoop();
    },

    loadAssets: function() {
        // Create the map obstacles (trees, rocks, etc.)
        this.createMap();

        // Create the hearts
        this.createHearts();
    },

    createMap: function() {
        // Create some obstacles (trees) as rectangles
        // We'll create a simple map with some trees and rocks
        const treeSize = 32;
        const rockSize = 20;

        // Add some trees
        for (let i = 0; i < 15; i++) {
            this.obstacles.push({
                x: Math.random() * (this.map.width - treeSize),
                y: Math.random() * (this.map.height - treeSize),
                width: treeSize,
                height: treeSize,
                type: 'tree'
            });
        }

        // Add some rocks
        for (let i = 0; i < 10; i++) {
            this.obstacles.push({
                x: Math.random() * (this.map.width - rockSize),
                y: Math.random() * (this.map.height - rockSize),
                width: rockSize,
                height: rockSize,
                type: 'rock'
            });
        }

        // Add boundaries as obstacles (so player can't leave the map)
        // Top boundary
        this.obstacles.push({ x: 0, y: 0, width: this.map.width, height: 10 });
        // Left boundary
        this.obstacles.push({ x: 0, y: 0, width: 10, height: this.map.height });
        // Right boundary
        this.obstacles.push({ x: this.map.width - 10, y: 0, width: 10, height: this.map.height });
        // Bottom boundary
        this.obstacles.push({ x: 0, y: this.map.height - 10, width: this.map.width, height: 10 });

        // Add a special location for the final reward (shrine/chest)
        // Place it in the center-top area
        this.finalRewardLocation = {
            x: this.map.width / 2 - 20,
            y: 50,
            width: 40,
            height: 40,
            type: 'shrine'
        };
        // Add it to obstacles so player can collide with it
        this.obstacles.push(this.finalRewardLocation);
    },

    createHearts: function() {
        // Define heart positions (fixed positions for now)
        const heartPositions = [
            { x: 100, y: 100 },
            { x: 200, y: 150 },
            { x: 300, y: 120 },
            { x: 400, y: 180 },
            { x: 150, y: 250 },
            { x: 350, y: 220 },
            { x: 250, y: 350 },
            { x: 450, y: 300 }
        ];

        this.hearts = heartPositions.map(pos => ({
            ...pos,
            width: 16,
            height: 16,
            collected: false,
            pulse: 0,
            maxPulse: 30
        }));
    },

    setupEventListeners: function() {
        // Keyboard controls
        window.addEventListener('keydown', (e) => {
            this.keysPressed[e.key.toLowerCase()] = true;
            // Prevent arrow keys from scrolling the page
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keysPressed[e.key.toLowerCase()] = false;
        });

        // Mobile controls
        document.getElementById('btn-up').addEventListener('touchstart', () => this.keysPressed['arrowup'] = true);
        document.getElementById('btn-up').addEventListener('touchend', () => this.keysPressed['arrowup'] = false);
        document.getElementById('btn-down').addEventListener('touchstart', () => this.keysPressed['arrowdown'] = true);
        document.getElementById('btn-down').addEventListener('touchend', () => this.keysPressed['arrowdown'] = false);
        document.getElementById('btn-left').addEventListener('touchstart', () => this.keysPressed['arrowleft'] = true);
        document.getElementById('btn-left').addEventListener('touchend', () => this.keysPressed['arrowleft'] = false);
        document.getElementById('btn-right').addEventListener('touchstart', () => this.keysPressed['arrowright'] = true);
        document.getElementById('btn-right').addEventListener('touchend', () => this.keysPressed['arrowright'] = false);

        // Also handle mouse clicks for mobile (optional)
        document.getElementById('btn-up').addEventListener('mousedown', () => this.keysPressed['arrowup'] = true);
        document.getElementById('btn-up').addEventListener('mouseup', () => this.keysPressed['arrowup'] = false);
        document.getElementById('btn-down').addEventListener('mousedown', () => this.keysPressed['arrowdown'] = true);
        document.getElementById('btn-down').addEventListener('mouseup', () => this.keysPressed['arrowdown'] = false);
        document.getElementById('btn-left').addEventListener('mousedown', () => this.keysPressed['arrowleft'] = true);
        document.getElementById('btn-left').addEventListener('mouseup', () => this.keysPressed['arrowleft'] = false);
        document.getElementById('btn-right').addEventListener('mousedown', () => this.keysPressed['arrowright'] = true);
        document.getElementById('btn-right').addEventListener('mouseup', () => this.keysPressed['arrowright'] = false);
    },

    loadGameState: function() {
        // Load from storage
        Storage.loadData();

        // Update player position from storage
        this.player.x = this.playerPosition.x;
        this.player.y = this.playerPosition.y;

        // Sync completed quests with QuestManager
        // Note: We don't directly set QuestManager.completedQuests here because
        // QuestManager loads from storage in its own way
        // But we need to make sure they're in sync
        // Actually, let's have QuestManager load from storage directly
        // For now, we'll update HUD based on what's in storage
        this.updateHUD();
    },

    saveGameState: function() {
        this.playerPosition = { x: this.player.x, y: this.player.y };
        Storage.saveData();
    },

    updateHUD: function() {
        document.getElementById('hearts-collected').textContent = this.heartsCollected;
        document.getElementById('hearts-total').textContent = `/ ${this.totalHearts}`;
        document.getElementById('quests-completed').textContent = QuestManager.completedQuests.length;
        document.getElementById('quests-total').textContent = `/ ${QuestManager.quests.length}`;
        const progressPercent = Math.floor((this.heartsCollected / this.totalHearts) * 100);
        document.getElementById('progress-percent').textContent = `${progressPercent}%`;
    },

    update: function() {
        // Handle player movement
        let dx = 0;
        let dy = 0;

        if (this.keysPressed['arrowup'] || this.keysPressed['w']) {
            dy -= this.player.speed;
            this.player.direction = 'up';
        }
        if (this.keysPressed['arrowdown'] || this.keysPressed['s']) {
            dy += this.player.speed;
            this.player.direction = 'down';
        }
        if (this.keysPressed['arrowleft'] || this.keysPressed['a']) {
            dx -= this.player.speed;
            this.player.direction = 'left';
        }
        if (this.keysPressed['arrowright'] || this.keysPressed['d']) {
            dx += this.player.speed;
            this.player.direction = 'right';
        }

        this.player.moving = (dx !== 0 || dy !== 0);

        // Calculate new position
        const newX = this.player.x + dx;
        const newY = this.player.y + dy;

        // Check collision with obstacles
        if (!this.checkCollision(newX, newY, this.player.width, this.player.height)) {
            this.player.x = newX;
            this.player.y = newY;
        }

        // Update animation frame
        if (this.player.moving) {
            this.player.frameDelay++;
            if (this.player.frameDelay >= this.player.maxFrameDelay) {
                this.player.frameDelay = 0;
                this.player.frame = (this.player.frame + 1) % 3; // 3 frames per direction
            }
        } else {
            this.player.frame = 0; // Reset to idle frame when not moving
        }

        // Check for heart collection
        this.checkHeartCollection();

        // Check for final reward access
        this.checkFinalRewardAccess();

    },

    checkCollision: function(x, y, width, height) {
        // The shrine is a destination, not a wall; the player must be able to reach it.
        for (const obstacle of this.obstacles) {
            if (obstacle.type === 'shrine') continue;

            if (
                x < obstacle.x + obstacle.width &&
                x + width > obstacle.x &&
                y < obstacle.y + obstacle.height &&
                y + height > obstacle.y
            ) {
                return true; // Collision
            }
        }
        return false; // No collision
    },

    checkHeartCollection: function() {
        for (const heart of this.hearts) {
            if (!heart.collected) {
                if (
                    this.player.x < heart.x + heart.width &&
                    this.player.x + this.player.width > heart.x &&
                    this.player.y < heart.y + heart.height &&
                    this.player.y + this.player.height > heart.y
                ) {
                    // Collect the heart
                    heart.collected = true;
                    this.heartsCollected++;
                    this.updateHUD();
                    this.saveGameState();

                    // Show heart collection message
                    const heartMessages = [
                        "One heart for your smile. It genuinely makes my day better.",
                        "One heart for making ordinary days feel special.",
                        "One heart for every time you make me laugh.",
                        "One heart because you're my favorite notification.",
                        "One heart for all the little memories we haven't made yet.",
                        "One heart for being exactly who you are.",
                        "One heart for all the hugs I owe you.",
                        "And one extra heart, because one is never enough."
                    ];
                    const messageIndex = this.heartsCollected - 1;
                    Dialogue.showMessage('Heart Collected!', heartMessages[messageIndex] || 'You found a heart!', {
                        hideSkip: true,
                        onOk: () => {
                            // Check if this completes quest 1
                            QuestManager.heartCollected();
                            // Check if all hearts collected to unlock final reward
                            if (this.heartsCollected >= this.totalHearts) {
                                this.unlockFinalReward();
                            }
                        }
                    });

                    // Create particle effect
                    this.createHeartParticles(heart.x, heart.y);
                }
            }
        }
    },

    createHeartParticles: function(x, y) {
        // Create a few floating particles for heart collection effect
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'particle heart-particle';
                particle.style.left = (x + Math.random() * 20 - 10) + 'px';
                particle.style.top = (y + Math.random() * 20 - 10) + 'px';
                document.body.appendChild(particle);

                // Remove particle after animation ends
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 1000);
            }, i * 100);
        }
    },

    unlockFinalReward: function() {
        if (!this.finalRewardUnlocked) {
            this.finalRewardUnlocked = true;
            // Show notification that final reward is available
            Dialogue.showMessage('All Hearts Collected!', 'You have collected all the hearts. The final reward is now available! Find the shrine in the forest.', {
                hideSkip: true,
                onOk: () => {
                    // The shrine is already on the map, player just needs to find it
                }
            });
            this.saveGameState();
        }
    },

    checkFinalRewardAccess: function() {
        // Check if player is near the final reward location and has completed all quests
        if (this.finalRewardUnlocked &&
            QuestManager.completedQuests.length >= QuestManager.quests.length &&
            this.player.x < this.finalRewardLocation.x + this.finalRewardLocation.width &&
            this.player.x + this.player.width > this.finalRewardLocation.x &&
            this.player.y < this.finalRewardLocation.y + this.finalRewardLocation.height &&
            this.player.y + this.player.height > this.finalRewardLocation.y) {

            // Player has reached the shrine with all quests complete
            this.showFinalReward();
        }
    },

    showFinalReward: function() {
        // Prevent multiple triggers
        if (this.finalRewardAvailable) return;

        this.finalRewardAvailable = true;

        // Show the love letter
        Dialogue.showModal('A Letter For You', `To my favorite person,

If you made it all the way here, congratulations. You have officially collected a tiny piece of my heart in every corner of this little world.

I made this because I wanted to give you something that was ours — something silly, sweet, and a little nerdy.

You make my days better just by being in them, and I am really happy I get to call you mine.

Your final reward is one real-life hug, one kiss, and unlimited bragging rights for beating my game.

Love
Your girl ♥`, {
            hideCancel: true,
            onOk: () => {
                // Allow player to close and reopen
                this.finalRewardAvailable = false;
            }
        });

        // Save that we've shown the final reward (though it remains unlocked)
        this.saveGameState();
    },

    // Quiz functionality
    startQuiz: function() {
        this.currentQuestionIndex = 0;
        this.quizScore = 0;
        this.showQuiz = true;
        this.updateQuizUI();
    },

    updateQuizUI: function() {
        if (this.currentQuestionIndex >= QuizData.questions.length) {
            // Quiz completed
            this.showQuiz = false;
            // Complete quest 2
            QuestManager.completeQuest(2);
            // Award bonus heart
            this.heartsCollected++;
            this.updateHUD();
            Dialogue.showMessage('Quiz Complete!', `You scored ${this.quizScore}/${QuizData.questions.length}! You've earned a bonus heart.`, {
                hideSkip: true,
                onOk: () => {
                    // Check if all hearts collected to unlock final reward
                    if (this.heartsCollected >= this.totalHearts) {
                        this.unlockFinalReward();
                    }
                }
            });
            return;
        }

        const question = QuizData.questions[this.currentQuestionIndex];
        const optionsHtml = question.options.map((option, index) =>
            `<button class="pixel-button" onclick="Game.answerQuizQuestion(${index})">${option}</button>`
        ).join('');

        Dialogue.showModal(
            `Question ${this.currentQuestionIndex + 1}/${QuizData.questions.length}`,
            `<p>${question.question}</p>${optionsHtml}`,
            {
                hideCancel: true
            }
        );
    },

    answerQuizQuestion: function(optionIndex) {
        const question = QuizData.questions[this.currentQuestionIndex];
        const isCorrect = optionIndex === question.correctAnswer;

        if (isCorrect) {
            this.quizScore++;
            Dialogue.showMessage('Correct!', question.feedback, {
                hideSkip: true,
                onOk: () => {
                    this.currentQuestionIndex++;
                    this.updateQuizUI();
                }
            });
        } else {
            Dialogue.showMessage('Try Again!', "That's not quite right. Try again!", {
                hideSkip: true,
                onOk: () => {
                    // Stay on same question
                }
            });
        }
    },

    // Flower selection functionality
    showFlowerSelection: function() {
        this.flowerSelectionActive = true;
        this.updateFlowerSelectionUI();
    },

    updateFlowerSelectionUI: function() {
        const optionsHtml = FlowerOptions.map(flower =>
            `<button class="pixel-button" style="background-color: ${flower.color}; color: #000;"
                onclick="Game.selectFlower(${flower.id})">
                ${flower.name}
            </button>`
        ).join('');

        Dialogue.showModal(
            'Choose a Flower',
            `<p>Select a flower to give to your girlfriend:</p>${optionsHtml}`,
            {
                hideCancel: true
            }
        );
    },

    selectFlower: function(flowerId) {
        const flower = FlowerOptions.find(f => f.id === flowerId);
        if (flower) {
            this.selectedFlower = flower;
            this.flowerSelectionActive = false;
            // Complete quest 3
            QuestManager.completeQuest(3);
            Dialogue.showMessage('Flower Selected!', flower.message, {
                hideSkip: true,
                onOk: () => {
                    // Check if all quests are complete for final reward
                    if (QuestManager.completedQuests.length >= QuestManager.quests.length &&
                        this.heartsCollected >= this.totalHearts) {
                        this.unlockFinalReward();
                    }
                }
            });
        }
    },

    render: function() {
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw background (simple color for now)
        this.ctx.fillStyle = '#21182C'; // Deep plum
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw obstacles (trees and rocks)
        for (const obstacle of this.obstacles) {
            if (obstacle.type === 'tree') {
                // Draw a simple tree
                this.ctx.fillStyle = '#8B4513'; // Brown trunk
                this.ctx.fillRect(obstacle.x + obstacle.width/3, obstacle.y + obstacle.height/2, obstacle.width/3, obstacle.height/2);
                this.ctx.fillStyle = '#228B22'; // Green leaves
                this.ctx.beginPath();
                this.ctx.arc(obstacle.x + obstacle.width/2, obstacle.y + obstacle.height/3, obstacle.width/2, 0, Math.PI * 2);
                this.ctx.fill();
            } else if (obstacle.type === 'rock') {
                // Draw a simple rock
                this.ctx.fillStyle = '#555555'; // Gray rock
                this.ctx.beginPath();
                this.ctx.arc(obstacle.x + obstacle.width/2, obstacle.y + obstacle.height/2, obstacle.width/2, 0, Math.PI * 2);
                this.ctx.fill();
            } else if (obstacle.type === 'shrine') {
                // Draw the shrine/chest for final reward
                this.ctx.fillStyle = '#8B0000'; // Dark red for chest
                this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
                // Chest lid
                this.ctx.fillStyle = '#FFD879'; // Gold
                this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height/3);
                // Chest details
                this.ctx.fillStyle = '#FF6EAA'; // Pink
                this.ctx.fillRect(obstacle.x + obstacle.width/2 - 1, obstacle.y + obstacle.height/3, 2, obstacle.height/3);
            } else {
                // Boundaries (just a dark color)
                this.ctx.fillStyle = '#000000';
                this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            }
        }

        // Draw hearts
        for (const heart of this.hearts) {
            if (!heart.collected) {
                // Draw a pulsing heart
                this.ctx.fillStyle = '#FF6EAA'; // Primary pink
                // Simple heart shape (two circles and a triangle)
                const size = heart.width;
                const x = heart.x;
                const y = heart.y;

                // Left circle
                this.ctx.beginPath();
                this.ctx.arc(x + size/4, y + size/3, size/3, 0, Math.PI * 2);
                this.ctx.fill();
                // Right circle
                this.ctx.beginPath();
                this.ctx.arc(x + size*3/4, y + size/3, size/3, 0, Math.PI * 2);
                this.ctx.fill();
                // Bottom triangle
                this.ctx.beginPath();
                this.ctx.moveTo(x, y + size/2);
                this.ctx.lineTo(x + size/2, y + size);
                this.ctx.lineTo(x + size, y + size/2);
                this.ctx.fill();

                // Pulse effect
                heart.pulse++;
                if (heart.pulse >= heart.maxPulse) heart.pulse = 0;
                // We could add a pulse visual effect here if desired
            }
        }

        // Draw player
        this.drawPlayer();
    },

    drawPlayer: function() {
        // Simple player representation
        this.ctx.fillStyle = '#FFD879'; // Gold color for player
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);

        // Draw a simple face based on direction
        this.ctx.fillStyle = '#000000';
        const eyeSize = 2;
        switch (this.player.direction) {
            case 'down':
                // Two eyes
                this.ctx.fillRect(this.player.x + 4, this.player.y + 6, eyeSize, eyeSize);
                this.ctx.fillRect(this.player.x + 10, this.player.y + 6, eyeSize, eyeSize);
                // Smile
                this.ctx.beginPath();
                this.ctx.arc(this.player.x + 8, this.player.y + 12, 3, 0, Math.PI);
                this.ctx.stroke();
                break;
            case 'up':
                this.ctx.fillRect(this.player.x + 4, this.player.y + 8, eyeSize, eyeSize);
                this.ctx.fillRect(this.player.x + 10, this.player.y + 8, eyeSize, eyeSize);
                this.ctx.beginPath();
                this.ctx.arc(this.player.x + 8, this.player.y + 4, 3, 0, Math.PI);
                this.ctx.stroke();
                break;
            case 'left':
                this.ctx.fillRect(this.player.x + 6, this.player.y + 4, eyeSize, eyeSize);
                this.ctx.fillRect(this.player.x + 6, this.player.y + 10, eyeSize, eyeSize);
                this.ctx.beginPath();
                this.ctx.arc(this.player.x + 10, this.player.y + 7, 3, Math.PI/2, 3*Math.PI/2);
                this.ctx.stroke();
                break;
            case 'right':
                this.ctx.fillRect(this.player.x + 8, this.player.y + 4, eyeSize, eyeSize);
                this.ctx.fillRect(this.player.x + 8, this.player.y + 10, eyeSize, eyeSize);
                this.ctx.beginPath();
                this.ctx.arc(this.player.x + 6, this.player.y + 7, 3, Math.PI/2, 3*Math.PI/2);
                this.ctx.stroke();
                break;
        }
    },

    startGameLoop: function() {
        const gameLoop = () => {
            this.update();
            this.render();
            requestAnimationFrame(gameLoop);
        };
        requestAnimationFrame(gameLoop);
    }
};

// Initialize the game when the window loads
window.addEventListener('load', () => {
    // Hide loading screen after a short delay
    setTimeout(() => {
        document.getElementById('loading-screen').classList.remove('visible');
    }, 500);

    try {
        // Initialize the game
        Game.init();

        // Initialize quest display
        QuestManager.initDisplay();

        // Show the introductory dialogue if not completed
        if (!Game.introCompleted) {
            setTimeout(() => {
                Dialogue.showMessage('Boyfriend Quest', 'Hey, handsome.\n\nSomeone has hidden little pieces of their heart all around this world.\n\nYour mission? Find them all, complete your quests, and claim your very special reward.\n\nReady, adventurer?', {
                    hideSkip: false,
                    onOk: () => {
                        Game.introCompleted = true;
                        Game.saveGameState();
                    },
                    onSkip: () => {
                        Game.introCompleted = true;
                        Game.saveGameState();
                    }
                });
            }, 1000);
        }
    } catch (error) {
        console.error('Failed to initialize game:', error);
        // Show error message on loading screen
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.innerHTML = `
                <div class="loading-spinner"></div>
                <p>Error loading game: ${error.message}</p>
                <button class="pixel-button" onclick="location.reload()">Try Again</button>
            `;
        }
    }
});

// Make Game globally available
window.Game = Game;