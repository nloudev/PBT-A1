import pika
import sys

endpoint = sys.argv[1]

# Create a connection to the RabbitMQ server
connection = pika.BlockingConnection(pika.ConnectionParameters(endpoint))
channel = connection.channel()

#connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
#channel = connection.channel()


channel.exchange_declare(exchange='orders', exchange_type='topic')
channel.exchange_declare(exchange='trades', exchange_type='topic')

result = channel.queue_declare(queue='trading', exclusive=True)
queue_name = result.method.queue

channel.queue_bind(exchange='orders', queue=queue_name, routing_key='#')

def on_receive_order(channel, method, properties, body):
    print("Received order:", body.decode())

channel.basic_consume(queue=queue_name, on_message_callback=on_receive_order, auto_ack=True)

print("Waiting for orders...")
channel.start_consuming()
