package upload.action;

import java.io.File;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import org.apache.struts2.ServletActionContext;

public class UploadAction
{
    private File Filedata;

    private String FiledataFileName;

    private String FiledataContentType;

    // 文件夹目录
    private static final String basePath = "fileupload\\groupResource";

    public String execute()
    {
    	
    	String s = (String)ServletActionContext.getRequest().getParameter("god");
    	String s2 = (String)ServletActionContext.getRequest().getParameter("uid");
    	if (Filedata != null && Filedata.length() > 0)
        {
        	// 群组名字作为最后的文件夹
        	String groupFileName = "haoba";
        	
            String uploadPath = ServletActionContext.getServletContext()
                    .getRealPath(basePath+"\\"+groupFileName);
            File path = new File(uploadPath);
            
            if (!path.exists())
            {
                path.mkdirs();
            }else{
            	//文件已存在
            	//FiledataFileName 
            }
            
            String newPath = uploadPath +"\\"+FiledataFileName;
            Filedata.renameTo(new File(newPath));
           
            // 保存到数据库中的路径
            String savePath = basePath+"\\"+groupFileName+"\\"+FiledataFileName;
            
        }

        return null;
    }

    // 上传文件
    private String pathSplit(String timeStr, String o, String n)
    {
        StringBuffer sb = new StringBuffer();
        for (String a : timeStr.split(o))
        {
            sb.append(a);
            sb.append(n);
        }
        sb.deleteCharAt(sb.length() - 1);
        return sb.toString();
    }

    public static String format(Date date, String parttern)
    {
        DateFormat df = new SimpleDateFormat(parttern);
        return df.format(date);
    }    
    
    public File getFiledata()
    {
        return Filedata;
    }

    public void setFiledata(File filedata)
    {
        Filedata = filedata;
    }

    public String getFiledataFileName()
    {
        return FiledataFileName;
    }

    public void setFiledataFileName(String filedataFileName)
    {
        FiledataFileName = filedataFileName;
    }

    public String getFiledataContentType()
    {
        return FiledataContentType;
    }

    public void setFiledataContentType(String filedataContentType)
    {
        FiledataContentType = filedataContentType;
    }
    
    public static void main(String[] args) {
		System.out.println(0.444<1);
	}
}
