package com.example.taxiepic;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;


public class UdpClientThread extends Thread{
    int dstPort;
    String ubicacion;
    String IPPC;
    DatagramSocket socket;
    InetAddress address;


    public UdpClientThread(int puerto_servidor, String toString, String IP) {
        super();
        dstPort = puerto_servidor;
        ubicacion = toString;
        IPPC = IP;

    }




    @Override
    public void run() {
        boolean running = true;


        try {
            socket = new DatagramSocket();
            address= InetAddress.getByName(IPPC);
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
