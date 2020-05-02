window.addEventListener('DOMContentLoaded', function() {

	const timeBlock = document.querySelector('.timer__time'),
          playBtn = document.querySelector('.timer__play'),
          stopBtn = document.querySelector('.timer__stop'),
          popups = document.querySelectorAll('.popup'),
          workInput = document.querySelector('#work-time'),
          chillInput = document.querySelector('#chill-time'),
          saveBtn = document.querySelector('.app-settings__btn'),
          confirmIcon = document.querySelector('.app-settings__confirm');

    if( localStorage.getItem('workOption') ) workInput.value = localStorage.getItem('workOption');
    if( localStorage.getItem('chillOption') ) chillInput.value = localStorage.getItem('chillOption');

	let loop,
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
		stopTime = !( this.classList.contains('active-btn') );
		this.classList.toggle('active-btn');
	});

	document.querySelector('.settings').onclick = () => {popups[0].classList.remove('hide')};
	document.querySelector('.info').onclick = () => {popups[1].classList.remove('hide')};

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
		let myFutureDate = new Date( new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 
			new Date().getHours(), new Date().getMinutes() + (value - 1), new Date().getSeconds() + 59),
			myTime = updateClock(myFutureDate);
		
		loop = setInterval( () => {
			if(stopTime !== false) {
				myFutureDate = new Date( new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 
				new Date().getHours(), new Date().getMinutes() + myTime.minutes, new Date().getSeconds() + myTime.seconds);
			} else {
				myTime = updateClock(myFutureDate);
			}

			if(myTime.time === 0) {
				clearInterval(loop);
				chillTime = !chillTime;
				document.body.classList.toggle('chill');

				if(chillTime === true) {
					if(scores % 4 === 0 && scores !== 0) setPomodoro(29);
					else setPomodoro(chillInput.value);
					notifSet('Время работы вышло', 'Дай себе отдохнуть и сделай перерыв');
				}  else {
					scores++;
					document.querySelector('.top__value').textContent = scores;
					setPomodoro(workInput.value);
					notifSet('Время отдыха вышло', 'Вернёмся к работе!');
				}
			}
		}, 1000 );
	}

	function updateClock( endtime ) {
		let time = Date.parse( endtime ) - Date.parse( new Date() ),
      		minutes = Math.floor( (time / 1000 / 60) % 60 ),
      		seconds = Math.floor( (time / 1000) % 60 );

    	timeBlock.textContent = `${minutes}:${seconds < 10 ? `0${seconds}`: seconds}`;

    	return {
    		time: time,
    		minutes: minutes,
    		seconds: seconds
    	}
	}

	function resetToDefault() {
		clearInterval(loop);
		chillTime = stopTime = false;
		playBtn.classList.remove('hide');
		stopBtn.style.bottom = '-65px';
		stopBtn.classList.remove('active-btn', 'animate');
		timeBlock.textContent = '';
		document.body.classList.remove('chill');
	}

	function notifyMe (title, txt) {
		const notification = new Notification (title, {
			tag : "ache-mail",
			body : txt,
			icon : "https://www.pinclipart.com/picdir/middle/82-821023_youtube-bell-png-youtube-notification-bell-png-clipart.png"
		});
	}
	
	function notifSet (title, text) {
		if (!("Notification" in window)) alert ("Ваш браузер не поддерживает уведомления.");
		else if (Notification.permission === "granted") notifyMe(title, text);
		else if (Notification.permission !== "denied") {
			Notification.requestPermission (function (permission) {
				if (!('permission' in Notification))
					Notification.permission = permission;
				if (permission === "granted") notifyMe(title, text);
			});
		}
		new Audio('audio/notification.mp3').play();
	}

});