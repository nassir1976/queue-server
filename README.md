
# queue-server


- CAPS Phase 3: Complete work on a multi-day build of our delivery tracking system, adding queued delivery

In this phase, we’ll be adding a layer of complexity to our application. Rather than just “fire” events and hope that our vendors and drivers respond to them, we’re going to implement a “queue” system so that nothing gets lost. Every event sent will be logged and held onto by the server until the intended recipient acknowledges that they received the message. At any time, a subscriber can get all of the messages they might have missed.


### Phase 3 Requirements

- Build a set of applications to manage deliveries made by CAPS Drivers. This will simulate a delivery driver delivering a package and scanning the package code. Retailers will be able to see in their dashboard or log, a list of all packages delivered in real time. Should a delivery driver deliver many packages while the retailer is not connected to the dashboard, the retailer should be able to “catch up” and see a list of all missed events before resuming real-time monitoring.

##### Here are the high level stories related to this new set of requirements

- As a vendor, I want to “subscribe” to “delivered” notifications so that I know when my packages are delivered
- As a vendor, I want to “catch up” on any “delivered” notifications that I might have missed so that I can see a complete log
- As a driver, I want to “subscribe” to “pickup” notifications so that I know what packages to deliver
- As a driver, I want to “catch up” on any “pickup” notifications I may have missed so that I can deliver everything
- As a driver, I want a way to “scan” a delivery so that the vendors know when a package has been delivered
- And as developers, here are some of the development stories that are newly relevant to the above

- As a developer, I want to create a system of tracking who is subscribing to each event
- As a developer, I want to place all inbound messages into a “queue” so that my application knows what events are to be delivered
- As a developer, I want to create a system for communicating when events have been delivered and received by subscribers
- As a developer, I want to delete messages from the queue after they’ve been received by a subscriber, so that I don’t re-send them
- As a developer, I want to create a system for allowing subscribers to retrieve all undelivered messages in their queue


#### Technical Requirements / Notes

- High level view of the basic data/workflow for this application. Here are the base components we will need to build

### A Queue Server Hub that
- Keeps a log of the delivery, keyed by retailer and event type
- Broadcasts “Delivery Confirmations” to retailers

- Client (Vendor) Applications that retailers would run, which subscribe to the Queue so that they can be alerted when a delivery was made
   - When a client receives a message, it will need to let the hub server know that it was received
   - The hub server should then delete the message
- Client can ask for all undelivered messages from the server
  - Each of these would also need to be acknowledged upon receipt

#### Message Queue Server
- Create a new node application called queue-server
- Using socket.io, listen on your chosen port, in the ‘caps’ namespace
- Create an undelivered message queue for storing queued messages
i.e. an object, keyed by retailer and then by event name, then by message id
This could also be as simple as an simple array or as complex a real database, etc.

### Add an event handler for received
- When this event is heard on the server, assume it’s the client telling you they got a message
- The payload should include the client id, event name, and message id, so that you can delete it from the queue

### Add an event handler for getAll
- The payload should include the client id and event name
- When this event is heard on the server, find each of the messages in the queue for the client, for the event specified
- Go through each of the entries for the client/event in the queue (if any) and broadcast them to the client

### Add an event handler for package delivery: delivered
- This is our actual application logic (finally)
- When this event is triggered:
- Add the message immediately to the queue
- Broadcast the same event, with the following payload to all subscribers


### Testing
- Start all 3 servers
- Queue Server
- Both Client Application Servers
- Stop one of your applications servers
- Re-Send some requests to your queue
- This should leave some undelivered messages
- Re-Start the application server
- It should do an immediate request of all queued messages and log them out normally

