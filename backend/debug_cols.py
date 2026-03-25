
import psycopg2

def check():
    try:
        conn = psycopg2.connect("postgresql://postgres:G2q2hxzc$27@localhost:5432/dental-caries")
        cur = conn.cursor()
        
        for table in ['caries_findings', 'detections']:
            cur.execute(f"SELECT column_name FROM information_schema.columns WHERE table_name = '{table}';")
            cols = [r[0] for r in cur.fetchall()]
            print(f"{table} columns: {cols}")
            
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check()
