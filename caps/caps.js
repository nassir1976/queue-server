 'use strict';
const socketio = require('socket.io');

//opens up the server for connections
const io = socketio(3000);

//namespaces
const caps = io.of('/caps');

const orderQueue = {
  pickup: {},
  inTransit: {},
  delivered: {},
};

caps.on('connection', (socket) => {
  console.log('Socket connected: ', socket.id);

  socket.on('pickup', payload => {
    orderQueue.pickup[payload.messageId] = payload;

    console.log('EVENT:', payload);

    socket.broadcast.emit('pickup', payload);
  });

  socket.on('in-transit', payload => {
    orderQueue.inTransit[payload.messageId] = payload;

    console.log('EVENT', payload);

    socket.emit('in-transit', payload);
  });

  socket.on('received', payload => {
    delete orderQueue.pickup[payload.messageId];
    delete orderQueue.inTransit[payload.messageId];
    delete orderQueue.delivered[payload.messageId];

    socket.broadcast.emit('received', payload);
  });

  socket.on('getAll', () => {
    for(let key in orderQueue.pickup) {
      socket.emit('pickup', orderQueue.pickup[key]);
    }
    for(let key in orderQueue.inTransit) {
      socket.emit('in-transit', orderQueue.inTransit[key]);
    }
    for(let key in orderQueue.delivered) {
      socket.emit('delivered', orderQueue.delivered[key]);
    }
  });

  socket.on('delivered', payload => {
    orderQueue.delivered[payload.messageId] = payload;

    console.log('EVENT:', payload);

    socket.broadcast.emit('delivered', payload);
    caps.emit('delivered', { messageID: payload.messageId, payload: payload});
  });
});

console.log('CAPS LIVE');

