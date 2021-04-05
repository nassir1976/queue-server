
'use strict';
const io = require('socket.io-client');

const hostURL = 'http://localhost:3000/caps';
const socket = io.connect(hostURL);
const events = require('../event.js');


socket.on('pickup', payload => {
    setTimeout(() => {
      events.driverPickup(payload);
      socket.emit('in-transit', payload);
    }, 1500)
  });


socket.on('pickup', payload => {
  setTimeout(() => {
    events.driverDelivered(payload);
    socket.emit('delivered', payload);
  }, 4000)
});

socket.on('packageReady', payload => {

  console.log(payload);
  socket.emit('received', payload);
});
socket.on('getMessages', () => {
  for (let key in orderQueue.sent) {

    socket.emit('packageReady', orderQueue.sent[key]);
  }
});

console.log('DRIVER LIVE');

