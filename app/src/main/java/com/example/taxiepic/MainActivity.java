package com.example.taxiepic;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;

import android.Manifest;
import android.content.pm.PackageManager;
import android.location.Address;
import android.location.Geocoder;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.os.Handler;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Switch;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.ToggleButton;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.InetAddress;
import java.net.Socket;
import java.net.UnknownHostException;
import java.util.List;
import java.util.Locale;

public class MainActivity extends AppCompatActivity {

    int PUERTO;
    String PuertoString, TimeVar;
    Handler handler = new Handler();
    UdpClientThread udpClientThread;
    TCPClientThread tcpClientThread;
    private boolean Status = false;
    private final int delay = 5000;
    public static List<Address> addresses;
    Switch ProtocolSwitch;
    InetAddress IPaddress;
    Button BtCoords;
    ToggleButton BtSend;
    EditText IP, Port;
    android.widget.TextView Time, Coords;
    FusedLocationProviderClient fusedLocationProviderClient;
    String CoordendasTxt;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);


        ProtocolSwitch = (Switch) findViewById(R.id.ProtocolType);
        Port = (EditText) findViewById(R.id.PORT_ET);
        IP = (EditText) findViewById(R.id.PublicIP_ET);
        BtCoords = (Button) findViewById(R.id.GetLocation_Bt);
        BtSend = (ToggleButton) findViewById(R.id.BtSend);
        Coords = (TextView) findViewById(R.id.Coords_TV);
        Time = (TextView) findViewById(R.id.Hora_TV);
        Port = (EditText) findViewById(R.id.PORT_ET);

        fusedLocationProviderClient = LocationServices.getFusedLocationProviderClient(this);


        BtSend.setOnCheckedChangeListener((buttonView, isChecked) -> {
            if (ActivityCompat.checkSelfPermission(MainActivity.this,
                    Manifest.permission.INTERNET) == PackageManager.PERMISSION_GRANTED) {
                if ((CoordendasTxt != null && !IP.getText().toString().isEmpty()) && !Port.getText().toString().isEmpty()) {
                    if (BtSend.isChecked()) {
                        Status = true;
                    } else {
                        Status = false;
                    }
                    if (ProtocolSwitch.isChecked()){
                        Send_Data_UDP();
                    } else {
                        Send_Data_TCP();
                    }
                } else if (IP.getText().toString().isEmpty()) {
                    BtSend.setChecked(false);
                    Toast.makeText(MainActivity.this, "La IP no puede estar vacia", Toast.LENGTH_SHORT).show();
                } else if (Port.getText().toString().isEmpty()) {
                    BtSend.setChecked(false);
                    Toast.makeText(MainActivity.this, "Debe indicar el puerto", Toast.LENGTH_SHORT).show();
                } else {
                    BtSend.setChecked(false);
                    Toast.makeText(MainActivity.this, "No hay coordenadas para enviar", Toast.LENGTH_SHORT).show();
                }
            } else {
                ActivityCompat.requestPermissions(MainActivity.this,
                        new String[]{Manifest.permission.INTERNET}, 1000);
            }

        });


        if (ActivityCompat.checkSelfPermission(MainActivity.this,
                Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {

            GetLocation();
        } else {

            ActivityCompat.requestPermissions(MainActivity.this,
                    new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, 1000);

        }

        BtCoords.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                if (ActivityCompat.checkSelfPermission(MainActivity.this,
                        Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {

                    GetLocation();
                } else {

                    ActivityCompat.requestPermissions(MainActivity.this,
                            new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, 1000);

                }
            }
        });

    }

    private void GetLocation() {
        LocationListener locationListener = new LocationListener() {
            @Override
            public void onLocationChanged(@NonNull Location location) {

                CoordendasTxt = String.valueOf(location.getLatitude()) +", "+String.valueOf(location.getLongitude());
                Coords.setText(String.valueOf("Coordenadas \n"+ CoordendasTxt));
                TimeVar = new java.text.SimpleDateFormat("yyyy/MM/dd, HH:mm:ss.SSS").format(location.getTime());
                Time.setText(String.valueOf("Hora \n" + TimeVar));
            }
        };
        LocationManager locationManager = (LocationManager) getSystemService(LOCATION_SERVICE);
        try {
            long MIN_TIME = 1000;
            long MIN_DIST = 5;
            locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, MIN_TIME, MIN_DIST, locationListener);

        }
        catch (SecurityException e) {
            e.printStackTrace();
        }
    }

    public void Send_Data_TCP() {
        handler.postDelayed(new Runnable() {

            @Override
            public void run() {
                try{

                    PUERTO = Integer.parseInt(Port.getText().toString());
                    IPaddress = InetAddress.getByName(IP.getText().toString());
                    String Mensaje = String.valueOf(CoordendasTxt + ", "+TimeVar);
                    tcpClientThread = new TCPClientThread(PUERTO, Mensaje, IPaddress);
                    tcpClientThread.start();

                    if(Status) {
                        handler.postDelayed(this, delay);
                        Toast.makeText(MainActivity.this, "Enviando", Toast.LENGTH_SHORT).show();
                    } else {
                        handler.getLooper();
                    }

                } catch(UnknownHostException ex){
                    Toast.makeText(MainActivity.this, "Server not found", Toast.LENGTH_SHORT).show();
                } catch(IOException ex){
                    ex.printStackTrace();
                }
            }},delay);
    }

    public void Send_Data_UDP(){
        handler.postDelayed(new Runnable() {

            public void run() {
                try {
                    GetLocation();
                    PUERTO = Integer.parseInt(Port.getText().toString());
                    IPaddress = InetAddress.getByName(IP.getText().toString());
                    String Mensaje =  String.valueOf(CoordendasTxt + ", "+TimeVar);
                    udpClientThread = new UdpClientThread(PUERTO, Mensaje, IPaddress);
                    udpClientThread.start();

                    if(Status) {
                        handler.postDelayed(this, delay);
                        Toast.makeText(MainActivity.this, "Enviando", Toast.LENGTH_SHORT).show();
                    } else {
                        handler.getLooper();
                    }

                } catch (UnknownHostException e) {
                    e.printStackTrace();
                }

            }}
            , delay);
    }

}