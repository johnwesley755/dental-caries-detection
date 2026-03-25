import sys
from sqlalchemy import create_engine, text

def test_db(db_name):
    url = f"postgresql://dental_user:dental%40123@localhost:5432/{db_name}"
    engine = create_engine(url)
    try:
        with engine.connect() as conn:
            conn.execute(text("CREATE TABLE test_perm_table (id int);"))
            conn.execute(text("DROP TABLE test_perm_table;"))
            conn.commit()
            return True
    except Exception as e:
        print(f"Failed to create table in {db_name}: {e}")
        return False

print(f"Permissions in postgres DB: {test_db('postgres')}")
print(f"Permissions in dental_db DB: {test_db('dental_db')}")
