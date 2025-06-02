import p5 from "https://cdn.jsdelivr.net/npm/p5@1.11.3/+esm";

// Inject CSS to eliminate white bar and scroll
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

//variables
let thickness = 100;

document.head.appendChild(style);

const sketch = (p) => {
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.textAlign(p.CENTER, p.CENTER);
  };

  p.draw = () => {
    p.background (135, 206, 235);
    p.rect (0, p.height - thickness, p.width, thickness );
    p.fill (255, 200, 100)
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

new p5(sketch);