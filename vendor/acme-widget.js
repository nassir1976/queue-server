 'use strict';


const store = 'acme-widgets';
const faker = require('faker');
const io = require('socket.io-client');
const capsURL = 'http://localhost:3000/caps';

const socket = io.connect(capsURL);

socket.emit('getAll');

setInterval(() => {
  socket.emit('pickup', {
    event: 'pickup',
    time: Date(),
    clientId: store,
    messageId: faker.address.zipCode(),
    order: {
      orderId: faker.address.zipCode(),
      name: faker.name.findName(),
      address: `${faker.address.streetAddress()}, ${faker.address.city()}, ${faker.address.state()} ${faker.address.zipCode()}`,
    },
  });
}, 5000);


socket.on('delivered', (payload) => {

  if(payload.clientId === store){
    socket.emit('received', payload);
    console.log(`Widgets were delivered - ${payload.order.orderId}`);
  }

});
  
console.log('Acme-Widget LIVE')