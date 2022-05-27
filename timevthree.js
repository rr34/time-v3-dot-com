// these functions calculate time v3, including graphic clock angles, primarily using the javascript suncalc library

// returns the digital post-industrial time
function timevThreeDigital ( currentIMC , lat , lng , suppressSeconds )
{		
	let times = SunCalc.getTimes( currentIMC , lat , lng ); // times is now an object ""...

	//Get current time in IMC UTC, IMC is International Meridian Conference

	//Sunrise and sunset in IMC UTC
	let sunriseIMC = times.sunrise,
		sunsetIMC = times.sunset;

	//Find the day length
	let dayLength = sunsetIMC - sunriseIMC;
	let dayMinutes = parseInt((dayLength/(1000*60))%60), dayHours = parseInt((dayLength/(1000*60*60))%24);
	dayMinutes = ( dayMinutes < 10 ? "0" : "" ) + dayMinutes;

	//Build time to display
	var displayString;
	
	if (currentIMC < sunriseIMC) //before sunrise
	{
		let TimeLength = sunriseIMC - currentIMC;
		let seconds = parseInt((TimeLength/1000)%60);
		let minutes = parseInt((TimeLength/(1000*60))%60);
		let hours = parseInt((TimeLength/(1000*60*60))%24);
		minutes = ( minutes < 10 ? "0" : "" ) + minutes;
		seconds = ( seconds < 10 ? "0" : "" ) + seconds;
		
		if ( suppressSeconds == 1 ) {
		displayString = "-" + hours + ":" + minutes + " -> " + dayHours + ":" + dayMinutes;
		}
		else {
		displayString = "-" + hours + ":" + minutes + ":" + seconds + " -> " + dayHours + ":" + dayMinutes;
		}


	}

	else if ( currentIMC > sunriseIMC && currentIMC < sunsetIMC ) //after sunrise and before sunset (daytime)
	{
		let TimeLength = currentIMC - sunriseIMC;
		let seconds = parseInt((TimeLength/1000)%60);
		let minutes = parseInt((TimeLength/(1000*60))%60);
		let hours = parseInt((TimeLength/(1000*60*60))%24);
		minutes = ( minutes < 10 ? "0" : "" ) + minutes;
		seconds = ( seconds < 10 ? "0" : "" ) + seconds;
		
		if ( suppressSeconds == 1 ) {
		displayString = "+" + hours + ":" + minutes + " / " + dayHours + ":" + dayMinutes;
		}
		else {
		displayString = "+" + hours + ":" + minutes + ":" + seconds + " / " + dayHours + ":" + dayMinutes;
		}
			
	}

	else //must be after sunset
	{
		let TimeLength = (24*60*60*1000) - (currentIMC - sunriseIMC);
		let seconds = parseInt((TimeLength/1000)%60);
		let minutes = parseInt((TimeLength/(1000*60))%60);
		let hours = parseInt((TimeLength/(1000*60*60))%24);
		minutes = ( minutes < 10 ? "0" : "" ) + minutes;
		seconds = ( seconds < 10 ? "0" : "" ) + seconds;

		if ( suppressSeconds == 1 ) {
		displayString = "-" + hours + ":" + minutes + " -> " + dayHours + ":" + dayMinutes;
		}
		else {
		displayString = "-" + hours + ":" + minutes + ":" + seconds + " -> " + dayHours + ":" + dayMinutes;
		}
	}

return displayString;

}


function timevThreeAnalog(currentIMC , lat , lng)
{
	// basic variables required
	let times = SunCalc.getTimes(currentIMC , lat , lng);
	let dayLength = (times.sunset - times.sunrise) / (60*1000);

	// get north pole positions from SunCalc then convert to longitude where sun and moon are directly overhead
	let gnomonSun = SunCalc.getPosition(currentIMC , 90 , 0);
	let gnomonMoon = SunCalc.getMoonPosition(currentIMC , 90 , 0);
	let sunLongitude = gnomonSun.azimuth * -1 * 180/Math.PI;
	let moonLongitude = gnomonMoon.azimuth * -1 * 180/Math.PI;
	
	// convert the sun longitude into a sun hand angle for the clock
	let sunAngle = -1 * sunLongitude + lng;
	// convert the ecliptic longitude of Earth's orbit into the ecliptic longitude where we see the sun
	let zodiacLng = (gnomonSun.eclipticLng * 180/Math.PI) % 360;
	
	// angles specific to the clock "hands"
	// the star angle is relative to the sun so must be added to follow sun movement as Earth rotates
	let starAngle = sunAngle + zodiacLng;
	let timeCardAngle = -1 * (dayLength - 12*60) / 2 / (24*60) * 360; // fraction longer/shorter than 12 hours converted to degrees. if longer, then angle is negative
	let wHorizonAngle = -1 * timeCardAngle;
	let observerAngle = 0;
	let moonAngle = -1 * moonLongitude + lng;


return	{
	zodiac: zodiacLng,
	starAngle: starAngle,
	timeCardAngle: timeCardAngle,
	wHorizonAngle: wHorizonAngle,
	earthLongitudeAngle: lng,
	observerAngle: observerAngle,
	moonAngle: moonAngle,
	sunAngle: sunAngle,
	starAngleStr: 'rotate('+starAngle+'deg'+')',
	timeCardAngleStr:  'rotate('+timeCardAngle+'deg'+')',
	wHorizonAngleStr:  'rotate('+wHorizonAngle+'deg'+')',
	earthLongitudeAngleStr:  'rotate('+lng+'deg'+')',
	observerAngleStr:  'rotate('+observerAngle+'deg'+')',
	moonAngleStr:  'rotate('+moonAngle+'deg'+')',
	sunAngleStr:  'rotate('+sunAngle+'deg'+')'

};

}


/*
// makes an angle change array from clock angle array
function timevThreeAnalogMove ( clockAnalogArray )
{

for ( i = 0; i < clockAnalogArray.length - 1; i++ )
{
	starAngle = clockAnalogArray[i+1].starAngle - clockAnalogArray[i].starAngle;
	clockAnalogArray.zodiac[i+1] = clockAnalogArray[i+1].zodiac,
	timeCardAngle[i+1] = clockAnalogArray[i+1].timeCardAngle,
	wHorizonAngl[i+1] = clockAnalogArray[i+1].wHorizonAngle,
	earthLongitudeAngle[i+1] = clockAnalogArray[i+1].lng,
	observerAngle[i+1] = clockAnalogArray[i+1].observerAngle,
	moonAngle[i+1] = clockAnalogArray[i+1].moonAngle,
	sunAngle[i+1] = clockAnalogArray[i+1].sunAngle;

}

return	{
	zodiac: clockAnalogArray.zodiacLng,
	starAngle: starAngle,
	timeCardAngle: timeCardAngle,
	wHorizonAngle: wHorizonAngle,
	earthLongitudeAngle: lng,
	observerAngle: observerAngle,
	moonAngle:moonAngle,
	sunAngle: sunAngle,
	starAngleStr: 'rotate('+starAngle+'deg'+')',
	timeCardAngleStr:  'rotate('+timeCardAngle+'deg'+')',
	wHorizonAngleStr:  'rotate('+wHorizonAngle+'deg'+')',
	earthLongitudeAngleStr:  'rotate('+lng+'deg'+')',
	observerAngleStr:  'rotate('+observerAngle+'deg'+')',
	moonAngleStr:  'rotate('+moonAngle+'deg'+')',
	sunAngleStr:  'rotate('+sunAngle+'deg'+')'

};

}
*/