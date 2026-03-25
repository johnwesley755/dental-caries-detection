from sqlalchemy import create_engine, text

def try_grant():
    urls_to_try = [
        "postgresql://postgres@localhost/postgres",
        "postgresql://root@localhost/postgres",
        "postgresql://user@localhost/postgres"
    ]
    
    for url in urls_to_try:
        engine = create_engine(url)
        try:
            with engine.connect() as conn:
                print(f"Connected using {url}!")
                conn.execute(text("GRANT ALL ON SCHEMA public TO dental_user;"))
                conn.commit()
                print("Granted schema public to dental_user successfully!")
                return
        except Exception as e:
            print(f"Failed with {url}: {e}")

if __name__ == "__main__":
    try_grant()
