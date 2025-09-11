from datetime import datetime, timedelta
from collections import defaultdict
from DB_connection import db

users_collection = db["users"]
posts_collection = db["posts"]
achievements_collection = db["achievements"]
boosts_collection = db["boosts"]


def get_overview_data():
    # מחזירה מידע כללי על המערכת (מספר משתמשים, פוסטים, הישגים ובוסטים)
    return {
        "users_count": users_collection.count_documents({}),
        "posts_count": posts_collection.count_documents({}),
        "achievements_count": achievements_collection.count_documents({}),
        "boosts_count": boosts_collection.count_documents({})
    }


def get_administrators():
    # מחזירה רשימת מנהלים (שם ותמונת פרופיל) + כמות מנהלים
    admins_cursor = users_collection.find(
        {"role": "ADMIN"},
        {"_id": 0, "userName": 1, "profilePicture": 1}
    )
    administrators = list(admins_cursor)
    return {
        "administrators": administrators,
        "count": len(administrators)
    }


def get_signups_last_six_months():
    # מחזירה כמות משתמשים חדשים לכל חודש בחצי השנה האחרונה
    today = datetime.today()
    six_months_ago = today - timedelta(days=180)

    recent_users = users_collection.find(
        {"enterDate": {"$gte": six_months_ago}},
        {"enterDate": 1}
    )

    monthly_signups = defaultdict(int)
    for user in recent_users:
        date = user.get("enterDate")
        if not date:
            continue
        month_key = date.strftime("%Y-%m")
        monthly_signups[month_key] += 1

    return dict(sorted(monthly_signups.items()))


if __name__ == "__main__":
    print(get_overview_data())
    print(get_administrators())
    print(get_signups_last_six_months())
