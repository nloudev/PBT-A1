// To run app in terminal: node chat.js <username> <roomname>

// npm install readline amqplib
const readline = require('readline');
const amqp = require('amqplib');

// stores terminal inputs into variables
const username = process.argv[2]; 
const roomName = process.argv[3];

async function startChat() {
                                                                                          // in terminal: docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
  const connection = await amqp.connect(`amqp://localhost:5672`);                         // connects to rabbitmq server created above
  const channel = await connection.createChannel();
  const exchangeName = 'room';

  await channel.assertExchange(exchangeName, 'topic', { durable: false });

  const { queue } = await channel.assertQueue('', { exclusive: true });
  channel.bindQueue(queue, exchangeName, roomName);                                       // routing key

  console.log(`[Room: ${roomName}] - [${username}] Connected to chat room`);

  channel.consume(queue, (message) => {                                                   // 'consumes' the message input in the queue, prevents overcrowding of data
    console.log(`[Room: ${message.fields.routingKey}] | ${message.content.toString()}`);  
  }, { noAck: true });                                                                    // noAck = auto acknowledge

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.on('line', (input) => {
    const message = `[${username}]: ${input}`;                                            // placed the username in the message variable so it can display the unique usernames, if placed in consume it only displays the username you created with other users messages
    channel.publish(exchangeName, roomName, Buffer.from(message));
  });  
}

startChat();
