package com.example.taxiepic;

import android.widget.Toast;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.InetAddress;
import java.net.Socket;
import java.net.UnknownHostException;

public class UTPClientThread extends Thread{

    int PUERTO;
    InetAddress IP;
    PrintWriter printWriter;
    Socket socketUTP;
    String ubicacion;


    public UTPClientThread(int puerto_servidor, String toString, InetAddress IPad) {
        super();
        PUERTO = puerto_servidor;
        ubicacion = toString;
        IP = IPad;

    }

    @Override
    public void run() {
        boolean running = true;
        try{

            Socket socket = new Socket(IP,PUERTO);
            printWriter = new PrintWriter(socket.getOutputStream());
            printWriter.write(ubicacion);
            printWriter.flush();
            printWriter.close();

        } catch (UnknownHostException ex) {
            Toast.makeText(MainActivity.this, "Server not found", Toast.LENGTH_SHORT).show();
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }
}
