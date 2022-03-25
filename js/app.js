// start with only names
let candidateNames = [
  "Tara",
  "Kilian",
  "Michiel",
  "Helena",
  "Kimberly",
  "Jasper",
  "Emma",
  "Brent",
  "Youri",
  "Youssef",
  "Dion",
  "Yordi",
  "Nikita",
  "Erwin",
  "Stef",
  "Gilles",
  "Jef",
  "Frederick",
  "Arnaud",
  "Kenny",
  "Sahin",
];

// make random generated candidate objects array
// one mole, & at least one free pass
let candidates = [];
const makeRandomCandidateObjects = () => {
  // assign a random mol
  const molIndex = Math.floor(Math.random() * candidateNames.length);

  // assign two random free pass candidates
  const freePassInd1 = Math.floor(Math.random() * candidateNames.length);
  const freePassInd2 = Math.floor(Math.random() * candidateNames.length);

  candidates = candidateNames.map((candidate, index) => {
    return {
      name: candidate,
      isMol: molIndex == index,
      hasTicket: index == freePassInd1 || index == freePassInd2,
      score: Math.round(Math.random() * 20),
      time: Math.round(Math.random() * 120),
    };
  });
};

// assign random candidates
makeRandomCandidateObjects();

const calculateWorstCandidate = () => {
  // calculate magic things go here
  const filteredCandidates = candidates.filter((candidate) => {
    return !candidate.isMol && !candidate.hasTicket;
  });

  const badCandidate = filteredCandidates.reduce((prev, curr) => {
    return prev.score < curr.score ? prev : curr;
  });

  const worstCandidates = filteredCandidates.filter((candidate) => {
    return candidate.score == badCandidate.score;
  });

  const worstCandidate = worstCandidates.reduce((prev, curr) => {
    return prev.time > curr.time ? prev : curr;
  });

  return worstCandidate;
};

let worstcandidate = calculateWorstCandidate();

//////////// INTERACTIVITY WITH USER ////////////////

// DOM elements
const btnStart = document.querySelector("#btnStart");
const inpName = document.querySelector("#mol");
const splashScreen = document.querySelector(".splash");

inpName.onkeypress = (e) => {
  if (e.key == "Enter") {
    e.preventDefault();

    const givenName = inpName.value.toLowerCase();
    if (isCandidateOut(givenName)) {
      showOverlay("red");
      playSound("./sounds/afvaller.m4a");
      soundTicker.volume = 0;
    } else {
      showOverlay("green");
      playSound("./sounds/niet-afvaller.m4a");
    }

    inpName.value = "";
  }
};

// check if candidate must be eliminated
const isCandidateOut = (name) => {
  return name == worstcandidate.name.toLowerCase();
};

// show red or green overlay
const showOverlay = (color) => {
  // get overlay element
  const overlay = document.querySelector(`#${color}`);
  // remove hidden class ==> element becomes visible
  overlay.classList.remove("hidden");

  // revert to hidden state, unless it is red, then keep it bloody red!
  if (color != "red") {
    setTimeout(() => {
      overlay.classList.add("hidden");
    }, 5000);
  }
};

// start the application
btnStart.onclick = (e) => {
  e.preventDefault();
  // start app
  removeSplashScreen();

  // play intro
  playSound("./sounds/intro.m4a");

  // play ticking, with a delay of 10 seconds
  setTimeout(playTicker, 10000);
};

// remove black screen with start btn
const removeSplashScreen = () => {
  splashScreen.style.display = "none";
};

//////////// HTML5 AUDIO API ////////////////

// play some sound
const playSound = (soundPath) => {
  const sound = new Audio(soundPath);
  sound.play();
};
// play infinite ticker sounds
let soundTicker; // global var (to make it possible to mute from elsewhere)
const playTicker = () => {
  soundTicker = new Audio("./sounds/getik.m4a");
  soundTicker.volume = 0.7;
  soundTicker.play();
  soundTicker.onended = function (e) {
    this.currentTime = 0;
    this.play();
  };
};
