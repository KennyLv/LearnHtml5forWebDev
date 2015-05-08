package upload.action;

import org.apache.struts2.ServletActionContext;

public class ToIndexAction {
	private int size = 10;
	
	public String execute(){
		ServletActionContext.getRequest().setAttribute("limtallsize", 999990000);
		
		return "topage";
	}

	public int getSize() {
		return size;
	}

	public void setSize(int size) {
		this.size = size;
	}
	
	
}
