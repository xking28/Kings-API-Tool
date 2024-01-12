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
const { joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnectionStatus, entersState, AudioPlayerStatus, StreamType } = require('@discordjs/voice');
const ffmpeg = require('fluent-ffmpeg'); // make sure to install this package

const playmp3 = async (req, res) => {
  const token = req.headers.authorization;
  const vcid = req.query.vcid;
  const serverid = req.query.serverid;
  const mp3Url = req.headers['mp3-url'];
  console.log(token, vcid, serverid, mp3Url);

  if (!token || !vcid || !serverid || !mp3Url) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

  try {
    await client.login(token);
    console.log('Logged in successfully');
    const guild = await client.guilds.fetch(serverid);
    console.log('Fetched guild successfully');
    const voiceChannel = await guild.channels.fetch(vcid);
    console.log('Fetched voice channel successfully');

    if (voiceChannel.type !== ChannelType.GuildVoice) {
      return res.status(400).json({ error: 'Not a voice channel' });
    }

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
    });
    console.log('Connected to voice channel successfully');

    await entersState(connection, VoiceConnectionStatus.Ready, 30e3);
    console.log('Connection ready successfully');

    const player = createAudioPlayer();

    // Convert the MP3 file to Opus format using FFmpeg
    const opusUrl = mp3Url.replace('.mp3', '.opus');
    ffmpeg(mp3Url)
      .outputOptions('-c:a libopus')
      .saveToFile(opusUrl)
      .on('end', () => {
        const resource = createAudioResource(opusUrl, {
          inputType: StreamType.Opus,
        });
        player.play(resource);
        connection.subscribe(player);
        console.log('Playing MP3 file successfully');

        player.on(AudioPlayerStatus.Playing, () => {
          res.json({ success: 'MP3 file is now playing' });
        });

        player.on(AudioPlayerStatus.Idle, () => {
          connection.destroy();
          client.destroy();
          console.log('MP3 file has finished playing');
        });
      });
        // Set a timeout to automatically destroy the client and disconnect after 1 hour 
      setTimeout(() => {
      if (connection.state.status !== VoiceConnectionStatus.Destroyed) {
        connection.destroy();
        client.destroy();
        console.log('Destroyed the client and disconnected from the voice channel after 1 hour of continuous play.');
      }
    }, 6000000); // 10 minutes in milliseconds
    // error handling
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to play MP3 file' });
  }
};

module.exports = playmp3;
