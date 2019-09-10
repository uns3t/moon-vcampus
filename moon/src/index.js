const app=require("electron").app;
const BrowserWindow=require("electron").BrowserWindow;
const net=require("net");
const ipcMain = require('electron').ipcMain;


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let otwin=null;
let theusrid;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/view/login.html`);
// mainWindow.loadURL(`file://${__dirname}/admin/addbook.html`);

//   mainWindow.loadURL(`file://${__dirname}/view/admin.html`);


  // Open the DevTools.
//   mainWindow.webContents.openDevTools();
//   con.write("test")
  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
};



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// app.on('activate', () => {
//   // On OS X it's common to re-create a window in the app when the
//   // dock icon is clicked and there are no other windows open.
//   if (mainWindow === null) {
//     createWindow();
//   }
// });

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

//----------------------------跳转-------------------------

ipcMain.on("adminfunc",function(event,id){
    id=id+".html"
    console.log(id);
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 700,
      });
    mainWindow.loadURL(`file://${__dirname}/admin/${id}`);
})


ipcMain.on("loginout",function(){
    toanother("login.html");
})

ipcMain.on("tologin",function(event,arg){
    
    toanother("login.html");

});

ipcMain.on("tosignup",function(event,arg){
    
    toanother("signup.html");

});

ipcMain.on("tomain",function(event,arg){
    
    toanother("student.html");

});

ipcMain.on("tostudent",function(event,arg){
    
    toanother("student.html");

});

ipcMain.on("tobook",function(event,arg){
    
    toanother("book.html");

});

ipcMain.on("tocourse",function(event,arg){
    
    toanother("course.html");

});

ipcMain.on("toshop",function(event,arg){
    
    toanother("shop.html");

});

ipcMain.on("tousr",function(event,arg){
    
    toanother("usr.html");

});

function toanother(path1){
    if(mainWindow==null){
        mainWindow = new BrowserWindow({
            width: 1000,
            height: 650,
          });
        mainWindow.loadURL(`file://${__dirname}/view/${path1}`);
        otwin.close()
        otwin=null  
    }
    else{
        otwin = new BrowserWindow({
            width: 1000,
            height: 600,
          });
        otwin.loadURL(`file://${__dirname}/view/${path1}`);
        mainWindow.close()
        mainWindow=null
    }
}



// -----------------------------用户---------------------------

ipcMain.on("getusrid",function(event,arg){
    // theusrid="test";
    event.sender.send("loadusr",theusrid);
            
})

ipcMain.on("login",function(event,id,pwd){
    theusrid=id;
    var con=net.connect(10001)
    var usr={
        Usr_id:id,
        Usr_pwd:pwd,
    }
    var usr_temp=JSON.stringify(usr)
    var msg={
        data:usr_temp,
        type:"Login"
    }
    var msg_temp=JSON.stringify(msg)
    con.write(msg_temp)
    con.end();

    var msg;
    var server = net.createServer(function(socket) { 
            console.log("服务启动")
            socket.on("data", function(data) {
            msg=JSON.parse(data.toString());
            var msgu=JSON.parse(msg.data);
            console.log(msgu);
            // console.log(msg);
            // console.log(msg.response);
            if(msgu.isadmin){
                toanother("admin.html");
            }else{
                event.sender.send("logincheck",msg.response);
            }
            });
            socket.on('end', function() {
                server.close();
                console.log("服务关闭")
            });
            socket.on('error', function() {
            server.close();
            console.log("服务关闭")
        });
    });
    server.listen(10002);
})

ipcMain.on("signup",function(event,usrname,usrid,pwd){
    var con=net.connect(10001)
    var usr={
        Usr_name:usrname,
        Usr_id:usrid,
        Usr_pwd:pwd,
    }
    var usr_temp=JSON.stringify(usr)
    var msg={
        data:usr_temp,
        type:"SignUp"
    }
    var msg_temp=JSON.stringify(msg)
    con.write(msg_temp)
    con.end();

    var msgr;
    var server = net.createServer(function(socket) { 
            console.log("服务启动")
            socket.on("data", function(data) {
            msgr=JSON.parse(data.toString());
            console.log(msgr);
            console.log(msgr.response);
            event.sender.send("signupcheck",msgr.response);
            });
            socket.on('end', function() {
                server.close();
                console.log("服务关闭")
            });
            socket.on('error', function() {
            server.close();
            console.log("服务关闭")
        });
    });
    server.listen(10002);
})

ipcMain.on("updateusr",function(event,usrname,pwd){
    var con=net.connect(10001)
    var usr={
        Usr_name:usrname,
        Usr_id:theusrid,
        Usr_pwd:pwd,
    }
    var usr_temp=JSON.stringify(usr)
    var msg={
        data:usr_temp,
        type:"UsrUpdate"
    }
    var msg_temp=JSON.stringify(msg)
    con.write(msg_temp)
    con.end();

    var msgr;
    var server = net.createServer(function(socket) { 
            console.log("服务启动")
            socket.on("data", function(data) {
            msgr=JSON.parse(data.toString());
            console.log(msgr);
            console.log(msgr.response);
            event.sender.send("usrreturn",msgr.response);
            });
            socket.on('end', function() {
                server.close();
                console.log("服务关闭")
            });
            socket.on('error', function() {
            server.close();
            console.log("服务关闭")
        });
    });
    server.listen(10002);
})

//--------------------学籍----------------------

ipcMain.on("studentupdate",function(event,student){
    var con=net.connect(10001)
    
    var student_temp=JSON.stringify(student)
    console.log(student_temp);
    var msg={
        data:student_temp,
        type:"UpdateStudent"
    }
    var msg_temp=JSON.stringify(msg)
    con.write(msg_temp)
    con.end();

    var msgr;
    var server = net.createServer(function(socket) { 
            console.log("服务启动")
            socket.on("data", function(data) {
            msgr=JSON.parse(data.toString());
            console.log(msgr);
            console.log(msgr.response);
            event.sender.send("studentreturn",msgr.response);
            });
            socket.on('end', function() {
                server.close();
                console.log("服务关闭")
            });
            socket.on('error', function() {
            server.close();
            console.log("服务关闭")
        });
    });
    server.listen(10002);
})

ipcMain.on("onestudentmain",function(event,arg){
    var con=net.connect(10001)
    // theusrid="1"
    var msg={
        data:theusrid,
        type:"UsrStudent"
    }
    var msg_temp=JSON.stringify(msg)
    con.write(msg_temp)
    con.end();

    var msgr;
    var server = net.createServer(function(socket) { 
            console.log("服务启动")
            socket.on("data", function(data) {
            msgr=JSON.parse(data.toString());
            var std=JSON.parse(msgr.data);
            console.log(msgr);
            console.log(std);
            event.sender.send("loadonestudent",std);
            });
            socket.on('end', function() {
                server.close();
                console.log("服务关闭")
            });
            socket.on('error', function() {
            server.close();
            console.log("服务关闭")
        });
    });
    server.listen(10002);
})


ipcMain.on("addstudent",function(event,student){
    var con=net.connect(10001)
    
    var student_temp=JSON.stringify(student)
    console.log(student_temp);
    var msg={
        data:student_temp,
        type:"AddStudent"
    }
    var msg_temp=JSON.stringify(msg)
    con.write(msg_temp)
    con.end();

    var msgr;
    var server = net.createServer(function(socket) { 
            console.log("服务启动")
            socket.on("data", function(data) {
            msgr=JSON.parse(data.toString());
            console.log(msgr);
            console.log(msgr.response);
            event.sender.send("addstudentreturn",msgr.response);
            });
            socket.on('end', function() {
                server.close();
                console.log("服务关闭")
            });
            socket.on('error', function() {
            server.close();
            console.log("服务关闭")
        });
    });
    server.listen(10002);
})

ipcMain.on("deletestudent",function(event,student){
    var con=net.connect(10001)
    
    var student_temp=JSON.stringify(student)
    console.log(student_temp);
    var msg={
        data:student_temp,
        type:"DeleteStudent"
    }
    var msg_temp=JSON.stringify(msg)
    con.write(msg_temp)
    con.end();

    var msgr;
    var server = net.createServer(function(socket) { 
            console.log("服务启动")
            socket.on("data", function(data) {
            msgr=JSON.parse(data.toString());
            console.log(msgr);
            console.log(msgr.response);
            event.sender.send("deletestudentreturn",msgr.response);
            });
            socket.on('end', function() {
                server.close();
                console.log("服务关闭")
            });
            socket.on('error', function() {
            server.close();
            console.log("服务关闭")
        });
    });
    server.listen(10002);
})

//------------------------------shop--------------------------
ipcMain.on("getshop",function(event,arg){
    try{
    var con=net.connect(10001)
    var msg={
        data:"",
        type:"Shop"
    }
    var msg_temp=JSON.stringify(msg)
    con.write(msg_temp)
    con.end();

    var msgr;
    var server = net.createServer(function(socket) { 
            console.log("server start")
            socket.on("data", function(data) {
            msgr=JSON.parse(data.toString());
            var std=JSON.parse(msgr.data);
            event.sender.send("loadshop",std);
            
            });
            socket.on('end', function() {
                server.close();
                console.log("server down1")
            });
            socket.on('error', function() {
                server.close();
                console.log("server down2")
            });
        });
        server.listen(10002);
    }catch(e){
        console.log(e);
    }
    
})

ipcMain.on("buy",function(event,good){
    try{
        var con=net.connect(10001)
    
    var good_temp=JSON.stringify(good)
    var msg={
        data:good_temp,
        type:"Buy"
    }
    var msg_temp=JSON.stringify(msg)
    con.write(msg_temp)
    con.end();

    var msgr;
    var server = net.createServer(function(socket) { 
            console.log("server start")
            socket.on("data", function(data) {
            msgr=JSON.parse(data.toString());
            event.sender.send("shopreturn",msgr.response);
            });
            socket.on('end', function() {
                server.close();
                console.log("server down1")
            });
            socket.on('error', function() {
                server.close();
                console.log("server down2")
        });
    });
        server.listen(10002);
    }catch(e){
        console.log(e);
    }
})

ipcMain.on("addgood",function(event,good){
    try{
        var con=net.connect(10001)
    
    var good_temp=JSON.stringify(good)
    var msg={
        data:good_temp,
        type:"AddGood"
    }
    var msg_temp=JSON.stringify(msg)
    con.write(msg_temp)
    con.end();

    var msgr;
    var server = net.createServer(function(socket) { 
            console.log("server start")
            socket.on("data", function(data) {
            msgr=JSON.parse(data.toString());
            event.sender.send("addgoodreturn",msgr.response);
            });
            socket.on('end', function() {
                server.close();
                console.log("server down1")
            });
            socket.on('error', function() {
                server.close();
                console.log("server down2")
        });
    });
        server.listen(10002);
    }catch(e){
        console.log(e);
    }
})

ipcMain.on("updategood",function(event,good){
    try{
        var con=net.connect(10001)
    
    var good_temp=JSON.stringify(good)
    var msg={
        data:good_temp,
        type:"UpdateGood"
    }
    var msg_temp=JSON.stringify(msg)
    con.write(msg_temp)
    con.end();

    var msgr;
    var server = net.createServer(function(socket) { 
            console.log("server start")
            socket.on("data", function(data) {
            msgr=JSON.parse(data.toString());
            event.sender.send("updategoodreturn",msgr.response);
            });
            socket.on('end', function() {
                server.close();
                console.log("server down1")
            });
            socket.on('error', function() {
                server.close();
                console.log("server down2")
        });
    });
        server.listen(10002);
    }catch(e){
        console.log(e);
    }
})

ipcMain.on("deletegood",function(event,good){
    try{
        var con=net.connect(10001)
    
    var good_temp=JSON.stringify(good)
    var msg={
        data:good_temp,
        type:"DeleteGood"
    }
    var msg_temp=JSON.stringify(msg)
    con.write(msg_temp)
    con.end();

    var msgr;
    var server = net.createServer(function(socket) { 
            console.log("server start")
            socket.on("data", function(data) {
            msgr=JSON.parse(data.toString());
            event.sender.send("deletegoodreturn",msgr.response);
            });
            socket.on('end', function() {
                server.close();
                console.log("server down1")
            });
            socket.on('error', function() {
                server.close();
                console.log("server down2")
        });
    });
        server.listen(10002);
    }catch(e){
        console.log(e);
    }
})


//---------------------选课---------------------

ipcMain.on("getcourse",function(event,arg){
    try{
    var con=net.connect(10001)
    var msg={
        data:"",
        type:"Course"
    }
    var msg_temp=JSON.stringify(msg)
    con.write(msg_temp)
    con.end();

    var msgr;
    var server = net.createServer(function(socket) { 
            console.log("server start")
            socket.on("data", function(data) {
            msgr=JSON.parse(data.toString());
            var std=JSON.parse(msgr.data);
            console.log(std.course);
            event.sender.send("loadcourse",std.course);
            
            });
            socket.on('end', function() {
                server.close();
                console.log("server down1")
            });
            socket.on('error', function() {
                server.close();
                console.log("server down2")
            });
        });
        server.listen(10002);
    }catch(e){
        console.log(e);
    }
    
})

ipcMain.on("selectcouse",function(event,course){
    try{
        var con=net.connect(10001)
    
    var course_temp=JSON.stringify(course)
    var msg={
        data:course_temp,
        type:"CourseSelect"
    }
    var msg_temp=JSON.stringify(msg)
    con.write(msg_temp)
    con.end();

    var msgr;
    var server = net.createServer(function(socket) { 
            console.log("server start")
            socket.on("data", function(data) {
            msgr=JSON.parse(data.toString());
            event.sender.send("coursereturn",msgr.response);
            });
            socket.on('end', function() {
                server.close();
                console.log("server down1")
            });
            socket.on('error', function() {
                server.close();
                console.log("server down2")
        });
    });
        server.listen(10002);
    }catch(e){
        console.log(e);
    }
})

ipcMain.on("addcourse",function(event,course){
    try{
        var con=net.connect(10001)
    
    var course_temp=JSON.stringify(course)
    var msg={
        data:course_temp,
        type:"AddCourse"
    }
    var msg_temp=JSON.stringify(msg)
    con.write(msg_temp)
    con.end();

    var msgr;
    var server = net.createServer(function(socket) { 
            console.log("server start")
            socket.on("data", function(data) {
            msgr=JSON.parse(data.toString());
            event.sender.send("addcoursereturn",msgr.response);
            });
            socket.on('end', function() {
                server.close();
                console.log("server down1")
            });
            socket.on('error', function() {
                server.close();
                console.log("server down2")
        });
    });
        server.listen(10002);
    }catch(e){
        console.log(e);
    }
})

ipcMain.on("updatecourse",function(event,course){
    try{
        var con=net.connect(10001)
    
    var course_temp=JSON.stringify(course)
    var msg={
        data:course_temp,
        type:"UpdateCourse"
    }
    var msg_temp=JSON.stringify(msg)
    con.write(msg_temp)
    con.end();

    var msgr;
    var server = net.createServer(function(socket) { 
            console.log("server start")
            socket.on("data", function(data) {
            msgr=JSON.parse(data.toString());
            event.sender.send("updatecoursereturn",msgr.response);
            });
            socket.on('end', function() {
                server.close();
                console.log("server down1")
            });
            socket.on('error', function() {
                server.close();
                console.log("server down2")
        });
    });
        server.listen(10002);
    }catch(e){
        console.log(e);
    }
})

ipcMain.on("deletecourse",function(event,course){
    try{
        var con=net.connect(10001)
    
    var course_temp=JSON.stringify(course)
    var msg={
        data:course_temp,
        type:"DeleteCourse"
    }
    var msg_temp=JSON.stringify(msg)
    con.write(msg_temp)
    con.end();

    var msgr;
    var server = net.createServer(function(socket) { 
            console.log("server start")
            socket.on("data", function(data) {
            msgr=JSON.parse(data.toString());
            event.sender.send("deletecoursereturn",msgr.response);
            });
            socket.on('end', function() {
                server.close();
                console.log("server down1")
            });
            socket.on('error', function() {
                server.close();
                console.log("server down2")
        });
    });
        server.listen(10002);
    }catch(e){
        console.log(e);
    }
})

//----------------借书------------------
ipcMain.on("getbook",function(event,arg){
    try{
    var con=net.connect(10001)
    var msg={
        data:"",
        type:"Book"
    }
    var msg_temp=JSON.stringify(msg)
    con.write(msg_temp)
    con.end();

    var msgr;
    var server = net.createServer(function(socket) { 
            console.log("server start")
            socket.on("data", function(data) {
            msgr=JSON.parse(data.toString());
            var std=JSON.parse(msgr.data);
            console.log(std);
            event.sender.send("loadbook",std);
            
            });
            socket.on('end', function() {
                server.close();
                console.log("server down1")
            });
            socket.on('error', function() {
                server.close();
                console.log("server down2")
            });
        });
        server.listen(10002);
    }catch(e){
        console.log(e);
    }
    
})

ipcMain.on("borrow",function(event,book){
    try{
        var con=net.connect(10001)
    
    var book_temp=JSON.stringify(book)
    var msg={
        data:book_temp,
        type:"BookBorrow"
    }
    var msg_temp=JSON.stringify(msg)
    con.write(msg_temp)
    con.end();

    var msgr;
    var server = net.createServer(function(socket) { 
            console.log("server start")
            socket.on("data", function(data) {
            msgr=JSON.parse(data.toString());
            event.sender.send("borrowreturn",msgr.response);
            });
            socket.on('end', function() {
                server.close();
                console.log("server down1")
            });
            socket.on('error', function() {
                server.close();
                console.log("server down2")
        });
    });
        server.listen(10002);
    }catch(e){
        console.log(e);
    }
})

ipcMain.on("addbook",function(event,book){
    try{
        var con=net.connect(10001)
    
    var book_temp=JSON.stringify(book)
    var msg={
        data:book_temp,
        type:"AddBook"
    }
    var msg_temp=JSON.stringify(msg)
    con.write(msg_temp)
    con.end();

    var msgr;
    var server = net.createServer(function(socket) { 
            console.log("server start")
            socket.on("data", function(data) {
            msgr=JSON.parse(data.toString());
            event.sender.send("addbookreturn",msgr.response);
            });
            socket.on('end', function() {
                server.close();
                console.log("server down1")
            });
            socket.on('error', function() {
                server.close();
                console.log("server down2")
        });
    });
        server.listen(10002);
    }catch(e){
        console.log(e);
    }
})

ipcMain.on("updatebook",function(event,book){
    try{
        var con=net.connect(10001)
    
    var book_temp=JSON.stringify(book)
    var msg={
        data:book_temp,
        type:"UpdateBook"
    }
    var msg_temp=JSON.stringify(msg)
    con.write(msg_temp)
    con.end();

    var msgr;
    var server = net.createServer(function(socket) { 
            console.log("server start")
            socket.on("data", function(data) {
            msgr=JSON.parse(data.toString());
            event.sender.send("updatebookreturn",msgr.response);
            });
            socket.on('end', function() {
                server.close();
                console.log("server down1")
            });
            socket.on('error', function() {
                server.close();
                console.log("server down2")
        });
    });
        server.listen(10002);
    }catch(e){
        console.log(e);
    }
})

ipcMain.on("deletebook",function(event,book){
    try{
        var con=net.connect(10001)
    
    var book_temp=JSON.stringify(book)
    var msg={
        data:book_temp,
        type:"DeleteBook"
    }
    var msg_temp=JSON.stringify(msg)
    con.write(msg_temp)
    con.end();

    var msgr;
    var server = net.createServer(function(socket) { 
            console.log("server start")
            socket.on("data", function(data) {
            msgr=JSON.parse(data.toString());
            event.sender.send("deletebookreturn",msgr.response);
            });
            socket.on('end', function() {
                server.close();
                console.log("server down1")
            });
            socket.on('error', function() {
                server.close();
                console.log("server down2")
        });
    });
        server.listen(10002);
    }catch(e){
        console.log(e);
    }
})