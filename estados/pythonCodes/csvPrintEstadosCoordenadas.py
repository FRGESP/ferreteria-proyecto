import math

import pandas as pd

import pgeocode

import os
import csv

os.makedirs("Direcciones3", exist_ok=True)



nomi = pgeocode.Nominatim('MX')

estados = ['Aguascalientes', 'Baja_California', 'Baja_California_Sur', 'Campeche', 'Coahuila_de_Zaragoza', 'Colima', 'Chiapas', 'Chihuahua', 'Distrito_Federal', 'Durango', 'Guanajuato', 'Guerrero', 'Hidalgo', 'Jalisco', 'México', 'Michoacán_de_Ocampo', 'Morelos', 'Nayarit', 'Nuevo_León', 'Oaxaca', 'Puebla', 'Querétaro', 'Quintana_Roo', 'San_Luis_Potosí', 'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz_de_Ignacio_de_la_Llave', 'Yucatán', 'Zacatecas']

#estados = ['Aguascalientes'];

banderaSalto = False
banderaEstado = ''
banderaMunicipio = ''
banderaCodigoPostal = ''
banderaColonia = ''
codigovar = ''
contEstados = 0
contMunicipios = 0
contCodigos = 0
contColonias = 0
diccionarioEstados = {}
diccionarioMunicipios = {}
diccionarioCodigos = {}
diccionarioColonias = {}

varEstados = 0
varMunicipios = 0
varCodigos = 0
varColonias = 0

latitudvar = 0
longitudvar = 0


with open('Direcciones3/ESTADO.csv', 'w', newline='', encoding='utf-8') as f_estado, \
     open('Direcciones3/MUNICIPIO.csv', 'w', newline='', encoding='utf-8') as f_municipio, \
     open('Direcciones3/CODIGOPOSTAL.csv', 'w', newline='', encoding='utf-8') as f_codigo, \
     open('Direcciones3/COLONIA.csv', 'w', newline='', encoding='utf-8') as f_colonia:

    writer_estado = csv.writer(f_estado)
    writer_estado.writerow(['IdEstado', 'Estado'])

    writer_municipio = csv.writer(f_municipio)
    writer_municipio.writerow(['IdMunicipio', 'Municipio', 'IdEstado'])

    writer_codigo = csv.writer(f_codigo)
    writer_codigo.writerow(['IdCodigoPostal', 'CodigoPostal', 'IdMunicipio', 'Latitud', 'Longitud'])

    writer_colonia = csv.writer(f_colonia)
    writer_colonia.writerow(['IdColonia', 'Colonia', 'IdCodigoPostal'])

    for estado in estados:
        nombreArchivo = str(estado) + '.csv'
        csv_path = f'/Users/fer/Developer/IngSoftware/aceroproyecto/estados/pythonCodes/csv_outputText/{estado}.csv'
        df = pd.read_csv(csv_path)
        for index, row in df.iterrows():

            if row['d_estado'] not in diccionarioEstados:
                print(row['d_estado'])
                contEstados += 1
                varEstados = contEstados
                diccionarioEstados.update({row['d_estado']: contEstados})
                writer_estado.writerow([contEstados, row['d_estado']])
                #print(f"INSERT INTO ESTADO (Estado) VALUES ('{row['d_estado']}');")
            else:
                varEstados = diccionarioEstados.get(row['d_estado'])

            claveMunicipio = (row['d_estado'], row['D_mnpio'])
            if claveMunicipio not in diccionarioMunicipios:
                contMunicipios += 1
                varMunicipios = contMunicipios
                diccionarioMunicipios[claveMunicipio] = contMunicipios
                writer_municipio.writerow([contMunicipios, row['D_mnpio'], contEstados])

                #print(f"INSERT INTO MUNICIPIO(Municipio, IdEstado) VALUES ('{row['D_mnpio']}', {contEstados});")
            else:
                varMunicipios = diccionarioMunicipios[claveMunicipio]

            claveCodigo = row['d_codigo']
            if claveCodigo not in diccionarioCodigos:
                contCodigos += 1
                varCodigos = contCodigos
                diccionarioCodigos[claveCodigo] = contCodigos
                if len(str(row['d_codigo'])) < 5:
                    codigovar = '0' + str(row['d_codigo'])
                else:
                    codigovar = row['d_codigo']
                location = nomi.query_postal_code(codigovar)
                if math.isnan(location.latitude):
                    latitudvar = 0
                    longitudvar = 0
                else:
                    latitudvar = location.latitude
                    longitudvar = location.longitude
                writer_codigo.writerow([contCodigos, codigovar, varMunicipios, latitudvar, longitudvar])
                #print(f"INSERT INTO CODIGOPOSTAL (CodigoPostal,IdMunicipio, latitud, longitud) VALUES ('{codigovar}', {varMunicipios}, '{latitudvar}', '{longitudvar}');")
            else:
                varCodigos = diccionarioCodigos[claveCodigo]

            clave_colonia = (row['d_asenta'], row['d_codigo'])

            if clave_colonia not in diccionarioColonias:
                contColonias += 1
                varColonias = contColonias
                diccionarioColonias[clave_colonia] = contColonias
                writer_colonia.writerow([contColonias, row['d_asenta'], varCodigos])
            else:
                varColonias = diccionarioColonias[clave_colonia]

