import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime
from bson.objectid import ObjectId

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
client = MongoClient(MONGO_URI)
db = client.get_database("FeedbackDB")
feedback_collection = db.feedback

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Customer Feedback System API is running!"})

@app.route('/api/feedback', methods=['POST'])
def submit_feedback():
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
        "product_id": data['product_id'],
        "rating": rating_value,
        "review_text": data['review_text'],
        "customer_name": data['customer_name'],
        "created_at": datetime.utcnow()
    }
    result = feedback_collection.insert_one(feedback_doc)
    return jsonify({
        "message": "Feedback submitted successfully!",
        "id": str(result.inserted_id)
    }), 201

@app.route('/api/feedback', methods=['GET'])
def get_all_feedback():
    feedback_cursor = feedback_collection.find().sort("created_at", -1)
    feedback_list = []
    for doc in feedback_cursor:
        doc['_id'] = str(doc['_id'])
        if 'created_at' in doc and isinstance(doc['created_at'], datetime):
            doc['created_at'] = doc['created_at'].isoformat()
        feedback_list.append(doc)
    return jsonify(feedback_list), 200

@app.route('/api/feedback/<id>', methods=['DELETE'])
def delete_feedback(id):
    try:
        feedback_id = ObjectId(id)
    except:
        return jsonify({"error": "Invalid Feedback ID format"}), 400
    result = feedback_collection.delete_one({"_id": feedback_id})
    if result.deleted_count == 1:
        return jsonify({"message": f"Feedback {id} deleted successfully"}), 200
    else:
        return jsonify({"error": f"Feedback with ID {id} not found"}), 404

@app.route('/api/feedback/<id>', methods=['PUT', 'PATCH'])
def update_feedback(id):
    try:
        feedback_id = ObjectId(id)
    except:
        return jsonify({"error": "Invalid Feedback ID format"}), 400
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
    result = feedback_collection.update_one(
        {"_id": feedback_id},
        {"$set": update_fields}
    )
    if result.matched_count == 0:
        return jsonify({"error": f"Feedback with ID {id} not found"}), 404
    return jsonify({"message": f"Feedback {id} updated successfully"}), 200

if __name__ == '__main__':
    app.run(debug=True)
