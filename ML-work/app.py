# app.py

import streamlit as st
import pandas as pd
import sqlite3
import pickle
from sklearn.metrics.pairwise import cosine_similarity

# Connect to SQLite database
conn = sqlite3.connect('driver_reviews.db')
cursor = conn.cursor()

# Function to load reviews from the database
def load_reviews_from_db():
    cursor.execute("SELECT * FROM reviews")
    reviews = cursor.fetchall()
    return pd.DataFrame(reviews, columns=['driver_id', 'review'])

# Load the pickled vectorizer
with open("vectorizer.pkl", "rb") as f:
    vectorizer = pickle.load(f)

# Function to recommend a driver based on customer input
def recommend_driver(customer_input):
    # Load reviews from the database
    df = load_reviews_from_db()
    
    # Transform the customer input using the vectorizer
    input_vec = vectorizer.transform([customer_input])
    
    # Transform reviews in the database using the vectorizer
    review_vecs = vectorizer.transform(df['review'])
    
    # Calculate cosine similarity between the customer input and all reviews
    similarity = cosine_similarity(input_vec, review_vecs).flatten()
    
    # Find the review with the highest similarity
    df['similarity'] = similarity
    best_driver = df.loc[df['similarity'].idxmax()]
    return best_driver['driver_id'], best_driver['review']

# Web app UI
st.title("🚗 Driver Matchmaker")

# Customer input
customer_input = st.text_area("Describe what you want in your ride:")

# Button to find the best driver
if st.button("Find Best Driver"):
    driver_id, matched_review = recommend_driver(customer_input)
    st.success(f"Recommended Driver ID: {int(driver_id)}")
    st.caption(f"Matched with review: \"{matched_review}\"")

st.caption("Tip: Mention things like 'Safe driving',  'On-time arrival', 'Clean car', 'Friendly Driver', 'Local Knowledge' for better matches.")

# Section for adding reviews after a ride
st.divider()
st.subheader("📝 Add Review After Ride")

driver_id = st.number_input("Driver ID", step=1)
review = st.text_area("Your Review")

if st.button("Submit Review"):
    cursor.execute("INSERT INTO reviews (driver_id, review) VALUES (?, ?)", (driver_id, review))
    conn.commit()
    st.success("✅ Review added to database!")
