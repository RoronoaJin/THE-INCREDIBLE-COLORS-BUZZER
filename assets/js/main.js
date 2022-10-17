const light = document.querySelector('#light');
const choices = Array.from(document.querySelectorAll('#buzzer'));
const scoreCount = document.querySelector('#score');
const timeDisplay = document.querySelector('#timer');
const finalScore = document.querySelector('#finalScore');
const username = document.querySelector('#username');
const saveScoreBtn = document.querySelector('#saveScoreBtn');
const MAX_HIGH_SCORES = 10;
const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
const lowestScore = highScores[MAX_HIGH_SCORES - 1]?.score ?? 0;
const highestScore = highScores[MAX_HIGH_SCORES - 10]?.score ?? 0;
const gameMainTheme = document.getElementById('gameMainAudio');
const wrongAnswerAudio = document.getElementById('wrongAnswerAudio');
const zeroPointsAudio = document.getElementById('zeroPointsAudio');
const recordAudio = document.getElementById('recordAudio');
const winAudio = document.getElementById('winAudio');
const muteVolumeBtn = document.querySelector('#mute-volume');

let currentQuestion = {};
let acceptingAnswers = true;
let score = 0;
let scorePoints;
let timerInitialTime = 20000;
let newTime = timerInitialTime;
let currentTime = timerInitialTime;
let timerCount = timerInitialTime;
let countDown;
let initialMillis;
let choicesNumbers = [];
let lifePoints = 3;
let buzzers = [
    {
        light: 'Red',
        choice1: 'Red',
        choice2: 'Blue',
        choice3: 'Green',
        choice4: 'Yellow',
        answer: 1,
    }, 
    {
        light: 'Blue',
        choice1: 'Red',
        choice2: 'Blue',
        choice3: 'Green',
        choice4: 'Yellow',
        answer: 2,
    },
    {
        light: 'Green',
        choice1: 'Red',
        choice2: 'Blue',
        choice3: 'Green',
        choice4: 'Yellow',
        answer: 3,
    },
    {
        light: 'Yellow',
        choice1: 'Red',
        choice2: 'Blue',
        choice3: 'Green',
        choice4: 'Yellow',
        answer: 4,
    }
];

/* ////////////////////////// AUDIO ///////////////////////// */
function playAudio(audio) { 
    audio.play(); 
} 

function pauseAudio(audio) { 
    audio.pause(); 
} 

function muteAudio(){
    muteVolumeBtn.addEventListener('click', event => {
        pauseAudio(gameMainTheme);
        muteVolumeBtn.addEventListener('click', event => {
            playAudio(gameMainTheme);
            muteAudio();
        });
    });
}

/* ////////////////////////////////////////////////////////// */


/* ////////////////////////// TIMER ///////////////////////// */
function displayTimer(seconds) {
    var res = seconds / 1000;
    timeDisplay.innerHTML = res.toPrecision(seconds.toString().length);
}

function timer() {
    if (timerCount <= 0) {
        clearInterval(countDown);  
        acceptingAnswers = false;
        timeDisplay.innerText = 'Timeout!';

        if(lifePoints == 1){
            document.getElementById('life-one').style.display = "none";
            showModal();
        }
        else{
            lifePointsDecrease();
            removeLight();
            nextQuestion();
        }
        return;
    }

    let current = Date.now();
    
    timerCount = timerCount - (current - initialMillis);
    initialMillis = current;
    displayTimer(timerCount);
}

function startTimer() {
    clearInterval(countDown);
    initialMillis = Date.now();
    countDown = setInterval(timer, 1);
}
/* ////////////////////////////////////////////////////////// */


/* ////////////////////////// SCORE FUNCTIONS ///////////////////////// */
function pointsCalculation() {
    let remainingTime = newTime - timerCount;
    if(remainingTime <= ((newTime/3)*1)){
        scorePoints = 50;
    }
    if(((newTime/3)*1) < remainingTime && remainingTime <= ((newTime/3)*2)){
        scorePoints = 25;
    }
    if(((newTime/3)*2) < remainingTime && remainingTime <= ((newTime/3)*3)){
        scorePoints = 10;
    }
}

function incrementScore(num){
    score += num;
    scoreCount.innerText = score;
}

username.addEventListener('keyup', () => {
    saveScoreBtn.disabled = !username.value;
})

function showModal() {
    pauseAudio(gameMainTheme);
    localStorage.setItem("currentScore", score);
    const mostRecentScore = localStorage.getItem('currentScore');
    finalScore.innerText = mostRecentScore;

    document.getElementById('modal-container').style.display = "flex";

    if(score == 0){
        playAudio(zeroPointsAudio);
    }

    if(score >= lowestScore && score >0){
        playAudio(winAudio);
        document.getElementById('insert-username-container').style.display = "block";

        if(score > highestScore){
            playAudio(recordAudio);
            document.getElementById('record-alert').style.display = "block";
        }

        saveHighScore = e => {
            e.preventDefault()
        
            const score = {
                score: mostRecentScore,
                name: username.value.toUpperCase()
            };
        
            highScores.push(score);
        
            highScores.sort((a, b) => b.score - a.score);
        
            highScores.splice(MAX_HIGH_SCORES);
        
            localStorage.setItem('highScores', JSON.stringify(highScores));
            window.location.assign('./index.html');
        }
    }
}
/* //////////////////////////////////////////////////////////////////// */
function assignRandNumber() {
    if (!choicesNumbers.length) {
        for (let i = 1; i <= 4; i++) {
            choicesNumbers.push(i);
        }
    }
    
    let index = Math.floor(Math.random() * choicesNumbers.length);
    let val = choicesNumbers[index];

    choicesNumbers.splice(index, 1);

    return val;
}

function getNewQuestion(){
    pauseAudio(wrongAnswerAudio);
    const questionIndex = Math.floor(Math.random() * buzzers.length);
    currentQuestion = buzzers[questionIndex];
    
    if(currentQuestion.light == 'Red'){
        document.getElementById('light').classList.add('color-red');
    }
    if(currentQuestion.light == 'Blue'){
        document.getElementById('light').classList.add('color-blue');
    }
    if(currentQuestion.light == 'Green'){
        document.getElementById('light').classList.add('color-green');
    }
    if(currentQuestion.light == 'Yellow'){
        document.getElementById('light').classList.add('color-yellow');
    }

    choices.forEach(choice => {
        let currentColor = assignRandNumber();
        choice.dataset['number'] = currentColor;

        const number = choice.dataset['number'];

        if(number == 1){
            choice.style.backgroundColor = "Red";
        }
        if(number == 2){
            choice.style.backgroundColor = "Blue";
        }
        if(number == 3){
            choice.style.backgroundColor = "Green";
        }
        if(number == 4){
            choice.style.backgroundColor = "Yellow";
        }
    })

    acceptingAnswers = true;
    
    startTimer();
}

function lightSwitchRange(min, max) {
    let starter = Math.random() * (max - min) + min;
    return starter;
}

function lightSwitch(){
    acceptingAnswers = false;
    let id = setTimeout(() => {
        getNewQuestion();
    }, lightSwitchRange(500, 1500));
    setTimeout(id);
}

function removeLight(){
    if(currentQuestion.light == 'Red'){
        document.getElementById('light').classList.remove('color-red');
    }
    if(currentQuestion.light == 'Blue'){
        document.getElementById('light').classList.remove('color-blue');
    }
    if(currentQuestion.light == 'Green'){
        document.getElementById('light').classList.remove('color-green');
    }
    if(currentQuestion.light == 'Yellow'){
        document.getElementById('light').classList.remove('color-yellow');
    }
}

function lifePointsDecrease(){
    lifePoints--;
    if(lifePoints == 2){
        document.getElementById('life-three').style.display = "none";
    }
    if(lifePoints == 1){
        document.getElementById('life-two').style.display = "none";
    }
}

function timerDecrease(){
    newTime = currentTime - 200;
    currentTime = newTime;
    timerCount = newTime;
}

function nextQuestion () {
    if(newTime >= ((timerInitialTime/5)*1)){
        timerDecrease();
    }
    else{
        timerCount = ((timerInitialTime/5)*1);
    }
    clearInterval(countDown);
    lightSwitch();
}

choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if(!acceptingAnswers) return

        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        let correctAnswer = currentQuestion.answer;

        if(selectedAnswer == correctAnswer){
            pointsCalculation();
            incrementScore(scorePoints);
            removeLight();
            nextQuestion();
        }
        else if(lifePoints > 1){
            playAudio(wrongAnswerAudio);
            clearInterval(countDown);  
            timeDisplay.innerText = 'Wrong!';
            lifePointsDecrease();
            removeLight();
            nextQuestion();
        }
        else{
            clearInterval(countDown);
            timeDisplay.innerText = 'Wrong!';
            document.getElementById('life-one').style.display = "none";
            showModal();
        }
    })
})

/* //////////////////////// STARTER /////////////////////// */
function startGame() {
    score = 0;
    lifePoints = 3;
    playAudio(gameMainTheme);
    displayTimer(newTime);
    lightSwitch();
}
/* //////////////////////////////////////////////////////// */

startGame();
muteAudio()