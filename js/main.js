// Main game initialization and coordination
// This file will handle any additional initialization and coordinate between systems

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Additional initialization if needed
    console.log('Boyfriend Quest initialized!');

    // We could add global event listeners here if needed
    // For example, listening for storage errors or other global events

    // Add a reset button for debugging (optional)
    // This would be removed or hidden in production
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset Progress (Dev)';
    resetButton.style.position = 'fixed';
    resetButton.style.top = '10px';
    resetButton.style.left = '10px';
    resetButton.style.zIndex = '1000';
    resetButton.addEventListener('click', () => {
        window.Storage.reset();
    });
    // Uncomment the line below to show the reset button during development
    // document.body.appendChild(resetButton);
});

// Export removed - objects are now exported from their respective modules