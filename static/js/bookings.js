document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM is fully loaded and parsed');
    const bookingForm = document.getElementsByClassName("bookings-container")[0];
    calendarElement = initialiseCalendar();
    submitButton = initialiseSubmitButton();
    bookingForm.appendChild(calendarElement);
    bookingForm.appendChild(submitButton);
});

function initialiseCalendar() {
    const calendarElement = document.createElement('input');
    calendarElement.type = 'date';
    calendarElement.name = 'booking_date';
    calendarElement.id = 'booking_date';
    calendarElement.className = 'form-control';
    calendarElement.min = getTomorrowDate();
    return calendarElement;
}

function getTomorrowDate() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate()+1)
    return tomorrow.toISOString().split('T')[0];
}

function initialiseSubmitButton(){
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.classList.add('btn', 'cstm-btn-action')
  submitButton.innerText = 'Submit Booking';
  return submitButton;
}