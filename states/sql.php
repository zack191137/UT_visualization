<?php
require("phpsqlajax_dbinfo.php");
if(isset($_GET['A'])){
	$A=$_GET['A'];
}
if(isset($_GET['B'])){
	$B=$_GET['B'];
}
function parseToXML($htmlStr) 
{ 
$xmlStr=str_replace('<','&lt;',$htmlStr); 
$xmlStr=str_replace('>','&gt;',$xmlStr); 
$xmlStr=str_replace('"','&quot;',$xmlStr); 
$xmlStr=str_replace("'",'&#39;',$xmlStr); 
$xmlStr=str_replace("&",'&amp;',$xmlStr); 
return $xmlStr; 
}
$link=mysqli_connect($hostname, $dbuser, $password, $dbname);

$dataquery="select state.name, count(table1.id) from table1,state where table1.state=state.idstate and table1.Year between ".$A." and ".$B." group by name order by count(table1.id);";
$posts = array();
$result=mysqli_query($link, $dataquery);
if (!$result) {
  die('Invalid query: ' . mysql_error());
}
header("Content-type: text/json");
while ($row = mysqli_fetch_array($result)){
$name=$row['name'];
$start=$row['count(table1.id)'];
$posts[]=array('state' => $name, 'statehood' => $start);
}
echo json_encode($posts);
/*
header("application/javascript");// Start javascript file, echo parent node
echo 'var statehood = {';// Iterate through the rows, printing XML nodes for each
while ($row = mysqli_fetch_array($result)){
  // ADD TO XML DOCUMENT NODE
  echo '"'.parseToXML($row['name']).'"'.':';
  echo '"'.parseToXML($row['count(table1.id)']).'"'.',';


  
}
echo '}';
*/


?>