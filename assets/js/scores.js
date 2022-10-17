const highScoresList = document.querySelector('#highScoresList');
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

function showHighScores() {
    highScoresList.innerHTML = highScores.map(score => {
        return `<li>${score.name} - ${score.score}</li>`
    }).join("");
}

showHighScores();