import pandas as pd
import os

excel_path = "C:\\Users\\ferna\\Downloads\\CPdescarga.xls"

output_folder = "csv_output"
os.makedirs(output_folder, exist_ok=True)

excel_data = pd.read_excel(excel_path, sheet_name=None)

# Guardar cada hoja como CSV
# for sheet_name, data in excel_data.items():
#     # Crear un nombre seguro para el archivo CSV
#     safe_name = sheet_name.replace("/", "_").replace("\\", "_")
#     csv_path = os.path.join(output_folder, f"{safe_name}.csv")
#     data.to_csv(csv_path, index=False)
#     print(f"Hoja '{sheet_name}' exportada como '{csv_path}'")

lista = []

for sheet_name, data in excel_data.items():
    lista.append(sheet_name)

print(lista)

# pip install pandas openpyxl