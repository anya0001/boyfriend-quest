# Boyfriend Quest

A pixel-art romantic adventure game made for your boyfriend. Explore a magical nighttime forest, collect hearts, complete romantic quests, and unlock a special love letter.

## Features

- Cute pixel-art graphics and animations
- Heart collection gameplay with 8 unique hearts to find
- Quest system with 3 romantic quests:
  1. The Heart Collector - Find all hearts
  2. How Well Do You Know Your Girlfriend? - Relationship quiz
  3. A Flower for Her - Choose the perfect flower
- Final reward: A personalized love letter
- Progress saving using LocalStorage
- Responsive design for desktop and mobile
- Original CSS-drawn pixel art (no external dependencies)

## How to Run

### Method A: VS Code Live Sass Compiler (Recommended)

1. Open the project folder in VS Code
2. Install the [Live Sass Compiler](https://marketplace.visualstudio.com/items?itemName=ritwickdey.live-sass) extension if not already installed
3. Click "Watch Sass" in the status bar to compile SCSS to CSS
4. Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension
5. Right-click on `index.html` and select "Open with Live Server"

### Method B: npm Scripts

1. Install Node.js if necessary (https://nodejs.org/)
2. Open terminal in the project folder
3. Run `npm install` to install dependencies
4. Run `npm run sass` to start watching SCSS files for changes
5. In a separate terminal tab, run `npx live-server` or use any local server to serve the files
6. Open `http://localhost:8080` in your browser (or whatever port your server uses)

## Project Structure

```
boyfriend-quest/
├── index.html
├── README.md
├── package.json
├── .gitignore
├── scss/
│   ├── main.scss
│   ├── _variables.scss
│   ├── _mixins.scss
│   ├── _base.scss
│   ├── _layout.scss
│   ├── _game.scss
│   ├── _components.scss
│   ├── _modals.scss
│   └── _responsive.scss
├── css/
│   └── main.css
├── js/
│   ├── main.js
│   ├── game.js
│   ├── quests.js
│   ├── dialogue.js
│   └── storage.js
```

## Customization

### Changing the Love Letter
Edit the `showFinalReward()` function in `js/game.js` to modify the letter text.

### Changing Heart Messages
Modify the `heartMessages` array in the `checkHeartCollection()` function in `js/game.js`.

### Changing Quiz Questions
Edit the `QuizData` object in `js/quests.js`. Each question has:
- `question`: The question text
- `options`: Array of answer options
- `correctAnswer`: Index of the correct option (0-based)
- `feedback`: Message to show when answered correctly

### Changing Flower Options
Edit the `FlowerOptions` array in `js/quests.js`. Each flower has:
- `id`: Unique identifier
- `name`: Flower name
- `color`: Hex color code for the button
- `message`: Message to show when selected

### Changing Colors
Modify the variables in `scss/_variables.scss`:
- `$bg-color`: Background color
- `$panel-color`: UI panel color
- `$primary-pink`: Main accent color
- And other color variables

### Adding More Hearts
1. Add new positions to the `heartPositions` array in `js/game.js`'s `createHearts()` function
2. Update `this.totalHearts` to match the new total
3. Add corresponding messages to the `heartMessages` array

## Development Notes

- The game uses vanilla JavaScript and SCSS
- No external frameworks or libraries required
- All graphics are drawn using Canvas or CSS
- Progress is saved to LocalStorage
- Responsive design works on mobile and desktop
- Keyboard controls (Arrow keys/WASD) and touch controls supported

## Troubleshooting

### Missing Stylesheet
If the game looks unstyled:
1. Ensure `css/main.css` exists
2. If missing, run `npm run sass` to compile SCSS
3. Check that `<link rel="stylesheet" href="css/main.css">` is in `index.html`

### Sass Compilation Errors
1. Check SCSS syntax for errors
2. Ensure all `@import` statements reference existing files
3. Try running `npx sass scss/main.scss:css/main.css` directly

### LocalStorage Not Saving
1. LocalStorage doesn't work in file:// URLs in some browsers
2. Serve the files through a local server (Live Server, npm live-server, etc.)
3. Check browser settings to ensure LocalStorage is enabled
4. Try incognito/private browsing mode to rule out extension conflicts

## Credits

Game created by Ana for her boyfriend.