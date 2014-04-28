$(document).ready(function () {
	var width = 960,
    height = 960;
    
var a=[1,1,1,1,1,1,3,3,7,9];

alert(Math.round(d3.quantile(a,0.523)) );

var z = d3.scale.ordinal()
    .domain([1,2,3,4,5,6,7,8,9])
    .range(colorbrewer.Blues[9]);  

var color = d3.scale.category20();

var force = d3.layout.force()
	    .charge(2)
	    .gravity(2)
    .linkDistance(400)
    .size([width, height]);
    
    var drag = force.drag()
    .on("dragstart", dragstart);

var svg = d3.select("#network").append("svg")
    .attr("width", width)
    .attr("height", height);
    
    
d3.json("r.php", function(error, graph) {
  force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

  var links = svg.selectAll(".link")
      .data(graph.links)
	  .enter().append("line")
	  .filter(function(d) { return (d.value*10) >1})
      .attr("class", "link")
	  .style("stroke", function(d) { return z(Math.round(d3.quantile(a,d.value-0.1)+1)); }); 

  var nodes = svg.append("g").selectAll(".node")
      .data(graph.nodes)
	  .enter().append("circle")
	  .attr("class", "node")
      .attr("r", 10)
      .style("fill", function(d) { console.log(d.index);return color(d.group); })
      .call(force.drag)
      .on("dblclick", dblclick);
    
	 var labels = svg.append("g").selectAll("text").data(graph.nodes).enter().append("text")
	 .attr("x", 8)
	 .attr("y", ".31em")
	 .text(function(d) { return d.name; });    
      
	  nodes.append("title")
      .text(function(d) { return d.name; });

	  force.on("tick", function() {
		  links.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    nodes.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });  
    labels.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });  });
});
function dblclick(d) {
  d3.select(this).classed("fixed", d.fixed = false);
}

function dragstart(d) {
  d3.select(this).classed("fixed", d.fixed = true);
}

$("#slider-range").slider({
		range: true,
		min: 0,
		max: 10,
		values: [0, 10],
		slide: function (event, ui) {
			$("#amount").val("" + ui.values[0] + " - " + ui.values[1]);
		},
		change: function (event, ui) {
		d3.selectAll('g').remove() ;
		d3.selectAll('.link').remove() ;
		
		d3.json("r.php", function(error, graph) {
  force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

  var link = svg.selectAll(".link")
      .data(graph.links)
	  .enter().append("line")
	  .filter(function(d){return Math.round(d3.quantile(a,d.value-0.1)+1) <=ui.values[1]})
			.filter(function(d){return Math.round(d3.quantile(a,d.value-0.1)+1) >=ui.values[0]})
      .attr("class", "link")
	  .style("stroke", function(d) { return z(Math.round(d3.quantile(a,d.value-0.1)+1)); }); 

  var node = svg.append("g").selectAll(".node")
      .data(graph.nodes)
	  .enter().append("circle")
	  .attr("class", "node")
      .attr("r", 10)
      .style("fill", function(d) { return color(d.group); })
      .call(force.drag)
      .on("dblclick", dblclick);
    
	 var labels = svg.append("g").selectAll("text").data(graph.nodes).enter().append("text")
	 .attr("x", 8)
	 .attr("y", ".31em")
	 .text(function(d) {return d.name; });    
      
	  node.append("title")
      .text(function(d) { return d.name; });
	  force.on("tick", function() {
		  link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

   node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    
    labels.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; }); 

  });
});
			/*
d3.selectAll('.link')
			.filter(function(d){return (d3.quantile(a,d.value) >ui.values[1])})
			.filter(function(d){return (d3.quantile(a,d.value) <ui.values[0])})
			.remove() 
			.filter(function(d){return Math.round(d3.quantile(a,d.value-0.1)+1) <=ui.values[1]})
			.filter(function(d){return Math.round(d3.quantile(a,d.value-0.1)+1) >=ui.values[0]})*/   
		
		}
	});
	$("#amount").val("" + $("#slider-range").slider("values", 0) +
		" - " + $("#slider-range").slider("values", 1));
		
		var values = new Array();
		$($("input[name='chk_group[]']")).click(function() {
				$.each($("input[name='chk_group[]']:checked"), function() {
				values=[];
				values.push(parseInt($(this).val()));
				console.log(values);
				/* valRegion = $(this).val(); */
                //alert('The selected Region/Office is ' + valRegion);

                if ($(this).is(':checked')) {
                    //ADD SELECTED RESOURCES
                    minLinks = {};
                    minLinks = links.filter(function (d) {
                        if ((d.SourceRegion == valRegion) || (d.SinkRegion == valRegion)) {
                            return d
                        }
                    })
                    //new nodes
                    nodes2 = {};
                    nodes2 = force.nodes().filter(function (d) { return d3.keys(minLinks.filter(function (e) { return e.source.name == d.name || e.target.name == d.name; })).length > 0 });

                    force
                       .nodes(nodes2)
                       .links(minLinks)
                       .start();

                    //circle add
                    newCirc = circle.data(force.nodes());
                    newCirc.enter().append("svg:circle")
                        .attr("r", 12)
                        .attr("class", function (d) { return d.SourceRegion; })
                        .call(force.drag);
                    newCirc.enter().append("svg:circle");

                    //path add
                    newPath = path.data(force.links());
                    newPath
                        .enter().append("svg:path")
                        .attr("class", function (d) { return "link " + d.link_type; })
                        .attr("marker-end", function (d) { return "url(#" + d.link_type + ")"; });
                    newPath.enter().append();

                    //text add
                    newText = text.data(force.nodes());
                    newText.enter().append();
                    newText.select(".shadow").text(function (d) { return d.name; });
                    newText.select(".write").text(function (d) { return d.name; });

                } else {
                    //REMOVE SELECTED RESOURCES
                    //Filter links and rebuild nodes based on this.
                    minLinks = {};
                    minLinks = links.filter(function (d) {
                        if ((d.SourceRegion == valRegion) || (d.SinkRegion == valRegion)) {
                            return d
                        }
                    })
                    //new nodes
                    nodes2 = {};
                    nodes2 = force.nodes().filter(function (d) { return d3.keys(minLinks.filter(function (e) { return e.source.name == d.name || e.target.name == d.name; })).length > 0 });

                    force
                       .nodes(nodes2)
                       .links(minLinks)
                       .start();

                    //circle remove
                    newCirc = circle.data(force.nodes());
                    newCirc.enter().append("svg:circle")
					    .attr("r", 12)
					    .attr("class", function (d) { return d.SourceRegion; })
					    .call(force.drag);
                    newCirc.exit().remove();

                    //path remove
                    newPath = path.data(force.links());
                    newPath
					    .enter().append("svg:path")
					    .attr("class", function (d) { return "link " + d.link_type; })
					    .attr("marker-end", function (d) { return "url(#" + d.link_type + ")"; });
                    newPath.exit().remove();

                    //text remove
                    newText = text.data(force.nodes());
                    newText.exit().remove();
                    newText.select(".shadow").text(function (d) { return d.name; });
                    newText.select(".write").text(function (d) { return d.name; });
                }

        
		});
  			});



});