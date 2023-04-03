//to run app: node app.js, then navigate to the localhost

// npm install express
const express = require('express');
const readline = require('readline');
const amqp = require('amqplib');

const app = express();
const port = process.env.PORT || 3005;

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Start the chat
app.get('/chat', async (req, res) => {
  const { username, roomName } = req.query;

  const connection = await amqp.connect(`amqp://localhost:5672`);
  const channel = await connection.createChannel();
  const exchangeName = 'room';

  await channel.assertExchange(exchangeName, 'topic', { durable: false });

  const { queue } = await channel.assertQueue('', { exclusive: true });
  channel.bindQueue(queue, exchangeName, roomName);

  console.log(`[Room: ${roomName}] - [${username}] Connected to chat room`);

  channel.consume(queue, (message) => {
    console.log(`[Room: ${message.fields.routingKey}] | ${message.content.toString()}`);
    res.write(`[Room: ${message.fields.routingKey}] | ${message.content.toString()}\n`);
  }, { noAck: true });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.on('line', (input) => {
    const message = `[${username}]: ${input}`;
    channel.publish(exchangeName, roomName, Buffer.from(message));
  });
});

app.listen(port, () => {
  console.log(`Chat app listening at http://localhost:${port}`);
});
