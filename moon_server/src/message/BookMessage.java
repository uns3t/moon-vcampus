package message;

import java.io.Serializable;
import java.util.ArrayList;

public class BookMessage implements Serializable {

    private String type = "Book";
    ArrayList<BookInfo> bookInfo= null;


    public void setbookInfo(ArrayList<BookInfo> booklist){
        bookInfo=booklist;
    }
    public ArrayList getbookInfo(){
        return bookInfo;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
