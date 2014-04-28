$(document).ready(function () {
	var txt = '';
	var states = {};
	var statehood = [];
	$.ajax({
		type: "GET",
		url: "sql.php",
		dataType: "json",
		async: false,
		cache: false,
		data: {
			"A": "1946",
			"B": "1947"
		},
		fail: function (data) {
			alert(data);
		},
		success: function (data) {
			$.each(data, function (index, element) {
				states[fips[element.state]] = element.statehood;
			});
		}
	});
	alert(pv.values(states));
	var po = org.polymaps;
	// Compute noniles.
	/* var unit=pv.Scale.linear(0,8).domain(pv.values(states)); */
	var quantile = pv.Scale.quantile()
		.quantiles(9)
		.domain(pv.values(states))
		.range(0, 8);
	// Date format.
	var map = po.map()
		.container(document.getElementById("map").appendChild(po.svg("svg")))
		.center({
			lat: 40,
			lon: -95
		})
		.zoomRange([3, 7])
		.zoom(4)
		.add(po.interact());
	map.add(po.image()
		.url(po.url("http://{S}tile.cloudmade.com" + "/1a1b06b230af4efdbb989ea99e9841af" // http://cloudmade.com/register
				+ "/20760/256/{Z}/{X}/{Y}.png")
			.hosts(["a.", "b.", "c.", ""])));
	var myLayer = po.geoJson()
		.url("http://polymaps.appspot.com/state/{Z}/{X}/{Y}.json")
		.on("load", load)
		.on("reload", reload);
	map.add(myLayer)
	map.add(po.compass()
		.pan("none"));
	map.container().setAttribute("class", "Blues");

	function load(e) {
		/* states.sort(); */
		for (var i = 0; i < e.features.length; i++) {
			var feature = e.features[i],
				d = states[feature.data.id.substring(6)];
			/* alert(states[feature.data.id.substring(6)]); */
			if (d == undefined) {
				/* feature.element.setAttribute("display", "none"); */
				feature.element.setAttribute("class", "q" + 0 + "-" + 9);
			} else {
				/* alert(d);  */
				feature.element.setAttribute("class", "q" + Math.ceil(d / 10) + "-" + 9);
				/* alert(quantile(d)) */
				feature.element.appendChild(po.svg("title").appendChild(
						document.createTextNode(feature.data.properties.name + ": " + d.replace(/ [ ]+/, " ")))
					.parentNode);
			}
		}
	}

	function reload(e) {
		for (var i = 0; i < e.features.length; i++) {
			var feature = e.features[i],
				d = states[feature.data.id.substring(6)];
			/* alert(states[feature.data.id.substring(6)]); */
			if (d == undefined) {
				/* feature.element.setAttribute("display", "none"); */
				feature.element.setAttribute("class", "q" + 0 + "-" + 9);
			} else {
				feature.element.setAttribute("class", "q" + Math.ceil(d / 10) + "-" + 9);
				/*   alert(quantile(d));  */
				feature.element.appendChild(po.svg("title").appendChild(
						document.createTextNode(feature.data.properties.name + ": " + d.replace(/ [ ]+/, " ")))
					.parentNode);
			}
		}
	}
	$("#slider-range").slider({
		range: true,
		min: 1946,
		max: 2012,
		values: [1946, 1950],
		slide: function (event, ui) {
			$("#amount").val("" + ui.values[0] + " - " + ui.values[1]);
		},
		
		change: function (event, ui) {
			$.ajax({
				type: "GET",
				url: "sql.php",
				async: false,
				data: {
					"A": ui.values[0],
					"B": ui.values[1]
				},
				dataType: "json",
				fail: function (data) {
					alert(data);
				},
				success: function (data) {
					$.each(data, function (index, element) {
						states[fips[element.state]] = element.statehood;
						/* alert(element.statehood); */
						/* alert(pv.values(states)); */
					});
				}
			});
			myLayer.reload();
		}
	});
	$("#amount").val("" + $("#slider-range").slider("values", 0) +
		" - " + $("#slider-range").slider("values", 1));
});