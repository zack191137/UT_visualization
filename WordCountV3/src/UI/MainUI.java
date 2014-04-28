package UI;

import java.awt.Dimension;
import java.awt.EventQueue;

import javax.swing.JFrame;

import java.awt.GridLayout;

import javax.swing.JPanel;
import javax.swing.JSplitPane;
import javax.swing.JFileChooser;
import javax.swing.JButton;

import PDFtoText.FileOperation;
import PDFtoText.pdfParser;

import java.awt.event.ActionListener;
import java.awt.event.ActionEvent;
import java.io.*;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import javax.swing.JTextField;
import javax.swing.JLabel;
import javax.swing.filechooser.FileNameExtensionFilter;

import wordCount.WordCount;
import wordCount.WordCountService;

import javax.swing.JTextPane;
import javax.swing.JCheckBox;

public class MainUI{

	private JFrame frame;
	private JTextField textField;
	private JTextField textField_2;
	private	JCheckBox chckbxNewCheckBox;

	/**
	 * Launch the application.
	 */
	public static void main(String[] args) {
		EventQueue.invokeLater(new Runnable() {
			public void run() {
				try {
					MainUI window = new MainUI();
					window.frame.setVisible(true);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		});
	}

	/**
	 * Create the application.
	 */
	public MainUI() {
		initialize();
	}

	/**
	 * Initialize the contents of the frame.
	 */
	private void initialize() {
		frame = new JFrame();
		frame.setBounds(100, 100, 550, 300);
		frame.setMinimumSize(new Dimension(550,300));
		frame.setMaximumSize(new Dimension(550,600));
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		frame.getContentPane().setLayout(new GridLayout(1, 0, 0, 0));
		frame.setVisible(true);
		JSplitPane splitPane = new JSplitPane();
		splitPane.setEnabled(false);
		splitPane.setDividerLocation(350);
		frame.getContentPane().add(splitPane);
		JSplitPane splitPanelLeft = new JSplitPane();
		splitPanelLeft.setEnabled(false);
		splitPanelLeft.setOrientation(JSplitPane.VERTICAL_SPLIT);
		splitPane.setLeftComponent(splitPanelLeft);
		splitPanelLeft.setDividerLocation(230);
		
		final JFileChooser fileChooser = new JFileChooser();
		FileNameExtensionFilter filter = new FileNameExtensionFilter(
		        "PDF Fifle", "PDF");
		fileChooser.setFileFilter(filter);
		    
		fileChooser.setControlButtonsAreShown(false);
		splitPanelLeft.setLeftComponent(fileChooser);
		
		JPanel panel_1 = new JPanel();
		splitPanelLeft.setRightComponent(panel_1);
		panel_1.setLayout(null);
		
		JLabel lblUrl = new JLabel("URL");
		lblUrl.setBounds(37, 6, 28, 23);
		panel_1.add(lblUrl);
		
		chckbxNewCheckBox = new JCheckBox("");
		chckbxNewCheckBox.setBounds(6, 6, 28, 23);
		panel_1.add(chckbxNewCheckBox);
		
		textField_2 = new JTextField();
		textField_2.setBounds(66, 5, 272, 23);
		panel_1.add(textField_2);
		textField_2.setColumns(10);
		
		JPanel panel = new JPanel();
		splitPane.setRightComponent(panel);
		panel.setLayout(null);
		textField = new JTextField();
		textField.setBounds(10, 34, 134, 28);
		panel.add(textField);
		textField.setColumns(10);
		
		
		
		
		
		JLabel lblNewLabel = new JLabel("Name Without .xxx");
		lblNewLabel.setBounds(0, 6, 183, 16);
		panel.add(lblNewLabel);
		
		JTextPane txtpnXzxcsdf = new JTextPane();
		txtpnXzxcsdf.setText("The generated file will be add on the same folder");
		txtpnXzxcsdf.setBounds(0, 103, 162, 47);
		panel.add(txtpnXzxcsdf);
		
		JButton btnNewButton = new JButton("goText");
		btnNewButton.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				String text = null;
				pdfParser pdf=new pdfParser();
				Object url=new Object();
				
				if(!chckbxNewCheckBox.isSelected()){
					url=(File)fileChooser.getSelectedFile();
					try {
						text=pdf.readText((File)url);
					} catch (Exception e1) {
						// TODO Auto-generated catch block
						e1.printStackTrace();
					}
				}else{
					try {
						url=(URL)new URL(textField_2.getText());
					} catch (MalformedURLException e1) {
						// TODO Auto-generated catch block
						e1.printStackTrace();
					}
					try {
						text=pdf.readText((URL)url);
					} catch (Exception e1) {
						// TODO Auto-generated catch block
						e1.printStackTrace();
					}
				}
			String outputpath=null;
			outputpath=fileChooser.getSelectedFile().toString().replace(fileChooser.getSelectedFile().getName(), textField.getText())+".txt";
			System.out.printf(outputpath+"\n");
			FileOperation.contentToTxt(outputpath, text);
			}
		});
		btnNewButton.setBounds(10, 62, 70, 29);
		panel.add(btnNewButton);
		
		JButton btnItalic = new JButton("CountToCSV");
		btnItalic.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				String text = null;
				pdfParser pdf=new pdfParser();
				Object url=new Object();
				
				if(!chckbxNewCheckBox.isSelected()){
					url=(File)fileChooser.getSelectedFile();
					try {
						text=pdf.readText((File)url);
					} catch (Exception e1) {
						// TODO Auto-generated catch block
						e1.printStackTrace();
					}
				}else{
					try {
						url=(URL)new URL(textField_2.getText());
					} catch (MalformedURLException e1) {
						// TODO Auto-generated catch block
						e1.printStackTrace();
					}
					try {
						text=pdf.readText((URL)url);
					} catch (Exception e1) {
						// TODO Auto-generated catch block
						e1.printStackTrace();
					}
				}
			List<WordCount> result = new ArrayList<WordCount>();
			result=WordCountService.getWordCount(text);
			result=WordCountService.filter(result);
			System.out.print(result.get(15).getWord().length());
			System.out.print(result.get(15).getWord().toString());
			int i;
			String counts="Word,Counts\n";
			for(i=0;i<result.size();i++){
				WordCount Words=new WordCount();
				Words=result.get(i);
				counts=counts+Words.getWord()+", "+Words.getCount()+"\n";
				
			}
			
			String outputpath=null;
			outputpath=fileChooser.getSelectedFile().toString().replace(fileChooser.getSelectedFile().getName(), textField.getText())+".csv";
			System.out.printf(outputpath+"\n");
			FileOperation.contentToTxt(outputpath, counts);
				
			}
		});
		btnItalic.setBounds(73, 62, 59, 29);
		panel.add(btnItalic);
		
	}
}
