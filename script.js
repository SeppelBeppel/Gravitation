let sun;
let planets = [];
const N = 100;
const alpha = 0.05;

const G = 0.00001;

function Start() {
  console.log(
    "-----SONNENSYSTEM SIMULATION-----\n\n",
    "Planeten hinzuf\u00fcgen: Taste a\n",
    "Sonne mit Maus bewegen: Leertaste\n",
    "Animation schneller: Taste y\n",
    "Animation langsamer / anhalten: Taste x\n "
  );
  dj.createCanvas(FULL);
  dj.background(0);
  dj.bodyBackground(0);

  dj.setColorMode(HSL);

  sun = new Sun(MIDDLE, dj.vector.new(), 300000000, new ColorHSL(55, 90, 50));

  for (let i = 0; i < N; i++) addPlanet();

  dj.slower("x");
  dj.faster("y");
}

function Draw() {
  dj.background(0, 255 * alpha);

  for (let p of planets) {
    p.attract(sun);
    p.update();
  }

  sun.update();

  if (dj.mouse.down || dj.keyDown("a")) addPlanet();

  // dj.slower();
}

function addPlanet() {
  const pos = dj.vector.random(10, height * 0.6);
  planets.push(
    new Planet(
      dj.vector.add(MIDDLE, pos),
      pos
        .copy()
        .norm()
        .rotate(PI / 2)
        .setMag(dj.random(1, 10)),
      dj.random(40, 2000),
      new ColorHSL(dj.random(0, 360), dj.random(60, 90), dj.random(40, 70))
    )
  );
}

class Planet {
  constructor(pos, vel, m, color) {
    this.pos = pos;
    this.vel = vel;
    this.acc = dj.vector.new();
    this.m = m;
    this.r = dj.pow(this.m, 1 / 3) * 0.5;
    this.color = color;
  }

  update() {
    this.move();
    this.show();
  }

  move() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set();
    this.checkDistSun();
  }

  checkDistSun() {
    if (dj.dist(this.pos, sun.pos) < sun.r || this.pos.r > 10000)
      planets.splice(planets.indexOf(this), 1);
  }

  attract(body) {
    const diff = dj.vector.sub(body.pos, this.pos);
    const F = dj.vector.polar(
      (G * this.m * body.m) / dj.pow(diff.r, 2),
      diff.a
    );
    this.applyForce(F);
    body.applyForce(F.scl(-1));
  }

  applyForce(F) {
    this.acc.add(F.copy().div(this.m));
  }

  show() {
    dj.fill(this.color);
    dj.circle(this.pos.x, this.pos.y, this.r);
  }
}

class Sun extends Planet {
  constructor(pos, vel, mass, color) {
    super(pos, vel, mass, color);
    this.r *= 0.2;
  }

  move() {
    super.move();
    if (dj.keyDown(" ")) this.pos = dj.mouse.pos;
  }

  show() {
    dj.fill(this.color);
    dj.circle(this.pos.x, this.pos.y, this.r / 2);
  }

  checkDistSun() {
    return;
  }
}
