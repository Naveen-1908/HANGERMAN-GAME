const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const keyboard = document.getElementById('keyboard');
const wordDisplay = document.getElementById('word');
const hintDisplay = document.getElementById('hint');
const incorrectDisplay = document.getElementById('incorrect');
const gameOverDisplay = document.getElementById('gameOver');
const playAgainBtn = document.getElementById('playAgain');

// Audio elements
const correctAudio = document.getElementById('correctAudio'); // click.mp3
const wrongAudio = document.getElementById('wrongAudio');     // loser.mp3
const gameOverAudio = document.getElementById('gameOverAudio'); // victory.wav

let secretWord = '';
let secretHint = '';
let guessed = [];
let incorrect = 0;
const maxIncorrect = 6;

// Your wordList
const wordList = [
    { word: "guitar", hint: "A musical instrument with strings." },
    { word: "oxygen", hint: "A colorless, odorless gas essential for life." },
    { word: "mountain", hint: "A large natural elevation of the Earth's surface." },
    { word: "painting", hint: "An art form using colors on a surface to create images or expression." },
    { word: "astronomy", hint: "The scientific study of celestial objects and phenomena." },
    { word: "football", hint: "A popular sport played with a spherical ball." },
    { word: "chocolate", hint: "A sweet treat made from cocoa beans." },
    { word: "butterfly", hint: "An insect with colorful wings and a slender body." },
    { word: "history", hint: "The study of past events and human civilization." },
    { word: "pizza", hint: "A savory dish consisting of a round, flattened base with toppings." },
    { word: "jazz", hint: "A genre of music characterized by improvisation and syncopation." },
    { word: "camera", hint: "A device used to capture and record images or videos." },
    { word: "diamond", hint: "A precious gemstone known for its brilliance and hardness." },
    { word: "adventure", hint: "An exciting or daring experience." },
    { word: "science", hint: "The systematic study of the structure and behavior of the physical and natural world." }
    // Add the rest of your wordList here
];

// Unlock audio for browsers on first click
document.body.addEventListener('click', () => {
    correctAudio.play().catch(() => {});
    wrongAudio.play().catch(() => {});
    gameOverAudio.play().catch(() => {});
}, { once: true });

// Pick random word
function pickRandomWord() {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    secretWord = wordList[randomIndex].word.toUpperCase();
    secretHint = wordList[randomIndex].hint;
}

// Initialize game
function initGame() {
    pickRandomWord();
    guessed = Array(secretWord.length).fill('_');
    incorrect = 0;
    updateWord();
    incorrectDisplay.textContent = `Incorrect guesses: ${incorrect}`;
    hintDisplay.textContent = `Hint: ${secretHint}`;
    gameOverDisplay.textContent = '';
    keyboard.innerHTML = '';
    playAgainBtn.style.display = 'none';
    createButtons();
}

// Update displayed word
function updateWord() {
    wordDisplay.textContent = guessed.join(' ');
}

// Create keyboard buttons (mobile-style)
function createButtons() {
    letters.forEach(letter => {
        const btn = document.createElement('button');
        btn.textContent = letter;
        btn.style.backgroundColor = '#111'; // Dark key
        btn.style.color = 'white';           // White letters
        btn.addEventListener('click', () => handleGuess(letter, btn));
        keyboard.appendChild(btn);
    });
}

// Handle guess
function handleGuess(letter, button) {
    button.disabled = true;
    let correct = false;
    for (let i = 0; i < secretWord.length; i++) {
        if (secretWord[i] === letter) {
            guessed[i] = letter;
            correct = true;
        }
    }
    updateWord();

    if (correct) {
        document.body.style.animation = 'guessAnimation 0.5s';
        correctAudio.currentTime = 0;
        correctAudio.play().catch(() => console.log('Correct audio blocked'));
    } else {
        incorrect++;
        incorrectDisplay.textContent = `Incorrect guesses: ${incorrect}`;
        document.body.style.animation = 'loseAnimation 0.5s';
        wrongAudio.currentTime = 0;
        wrongAudio.play().catch(() => console.log('Wrong audio blocked'));
    }

    // Reset animation after 0.5s
    setTimeout(() => {
        document.body.style.animation = 'gradientShift 15s ease infinite';
    }, 500);

    checkGameOver();
}

// Check win/lose
function checkGameOver() {
    if (!guessed.includes('_')) {
        gameOverDisplay.textContent = '🎉 You Win!';
        document.body.style.animation = 'winAnimation 1s';
        playAgainBtn.style.display = 'inline-block';
        disableAllButtons();
        gameOverAudio.currentTime = 0;
        gameOverAudio.play().catch(() => console.log('Victory audio blocked'));
    } else if (incorrect >= maxIncorrect) {
        gameOverDisplay.textContent = `💀 Game Over! Word was: ${secretWord.toLowerCase()}`;
        playAgainBtn.style.display = 'inline-block';
        disableAllButtons();
        gameOverAudio.currentTime = 0;
        gameOverAudio.play().catch(() => console.log('Victory audio blocked'));
    }
}

// Disable all buttons
function disableAllButtons() {
    document.querySelectorAll('#keyboard button').forEach(btn => btn.disabled = true);
}

// Play Again button
playAgainBtn.addEventListener('click', () => {
    initGame();
});

// Start game
initGame();
