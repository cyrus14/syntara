import os
import base64
import json
import tempfile
import firebase_admin
from firebase_admin import credentials


def initialize_firebase():
    encoded_key = os.getenv("FIREBASE_KEY_BASE64")
    if not encoded_key:
        raise ValueError("Environment variable FIREBASE_KEY_BASE64 is not set")

    decoded_key = base64.b64decode(encoded_key)
    key_dict = json.loads(decoded_key)

    with tempfile.NamedTemporaryFile(mode="w+", delete=False) as temp:
        json.dump(key_dict, temp)
        temp.flush()

        cred = credentials.Certificate(temp.name)
        firebase_admin.initialize_app(cred, {
            'storageBucket': 'syntara-88cc3.appspot.com'
        })


initialize_firebase()
