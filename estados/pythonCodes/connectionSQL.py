import mysql.connector

conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Password!",
    database="FERRETERIA"
)
cursor = conn.cursor()

estados = ['Aguascalientes', 'Baja_California', 'Baja_California_Sur', 'Campeche', 'Coahuila_de_Zaragoza', 'Colima', 'Chiapas', 'Chihuahua', 'Distrito_Federal', 'Durango', 'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco', 'Mexico', 'Michoacan_de_Ocampo', 'Morelos', 'Nayarit', 'Nuevo_Leon', 'Oaxaca', 'Puebla', 'Queretaro', 'Quintana_Roo', 'San_Luis_Potosi', 'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz_de_Ignacio_de_la_Llave', 'Yucatan', 'Zacatecas']

for estado in estados:
    cursor.execute(f"INSERT INTO ESTADO (Estado) SELECT DISTINCT d_estado FROM {estado} WHERE d_estado IS NOT NULL")
    conn.commit()
    cursor.execute(f"INSERT INTO MUNICIPIO(Municipio, IdEstado) SELECT DISTINCT G.D_mnpio, E.IdEstado FROM {estado} AS G INNER JOIN ESTADO AS E ON G.d_estado = E.Estado ;")
    conn.commit()
    cursor.execute(f"insert into CODIGOPOSTAL (CodigoPostal,IdMunicipio) select DISTINCT G.d_codigo, M.IdMunicipio from {estado} as G inner join MUNICIPIO as M on G.D_mnpio = M.Municipio;")
    conn.commit()
    cursor.execute(f"insert into COLONIA (Colonia, IdCodigoPostal) select DISTINCT G.d_asenta, CP.IdCodigoPostal from {estado} as G inner join CODIGOPOSTAL as CP on G.d_codigo = CP.CodigoPostal;")
    conn.commit()
    print(estado)

print("códigos postales  insertados")

cursor.close()
conn.close()

# pip install mysql-connector-python