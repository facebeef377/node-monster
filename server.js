//Init
const { Monsterek_Type, Monsterek } = require('./entities.js');
const express = require('express')
const webpush = require('web-push')
const cors = require('cors')
const http = require('http')
const WebSocket = require('ws')

const app = express(); 
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PUBLIC_VAPID = 'BNOJyTgwrEwK9lbetRcougxkRgLpPs1DX0YCfA5ZzXu4z9p_Et5EnvMja7MGfCqyFCY4FnFnJVICM4bMUcnrxWg';
const PRIVATE_VAPID = '_kRzHiscHBIGftfA7IehH9EA3RvBl8SBYhXBAMz6GrI';
webpush.setVapidDetails('mailto:you@domain.com', PUBLIC_VAPID, PRIVATE_VAPID);

server.listen(8080, () => {
    console.log("Server started!");
});
app.use(cors());
app.use(express.json());

var connections = [];
const fakeDatabase = [];

wss.on('connection', function connection(ws) {
    connections.push(ws);
    ws.on('message', function incoming(message) {
      console.log('received: %s', message);
    });
  
    ws.send('something');
  });

//API

app.get('/api/types/all',function(req, res) {
    Monsterek_Type.findAll().then(function(result){
        res.send(result);
    })
});

app.get('/api/all',function(req, res) {
    Monsterek.findAll().then(function(result){
        res.send(result);
    })
});

app.get('/api/addAlert',function(req, res) {
    Monsterek.create(req.body).then(function(result){
        res.send({"Status": "OK"});

        //SEND ALERT TO USERS
        connections.forEach(single_ws => {
            single_ws.send(req.body);
        });

    }).catch(function (err) {
        res.send({"Status": err.name});
    });
});

app.post('/subscription', (req, res) => {
    const subscription = req.body;
    fakeDatabase.push(subscription);
  });

  app.post('/sendNotification', (req, res) => {
    const notificationPayload = {
      notification: {
        title: 'New Notification',
        body: 'This is the body of the notification',
        icon: 'assets/icons/icon-512x512.png'
      }
    };
  
    const promises = [];
    fakeDatabase.forEach(subscription => {
      promises.push(webpush.sendNotification(subscription, JSON.stringify(notificationPayload)));
    });
    Promise.all(promises).then(() => res.sendStatus(200));
  });
