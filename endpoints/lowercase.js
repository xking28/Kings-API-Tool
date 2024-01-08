/**
 * @swagger
 * /lowercase:
 *   post:
 *     summary: Convert all letters to lowercase
 *     tags: [Text]
 *     description: Convert everything sent in the text parameter to lowercase.
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
 *                 description: The text to convert to lower case
 *                 example: Hello, World!
 *     responses:
 *       200:
 *         description: Successful request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 text_output:
 *                   type: string
 *                   description: The resulting text
 *       400:
 *         description: Missing or invalid parameters
 *       500:
 *         description: Error in request
 */

lowercase = async (req, res) => {
    const text = req.body.text;
    const output = text.toLowerCase();
    res.send({ 'text_output': output });
};

module.exports = lowercase;
