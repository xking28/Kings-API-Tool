/**
 * @swagger
 * /play-mp3:
 *   get:
 *     summary: Play a MP3 file through a discord voice channel
 *     tags: [Music]
 *     description: Play a MP3 file using a direct mp3 link to play through your discord bot.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: serverid
 *         in: query
 *         description: The ID of the Discord server
 *         required: true
 *         schema:
 *           type: string
 *           example: 1175149604845666304
 *       - name: vcid
 *         in: query
 *         description: The ID of the Voice Channel
 *         required: true
 *         schema:
 *           type: string
 *           example: 1186872827480129598
 *       - name: mp3-url
 *         in: header
 *         description: The direct url to MP3 file
 *         required: true
 *         schema:
 *           type: string
 *           example: http//examplemp3file.mp3
 *     responses:
 *       200:
 *         description: Successful request
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               description: Mp3 file has started playing
 *       400:
 *         description: Missing or invalid parameters
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Guild not found
 *       500:
 *         description: Internal server error
 */

const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnectionStatus, entersState, AudioPlayerStatus } = require('@discordjs/voice');

// the api endpoint with headers, and querys 
const playmp3 = async (req, res) => {
  const token = req.headers.authorization;
  const vcid = req.query.vcid;
  const serverid = req.query.serverid;
  const mp3Url = req.headers['mp3-url'];
  console.log(token, vcid, serverid, mp3Url);
// check if the required perameters have been provided
  if (!token || !vcid || !serverid || !mp3Url) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }
// create a new Discord client
  const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
// log into client with provided token from header and fetch the guild and voice channel
  try {
    await client.login(token);
    console.log('Logged in successfully');
    const guild = await client.guilds.fetch(serverid);
    console.log('Fetched guild successfully');
    const voiceChannel = await guild.channels.fetch(vcid);
    console.log('Fetched voice channel successfully');
// check if the voice channel is a voice channel
// if the voice channel is not a voice channel, return an error
    if (voiceChannel.type !== ChannelType.GuildVoice) {
      return res.status(400).json({ error: 'Not a voice channel' });
    }
// have the client connect to the voice channel 
    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
    });
    console.log('Connected to voice channel successfully');
// wait for the connection to be ready
    await entersState(connection, VoiceConnectionStatus.Ready, 30e3);
    console.log('Connection ready successfully');
// create an audio player and play the MP3 file
    const player = createAudioPlayer();
    const resource = createAudioResource(mp3Url);
    player.play(resource);
    connection.subscribe(player);
    console.log('Playing MP3 file successfully');

// check if the audio is playing and return the status
    player.on(AudioPlayerStatus.Playing, () => {
      res.json({ success: 'MP3 file is now playing', duration: resource.playbackDuration  });;
    });
// check once the audio has finished playing and disconnect from the voice channel
    player.on(AudioPlayerStatus.Idle, () => {
      connection.destroy();
      client.destroy();
      console.log('MP3 file has finished playing');
    });;

    player.play(resource);
    connection.subscribe(player);

    // Set a timeout to automatically destroy the client and disconnect after 1 hour 
    setTimeout(() => {
      if (connection.state.status !== VoiceConnectionStatus.Destroyed) {
        connection.destroy();
        client.destroy();
        console.log('Destroyed the client and disconnected from the voice channel after 1 hour of continuous play.');
      }
    }, 3600000); // 1 hour in milliseconds
// error handling
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to play MP3 file' });
  }
};


module.exports = playmp3;
