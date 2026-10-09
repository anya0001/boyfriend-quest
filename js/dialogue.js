// Dialogue and modal system
const Dialogue = {
    // Show a dialogue box with a message and optional callback
    showMessage: function(title, message, options = {}) {
        const dialogueBox = document.getElementById('dialogue-box');
        const dialogueText = document.getElementById('dialogue-text');
        const dialogueOk = document.getElementById('dialogue-ok');
        const dialogueSkip = document.getElementById('dialogue-skip');

        // Set the content
        dialogueText.innerHTML = `<strong>${title}</strong><br>${message}`;

        // Handle options
        if (options.hideSkip) {
            dialogueSkip.style.display = 'none';
        } else {
            dialogueSkip.style.display = 'inline-block';
        }

        // Set up button handlers
        dialogueOk.onclick = () => {
            dialogueBox.classList.remove('show');
            if (options.onOk) options.onOk();
        };

        dialogueSkip.onclick = () => {
            dialogueBox.classList.remove('show');
            if (options.onSkip) options.onSkip();
        };

        // Show the dialogue
        dialogueBox.classList.add('show');
    },

    // Show a modal with content and options
    showModal: function(title, message, options = {}) {
        const modal = document.getElementById('modal');
        const modalContent = document.getElementById('modal-content');
        const modalOk = document.getElementById('modal-ok');
        const modalCancel = document.getElementById('modal-cancel');

        // Set the content
        modalContent.innerHTML = `<h3>${title}</h3><p>${message}</p>`;

        // Handle options
        if (options.hideCancel) {
            modalCancel.style.display = 'none';
        } else {
            modalCancel.style.display = 'inline-block';
        }

        // Set up button handlers
        modalOk.onclick = () => {
            modal.classList.remove('show');
            if (options.onOk) options.onOk();
        };

        modalCancel.onclick = () => {
            modal.classList.remove('show');
            if (options.onCancel) options.onCancel();
        };

        // Show the modal
        modal.classList.add('show');
    },

    // Hide dialogue
    hideDialogue: function() {
        document.getElementById('dialogue-box').classList.remove('show');
    },

    // Hide modal
    hideModal: function() {
        document.getElementById('modal').classList.remove('show');
    }
};

// Close dialogues when pressing Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const dialogueBox = document.getElementById('dialogue-box');
        const modal = document.getElementById('modal');
        if (dialogueBox.classList.contains('show')) {
            dialogueBox.classList.remove('show');
        } else if (modal.classList.contains('show')) {
            modal.classList.remove('show');
        }
    }
});

// Make Dialogue globally available
window.Dialogue = Dialogue;