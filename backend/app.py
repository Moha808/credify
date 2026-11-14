import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np

app = Flask(__name__)
# Allow all origins (needed for Vercel frontend to talk to Render backend)
CORS(app, origins="*")

# Load the trained model
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model.pkl')

model = None
if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
    print(f"Model loaded from {MODEL_PATH}")
else:
    print(f"Warning: Model not found at {MODEL_PATH}. Please run train_model.py first.")

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "model_loaded": model is not None}), 200

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded on the server"}), 500

    try:
        # Get JSON data from the React frontend
        data = request.json
        
        # Convert frontend string values to the numerical format the ML model expects
        # 1. Gender (0: Female, 1: Male)
        gender = 1 if data.get('Gender') == 'Male' else 0
        
        # 2. Married (0: No, 1: Yes)
        married = 1 if data.get('Married') == 'Yes' else 0
        
        # 3. Dependents (0, 1, 2, 3)
        dep_str = str(data.get('Dependents', '0'))
        if dep_str == '3+':
            dependents = 3
        else:
            dependents = int(dep_str) if dep_str.isdigit() else 0
            
        # 4. Education (0: Not Graduate, 1: Graduate)
        education = 1 if data.get('Education') == 'Graduate' else 0
        
        # 5. Self_Employed (0: No, 1: Yes)
        self_employed = 1 if data.get('Self_Employed') == 'Yes' else 0
        
        # 6 & 7. Incomes
        app_income = float(data.get('ApplicantIncome', 0))
        coapp_income = float(data.get('CoapplicantIncome', 0))
        
        # 8. LoanAmount
        loan_amount = float(data.get('LoanAmount', 0))
        
        # 9. Loan_Amount_Term
        loan_term = float(data.get('Loan_Amount_Term', 360))
        
        # 10. Credit_History (0.0: Bad, 1.0: Good)
        credit_history = float(data.get('Credit_History', 0.0))
        
        # 11. Property_Area (0: Rural, 1: Semiurban, 2: Urban)
        area_str = data.get('Property_Area', 'Urban')
        if area_str == 'Rural':
            property_area = 0
        elif area_str == 'Semiurban':
            property_area = 1
        else:
            property_area = 2

        # Create a dataframe for the model
        features = pd.DataFrame([{
            'Gender': gender,
            'Married': married,
            'Dependents': dependents,
            'Education': education,
            'Self_Employed': self_employed,
            'ApplicantIncome': app_income,
            'CoapplicantIncome': coapp_income,
            'LoanAmount': loan_amount,
            'Loan_Amount_Term': loan_term,
            'Credit_History': credit_history,
            'Property_Area': property_area
        }])

        # Make prediction
        prediction_num = model.predict(features)[0]
        prediction_prob = model.predict_proba(features)[0]
        
        # prediction_prob has probabilities for [class 0 (Rejected), class 1 (Approved)]
        # approval_probability is the predicted likelihood of loan approval (0 to 100%)
        # Determine approval rate / probability for Class 1 (Approved)
        approval_rate = float(prediction_prob[1]) * 100
        
        # Benchmark Rule: >= 50% -> Accepted, < 50% -> Declined
        if approval_rate >= 50.0:
            status = "Approved"
        else:
            status = "Rejected"
            
        confidence = round(approval_rate, 2)

        # Return the result back to React
        return jsonify({
            "status": status,
            "confidence": confidence,
            "approval_rate": confidence
        }), 200

    except Exception as e:
        print(f"Error during prediction: {str(e)}")
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    # Use PORT env variable for Render, fallback to 5000 for local dev
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)
