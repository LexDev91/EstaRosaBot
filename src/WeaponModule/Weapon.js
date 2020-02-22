const { RichEmbed } = require('discord.js');
const fetch = require('node-fetch');
const getWeapons = require('./weaponData');
var stringSimilarity = require('string-similarity');
const S_ = require('../Utils/stringFunctions.js');

// Returns a list of all available monster indexs
const getWeaponStrings = () => {
  const weaponObjects = getWeapons();
  return weaponObjects.map(weapon => weapon.slug);
};

// Returns an array of strings that are similar to the command
const getWeaponSearchMatches = option => {
  let matches = stringSimilarity.findBestMatch(option, getWeaponStrings());
  let similarStrings = matches.ratings
    .map(match => (match.rating > 0.2 ? match.target : null))
    .filter(el => el != null);
  return similarStrings;
};

// Returns a bool of option validity
const checkOptionIsValid = option => {
  const validWeaponOptions = getWeaponStrings();
  return validWeaponOptions.includes(option.toLowerCase());
};

// Returns an embed with weapon details
const sendWeaponCard = async (option, message) => {
  // If the option is valid, we fire a call to the api to get the info
  const embed = await fetch(`https://api.open5e.com/weapons/${option}/`)
    // return the response as json
    .then(response => response.json())
    .then(json => {
      // Create a card to display the weapons information
      const embed = new RichEmbed()
        .setColor('#9e0404')
        .setTitle(`Weapon: ${json.name}`)
        .addField('Category:', json.category === '' ? 'None' : S_.CFL(json.category), true)
        .addField('Cost:', json.cost === '' ? 'None' : json.cost, true)
        .addField('weight:', json.weight === '' ? 'None' : json.weight, true)
        .addField('Damage Dice:', json.damage_dice === '' ? 'None' : json.damage_dice, true)
        .addField('Damage Type:', json.damage_type === '' ? 'None' : json.damage_type, true)
        .addField(
          'Properties:',
          json.properties.join(`, `) === '' ? 'None' : json.properties.join(`, `),
          true,
        );
      // Send the card to the server
      message.channel.send(embed);
    });
};

exports.getWeaponStrings = getWeaponStrings;
exports.getWeaponSearchMatches = getWeaponSearchMatches;
exports.checkOptionIsValid = checkOptionIsValid;
exports.sendWeaponCard = sendWeaponCard;
