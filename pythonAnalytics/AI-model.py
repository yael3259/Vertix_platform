# from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.metrics.pairwise import cosine_similarity
#
# # "כוונות" עם מילות מפתח
# intents = {
#     "פוסט": "כדי להעלות פוסט, לחץ כאן: /posts",
#     "הרשמה": "להרשמה לחץ כאן: /register",
#     "התנתקות": "כדי להתנתק, עבור להגדרות -> התנתקות",
#     "בוסט": "מידע על בוסטים כאן: /boosts"
# }
#
#
# def chatbot_response(user_input):
#     # כל המילים שיכולות להיות מוכרות לבוט
#     keywords = list(intents.keys())
#
#     # וקטוריזציה (הפיכת מילים למספרים)
#     vectorizer = TfidfVectorizer().fit_transform([user_input] + keywords)
#     vectors = vectorizer.toarray()
#
#     # חישוב דמיון
#     user_vec = vectors[0]
#     keyword_vecs = vectors[1:]
#     sims = cosine_similarity([user_vec], keyword_vecs)[0]
#
#     # מציאת המילה הכי קרובה
#     best_match_index = sims.argmax()
#     best_keyword = keywords[best_match_index]
#
#     # אם הדמיון נמוך מאוד – לא זוהה
#     if sims[best_match_index] < 0.2:
#         return "לא הבנתי, נסה לנסח אחרת 🙂"
#
#     return intents[best_keyword]
#
#
# # דוגמאות
# print(chatbot_response("איך אני מעלה פוסטים?"))
# print(chatbot_response("איך להתחבר?"))
# print(chatbot_response("אני רוצה לעשות בוסט"))

# קודם מתקינים את הספרייה (פעם אחת בלבד)
# pip install rapidfuzz

from rapidfuzz import fuzz, process  # מייבאים פונקציות להשוואת מחרוזות

# 1. רשימת מילות מפתח שהבוט ידע לזהות
keywords = ["פוסט", "הרשמה", "התנתקות", "בוסטים", "משתמשים"]

# 2. מילון עם המידע או הקישורים שהבוט מחזיר לכל מילה
responses = {
    "פוסט": "מידע על פוסטים כאן: /posts",
    "הרשמה": "את יכולה להירשם כאן: /register",
    "התנתקות": "להתנתק מהמערכת לחצי כאן: /logout",
    "בוסטים": "מידע על בוסטים כאן: /boosts",
    "משתמשים": "רשימת המשתמשים כאן: /users"
}


# 3. פונקציה שמקבלת טקסט מהמשתמש ומחזירה את התגובה המתאימה
def chatbot_reply(user_input):
    # משתמשים ב-process.extractOne כדי למצוא את המילה הכי דומה
    match = process.extractOne(user_input, keywords, scorer=fuzz.ratio)
    # extractOne מחזיר tuple: (המילה הכי דומה, אחוז התאמה, אינדקס ברשימה)

    if match:
        keyword, score, _ = match
        if score >= 70:  # אם הדמיון מעל 70%, נחשיב את זה תואם
            return responses[keyword]

    # אם לא מצא התאמה טובה
    return "לא הבנתי, נסה לנסח אחרת 🙂"


# 4. דוגמה לשימוש
user_messages = ["אני רוצה פוסט", "הרשמה אותי", "להתנתק", "בוסתים", "מי המשתמשים?"]

for msg in user_messages:
    reply = chatbot_reply(msg)
    print(f"המשתמש כתב: {msg} -> הבוט עונה: {reply}")
