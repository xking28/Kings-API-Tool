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
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  VoiceConnectionStatus,
  entersState,
  AudioPlayerStatus,
  StreamType,
} = require('@discordjs/voice');
const prism = require('prism-media');
const ShortUniqueId = require('short-unique-id');

// Map to store bot sessions and their queues
const botSessions = new Map();

const playmp3 = async (req, res) => {
  const token = req.headers.authorization;
  const vcid = req.query.vcid;
  const serverid = req.query.serverid;
  const mp3Url = req.headers['mp3-url'];
  const sessionId = req.headers['session-id'];

  if (!token || !vcid || !serverid || !mp3Url) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

  try {
    await client.login(token);
    const guild = await client.guilds.fetch(serverid);
    const voiceChannel = await guild.channels.fetch(vcid);

    if (voiceChannel.type !== ChannelType.GuildVoice) {
      return res.status(400).json({ error: 'Not a voice channel' });
    }

    if (!sessionId) {
      if (botSessions.has(guild.id)) {
        return res.status(400).json({ error: 'Bot is already connected, session ID required' });
      }

      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
      });

      await entersState(connection, VoiceConnectionStatus.Ready, 30e3);

      const player = createAudioPlayer();

      // Generate a unique session ID
      const uid = new ShortUniqueId();
      const newSessionId = uid.randomUUID(15);

      // Store the session ID, player, and queue in the map
      botSessions.set(newSessionId, { player, queue: [], connection });

      // Play the MP3 URL
      playSong(newSessionId, mp3Url);

      player.on(AudioPlayerStatus.Idle, () => {
        // When the player is idle, play the next song in the queue
        const session = botSessions.get(newSessionId);
        if (session.queue.length > 0) {
          const nextTrack = session.queue.shift();
          playSong(newSessionId, nextTrack);
        } else {
          connection.destroy();
          client.destroy();
          botSessions.delete(newSessionId);
        }
      });

      res.json({ success: 'MP3 file is now playing', sessionId: newSessionId });
    } else {
      if (botSessions.has(sessionId)) {
        const session = botSessions.get(sessionId);
        session.queue.push(mp3Url);
        res.json({ success: 'Song added to queue', queueLength: session.queue.length });
      } else {
        res.status(404).json({ error: 'Session not found' });
      }
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to play MP3 file' });
  }
};

function playSong(sessionId, mp3Url) {
  const session = botSessions.get(sessionId);
  const player = session.player;
  const input = new prism.FFmpeg({
    args: [
      '-analyzeduration', '0',
      '-loglevel', '0',
      '-f', 'mp3',
      '-i', mp3Url,
      '-acodec', 'libopus',
      '-ab', '35k',
      '-ar', '44100',
      '-ac', '2',
      '-f', 'opus',
    ],
  });

  const resource = createAudioResource(input, {
    inputType: StreamType.OggOpus,
  });

  player.play(resource);
  session.connection.subscribe(player);
}

module.exports = playmp3;
