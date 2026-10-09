// Main game initialization and coordination
document.addEventListener('DOMContentLoaded', function() {
    console.log('Boyfriend Quest initialized!');
});

// Keep a loading overlay from trapping the page if the game startup event
// is missed or another script finishes loading in an unexpected order.
(function ensureLoadingScreenCanClose() {
    function hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (!loadingScreen) return;
        loadingScreen.classList.remove('visible');
        loadingScreen.classList.add('hidden');
        loadingScreen.style.setProperty('display', 'none', 'important');
        loadingScreen.setAttribute('aria-hidden', 'true');
    }

    if (document.readyState === 'complete') {
        hideLoadingScreen();
    } else {
        window.addEventListener('load', hideLoadingScreen, { once: true });
    }

    // Last-resort failsafe: never leave the full-page overlay covering the game.
    window.setTimeout(hideLoadingScreen, 2000);
})();

// Export removed - objects are now exported from their respective modules
