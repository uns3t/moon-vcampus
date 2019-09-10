
package message;

import java.io.Serializable;

public class Message implements Serializable{
    private String type;
    private String data;
    private boolean response = false;
    //sssss
    public void setType(String t){ this.type = t; }
    public String getType(){ return this.type; }
    public void setData(String d){ this.data = d; }
    public String getData(){ return this.data; }

    public void setResponse(boolean response){ this.response = response; }
    public boolean getResponse(){ return response; }




}
