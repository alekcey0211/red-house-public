Array.from(document.querySelectorAll('script[static]')).forEach((script) => {
	script.setAttribute('src', script.getAttribute('static'));
	script.removeAttribute('static');
});
