kaboom({
  global: true,
  fullscreen: true,
  scale: 1,
  clearColor: [0.8, 0.9, 1, 1],
});

// Load sprites
loadSprite("player", "https://i.imgur.com/Wb1qfhK.png");
loadSprite("friend", "https://i.imgur.com/ZKb5p3h.png");

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

  let power = 0;
  const powerText = add([text("Power: 0", { size: 18 }), pos(20, 300)]);

  player.onUpdate(() => {
    if (player.pos.x > 500) player.move(0, 0);
  });

  player.onCollide("power-path", () => {
    destroyAll("power-path");
    power += 5;
    powerText.text = `Power: ${power}`;
    add([text("You chose power over friendship...", { size: 16 }), pos(100, 200)]);
  });

  player.onCollide("friend-path", () => {
    destroyAll("friend-path");
    power += 10;
    powerText.text = `Power: ${power}`;
    add([sprite("friend"), pos(350, 160), area()]);
    add([text("You saved your friend!", { size: 16 }), pos(280, 200)]);
  });

  onKeyDown("right", () => player.move(100, 0));
  onKeyDown("left", () => player.move(-100, 0));
});

go("stage1");
