package server;
import org.hsqldb.lib.StringInputStream;

import java.io.*;
import java.net.BindException;
import java.net.ServerSocket;
import java.util.Date;
import java.util.Vector;
import java.net.Socket;
import message.*;
import com.alibaba.fastjson.JSON;


public class Server extends Thread {
    private ServerSocket server;
    private static int Socketnum=0;

    public Server() {
        try {
            server = new ServerSocket(10001);
            System.out.println("主线程开始监听10001");
            this.start();
        }
        catch(Exception e) {

        }
    }

    public static void main(String[] args) {
        new Server();
    }

    public void run() {
        //当服务器在运行
        while(!server.isClosed()) {
            try {
                Socket client = server.accept();//监听新的客户端
                wrinlog(client);
                System.out.println("出现连接");

                ServerThread current = new ServerThread(client, this);
                current.start();

//                InputStream inputStream = client.getInputStream();
//
//                String inputString = Server.inputStreamAsString(client.getInputStream());
//                UsrMessage usrMessage=JSON.parseObject(inputString,UsrMessage.class);
//                System.out.println(usrMessage.getUsr_id());
//                System.out.println(inputString+"");
//
//                client=new Socket("127.0.0.1",10002);
//                String out="server端信息";
//                client.getOutputStream().write(out.getBytes());
//                client.getOutputStream().flush();


            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
    public static String inputStreamAsString(InputStream stream) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(stream));
        StringBuilder sb = new StringBuilder();
        String line = null;

        while ((line = br.readLine()) != null) {
            sb.append(line + "\n");
        }

        br.close();
        return sb.toString();
    }



    public void wrinlog(Socket client){

        File temp=new File("./","log.txt");
        try {
            FileWriter fileWriter=new FileWriter(temp,true);
            String date=new Date().toString();
            fileWriter.write("\n当前连接数:   "+Socketnum+"\n");
            fileWriter.write("当前时间:   "+date+"\n");
            fileWriter.write("此连接客户端ip:   "+client.getInetAddress()+"\n");
            fileWriter.write("连接客户端port:   "+client.getPort()+"\n"+"\n");
            fileWriter.close();
        }catch (Exception e){

        }


    }

    public void close() {
        //如果服务器Socket已被打开
        if (server != null) {
            try {
                server.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }




    /**
     * 在向量中按登录用户ID寻找客户端
     */
//    public boolean searchClientConnection(String curUser) {
//        for (ServerThread ct: manyserver) {
//            if (ct.curUser != null && ct.curUser.equals(curUser)) {
//                return true;
//            }
//        }
//
//        return false;
//    }
}
