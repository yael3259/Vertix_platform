from DB_connection import db
from collections import defaultdict
from datetime import datetime, timedelta

# הגדרת קולקשנים
users_collection = db["users"]
posts_collection = db["posts"]
achievements_collection = db["achievements"]
boosts_collection = db["boosts"]

all_users = list(users_collection.find())
all_posts = list(posts_collection.find())
all_achievements = list(achievements_collection.find())
all_boosts = list(boosts_collection.find())

# שליפת כמות האובייקטים
print("users amount:", len(all_users))
print("posts amount:", len(all_posts))
print("achievements amount:", len(all_achievements))
print("boosts amount:", len(all_boosts))

# שליפת המנהלים
print("\nAdministrators:")
for user in all_users:
    role = user.get("role")
    if role == "ADMIN":
        print(user.get("_id"), "-", user.get("userName"), "-", user.get("profilePicture"))

# סטטוס משתמשים שנרשמו בחצי השנה האחרונה
today = datetime.today()
six_months_ago = today - timedelta(days=180)

recent_users = list(users_collection.find({
    "enterDate": {"$gte": six_months_ago}
}))

monthly_signups = defaultdict(int)

for user in recent_users:
    date = user.get("enterDate")
    month_key = date.strftime("%y-%m")
    monthly_signups[month_key] += 1

monthly_signups = dict(sorted(monthly_signups.items()))
print(monthly_signups)