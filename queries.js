var URL = "http://data.seattle.gov/resource/3k2p-39jp.json?$select=latitude,longitude,event_clearance_description,initial_type_description,at_scene_time,event_clearance_date";
var TOKEN = "&$$app_token=DpnZlymDFh48LN2JHFUGyM7et"
var DEFAULT_TIME_START = '2014-01-01';
var DEFAULT_TIME_END = "";
var WHERE = "";
var DEFAULT_QUERY;
var LIMIT = 1000;
var locations = [];

Types = {
	theft: "event_clearance_description='THEFT - MISCELLANEOUS' OR event_clearance_description='THEFT - AUTO ACCESSORIES' OR " +
		"event_clearance_description='LICENSE PLATE THEFT OR LOSS' OR event_clearance_description='BICYCLE THEFT' OR " +
		"event_clearance_description='THEFT - CAR PROWL' OR event_clearance_description='AUTO THEFT' OR " +
		"event_clearance_description='AUTO THEFT AND RECOVERY' OR event_clearance_description='BURGLARY - COMMERCIAL' OR " +
		"event_clearance_description='BURGLARY - RESIDENTIAL, OCCUPIED' OR event_clearance_description='BURGLARY - COMMERCIAL' OR " +
		"event_clearance_description='BURGLARY - UNOCCUPIED STRUCTURE ON RESIDENTIAL PROPERTY' OR " +
		"event_clearance_description='BURGLARY - RESIDENTIAL, UNOCCUPIED' OR event_clearance_description='SHOPLIFT'",
	violence: "event_clearance_description='HOMICIDE' OR event_clearance_description='ASSAULTS, GANG RELATED' OR " +
		"event_clearance_description='STRONG ARM ROBBERY' OR event_clearance_description='ASSAULTS, FIREARM INVOLVED' OR " +
		"event_clearance_description='ASSAULTS, GANG RELATED' OR event_clearance_description='ASSAULTS, OTHER' OR " +
		"event_clearance_description='DRIVE BY SHOOTING (NO INJURIES)' OR event_clearance_description='ARMED ROBBERY'",
	harbor: "event_clearance_description='HARBOR - VESSEL RECOVERY' OR event_clearance_description='HARBOR - VESSEL THEFT AND RECOVERY' OR " +
		"event_clearance_description='HARBOR - MARINE FIRE' OR event_clearance_description='HARBOR - VESSEL ABANDONED' OR " +
		"event_clearance_description='HARBOR - BOATING UNDER THE INFLUENCE' OR event_clearance_description='HARBOR - VESSEL THEFT' OR " +
		"event_clearance_description='HARBOR - BOAT ACCIDENT' OR event_clearance_description='HARBOR - CODE VIOLATION' OR " +
		"event_clearance_description='HARBOR - DEBRIS, NAVIGATIONAL HAZARDS' OR event_clearance_description='HARBOR - ASSIST BOATER (NON EMERGENCY)' OR " +
		"event_clearance_description='HARBOR - WATER EMERGENCIES'",
	drugs: "event_clearance_description='NARCOTICS, DRUG TRAFFIC LOITERING' OR event_clearance_description='NARCOTICS FOUND, RECOVERED' OR " +
		"event_clearance_description='NARCOTICS WARRANT SERVICE' OR event_clearance_description='NARCOTICS ACTIVITY REPORT' OR " +
		"event_clearance_description='NARCOTICS, DRUG TRAFFIC LOITERING' OR event_clearance_description='NARCOTICS, OTHER' OR " +
		"event_clearance_description='CASUALTY - DRUG RELATED (OVERDOSE, OTHER)' OR event_clearance_description='VICE, OTHER' OR " +
		"event_clearance_description='LIQUOR VIOLATION - INTOXICATED PERSON' OR event_clearance_description='LIQUOR VIOLATION - MINOR' OR " +
		"event_clearance_description='LIQUOR VIOLATION - ADULT'",
	traffic: "event_clearance_description='TRAFFIC (MOVING) VIOLATION' OR event_clearance_description='TRAFFIC CONTROL (SPECIAL EVENTS)' OR " +
		"event_clearance_description='MOTORIST ASSIST' OR event_clearance_description='DRIVING WHILE UNDER INFLUENCE (DUI)' OR " +
		"event_clearance_description='BLOCKING VEHICLE' OR event_clearance_description='ABANDONED VEHICLE' OR " +
		"event_clearance_description='SUSPICIOUS VEHICLE' OR event_clearance_description='AUTO RECOVERY'" ,
	vandalism: "event_clearance_description='GANG GRAFFITI' OR event_clearance_description='PROPERTY DESTRUCTION'",
	sex: "event_clearance_description='SOAP (STAY OUT OF AREA OF PROSTITUTION) ORDER VIOLATION' OR event_clearance_description='DOMESTIC SEX TRAFFICKING, ADULT' OR " +
		"event_clearance_description='PORNOGRAPHY' OR event_clearance_description='SEX OFFENDER - FAILURE TO REGISTER' OR " +
		"event_clearance_description='PROSTITUTION' OR event_clearance_description='LEWD CONDUCT'",
	animal: "event_clearance_description='ANIMALS - INJURED, DEAD, DANGEROUS' OR event_clearance_description='ANIMAL NOISE, STRAYS, BITES'",
	tresspass: "event_clearance_description='TRESPASS' OR event_clearance_description='TRESPASS - PARKS EXCLUSION' OR " + 
		"event_clearance_description='PROWLER'",
	fraud: "event_clearance_description='FORGERY, BAD CHECKS' OR event_clearance_description='FRAUD (INCLUDING IDENTITY THEFT)'",
	disturbance: "event_clearance_description='NOISE DISTURBANCE, RESIDENTIAL' OR event_clearance_description='DISTURBANCE, GANG RELATED' OR " +
		"event_clearance_description='FIGHT DISTURBANCE' OR event_clearance_description='NOISE DISTURBANCE' OR " + 
		"event_clearance_description='DISTURBANCE, OTHER' OR event_clearance_description='JUVENILE DISTURBANCE' OR " + 
		"event_clearance_description='NOISE DISTURBANCE, RESIDENTIAL'",
	suspicious: "event_clearance_description='SUSPICIOUS CIRCUMSTANCES - BUILDING (OPEN DOOR, ETC.)' OR event_clearance_description='SUSPICIOUS PERSON'",
	fire: "event_clearance_description='RECKLESS BURNING'",
	harrassment: "event_clearance_description='HARASSMENT, THREATS' OR event_clearance_description='HARASSMENT, THREATS - BY TELEPHONE, WRITING'",
	missing: "event_clearance_description='LOST PERSON' OR event_clearance_description='MISSING PERSON'",
	mental: "event_clearance_description='MENTAL COMPLAINT' OR event_clearance_description='MENTAL PERSON PICK-UP OR TRANSPORT'",
	hazard: "event_clearance_description='HAZARDS'",
	weapon: "event_clearance_description='PERSON WITH A WEAPON (NOT GUN)' OR event_clearance_description='PERSON WITH A GUN'",
	warrant: "event_clearance_description='FELONY WARRANT SERVICE' OR event_clearance_description='MISDEMEANOR WARRANT SERVICE'",
	trafficking: "event_clearance_description='DOMESTIC HUMAN TRAFFICKING, ADULT'",
	mischief: "event_clearance_description='MISCHIEF, NUISANCE COMPLAINTS'"

};



function createURL(filtered, time) {

	if (typeof(time) === 'undefined') {
		time = "(event_clearance_date >='" + DEFAULT_TIME_START  + "' AND event_clearance_date <= '" + DEFAULT_TIME_END + "')";
	}
	if (typeof(filtered) !== 'undefined') {
		filtered += " AND ";
	} else {
		filtered = "";
	}

	var completeURL = URL + "&$where=" + filtered + time + TOKEN;
	return completeURL;
}

function populateOverlay(query) {
	if (typeof(query) === 'undefined') {
		query = DEFAULT_QUERY;
	}

	d3.json(query, function (data) {

		for (var i = 0; i < data.length; i++)
            locations.push(data[i]);

        shootBlanks();

		// Create Google Maps overlay
		var overlay = new google.maps.OverlayView();
		  
		overlay.onAdd = function() {
			var layer = d3.select(this.getPanes().overlayLayer).append("div").attr("class", "station");

			overlay.draw = function() {
			  	var projection = this.getProjection();
			  	var padding = 10;

				var marker = layer.selectAll("svg")
					.data(d3.entries(data))
				    .each(transform)
				    .enter()
				    .append("svg:svg")
				    .each(transform)
				    .attr("class", "stations");

				marker.append("svg:circle")
				    .attr("r", 7)
				    .attr("cx", padding)
				    .attr("cy", padding);

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

		function shootBlanks(){
		  var marker;
		  for(var i = 0; i < locations.length; i++){
		    var myLatlng = new google.maps.LatLng(locations[i].latitude, locations[i].longitude);
		      marker = new google.maps.Marker({
		      position: myLatlng,
		      map: _map,
		      icon: 'blank.png'
		    });
		    console.log(locations);
		    google.maps.event.addListener(marker, 'mouseover', function(){
		      console.log('chill mouseover');
		    });
		  }
		}
	});
}

function filterOnTime(start, end) {
	
}

function filterOnType(selectedTypes) {
	var filtered = '';
	for (var i = 0; i < selectedTypes.length; i++) {
		var selected = selectedTypes[i];

		if (filtered !== '') {
			filtered += " OR ";
		}

		if (selected === "theft") {
			filtered = Types.theft;
		}

		if (selected === "violence") {
			filtered += Types.violence;
		}

		if (selected === "harbor") {
			filtered += Types.harbor;
		}

		if (selected === "drugs") {
			filtered += Types.drugs;
		}

		if (selected === "traffic") {
			filtered += Types.traffic;
		}

		if (selected === "vandalism") {
			filtered += Types.vadalism;
		}

		if (selected === "sex") {
			filtered += Types.sex;
		}

		if (selected === "animal") {
			filtered += Types.animal;
		}

		if (selected === "tresspass") {
			filtered += Types.tresspass;
		}

		if (selected === "disturbance") {
			filtered += Types.disturbance;
		}

		if (selected === "fire") {
			filtered += Types.fire;
		}

		if (selected === "fraud") {
			filtered += Types.fraud;
		}

		if (selected === "trafficking") {
			filtered += Types.trafficking;
		}

		if (selected === "missing") {
			filtered += Types.missing;
		}

		if (selected === "mental") {
			filtered += Types.mental;
		}

		if (selected === "suspicious") {
			filtered += Types.suspicious;
		}

		if (selected === "warrant") {
			filtered += Types.warrant;
		}

		if (selected === "harrassment") {
			filtered += Types.harrassment;
		}

		if (selected === "hazard") {
			filtered += Types.hazard;
		}

		if (selected === "weapon") {
			filtered += Types.weapon;
		}

		if (filtered === "mischief") {
			filtered += Types.mischief;
		}
	}

	populateOverlay(createURL(filtered));
}

function filterOnDistrict(district) {

}

function createMap() {

}

function init () {

	//populate default end date to be todays date
	var date = new Date();
	DEFAULT_TIME_END = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    DEFAULT_QUERY = createURL();

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
        { "visibility": "off" }
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

    populateOverlay();




}



google.maps.event.addDomListener(window, 'load', init);