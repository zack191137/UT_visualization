<?php
function getCSVdata($filename) {

$row = 1;
if (($handle = fopen($filename, "r")) !== false) {
		while (($dataSrc = fgetcsv($handle)) !== false) {
			$num = count($dataSrc);
			if($row===1){
				for ($c = 1; $c < $num; $c++)
				{
					$nodes[]=array(
					'name'=>$dataSrc[$c],
					'group'=>$c);
				}
			}else{
				for ($c = $row; $c < $num; $c++)
				{
					$links[]=array(
					'source'=>$row-2,
					'target'=>$c-1,
					'value'=>$dataSrc[$c]);
				}
			}
			$row++;
		}
		
		}
		fclose($handle);
		$data['nodes']=$nodes;
		$data['links']=$links;
		return $data;

}
$aData = getCSVdata('Matrix.csv');
echo json_encode($aData);
?>