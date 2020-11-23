var buttonOpen = document.querySelector('.main-nav__come');
var formCheckin = document.querySelector('.popup');
var loginLogin = formCheckin.querySelector('.popup__input--data');
var fillingForm = formCheckin.querySelector('.popup__form');
var inputPassword = fillingForm.querySelector('.popup__input--password');
var userName = document.querySelector('.main-nav__username');

var isStorageSupport = true;
var storage = "";
var saveName = "";

try {
	storage = localStorage.getItem("login");
	saveName = localStorage.getItem("name");
	userName.textContent = storage;
} catch (err) {
	isStorageSupport = false;
}

buttonOpen.addEventListener('click', function(evt) {
	evt.preventDefault();
	formCheckin.classList.add('popup__open');

	if (storage) {
		loginLogin.value = storage;
		inputPassword.focus();
	} else {
		loginLogin.focus();
	}
});

//сохранение логина
fillingForm.addEventListener("submit", function(evt) {
	window.location.reload();
	evt.preventDefault();
	if (!loginLogin.value || !inputPassword.value) {
		evt.preventDefault();
	} else {
		if (isStorageSupport) {
			localStorage.setItem("login", loginLogin.value);
			localStorage.setItem("name", userName.textContent);
		}
	}
});

if (userName.textContent === '') {
	buttonOpen;
} else {
	buttonOpen.classList.add('main-nav__hide');
	var logOff = document.querySelector('.main-nav__log-off');
	logOff.classList.add('main-nav__log-open');
	logOff.addEventListener('click', function(evt) {
		evt.preventDefault();
		formCheckin.classList.add('popup__open');
		loginLogin.value = userName.textContent;
		inputPassword.focus();
	});
}

//клик по имени пользователя и появление модального окна
userName.addEventListener('click', function(evt) {
	evt.preventDefault();
	formCheckin.classList.add('popup__open');
	loginLogin.value = userName.textContent;
	inputPassword.focus();
});


window.onclick = function(evt) {
	if (evt.target === formCheckin) {
		evt.preventDefault();
		formCheckin.classList.remove('popup__open');
	}
};

window.addEventListener('keydown', function(evt) {
	if (evt.key === 'Escape') {
		evt.preventDefault();
		formCheckin.classList.remove('popup__open');
	}
});
