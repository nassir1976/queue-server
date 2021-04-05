
'use strict'; 

function eventPickup(payload){
  console.log(`EVENT: Order picked up from  ${payload.storeName}`);
}
//  function pickupReady

function eventIntransit(payload){
  console.log(`EVENT: OrderID:${payload.orderID} in-transit  FOR ${payload.customer},adress: ${payload.address}`);
}

function eventDelivered(payload){
  console.log(`EVENT: Order delivered to  ${payload.customer} in ${payload.address}`);
}


function driverPickup(payload){
  console.log(`DRIVER: Picked up order from ${payload.storeName} OrderID:${payload.orderID}`);
}

function driverDelivered(payload){
  console.log(`DRIVER: Delivered order to ${payload.customer}`)
}

function vendorDelivered(payload){
  console.log(`VENDOR: We Appreciate Your Bussiness ${payload.customer}!`);
}

module.exports = {
  eventPickup: eventPickup,
  eventIntransit: eventIntransit,
  eventDelivered: eventDelivered,
  driverPickup: driverPickup,
  driverDelivered: driverDelivered,
  vendorDelivered: vendorDelivered
}