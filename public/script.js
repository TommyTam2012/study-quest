// Study Quest: Stage 1 & 2 - Kaboom.js Game
// Updated with Stage 2: Distraction Dungeon

kaboom({
  global: true,
  fullscreen: true,
  scale: 1,
  clearColor: [0.8, 0.9, 1, 1],
});

// Load sprites
loadSprite("player", "https://i.imgur.com/Wb1qfhK.png");
loadSprite("friend", "https://i.imgur.com/ZKb5p3h.png");
loadSprite("goblin", "https://i.imgur.com/GcN6MdT.png"); // GameGoblin
loadSprite("boost", "https://i.imgur.com/4LGAZ8t.png");  // Focus Boost

let power = 0;
let hasFriend = false;

scene("stage1", () => {
  const player = add([
    sprite("player"),
    pos(50, 200),
    area(),
    body(),
  ]);

  add([text("Choose Your Path", { size: 24 }), pos(120, 20)]);

  add([rect(120, 40), pos(100, 100), color(0, 200, 0), area(), "power-path"]);
  add([text("Power Path\n+5 Power", { size: 12 }), pos(110, 110)]);

  add([rect(140, 40), pos(300, 100), color(0, 0, 255), area(), "friend-path"]);
  add([text("Rescue Friend\n+10 Power", { size: 12 }), pos(310, 110)]);

  const powerText = add([text("Power: 0", { size: 18 }), pos(20, 300)]);

  player.onUpdate(() => {
    if (player.pos.x > 500) player.move(0, 0);
  });

  player.onCollide("power-path", () => {
    destroyAll("power-path");
    power += 5;
    powerText.text = `Power: ${power}`;
    add([text("You chose power over friendship...", { size: 16 }), pos(100, 200)]);
    wait(2, () => go("stage2"));
  });

  player.onCollide("friend-path", () => {
    destroyAll("friend-path");
    power += 10;
    hasFriend = true;
    powerText.text = `Power: ${power}`;
    add([sprite("friend"), pos(350, 160), area()]);
    add([text("You saved your friend!", { size: 16 }), pos(280, 200)]);
    wait(2, () => go("stage2"));
  });

  onKeyDown("right", () => player.move(100, 0));
  onKeyDown("left", () => player.move(-100, 0));
});

scene("stage2", () => {
  setGravity(1200);
  let health = 3;

  const player = add([
    sprite("player"),
    pos(50, 0),
    area(),
    body(),
    "player"
  ]);

  const healthText = add([text("Health: 3", { size: 18 }), pos(20, 20)]);

  // Platforms
  add([rect(width(), 48), pos(0, height() - 48), area(), solid(), color(100, 100, 100)]);

  // Goblin Enemy
  const goblin = add([
    sprite("goblin"),
    pos(300, height() - 80),
    area(),
    body(),
    move(LEFT, 100),
    "enemy"
  ]);

  goblin.onUpdate(() => {
    if (goblin.pos.x <= 100 || goblin.pos.x >= width() - 100) {
      goblin.move(goblin.moveDir === LEFT ? RIGHT : LEFT, 100);
      goblin.moveDir = goblin.moveDir === LEFT ? RIGHT : LEFT;
    }
  });
  goblin.moveDir = LEFT;

  // Focus Boost
  add([
    sprite("boost"),
    pos(500, height() - 80),
    area(),
    "boost"
  ]);

  player.onCollide("enemy", () => {
    health--;
    healthText.text = `Health: ${health}`;
    if (health <= 0) {
      add([text("Game Over!", { size: 32 }), pos(center()), anchor("center"))]);
      destroy(player);
    }
  });

  player.onCollide("boost", (b) => {
    destroy(b);
    health++;
    healthText.text = `Health: ${health}`;
  });

  // Friend Bonus
  if (hasFriend) {
    add([sprite("friend"), pos(50, height() - 90), area()]);
    add([text("Your friend gives you courage!", { size: 14 }), pos(200, 40)]);
  }

  onKeyDown("right", () => player.move(200, 0));
  onKeyDown("left", () => player.move(-200, 0));
  onKeyPress("space", () => {
    if (player.isGrounded()) player.jump(600);
  });
});

go("stage1");
