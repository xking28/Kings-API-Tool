const swaggerdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Kings API Tool',
      description: "`This API was made to enhance users discord bots made in Botghost.` `Expect bugs and crashes, new endpoints are still being added!`\n\n\n `If you have any questions or suggestion, contact me on discord:`  `xking28`",
      version: '1.0.0',
    },
    tags: [
      {
        name: 'Discord',
        description: 'These endpoints require a discord bot token to work. They use discord.js to interact with your bot.',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
          description: 'Discord Bot Token',
          valuePrefix: ''
        },
      },
    },
    servers: [
      {
        url: 'https://kings-api.xyz',
        description: 'Kings API Tool'
      }
    ],
  },
  apis: ['./endpoints/*.js'],
};

  const specs = swaggerdoc(options);

  module.exports = specs;
