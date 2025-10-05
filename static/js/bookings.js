document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM is fully loaded and parsed');
    const bookingForm = document.getElementsByClassName("bookings-container")[0];
    
    if (!bookingForm) {
        console.error('Booking form not found');
        return;
    }
    
    const calendarElement = initialiseCalendar();
    const submitButton = initialiseSubmitButton();
    const startTime = initialiseTime('Start Time', [9, 30], [18, 0], 20);
    
    bookingForm.appendChild(calendarElement);
    bookingForm.appendChild(startTime);
    bookingForm.appendChild(submitButton);
});

function initialiseCalendar() {
    // Create main container with extra top margin
    const calendarContainer = document.createElement('div');
    calendarContainer.classList.add('col-12', 'mb-3', 'mt-4');
    
    // Create label
    const calendarLabel = document.createElement('label');
    calendarLabel.textContent = 'Select Date:';
    calendarLabel.className = 'form-label';
    calendarLabel.htmlFor = 'booking_date';
    
    // Create date input
    const calendarElement = document.createElement('input');
    calendarElement.type = 'date';
    calendarElement.name = 'booking_date';
    calendarElement.id = 'booking_date';
    calendarElement.className = 'form-control';
    calendarElement.min = getTomorrowDate();
    
    // Assemble the structure
    calendarContainer.appendChild(calendarLabel);
    calendarContainer.appendChild(calendarElement);
    
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
  
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.classList.add('btn', 'cstm-btn-action');
  submitButton.textContent = 'Submit Booking';
  
  // Assemble the structure
  submitContainer.appendChild(submitButton);
  
  return submitContainer;
}

function initialiseTime(selectElName, dayStart, dayEnd, minIncrement){
  // Create main container
  const timeContainer = document.createElement('div');
  timeContainer.classList.add('col-12', 'mb-3');
  
  // Create label
  const selectLabel = document.createElement('label');
  selectLabel.textContent = "Start Time:";
  selectLabel.className = 'form-label';
  
  // Create row container for hour and minute selects
  const timeSelectRow = document.createElement('div');
  timeSelectRow.classList.add('row', 'g-2');
  
  // Create hour select container
  const hourContainer = document.createElement('div');
  hourContainer.classList.add('col-6');
  
  const hourSelect = document.createElement('select');
  hourSelect.name = selectElName + '_hour';
  hourSelect.id = selectElName + '_hour';
  hourSelect.classList.add('form-control');
  
  for (let i = dayStart[0]; i <= dayEnd[0]; i++) {
    const hourOption = document.createElement('option');
    hourOption.value = i;
    hourOption.textContent = i < 10 ? "0" + i : i.toString();
    hourSelect.appendChild(hourOption);
  }
  
  // Create minute select container
  const minContainer = document.createElement('div');
  minContainer.classList.add('col-6');
  
  const minSelect = document.createElement('select');
  minSelect.name = selectElName + '_min';
  minSelect.id = selectElName + '_min';
  minSelect.classList.add('form-control');
  
  for (let i = 0; i < 60; i += minIncrement){
    const minOption = document.createElement('option');
    minOption.value = i;
    minOption.textContent = i === 0 ? "00" : i.toString();
    minSelect.appendChild(minOption);
  }
  
  // Assemble the structure
  hourContainer.appendChild(hourSelect);
  minContainer.appendChild(minSelect);
  timeSelectRow.appendChild(hourContainer);
  timeSelectRow.appendChild(minContainer);
  timeContainer.appendChild(selectLabel);
  timeContainer.appendChild(timeSelectRow);
  
  return timeContainer;
}