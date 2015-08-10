	
	//Style settings for polygons when hovered over
	var highlightArea = {
		fillOpacity: 0.65,
		fillColor: '#4A90E2'
	};
	
	//Default style settings for polygons not in Bold Italic
	var infoArea = {
		color: '#4A90E2', 
		weight: 3, 
		fillColor: 'transparent'
	};
	
	//Default style settings for polygons in Bold Italic
	var articleArea ={
		color: '#4A90E2', 
		weight: 3,
		opacity: 1,
		fillOpacity: 0.3,
		fillColor: '#4A90E2'
	};
	
	//Custom icon for map pins
	var badgerIcon = L.icon({
		iconUrl: 'badgerIcon.png',
		shadowUrl: 'badgerShadow.png',
		iconSize:     [60, 60],
		shadowSize:   [67, 42], 
		iconAnchor:   [30, 60], 
		shadowAnchor: [0, 42], 
		popupAnchor:  [-3, -76]
	});
	
	/******VARIABLES******/
	
	//The map
	var map = L.map('map',{zoomControl: false}).setView([37.7470, -122.4567], 13);


	//map.attributionControl.addAttribution("test");
	
	L.control.zoom({
		position:'bottomright'
	}).addTo(map);
	
	//Saves neighborhoods as objects to be sorted & used later
	var neighborhoodList = [];
	
	/******FUNCTIONS******/
	
	//For adding hover events to tabs
	function tabHover(feature, div){
		$(document).ready(function() {
			$(div).hover(
				//Function for hover in
				function() { 
					map.eachLayer(function (layer) {
						if(layer._polygonId === div.id){
							layer.setStyle(highlightArea);
						}
					});						
				},
				//Function for hover out
				function() { 
					map.eachLayer(function (layer) {
						if(layer._polygonId === div.id){
							if(feature.properties.inBI === "true"){
								layer.setStyle(articleArea);
							}
							else{
								layer.setStyle(infoArea);
							}
						}
					});	
				}
			);
		});
	}
	
	//Creates each entry for the list of tabs
	function createTab(feature){
		var div = document.createElement("a");
		div.className = "neighborhood-menu-item";
		div.id = feature.properties.name.replaceAll(" ", "+");
		div.innerHTML = feature.properties.name;
		div.style.cursor = "pointer";
		tabHover(feature, div);
		//Adds click events to tabs
		$(div).click(function(){
			$(".neighborhood-menu-item").removeClass("is-active");
			$(this).addClass("is-active");
			map.eachLayer(function (layer) {
				if(layer._polygonId === div.id){
					layer.openPopup();
				}
			});	
		});
		return div;
	}

	//Sorts tabs and adds them to the proper div
	function addTabs(neighborhoodList) {
		neighborhoodList.sort(compare);
		for(i = 0; i < neighborhoodList.length; i++){
			document.getElementById("tabList").appendChild(
					createTab(neighborhoodList[i]));
		}
	}
	
	//Creates an area to put neighborhood name information
	/*
	function createNameTool(){
		var nameTool = $("<p></p>", {
			id: ("nameTool"),
			css: {
				position: "absolute",
				top: window.event.clientY,
				left: window.event.clientX,
				zIndex: 1002,
				backgroundColor: "white",
				padding: "8px",
				border: "1px solid #ccc"
			}
		});
		return nameTool;
	}
	*/
	
	//Creates the text for neighborhood names to be put in the nameTool box
	/*
	function createLabel(feature){
		var label = $("<p></p>", {
			text: feature.properties.name,
			css: {fontSize: "12px", marginBottom: "3px"}
		});
		return label;
	}
	*/
	
	//Manages addition of hover events 
	function addAreaHover(feature, layer){
		layer.on("mouseover", function(e){
			layer.setStyle(highlightArea);
			/*
			var nameTool = createNameTool();
			var label = createLabel(feature);
			label.appendTo(nameTool);
			nameTool.appendTo("#map");
			*/
		});
		layer.on("mouseout", function(e){
			$("#nameTool").remove();
			if(feature.properties.inBI === "true"){
				layer.setStyle(articleArea);
			}
			else{
				layer.setStyle(infoArea);
			}
		});
	}
	
	//For adding popups to neighborhoods
	function addPopups(feature, layer){
		var closeButton = '<button id = "close-button" class = ' + 
				'"leaflet-popup-close-button-custom" onclick= ' + 
				'"map.closePopup()" type="button"><p>close</p></button>';
		var hrefCL = "http://sfbay.craigslist.org/search/apa?query=\"" + 
				feature.properties.name.replaceAll(" ", "+")
				.replaceAll("/", '"%7C"') + '"';
		var linkCL = "<li><a href =" + hrefCL + " target = '_blank'>" +
				"CraigsList Rentals</a></li>";
		var linkTest = "<li><a href =" + "http://google.com" + 
				" target = '_blank'>Google search (test)</a></li>";
		var linkInfo = '<h3 class = "leaflet-popup-header">' +
				feature.properties.name + '<a href =' + 
				feature.properties.LINK + ' target = "_blank">' +
				' (info) </a></h3>';
		var description = "<p class ='leaflet-popup-description'>" + 
				"Insert description here</p>";
		var linkGroup = "<ul class = 'leaflet-popup-link-group'>" + 
				linkCL + linkTest + "</ul>";
		if(feature.properties.inBI === "true"){
			var popupOptions = {
				'minWidth': screen.width + 'px',
				'maxWidth': screen.width + 'px',
				'autoPan' : true,
				'closeButton' : false
			}
			var attribution = "<a class = 'leaflet-popup-content-" + 
					"attribution' href = 'http://www.thebolditalic.com/' " + 
					"target = '_blank'>image &copy \"the Bold Italic\"</a>";
			var image = "<div class ='leaflet-popup-content-img-div'>" + 
					"<a href=" + feature.properties.LINK + " target="+ 
					"'_blank'><img src = " + feature.properties.popImg + 
					" alt = " +	feature.properties.name.replaceAll(" ", "-") +
					" width = " + screen.width/2 + ">" + attribution + 
					"</img></a></div>";
			layer.bindPopup("<div class = 'leaflet-popup-content'>" + 
					image +	"</div><br/>" + closeButton + linkInfo + 
					description + linkGroup, popupOptions);
		}
		else{
			layer.bindPopup(closeButton + linkInfo + description + linkGroup);
		}
		
	}
	
	$('#close-button').text("close");
		
	//Manages addition of hover events 
	function addAreaClick(feature, layer){
		var tabName = feature.properties.name.replaceAll(" ", "+");
		layer.on("click", function(e){
			$(".neighborhood-menu-item").removeClass("is-active");
			$(document.getElementById(tabName)).addClass("is-active");
			location.href = "#" + tabName;
		});
	}
	
	//Manages qualities added to each map feature
	function onEachFeature(feature, layer){
		layer._polygonId = feature.properties.name.replaceAll(" ", "+");
		addPopups(feature, layer);
		addAreaHover(feature, layer);
		addAreaClick(feature, layer)
	}
	
	//A comparator for sorting an array of neighborhood objects
	function compare(a,b) {
	  if (a.properties.name < b.properties.name)
		return -1;
	  if (a.properties.name > b.properties.name)
		return 1;
	  return 0;
	}
	
	//Replaces characters in strings (needed for CraigsList query URLs)
	String.prototype.replaceAll = function(str1, str2, ignore) {
		return this.replace(new RegExp(str1.replace(
				/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),
				(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(
				/\$/g,"$$$$"):str2);
	} 
	
	//Creates polygons from json file and initializes their styles/features
	$.getJSON("https://gist.githubusercontent.com/lkondratczyk/51d43e0a7c9"+
			"68119a78e/raw/50dc84e629d0b86d33172697497494791fa01314/hoodBo"+
			"rders", function(response) {
		console.log("response", response);
		L.geoJson(response, {
			style: function (feature) {
				neighborhoodList.push(feature);
				if(feature.properties.inBI === "true"){
					return articleArea;
				}
				else{
					return infoArea;
				}
			},
			onEachFeature: onEachFeature
		}).addTo(map).pipe(addTabs(neighborhoodList));	 
	});
	
	//Access token for Mapbox map tiles
	L.mapbox.accessToken = 				
		'pk.eyJ1IjoibGtvbmRyYXRjenlrIiwiYSI6ImVlNjAzNTYwYTBjZDMwYzg5YjViY' +
		'2U0MTQ3MTMzYzU3In0.DDlX4LfLLK0iguFHb9OTqQ';
		
	//Adds the Mapbox tiles to the map
	L.tileLayer('https://{s}.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{' + 
			'y}.png?access_token=' + L.mapbox.accessToken , {
			attribution: '<a href="http://www.mapbox.com/about/maps/" ' + 
					'target="_blank"> map tiles &copy Mapbox</a>',
			maxZoom: 18,
	}).addTo(map);

	//uncomment this to see Badger Maps icon
	//L.marker([37.7270, -122.4367], {icon: badgerIcon}).addTo(map);