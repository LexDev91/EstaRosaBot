const { Client } = require('discord.js');
const config = require('./config.js');
// Import our Modules
const Args = require('./src/Arguments/Arg');
const Monster = require('./src/MonsterModule/Monster');
const Weapon = require('./src/WeaponModule/Weapon');

const client = new Client();
const prefix = config.prefix;

// Fire to the console when ready
client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', async message => {
  // If not talking to the bot or the bot is talking
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  // If the message is for Hammal we break it down
  const args = message.content.slice(prefix.length + 1).split(/ +/);
  // After removing the prefix and splitting to an array the first item is our command
  // Available commands: show
  const command = args.shift().toLowerCase();
  // If command isn't valid tell the user
  if (!Args.isCommandValid(command)) {
    message.channel.send(
      "Hi adventurer! I'm sorry, I didnt understand that command. Did you mean: show?",
    );

    return;
  }
  // After command we get the type, different commands have different types
  // Available types:
  // show: monster, weapon
  let type;
  if (args.length > 0) {
    type = args.shift().toLowerCase();
  } else {
    type = '';
  }

  // If type isn't valid tell the user
  if (!Args.isTypeValid(command, type)) {
    message.channel.send(
      `Hi adventurer! I'm sorry, I didnt understand that type. The command '${command}' has these types: ${Args.validTypes[
        command
      ].join(', ')}`,
    );

    return;
  }
  // After the type we rejoin the array to get the option text
  const option = args.join(' ');

  // If the user asked for help
  if (command === 'help') {
    message.channel.send("Hi adventurer! I'm here to help, you can give me commands, try: show.");
  }

  // COMMAND LEVEL CHECK
  // COMMAND: show
  // The show command returns info cards on various subjects
  if (command === 'show') {
    // TYPE LEVEL CHECK
    // TYPE: monster : Show a card with monster stats
    if (type === 'monster') {
      // This command requires an option, there are too many options to return a list, so we have to le the user know to try something
      if (!option || option === ' ' || option === '') {
        message.channel.send(
          'Hey Adventurer, there are lots of monsters on EstaRosa, try adding their name like this: dust-mephit, adult-gold-dragon',
        );
      } else {
        // If the user has provided an option we check if its valid
        if (!Monster.checkOptionIsValid(option)) {
          // If the option is not valid we send a message with options that are similar
          const similarOptions = Monster.getMonsterSearchMatches(option);
          message.channel.send(
            `Hey Adventurer, I don't recognise that monster, did you ${
              similarOptions.length > 0 ? 'mean one of these:' : 'mean:'
            } ${similarOptions.join(', ')}?`,
          );
          return;
        }
        // The User has provided a valid Monster option
        // Send the Monster Card to the server
        Monster.sendMonsterCard(option, message);
      }
    }
    //
    //
    // TYPE LEVEL CHECK
    // TYPE: weappon : Show a card with weapon stats
    if (type === 'weapon') {
      // This command requires an option, there are too many options to return a list, so we have to le the user know to try something
      if (!option || option === ' ' || option === '') {
        message.channel.send(
          'Hey Adventurer, there are lots of weapons on EstaRosa, try adding their name like this: handaxe, glaive',
        );
      } else {
        // If the user has provided an option we check if its valid
        if (!Weapon.checkOptionIsValid(option)) {
          // If the option is not valid we send a message with options that are similar
          const similarOptions = Weapon.getWeaponSearchMatches(option);
          message.channel.send(
            `Hey Adventurer, I don't recognise that weapon, did you ${
              similarOptions.length > 0 ? 'mean one of these:' : 'mean:'
            } ${similarOptions.join(', ')}?`,
          );
          return;
        }
        // The User has provided a valid Weapon option
        // Send the Weapon Card to the server
        Weapon.sendWeaponCard(option, message);
      }
    }
  }
});

client.login(config.token);
