import * as _ from './utils/array';

window.addEventListener('DOMContentLoaded', () => {
  setupStatusQuickEdit();
  setupTitleQuickEdit();
});

function setupStatusQuickEdit() {
  let statusFilter = document.querySelector('select[name="post_status"]');
  if (statusFilter == null) return;

  let options = statusFilter.querySelectorAll('[value^="booking_"]');
  let statusQuickEdit = document.querySelectorAll('select[name="_status"]');

  for (let select of Array.from(statusQuickEdit)) {
    select.innerHTML = '';
    for (let option of Array.from(options)) {
      let clone = option.cloneNode(true);
      select.appendChild(clone);
    }
  }
}

function setupTitleQuickEdit() {
  let titleInputs = document.querySelectorAll('input[name="post_title"]');
  for (let input of Array.from(titleInputs)) {
    if (input instanceof HTMLInputElement) {
      input.readOnly = true;
    }
  }
}
