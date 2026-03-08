import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()
conn = psycopg2.connect(os.getenv("DATABASE_URL"))
cur = conn.cursor()
try:
    cur.execute("SELECT is_email_verified FROM users LIMIT 1;")
    res = cur.fetchone()
    print("SUCCESS: Column is_email_verified exists!", res)
except Exception as e:
    print("ERROR:", e)
cur.close()
conn.close()
