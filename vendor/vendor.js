
'use strict';

const io = require('socket.io-client');
const faker = require('faker');
const events = require('../event.js');

const hostURL = 'http://localhost:3000/caps';
const socket = io.connect(hostURL);
require('dotenv').config({ path: '../.env' });
const store = process.env.STORE;
const store2 = process.env.STORE2;


setInterval(() => {
  let information = {
    storeName: '1-200-Flowers',
    orderID: faker.address.zipCode(),
    customer: faker.name.findName(),
    address: faker.address.streetAddress()

  };
  socket.emit('pickup', information)
}, 5000);

setInterval(() => {
  let information = {
    storeName: 'ACME Inc.',
    orderID: faker.address.zipCode(),
    customer: faker.name.firstName(),
    address: faker.address.streetAddress()

  };
  socket.emit('pickup', information)
}, 6000)

setInterval(() => {
  let information = {
    storeName: '1-200-Flowers.',
    orderID: faker.address.zipCode(),
    customer: faker.name.findName(),
    address: faker.address.streetAddress()

  };
  socket.emit('packageReady', information);
}, 3000);


socket.emit('getMessages');

socket.on('delivered', payload => {

  events.vendorDelivered(payload);
});
console.log('VENDOR LIVE')


