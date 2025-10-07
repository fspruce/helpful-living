document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM is fully loaded and parsed');
    const bookingForm = document.getElementsByClassName("bookings-container")[0];
    initialiseBookingInfo(bookingForm);
});

function initialiseBookingInfo(bookingForm){
  const dayStart = [9, 30];
  const dayEnd = [18, 0];
  const calendarElement = initialiseCalendar();
  const submitButton = initialiseSubmitButton();
  const startTime = initialiseTime('Start Time', dayStart, dayEnd, 20);
  const endTime = initialiseTime('End Time', dayStart, dayEnd, 20)
  bookingForm.appendChild(calendarElement);
  bookingForm.appendChild(startTime);
  bookingForm.appendChild(endTime);
  bookingForm.appendChild(submitButton);
}

function initialiseCalendar() {
    // Create main container with extra top margin
    const calendarContainer = document.createElement('div');
    calendarContainer.classList.add('col-12', 'mb-3', 'mt-4');
    calendarContainer.setAttribute('role', 'group');
    calendarContainer.setAttribute('aria-labelledby', 'calendar-label');
    
    // Create label
    const calendarLabel = document.createElement('label');
    calendarLabel.textContent = 'Select Date:';
    calendarLabel.className = 'form-label';
    calendarLabel.htmlFor = 'booking_date';
    calendarLabel.id = 'calendar-label';
    
    // Create date input
    const calendarElement = document.createElement('input');
    calendarElement.type = 'date';
    calendarElement.name = 'booking_date';
    calendarElement.id = 'booking_date';
    calendarElement.className = 'form-control';
    calendarElement.min = getTomorrowDate();
    calendarElement.setAttribute('aria-required', 'true');
    calendarElement.setAttribute('aria-describedby', 'date-help');
    calendarElement.setAttribute('aria-label', 'Select your preferred booking date');
    
    // Create help text for screen readers
    const helpText = document.createElement('small');
    helpText.id = 'date-help';
    helpText.className = 'form-text text-muted visually-hidden';
    helpText.textContent = 'Choose a date for your initial consultation call. Dates before tomorrow are not available.';
    
    // Assemble the structure
    calendarContainer.appendChild(calendarLabel);
    calendarContainer.appendChild(calendarElement);
    calendarContainer.appendChild(helpText);
    
    return calendarContainer;
}

function getTomorrowDate() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate()+1)
    return tomorrow.toISOString().split('T')[0];
}

function initialiseSubmitButton(){
  // Create main container
  const submitContainer = document.createElement('div');
  submitContainer.classList.add('col-12', 'mb-3');
  submitContainer.setAttribute('role', 'group');
  submitContainer.setAttribute('aria-label', 'Form submission');
  
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.classList.add('btn', 'cstm-btn-action');
  submitButton.textContent = 'Submit Booking';
  submitButton.setAttribute('aria-label', 'Submit your booking request for initial consultation');
  submitButton.setAttribute('aria-describedby', 'submit-help');
  
  // Create help text for screen readers
  const submitHelp = document.createElement('small');
  submitHelp.id = 'submit-help';
  submitHelp.className = 'form-text text-muted visually-hidden';
  submitHelp.textContent = 'Click to submit your booking request. We will contact you to confirm the appointment.';
  
  // Assemble the structure
  submitContainer.appendChild(submitButton);
  submitContainer.appendChild(submitHelp);
  
  return submitContainer;
}

function initialiseTime(selectElName, dayStart, dayEnd, minIncrement){
  // Create main container
  const timeContainer = document.createElement('div');
  timeContainer.classList.add('col-12', 'mb-3');
  timeContainer.setAttribute('role', 'group');
  timeContainer.setAttribute('aria-labelledby', selectElName + '_label');
  
  // Create label
  const selectLabel = document.createElement('label');
  selectLabel.textContent = selectElName + ":";
  selectLabel.className = 'form-label';
  selectLabel.id = selectElName + '_label';
  
  // Create row container for hour and minute selects
  const timeSelectRow = document.createElement('div');
  timeSelectRow.classList.add('row', 'g-2');
  timeSelectRow.setAttribute('role', 'group');
  timeSelectRow.setAttribute('aria-label', selectElName + ' selection');
  
  // Create hour select container
  const hourContainer = document.createElement('div');
  hourContainer.classList.add('col-6');
  
  const hourSelect = document.createElement('select');
  hourSelect.name = selectElName + '_hour';
  hourSelect.id = selectElName + '_hour';
  hourSelect.classList.add('form-control');
  hourSelect.setAttribute('aria-label', selectElName + ' hour selection');
  hourSelect.setAttribute('aria-required', 'true');
  hourSelect.setAttribute('aria-describedby', selectElName + '_hour_help');
  
  // Add default option for hour select
  const hourDefaultOption = document.createElement('option');
  hourDefaultOption.value = '';
  hourDefaultOption.textContent = 'Hour';
  hourDefaultOption.disabled = true;
  hourDefaultOption.selected = true;
  hourDefaultOption.setAttribute('aria-label', 'Select hour');
  hourSelect.appendChild(hourDefaultOption);
  
  for (let i = dayStart[0]; i <= dayEnd[0]; i++) {
    const hourOption = document.createElement('option');
    hourOption.value = i;
    const displayHour = i < 10 ? "0" + i : i.toString();
    hourOption.textContent = displayHour;
    hourOption.setAttribute('aria-label', displayHour + ' o\'clock');
    hourSelect.appendChild(hourOption);
  }
  
  // Create hour help text
  const hourHelp = document.createElement('small');
  hourHelp.id = selectElName + '_hour_help';
  hourHelp.className = 'form-text text-muted visually-hidden';
  hourHelp.textContent = 'Select the hour for your ' + selectElName.toLowerCase();
  
  // Create minute select container
  const minContainer = document.createElement('div');
  minContainer.classList.add('col-6');
  
  const minSelect = document.createElement('select');
  minSelect.name = selectElName + '_min';
  minSelect.id = selectElName + '_min';
  minSelect.classList.add('form-control');
  minSelect.setAttribute('aria-label', selectElName + ' minute selection');
  minSelect.setAttribute('aria-required', 'true');
  minSelect.setAttribute('aria-describedby', selectElName + '_min_help');
  
  // Add default option for minute select
  const minDefaultOption = document.createElement('option');
  minDefaultOption.value = '';
  minDefaultOption.textContent = 'Min';
  minDefaultOption.disabled = true;
  minDefaultOption.selected = true;
  minDefaultOption.setAttribute('aria-label', 'Select minutes');
  minSelect.appendChild(minDefaultOption);
  
  for (let i = 0; i < 60; i += minIncrement){
    const minOption = document.createElement('option');
    minOption.value = i;
    const displayMin = i === 0 ? "00" : i.toString();
    minOption.textContent = displayMin;
    minOption.setAttribute('aria-label', displayMin + ' minutes');
    minSelect.appendChild(minOption);
  }
  
  // Create minute help text
  const minHelp = document.createElement('small');
  minHelp.id = selectElName + '_min_help';
  minHelp.className = 'form-text text-muted visually-hidden';
  minHelp.textContent = 'Select the minutes for your ' + selectElName.toLowerCase();
  
  // Assemble the structure
  hourContainer.appendChild(hourSelect);
  hourContainer.appendChild(hourHelp);
  minContainer.appendChild(minSelect);
  minContainer.appendChild(minHelp);
  timeSelectRow.appendChild(hourContainer);
  timeSelectRow.appendChild(minContainer);
  timeContainer.appendChild(selectLabel);
  timeContainer.appendChild(timeSelectRow);
  
  return timeContainer;
}