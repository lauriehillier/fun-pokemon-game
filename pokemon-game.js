import input from "@inquirer/input";
import select, { Separator } from "@inquirer/select";
import confirm from "@inquirer/confirm";

class Pokemon {
  constructor(name, hitPoints, attackDamage, move = "tackle") {
    this.name = name;
    this.hitPoints = hitPoints;
    this.attackDamage = attackDamage;
    this.move = move;
  }
  takeDamage(num) {
    this.hitPoints -= num;
    if (this.hitPoints < 1) this.hitPoints = 0;
  }
  useMove() {
    console.log(`${this.name} used ${this.move}`);
    return this.attackDamage;
  }
  hasFainted() {
    return this.hitPoints === 0;
  }
  isEffectiveAgainst(secondPokemon) {
    if (this.type === "Water" && secondPokemon.type === "Fire") {
      return true;
    } else if (this.type === "Fire" && secondPokemon.type === "Grass") {
      return true;
    } else if (this.type === "Grass" && secondPokemon.type === "Water") {
      return true;
    } else {
      return false;
    }
  }
  isWeakTo(secondPokemon) {
    if (this.type === "Fire" && secondPokemon.type === "Water") {
      return true;
    } else if (this.type === "Grass" && secondPokemon.type === "Fire") {
      return true;
    } else if (this.type === "Water" && secondPokemon.type === "Grass") {
      return true;
    } else {
      return false;
    }
  }
}

class Fire extends Pokemon {
  constructor(name, hitPoints, attackDamage, move) {
    super(name, hitPoints, attackDamage, move);
    this.type = "Fire";
  }
}

class Water extends Pokemon {
  constructor(name, hitPoints, attackDamage, move) {
    super(name, hitPoints, attackDamage, move);
    this.type = "Water";
  }
}
class Grass extends Pokemon {
  constructor(name, hitPoints, attackDamage, move) {
    super(name, hitPoints, attackDamage, move);
    this.type = "Grass";
  }
}
class Normal extends Pokemon {
  constructor(name, hitPoints, attackDamage, move) {
    super(name, hitPoints, attackDamage, move);
    this.type = "Normal";
  }
}
class Charmander extends Fire {
  constructor(name, hitPoints, attackDamage, move) {
    super(name, hitPoints, attackDamage, "ember");
  }
}
class Squirtle extends Water {
  constructor(name, hitPoints, attackDamage, move) {
    super(name, hitPoints, attackDamage, "water gun");
  }
}
class Bulbasaur extends Grass {
  constructor(name, hitPoints, attackDamage, move) {
    super(name, hitPoints, attackDamage, "vine whip");
  }
}
class Rattata extends Normal {}

class Pokeball {
  constructor() {
    this.storage = "empty ...";
  }
  isEmpty() {
    if (this.storage === "empty ...") {
      return true;
    }
    return false;
  }
  contains() {
    if (this.isEmpty()) return this.storage;
    return this.storage.name;
  }
  throw(pokemon) {
    if (!pokemon) {
      if (this.isEmpty()) {
        console.log("There aren't pokemon inside this pokeball");
      } else {
        console.log(`GO ${this.storage.name}!!`);
      }
    } else {
      if (this.isEmpty()) {
        this.storage = pokemon;
        console.log(`you caught ${pokemon.name}`);
      }
      // else already a pokemon in here
    }
  }
}
class Trainer {
  constructor() {
    this.belt = [];
    this.name = "";
  }

  catch(pokemon) {
    let success = false;
    for (let i = 0; i < this.belt.length; i++) {
      if (this.belt[i].isEmpty()) {
        this.belt[i].throw(pokemon);
        success = !success;
      }
    }
    if (success === false) {
      return "The belt is full";
    }
  }
  getPokemon(pokemon) {
    for (let i = 0; i < this.belt.length; i++) {
      if (this.belt[i].storage.name === pokemon) {
        this.belt[i].throw();
      }
    }
  }
}

class Battle {
  constructor(firstTrainer, firstPokemon, secondTrainer, secondPokemon) {
    this.firstTrainer = firstTrainer;
    this.firstPokemon = firstPokemon;
    this.secondTrainer = secondTrainer;
    this.secondPokemon = secondPokemon;
    this.battleOver = false;
  }
  fight(attacker) {
    if (this.battleOver) {
      console.log("The battle is already over...");
      return;
    }
    let defender;
    if (attacker === this.firstPokemon) {
      defender = this.secondPokemon;
    } else {
      defender = this.firstPokemon;
    }
    this.attack(attacker, defender);
    if (defender.hasFainted()) {
      console.log(`${defender.name} fainted...`);
      if (attacker.name === this.firstPokemon) { 
        console.log(`${this.firstTrainer.name} defeated ${this.secondTrainer.name}!`);
      } else {
        console.log(`${this.secondTrainer.name} defeated ${this.firstTrainer.name}`);
      }
      
      this.battleOver = true;
    } else {
      this.fight(defender);
    }
  }
  attack(attacker, defender) {
    let damage = attacker.useMove();
    if (defender.isEffectiveAgainst(attacker)) {
      damage *= 0.75;
      console.log("It's not very effective...");
    } else if (defender.isWeakTo(attacker)) {
      damage *= 1.25;
      console.log("It's super effective!");
    }
    defender.takeDamage(Math.round(damage));
  }
}
const player1 = new Trainer();
const ashPokeball = new Pokeball();
player1.belt.push(ashPokeball);
const rival = new Trainer();
const rivalPokeball = new Pokeball();
rival.belt.push(rivalPokeball);

async function startGame() {
  await input({ message: "Hello there! Welcome to the world of Pokemon! ⏎" });
  await input({
    message: "My name is Oak. People call me the Pokemon Professor ⏎",
  });
  player1.name = await input({
    message: "First, what's your name?",
    default: "Ash",
  });
  await input({ message: `Right! so your name is ${player1.name} ⏎` });
  await input({
    message:
      "This is my grandson, he's been your rival since you were a baby ⏎",
  });
  rival.name = await input({
    message: "...Erm, what's his name again?",
    default: "Gary",
  });
  await input({
    message: `That's right! I remember now. His name is ${rival.name} ⏎`,
  });
  await input({
    message: "...the game starts, you try to leave, Oak calls you back... ⏎",
  });
  choosePokemon();
}
async function choosePokemon() {
  await input({
    message: "Oak: There are 3 Pokemon here! They are inside Pokeballs ⏎",
  });
  await input({ message: "Oak: You can choose one ⏎" });
  await input({ message: `${rival.name}: Hey! What about me? ⏎` });
  await input({
    message: `Oak: Be patient, ${rival.name}! You can have one too! ⏎`,
  });
  let answer = false;
  let startingPokemon;
  while (!answer) {
    startingPokemon = await select({
      message: `Oak: Okay, ${player1.name}. Which Pokemon would you like to choose?`,
      choices: [
        {
          value: "Charmander",
          description: "Charmander is a Fire Pokemon",
        },
        {
          value: "Bulbasaur",
          description: "Bulbasoar is a Grass Pokemon",
        },
        {
          value: "Squirtle",
          description: "Squirtle is a Water Pokemon",
        },
      ],
    });
    const answer = await confirm({
      message: `So! You want ${startingPokemon}? Are you sure?`,
    });
    if (answer) break;
  }
  let ashPokemon;
  if (startingPokemon === "Charmander") {
    ashPokemon = new Charmander("Charmander", 44, 17);
  } else if (startingPokemon === "Bulbasaur") {
    ashPokemon = new Bulbasaur("Bulbasaur", 45, 16);
  } else {
    ashPokemon = new Squirtle("Squirtle", 44, 16);
  }
  await input({ message: `${player1.name} received ${startingPokemon} ⏎` });
  const confirmNaming = await confirm({
    message: `Do you want to give ${startingPokemon} a name?`,
  });
  if (confirmNaming) {
    ashPokemon.name = await input({
      message: `What do you want to call your ${startingPokemon}?`,
      default: startingPokemon,
    });
  }
  player1.belt[0].storage = ashPokemon;
  await input({
    message: `Oak: Now, ${rival.name} you can choose your Pokemon ⏎`,
  });
  let rivalPokemon;
  if (startingPokemon === "Charmander") {
    rivalPokemon = new Squirtle("Squirtle", 44, 16);
  } else if (startingPokemon === "Bulbasaur") {
    rivalPokemon = new Charmander("Charmander", 44, 17);
  } else {
    rivalPokemon = new Bulbasaur("Bulbasaur", 45, 16);
  }
  await input({ message: `${rival.name} chose ${rivalPokemon.name} ⏎` });
  rival.belt[0].storage = rivalPokemon;
  await input({
    message: `${rival.name}: ${player1.name}! Let's check out our Pokemon! ⏎`,
  });
  await input({ message: `A battle begins... ⏎` });
  const firstBattle = new Battle(player1, ashPokemon, rival, rivalPokemon);
  firstBattle.fight(ashPokemon);
}

startGame();
