import p5 from "https://cdn.jsdelivr.net/npm/p5@1.11.3/+esm";

let thickness = 250;
let ball;
let players = [];
let rallyCount = 0;
let message = "";
let lastHitTime = 0;

// Remove scrollbars and spacing
const style = document.createElement("style");
style.innerHTML = `
  html, body {
    margin: 0;
    padding: 0;
    overflow: hidden;
    height: 100%;
  }
  canvas {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
  }
`;
document.head.appendChild(style);

const sketch = (p) => {
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(20);

    ball = new Ball(p);
    players = [
      new Player(p, 200, "🤷‍♀️", p.LEFT_ARROW, p.RIGHT_ARROW, p.UP_ARROW),
      new Player(p, p.width - 200, "🙆", 65, 68, 87) // A, D, W
    ];
  };

  p.draw = () => {
    p.background(170, 152, 169);

    // Court
    p.fill(255, 230, 180);
    p.rect(0, p.height - thickness, p.width, thickness);

    ball.update(p);
    ball.display(p);

    for (let player of players) {
      player.update(p);
      player.display(p);
      ball.checkPlayerCollision(player, p);
    }

    displayRally(p);
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

  p.keyPressed = () => {
    for (let player of players) {
      if (p.keyCode === player.jumpKey) {
        player.jump();
      }
    }
  };
};

class Player {
  constructor(p, x, face, leftKey, rightKey, jumpKey) {
    this.x = x;
    this.y = p.height - thickness;
    this.vy = 0;
    this.onGround = true;
    this.face = face;
    this.size = 40;
    this.leftKey = leftKey;
    this.rightKey = rightKey;
    this.jumpKey = jumpKey;
  }

  update(p) {
    if (p.keyIsDown(this.leftKey)) this.x -= 4;
    if (p.keyIsDown(this.rightKey)) this.x += 4;

    this.y += this.vy;
    this.vy += 0.5;

    if (this.y >= p.height - thickness) {
      this.y = p.height - thickness;
      this.vy = 0;
      this.onGround = true;
    }
  }

  jump() {
    if (this.onGround) {
      this.vy = -10;
      this.onGround = false;
    }
  }

  display(p) {
    p.fill(255);
    p.ellipse(this.x, this.y - this.size / 2, this.size);
    p.fill(0);
    p.text(this.face, this.x, this.y - this.size / 2);
  }
}

class Ball {
  constructor(p) {
    this.x = p.width / 2;
    this.y = 100;
    this.vx = p.random([-3, 3]);
    this.vy = 2;
    this.radius = 20;
  }

  update(p) {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.3;

    if (this.x < this.radius || this.x > p.width - this.radius) {
      this.vx *= -1;
    }

    if (this.y > p.height) {
      this.reset(p);
    }
  }

  checkPlayerCollision(player, p) {
    let d = p.dist(this.x, this.y, player.x, player.y - player.size / 2);
    if (d < this.radius + player.size / 2 && this.vy > 0) {
      this.vy = -8;
      this.vx = (this.x - player.x) * 0.2;
      rallyCount++;
      lastHitTime = p.millis();
      message = p.random(["Nice hit!", "Great timing!", "Woo!", "One more!", "Nice set!"]);
    }
  }

  reset(p) {
    this.x = p.width / 2;
    this.y = 100;
    this.vx = p.random([-3, 3]);
    this.vy = 2;
    rallyCount = 0;
    message = "";
  }

  display(p) {
    p.fill(255, 200, 100);
    p.ellipse(this.x, this.y, this.radius * 2);
  }
}

function displayRally(p) {
  p.fill(50);
  p.text(`Rally: ${rallyCount}`, p.width / 2, 30);
  if (p.millis() - lastHitTime < 1500 && message) {
    p.text(message, p.width / 2, 60);
  }
}

new p5(sketch);