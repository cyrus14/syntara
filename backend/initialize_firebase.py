import firebase_admin
from firebase_admin import credentials


def initialize_firebase():
    cred = credentials.Certificate("backend/firebase-key.json")
    firebase_admin.initialize_app(cred, {
        'storageBucket': 'syntara-88cc3.appspot.com'
    })

initialize_firebase()