/**
 * @swagger
 * /check-for-num:
 *   post:
 *     summary: Check for a number within a string
 *     tags: [Text]
 *     description: Check a string for a number, if one is found return the number.
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 description: The text to search within for a number
 *                 example: Hello, World! 123
 *     responses:
 *       200:
 *         description: Successful request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 containsNumber:
 *                   type: boolean
 *                   description: The resulting text
 *                 number:
 *                   type: integer
 *                   description: The number found
 *       400:
 *         description: Missing or invalid parameters
 *       500:
 *         description: Error in request
 */

checkfornum = async (req, res) => {
  const { text } = req.body;
  const match = text.match(/\d+/);

  if (match) {
    res.json({ containsNumber: true, number: match[0] });
  } else {
    res.json({ containsNumber: false });
  }
};

module.exports = checkfornum;
