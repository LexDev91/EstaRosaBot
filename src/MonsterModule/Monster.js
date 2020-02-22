const { RichEmbed } = require('discord.js');
const fetch = require('node-fetch');
const getMonsters = require('./monsterData');
var stringSimilarity = require('string-similarity');
const S_ = require('../Utils/stringFunctions.js');

// Returns a list of all available monster indexs
const getMonsterStrings = () => {
  const monsterObjects = getMonsters();
  return monsterObjects.map(monster => monster.index);
};

// Returns an array of strings that are similar to the command
const getMonsterSearchMatches = option => {
  let matches = stringSimilarity.findBestMatch(option, getMonsterStrings());
  let similarStrings = matches.ratings
    .map(match => (match.rating > 0.2 ? match.target : null))
    .filter(el => el != null);
  return similarStrings;
};

// Returns a bool of option validity
const checkOptionIsValid = option => {
  const validMonsterOptions = getMonsterStrings();
  return validMonsterOptions.includes(option.toLowerCase());
};

// Returns an embed with monster details
const sendMonsterCard = async (option, message) => {
  // If the option is valid, we fire a call to the api to get the info
  const embed = await fetch(`http://dnd5eapi.co/api/monsters/${option}/`)
    // return the response as json
    .then(response => response.json())
    .then(json => {
      // Create a card to display the monsters information
      const embed = new RichEmbed()
        .setColor('#9e0404')
        .setTitle(`Monster: ${json.name}`)
        .setURL(`https://www.dndbeyond.com/monsters/${json.index}`)
        .addField('Type:', json.type === '' ? 'None' : S_.CFL(json.type), true)
        .addField('Sub Type:', json.subType === '' ? 'None' : S_.CFL(json.subType), true)
        .addBlankField(true)
        .addField('Alignment:', json.alignment === '' ? 'None' : S_.CFL(json.alignment), true)
        .addField(
          'Challenge Rating:',
          json.challenge_rating === '' ? 'None' : json.challenge_rating,
          true,
        )
        .addBlankField(true)
        .addBlankField()
        .addField('AC:', json.armor_class === '' ? 'None' : json.armor_class, true)
        .addField('HP:', json.hit_points === '' ? 'None' : json.hit_points, true)
        .addBlankField(true)
        .addField('STR:', json.strength === '' ? 'None' : json.strength, true)
        .addField('DEX:', json.dexterity === '' ? 'None' : json.dexterity, true)
        .addField('CON:', json.constitution === '' ? 'None' : json.constitution, true)
        .addField('INT:', json.intelligence === '' ? 'None' : json.intelligence, true)
        .addField('WIS:', json.wisdom === '' ? 'None' : json.wisdom, true)
        .addField('CHA:', json.charisma === '' ? 'None' : json.charisma, true)
        .addBlankField()
        .addField(
          'Vulnerabilities:',
          json.damage_vulnerabilities.join(`, `) === ''
            ? 'None'
            : json.damage_vulnerabilities.join(`, `),
        )
        .addField(
          'Resistances:',
          json.damage_resistances.join(`, `) === '' ? 'None' : json.damage_resistances.join(`, `),
        )
        .addField(
          'Immunities:',
          json.damage_immunities.join(`, `) === '' ? 'None' : json.damage_immunities.join(`, `),
          true,
        );
      // Send the card to the server
      message.channel.send(embed);
    });
};

exports.getMonsterStrings = getMonsterStrings;
exports.getMonsterSearchMatches = getMonsterSearchMatches;
exports.checkOptionIsValid = checkOptionIsValid;
exports.sendMonsterCard = sendMonsterCard;
