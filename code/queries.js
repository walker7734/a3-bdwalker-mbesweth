var URL = "http://data.seattle.gov/resource/3k2p-39jp.json?$select=latitude,cad_cdw_id,longitude,event_clearance_description,initial_type_description,at_scene_time,event_clearance_date";
var TOKEN = "&$$app_token=DpnZlymDFh48LN2JHFUGyM7et"
var DEFAULT_TIME_START = "";
var DEFAULT_TIME_END = "";
var WHERE = "";
var DEFAULT_QUERY;
var LIMIT = 10;
var SELECTED_START_HOUR = "00:00:00";
var SELECTED_END_HOUR = "23:59:00";
var SPINNER;

var _colorIds = {
	"theft": "circle_blue",
	"violence": "circle_red",
	"harbor": "circle_purple",
	"drugs": "circle_orange",
	"sex": "circle_yellow",
	"disturbance": "circle_green",
	"custom": "circle_pink"
};
var _cache = {
	"theft": [],
	"violence": [],
	"harbor": [],
	"drugs": [],
	"sex": [],
	"disturbance": [],
	"custom":[]
};
var _hiddenMarkers = {
	"theft": [],
	"violence": [],
	"harbor": [],
	"drugs": [],
	"sex": [],
	"disturbance": [],
	"custom":[]
}

var _overlays = {
	"theft": [],
	"violence": [],
	"harbor": [],
	"drugs": [],
	"sex": [],
	"disturbance": [],
	"custom": []
}

var _map;

Types = {
	"theft": "event_clearance_description='THEFT - MISCELLANEOUS' OR event_clearance_description='THEFT - AUTO ACCESSORIES' OR " +
		"event_clearance_description='LICENSE PLATE THEFT OR LOSS' OR event_clearance_description='BICYCLE THEFT' OR " +
		"event_clearance_description='THEFT - CAR PROWL' OR event_clearance_description='AUTO THEFT' OR " +
		"event_clearance_description='AUTO THEFT AND RECOVERY' OR event_clearance_description='BURGLARY - COMMERCIAL' OR " +
		"event_clearance_description='BURGLARY - RESIDENTIAL, OCCUPIED' OR event_clearance_description='BURGLARY - COMMERCIAL' OR " +
		"event_clearance_description='BURGLARY - UNOCCUPIED STRUCTURE ON RESIDENTIAL PROPERTY' OR " +
		"event_clearance_description='BURGLARY - RESIDENTIAL, UNOCCUPIED' OR event_clearance_description='SHOPLIFT'",
	"violence": "event_clearance_description='HOMICIDE' OR event_clearance_description='ASSAULTS, GANG RELATED' OR " +
		"event_clearance_description='STRONG ARM ROBBERY' OR event_clearance_description='ASSAULTS, FIREARM INVOLVED' OR " +
		"event_clearance_description='ASSAULTS, GANG RELATED' OR event_clearance_description='ASSAULTS, OTHER' OR " +
		"event_clearance_description='DRIVE BY SHOOTING (NO INJURIES)' OR event_clearance_description='ARMED ROBBERY'",
	"harbor": "event_clearance_description='HARBOR - VESSEL RECOVERY' OR event_clearance_description='HARBOR - VESSEL THEFT AND RECOVERY' OR " +
		"event_clearance_description='HARBOR - MARINE FIRE' OR event_clearance_description='HARBOR - VESSEL ABANDONED' OR " +
		"event_clearance_description='HARBOR - BOATING UNDER THE INFLUENCE' OR event_clearance_description='HARBOR - VESSEL THEFT' OR " +
		"event_clearance_description='HARBOR - BOAT ACCIDENT' OR event_clearance_description='HARBOR - CODE VIOLATION' OR " +
		"event_clearance_description='HARBOR - DEBRIS, NAVIGATIONAL HAZARDS' OR event_clearance_description='HARBOR - ASSIST BOATER (NON EMERGENCY)' OR " +
		"event_clearance_description='HARBOR - WATER EMERGENCIES'",
	"drugs": "event_clearance_description='NARCOTICS, DRUG TRAFFIC LOITERING' OR event_clearance_description='NARCOTICS FOUND, RECOVERED' OR " +
		"event_clearance_description='NARCOTICS WARRANT SERVICE' OR event_clearance_description='NARCOTICS ACTIVITY REPORT' OR " +
		"event_clearance_description='NARCOTICS, DRUG TRAFFIC LOITERING' OR event_clearance_description='NARCOTICS, OTHER' OR " +
		"event_clearance_description='CASUALTY - DRUG RELATED (OVERDOSE, OTHER)' OR event_clearance_description='VICE, OTHER' OR " +
		"event_clearance_description='LIQUOR VIOLATION - INTOXICATED PERSON' OR event_clearance_description='LIQUOR VIOLATION - MINOR' OR " +
		"event_clearance_description='LIQUOR VIOLATION - ADULT'",
	"traffic": "event_clearance_description='TRAFFIC (MOVING) VIOLATION' OR event_clearance_description='TRAFFIC CONTROL (SPECIAL EVENTS)' OR " +
		"event_clearance_description='MOTORIST ASSIST' OR event_clearance_description='DRIVING WHILE UNDER INFLUENCE (DUI)' OR " +
		"event_clearance_description='BLOCKING VEHICLE' OR event_clearance_description='ABANDONED VEHICLE' OR " +
		"event_clearance_description='SUSPICIOUS VEHICLE' OR event_clearance_description='AUTO RECOVERY'" ,
	"vandalism": "event_clearance_description='GANG GRAFFITI' OR event_clearance_description='PROPERTY DESTRUCTION'",
	"sex": "event_clearance_description='SOAP (STAY OUT OF AREA OF PROSTITUTION) ORDER VIOLATION' OR event_clearance_description='DOMESTIC SEX TRAFFICKING, ADULT' OR " +
		"event_clearance_description='PORNOGRAPHY' OR event_clearance_description='SEX OFFENDER - FAILURE TO REGISTER' OR " +
		"event_clearance_description='PROSTITUTION' OR event_clearance_description='LEWD CONDUCT'",
	"animal": "event_clearance_description='ANIMALS - INJURED, DEAD, DANGEROUS' OR event_clearance_description='ANIMAL NOISE, STRAYS, BITES'",
	"tresspass": "event_clearance_description='TRESPASS' OR event_clearance_description='TRESPASS - PARKS EXCLUSION' OR " + 
		"event_clearance_description='PROWLER'",
	"fraud": "event_clearance_description='FORGERY, BAD CHECKS' OR event_clearance_description='FRAUD (INCLUDING IDENTITY THEFT)'",
	"disturbance": "event_clearance_description='NOISE DISTURBANCE, RESIDENTIAL' OR event_clearance_description='DISTURBANCE, GANG RELATED' OR " +
		"event_clearance_description='FIGHT DISTURBANCE' OR event_clearance_description='NOISE DISTURBANCE' OR " + 
		"event_clearance_description='DISTURBANCE, OTHER' OR event_clearance_description='JUVENILE DISTURBANCE' OR " + 
		"event_clearance_description='NOISE DISTURBANCE, RESIDENTIAL'",
	"suspicious": "event_clearance_description='SUSPICIOUS CIRCUMSTANCES - BUILDING (OPEN DOOR, ETC.)' OR event_clearance_description='SUSPICIOUS PERSON'",
	"fire": "event_clearance_description='RECKLESS BURNING'",
	"harrassment": "event_clearance_description='HARASSMENT, THREATS' OR event_clearance_description='HARASSMENT, THREATS - BY TELEPHONE, WRITING'",
	"missing": "event_clearance_description='LOST PERSON' OR event_clearance_description='MISSING PERSON'",
	"mental": "event_clearance_description='MENTAL COMPLAINT' OR event_clearance_description='MENTAL PERSON PICK-UP OR TRANSPORT'",
	"hazard": "event_clearance_description='HAZARDS'",
	"weapon": "event_clearance_description='PERSON WITH A WEAPON (NOT GUN)' OR event_clearance_description='PERSON WITH A GUN'",
	"warrant": "event_clearance_description='FELONY WARRANT SERVICE' OR event_clearance_description='MISDEMEANOR WARRANT SERVICE'",
	"trafficking": "event_clearance_description='DOMESTIC HUMAN TRAFFICKING, ADULT'",
	"mischief": "event_clearance_description='MISCHIEF, NUISANCE COMPLAINTS'"

};

function createURL(filtered, start, end, customSearch) {
	var time;
	if (typeof(start) === 'undefined' || typeof(end) === 'undefined') {
		time = "(event_clearance_date >='" + DEFAULT_TIME_START  + "' AND event_clearance_date <= '" + DEFAULT_TIME_END + "')";
	} else {
		time = "(event_clearance_date >='" + start + "' AND event_clearance_date <='" + end + "')";
	}

	if (filtered === "custom") {
		filtered = '';
	} else if (typeof(filtered) !== 'undefined') {
		filtered += " AND ";
	} else {
		filtered = Types.theft;
	}

	if (typeof(customSearch) === 'undefined') {
		customSearch = '';
	}

	var completeURL = URL + "&$where=" + filtered + time + customSearch + TOKEN;
	return completeURL;
}

function clearOverlay(type) {
	var hidden = _hiddenMarkers[type];
	for (var i = 0; i < hidden.length; i++) {
		hidden[i].setMap(null);
	}

	var overlays = _overlays[type];

	var markers = _cache[type];
	for (var i = 0; i < markers.length; i++) {
		var toRemove = markers[i];
		toRemove.parentNode.removeChild(toRemove);
	}
	_cache[type] = [];
	_hiddenMarkers[type] = [];
	_overlays[type] = [];
}

function populateOverlay(query, queryType, offset) {
	if (typeof(query) === 'undefined') {
		query = DEFAULT_QUERY;
	}
	
	startSpinner();
	d3.json(query + "&$offset=" + offset, function (data) {
		if (data.length == 0 || offset > 3000) {			
			stopSpinner();
			return;
		}

		// Create Google Maps overlay
		var overlay = new google.maps.OverlayView();
		_overlays[queryType].push(overlay);
		populateOverlay(query, queryType, offset + 1000);
		overlay.onAdd = function() {
			var layer = d3.select(this.getPanes().overlayLayer).append("div").attr("class", "station");

			overlay.remove
			overlay.draw = function() {
			  	var projection = this.getProjection();
			  	var padding = 10;
				var marker = layer.selectAll("svg")
					.data(d3.entries(data))
				    .each(transform)
				    .enter()
				    .append("svg:svg")
				    .each(transform)
				    .each(function(d) {
				    	d3.select(this)
				    		.attr("id", _colorIds[queryType]);
				    });

				marker.append("svg:circle")
				    .attr("r", 4)
				    .attr("cx", padding)
				    .attr("cy", padding)
				    .each(function (d) {
				   		_cache[queryType].push(this);
				   		var myLatlng = new google.maps.LatLng(d.value.latitude, d.value.longitude);

						marker = new google.maps.Marker({
						  position: myLatlng,
						  map: _map,
						  icon: 'blank.png'
						});

						google.maps.event.addListener(marker, 'click', function(){
					 	 $description = $('#desc');
					 	 $description.empty();
					 	 $description.append($('<span>').text(d.value.event_clearance_description));
					 	 $date = $('#dateOfIncident');					 	 
					 	 $date.empty();
					 	 var date = d.value.event_clearance_date;
					 	 var split = date.split("T");
					 	 
					 	 $date.append($('<spand>').text(split[0]));
					 	 $('#toi').empty().append($('<span>').text(split[1]));
					 	 $('#id').empty().append($('<span>').text(d.value.cad_cdw_id));					 	 
						});


						_hiddenMarkers[queryType].push(marker);
				    });

				function transform(d) {
					d = new google.maps.LatLng(d.value.latitude, d.value.longitude);
				    d = projection.fromLatLngToDivPixel(d);
				    return d3.select(this)
				      .style("left", (d.x - padding) + "px")
				      .style("top", (d.y - padding) + "px");
				}
			}
		}
		overlay.setMap(_map);

	});
}

function filterOnCustom() {
	if ($("#custom")[0].checked) {
		clearOverlay("custom");
	}
	checkboxChecked();
}

function filterOnTime() {
	var boxes = $("input[type=checkbox]");
	for (var i = 0; i < boxes.length; i++) {
		clearOverlay(boxes[i].id);
	}
	$("#startDateLabel").text($("#startDate").val());
	$("#endDateLabel").text($("#endDate").val());
	checkboxChecked();
}

function filterOnHours(event, ui) {
	var boxes = $("input[type=checkbox]");
	for (var i = 0; i < boxes.length; i++) {
		clearOverlay(boxes[i].id);
	}
	var hourStart, hourEnd;
	if (ui.values[0] < 10) {
		hourStart = "0" + ui.values[0] + ":00";
	} else {
		hourStart = ui.values[0] + ":00";
	}

	if (ui.values[1] < 10) {
		hourEnd = "0" + ui.values[1] + ":59";
	} else if (ui.values[1] == 23) {
		hourEnd = "23:59";
	} else {
		hourEnd = ui.values[1] + ":59";
	}
	hourStart += ":00";
	hourEnd += ":00"
	SELECTED_END_HOUR = hourEnd;
	SELECTED_START_HOUR = hourStart;
	checkboxChecked(hourStart, hourEnd);
}

function checkboxChecked(startHour, endHour) {
	var boxes = $("input[type=checkbox]");
	var end = $("#endDate").val();
	if (typeof(endHour) !== 'undefined') {
		end += "T" + endHour;
	} else {
		end += "T" + SELECTED_END_HOUR;
	}

	var start = $("#startDate").val();
	if (typeof(startHour) !== 'undefined') {
		start += "T" + startHour;
	} else {
		start += "T" + SELECTED_START_HOUR;
	}

	var customSearch = '';
	for (var i = 0; i < boxes.length; i++) {
		var checkedId = boxes[i].id;
		if (boxes[i].checked) {
			if (checkedId === "custom" && $("#customLabel").val() !== "custom") {
				customSearch = "&$q='" + $("#customLabel").val() + "'";
				var queryURL = createURL(checkedId, start, end, customSearch);
				console.log(queryURL);
				populateOverlay(queryURL, checkedId, 0);
			} else if (checkedId !== "custom") {
				var queryURL = createURL(Types[checkedId], start, end, customSearch);
				console.log(queryURL);
				populateOverlay(queryURL, checkedId, 0);
			}
			
		} else if (_cache[checkedId].length != 0) {
			clearOverlay(checkedId);
		}
	}
}

function getDate(days, months, years) {
	var date = new Date();
	date.setDate(date.getDate() + days);
	date.setMonth(date.getMonth() + months);
	date.setFullYear(date.getFullYear() + years);
	return date.getFullYear() + "-" + (("0" + (date.getMonth() + 1)).slice(-2)) + "-" + ("0" + date.getDate()).slice(-2);
}

function startSpinner() {
	$(".spin").spin('show');
}

function stopSpinner() {
	$(".spin").spin('hide');
}

function init () {

	var defaultStart = getDate(-1, 0, 0);
	var defaultEnd = getDate(0, 0, 0);
	d3.select("#endDate")
		.attr("value", defaultEnd);
	d3.select("#startDate")
		.attr("value", defaultStart);

	DEFAULT_TIME_START = defaultStart + "T00:00:00";
	DEFAULT_TIME_END = defaultEnd + "T23:59:00";

	$("#startDateLabel").text(defaultStart);
	$("#startTimeLabel").text("00:00");
	$("#endDateLabel").text(defaultEnd);
	$("#endTimeLabel").text("23:59");
	$("#querylabel").hide();
	
    var style = [
    {
      "featureType": "water",
      "stylers": [
        { "color": "#000000" }
      ]
    },{
      "featureType": "landscape",
      "stylers": [
        { "color": "#393939" }
      ]
    },{
      "featureType": "road",
      "stylers": [
        { "color": "#6e6f6e" }
      ]
    },{
      "featureType": "administrative.neighborhood",
      "stylers": [
        { "visibility": "off" }
      ]
    },{
      "featureType": "administrative.locality",
      "stylers": [
        { "visibility": "off" }
      ]
    },{
      "featureType": "poi",
      "stylers": [
        { "visibility": "off" }
      ]
    },{
      "featureType": "transit.line",
      "stylers": [
        { "visibility": "off" }
      ]
    },{
      "featureType": "road",
      "stylers": [
        { "visibility": "simplified" }
      ]
    },{
      "elementType": "labels",
      "stylers": [
        { "visibility": "simplified" }
      ]
    }];

    var styledMap = new google.maps.StyledMapType(style, {name: "Seattle Styled"});

    var mapOptions = 
    {
      zoom: 12,
      center: new google.maps.LatLng(47.6097, -122.33),
      mapTypeControlOptions: {
        mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
      }
    };

    _map = new google.maps.Map(d3.select("#map-canvas").node(), mapOptions);
    _map.mapTypes.set('map_style', styledMap);
    _map.setMapTypeId('map_style');
}



google.maps.event.addDomListener(window, 'load', init);