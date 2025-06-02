import math

import pandas as pd

import pgeocode

nomi = pgeocode.Nominatim('MX')

estados = ['Distrito_Federal', 'Guanajuato']


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

for estado in estados:
    csv_path = f'/Users/fer/Developer/IngSoftware/aceroproyecto/estados/pythonCodes/csv_outputText/{estado}.csv'
    df = pd.read_csv(csv_path)
    for index, row in df.iterrows():

        if row['d_estado'] not in diccionarioEstados:
            contEstados += 1
            varEstados = contEstados
            diccionarioEstados.update({row['d_estado']: contEstados})
            print(f"INSERT INTO ESTADO (Estado) VALUES ('{row['d_estado']}');")
        else:
            varEstados = diccionarioEstados.get(row['d_estado'])

        if row['D_mnpio'] not in diccionarioMunicipios:
            contMunicipios += 1
            varMunicipios = contMunicipios
            diccionarioMunicipios.update({row['D_mnpio']: contMunicipios})
            print(f"INSERT INTO MUNICIPIO(Municipio, IdEstado) VALUES ('{row['D_mnpio']}', {contEstados});")
        else:
            varMunicipios = diccionarioMunicipios.get(row['D_mnpio'])

        if row['d_codigo'] not in diccionarioCodigos:
            contCodigos += 1
            varCodigos = contCodigos
            diccionarioCodigos.update({row['d_codigo']: contCodigos})
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
            print(f"INSERT INTO CODIGOPOSTAL (CodigoPostal,IdMunicipio, latitud, longitud) VALUES ('{codigovar}', {varMunicipios}, '{latitudvar}', '{longitudvar}');")
        else:
            codigovar = diccionarioCodigos.get(row['d_codigo'])

        if row['d_asenta'] not in diccionarioColonias:
            contColonias += 1
            varColonias = contColonias
            diccionarioColonias.update({row['d_asenta']: contColonias})
            print(f"INSERT INTO COLONIA (Colonia, IdCodigoPostal) VALUES ('{row['d_asenta']}', {varCodigos});")
        else:
            varColonias = diccionarioColonias.get(row['d_asenta'])
