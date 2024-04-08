const rangePickerSection = document.querySelector("#rangePickerSection");
const rangeDisplay = document.querySelector("#rangeDisplay");
const generateDisplay = document.querySelector(".generate");
const scoreDisplay = document.querySelector("#scoreDisplay");
const gameSection = document.querySelector(".game");
const rangeInput = document.querySelector("#rangeInput");
const startBtn = document.querySelector("#startBtn");
const resetBtn = document.querySelector("#resetBtn");
const failedAttemptsDisplay = document.querySelector("#failedAttemptsDisplay");
const config = {
  range: 10,
  score: 0,
  isStarted: false,
  selectedCards: [],
  failedAttempts: 0,
  allAttempts: 40,
};
rangeInput.addEventListener("change", function () {
  rangeDisplay.textContent = this.value;
});

startBtn.addEventListener("click", () => {
  config.range = Number(rangeInput.value);
  config.isStarted = true;
  config.selectedCards.splice(0);
  config.score = 0;
  scoreDisplay.textContent = 0;
  failedAttemptsDisplay.textContent = 0;
  config.allAttempts = config.range * 4;
  startGame();
});

resetBtn.addEventListener("click", () => {
  resetGame();
});

function startGame() {
  toggleControls();
  initCards();
  rotateAllCards();
}

function toggleControls() {
  gameSection.style.display = config.isStarted ? "block" : "none";
  rangePickerSection.style.display = config.isStarted ? "none" : "block";
}

function initCards() {
  const randomCards = getShuffledWithDuplicates(cards, config.range);
  generateDisplay.style.gridTemplateColumns = `repeat(${Math.floor(
    config.range / 2
  )}, 1fr)`;
  randomCards.forEach((card) => {
    generateDisplay.innerHTML += `
      <div class="box back-rotate">
        <img class="card-image" src="./assets/images/${card}">
      </div>
    `;
  });
  document.querySelectorAll(".box").forEach((box) => {
    toggleBox(box);
    box.addEventListener("click", function () {
      if (
        !this.classList.contains("rotate") &&
        config.selectedCards.length < 2
      ) {
        toggleBox(this);
        config.selectedCards.push(this);
        checkSelectedElements();
      }
    });
  });
}

function rotateAllCards() {
  setTimeout(() => {
    document.querySelectorAll(".box").forEach((element) => {
      toggleBox(element);
    });
  }, 2000);
}

function toggleBox(element) {
  element.classList.toggle("rotate");
  element.classList.toggle("back-rotate");
}

function checkSelectedElements() {
  if (config.selectedCards.length === 2) {
    const firstCardName = getImageNameFromBox(config.selectedCards[0]);
    const secondCardName = getImageNameFromBox(config.selectedCards[1]);
    if (firstCardName === secondCardName) {
      scoreDisplay.textContent = ++config.score;
      outOfAttempts();
      config.selectedCards.splice(0);
      if (config.score === config.range) {
        displayAlert("Congrats", "success");
        setTimeout(() => {
          resetGame();
        }, 2000);
      }
    } else {
      setTimeout(() => {
        config.selectedCards.forEach((card) => {
          toggleBox(card);
        });
        config.selectedCards.splice(0);
      }, 1000);
      failedAttemptsDisplay.textContent = ++config.failedAttempts;
      outOfAttempts();
    }
  }
}

function getImageNameFromBox(box) {
  return box.firstElementChild.src.split("/").pop();
}

function displayAlert(title, icon, text = "") {
  Swal.fire({ title, icon, text });
}

function resetGame() {
  config.isStarted = false;
  config.score = 0;
  config.selectedCards.splice(0);
  generateDisplay.innerHTML = "";
  config.failedAttempts = 0;
  config.allAttempts = 40;
  toggleControls();
  displayAlert("Reseted", "info", "Game has been reseted");
}
function outOfAttempts() {
  if (config.score != config.range) {
    const singleCardAttempts = (config.score + config.failedAttempts) * 2;
    const allSingleAttempts = config.allAttempts;
    if (singleCardAttempts >= allSingleAttempts) {
      setTimeout(() => {
        displayAlert("out of Attempts", "error");
      }, 1000);

      setTimeout(() => {
        resetGame();
      }, 3000);
    }
  }
}
