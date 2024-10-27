import numpy as np
from concrete import fhe

class Server:
    def __init__(self):
        # Define the aggregation function that adds two weight vectors
        def aggregate_weights_function(w1, w2):
            return w1 + w2

        # Create a compiler for the aggregation function
        self.compiler = fhe.Compiler(
            aggregate_weights_function,
            {"w1": "encrypted", "w2": "encrypted"}
        )

        # Prepare an input set for compiling the circuit
        # Adjust the size based on your model's weight dimensions
        weight_size = 10  # Example size, adjust accordingly
        inputset = [
            (np.random.randint(-1000, 1000, size=(weight_size,)),
             np.random.randint(-1000, 1000, size=(weight_size,)))
            for _ in range(10)
        ]

        print("Compiling the aggregation circuit...")
        self.circuit = self.compiler.compile(inputset)

        print("Generating keys...")
        self.keyset = self.circuit.keygen()
        self.public_key = self.keyset  # To share with clients

    def aggregate_encrypted_weights(self, encrypted_weights_list):
        print("Aggregating encrypted weights...")
        # Initialize with the first encrypted weights
        aggregated_encrypted_weights = encrypted_weights_list[0]
        # Iteratively aggregate the rest of the encrypted weights
        for encrypted_weights in encrypted_weights_list[1:]:
            # Run the circuit to add the encrypted weights
            aggregated_encrypted_weights = self.circuit.run(
                aggregated_encrypted_weights, encrypted_weights
            )
        self.aggregated_encrypted_weights = aggregated_encrypted_weights

    def decrypt_and_average_weights(self, num_clients):
        print("Decrypting aggregated weights...")
        # Decrypt the aggregated encrypted weights
        aggregated_weights = self.circuit.decrypt(self.aggregated_encrypted_weights)
        # Average the weights
        self.aggregated_weights = aggregated_weights / num_clients
        return self.aggregated_weights

    def send_aggregated_weights(self):
        # Send the plaintext aggregated weights back to clients
        return self.aggregated_weights
