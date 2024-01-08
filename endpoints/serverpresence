/**
 * @swagger
 * /server-presence/{serverId}:
 *   get:
 *     summary: Get the total Online and Offline status of all users in a discord server.
 *     tags: [Discord]
 *     description: Get all user ids of all members who are online and offline, also get the total count.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: serverId
 *         in: path
 *         description: The ID of the Discord server
 *         required: true
 *         schema:
 *           type: string
 *           example: 1175149604845666304
 *     responses:
 *       200:
 *         description: Successful request
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               description: Online[Total], Offline[Total]
 *       400:
 *         description: Missing or invalid parameters
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Guild not found
 *       500:
 *         description: Internal server error
 */
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences] });

serverpresence = async (req, res) => {
  const botToken = req.header('Authorization');
  const serverId = req.params.serverId;
  console.log(serverId, botToken);
  if (!botToken || !serverId) {
    return res.status(400).send('Missing bot token or server ID');
  }

  try {
    await client.login(botToken.replace('Bot ', ''));
    console.log('Logged in successfully');

    const guild = await client.guilds.fetch(serverId);
    await guild.members.fetch();
    console.log('guild fecthed');

    const onlineUsers = [];
    const offlineUsers = [];
    guild.members.cache.forEach(member => {
      if (member.presence?.status === 'online') {
        onlineUsers.push({ userid: member.id, username: member.user.username });
      } else {
        offlineUsers.push({ userid: member.id, username: member.user.username });
      }
    });

    // Send the response and then destroy the client connection.
    res.json({
      online: {
        total: onlineUsers.length,
        users: onlineUsers
      },
      offline: {
        total: offlineUsers.length,
        users: offlineUsers
      }
    });

    // Now the client.destroy() and console.log calls are reachable.
    client.destroy();
    console.log('client destroyed');

  } catch (error) {
    console.log(error);
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
};

module.exports = serverpresence;
