from socket import*
from datetime import*
import socket
from tokenize import Double
from MySQLdb import _mysql

print("Recibiendo Datos...")

direccion = "192.168.0.10", 10000
print ("Recibiendo En Puerto:", direccion[1])
socket1 = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
socket1.bind((direccion))	
	
while True:
	try:
		DatRec = socket1.recv(1024)
		Data = str(DatRec)
		Data = Data.replace('b\'','')
		Data = Data.replace('\'','')
		Split = Data.split(sep = ', ')
		dates = datetime.now()
		print(Split)

		bd = _mysql.connect("database-1.cxnmclobctiz.us-east-2.rds.amazonaws.com","WebPageUser","@P4nc170","taxi")
		cursor = bd.query("INSERT INTO taxi.coordenadas (ID,fecha,latitud,longitud,hora) value('%f','%s','%f','%f','%s')"  % (1,Split[2],float(Split[0]),float(Split[1]),Split[3]))
		bd.close()
	except _mysql.Error as err:
		print(err)








	



 