const {readFileSync} = require("fs");
const express = require('express');
const { ExpressPeerServer } = require('peer');
const app = express();
const server = require('https').createServer({
    key: readFileSync("./sslcert/key.pem"),
    cert: readFileSync("./sslcert/cert.pem")
},app);
const peerServer = ExpressPeerServer(server,{
    hostname: '/',
    port: 3001,
    debug: 3,
    key: 'blabber-chat'
});
peerServer.listen(3001);


