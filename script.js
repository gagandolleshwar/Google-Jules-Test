const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const catEl = document.querySelector('.cat');

let timer;
let totalSeconds = 25 * 60;
let isRunning = false;

function updateTimerDisplay() {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
}

function startTimer() {
    if (isRunning) return;
    isRunning = true;
    startBtn.textContent = 'Pause';
    catEl.classList.add('purring', 'wagging');
    timer = setInterval(() => {
        if (totalSeconds <= 0) {
            clearInterval(timer);
            alert("Time's up!");
            resetTimer();
            return;
        }
        totalSeconds--;
        updateTimerDisplay();
    }, 1000);
}

function pauseTimer() {
    if (!isRunning) return;
    isRunning = false;
    startBtn.textContent = 'Start';
    catEl.classList.remove('purring', 'wagging');
    clearInterval(timer);
}

function resetTimer() {
    pauseTimer();
    totalSeconds = 25 * 60;
    updateTimerDisplay();
}

startBtn.addEventListener('click', () => {
    if (isRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
});

resetBtn.addEventListener('click', resetTimer);

updateTimerDisplay();
