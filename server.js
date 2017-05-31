// server.js

const express = require('express');
const SocketServer = require('ws').Server;
const uuidV1 = require('uuid/v1') //generate aV! UUID (time based)

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.

wss.on('connection', (client, req) => {
  console.log('Client connected');

  //helper function to broadcast messages
  const broadcast = (msg) => {
    wss.clients.forEach((c) => {
      if(c != client) {
        c.send(JSON.stringify(msg));
      }
    })
  }

  client.on('message', (msg) => {
    msgData = JSON.parse(msg)
    switch(msgData.type){
      case "postMessage":
        //handles message
        msgData['key'] = uuidV1();
        msgData['type'] = "incomingMessage" //change type for broadcast
        broadcast(msgData)
        break;
      case "postNotification":
        //handles notification
        msgData['type'] = 'incomingNotification'
        broadcast(msgData);
      break;
      default:
      //if unknown type
      throw new Error("Unknown event type" + data.type)
  }
  })

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  client.on('close', () => console.log('Client disconnected'));

});