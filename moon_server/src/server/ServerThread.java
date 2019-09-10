package server;


import com.alibaba.fastjson.JSONArray;
import message.*;
import DAO.*;

import java.io.*;
import java.net.Socket;
import java.lang.Exception;
import java.util.ArrayList;
import java.util.Date;
import com.alibaba.fastjson.JSON;


public class ServerThread extends Thread {
    private Server currentServer;

    private Socket client;

    private InputStream ois;


    public static String theUsr;

    public static ToAccess toAccess;



    public ServerThread(Socket s, Server st) {
        client = s;
        currentServer = st;
        theUsr = "";
        try {
            //建立输入输出流（次序与客户端相反）
            ois = client.getInputStream();

            System.out.println("Client connected");

        } catch (IOException e) {
            System.out.println("Cannot get IO stream");
            e.printStackTrace();
        }
    }

    public void run() {
        toAccess=new ToAccess();
        toAccess.getcon();
        Message message=null;
            //读取消息
            try {
                String message_str=inputStreamAsString(ois);
                message = JSON.parseObject(message_str,Message.class);
                System.out.println(message.getType());
            } catch (Exception e) {
//                e.printStackTrace();
                //客户端已关闭
//                System.out.println("连接断开");
//                return;
            }

            //判断消息属于哪一类型，调用对应模块函数完成相应功能
            switch (message.getType()) {


                //用户模块
                case "Login":
                    Login(message);
                    break;

                case "SignUp":
                    Signup(message);
                    break;

                case "UsrDelete":
                    deleteusr(message);
                    break;

                case "UsrUpdate":
                    updateusr(message);
                    break;


                //学籍管理模块
                case "Student":
                    Studentlist();
                    break;

                case "AddStudent":
                    addstudent(message);
                    break;

                case "DeleteStudent":
                    deletestudent(message);
                    break;

                case "UpdateStudent":
                    updatestudent(message);
                    break;

                case "UsrStudent":
                    usrstudent(message);
                    break;
//
//                //图书馆模块
                case "Book":
                    Librarylist();
                    break;

                case "BookBorrow":
                    bookBorrow(message);
                    break;

                case "AddBook":
                    addbook(message);
                    break;

                case "DeleteBook":
                    deletebook(message);
                    break;

                case "UpdateBook":
                    updatebook(message);
                    break;


//                //商店模块
                case "Shop":
                    Shoplist();
                    break;

                case "Buy":
                    buyshop(message);
                    break;

                case "AddGood":
                    addshop(message);
                    break;

                case "DeleteGood":
                    deleteshop(message);
                    break;

                case "UpdateGood":
                    updateshop(message);
                    break;

                case "PwdConfirm":
                    pwdconfrim(message);
                    break;

//                //课程选择模块
                case "Course":
                    Courselist();
                    break;

                case "AddCourse":
                    addcourse(message);
                    break;

                case "DeleteCourse":
                    deletecourse(message);
                    break;

                case "CourseSelect":
                    selectcourse(message);
                    break;

                case "UpdateCourse":
                    updatecourse(message);
                    break;
            }
        }


    public void close() {
        if (client != null) {
            try {
                ois.close();


                client.close();


            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    //-------------------------工具函数------------------------------------------------------------

    public void sendmsg(Message message)throws Exception{
        client=new Socket("127.0.0.1",10002);
        String out="server端信息";
        client.getOutputStream().write(JSON.toJSONString(message).getBytes());
        client.getOutputStream().flush();
        close();
        System.out.println("服务器发送成功");

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

    //------------------------------具体功能模块----------------------------------------------------
    //--------------------------------------------------------------------------------------------

    //------------------------------用户模块-------------------------------------
    public void Login(Message message){

        UsrMessage usrMessage =JSON.parseObject(message.getData(),UsrMessage.class);
        try {
            int temp=toAccess.getusr().Logincheck(usrMessage.getUsr_id(), usrMessage.getUsr_pwd());
            if(temp==1){
                theUsr= usrMessage.getUsr_id();
                usrMessage.set_isadmin(true);
                message.setData(JSON.toJSONString(usrMessage));
                System.out.println(message.getData());

                message.setResponse(true);
                sendmsg(message);
            }else if(temp==0){
                theUsr= usrMessage.getUsr_id();
                usrMessage.set_isadmin(false);
                message.setData(JSON.toJSONString(usrMessage));
                System.out.println(message.getData());
                message.setResponse(true);
                sendmsg(message);
            }else {
                message.setResponse(false);
                sendmsg(message);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
    }

    public void Signup(Message message){
        UsrMessage signupMessage=JSON.parseObject(message.getData(),UsrMessage.class);
        try {
            toAccess.getusr().signup(signupMessage.getUsr_name(),signupMessage.getUsr_pwd(),signupMessage.getUsr_id());
            message.setResponse(true);
            sendmsg(message);
        }catch (Exception e){

        }
    }

    public void deleteusr(Message message){
        UsrMessage usrMessage=JSON.parseObject(message.getData(),UsrMessage.class);
        try {
            toAccess.getusr().deleteUsr(usrMessage.getUsr_id());
            message.setResponse(true);
            sendmsg(message);
        }catch (Exception e){

        }
    }

    public void updateusr(Message message){
        UsrMessage signupMessage=JSON.parseObject(message.getData(),UsrMessage.class);
        try {
            toAccess.getusr().updateusr(signupMessage.getUsr_name(),signupMessage.getUsr_pwd(),signupMessage.getUsr_id());
            message.setResponse(true);
            sendmsg(message);
        }catch (Exception e){

        }
    }


//    -----------------------------图书馆模块--------------------------------------------
    public void Librarylist(){
        BookMessage bookMessage=new BookMessage();
        try {
            ArrayList<BookInfo> bookInfos=toAccess.getBook().listBook();

            Message msg=new Message();
            String temp=JSON.toJSONString(bookInfos);
            msg.setData(temp);
            System.out.println(temp);
            msg.setResponse(true);
            sendmsg(msg);
        }catch (Exception e){}
    }


    public void bookBorrow(Message message){
        BookInfo bookInfo=JSON.parseObject(message.getData(),BookInfo.class);
        try {
            toAccess.getBook().addBookborrow(bookInfo.getBook_id());
            message.setResponse(true);
            sendmsg(message);
        }catch (Exception e){

        }
    }
//
    public void addbook(Message message){
        BookInfo bookInfo=JSON.parseObject(message.getData(),BookInfo.class);
        try {
            toAccess.getBook().addBook(bookInfo.getBook_name(),bookInfo.getBook_id(),bookInfo.getBook_author(),bookInfo.getBook_press(),
                    bookInfo.getBook_total()+"",bookInfo.getBook_borrowed()+"",bookInfo.getBook_introduction());
            message.setResponse(true);
            sendmsg(message);
        }catch (Exception e){}
    }

    public void deletebook(Message message){
        BookInfo bookInfo=JSON.parseObject(message.getData(),BookInfo.class);
        try {
            toAccess.getBook().deleteBook(bookInfo.getBook_id());
            message.setResponse(true);
            sendmsg(message);
        }catch (Exception e){}
    }

    public void updatebook(Message message){
        BookInfo bookInfo=JSON.parseObject(message.getData(),BookInfo.class);
        try {
            toAccess.getBook().updateBook(bookInfo.getBook_name(),bookInfo.getBook_id(),bookInfo.getBook_author(),bookInfo.getBook_press(),
                    bookInfo.getBook_total()+"",bookInfo.getBook_borrowed()+"",bookInfo.getBook_introduction());
            message.setResponse(true);
            sendmsg(message);
        }catch (Exception e){}
    }

//    //-------------------------------学籍管理----------------------------------------------
    public void Studentlist(){
        StudentMessage studentMessage=new StudentMessage();
        try {
            studentMessage.setStudentlist(toAccess.getstudent().listStudent());
            Message msg=new Message();
            msg.setData(JSON.toJSONString(studentMessage));

            msg.setResponse(true);
            sendmsg(msg);
        }catch (Exception e){}
    }

    public void addstudent(Message message){
        Studentinfo studentinfo=JSON.parseObject(message.getData(),Studentinfo.class);

        try {
            toAccess.getstudent().addStudent(studentinfo.getStudent_id(),studentinfo.getStudent_name(),studentinfo.getStudent_college()
            ,studentinfo.getStudent_onecardid(),studentinfo.getStudent_phone(),studentinfo.getStudent_card_type(),studentinfo.getStudent_card_id(),studentinfo.getStudent_ins(),
            studentinfo.getStudent_birthday(),studentinfo.getStudent_shengyuandi(),studentinfo.getStudent_sex());
            message.setResponse(true);
            sendmsg(message);
        }catch (Exception e){}

    }

    public void deletestudent(Message message){
        Studentinfo studentinfo=JSON.parseObject(message.getData(),Studentinfo.class);
        try {
            toAccess.getstudent().deleteStudent(studentinfo.getStudent_id());
            message.setResponse(true);
            sendmsg(message);
        }catch (Exception e){}
    }


    public void updatestudent(Message message){
        Studentinfo studentinfo=JSON.parseObject(message.getData(),Studentinfo.class);
        try {
            toAccess.getstudent().updateStudent(studentinfo.getStudent_id(),studentinfo.getStudent_name(),studentinfo.getStudent_college()
                    ,studentinfo.getStudent_onecardid(),studentinfo.getStudent_phone(),studentinfo.getStudent_card_type(),studentinfo.getStudent_card_id(),studentinfo.getStudent_ins(),
                    studentinfo.getStudent_birthday(),studentinfo.getStudent_shengyuandi(),studentinfo.getStudent_sex());
            message.setResponse(true);
            sendmsg(message);
        }catch (Exception e){}

    }

    public void usrstudent(Message message){
        String id=message.getData();

        try {
            String temp=JSON.toJSONString(toAccess.getstudent().usrStudent(id));
            System.out.println(temp);
            message.setData(temp);

            message.setResponse(true);
            sendmsg(message);
        }catch (Exception e){}
    }

//    //-----------------------------------课程模块-------------------------------------------
    public void Courselist(){
        CourseMessage courseMessage=new CourseMessage();
        try {
            courseMessage.setCourselist(toAccess.getCourse().listcourse());
            Message msg=new Message();
            msg.setResponse(true);
            msg.setData(JSON.toJSONString(courseMessage));
            sendmsg(msg);
        }catch (Exception e){
        }
    }

    public void addcourse(Message message){
        CourseInfo courseInfo=JSON.parseObject(message.getData(),CourseInfo.class);
        try {
            toAccess.getCourse().addcourse(courseInfo.getCourse_name(),courseInfo.getCourse_id(),courseInfo.getCourse_teacher(),courseInfo.getCourse_time());
            message.setResponse(true);
            sendmsg(message);
        }catch (Exception e){

        }
    }

    public void deletecourse(Message message){
        CourseInfo courseInfo=JSON.parseObject(message.getData(),CourseInfo.class);
        try {
            toAccess.getCourse().deletecourse(courseInfo.getCourse_id());
            message.setResponse(true);
            sendmsg(message);
        }catch (Exception e){
        }
    }

    public void selectcourse(Message message){
        System.out.println(message.getData());
        CourseInfo courseInfo=JSON.parseObject(message.getData(),CourseInfo.class);
        try {
            toAccess.getCourse().addCourseSelect(courseInfo.getCourse_id());
            message.setResponse(true);
            sendmsg(message);
        }catch (Exception e){
        }
    }
//
    public void updatecourse(Message message){
        CourseInfo courseInfo=JSON.parseObject(message.getData(),CourseInfo.class);
        try {
            toAccess.getCourse().updatecourse(courseInfo.getCourse_name(),courseInfo.getCourse_id(),courseInfo.getCourse_teacher(),courseInfo.getCourse_time());
            message.setResponse(true);
            sendmsg(message);
        }catch (Exception e){
        }
    }
//
//    //--------------------------------------商店模块-----------------------------------------
//
//
    public void pwdconfrim(Message message){
        UsrMessage usrMessage =JSON.parseObject(message.getData(),UsrMessage.class);
        try {
            int temp=toAccess.getusr().Logincheck(usrMessage.getUsr_id(), usrMessage.getUsr_pwd());
            if(temp==1){
                theUsr= usrMessage.getUsr_id();
                usrMessage.set_isadmin(true);
                message.setData(JSON.toJSONString(usrMessage));
                System.out.println(message.getData());

                message.setResponse(true);
                sendmsg(message);
            }else if(temp==0){
                theUsr= usrMessage.getUsr_id();
                usrMessage.set_isadmin(false);
                message.setData(JSON.toJSONString(usrMessage));
                System.out.println(message.getData());
                message.setResponse(true);
                sendmsg(message);
            }else {
                message.setResponse(false);
                sendmsg(message);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
    }
//
//
    public void Shoplist(){
        ShopMessage shopMessage=new ShopMessage();
        try {
            ArrayList<GoodsInfo> goodsInfos=toAccess.getshop().listShop();
            Message msg=new Message();
            msg.setData(JSON.toJSONString(goodsInfos));
            System.out.println(msg.getData());
            msg.setResponse(true);
            sendmsg(msg);
        }catch (Exception e){

        }
    }
//
    public void addshop(Message message){
        GoodsInfo goodsInfo=JSON.parseObject(message.getData(),GoodsInfo.class);
        System.out.println(message.getData());
        try {
            toAccess.getshop().addShop(goodsInfo.getGoods_id(),goodsInfo.getGoods_name(),goodsInfo.getGoods_price()+"",
                    goodsInfo.getGoods_quantity()+"",goodsInfo.getGoods_sales()+"");
            message.setResponse(true);
            sendmsg(message);
        }catch (Exception e){

        }
    }
//
    public void deleteshop(Message message){
        GoodsInfo goodsInfo=JSON.parseObject(message.getData(),GoodsInfo.class);
        try {
            System.out.println(goodsInfo.getGoods_id());
            toAccess.getshop().deleteShop(goodsInfo.getGoods_id());
            message.setResponse(true);
            sendmsg(message);
        }catch (Exception e){

        }
    }
//
    public void buyshop(Message message){
        System.out.println("buyshop function");
        GoodsInfo goodsInfo=JSON.parseObject(message.getData(),GoodsInfo.class);
        try {
            toAccess.getshop().buygoods(goodsInfo.getGoods_id(),goodsInfo.getGoods_quantity());
            message.setResponse(true);
            sendmsg(message);
        }catch (Exception e){
            e.printStackTrace();
        }
    }
    public void updateshop(Message message){
        GoodsInfo goodsInfo=JSON.parseObject(message.getData(),GoodsInfo.class);
        try {
            toAccess.getshop().updateShop(goodsInfo.getGoods_id(),goodsInfo.getGoods_name(),goodsInfo.getGoods_price()+"",
                    goodsInfo.getGoods_quantity()+"",goodsInfo.getGoods_sales()+"");
            message.setResponse(true);
            sendmsg(message);
        }catch (Exception e){

        }
    }

}
