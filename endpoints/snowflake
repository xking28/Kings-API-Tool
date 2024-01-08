/**
 * @swagger
 * /snowflake/{snowflake}:
 *   get:
 *     summary: Return the creation date/time of any discord snowflake.
 *     tags: [Misc]
 *     description: Returns the creation date and time of a discord snowflake id in ISO 8601 format.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: snowflake
 *         in: path
 *         description: The ID of the snowflake
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
 *               description: ISO 1086 format
 *       400:
 *         description: Missing or invalid parameters
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Snowflake not found
 *       500:
 *         description: Internal server error
 */
const { SnowflakeUtil } = require('discord.js');

const snowflake = (req, res) => {
  console.log(req.params.snowflake); // The parameter name is fine
  const { snowflake: snowflakeParam } = req.params;
  try {
    const timestamp = SnowflakeUtil.deconstruct(snowflakeParam).timestamp;
    // Convert the BigInt timestamp to a Date and then to an ISO string
    const date = new Date(Number(timestamp));
    const isoTimestamp = date.toISOString();
    console.log(isoTimestamp);
    res.json({ createdAt: isoTimestamp }); // Changed to return ISO timestamp
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'Invalid snowflake provided.' });
  }
};

module.exports = snowflake;
