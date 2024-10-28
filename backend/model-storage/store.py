import sqlite3

with open('logistic_model.joblib', 'rb') as file:
    model_data = file.read()

conn = sqlite3.connect('models.db')
cursor = conn.cursor()

cursor.execute('''CREATE TABLE IF NOT EXISTS models (name TEXT, model BLOB)''')

cursor.execute('''INSERT INTO models (name, model) VALUES (?, ?)''',
               ('logistic_model', model_data))
conn.commit()
conn.close()
