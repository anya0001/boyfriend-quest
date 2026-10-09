// Quest system
const QuestManager = {
    quests: [],
    completedQuests: [],

    init: function() {
        this.quests = [
            {
                id: 1,
                name: 'The Heart Collector',
                description: 'Find all eight hearts in the forest.',
                objective: 'Collect 8 hearts',
                progress: 0,
                target: 8,
                completed: false,
                unlocked: true, // First quest is unlocked by default
                reward: 'Bonus message and satisfaction'
            },
            {
                id: 2,
                name: 'How Well Do You Know Your Girlfriend?',
                description: 'Answer questions about your relationship.',
                objective: 'Complete the quiz',
                progress: 0,
                target: 1, // We'll treat this as a single quest that requires completing the quiz
                completed: false,
                unlocked: false, // Locked until quest 1 is complete
                reward: 'Bonus heart'
            },
            {
                id: 3,
                name: 'A Flower for Her',
                description: 'Choose a flower to give to your girlfriend.',
                objective: 'Select a flower',
                progress: 0,
                target: 1,
                completed: false,
                unlocked: false, // Locked until quest 2 is complete
                reward: 'Bonus collectible'
            }
        ];

        // Load completed quests from storage (handled by Storage.loadData)
        // We'll sync completedQuests with Storage data in the game init
    },

    // Called when a heart is collected
    heartCollected: function() {
        // Find quest 1 (Heart Collector)
        const quest1 = this.quests.find(q => q.id === 1);
        if (quest1 && !quest1.completed && typeof Game !== 'undefined') {
            quest1.progress = Game.heartsCollected;
            if (Game.heartsCollected >= quest1.target) {
                this.completeQuest(1);
            }
            this.updateQuestDisplay();
        }
    },

    // Complete a quest by ID
    completeQuest: function(questId) {
        const quest = this.quests.find(q => q.id === questId);
        if (quest && !quest.completed) {
            quest.completed = true;
            this.completedQuests.push(questId);
            // Unlock the next quest if exists
            if (questId < this.quests.length) {
                const nextQuest = this.quests.find(q => q.id === questId + 1);
                if (nextQuest) {
                    nextQuest.unlocked = true;
                    // Trigger quest-specific events when unlocked
                    this.onQuestUnlocked(nextQuest.id);
                }
            }
            this.saveProgress();
            this.updateQuestDisplay();
            // Show quest completion notification
            Dialogue.showMessage(`Quest Complete: ${quest.name}`, quest.reward);
            return true;
        }
        return false;
    },

    // Called when a quest is unlocked
    onQuestUnlocked: function(questId) {
        if (questId === 2) {
            // Quest 2 unlocked - show quiz
            setTimeout(() => {
                Dialogue.showMessage('Quest Unlocked!', 'How Well Do You Know Your Girlfriend?\n\nGet ready to answer some questions about your relationship.', {
                    hideSkip: true,
                    onOk: () => {
                        if (typeof Game !== 'undefined') {
                            Game.startQuiz();
                        }
                    }
                });
            }, 500);
        } else if (questId === 3) {
            // Quest 3 unlocked - show flower selection
            setTimeout(() => {
                Dialogue.showMessage('Quest Unlocked!', 'A Flower for Her\n\nChoose a flower to give to your girlfriend.', {
                    hideSkip: true,
                    onOk: () => {
                        if (typeof Game !== 'undefined') {
                            Game.showFlowerSelection();
                        }
                    }
                });
            }, 500);
        }
    },

    // Check if a quest is unlocked
    isUnlocked: function(questId) {
        const quest = this.quests.find(q => q.id === questId);
        return quest ? quest.unlocked : false;
    },

    // Save progress to storage
    saveProgress: function() {
        Storage.saveData();
    },

    // Update the quest log display
    updateQuestDisplay: function() {
        const questListElement = document.getElementById('quest-list');
        if (!questListElement) return;

        questListElement.innerHTML = '';
        this.quests.forEach(quest => {
            const questElement = document.createElement('div');
            questElement.className = `quest-item ${quest.completed ? 'completed' : ''} ${!quest.unlocked && !quest.completed ? 'locked' : ''}`;
            questElement.innerHTML = `
                <span class="quest-title">${quest.name}</span>
                <span class="quest-description">${quest.description}</span>
                ${quest.progress > 0 && quest.target > 0 ? `<span class="quest-progress">${quest.progress}/${quest.target}</span>` : ''}
            `;
            questListElement.appendChild(questElement);
        });
    },

    // Initialize the quest display
    initDisplay: function() {
        this.updateQuestDisplay();
    }
};

// Initialize quests when the script loads
QuestManager.init();

// Quiz data - easy to customize
const QuizData = {
    questions: [
        {
            question: "What does your girlfriend love doing?",
            options: [
                "Playing video games together",
                "Going for walks in the park",
                "Cooking meals together",
                "Watching movies and cuddling"
            ],
            correctAnswer: 0, // Index of correct answer (0-based)
            feedback: "That's right! Game nights are our favorite!"
        },
        {
            question: "What's her idea of a cute surprise?",
            options: [
                "Expensive jewelry",
                "A handwritten note",
                "Designer clothes",
                "Luxury spa day"
            ],
            correctAnswer: 1,
            feedback: "Exactly! It's the thought that counts."
        },
        {
            question: "What's the most important thing about this adventure?",
            options: [
                "Collecting all the hearts",
                "Beating the game quickly",
                "Spending time together",
                "Getting the final reward"
            ],
            correctAnswer: 2,
            feedback: "Perfect! It's all about us."
        }
    ]
};

// Flower options
const FlowerOptions = [
    { id: 1, name: 'Rose', color: '#FF0000', message: 'Rose delivered! Classic romance never goes out of style.' },
    { id: 2, name: 'Tulip', color: '#FF6EAA', message: 'Tulip delivered! Bright and cheerful, just like your smile.' },
    { id: 3, name: 'Sunflower', color: '#FFD879', message: 'Sunflower delivered! You bring sunshine to my days.' }
];

// Export for use in other files
window.QuizData = QuizData;
window.FlowerOptions = FlowerOptions;

// Make QuestManager globally available
window.QuestManager = QuestManager;