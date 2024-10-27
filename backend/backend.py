from client import Client
from server import Server

if __name__ == "__main__":
    c1 = Client() 
    c1.upload_data("heart disease", "data/heart_data_1.csv")
    s = Server()
    data = c1.send_encrypted_data("heart disease")
    s.recieve_encrypted_data("heart disease", data)