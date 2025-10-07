// ============================================================================
// BOOKINGS.JS - Dynamic form generation for booking appointments
// ============================================================================
// This script dynamically creates booking form elements including date picker,
// time selection dropdowns, and submit button. All elements are created with
// proper accessibility features for screen readers and keyboard navigation.

/**
 * Main initialization function that runs when the DOM is fully loaded.
 * Sets up event listeners and initializes the booking form components.
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM is fully loaded and parsed');
    // Find the main booking form container
    // Initialize all booking form components
    initialiseUserInfo();
    initialiseBookingInfo();
});

function toggleInfoPage(){
  const bookingForm = document.getElementsByClassName("bookings-container")[0];
  Array.from(bookingForm.children).forEach(child => {
    child.classList.toggle('d-none');
  });
}

function initialiseUserInfo(){
  const bookingForm = document.getElementsByClassName("bookings-container")[0];
  const userInfo = document.createElement('div');
  userInfo.id = 'user-info-container'
  const contButton = initialiseButton('cont');
  contButton.addEventListener('click', toggleInfoPage);
  userInfo.appendChild(contButton);
  bookingForm.appendChild(userInfo);
}

/**
 * Initializes all booking form components and appends them to the form.
 * Creates date picker, time selection dropdowns, and submit button with
 * proper accessibility features and user-friendly time constraints.
 */
function initialiseBookingInfo(){
  const bookingForm = document.getElementsByClassName("bookings-container")[0];
  const bookingInfo = document.createElement('div');
  bookingInfo.id = 'booking-info-container';
  // Define business hours for time selection (9:30 AM to 6:00 PM)
  const dayStart = [9, 30];  // 9:30 AM
  const dayEnd = [18, 0];    // 6:00 PM
  
  // Create all form components with accessibility features
  const calendarElement = initialiseCalendar();
  const backButton = initialiseButton('back');
  backButton.addEventListener('click', toggleInfoPage);
  const submitButton = initialiseButton('submit');
  // Create time selectors with 20-minute increments
  const startTime = initialiseTime('Earliest Availability', dayStart, dayEnd, 20);
  const endTime = initialiseTime('Latest Availability', dayStart, dayEnd, 20);

  // Append all components to the form in logical order
  bookingInfo.appendChild(calendarElement);
  bookingInfo.appendChild(startTime);
  bookingInfo.appendChild(endTime);
  bookingInfo.appendChild(backButton);
  bookingInfo.appendChild(submitButton);

  bookingInfo.classList.add('d-none');
  bookingForm.appendChild(bookingInfo);
}

/**
 * Creates a date picker input with proper accessibility features.
 * Prevents users from selecting past dates by setting minimum date to tomorrow.
 * Includes screen reader support with ARIA labels and help text.
 * 
 * @returns {HTMLElement} Complete date picker container with label and input
 */
function initialiseCalendar() {
    // Create main container with Bootstrap classes and accessibility role
    const calendarContainer = document.createElement('div');
    calendarContainer.classList.add('col-12', 'mb-3', 'mt-4');
    calendarContainer.setAttribute('role', 'group');
    calendarContainer.setAttribute('aria-labelledby', 'calendar-label');
    
    // Create label element with proper association
    const calendarLabel = document.createElement('label');
    calendarLabel.textContent = 'Select Date:';
    calendarLabel.classList.add= 'form-label';
    calendarLabel.htmlFor = 'booking_date';
    calendarLabel.id = 'calendar-label';
    
    // Create date input with accessibility attributes
    const calendarElement = document.createElement('input');
    calendarElement.type = 'date';
    calendarElement.name = 'booking_date';
    calendarElement.id = 'booking_date';
    calendarElement.className = 'form-control';
    calendarElement.min = getTomorrowDate();  // Prevent past date selection
    calendarElement.setAttribute('aria-required', 'true');
    calendarElement.setAttribute('aria-describedby', 'date-help');
    calendarElement.setAttribute('aria-label', 'Select your preferred booking date');
    
    // Create help text for screen readers (visually hidden)
    const helpText = document.createElement('small');
    helpText.id = 'date-help';
    helpText.className = 'form-text text-muted visually-hidden';
    helpText.textContent = 'Choose a date for your initial consultation call. Dates before tomorrow are not available.';
    
    // Assemble the complete structure
    calendarContainer.appendChild(calendarLabel);
    calendarContainer.appendChild(calendarElement);
    calendarContainer.appendChild(helpText);
    
    return calendarContainer;
}

/**
 * Utility function to get tomorrow's date in YYYY-MM-DD format.
 * Used to set the minimum date for the date picker to prevent
 * users from selecting past dates or today (same-day booking not allowed).
 * 
 * @returns {string} Tomorrow's date in ISO format (YYYY-MM-DD)
 */
function getTomorrowDate() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);  // Add one day
    // Return date in YYYY-MM-DD format required by HTML date input
    return tomorrow.toISOString().split('T')[0];
}

/**
 * Creates a submit button with accessibility features and user guidance.
 * Includes ARIA labels and hidden help text to explain the submission process
 * to users, especially those using screen readers.
 * 
 * @returns {HTMLElement} Complete submit button container with accessibility features
 */
function initialiseButton(btn_type){
  // Create main container with accessibility role
  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('col-12', 'mb-3');
  buttonContainer.setAttribute('role', 'group');
  buttonContainer.setAttribute('aria-label', 'Form submission');
  
  const newButton = document.createElement('button');

  if (btn_type == 'submit') {
    newButton.type = 'submit';
    newButton.classList.add('btn', 'cstm-btn-action');
    newButton.textContent = 'Submit Booking';
  } else {
    newButton.type = 'button';  // Explicitly set to button to prevent form submission
    newButton.classList.add('btn', 'cstm-btn-outline');
    if (btn_type == 'cont') {
      newButton.textContent = 'Continue';
    } else if (btn_type == 'back') {
      newButton.textContent = 'Back';
    } else {
      newButton.textContent = 'Placeholder';
    }
  }
  buttonContainer.appendChild(newButton);
  return buttonContainer;
}

/**
 * Creates time selection dropdowns (hour and minute) with accessibility features.
 * Generates separate dropdowns for hours and minutes within business hours,
 * with proper labeling and screen reader support.
 * 
 * @param {string} selectElName - Display name for the time selector (e.g., "Start Time", "End Time")
 * @param {Array<number>} dayStart - [hour, minute] for business day start (e.g., [9, 30] = 9:30 AM)
 * @param {Array<number>} dayEnd - [hour, minute] for business day end (e.g., [18, 0] = 6:00 PM)
 * @param {number} minIncrement - Minute increment for dropdown options (e.g., 20 = 0, 20, 40)
 * @returns {HTMLElement} Complete time selection container with hour and minute dropdowns
 */
function initialiseTime(selectElName, dayStart, dayEnd, minIncrement){
  // Create main container with accessibility grouping
  const timeContainer = document.createElement('div');
  timeContainer.classList.add('col-12', 'mb-3');
  timeContainer.setAttribute('role', 'group');
  timeContainer.setAttribute('aria-labelledby', selectElName + '_label');
  
  // Create main label for the time selection group
  const selectLabel = document.createElement('label');
  selectLabel.textContent = selectElName + ":";
  selectLabel.className = 'form-label';
  selectLabel.id = selectElName + '_label';
  
  // Create row container for side-by-side hour and minute dropdowns
  const timeSelectRow = document.createElement('div');
  timeSelectRow.classList.add('row', 'g-2');
  timeSelectRow.setAttribute('role', 'group');
  timeSelectRow.setAttribute('aria-label', selectElName + ' selection');
  
  // === HOUR SELECTION DROPDOWN ===
  const hourContainer = document.createElement('div');
  hourContainer.classList.add('col-6');  // Half width for side-by-side layout
  
  // Create hour dropdown with accessibility attributes
  const hourSelect = document.createElement('select');
  hourSelect.name = selectElName + '_hour';
  hourSelect.id = selectElName + '_hour';
  hourSelect.classList.add('form-control');
  hourSelect.setAttribute('aria-label', selectElName + ' hour selection');
  hourSelect.setAttribute('aria-required', 'true');
  hourSelect.setAttribute('aria-describedby', selectElName + '_hour_help');
  
  // Add placeholder option for hour dropdown
  const hourDefaultOption = document.createElement('option');
  hourDefaultOption.value = '';
  hourDefaultOption.textContent = 'Hour';
  hourDefaultOption.disabled = true;
  hourDefaultOption.selected = true;
  hourDefaultOption.setAttribute('aria-label', 'Select hour');
  hourSelect.appendChild(hourDefaultOption);
  
  // Generate hour options within business hours
  for (let i = dayStart[0]; i <= dayEnd[0]; i++) {
    const hourOption = document.createElement('option');
    hourOption.value = i;
    const displayHour = i < 10 ? "0" + i : i.toString();  // Zero-pad single digits
    hourOption.textContent = displayHour;
    hourOption.setAttribute('aria-label', displayHour + ' o\'clock');
    hourSelect.appendChild(hourOption);
  }
  
  // Create help text for hour selection (screen reader only)
  const hourHelp = document.createElement('small');
  hourHelp.id = selectElName + '_hour_help';
  hourHelp.className = 'form-text text-muted visually-hidden';
  hourHelp.textContent = 'Select the hour for your ' + selectElName.toLowerCase();
  
  // === MINUTE SELECTION DROPDOWN ===
  const minContainer = document.createElement('div');
  minContainer.classList.add('col-6');  // Half width for side-by-side layout
  
  // Create minute dropdown with accessibility attributes
  const minSelect = document.createElement('select');
  minSelect.name = selectElName + '_min';
  minSelect.id = selectElName + '_min';
  minSelect.classList.add('form-control');
  minSelect.setAttribute('aria-label', selectElName + ' minute selection');
  minSelect.setAttribute('aria-required', 'true');
  minSelect.setAttribute('aria-describedby', selectElName + '_min_help');
  
  // Add placeholder option for minute dropdown
  const minDefaultOption = document.createElement('option');
  minDefaultOption.value = '';
  minDefaultOption.textContent = 'Min';
  minDefaultOption.disabled = true;
  minDefaultOption.selected = true;
  minDefaultOption.setAttribute('aria-label', 'Select minutes');
  minSelect.appendChild(minDefaultOption);
  
  // Generate minute options based on specified increment
  for (let i = 0; i < 60; i += minIncrement){
    const minOption = document.createElement('option');
    minOption.value = i;
    const displayMin = i === 0 ? "00" : i.toString();  // Show "00" for zero minutes
    minOption.textContent = displayMin;
    minOption.setAttribute('aria-label', displayMin + ' minutes');
    minSelect.appendChild(minOption);
  }
  
  // Create help text for minute selection (screen reader only)
  const minHelp = document.createElement('small');
  minHelp.id = selectElName + '_min_help';
  minHelp.className = 'form-text text-muted visually-hidden';
  minHelp.textContent = 'Select the minutes for your ' + selectElName.toLowerCase();
  
  // === ASSEMBLE COMPLETE TIME SELECTION STRUCTURE ===
  // Add dropdowns and help text to their containers
  hourContainer.appendChild(hourSelect);
  hourContainer.appendChild(hourHelp);
  minContainer.appendChild(minSelect);
  minContainer.appendChild(minHelp);
  
  // Add both containers to the row
  timeSelectRow.appendChild(hourContainer);
  timeSelectRow.appendChild(minContainer);
  
  // Add label and row to main container
  timeContainer.appendChild(selectLabel);
  timeContainer.appendChild(timeSelectRow);
  
  return timeContainer;
}