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
		render(minutes, seconds) {//Вывод текста и работа с DOM
			this.txt.textContent = `${minutes}:${seconds < 10 ? '0'+seconds : seconds}`; 
			document.querySelector('.scores').textContent = this.pomodoro;
		}
		setListeners() {//Обработчики событий для таймера
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
		getTime(value) {//Получение времени и его для таймера
			const time = new Date();
			if(value) {
				time.setMinutes( time.getMinutes() + value );
			} else {
				time.setMinutes( time.getMinutes() + this.minutes );
				time.setSeconds(time.getSeconds() + this.seconds);
			}
			return time;
		}
		setTimer(isReturn) {//Запуск таймер. IsReturn нужен для возврата таймера
			this.root.classList.add('active-timer');
			let timerTime = this.getTime( this.isWork ? this.workTime : this.chillTime );
			if(isReturn) timerTime = this.getTime();
					
			this.updateTimer(timerTime);
			this.loop = setInterval( () => {
				this.updateTimer(timerTime);
			}, 1000 );
		}
		updateTimer(time) {//Вычисления времени таймера и рендер текста
			this.total = Date.parse( time ) - Date.parse( new Date() );
			this.minutes =  Math.floor( (this.total / 1000 / 60) % 60 );
			this.seconds = Math.floor( (this.total / 1000) % 60 );

			this.isTimeEnd();
			this.render(this.minutes, this.seconds);
		}
		onTimerAndHandler() {//Увеличение очков таймера и вывод сообщения
			if(this.isWork) {
				this.pomodoro++;
				this.notifSet('Время отдыха вышло', 'Вернёмся к работе!');
			} else {
				this.notifSet('Время работы вышло', 'Дай себе отдохнуть и сделай перерыв');
			}
		}
		stopTimer() {//Остановка таймера
			clearInterval(this.loop);
			this.loop = null;
		}
		returnTimer() {//Возврат таймера из паузы
			this.setTimer(true);
		}
		isTimeEnd() {//Проверка состояния таймера
			if(this.total === 0) {
				this.reset();
				this.isWork = !this.isWork;
				this.setTimer();
				this.onTimerAndHandler();
				document.body.classList.toggle('chill');
			}
		}
		reset() {//Сброс настроек таймера
			this.stopTimer();
			this.total = 0;
			this.workTime = +workInput.value;
			this.chillTime = +chillInput.value;
			this.root.classList.remove('active-timer');
			this.root.querySelector('.stop-btn').classList.remove('active-btn');
		}
		notifyMe(title, txt) {//Создание сообщения
			const notification = new Notification (title, {
				tag : "ache-mail",
				body : txt,
				icon : "https://www.pinclipart.com/picdir/middle/82-821023_youtube-bell-png-youtube-notification-bell-png-clipart.png"
			});
		}
		notifSet (title, text) {//Отправка сообщения и проиграывение аудио
			if (!("Notification" in window)) alert ("Ваш браузер не поддерживает уведомления.");
			else if (Notification.permission === "granted") this.notifyMe(title, text);
			else if (Notification.permission !== "denied") {
				Notification.requestPermission (function (permission) {
					if (!('permission' in Notification))
						Notification.permission = permission;
					if (permission === "granted") this.notifyMe(title, text);
				});
			}
			new Audio('audio/notification.mp3').play();
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

	//Функции событий
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