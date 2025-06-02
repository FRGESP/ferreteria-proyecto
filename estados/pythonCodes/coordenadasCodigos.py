import math

import pgeocode

# Crear un objeto Nominatim para México
nomi = pgeocode.Nominatim('MX')

# Consultar las coordenadas del código postal 38000
location = nomi.query_postal_code("11570")

if math.isnan(location.latitude):
    print('Es indefinido')

print(location.latitude, location.longitude)