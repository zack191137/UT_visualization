package PDFtoText;

import java.io.*;  


import org.apache.pdfbox.exceptions.InvalidPasswordException;  
  
import org.apache.pdfbox.pdmodel.PDDocument;  

import org.apache.pdfbox.util.PDFTextStripper;  
import org.apache.pdfbox.util.TextPosition; 


public class findItalic extends PDFTextStripper{
	private static String a=null;
	
	static boolean token=false;
	 public findItalic() throws IOException {  
	        super.setSortByPosition(true);  
	    }
	
	  
	    public static void main(String[] args) throws Exception {  
	  
	        PDDocument document = null;  
//	        try {  
	            File input = new File("/Users/Zack/Desktop/9.pdf");  
	            document = PDDocument.load(input);  
	            if (document.isEncrypted()) {  
	                try {  
	                    document.decrypt("");  
	                } catch (InvalidPasswordException e) {  
	                    System.err.println("Error: Document is encrypted with a password.");  
	                    System.exit(1);  
	                }  
	            } 
	            
	            
	            findItalic printer = new findItalic();
	            printer.getText(document);
//	            System.out.printf(a);
	            a.replaceAll("Inc.", "Inc.\n");
	            FileOperation.contentToTxt("/Users/Zack/Desktop/11.txt", a);
	            
//	            printer.document=document;
//	            Vector<List<TextPosition>> strings=printer.getCharactersByArticle();
//	            
//	            for(List<TextPosition> word:strings){
//	            	for(TextPosition letter:word){
//	            		System.out.printf("1");
//	            		 System.out.println(letter.getFont().getFontDescriptor().isItalic());
//	            	}
//	            }
//	            List allPages = document.getDocumentCatalog().getAllPages();  
//	            for (int i = 0; i < allPages.size(); i++) {  
//	                PDPage page = (PDPage) allPages.get(i);  
//	                System.out.println("Processing page: " + i);  
//	                PDStream contents = page.getContents();
//	                if (contents != null) {  
//	                    printer.processStream(page, page.findResources(), page.getContents().getStream());  
//	                }  
//	               
//	            }  
//	        } finally {  
//	            if (document != null) {  
//	                document.close();  
//	            }  
//	        }  
	    }  
	  
	    /** 
	     * @param text The text to be processed 
	     */  
	    @Override /* this is questionable, not sure if needed... */  
	    protected void processTextPosition(TextPosition text) {  
//	    	if(text.getCharacter().equals("\r\n")){
//	    		a=a+text.getCharacter();
//	    	}
//	    if(token=true){
//    		if(!text.getFont().getFontDescriptor().isItalic()){
//    			a=a+"\n";
//    			token=false;
//    		}
//    	}
	    	if(text.getFont().getFontDescriptor().isItalic()){
	    		
	    		a=a+text.getCharacter();
	    		token=true;
	    		
	    	}
	    	
//	       	System.out.println("String[" + text.getXDirAdj() + ","  
//	                + text.getYDirAdj() + " fs=" + text.getFontSize() + " xscale="  
//	                + text.getXScale() + " height=" + text.getHeightDir() + " space="  
//	                + text.getWidthOfSpace() + " width="  
//	                + text.getWidthDirAdj() + "]" + text.getCharacter()+text.getFont().getFontDescriptor().isItalic());  
//	      
	    }  
	
	   
	   
}
