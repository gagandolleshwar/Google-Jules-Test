// DOM Elements
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const settingsBtn = document.getElementById('settings-btn');
const catEl = document.querySelector('.cat');
const eyes = document.getElementById('eyes');

// Settings Modal Elements
const settingsModal = document.getElementById('settings-modal');
const closeBtn = document.querySelector('.close-btn');
const saveSettingsBtn = document.getElementById('save-settings-btn');
const workDurationInput = document.getElementById('work-duration');
const shortBreakDurationInput = document.getElementById('short-break-duration');
const longBreakDurationInput = document.getElementById('long-break-duration');

// Timer State
let timer;
let totalSeconds;
let isRunning = false;
let currentCycle = 'work';
let cycles = 0;

// Timer Durations (in minutes)
let workDuration = 25;
let shortBreakDuration = 5;
let longBreakDuration = 15;

// Sound Notification
const notificationSound = new Audio('https://www.soundjay.com/buttons/sounds/button-16.mp3');

// GSAP Timelines for animations
const purrTimeline = gsap.to("#face", { scale: 1.05, repeat: -1, yoyo: true, duration: 0.5, paused: true });
const wagTimeline = gsap.to("#tail", { rotation: -20, repeat: -1, yoyo: true, duration: 1, ease: "power1.inOut", paused: true });

// Initialize timer
totalSeconds = workDuration * 60;

function updateTimerDisplay() {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
    document.title = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} - ${currentCycle}`;
}

function switchCycle() {
    pauseTimer();
    isRunning = false;
    notificationSound.play().catch(e => console.error("Error playing sound:", e));

    if (currentCycle === 'work') {
        cycles++;
        if (cycles % 4 === 0) {
            currentCycle = 'long-break';
            totalSeconds = longBreakDuration * 60;
        } else {
            currentCycle = 'short-break';
            totalSeconds = shortBreakDuration * 60;
        }
    } else {
        currentCycle = 'work';
        totalSeconds = workDuration * 60;
    }
    updateTimerDisplay();
    startTimer(); // Automatically start the next cycle
}

function startTimer() {
    if (isRunning) return;
    isRunning = true;
    startBtn.textContent = 'Pause';
    purrTimeline.play();
    wagTimeline.play();

    timer = setInterval(() => {
        if (totalSeconds <= 0) {
            clearInterval(timer);
            switchCycle();
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
    purrTimeline.progress(0).pause();
    wagTimeline.progress(0).pause();
    clearInterval(timer);
}

function resetTimer() {
    pauseTimer();
    currentCycle = 'work';
    cycles = 0;
    totalSeconds = workDuration * 60;
    updateTimerDisplay();
}

// Settings Modal Logic
function openSettingsModal() {
    settingsModal.classList.remove('hidden');
}

function closeSettingsModal() {
    settingsModal.classList.add('hidden');
}

function saveSettings() {
    workDuration = parseInt(workDurationInput.value, 10);
    shortBreakDuration = parseInt(shortBreakDurationInput.value, 10);
    longBreakDuration = parseInt(longBreakDurationInput.value, 10);

    if (!isRunning) {
        resetTimer();
    }
    closeSettingsModal();
}

// Interactive Eye Animation
function moveEyes(event) {
    const { clientX, clientY } = event;
    const { left, top, width, height } = catEl.getBoundingClientRect();

    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;

    const moveX = (deltaX / (width / 2)) * 5;
    const moveY = (deltaY / (height / 2)) * 3;

    gsap.to(eyes, { x: moveX, y: moveY, duration: 0.5, ease: "power1.out" });
}

// Event Listeners
startBtn.addEventListener('click', () => {
    if (isRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
});

resetBtn.addEventListener('click', resetTimer);
settingsBtn.addEventListener('click', openSettingsModal);
closeBtn.addEventListener('click', closeSettingsModal);
saveSettingsBtn.addEventListener('click', saveSettings);
window.addEventListener('mousemove', moveEyes);

window.addEventListener('click', (event) => {
    if (event.target === settingsModal) {
        closeSettingsModal();
    }
});

// Initial display
updateTimerDisplay();
