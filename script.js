let simulationState = {};
let animationFrame;
let isPaused = false;
const canvas = document.getElementById("CIDcanvas");
const ctx = canvas.getContext('2d');
const resetButton = document.getElementById("reset-button");
const distanceDisplay = document.getElementById("distance");
const clearCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

document.addEventListener("keydown", (event) => {
    if (event.code === 'Space') {
        isPaused = true;
        cancelAnimationFrame(animationFrame);
    }
});

function staticCircle() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 60;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.closePath();
}

function displayFixationPoint() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const fixationRadius = 5;
    const fixationColor = 'black';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(centerX, centerY, fixationRadius, 0, 2 * Math.PI);
    ctx.fillStyle = fixationColor;
    ctx.fill();
    ctx.stroke();
}

function drawModel(x, y) {
    const radius = 8;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
}

function initialiseSim() {
    isPaused = false;
    simulationState = {
        protag: {
            x: (canvas.width / 2) - 68,
            y: 100,
            vx: 0.25,
            radius: 8,
            distance: 100
        },
        stationary: {
            x: canvas.width / 2,
            y: canvas.width / 2,
            radius: 8
        }
    };
}

function updateSim() {
    const protag = simulationState.protag;

    if (!isPaused) {
        protag.x += protag.vx;
    }

    protag.distance = updateDistance();

    if (protag.x + protag.radius >= (canvas.width / 2) - 8) {
        isPaused = true;
        cancelAnimationFrame(animationFrame);
    }
}

function updateDistance() {
    const DISTANCE_DIVISOR = 52;
    const protag = simulationState.protag;
    const stationary = simulationState.stationary;
    const dist = (stationary.x - protag.x - (stationary.radius + protag.radius));
    return (100 * dist / DISTANCE_DIVISOR);
}

function renderSim() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const protag = simulationState.protag;

    staticCircle();

    drawModel(canvas.width / 2, canvas.height / 2);

    drawModel(protag.x, canvas.height / 2);

    distanceDisplay.innerHTML = `the distance is: ${protag.distance.toFixed(2)}`;
}

function simLoop() {
    updateSim();
    renderSim();
    animationFrame = requestAnimationFrame(simLoop);
}

function displayProtag() {
    const generator = () => (Math.ceil(Math.random() * 4))
    let text = generator() === 1 ? "authority" : generator() === 2 ? "friend" : generator() === 3 ? "stranger" : "ball";
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
}

function resetSim() {
    cancelAnimationFrame(animationFrame);
    clearCanvas();
    displayProtag();
    setTimeout(() => {
        clearCanvas();
        displayFixationPoint();
        setTimeout(() => {
            initialiseSim();
            renderSim();
            setTimeout(() => {
                simLoop();
            }, 1000);
            resetButton.blur();
        }, 500)
    }, 1000)
}
