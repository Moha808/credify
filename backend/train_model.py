import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

print("Generating dummy training data...")

# Create dummy data that matches the React frontend form fields
# Features:
# 1. Gender (0: Female, 1: Male)
# 2. Married (0: No, 1: Yes)
# 3. Dependents (0, 1, 2, 3)
# 4. Education (0: Not Graduate, 1: Graduate)
# 5. Self_Employed (0: No, 1: Yes)
# 6. ApplicantIncome (Numeric)
# 7. CoapplicantIncome (Numeric)
# 8. LoanAmount (Numeric, in thousands)
# 9. Loan_Amount_Term (Numeric, months)
# 10. Credit_History (0.0: Bad, 1.0: Good)
# 11. Property_Area (0: Rural, 1: Semiurban, 2: Urban)

np.random.seed(42)
n_samples = 500

data = {
    'Gender': np.random.choice([0, 1], n_samples),
    'Married': np.random.choice([0, 1], n_samples),
    'Dependents': np.random.choice([0, 1, 2, 3], n_samples),
    'Education': np.random.choice([0, 1], n_samples),
    'Self_Employed': np.random.choice([0, 1], n_samples, p=[0.8, 0.2]),
    'ApplicantIncome': np.random.normal(5000, 2000, n_samples).clip(1000, 20000),
    'CoapplicantIncome': np.random.normal(2000, 2000, n_samples).clip(0, 10000),
    'LoanAmount': np.random.normal(150, 50, n_samples).clip(50, 500),
    'Loan_Amount_Term': np.random.choice([120, 180, 240, 360], n_samples),
    'Credit_History': np.random.choice([0.0, 1.0], n_samples, p=[0.2, 0.8]),
    'Property_Area': np.random.choice([0, 1, 2], n_samples)
}

df = pd.DataFrame(data)

# Create a deterministic target (Loan_Status) based on simple logical rules
# 1 if approved, 0 if rejected
# Logic: Good credit history strongly predicts approval. High income vs loan amount also helps.
df['Total_Income'] = df['ApplicantIncome'] + df['CoapplicantIncome']
df['Loan_Status'] = np.where(
    (df['Credit_History'] == 1.0) & (df['Total_Income'] > df['LoanAmount'] * 10),
    1, 
    np.where(
        (df['Credit_History'] == 0.0), 
        0, 
        np.random.choice([0, 1], n_samples, p=[0.3, 0.7]) # 70% chance of approval otherwise
    )
)

# Drop the helper column used for logic
df.drop('Total_Income', axis=1, inplace=True)

X = df.drop('Loan_Status', axis=1)
y = df['Loan_Status']

print("Training Random Forest model...")
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)

# Evaluate (just for terminal output)
score = model.score(X, y)
print(f"Model trained successfully. Accuracy on training set: {score:.2f}")

# Save the model
model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
joblib.dump(model, model_path)
print(f"Model saved to {model_path}")
