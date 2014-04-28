package wordCount;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class WordCountService {
	private static String[] strAr={"the","is","are","a","an","and","for","in","of","to","in","as","be","at"," of","of "};
    /**
     * 根据文章生成单词树
     * @param text
     * @return
     */
    private static CharTreeNode geneCharTree(String text){
        CharTreeNode root = new CharTreeNode();
        CharTreeNode p = root;
        char c = ' ';
        for(int i = 0; i < text.length(); ++i){
            c = text.charAt(i);
            if(c >= 'A' && c <= 'Z')
                c = (char)(c + 'a' - 'A');
            if(c >= 'a' && c <= 'z'){
                if(p.children[c-'a'] == null)
                    p.children[c-'a'] = new CharTreeNode();
                p = p.children[c-'a'];
            }
            else{
                p.cnt ++;
                p = root;
            }
        }
        if(c >= 'a' && c <= 'z')
            p.cnt ++;
        return root;
    }
    
    /**
     * 使用深度优先搜索遍历单词树并将对应单词放入结果集中
     * @param result
     * @param p
     * @param buffer
     * @param length
     */
    private static void getWordCountFromCharTree(List<WordCount> result,CharTreeNode p, char[] buffer, int length){
        for(int i = 0; i < 26; ++i){
            if(p.children[i] != null){
                buffer[length] = (char)(i + 'a');
                if(p.children[i].cnt > 0){
                    WordCount wc = new WordCount();
                    wc.setCount(p.children[i].cnt);
                    wc.setWord(String.valueOf(buffer, 0, length+1));
                    result.add(wc);
                }
                getWordCountFromCharTree(result,p.children[i],buffer,length+1);
            }
        }
    }
    
    private static void getWordCountFromCharTree(List<WordCount> result,CharTreeNode p){
        getWordCountFromCharTree(result,p,new char[100],0);
    }
    
    /**
     * 得到词频表的主算法,供外部调用
     * @param article
     * @return
     */
    public static List<WordCount> getWordCount(String article){
        CharTreeNode root = geneCharTree(article);
        List<WordCount> result = new ArrayList<WordCount>();//此处也可用LinkedList链表,以避免数组满了扩容导致的性能损失
        getWordCountFromCharTree(result,root);
        Collections.sort(result, new Comparator<Object>(){
            public int compare(Object o1, Object o2) {
                WordCount wc1 = (WordCount)o1;
                WordCount wc2 = (WordCount)o2;
                return wc2.getCount() - wc1.getCount();
               
            }
        });
        return result;
    }
    public static List<WordCount> filter(List<WordCount> result){
    	
    	int i,j=0;
    													
    	for(i=0;i<result.size();i++){
			WordCount Words=new WordCount();
			
			Words=result.get(i);
			if(Words.getWord().length()<4){
				result.remove(i);
				i--;
			}else{
			for(j=0;j<strAr.length;j++){
				String temp=strAr[j];
				if(temp.equals(Words.getWord().toLowerCase().toString())){
					result.remove(i);
					i--;
				}
			}
			}
		}
		return result;
    	
    }
}
	
class CharTreeNode{
    int cnt = 0;
    CharTreeNode[] children = new CharTreeNode[26];
}
