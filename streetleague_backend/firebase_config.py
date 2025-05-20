# streetleague_backend/streetleague_backend/firebase_config.py
import firebase_admin
from firebase_admin import credentials, firestore
import os

# Go one level up from the current file to find the JSON in the parent directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
cred_path = os.path.join(BASE_DIR, 'firechats-57dba-firebase-adminsdk-fbsvc-cc1cee5457.json')

# Initialize Firebase
if not firebase_admin._apps:
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()
