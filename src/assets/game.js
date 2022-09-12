class Snake {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.tail = [{ x: this.x, y: this.y }];
    this.rotateX = 0;
    this.rotateY = 1;
  }

  move() {
    let newRect;
    if (this.rotateX === 1) {
      newRect = {
        x: this.tail[this.tail.length - 1].x + this.size,
        y: this.tail[this.tail.length - 1].y,
      };
    } else if (this.rotateX === -1) {
      newRect = {
        x: this.tail[this.tail.length - 1].x - this.size,
        y: this.tail[this.tail.length - 1].y,
      };
    } else if (this.rotateY === 1) {
      newRect = {
        x: this.tail[this.tail.length - 1].x,
        y: this.tail[this.tail.length - 1].y + this.size,
      };
    } else if (this.rotateY === -1) {
      newRect = {
        x: this.tail[this.tail.length - 1].x,
        y: this.tail[this.tail.length - 1].y - this.size,
      };
    }

    this.tail.shift();
    this.tail.push(newRect);
  }
}

class Apple {
  constructor() {
    var isTouching;
    while (true) {
      isTouching = false;
      this.x =
        Math.floor((Math.random() * canvas.width) / snake.size) * snake.size;
      this.y =
        Math.floor((Math.random() * canvas.height) / snake.size) * snake.size;
      for (let i = 0; i < snake.tail.length; i++) {
        if (this.x == snake.tail[i].x && this.y == snake.tail[i].y) {
          isTouching = true;
        }
      }
      this.size = snake.size;
      if (!isTouching) {
        break;
      }
      this.color = "#FF0800";
    }
  }
}

class Wall {
  constructor(x1, y1, x2, y2) {
    this.start = { x: x1, y: y1 };
    this.end = { x: x2, y: y2 };

    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }
}

const normalize = (val) => val - (val % 20);

const getWalls = () => {
  if (difficulty == 1) {
    walls = [
      new Wall(
        normalize(canvas.width / 5),
        normalize(canvas.height / 2),
        normalize((canvas.width / 5) * 2),
        normalize(canvas.height / 2) + 20
      ),
      new Wall(
        normalize((canvas.width / 5) * 3),
        normalize(canvas.height / 2),
        normalize((canvas.width / 5) * 4),
        normalize(canvas.height / 2) + 20
      ),
    ];
  } else if (difficulty == 2) {
    walls = [
      new Wall(
        normalize(canvas.width / 6),
        normalize(canvas.height / 6),
        normalize((canvas.width / 6) * 2),
        normalize(canvas.height / 6) + 20
      ),
      new Wall(
        normalize(canvas.width / 6),
        normalize(canvas.height / 6),
        normalize(canvas.width / 6) + 20,
        normalize((canvas.height / 6) * 2)
      ),
      new Wall(
        normalize((canvas.width / 6) * 4),
        normalize(canvas.height / 6),
        normalize((canvas.width / 6) * 5),
        normalize(canvas.height / 6) + 20
      ),
      new Wall(
        normalize((canvas.width / 6) * 5),
        normalize(canvas.height / 6),
        normalize((canvas.width / 6) * 5) + 20,
        normalize((canvas.height / 6) * 2)
      ),

      new Wall(
        normalize(canvas.width / 6),
        normalize((canvas.height / 6) * 5),
        normalize((canvas.width / 6) * 2),
        normalize((canvas.height / 6) * 5) + 20
      ),
      new Wall(
        normalize(canvas.width / 6),
        normalize((canvas.height / 6) * 4),
        normalize(canvas.width / 6) + 20,
        normalize((canvas.height / 6) * 5)
      ),
      new Wall(
        normalize((canvas.width / 6) * 4),
        normalize((canvas.height / 6) * 5),
        normalize((canvas.width / 6) * 5),
        normalize((canvas.height / 6) * 5) + 20
      ),
      new Wall(
        normalize((canvas.width / 6) * 5),
        normalize((canvas.height / 6) * 4),
        normalize((canvas.width / 6) * 5) + 20,
        normalize((canvas.height / 6) * 5) + 20
      ),
    ];
  }
};

const createRect = (x, y, width, height, color) => {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
};

const eatApple = () => {
  if (
    snake.tail[snake.tail.length - 1].x === apple.x &&
    snake.tail[snake.tail.length - 1].y === apple.y
  ) {
    snake.tail.unshift({ x: apple.x, y: apple.y });
    apple = new Apple();
  }
};

const endGame = () => {
  alert("Game Over!");
  clearInterval(loop);
  document.getElementById("score").innerText = snake.tail.length - 1;
  document.getElementById("game-over-modal").style.display = "block";
};

const checkWallHit = () => {
  for (let i = 0; i < walls.length; i++) {
    if (
      snake.tail[snake.tail.length - 1].x >= walls[i].start.x &&
      snake.tail[snake.tail.length - 1].x < walls[i].end.x &&
      snake.tail[snake.tail.length - 1].y >= walls[i].start.y &&
      snake.tail[snake.tail.length - 1].y < walls[i].end.y
    ) {
      endGame();
    }
  }
};

const checkOutOfBounds = () => {
  if (snake.tail[snake.tail.length - 1].x == -snake.size) {
    snake.tail[snake.tail.length - 1].x = canvas.width - snake.size;
  } else if (snake.tail[snake.tail.length - 1].x == canvas.width) {
    snake.tail[snake.tail.length - 1].x = 0;
  } else if (snake.tail[snake.tail.length - 1].y == -snake.size) {
    snake.tail[snake.tail.length - 1].y = canvas.height - snake.size;
  } else if (snake.tail[snake.tail.length - 1].y == canvas.height) {
    snake.tail[snake.tail.length - 1].y = 0;
  }
};

const checkSelfCollision = () => {
  if (snake.tail.length > new Set(snake.tail.map(JSON.stringify)).size) {
    endGame();
  }
};

const update = () => {
  snake.move();
  checkSelfCollision();
  checkWallHit();
  eatApple();
  checkOutOfBounds();
};

const draw = () => {
  // draw background
  createRect(0, 0, canvas.width, canvas.height, "black");
  createRect(0, 0, canvas.eidth, canvas.height);

  // draw wall
  walls.forEach((wall) => {
    createRect(wall.x1, wall.y1, wall.x2 - wall.x1, wall.y2 - wall.y1, "white");
  });

  // draw snake
  for (let i = 0; i < snake.tail.length; i++) {
    createRect(
      snake.tail[i].x + 2.5,
      snake.tail[i].y + 2.5,
      snake.size - 5,
      snake.size - 5,
      "white"
    );
  }

  ctx.font = "20px Arial";
  ctx.fillStyle = "green";
  ctx.fillText(`Score: ${snake.tail.length - 1}`, canvas.width - 120, 18);
  ctx.fillStyle = "red";
  createRect(apple.x, apple.y, apple.size, apple.size, apple.color);
};

const show = () => {
  update();
  draw();
};

const canvas = document.getElementById("game");
canvas.width = normalize(window.innerWidth);
canvas.height = normalize(window.innerHeight);

const ctx = canvas.getContext("2d");

var loop;
var difficulty;
var walls;

window.onload = () => {
  difficulty = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  })["difficulty"];
  difficulty ??= 0;

  getWalls();

  gameLoop();
};

const gameLoop = () => {
  loop = setInterval(() => {
    show();
  }, 1000 / 10);
};

document.getElementById("replay-button").addEventListener("click", () => {
  document.getElementById("game-over-modal").style.display = "none";
  snake = new Snake(0, 0, 20);
  apple = new Apple();
  gameLoop();
});

window.addEventListener("keydown", (e) => {
  if (e.keyCode == 37 && snake.rotateY != 0) {
    snake.rotateX = -1;
    snake.rotateY = 0;
  } else if (e.keyCode == 38 && snake.rotateX != 0) {
    snake.rotateX = 0;
    snake.rotateY = -1;
  } else if (e.keyCode == 39 && snake.rotateY != 0) {
    snake.rotateX = 1;
    snake.rotateY = 0;
  } else if (e.keyCode == 40 && snake.rotateX != 0) {
    snake.rotateX = 0;
    snake.rotateY = 1;
  }
});

var snake = new Snake(20, 20, 20);
var apple = new Apple();
