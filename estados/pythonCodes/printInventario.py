import pandas as pd
import random

categorias = ['MONTEN', 'PTR', 'TUBOCED30', 'TUBOCED40', 'TUBOGALV', 'TUBULAR', 'TINDUSTRIAL', 'MOFLERO', 'TABLEROS', 'TUBC20', 'TUBZINTRO', 'ANGULO', 'ANGULOLIG', 'CUADRADO', 'REDONDO', 'TORCIDO', 'SOLERA', 'TEE']

cont = 0

for categoria in categorias:
    csv_path = f'/Users/fer/Developer/IngSoftware/aceroproyecto/estados/pythonCodes/PRODUCTOS-TUBULAR/{categoria}.csv'
    df = pd.read_csv(csv_path)
    for index, row in df.iterrows():
        cont +=1
        print(f"CALL SP_UPDATESTOCKSUCURSAL({cont},1,{random.randint(2,10)},{random.randint(0,5)});")