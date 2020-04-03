window.addEventListener('DOMContentLoaded', function() {

	const timeBlock = document.querySelector('.timer__time'),
          playBtn = document.querySelector('.timer__play'),
          stopBtn = document.querySelector('.timer__stop'),
          settingsBtn = document.querySelector('.settings'),
          popups = document.querySelectorAll('.popup'),
          workInput = document.querySelector('#work-time'),
          chillInput = document.querySelector('#chill-time'),
          saveBtn = document.querySelector('.app-settings__btn'),
          confirmIcon = document.querySelector('.app-settings__confirm'),
          infoBtn = document.querySelector('.info'),
          scoresBlock = document.querySelector('.top__value');

    if( localStorage.getItem('workOption') ) workInput.value = localStorage.getItem('workOption');
    if( localStorage.getItem('chillOption') ) chillInput.value = localStorage.getItem('chillOption');

	let time,
		minutes,
		seconds,
		loop,
		stopTime = false,
		chillTime = false,
		scores = 0;

	playBtn.addEventListener('click', function(e) {
		e.preventDefault();
		setPomodoro(workInput.value);
		this.classList.add('hide');
		stopBtn.style.bottom = '25px';
		stopBtn.classList.add('animate');
	});

	stopBtn.addEventListener('click', function(e) {
		e.preventDefault();
		if( this.classList.contains('active-btn') ) stopTime = false;
		else stopTime = true;
		this.classList.toggle('active-btn');
	});

	settingsBtn.addEventListener('click', function() {popups[0].classList.remove('hide');});

	infoBtn.addEventListener('click', function() {popups[1].classList.remove('hide');});

	popups.forEach(item => {
		item.addEventListener('click', function(e) {
			if( e.target.classList.contains('popup') || e.target.classList.contains('close') ) item.classList.add('hide');
		});
	});

	saveBtn.addEventListener('click', function() {
		resetToDefault();
		confirmIcon.classList.add('confirm-active');
		setTimeout( () => {confirmIcon.classList.remove('confirm-active');}, 1000 );
		localStorage.setItem('workOption', workInput.value);
		localStorage.setItem('chillOption', chillInput.value);
	});

	function setPomodoro(value) {
		let myDate = new Date(),
		 	myFutureDate = new Date( myDate.getFullYear(), myDate.getMonth(), myDate.getDate(), 
			myDate.getHours(), myDate.getMinutes() + (value - 1), myDate.getSeconds() + 59);
	
		updateClock( myFutureDate );
		
		loop = setInterval( () => {
			if(stopTime === false) {
				updateClock(myFutureDate);
			} else {
				myDate = new Date();
				myFutureDate = new Date( myDate.getFullYear(), myDate.getMonth(), myDate.getDate(), 
				myDate.getHours(), myDate.getMinutes() + minutes, myDate.getSeconds() + seconds);
			}

			if(time === 0) {
				clearInterval(loop);
				chillTime = !chillTime;
				document.querySelector('body').classList.toggle('chill');
				showNotification();

				if(chillTime === true) {
					if(scores % 4 === 0 && scores !== 0) setPomodoro(29);
					else setPomodoro(chillInput.value);
				}  else {
					scores++;
					scoresBlock.textContent = scores;
					setPomodoro(workInput.value);
				}
			}
		}, 1000 );
	}

	function updateClock( endtime ) {
		time = Date.parse( endtime ) - Date.parse( new Date() ),
      		minutes = Math.floor( (time / 1000 / 60) % 60 ),
      		seconds = Math.floor( (time / 1000) % 60 );

    	timeBlock.textContent = `${minutes}:${seconds < 10 ? '0' + seconds: seconds}`;
	}

	function resetToDefault() {
		clearInterval(loop);
		chillTime = false;
		stopTime = false;
		playBtn.classList.remove('hide');
		stopBtn.style.bottom = '-65px';
		stopBtn.classList.remove('active-btn');
		stopBtn.classList.remove('animate');
		timeBlock.textContent = '';
	}

	function showNotification() {
		const audio = new Audio('audio/notification.mp3');
		audio.play();
	}

});