const express = require('express');
const swaggerui = require('swagger-ui-express');
const specs = require('./swagger.js');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3000;
async function Init() {

  const app = express();
  

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Endpoints
  const playmp3 = require('./endpoints/playmp3');
  const embedbuilder = require('./endpoints/embedbuilder');
  const checkfornum = require('./endpoints/checkfornum');
  const snowflake = require('./endpoints/snowflake');
  const serverpresence = require('./endpoints/serverpresence');
  const transcript = require('./endpoints/transcript');
  const lowercase = require('./endpoints/lowercase');
  const afk = require('./endpoints/afk');
  
  // POST requests
  app.post('/embed-builder/:channel_id', embedbuilder);
  app.post('/check-for-num', checkfornum);
  app.post('/lowercase', lowercase);

  // GET requests
  app.get('/play-mp3', playmp3);
  app.get('/snowflake/:snowflake', snowflake);
  app.get('/server-presence/:serverId', serverpresence);
  app.get('/transcript/:channelId', transcript);
  app.get('/afk', afk);

  // Use requests
  app.use('/docs', swaggerui.serve, swaggerui.setup(specs));
  app.use(express.static('public'));

  // Transcripts folder is being served statically
  app.use('/transcripts', express.static(path.join(__dirname, 'endpoints/transcripts')));

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
Init().catch(console.error);
