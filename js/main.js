

function onlyNumbers(evt) {
      var theEvent = evt || window.event;
      var key = theEvent.keyCode || theEvent.which;
      key = String.fromCharCode( key );
      var regex = /[0-9]/; 
      if( !regex.test(key) ) {
        theEvent.returnValue = false;alert("Only numbers, please");
    }
}


//  ************* FIRST STEP ******************************
// Firs step stores the rent, the  commons' space mq total, and the number of rooms.

var buttons = $("button");
var comSpacesPerc = 0;
var comRoomPerc = 0;
var comSpacesPart = 0;
var roomsPart = 0;
var storedRent = 0;
var storedSpaces = 0;
var roomsNumber = 0;
var roomsMeasures = [];
var totalRoomMeasures = 0;
var totalHouseMeasure = 0;
var singleRoomsPerc = [];
var rentRooms = [];
var doubleRooms = [];
var comSpacesPartPerPerson = 0;
var totPeople = 0;

var storeRent = function () {
	storedRent = parseInt($("#totalRent").val(), 10);
};

var storeSpaces = function () {
	storedSpaces = $("#spaces").val();
	storedSpaces = parseInt(storedSpaces,10);
};

var storeRoomsNumber = function () {
	roomsNumber = $("#numbRooms").val();
	roomsNumber = parseInt(roomsNumber,10);
};

var generateSecondStep = function () {
	var formContent ='';
	for(var i=1; i<(roomsNumber+1); i++){

		var input ='';

		if(i === 0){
			input = '';
		} else {
			input = 'Room ' + i + ', how many square feet/mq? ';
		}
		
		input += '<input onkeypress="onlyNumbers(event)" type="text" min="1" max="999" class="chekFull" id="input' + i + '" name="input' + i + '"/>' +
				 'Room shared by two people ' +
				 '<input type="checkbox" class="check" id="inputBox' + i + '" name="inputBox' + i + '"/><br />';
		
		formContent += input;

	}

	$("#second-step").prepend(formContent);
	$("#first-step").addClass("hide");
	$("#second-step").removeClass("hide");
};



// var storeDataForFirstStep = function (e) {
// 	e.preventDefault();
	
// 	storeRent();
// 	storeSpaces();
// 	storeRoomsNumber();

// 	generateSecondStep();
// };



var hasError = function() {
	var result = false;
	$(".chekFull").each(function(){
	  if (this.value == "") {
	  	result = true;
	  }
	})
	return result;
}

var storeDataForFirstStep = function (e) {
	e.preventDefault();

	if (hasError() != true) {
		storeRent();
		storeSpaces();
		storeRoomsNumber();

		generateSecondStep();
	} else {
	  alert("Please fill in all fields before submitting");
	}
	
};

$(buttons[0]).click(storeDataForFirstStep);

//  ************* END FIRST STEP ***************************

// ******* SECOND STEP, ADD ROOMS' mq *******

// check number of checkbox selected (double rooms) 


var storeRoomMisures = function () {
	for(var i=1; i<(roomsNumber+1); i++)  {
		roomsMeasures.push(parseInt($("#input"+i).val(), 10));
	}
};

var storeRoomsPercentages = function () {
	for (var i = 0; i < roomsMeasures.length; i++) {
		singleRoomsPerc[i] = (roomsMeasures[i]*100)/totalRoomMeasures;
	}
};

var storeDoubleRoomsAndTotPeople = function() {
	for (var i=0; i<roomsNumber; i++) {
		var isDouble = $('#inputBox' + (i+1)).is(':checked');
		doubleRooms[i] = isDouble;

		if(isDouble){
			totPeople += 2;
		} else {
			totPeople++;
		}
	}
};

var calculateTotalRoomsMeasures = function() {
	for (var i=0; i<roomsMeasures.length; i++) {
		totalRoomMeasures += roomsMeasures[i];
	}
	calculateTotalHouseMeasure();
};

var calculateTotalHouseMeasure = function () {
	totalHouseMeasure = parseInt(storedSpaces,10) + parseInt(totalRoomMeasures,10);
};

var calculateCommonSpacesPercentage = function () {
	comSpacesPerc = (storedSpaces * 100) / totalHouseMeasure;
	comRoomPerc = 100 - comSpacesPerc;
};

// now lets split the rent between common space and rooms
var splitComAndRoomsParts = function () {
	comSpacesPart = (parseInt(storedRent) * comSpacesPerc) / 100;
	roomsPart = parseInt(storedRent) - comSpacesPart;
};

var calculateRentForEachRoom = function() {
	for (var i=0; i<roomsNumber; i++) {
		rentRooms[i] = (singleRoomsPerc[i] * parseInt(roomsPart, 10))/100;
	}
};

var calculateCommonSpacesAmount = function () {
	comSpacesPartPerPerson = comSpacesPart/totPeople
};

var writeResult = function () {
	var partialPartSum = 0;
	for (var i=0; i<roomsNumber; i++) {
		var isDouble = doubleRooms[i];
		var roomRent = 0;

		if (i < (roomsNumber -1)) {
			var commonSpaceTotal = isDouble ? comSpacesPartPerPerson * 2 : comSpacesPartPerPerson;
			roomRent = Math.round(commonSpaceTotal + rentRooms[i]);
			partialPartSum += roomRent;
		} else {
			// this is the last array's element
			roomRent = (storedRent - partialPartSum);
		}


		var doubleSentence = '';

		if(isDouble){
			doubleSentence = " (Per person: £ " + roomRent/2 + ")";
		}

		$("#result").append("<p>Room " + (i+1) + " should pay £ " + roomRent + doubleSentence + "</p>");
	}
	$("form").addClass("hide");	
};

var storeDataForSecondStep = function () {

	if (hasError() != true) {
	
	swal({   title: "Wait please :)",   text: "I am calculating the rent division",   timer: 2500,   showConfirmButton: false });

	storeRoomMisures();
	storeDoubleRoomsAndTotPeople();

	calculateTotalRoomsMeasures();
	storeRoomsPercentages();

	calculateCommonSpacesPercentage();
	splitComAndRoomsParts();
	calculateRentForEachRoom();
	calculateCommonSpacesAmount();

	$("#second-step").addClass("hide");
	writeResult();
	
	setTimeout(function(){
		
		$('#result').removeClass("hide-text")
	},2500)

} else {
	alert("Please fill in all fields before submitting");
}

	
};

$(buttons[1]).click(function(e){
	e.preventDefault();
	$('#result').addClass('hide-text');
	storeDataForSecondStep();
});


