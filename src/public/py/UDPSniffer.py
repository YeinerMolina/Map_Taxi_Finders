

from socket import*
from datetime import*
import socket
from tokenize import Double
import mysql.connector as connector

print("Recibiendo Datos...")

direccion = "192.168.1.33", 8502
print ("Recibiendo En Puerto:", direccion[1])
socket1 = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
socket1.bind((direccion))

while True:
	DatRec = socket1.recv(1024)
	Data = str(DatRec)
	Final = Data.replace('Coordenadas ',' ')
	Finale = Final.replace('Hora ',' ')
	Slash = Finale.replace('\\\\', '\\')
	Slashes = Slash.replace(r'\n','')
	Splits = Slashes.replace(',','')
	Split = Splits.split()
	dates = datetime.now()
	print("\nCoordenadas: \n" + "Latitud: " + Split[1] + " Longitud: " + Split[2] + "\n" + "Hora: " + Split[3])

	Datos=connector.connect(user='root', password='123456789', 
                        host='localhost',
                        database='taxi')
	Cursor=Datos.cursor()
	query = ("INSERT INTO taxi.coordenadas (ID,fecha,latitud,longitud) value('%f','%s','%f','%f')"  % (1,dates,float(Split[1]),float(Split[2])))
	Cursor.execute(query)









	



 