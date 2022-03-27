const fs = require('fs');
eval(fs.readFileSync('./Systems/Time/Event.js')+'');
//eval(fs.readFileSync('./Database/MongoInit.js')+'');
var cron = require('node-cron');
const { Client, Collection, Intents, MessageEmbed } = require('discord.js');
const { token } = require('./config.json');
const wait = require('util').promisify(setTimeout);
const discordClient = new Client({ intents:[Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// channelID's
const bug_testing_id = '941691022751182908';
const voting_id = '941470999508033636';

// send message in channel
function sendTimedMessageInChannel(channelID, message, time){
  discordClient.channels.cache.get(channelID).send(message).then(msg => setTimeout(() => msg.delete(), time));
}

// send embed in channel
function sendEmbedInChannel(channelID, embed){
  discordClient.channels.cache.get(channelID).send({embeds: [embed]});
}

// EventListener for Timed events
cron.schedule('* * * * *', () => {
  IncrementMinutes();
});

// get all localization variables
const info_embed_localization = require('./localization/info_embed.json');
const eloc = require('./localization/election_embed.json');
const election_file = require('./Systems/elections/election.json');
// embed declaration
const prep_embed = new MessageEmbed()
  .setColor('#ffb56b')
  .setTitle(eloc.prep_title)
  .setDescription(eloc.prep_desc)

const election_info_embed = new MessageEmbed()
  .setColor('#ffb56b')
  .setTitle('Info')
  .addFields(
    { name: 'Cantidate One', value: '<@' + election_file.cantidate1_ID + '>'  },
		{ name: 'Cantidate Two', value: '<@' + election_file.cantidate2_ID + '>' },
    { name: 'Cantidate Three', value: '<@' + election_file.cantidate3_ID + '>' },
    { name: 'Date', value: election_file.date_of_election },
	);
const basic_info_embed = new MessageEmbed()
  .setColor("#da82ff")
  .setTitle("Politics Experiment 101")
  .setDescription("Basic Information on the Government ")
  .addFields(
    { name: info_embed_localization.basic_info_embed_field_one_name, value: info_embed_localization.basic_info_embed_field_one_val },
		{ name: 'How can I join?', value: info_embed_localization.hcij_value },
	);
const goverment_info_embed = new MessageEmbed()
  .setColor("#fcacef")
  .setTitle("Government Info")
  .addFields(
    { name: 'Council', value: info_embed_localization.council_value },
		{ name: 'President', value: info_embed_localization.president_value },
    { name: 'Elections', value: info_embed_localization.election_value },
    { name: 'Start', value: info_embed_localization.start_value },
	);
const success_election_embed = new MessageEmbed()
  .setColor("#8cffab")
  .setTitle("Success!")
  .setDescription("Election Stage Started.");

discordClient.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	discordClient.commands.set(command.data.name, command);
}

discordClient.once('ready', () => {
	console.log("\x1b[31m%s\x1b[0m", 'PoliticalBot Loaded.');
  discordClient.user.setPresence({ game: { name: 'Politics', type: "watching"}}); 
  // starts event listener
  InitializeTimeData();
  // Connect MongoClient
  //MongoClientConnect();
});

discordClient.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = discordClient.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

discordClient.on('guildMemberAdd', (guildMember) => {
   guildMember.addRole(guildMember.guild.roles.find(role => role.name === "Unregistered Citizen"));
});

// select menu handler
discordClient.on('interactionCreate', async interaction => {
if(interaction.isSelectMenu()){
  let choice = interaction.values[0] 
    const member = interaction.member
     if(choice == 'basic_info_option'){
      await interaction.deferUpdate();
		  await wait(0);
      await interaction.editReply({embeds: [basic_info_embed]})}
     if(choice == 'goverment_option'){
       await interaction.deferUpdate();
       await wait(0);
       await interaction.editReply({embeds: [goverment_info_embed]});
     }
     }
if(interaction.isButton){
  const customId = interaction.customId;
  if(customId === "search"){
  }
  if(customId === "prep"){
    await interaction.message.delete();
    let msg = '<@&' + '941711066537291796' + '>'
    sendEmbedInChannel(voting_id, prep_embed)
    sendEmbedInChannel(voting_id, election_info_embed)
    sendTimedMessageInChannel(voting_id, msg , 1000);
  }
  if(customId === "speak"){
    
  }
  if(customId === "start"){
    await interaction.message.delete();
    
  }
}})

let success = discordClient.login(token)