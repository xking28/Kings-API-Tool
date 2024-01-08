/**
 * @swagger
 * /embed-builder/{channel_id}:
 *   post:
 *     summary: Send a Discord embed to a specific channel
 *     tags: [Discord]
 *     description: Uses the discord api to send a embed message, makes creating embeds using the discord api much easier!
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: channel_id
 *         description: The channel id to send the embed to
 *         in: path
 *         required: true
 *         type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - channel_id
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the embed
 *                 example: Embed Title
 *               description:
 *                 type: string
 *                 description: The description of the embed
 *                 example: Embed Description
 *               url:
 *                 type: string
 *                 description: The url of the embed
 *                 example: Embed URL
 *               image_url:
 *                 type: string
 *                 description: The image url of the embed
 *                 example: Embed Image URL
 *               thumbnail_url:
 *                 type: string
 *                 description: The thumbnail url of the embed
 *                 example: Embed Thumbnail URL
 *               color:
 *                 type: inetger
 *                 description: The color of the embed
 *                 example: Embed Color
 *               footer_text:
 *                 type: string
 *                 description: The footer text of the embed
 *                 example: Embed Footer Text
 *               footer_icon:
 *                 type: string
 *                 description: The footer icon of the embed
 *                 example: Embed Footer Icon
 *               author_text:
 *                 type: string
 *                 description: The author text of the embed
 *                 example: Embed Author Text
 *               author_icon:
 *                 type: string
 *                 description: The author icon of the embed
 *                 example: Embed Author Icon
 *               author_url:
 *                 type: string
 *                 description: The author url of the embed
 *                 example: Embed Author URL
 *               timestamp:
 *                 type: string
 *                 description: The timestamp of the embed
 *                 example: Embed Timestamp
 *               content:
 *                 type: string
 *                 description: Plain message
 *                 example: Content
 *     responses:
 *       200:
 *         description: Successful request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *                   description: Embed sent successfully
 *                 messageid:
 *                   type: integer
 *                   description: The Discord message id of the embed
 *       400:
 *         description: Missing or invalid parameters
 *       500:
 *         description: Error in request
 */

const axios = require('axios');

embedbuilder = async (req, res) => {
  const { channel_id } = req.params;
  const {
    description,
    title,
    color,
    timestamp,
    url,
    footer_text,
    footer_icon,
    author_url,
    author_text,
    author_icon,
    image_url,
    thumbnail_url,
    content
  } = req.body;
  const authorization = req.header('Authorization');

  if (!description) {
    return res.status(400).json({ message: "Description is required." });
  }

  const embedData = {
    content: content,
    embeds: [{
      ...(title && { title }),
      description,
      ...(url && { url }),
      ...(timestamp && { timestamp }),
      ...(color && { color }),
      ...(footer_text || footer_icon ? {
        footer: {
          ...(footer_text && { text: footer_text }),
          ...(footer_icon && { icon_url: footer_icon })
        }
      } : {}),
      ...(author_text || author_icon || author_url ? {
        author: {
          ...(author_text && { name: author_text }),
          ...(author_icon && { icon_url: author_icon }),
          ...(author_url && { url: author_url })
        }
      } : {}),
      ...(image_url && { image: { url: image_url } }),
      ...(thumbnail_url && { thumbnail: { url: thumbnail_url } })
    }]
  };

  try {
    const response = await axios.post(`https://discord.com/api/v10/channels/${channel_id}/messages`, embedData, {
      headers: {
        'Authorization': authorization,
        'Content-Type': 'application/json'
      }
    });
    res.json({
      message: "Embed sent successfully.",
      message_id: response.data.id
    });
  } catch (error) {
    res.status(error.response?.status || 500).json({
      message: "Failed to send embed.",
      error: error.message
    });
  }
};

module.exports = embedbuilder;
