import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime, timedelta
from bson.objectid import ObjectId
from werkzeug.security import check_password_hash, generate_password_hash
import jwt
from functools import wraps

# --- DEBUG: Confirm MongoDB Atlas Connection ---
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
print("Loaded MONGO_URI:", MONGO_URI)
try:
    test_client = MongoClient(MONGO_URI)
    print("Databases:", test_client.list_database_names())
except Exception as e:
    print("Error connecting to MongoDB:", e)

# --- REAL App connection for API use ---
# In-memory storage for demo purposes (replace with MongoDB when connection is fixed)
feedback_storage = []
feedback_counter = 1

try:
    client = MongoClient(MONGO_URI, tlsAllowInvalidCertificates=True)
    db = client.get_database("FeedbackDB")
    feedback_collection = db.feedback
    print("Successfully connected to MongoDB!")
    use_mongodb = True
except Exception as e:
    print(f"MongoDB connection error: {e}")
    print("Using in-memory storage for demo purposes")
    client = None
    db = None
    feedback_collection = None
    use_mongodb = False

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-change-in-production')

# Admin credentials (in production, store in database with hashed passwords)
ADMIN_CREDENTIALS = {
    'admin': generate_password_hash('password123')
}

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token is invalid'}), 401
        
        return f(*args, **kwargs)
    return decorated

@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Customer Feedback System API is running!"})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400
    
    if username in ADMIN_CREDENTIALS and check_password_hash(ADMIN_CREDENTIALS[username], password):
        token = jwt.encode({
            'username': username,
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm='HS256')
        
        return jsonify({'access_token': token}), 200
    
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/feedback', methods=['POST'])
def submit_feedback():
    global feedback_counter
    
    data = request.get_json()
    if not all(k in data for k in ('product_id', 'rating', 'review_text', 'customer_name')):
        return jsonify({"error": "Missing required fields"}), 400
    try:
        rating_value = int(data['rating'])
        if not (1 <= rating_value <= 5):
            raise ValueError
    except:
        return jsonify({"error": "Rating must be an integer between 1 and 5"}), 400
    
    feedback_doc = {
        "_id": str(feedback_counter),
        "product_id": data['product_id'],
        "rating": rating_value,
        "review_text": data['review_text'],
        "customer_name": data['customer_name'],
        "created_at": datetime.utcnow().isoformat()
    }
    
    if use_mongodb and feedback_collection is not None:
        try:
            result = feedback_collection.insert_one(feedback_doc)
            return jsonify({
                "message": "Feedback submitted successfully!",
                "id": str(result.inserted_id)
            }), 201
        except Exception as e:
            # Fallback to in-memory storage
            feedback_storage.append(feedback_doc)
            feedback_counter += 1
            return jsonify({
                "message": "Feedback submitted successfully!",
                "id": feedback_doc["_id"]
            }), 201
    else:
        # Use in-memory storage
        feedback_storage.append(feedback_doc)
        feedback_counter += 1
        return jsonify({
            "message": "Feedback submitted successfully!",
            "id": feedback_doc["_id"]
        }), 201

@app.route('/api/feedback', methods=['GET'])
def get_all_feedback():
    if use_mongodb and feedback_collection is not None:
        try:
            feedback_cursor = feedback_collection.find().sort("created_at", -1)
            feedback_list = []
            for doc in feedback_cursor:
                doc['_id'] = str(doc['_id'])
                if 'created_at' in doc and isinstance(doc['created_at'], datetime):
                    doc['created_at'] = doc['created_at'].isoformat()
                feedback_list.append(doc)
            return jsonify(feedback_list), 200
        except Exception as e:
            # Fallback to in-memory storage
            return jsonify(sorted(feedback_storage, key=lambda x: x['created_at'], reverse=True)), 200
    else:
        # Use in-memory storage
        return jsonify(sorted(feedback_storage, key=lambda x: x['created_at'], reverse=True)), 200

@app.route('/api/feedback/<id>', methods=['DELETE'])
@token_required
def delete_feedback(id):
    if use_mongodb and feedback_collection is not None:
        try:
            feedback_id = ObjectId(id)
            result = feedback_collection.delete_one({"_id": feedback_id})
            if result.deleted_count == 1:
                return jsonify({"message": f"Feedback {id} deleted successfully"}), 200
            else:
                return jsonify({"error": f"Feedback with ID {id} not found"}), 404
        except Exception as e:
            # Fallback to in-memory storage
            pass
    
    # Use in-memory storage
    global feedback_storage
    for i, feedback in enumerate(feedback_storage):
        if feedback['_id'] == id:
            feedback_storage.pop(i)
            return jsonify({"message": f"Feedback {id} deleted successfully"}), 200
    
    return jsonify({"error": f"Feedback with ID {id} not found"}), 404

@app.route('/api/feedback/<id>', methods=['PUT', 'PATCH'])
@token_required
def update_feedback(id):
    data = request.get_json()
    update_fields = {}
    if 'rating' in data:
        try:
            rating_value = int(data['rating'])
            if not (1 <= rating_value <= 5):
                raise ValueError
            update_fields['rating'] = rating_value
        except:
            return jsonify({"error": "Rating must be an integer between 1 and 5"}), 400
    if 'review_text' in data:
        update_fields['review_text'] = data['review_text']
    if not update_fields:
        return jsonify({"error": "No fields provided for update"}), 400
    
    if use_mongodb and feedback_collection is not None:
        try:
            feedback_id = ObjectId(id)
            result = feedback_collection.update_one(
                {"_id": feedback_id},
                {"$set": update_fields}
            )
            if result.matched_count == 0:
                return jsonify({"error": f"Feedback with ID {id} not found"}), 404
            return jsonify({"message": f"Feedback {id} updated successfully"}), 200
        except Exception as e:
            # Fallback to in-memory storage
            pass
    
    # Use in-memory storage
    global feedback_storage
    for feedback in feedback_storage:
        if feedback['_id'] == id:
            feedback.update(update_fields)
            return jsonify({"message": f"Feedback {id} updated successfully"}), 200
    
    return jsonify({"error": f"Feedback with ID {id} not found"}), 404

@app.route('/api/admin/feedback', methods=['GET'])
@token_required
def get_admin_feedback():
    """Admin-only endpoint to get all feedback with additional metadata"""
    if use_mongodb and feedback_collection is not None:
        try:
            feedback_cursor = feedback_collection.find().sort("created_at", -1)
            feedback_list = []
            for doc in feedback_cursor:
                doc['_id'] = str(doc['_id'])
                if 'created_at' in doc and isinstance(doc['created_at'], datetime):
                    doc['created_at'] = doc['created_at'].isoformat()
                feedback_list.append(doc)
        except Exception as e:
            # Fallback to in-memory storage
            feedback_list = sorted(feedback_storage, key=lambda x: x['created_at'], reverse=True)
    else:
        # Use in-memory storage
        feedback_list = sorted(feedback_storage, key=lambda x: x['created_at'], reverse=True)
    
    # Add summary statistics
    total_feedback = len(feedback_list)
    avg_rating = sum(f['rating'] for f in feedback_list) / total_feedback if total_feedback > 0 else 0
    
    return jsonify({
        'feedback': feedback_list,
        'stats': {
            'total': total_feedback,
            'average_rating': round(avg_rating, 2)
        }
    }), 200

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
