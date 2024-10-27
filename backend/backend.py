from client import Client
from server import Server

if __name__ == "__main__":
    num_clients = 2

    # Initialize the server and get the public key
    server = Server()
    public_key = server.public_key

    # Initialize clients with the public key
    client1 = Client("data/heart_data_1.csv", public_key)
    client2 = Client("data/heart_data_2.csv", public_key)

    # Clients send encrypted weights to the server
    encrypted_weights1 = client1.send_encrypted_weights()
    encrypted_weights2 = client2.send_encrypted_weights()

    # Server aggregates the encrypted weights
    encrypted_weights_list = [encrypted_weights1, encrypted_weights2]
    server.aggregate_encrypted_weights(encrypted_weights_list)

    # Server decrypts and averages the weights
    aggregated_weights = server.decrypt_and_average_weights(num_clients=num_clients)

    print("Aggregated weights (scaled):", aggregated_weights)

    # Clients can update their models with the new weights
    scaling_factor = 1000  # Same as used during encryption
    updated_weights = aggregated_weights / scaling_factor
    client1.model.coef_ = updated_weights.reshape(1, -1)
    client2.model.coef_ = updated_weights.reshape(1, -1)
