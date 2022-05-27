// these functions make the clock do things based on parameters passed to them
// show the time and start ticking
function ticktick ()
{
// this is what i need to clear in order to return to current time without refreshing page
// document.getElementById('stars').style = 'animation: spinCW ' + starSpin + 'ms infinite linear;';
	
	clearInterval(goStop);
	timeNow();
	goStop = setInterval( function() { timeNow () } , 1000 );
}

function timeNow ()
{
	// set the time
	let currentIMC = new Date(); // currentIMC is now an object with various date properties callable with methods.

	// Analog update
	let clockAnalog = timevThreeAnalog( currentIMC , lat , lng );
	rotateClock( clockAnalog , 0 );

	// digital Update
	let digitalDisplay = timevThreeDigital( currentIMC , lat , lng , 0 );
	document.getElementById("displayDigital").innerHTML = digitalDisplay;
}

function rotateClock ( clockAnalog , suppressRotatingObjects )
{
	// rotate the images appropriately
	if( !suppressRotatingObjects ){ document.querySelector("#stars").style.transform = clockAnalog.starAngleStr; }
	document.querySelector("#eHorizon").style.transform = clockAnalog.timeCardAngleStr;
	document.querySelector("#wHorizon").style.transform = clockAnalog.wHorizonAngleStr;
	document.querySelector("#earthLongitudeMarks").style.transform = clockAnalog.earthLongitudeAngleStr;
	document.querySelector("#observer").style.transform = clockAnalog.observerAngleStr;
	if( !suppressRotatingObjects ){ document.querySelector("#moonHand").style.transform = clockAnalog.moonAngleStr; }
	if( !suppressRotatingObjects ){ document.querySelector("#sunHand").style.transform = clockAnalog.sunAngleStr; }
	
}

// realInterval is real time elapsed shown, will be >> than lapseInterval usually.
function timeLapse ( funStart , xSpeed )
{
	userDateSelect = new Date( document.getElementById('startLapseDate').value );
console.log(userDateSelect.getTime());

// reads, if user input is not invalid, then use the user input
if( userDateSelect.getTime() ) { funStart = userDateSelect.getTime() }

	//stop ticking
	clearInterval( goStop );
	lapseElapsed = 0;
	
	// set the clock to the start of the animation
	let clockAnalog = timevThreeAnalog ( funStart , lat , lng );
	rotateClock ( clockAnalog );

	// initial condition variables, positive angles only
	let startStars = ( clockAnalog.starAngle + 360 ) % 360;
	let startMoon = ( clockAnalog.moonAngle + 360 ) % 360;
	let startSun = ( clockAnalog.sunAngle + 360 ) % 360;

	// calculate spin speeds for stars, moon, sun in deg per ms real elapsed
	let clockAnalogFinish = timevThreeAnalog ( funStart + 36*60*60*1000 , lat , lng );
	let finishStars = ( clockAnalogFinish.starAngle + 360 ) % 360;
	let finishMoon = ( clockAnalogFinish.moonAngle + 360 ) % 360;
	let finishSun = ( clockAnalogFinish.sunAngle + 360 ) % 360;
	let star36 = finishStars + ( 360 - startStars );
	if ( star36 < 360 ) { star36 = star36 + 360 };
	let moon36 = finishMoon + ( 360 - startMoon );
	if ( moon36 < 360 ) { moon36 = moon36 + 360 };
	let sun36 = finishSun + ( 360 - startSun );
	if ( sun36 < 360 ) { sun36 = sun36 + 360 };
	let starSpeed = ( star36 ) / (36*60*60*1000) * xSpeed;
	let moonSpeed = ( moon36 ) / (36*60*60*1000) * xSpeed;
	let sunSpeed = ( sun36 ) / (36*60*60*1000) * xSpeed;
	let starSpin = 360 / starSpeed; // ms per full revolution for CSS animation
	let moonSpin = 360 / moonSpeed; // ms per full revolution for CSS animation
	let sunSpin = 360 / sunSpeed; // ms per full revolution for CSS animation
	// calculate start position angles converted to CSS animatino advance from 360deg position. the (-) sign is added in text
	let animAdvStars = startStars / starSpeed;
	let animAdvMoon = startMoon / moonSpeed;
	let animAdvSun = startSun / sunSpeed;

	// start the rotations. Get the time first to synch the other items with the animations.
	// stars, moon, sun continuous spin from 0 to 360. negative delay starts the animation immediately and advances animation the value given
	let now = new Date();
	let lapseStart = now.getTime();
	document.getElementById('stars').style = 'animation: spinCW '+starSpin+'ms infinite linear; animation-delay: -'+animAdvStars+'ms;';
	document.getElementById('moonHand').style = 'animation: spinCW '+moonSpin+'ms infinite linear; animation-delay: -'+animAdvMoon+'ms;';
	document.getElementById('sunHand').style = 'animation: spinCW '+sunSpin+'ms infinite linear; animation-delay: -'+animAdvSun+'ms;';
	
	// other images updated on interval
	document.getElementById('displayDigital').style = 'font-size: 4vmin;';

	goStop = setInterval( function()
	{
	now = new Date();
	timeofLapseAnim = lapseStart + ( now.getTime() - lapseStart  ) * xSpeed;
	clockAnalog = timevThreeAnalog( timeofLapseAnim , lat , lng );
	rotateClock( clockAnalog , 1 );
	let digitalDisplay = timevThreeDigital( timeofLapseAnim , lat , lng , 1 );
	let dateString = new Date( timeofLapseAnim );
	let getmonth = dateString.getMonth() + 1;
	dateString = dateString.getDate() + ' / '+getmonth+' / ' + dateString.getFullYear();
	document.getElementById("displayDigital").innerHTML = digitalDisplay + '<br>' + dateString; //
	} , 50 )
	
// record lapsetoShow for restart if pause
// document.getElementById('weekLapse').innerHTML = 'Pause';
	
}