const dropdownItems = document.querySelectorAll('.dropdown-item');
const hiddenInput = document.getElementById('selectedCategory');
const btnText = document.getElementById('dropdownBtn');

dropdownItems.forEach((item) => {
	item.addEventListener('click', function () {
		const selected = this.getAttribute('data-value');
		hiddenInput.value = selected;
		btnText.innerText = selected;
	});
});
