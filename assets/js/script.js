const registerServiceWorker = async () => {
	if ("serviceWorker" in navigator) {
		try {
			const registration = await navigator.serviceWorker.register("sw.js");
			if (registration.installing) {
				console.log("Service worker installing");
			} else if (registration.waiting) {
				console.log("Service worker installed");
			} else if (registration.active) {
				console.log("Service worker active");
			}
		} catch (error) {
			console.error(`Registration failed with ${error}`);
		}
	}
};

registerServiceWorker();

let deferredPrompt;
a2hs.style.display = 'none';
github.style.display = 'block';

window.addEventListener('beforeinstallprompt', (e) => {
	e.preventDefault();
	deferredPrompt = e;
	a2hs.style.display = 'block';
	a2hs.addEventListener('click', () => {
		a2hs.style.display = 'none';
		deferredPrompt.prompt();
		deferredPrompt.userChoice.then((choiceResult) => {
			if (choiceResult.outcome === 'accepted') {
				console.log('User accepted the A2HS prompt');
			} else {
				console.log('User dismissed the A2HS prompt');
			}
			deferredPrompt = null;
		});
	});
});

function wrap(elem)
{
	choice.className = 'hide';
	upload.className = '';
	back.className = '';
	passwordButton.innerHTML = elem.innerHTML;
	switch(elem.innerHTML) {
		case 'Зашифровать':
			passwordLabel.textContent = 'Придумайте пароль от 6 символов.';
			break;

		case 'Расшифровать':
			passwordLabel.textContent = 'Используйте ранее заданный для шифрования данного файла пароль.';
			break;

		case '&lt;':
			file.files = null;
			file.value = null;
			choice.className = '';
			back.className = 'hide';
			upload.className = 'hide';
			password.className = 'hide';
			download.className = 'hide';
			passwordInput.value = ''
			break;

		default:
			break;
	}
}

function showFile(input)
{
	let x = input.files[0];
	let reader = new FileReader();
	if (passwordButton.innerHTML == 'Зашифровать') reader.readAsDataURL(x);
	if (passwordButton.innerHTML == 'Расшифровать') reader.readAsText(x);
	reader.onload = function() {
		file.x = x;
		file.data = reader.result;
		upload.className = 'hide';
		password.className = '';
	};
	reader.onerror = function() {
		alert(reader.error);
	};
}

function cryptAction(elem)
{
	if (passwordInput.value.length < 6) {
		alert('Пароль должен быть не менее 6 символов!');
	} else {
		switch(elem.innerHTML) {
			case 'Зашифровать':
				var encrypted = CryptoJS.AES.encrypt(file.data, passwordInput.value);
				downloadHref.setAttribute('href', 'data:application/octet-stream,' + encrypted);
				downloadHref.setAttribute('download', file.x.name + '.encrypted');
				downloadButton.setAttribute('onclick', 'downloadHref.click()');
				passwordInput.value = ''
				password.className = 'hide';
				downloadLabel = 'Файл успешно зашифрован. Нажмите кнопку «Скачать» чтобы сохранить его на устройство.';
				download.className = '';
   				break;

			case 'Расшифровать':
				var decrypted = CryptoJS.AES.decrypt(file.data, passwordInput.value).toString(CryptoJS.enc.Latin1);
				if(!/^data:/.test(decrypted)){
					alert('Неверный пароль или файл! Пожалуйста, попробуйте еще раз.');
					return false;
				}
				downloadHref.setAttribute('href', decrypted);
				downloadHref.setAttribute('download', file.x.name.replace('.encrypted',''));
				downloadButton.setAttribute('onclick', 'downloadHref.click()');
				passwordInput.value = ''
				password.className = 'hide';
				downloadLabel = 'Файл успешно расшифрован. Нажмите кнопку «Скачать» чтобы сохранить его на устройство.';
				download.className = '';
				break;

			default:
				break;
		}
	}
}
