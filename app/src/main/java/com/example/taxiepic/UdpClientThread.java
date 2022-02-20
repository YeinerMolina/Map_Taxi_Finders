package com.example.taxiepic;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;


public class UdpClientThread extends Thread{
    int dstPort;
    String ubicacion;

    DatagramSocket socket;
    InetAddress address;


    public UdpClientThread(int puerto_servidor, String toString) {
        super();
        dstPort = puerto_servidor;
        ubicacion = toString;

    }




    @Override
    public void run() {
        boolean running = true;


        try {
            socket = new DatagramSocket();
            address= InetAddress.getByName("186.98.9.134");
            String mensaje = ubicacion;

            byte[] buffer = mensaje.getBytes();

            DatagramPacket Envio = new DatagramPacket(buffer, buffer.length, address, dstPort);

            socket.send(Envio);

        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if(socket != null){
                socket.close();
            }
        }

    }
}
