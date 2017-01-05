	



var GoogleMaps = function () {
	
	var mapGeocoding = function() {

		$('.accordion-title').bind('click', function(e){
		  $(this).parent().find('.submenu').slideToggle('fast');
		  
		  $(this).parent().toggleClass('is-expanded');
		  e.preventDefault();

		});


		var map = new GMaps({
			div: '#gmapGeocoding',
			lat: -22.905548,
			lng: -43.177235
		});


		
		

			var positions = '{ "positions" : [' +
			'{ "lat":-22.9835873 , "lng":-43.21292489999996 },' +
			'{ "lat":-22.975261 , "lng":-43.22858239999999 },' +
			'{ "lat":-22.957127 , "lng":-43.17688499999997 } ]}';
			var obj = JSON.parse(positions);


			console.log(obj.positions[0]);

						
			
		var showLoading = function(){
			$('.loadind-overlay').show();
		}

		var hideLoading = function(){
			

			setTimeout(
				function(){ 
					$('.loadind-overlay').hide();
				}, 3000);

		}


		var distLatLong = function(lat1,lon1,lat2,lon2) {

			function toRad( graus ){
			    return graus * ( Math.PI/180 )
			}
		  	var R = 6371; // raio da terra em km
		  	var Lati =  Math.PI/180*(lat2-lat1);  
		  	var Long =  Math.PI/180*(lon2-lon1); 
		 	var a = 
		    	Math.sin(Lati/2) * Math.sin(Lati/2) +
		    	Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
		    	Math.sin(Long/2) * Math.sin(Long/2)
		    ; 
		  	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
		  	var d = R * c; // distância em km
		  	return d;
		}

		var getClassStore = function(lat, lng){
			$('.store').each(function(){
				var storeLat = $(this).data('lat');
				var storeLng = $(this).data('lng');


				if(storeLat == lat && storeLng == lng){
					$(this).addClass('perto');
				}
			});
		}

		var attrStore = function(lat, lng, distancia){
			$('.store').each(function(){
				var storeLat = $(this).data('lat');
				var storeLng = $(this).data('lng');


				if(storeLat == lat && storeLng == lng){
					$(this).attr('data-distance', distancia);
				}
			});
		}

		var verificarDistancia = function(lati, lngi){
			console.log(lati, lngi);

			$('.searchResult').remove();

			var i;
			var k = 0;
			var dist = [];
			var longe = [];
			for (i = 0; i < obj.positions.length; i++){
			    console.log(obj.positions[i]);
			    var distancia = distLatLong(lati, lngi, obj.positions[i].lat, obj.positions[i].lng);
			    if( distancia < 20){
			    	dist.push(distancia);

			    	getClassStore(obj.positions[i].lat, obj.positions[i].lng);
			    	attrStore(obj.positions[i].lat, obj.positions[i].lng, distancia);
			    	console.log('Esse é o '+k);
			    	k++;
			    }else {
			    	longe.push(distancia);
			    	attrStore(obj.positions[i].lat, obj.positions[i].lng, distancia);
			    }
			}
			if(dist.length > 0){
				$( "<p class='searchResult'>Foram encontradas "+k+" loja(s) perto da sua localização!</p>" ).insertBefore( ".backButton" );
				console.log(dist);

			}else {
				console.log(longe);
				var menor = Math.min.apply(null, longe);
				$('.store').each(function(){
					var storeDistance = $(this).data('distance');
					//var storeLng = $(this).data('lng');


					if(storeDistance == menor){
						$(this).addClass('mais-perto');
					}
				});
				$( "<p class='searchResult'>Não foi encontrada nenhuma loja(s) perto da sua localização!</p>" ).insertBefore( ".backButton" );
				console.log(longe);
			}
			
		}


				
		var handleAction = function() {
            var text = $.trim($('#mapAddress').val());
            $('.store').removeClass('perto')
            GMaps.geocode({
                address: text,
                callback: function(results, status) {
                    if (status == 'OK') {
                        var latlng = results[0].geometry.location;
                        map.setCenter(latlng.lat(), latlng.lng());
                        map.setZoom(14);
                        map.addMarker({
                            lat: latlng.lat(),
                            lng: latlng.lng(),
                            infoWindow: {
							  content: '<p>Você está aqui</p>'
							}
                        });

                        verificarDistancia(latlng.lat(), latlng.lng());
                        $('.coordinates').hide();
                        $('.contentStores').show();
                    }
                }
            });

            hideLoading();
        }

		$('#geocodingBtn').click(function(e){
			e.preventDefault();
			showLoading();
			handleAction();
		});

		$('.backButton').on('click', function(){
			$('.contentStores').hide();
			$('.coordinates').show();
			
		});

		$('#geolocationBtn').click(function(e){
			e.preventDefault();
			showLoading();
			GMaps.geolocate({
				success: function(position) {

					console.log(position);
					console.log(position.coords.latitude, position.coords.longitude);
			    	map.setCenter(position.coords.latitude, position.coords.longitude);
			    	map.addMarker({
		                            lat: position.coords.latitude,
		                            lng: position.coords.longitude,
		                            infoWindow: {
									  content: '<p>Você está aqui</p>'
									}
		                        });
			    	
			    	verificarDistancia(position.coords.latitude, position.coords.longitude);
			    	var geocoder = new google.maps.Geocoder;
			    	var latlng = {lat: position.coords.latitude, lng: position.coords.longitude};
			    	geocoder.geocode({'location': latlng}, function(results, status){
			    		console.log(results);
			    		 if (status == 'OK') {
			    		 	console.log(results[0].formatted_address);
			    		 	$("#mapAddress").val(results[0].formatted_address);
			    		 }
			    	});

			    	$('.coordinates').hide();
			    	$('.contentStores').show();
			  	},
			  	error: function(error) {
			    	//alert('Geolocation failed: '+error.message);
			  	},
			  	not_supported: function() {
			    	//alert("Your browser does not support geolocation");
			  	},
			  	always: function() {
			    	//alert("Done!");
				}
			});
			hideLoading();
		});

		$("#mapAddress").keypress(function(e){
			var keycode = (e.keyCode ? e.keyCode : e.which);
			if(keycode == '13') {
				e.preventDefault();               
				handleAction();
			}           
		});

		$('.seeMap').on('click touchstart', function(){
			var parent = $(this).parent('.store'),
				mapPlace = parent.find('.mapPlace'),
				mapPlaceID = mapPlace.attr('id'),
				parent_lat = parent.data('lat'),
				parent_lng = parent.data('lng');
			mapPlace.show();

			var newMap = new GMaps({
				div: '#'+mapPlaceID,
				lat: parent_lat,
				lng: parent_lng
			});

			newMap.addMarker({
				lat: parent_lat,
				lng: parent_lng
			});
		});

		$('.menu-anchor').on('click', function(){
			var instructionsId = $(this).data('id');

			$('#'+instructionsId).toggle();
		});

		$('.seeRoute').on('click touchstart', function(){
			var parent = $(this).parents('.store'),
				mapPlace = parent.find('.mapPlace'),
				routePlace = parent.find('.routePlace'),
				mapPlaceID = mapPlace.attr('id'),
				routePlaceID = routePlace.attr('id'),
				parent_lat = parent.data('lat'),
				parent_lng = parent.data('lng'),
				startPoint = $.trim($('#mapAddress').val());
				var destination = parent_lat+', '+parent_lng;

				console.log(startPoint);
			
			mapPlace.show();

			var newMap = new GMaps({
				div: '#'+mapPlaceID,
				lat: parent_lat,
				lng: parent_lng
			});
			

			newMap.addMarker({
				lat: parent_lat,
				lng: parent_lng
			});

			GMaps.geocode({
			  	address: startPoint,
			  	callback: function(results, status) {
                    if (status == 'OK') {
                        latlng = results[0].geometry.location;
                        newMap.setZoom(14);
                        newMap.addMarker({
                            lat: latlng.lat(),
                            lng: latlng.lng(),
                        });
				  		newMap.travelRoute({
						  	origin: [latlng.lat(),latlng.lng()],
				  		  	destination: [parent_lat, parent_lng],
						  	travelMode: 'driving',
						  	step: function(e){
								$('#'+routePlaceID).append('<li>'+e.instructions+'</li>');
								$('#'+routePlaceID+' li:eq('+e.step_number+')').delay(100*e.step_number).fadeIn(500, function(){
									newMap.setCenter(e.end_location.lat(), e.end_location.lng());
									newMap.drawPolyline({
										path: e.path,
										strokeColor: '#131540',
										strokeOpacity: 0.6,
										strokeWeight: 6
								  	});
								});
							}
						});
					}
			  	}
			});
		});



		$('#geoRoute').click(function(e){
			e.preventDefault();
			var latDest = $('.store.active').data('lat');
			var lngDest = $('.store.active').data('lng');
			var destination = latDest+', '+lngDest;
			var startPoint = $.trim($('#startPoint').val());
			GMaps.geocode({
			  	address: startPoint,
			  	callback: function(results, status) {
                    if (status == 'OK') {
                        latlng = results[0].geometry.location;
                        map.setZoom(10);
                        map.addMarker({
                            lat: latlng.lat(),
                            lng: latlng.lng(),
                        });
				  		map.travelRoute({
						  	origin: [latlng.lat(),latlng.lng()],
				  		  	destination: [latDest, lngDest],
						  	travelMode: 'driving',
						  	step: function(e){
								$('#gmapInstructions').append('<li>'+e.instructions+'</li>');
								$('#gmapInstructions li:eq('+e.step_number+')').delay(100*e.step_number).fadeIn(500, function(){
									map.setCenter(e.end_location.lat(), e.end_location.lng());
									map.drawPolyline({
										path: e.path,
										strokeColor: '#131540',
										strokeOpacity: 0.6,
										strokeWeight: 6
								  	});
								});
							}
						});
					}
			  	}
			});

		});

		
	}
	 

	return {
		//main function to initiate map samples
		init: function () {
			mapGeocoding();
		}

	};

}();
