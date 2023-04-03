import pika
import uuid

# Establish connection to RabbitMQ broker
connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()

# Declare topics
channel.exchange_declare(exchange='orders', exchange_type='topic')
channel.exchange_declare(exchange='trades', exchange_type='topic')

# Define user input loop
while True:
    # Prompt user for order details
    print("Enter order details")
    username = input("Username : ")
    print("Company : XYZ Corp")
    while True:
        side = input("Side (BUY/SELL): ")
        if side == "buy" or side == "BUY" or side == "sell" or side == "SELL":
            print(side)
            break
        else:
            print("UNKNOWN")
         
    quantity = 100  # Fixed quantity for this assignment
    price = float(input("Price: $"))

    # Construct order message
    message = f"User name : {username}, XYZ Corp ,{side}, Quantity : {quantity}, Price at ${price}\n"

    # Generate unique correlation ID
    correlation_id = str(uuid.uuid4())

    # Publish order message to 'orders' topicx
    channel.basic_publish(
        exchange='orders',
        routing_key='trading',
        properties=pika.BasicProperties(
            reply_to='trades',
            correlation_id=correlation_id,
        ),
        body=message
    )

    # Print confirmation message
    print(f"Order sent: {message}")

# Close connection to RabbitMQ broker
connection.close()
