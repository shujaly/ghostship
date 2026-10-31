let duration = 30;
let startTime;
let score = 0;
let ghost;
let spawnEvery = 60;
let state = 'start';
let spooky;
let moon;
let audio;

async function setup() {
  createCanvas(480, 360);
  spooky = await loadFont('https://fonts.googleapis.com/css2?family=Creepster&display=swap');
  textFont(spooky);
  makeMoon();
  spawnGhost();
  startTime = millis();
}

function draw() {
  let elapsed = (millis() - startTime) / 1000;
  let timeLeft = max(0, duration - elapsed);
  background(15, 10, 25);

  let top = color(0, 0, 0);
  let bottom = color(140, 0, 10);
  for (let y = 0; y <= 300; y++) {
    stroke(lerpColor(top, bottom, y / 300));
    line(0, y, width, y);
  }
  noStroke();

  image(moon, 370, 30);
  fill(40, 30, 50);
  rect(0, 300, 480, 60);

  drawTombstone(60, 310, 40, 50);
  drawTombstone(150, 310, 32, 38);
  drawTombstone(330, 310, 46, 60);
  drawTombstone(430, 310, 30, 34);

  if (state === 'start') {
    textAlign(CENTER, CENTER);
    fill(255);
    textSize(32);
    text('Click to start', width / 2, height / 2);
    return;
  }

  if (state === 'over') {
    textAlign(CENTER, CENTER);
    fill(255);
    textSize(32);
    text('Game over\nScore: ' + score + '\nClick to retry', width / 2, height / 2);
    return;
  }

  if (timeLeft <= 0) {
    state = 'over';
    return;
  }

  if (frameCount % spawnEvery === 0) spawnGhost();
  drawGhost(ghost.x + random(-3, 3), ghost.y + random(-3, 3));

  fill(255);
  textSize(22);
  textAlign(LEFT, TOP);
  text('Score: ' + score, 12, 10);
  textAlign(RIGHT, TOP);
  text('Time: ' + ceil(timeLeft), width - 12, 10);
}

function drawGhost(x, y) {
  noStroke();
  fill(220, 255, 230);
  ellipse(x, y, 60, 60);

  fill(20);
  ellipse(x - 12, y - 5, 10);
  ellipse(x + 12, y - 5, 10);
  ellipse(x, y + 16, 10);

  fill(70, 60, 110);
  rect(x - 28, y - 30, 56, 6);
  rect(x - 16, y - 60, 32, 30);

  fill(200, 40, 60);
  rect(x - 16, y - 38, 32, 6);

  fill(20);
  ellipse(x - 6, y + 6, 14, 6);
  ellipse(x + 6, y + 6, 14, 6);
  ellipse(x - 13, y + 8, 5);
  ellipse(x + 13, y + 8, 5);
}

function drawTombstone(x, y, w, h) {
  fill(95, 90, 105);
  rect(x - w / 2, y - h, w, h);
  arc(x, y - h, w, w, PI, TWO_PI);

  fill(60, 55, 70);
  rect(x - 2, y - h - 4, 4, 22);
  rect(x - 8, y - h + 2, 16, 4);
}

function makeMoon() {
  moon = createGraphics(60, 60);
  moon.noStroke();
  moon.fill(200, 10, 20);
  moon.ellipse(30, 30, 50, 50);
  moon.erase();
  moon.ellipse(42, 22, 44, 44);
  moon.noErase();
}

function mousePressed() {
  if (state === 'start' || state === 'over') {
    state = 'play';
    score = 0;
    startTime = millis();
    spawnGhost();
    return;
  }
  if (dist(mouseX, mouseY, ghost.x, ghost.y) < 30) {
    score++;
    playCatchSound();
    spawnGhost();
  }
}

function spawnGhost() {
  ghost = { x: random(40, width - 40), y: random(70, height - 40) };
}

function playCatchSound() {
  if (!audio) audio = new AudioContext();
  let t = audio.currentTime;
  let osc = audio.createOscillator();
  let vol = audio.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(900, t);
  osc.frequency.exponentialRampToValueAtTime(120, t + 0.35);
  vol.gain.setValueAtTime(0.3, t);
  vol.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
  osc.connect(vol);
  vol.connect(audio.destination);
  osc.start(t);
  osc.stop(t + 0.35);
}