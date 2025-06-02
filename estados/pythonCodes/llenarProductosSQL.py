import mysql.connector

conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Password!",
    database="FERRETERIA"
)
cursor = conn.cursor()

categorias = ['MONTEN', 'PTR', 'TUBOCED30', 'TUBOCED40', 'TUBOGALV', 'TUBULAR', 'TINDUSTRIAL', 'MOFLERO', 'TABLEROS', 'TUBC20', 'TUBZINTRO']

for categora in categorias:
    cursor.execute(f"INSERT INTO ESTADO (Estado) SELECT DISTINCT d_estado FROM {estado} WHERE d_estado IS NOT NULL")
    conn.commit()
    print(estado)

print("códigos postales  insertados")

cursor.close()
conn.close()

# pip install mysql-connector-python