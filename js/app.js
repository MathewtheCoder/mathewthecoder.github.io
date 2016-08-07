$(document).ready(function(){
	$('.search-box').hide();
	//$('.result .row').hide();
	$('.result').hide();
	/*Modal*/
	// Get the modal
	var modal = document.getElementById('myModal');



	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close")[0];



	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
	    modal.style.display = "none";
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
    	if (event.target == modal) {
        	modal.style.display = "none";
    	}
	}
	/*Location*/
	//Get Location
	var geocoder;
	var place;
	var city;
	if (navigator.geolocation) {
	 geocoder = new google.maps.Geocoder();   navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
	} 
	//Get the latitude and the longitude;
	function successFunction(position) {
	    var lat = position.coords.latitude;
	    var lng = position.coords.longitude;
	    //console.log(lat, lng);
	    codeLatLng(lat, lng);
	        
	}

	function errorFunction(){
	    alert("Geocoder failed");
	}

	function codeLatLng(lat, lng) {

    var latlng = new google.maps.LatLng(lat, lng);
    geocoder.geocode({'latLng': latlng}, function(results, status) {
    	console.info(results);	
      if (status == google.maps.GeocoderStatus.OK) {
      //console.log(results)
        if (results[1]) {
         //formatted address
         
        //find district name
        place = results[0].address_components[2].long_name
        city = results[0].address_components[3].long_name;
        //place = "kollam";
        /*Wiki Content*/
        
        var key = place.replace(/\s/gi, '_');
        
	//Ajax code to get content
	 $.ajax({
	        type: "GET",
	        url: "http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page="+key+"&callback=?",
	        contentType: "application/json; charset=utf-8",
	        async: false,
	        dataType: "json",
	        success: function (data, textStatus, jqXHR) {
	 			console.log(data);
	            var markup = data.parse.text["*"];
	            var blurb = $('<div></div>').html(markup);
	 
	            // remove links as they will not work
	            blurb.find('a').each(function() { $(this).replaceWith($(this).html()); });
	 
	            // remove any references
	            blurb.find('sup').remove();
	 
	            // remove cite error
	            blurb.find('.mw-ext-cite-error').remove();
				//Add content to title,feed,wiki link
	           
	            $(".infobox .info-text").html($(blurb).find('p'));

	            $(".place").html(place);

	 			$('.result').show();

	 			$(".services div").on("click",function(){
	 				var service = $(this).data("service");
	 				//console.log(service);
	 				var includeHtml = '<div w3-include-html="health.html"></div>';
	 				$('.modal-body').html("Mathew Joseph");
	 				$('.modal-header h2').html(service);
	 				modal.style.display = "block";
            			
	 			});
	 
	        },
	        error: function (errorMessage) {
	        }
	    });
    



        } else {
          alert("No results found");
        }
      } else {
        alert("Geocoder failed due to: " + status);
      }
    });
  }
  /*Set heading to Place name*/
  
  $('.currentPlace').html(place);
	//Press search key
	$('.search-icon').on("click",function(){
		$('.search-box').slideDown( "slow", function() {});
	});

});