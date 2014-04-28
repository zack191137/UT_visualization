$(document).ready(function () {
	var width = 800,
		height = 500;
	var a = [1, 1, 1, 1, 1, 1, 3, 3, 7, 9];
	alert(Math.round(d3.quantile(a, 0.523)));
	var z = d3.scale.ordinal()
		.domain([1, 2, 3, 4, 5, 6, 7, 8, 9])
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
		
	var div = d3.select("body").append("div")   
    	.attr("class", "tooltip")               
		.style("opacity", 0);
    
	d3.json("r.php", function (error, graph) {
			force
			.nodes(graph.nodes)
			.links(graph.links)
			.start();
		var link = svg.selectAll(".link")
			.data(graph.links)
			.enter().append("line")
			.filter(function (d) {
				return (d.value * 10) > 1
			})
			.attr("class", "link")
			.style("stroke", function (d) {
				return z(Math.round(d3.quantile(a, d.value - 0.1) + 1));
			});
		var node = svg.append("g").selectAll(".node")
			.data(graph.nodes)
			.enter().append("circle")
			.attr("class", "node")
			.attr("r", 10)
			.style("fill", function (d) {
				console.log(d.index);
				return color(d.group);
			})
			.call(force.drag)
			.on("dblclick", dblclick)
			.on("mouseover", function(d) {      
            div.transition()        
                .duration(200)      
                .style("opacity", .9);      
            div .html('')  
                .style("left", (d3.event.pageX) + "px")     
                .style("top", (d3.event.pageY - 28) + "px");   
                $(".tooltip").load('html/'+d.name+'.html'); 
            })                  
			.on("mouseout", function(d) {       
            	div.transition()        
                .duration(500)      
                .style("opacity", 0);   
				});
			
		var labels = svg.append("g").selectAll("text").data(graph.nodes).enter().append("text")
			.attr("x", 8)
			.attr("y", ".31em")
			.text(function (d) {
				return d.name;
			});
		node.append("title")
			.text(function (d) {
				return d.name;
			});
		force.on("tick", function () {
			link.attr("x1", function (d) {
				return d.source.x;
			})
				.attr("y1", function (d) {
					return d.source.y;
				})
				.attr("x2", function (d) {
					return d.target.x;
				})
				.attr("y2", function (d) {
					return d.target.y;
				});
			node.attr("transform", function (d) {
				return "translate(" + d.x + "," + d.y + ")";
			});
			labels.attr("transform", function (d) {
				return "translate(" + d.x + "," + d.y + ")";
			});
		});
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
			d3.selectAll('g').remove();
			d3.selectAll('.link').remove();
			d3.json("r.php", function (error, graph) {
				force
					.nodes(graph.nodes)
					.links(graph.links)
					.start();
				var link = svg.selectAll(".link")
					.data(graph.links)
					.enter().append("line")
					.filter(function (d) {
						return Math.round(d3.quantile(a, d.value - 0.1) + 1) <= $("#slider-range").slider("values", 1)
					})
					.filter(function (d) {
						return Math.round(d3.quantile(a, d.value - 0.1) + 1) >= $("#slider-range").slider("values", 0)
					})
					.filter(function (d) {
						console.log(jQuery.inArray(d.source, values) >= 0);
						return jQuery.inArray(d.source.index, values) >= 0
					})
					.filter(function (d) {
						return jQuery.inArray(d.target.index, values) >= 0
					})
					.attr("class", "link")
					.style("stroke", function (d) {
						return z(Math.round(d3.quantile(a, d.value - 0.1) + 1));
					});
				var node = svg.append("g").selectAll(".node")
					.data(graph.nodes)
					.enter().append("circle")
					.filter(function (d) {
						return jQuery.inArray(d.index, values) >= 0
					})
					.attr("class", "node")
					.attr("r", 10)
					.style("fill", function (d) {
						return color(d.group);
					})
					.call(force.drag)
					.on("dblclick", dblclick);
				var labels = svg.append("g").selectAll("text").data(graph.nodes).enter().append("text")
					.filter(function (d) {
						return jQuery.inArray(d.index, values) >= 0
					})
					.attr("x", 8)
					.attr("y", ".31em")
					.text(function (d) {
						return d.name;
					});
				node.append("title")
					.text(function (d) {
						return d.name;
					});
				force.on("tick", function () {
					link.attr("x1", function (d) {
						return d.source.x;
					})
						.attr("y1", function (d) {
							return d.source.y;
						})
						.attr("x2", function (d) {
							return d.target.x;
						})
						.attr("y2", function (d) {
							return d.target.y;
						});
					node.attr("transform", function (d) {
						return "translate(" + d.x + "," + d.y + ")";
					});
					labels.attr("transform", function (d) {
						return "translate(" + d.x + "," + d.y + ")";
					});
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
	$($("input[name='chk_group[]']")).click(function () {
		values = [];
		$.each($("input[name='chk_group[]']:checked"), function () {
			values.push(parseInt($(this).val()));
			console.log(values);
		});
		d3.selectAll('g').remove();
		d3.selectAll('.link').remove();
		d3.json("r.php", function (error, graph) {
			force
				.nodes(graph.nodes)
				.links(graph.links)
				.start();
			var link = svg.selectAll(".link")
				.data(graph.links)
				.enter().append("line")
				.filter(function (d) {
					return Math.round(d3.quantile(a, d.value - 0.1) + 1) <= $("#slider-range").slider("values", 1)
				})
				.filter(function (d) {
					return Math.round(d3.quantile(a, d.value - 0.1) + 1) >= $("#slider-range").slider("values", 0)
				})
				.filter(function (d) {
					console.log(jQuery.inArray(d.source, values) >= 0);
					return jQuery.inArray(d.source.index, values) >= 0
				})
				.filter(function (d) {
					return jQuery.inArray(d.target.index, values) >= 0
				})
				.attr("class", "link")
				.style("stroke", function (d) {
					return z(Math.round(d3.quantile(a, d.value - 0.1) + 1));
				});
			var node = svg.append("g").selectAll(".node")
				.data(graph.nodes)
				.enter().append("circle")
				.filter(function (d) {
					return jQuery.inArray(d.index, values) >= 0
				})
				.attr("class", "node")
				.attr("r", 10)
				.style("fill", function (d) {
					return color(d.group);
				})
				.call(force.drag)
				.on("dblclick", dblclick);
			var labels = svg.append("g").selectAll("text").data(graph.nodes).enter().append("text")
				.filter(function (d) {
					return jQuery.inArray(d.index, values) >= 0
				})
				.attr("x", 8)
				.attr("y", ".31em")
				.text(function (d) {
					return d.name;
				});
			node.append("title")
				.text(function (d) {
					return d.name;
				});
			force.on("tick", function () {
				link.attr("x1", function (d) {
					return d.source.x;
				})
					.attr("y1", function (d) {
						return d.source.y;
					})
					.attr("x2", function (d) {
						return d.target.x;
					})
					.attr("y2", function (d) {
						return d.target.y;
					});
				node.attr("transform", function (d) {
					return "translate(" + d.x + "," + d.y + ")";
				});
				labels.attr("transform", function (d) {
					return "translate(" + d.x + "," + d.y + ")";
				});
			});
		});
		// or you can do something to the actual checked checkboxes by working directly with  'this'
		// something like $(this).hide() (only something useful, probably) :P
	});
});