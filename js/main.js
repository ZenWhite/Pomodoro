window.addEventListener('DOMContentLoaded', function() {

	//Элементы UI
	const popupButtons = document.querySelectorAll('.popup-btn');
	const modals = document.querySelectorAll('.popup');
	const settingsBtn = document.querySelector('.settings-btn');
	const workInput = document.getElementById('work');
	const chillInput = document.getElementById('chill');
	
	//Таймер
	class Timer {
		constructor(element) {
			this.root = document.querySelector(element);
			this.txt = document.getElementById('time');
			this.isWork = true;
			this.loop = null;
			this.total = 0;
			this.minutes = 0;
			this.seconds = 0;
			this.pomodoro = 0;
			this.workTime = parseInt(workInput.value);
			this.chillTime = parseInt(chillInput.value);
			this.setListeners();
		}
		render(minutes, seconds) {
			this.txt.textContent = `${minutes}:${seconds < 10 ? '0'+seconds : seconds}`; 
			document.querySelector('.scores').textContent = this.pomodoro;
		}
		setListeners() {
			this.root.addEventListener('click', (e) => {
				e.preventDefault();
				if(e.target.id == 'play') {
					this.setTimer();
				}
				if(e.target.id == 'stop') {
					this.stopTimer();
					e.target.classList.add('active-btn');
					setTimeout( () => e.target.id = 'return', 0 );
				}
				if(e.target.id == 'return') {
					this.returnTimer();
					e.target.classList.remove('active-btn');
					setTimeout( () => e.target.id = 'stop', 0 );
				}
			});
		}
		getTime(value) {
			const time = new Date();
			if(value) {
				time.setMinutes( time.getMinutes() + value );
			} else {
				time.setMinutes( time.getMinutes() + this.minutes );
				time.setSeconds(time.getSeconds() + this.seconds);
			}
			return time;
		}
		setTimer(isReturn) {
			this.root.classList.add('active-timer');
			let timerTime = this.getTime( this.isWork ? this.workTime : this.chillTime );
			if(isReturn) timerTime = this.getTime();
					
			this.updateTimer(timerTime);
			this.loop = setInterval( () => {
				this.updateTimer(timerTime);
			}, 1000 );
		}
		updateTimer(time) {
			this.total = Date.parse( time ) - Date.parse( new Date() );
			this.minutes =  Math.floor( (this.total / 1000 / 60) % 60 );
			this.seconds = Math.floor( (this.total / 1000) % 60 );

			this.isTimeEnd();
			this.render(this.minutes, this.seconds);
		}
		updatePomodoro() {
			if(this.isWork) {
				this.pomodoro++;
			}
		}
		stopTimer() {
			clearInterval(this.loop);
			this.loop = null;
		}
		returnTimer() {
			this.setTimer(true);
		}
		isTimeEnd() {
			if(this.total === 0) {
				this.reset();
				this.isWork = !this.isWork;
				this.setTimer();
				this.updatePomodoro();
				document.body.classList.toggle('chill');
			}
		}
		reset() {
			this.stopTimer();
			this.total = 0;
			this.workTime = +workInput.value;
			this.chillTime = +chillInput.value;
			this.root.classList.remove('active-timer');
			this.root.querySelector('.stop-btn').classList.remove('active-btn');
		}
	}

	let timer = new Timer('.timer');

	//Настройки
	settingsBtn.addEventListener('click', onSaveOptionsHandler);

	//Модальные окна
	popupButtons.forEach(item => {
		item.addEventListener('click', onAppendPopupHandler);
	});

	modals.forEach(item => {
		item.addEventListener('click', onDeletePopupHandler);
	});

	function onAppendPopupHandler(e) {
		e.preventDefault();
		const popup = document.querySelector(`.${this.dataset.popup}`);
		popup.classList.remove('hide');
	}

	function onDeletePopupHandler(e) {
		e.preventDefault();
		if(e.target.classList.contains('popup') || e.target.closest('.close')) {
			this.classList.add('hide');
		}
	}

	function onSaveOptionsHandler() {
		const parent = this.closest('.popup');
		parent.classList.add('hide');

		timer.reset();
		document.body.classList.remove('chill');
	}
});