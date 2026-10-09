// Storage handling for the game
const Storage = {
    saveData: function() {
        // Check if Game and QuestManager are available
        if (typeof Game === 'undefined' || typeof QuestManager === 'undefined') {
            console.warn('Game or QuestManager not available for saving');
            return;
        }

        try {
            const data = {
                heartsCollected: Game.heartsCollected,
                collectedHeartIndexes: Game.hearts
                    .map((heart, index) => heart.collected ? index : null)
                    .filter(index => index !== null),
                completedQuests: QuestManager.completedQuests,
                playerPosition: Game.playerPosition,
                introCompleted: Game.introCompleted,
                finalRewardUnlocked: Game.finalRewardUnlocked
            };
            localStorage.setItem('boyfriendQuestSave', JSON.stringify(data));
        } catch (e) {
            console.warn('Failed to save game data:', e);
        }
    },

    loadData: function() {
        try {
            const saved = localStorage.getItem('boyfriendQuestSave');
            if (saved) {
                const data = JSON.parse(saved);
                // Only update if Game and QuestManager are available
                if (typeof Game !== 'undefined' && typeof QuestManager !== 'undefined') {
                    Game.heartsCollected = data.heartsCollected || 0;
                    QuestManager.completedQuests = Array.isArray(data.completedQuests) ? data.completedQuests : [];
                    const collectedHeartIndexes = Array.isArray(data.collectedHeartIndexes)
                        ? data.collectedHeartIndexes
                        : Array.from(
                            { length: Math.min(Game.heartsCollected, Game.hearts.length) },
                            (_, index) => index
                        );
                    Game.hearts.forEach((heart, index) => {
                        heart.collected = collectedHeartIndexes.includes(index);
                    });
                    Game.playerPosition = data.playerPosition || { x: 100, y: 100 };
                    Game.introCompleted = data.introCompleted || false;
                    Game.finalRewardUnlocked = data.finalRewardUnlocked || false;
                }
            }
        } catch (e) {
            console.warn('Failed to load game data:', e);
            // Reset to defaults if objects are available
            if (typeof Game !== 'undefined' && typeof QuestManager !== 'undefined') {
                Game.heartsCollected = 0;
                QuestManager.completedQuests = [];
                Game.playerPosition = { x: 100, y: 100 };
                Game.introCompleted = false;
                Game.finalRewardUnlocked = false;
            }
        }
    },

    reset: function() {
        if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
            localStorage.removeItem('boyfriendQuestSave');
            // Reset game state if objects are available
            if (typeof Game !== 'undefined' && typeof QuestManager !== 'undefined') {
                Game.heartsCollected = 0;
                QuestManager.completedQuests = [];
                Game.playerPosition = { x: 100, y: 100 };
                Game.introCompleted = false;
                Game.finalRewardUnlocked = false;
            }
            // Reload the game
            location.reload();
        }
    }
};

// Make Storage globally available
window.Storage = Storage;