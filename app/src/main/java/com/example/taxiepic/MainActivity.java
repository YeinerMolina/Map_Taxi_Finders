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
    UTPClientThread utpClientThread;
    private boolean Status = false;
    private final int delay = 5000;
    public static List<Address> addresses;
    Socket socketUTP;
    PrintWriter printWriter;
    Switch ProtocolSwitch;
    InetAddress IPaddress;
    Button BtCoords;
    ToggleButton BtSend;
    EditText IP, Port;
    android.widget.TextView Time, Coords;
    FusedLocationProviderClient fusedLocationProviderClient;


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
                if ((MainActivity.addresses != null && !IP.getText().toString().isEmpty()) && !Port.getText().toString().isEmpty()) {

                    if (ProtocolSwitch.isChecked()){
                        if (BtSend.isChecked()) {
                            Status = true;
                        } else {
                            Status = false;
                        }
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

            GetCoords();
        } else {

            ActivityCompat.requestPermissions(MainActivity.this,
                    new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, 1000);

        }

        BtCoords.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                if (ActivityCompat.checkSelfPermission(MainActivity.this,
                        Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {

                    GetCoords();
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
                Time.setText(String.valueOf("Hora: \n"));
                Coords.setText(String.valueOf("Coordenadas \n"+ addresses.get(0).getLatitude() + ", " + addresses.get(0).getLongitude()));
                TimeVar = new java.text.SimpleDateFormat("yyyy/MM/dd,HH:mm:ss.SSS").format(location.getTime());
                Time.setText(String.valueOf("Hora \n" + TimeVar));
            }
        };
    }



    private void GetCoords() {

        fusedLocationProviderClient.getLastLocation().addOnCompleteListener(new OnCompleteListener<Location>() {
            @Override
            public void onComplete(@NonNull Task<Location> task) {
                Location location = task.getResult();
                if (location != null) {
                    try {
                        Geocoder geocoder = new Geocoder(MainActivity.this, Locale.getDefault());
                        MainActivity.addresses = geocoder.getFromLocation(location.getLatitude(), location.getLongitude(), 1);

                        Time.setText(String.valueOf("Hora: \n"));
                        Coords.setText(String.valueOf("Coordenadas \n"+ addresses.get(0).getLatitude() + ", " + addresses.get(0).getLongitude()));

                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
        });
    }

    public void Send_Data_TCP() {
        handler.postDelayed(new Runnable() {

        try{

                        PuertoString = Port.getText().toString();
                        PUERTO = Integer.parseInt(PuertoString);
                        IPaddress = InetAddress.getByName();
                        utpClientThread = new UTPClientThread(PUERTO, Coords.getText().toString(), IPaddress)
                        utpClientThread.start();

                    } catch(
                    UnknownHostException ex)

                    {
                        Toast.makeText(MainActivity.this, "Server not found", Toast.LENGTH_SHORT).show();
                    } catch(
                    IOException ex)

                    {
                        ex.printStackTrace();
                    }
                }
    , delay);
    }

    public void Send_Data_UDP(){
        handler.postDelayed(new Runnable() {

            public void run() {
                try {
                PuertoString = Port.getText().toString();
                PUERTO = Integer.parseInt(PuertoString);
                IPaddress = InetAddress.getByName(IP.getText().toString());
                udpClientThread = new UdpClientThread(PUERTO, Coords.getText().toString(), IPaddress);
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