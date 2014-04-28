package PDFtoText;

import java.io.File;
import java.io.IOException;
import java.net.URL;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.util.PDFTextStripper;

public class pdfParser 
//implements IParser
{
 private String[] fileTypes={"pdf"};
 public String[] getFileTypes() {
  return fileTypes;
 }

 public String readText(File file)
   throws Exception
 {
  String text = "";
  PDDocument document = null;
  try
  {
   document = PDDocument.load(file);
   PDFTextStripper stripper = new PDFTextStripper();
   text = stripper.getText(document);
  } catch (IOException e)
  {
   e.printStackTrace();
   throw e;
  }
  finally{
   if
   (document != null)
   try
   {
    document.close();
   } catch (IOException e)
   {
    e.printStackTrace();
   }
  }
  return text;
 }
 public String readText(URL url)
		   throws Exception
		 {
		  String text = "";
		  PDDocument document = null;
		  try
		  {
		   document = PDDocument.load(url);
		   PDFTextStripper stripper = new PDFTextStripper();
		   text = stripper.getText(document);
		  } catch (IOException e)
		  {
		   e.printStackTrace();
		   throw e;
		  }
		  finally{
		   if
		   (document != null)
		   try
		   {
		    document.close();
		   } catch (IOException e)
		   {
		    e.printStackTrace();
		   }
		  }
		  return text;
		 }
}
