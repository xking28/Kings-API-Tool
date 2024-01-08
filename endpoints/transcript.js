/**
 * @swagger
 * /transcript/{channelId}:
 *   get:
 *     summary: Return a transcript of a channel - Max 200 messages
 *     tags: [Discord]
 *     description: Return a transcript url of a specified channel
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: channelId
 *         in: path
 *         description: The ID of the Discord channel
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
 *               description: url
 *       400:
 *         description: Missing or invalid parameters
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Channel not found
 *       500:
 *         description: Internal server error
 */
const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
const { createTranscript } = require('discord-html-transcripts'); // Assuming this is the correct package name
const path = require('path');
const fs = require('fs');

const transcript = async (req, res) => {
    const botToken = req.headers.authorization;
    const channelId = req.params.channelId;

    if (!botToken) {
        return res.status(401).json({ error: 'Bot token is required' });
    }
    if (!channelId) {
        return res.status(400).json({ error: 'Channel ID is required' });
    }

    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent
        ]
    });

    try {
        await client.login(botToken);

        const channel = await client.channels.fetch(channelId);

        if (channel.type !== ChannelType.GuildText) {
            return res.status(400).json({ error: 'Channel must be a text-based channel' });
        }

        const transcript = await createTranscript(channel, {
            limit: 200, // Adjust the limit as needed
            returnType: 'buffer',
            footerText: `${client.user.tag} • Exported {number} message{s}`,
            poweredBy: false,
            hydrate: true
          
            
            

        });

        // Save the transcript to a file in the "endpoints/transcripts" directory
        const filename = `transcript-${channelId}.html`;
        const filepath = path.join(__dirname, 'transcripts', filename);
        fs.writeFileSync(filepath, transcript);


        // Return the transcript file URL in the API response
        res.json({ url: `${req.protocol}://${req.get('host')}/transcripts/${filename}` });

        // Set up automatic deletion after 7 days
        setTimeout(() => {
            fs.unlinkSync(filepath);
            console.log(`Transcript ${filename} has been automatically deleted.`);
        }, 7 * 24 * 60 * 60 * 1000);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while generating the transcript' });
    } finally {
        client.destroy();
    }
};

module.exports = transcript;
