# PBT205—Project based Learning - Assessment 1

IN TERMINAL

SETUP:

npm init -y 

npm install express amqplib readline

*************************************

TO RUN:

node chat.js <username> <roomName>

or

node app.js

go to in browser:
http://localhost:___

enter details

*************************************

REPORT

## Project Team

- John-Louis Policarpio - Task 1: Chatting Application
- Hyung Kyu Lee - Task 2: Trading System
- Tauhid Ahmed - Task 3: Contact Tracing

*************************************

## Description

“Using a middle ware such as RabbitMQ with a Docker and running to enable the applications we develop to communicate with one another to demonstrate software engineering skills required in a software development team.”

Personally, using JavaScript (Node.js) I worked on the basic command-line chat application which allows multiple participants to join a chat room of their choice with unique user names. To do this I have set up middle ware called RabbitMQ through the docker that is separated into multiple abstractions.

1. *The server: listens to 5672 port by default
2. *Publisher: Establishes a TCP connection between itself and the server, two way communication. Tt uses Advanced Message Queue Protocol (AMQP) which is an open internet Protocol which is standard for message-queuing communications
3. *Consumer: Connects to a Bidirectional TCP connection with the server aswell. Server pushes publisher messages to the consumer
4. Channels: A mini connection to separate consumer connections from multiple consumers. Multiplexing - multiple things in one pipe
5. Queue: All information goes into a queue. This is where the consumer pulls information from. 
6. Exchange: Takes care of propagation into a queue, not too important currently

*************************************

chat.js:

Starts with calling the appropriate libraries, which are ‘require’ and ‘amqp’.

Line 8-9: Stores the terminal input into variables used in the startChat function.

Line 11 onwards: Startchat()

1. Starts with connecting to the created RabbitMQ server created using a docker.
2. Creating a channel that is essentially a mini TCP connection that only exists in the context of the main connection with the server. If the main connection is terminated, the channels will be as well
3. Creating a routing key which is essentially a relationship between the exchange and the queue. In this context, since messages never get sent directly to the queue, the messages go through an exchange which acts as a mediator. The exchange decides where the messages goes.
4. Consuming and acknowledging the message from the queue and displaying the routing key created (roomName)
5. Simple readline module that inputs and outputs the variables created using terminal inputs, in this case it is the username and the message the user inputted
6. Finally the publishing the message to multiple consumers

*************************************

index.html:

basic html structure that allows the user to input a username and room name to join a chat room of their choosing. The script tag uses an event listener to create a new eventsource that connects to the chat room with the given username and room name. After the onmessage event listener receives a message, it gets pushed into the chatlog by adding the content into the innerText of the chatlog element.

*************************************

app.js:

Is a modified version of chat.js utilising express routing. Using the express framework handles incoming HTTP requests, setting up and HTTP endpoint that listens for get requests. Where app.get is a method route is a request with appropriate query parameters.

*************************************

## Deliverables

### Expectation

Final Product

- Expose the chat application over a simple GUI interface in which multiple users can log in and

join a ‘room’ and begin chatting.

- Extend the application to allow for multiple rooms, so that a user can select the room they wish to join upon logging in.

*************************************

## Timeline

Have work Tues-Thurs:

- Understanding RabbitMQ and the libraries/modules needed for this task: 1-2 weeks
- Prototyping and trying different variations of the code: 1-2 weeks
- Assisting team with their code, writing my report and recording video: 1 week

*************************************

## Risks and Challenges

- The learning curve that comes with:
    - Learning a new application
        - RabbitMQ and the libraries
    - Making a GUI interface - first time using HTML

*************************************

## Success Criteria

- Try to get the best understanding of the correct tools needed as fast as possible.
- Search a lot and use as many resources as possible.
    - Youtube
    - W3Schools
    - Github
    - Google
- Assisting with your team as much as you can without taking from your own time
    - Communication
