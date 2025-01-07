// Získání kontextu plátna
var ctx = myCanvas.getContext('2d');

// Nastavení konstant a výchozích hodnot
var FPS = 40; // Snímek za sekundu
var jump_amount = -10; // Síla skoku
var max_fall_speed = +10; // Maximální rychlost pádu
var acceleration = 1; // Zrychlení
var pipe_speed = -2; // Rychlost trubek
var game_mode = 'prestart'; // Výchozí režim hry
var time_game_last_running; // Čas, kdy hra naposledy běžela
var bottom_bar_offset = 0; // Posun spodního baru
var pipes = []; // Pole trubek

// Konstruktor pro vytvoření obrázku s vlastnostmi
function MySprite(img_url) {
  this.x = 0;
  this.y = 0;
  this.visible = true;
  this.velocity_x = 0;
  this.velocity_y = 0;
  this.MyImg = new Image();
  this.MyImg.src = img_url || '';
  this.angle = 0;
  this.flipV = false;
  this.flipH = false;
}

// Metoda pro vykreslení a aktualizaci sprite v každém snímku
MySprite.prototype.Do_Frame_Things = function () {
  ctx.save();
  ctx.translate(this.x + this.MyImg.width / 2, this.y + this.MyImg.height / 2);
  ctx.rotate((this.angle * Math.PI) / 180);
  if (this.flipV) ctx.scale(1, -1);
  if (this.flipH) ctx.scale(-1, 1);
  if (this.visible)
    ctx.drawImage(this.MyImg, -this.MyImg.width / 2, -this.MyImg.height / 2);
  this.x = this.x + this.velocity_x;
  this.y = this.y + this.velocity_y;
  ctx.restore();
};

// Funkce pro kontrolu kolize dvou sprite
function ImagesTouching(thing1, thing2) {
  if (!thing1.visible || !thing2.visible) return false;
  if (
    thing1.x >= thing2.x + thing2.MyImg.width ||
    thing1.x + thing1.MyImg.width <= thing2.x
  )
    return false;
  if (
    thing1.y >= thing2.y + thing2.MyImg.height ||
    thing1.y + thing1.MyImg.height <= thing2.y
  )
    return false;
  return true;
}

// Funkce pro zpracování vstupu hráče
function Got_Player_Input(MyEvent) {
  switch (game_mode) {
    case 'prestart': {
      game_mode = 'running'; // Přepnutí hry do režimu běhu
      break;
    }
    case 'running': {
      bird.velocity_y = jump_amount; // Skok ptáka
      break;
    }
    case 'over':
      if (new Date() - time_game_last_running > 1000) {
        reset_game(); // Resetování hry
        game_mode = 'running'; // Přepnutí hry do režimu běhu
        break;
      }
  }
  MyEvent.preventDefault();
}

// Přidání posluchačů událostí pro vstup hráče
addEventListener('touchstart', Got_Player_Input);
addEventListener('mousedown', Got_Player_Input);
addEventListener('keydown', Got_Player_Input);

// Funkce pro zpomalení a pád ptáka
function make_bird_slow_and_fall() {
  if (bird.velocity_y < max_fall_speed) {
    bird.velocity_y = bird.velocity_y + acceleration;
  }
  if (bird.y > myCanvas.height - bird.MyImg.height) {
    bird.velocity_y = 0;
    game_mode = 'over'; // Přepnutí hry do režimu konce
  }
  if (bird.y < 0 - bird.MyImg.height) {
    bird.velocity_y = 0;
    game_mode = 'over'; // Přepnutí hry do režimu konce
  }
}

// Funkce pro přidání trubek do hry
function add_pipe(x_pos, top_of_gap, gap_width) {
  var top_pipe = new MySprite();
  top_pipe.MyImg = pipe_piece;
  top_pipe.x = x_pos;
  top_pipe.y = top_of_gap - pipe_piece.height;
  top_pipe.velocity_x = pipe_speed;
  pipes.push(top_pipe);

  var bottom_pipe = new MySprite();
  bottom_pipe.MyImg = pipe_piece;
  bottom_pipe.flipV = true;
  bottom_pipe.x = x_pos;
  bottom_pipe.y = top_of_gap + gap_width;
  bottom_pipe.velocity_x = pipe_speed;
  pipes.push(bottom_pipe);
}

// Funkce pro správné naklonění ptáka během letu
function make_bird_tilt_appropriately() {
  if (bird.velocity_y < 0) {
    bird.angle = -15;
  } else if (bird.angle < 70) {
    bird.angle = bird.angle + 4;
  }
}

// Funkce pro zobrazení všech trubek na plátně
function show_the_pipes() {
  for (var i = 0; i < pipes.length; i++) {
    pipes[i].Do_Frame_Things();
  }
}

// Funkce pro kontrolu konce hry při kolizi s trubkami
function check_for_end_game() {
  for (var i = 0; i < pipes.length; i++)
    if (ImagesTouching(bird, pipes[i])) game_mode = 'over';
}

// Funkce pro zobrazení úvodních instrukcí
function display_intro_instructions() {
  ctx.font = '25px Arial';
  ctx.fillStyle = 'red';
  ctx.textAlign = 'center';
  ctx.fillText('Klikni a hrej!', myCanvas.width / 2, myCanvas.height / 4);
}

// Funkce pro zobrazení obrazovky konce hry
function display_game_over() {
  var score = 0;
  for (var i = 0; i < pipes.length; i++)
    if (pipes[i].x < bird.x) score = score + 0.5;
  ctx.font = '30px Arial';
  ctx.fillStyle = 'red';
  ctx.textAlign = 'center';
  ctx.fillText('Konec hry', myCanvas.width / 2, 100);
  ctx.fillText('Skóre: ' + score, myCanvas.width / 2, 150);
  ctx.font = '20px Arial';
  ctx.fillText('Klikni, a hrej znovu!', myCanvas.width / 2, 300);
}

// Funkce pro zobrazení spodního běžícího baru
function display_bar_running_along_bottom() {
  if (bottom_bar_offset < -23) bottom_bar_offset = 0;
  ctx.drawImage(bottom_bar, bottom_bar_offset, myCanvas.height - bottom_bar.height);
}

// Funkce pro resetování hry
function reset_game() {
  bird.y = myCanvas.height / 2;
  bird.angle = 0;
  pipes = []; // Smazání všech trubek
  add_all_my_pipes(); // Přidání nových trubek po restartu
}

// Funkce pro přidání všech trubek do hry
function add_all_my_pipes() {
  add_pipe(500, 100, 140);
  add_pipe(800, 50, 140);
  add_pipe(1000, 250, 140);
  add_pipe(1200, 150, 120);
  add_pipe(1600, 100, 120);
  add_pipe(1800, 150, 120);
  add_pipe(2000, 200, 120);
  add_pipe(2200, 250, 120);
  add_pipe(2400, 30, 100);
  add_pipe(2700, 300, 100);
  add_pipe(3000, 100, 80);
  add_pipe(3300, 250, 80);
  add_pipe(3600, 50, 60);

  var finish_line = new MySprite('http://s2js.com/img/etc/flappyend.png');
  finish_line.x = 3900;
  finish_line.velocity_x = pipe_speed;
  pipes.push(finish_line);
}

// Načtení obrázku trubky a přidání trubek po načtení
var pipe_piece = new Image();
pipe_piece.onload = add_all_my_pipes;
pipe_piece.src = 'http://s2js.com/img/etc/flappypipe.png';

// Hlavní funkce pro vykreslení jednoho snímku hry
function Do_a_Frame() {
  ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
  bird.Do_Frame_Things();
  display_bar_running_along_bottom();

  switch (game_mode) {
    case 'prestart': {
      display_intro_instructions(); // Zobrazení úvodních instrukcí
      break;
    }
    case 'running': {
      time_game_last_running = new Date();
      bottom_bar_offset = bottom_bar_offset + pipe_speed;
      show_the_pipes(); // Zobrazení trubek
      make_bird_tilt_appropriately(); // Naklonění ptáka
      make_bird_slow_and_fall(); // Zpomalení a pád ptáka
      check_for_end_game(); // zkontrolovat konec hry
      break;
      }
      case 'over': {
      // zpomalit a nechat ptáka padat
      make_bird_slow_and_fall();
      // zobrazit obrazovku konce hry
      display_game_over();
      break;
      }
      }
      }
      var bottom_bar = new Image();
      bottom_bar.src = 'http://s2js.com/img/etc/flappybottom.png';

      var bird = new MySprite('http://s2js.com/img/etc/flappybird.png');
      bird.x = myCanvas.width / 3;
      bird.y = myCanvas.height / 2;

      // nastavit interval pro volání funkce Do_a_Frame každých 1000 / FPS milisekund
      setInterval(Do_a_Frame, 1000 / FPS);