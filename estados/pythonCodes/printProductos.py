import pandas as pd

categorias = ['MONTEN', 'PTR', 'TUBOCED30', 'TUBOCED40', 'TUBOGALV', 'TUBULAR', 'TINDUSTRIAL', 'MOFLERO', 'TABLEROS', 'TUBC20', 'TUBZINTRO', 'ANGULO', 'ANGULOLIG', 'CUADRADO', 'REDONDO', 'TORCIDO', 'SOLERA', 'TEE']

banderaSalto = False

for categoria in categorias:
    csv_path = f'/Users/fer/Developer/IngSoftware/aceroproyecto/estados/pythonCodes/PRODUCTOS-TUBULAR/{categoria}.csv'
    df = pd.read_csv(csv_path)
    for index, row in df.iterrows():
        if row['Categoria'] == 12 and banderaSalto == False:
            print("")
            banderaSalto = True
        print(
            f"CALL SP_INSERTARPRODUCTO('{str(row['Nombre']).strip()}', {row['Categoria']}, {row['PesoInicial']}, {row['PesoFinal']}, {row['Subcategoria']}, {row['CostoExtra']},1001);")