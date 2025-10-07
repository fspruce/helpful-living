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
  const bookingForm = document.getElementById('booking-form');
  Array.from(bookingForm.children).forEach(child => {
    child.classList.toggle('d-none');
  });
}

function initialiseUserInfo(){
  const bookingForm = document.getElementById('booking-form');
  const userInfo = document.createElement('div');
  userInfo.id = 'user-info-container';
  
  // Create first name input with proper labeling
  const firstNameContainer = document.createElement('div');
  firstNameContainer.classList.add('col-12', 'mb-3');
  
  const firstNameLabel = document.createElement('label');
  firstNameLabel.textContent = 'First Name:';
  firstNameLabel.className = 'form-label';
  firstNameLabel.htmlFor = 'first_name';
  firstNameLabel.id = 'first_name_label';
  
  const firstName = document.createElement('input');
  firstName.type = 'text';
  firstName.name = 'first_name';
  firstName.id = 'first_name';
  firstName.placeholder = 'Enter your first name';
  firstName.className = 'form-control';
  firstName.required = true;
  firstName.setAttribute('aria-required', 'true');
  firstName.setAttribute('aria-label', 'Enter your first name');
  
  firstNameContainer.appendChild(firstNameLabel);
  firstNameContainer.appendChild(firstName);
  userInfo.appendChild(firstNameContainer);
  
  // Create last name input with proper labeling
  const lastNameContainer = document.createElement('div');
  lastNameContainer.classList.add('col-12', 'mb-3');
  
  const lastNameLabel = document.createElement('label');
  lastNameLabel.textContent = 'Last Name:';
  lastNameLabel.className = 'form-label';
  lastNameLabel.htmlFor = 'last_name';
  lastNameLabel.id = 'last_name_label';
  
  const lastName = document.createElement('input');
  lastName.type = 'text';
  lastName.name = 'last_name';
  lastName.id = 'last_name';
  lastName.placeholder = 'Enter your last name';
  lastName.className = 'form-control';
  lastName.required = true;
  lastName.setAttribute('aria-required', 'true');
  lastName.setAttribute('aria-label', 'Enter your last name');
  
  lastNameContainer.appendChild(lastNameLabel);
  lastNameContainer.appendChild(lastName);
  userInfo.appendChild(lastNameContainer);
  
  // Create email input with proper labeling
  const emailContainer = document.createElement('div');
  emailContainer.classList.add('col-12', 'mb-3');
  
  const emailLabel = document.createElement('label');
  emailLabel.textContent = 'Email Address:';
  emailLabel.className = 'form-label';
  emailLabel.htmlFor = 'email_address';
  emailLabel.id = 'email_address_label';
  
  const email = document.createElement('input');
  email.type = 'email';
  email.name = 'email_address';
  email.id = 'email_address';
  email.placeholder = 'Enter your email address';
  email.className = 'form-control';
  email.required = true;
  email.setAttribute('aria-required', 'true');
  email.setAttribute('aria-label', 'Enter your email address');
  
  emailContainer.appendChild(emailLabel);
  emailContainer.appendChild(email);
  userInfo.appendChild(emailContainer);
  
  // Create phone input with proper labeling
  const phoneContainer = document.createElement('div');
  phoneContainer.classList.add('col-12', 'mb-3');
  
  const phoneLabel = document.createElement('label');
  phoneLabel.textContent = 'Phone Number:';
  phoneLabel.className = 'form-label';
  phoneLabel.htmlFor = 'phone_number';
  phoneLabel.id = 'phone_number_label';
  
  const phone = document.createElement('input');
  phone.type = 'tel';
  phone.name = 'phone_number';
  phone.id = 'phone_number';
  phone.placeholder = 'Enter your phone number';
  phone.className = 'form-control';
  phone.required = true;
  phone.setAttribute('aria-required', 'true');
  phone.setAttribute('aria-label', 'Enter your phone number');
  
  phoneContainer.appendChild(phoneLabel);
  phoneContainer.appendChild(phone);
  userInfo.appendChild(phoneContainer);
  
  const contButton = initialiseButton('cont');
  contButton.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Check if all required user info fields are valid
    const firstName = userInfo.querySelector('#first_name');
    const lastName = userInfo.querySelector('#last_name');
    const email = userInfo.querySelector('#email_address');
    const phone = userInfo.querySelector('#phone_number');
    
    // Check if all required fields are filled and valid
    if (firstName.checkValidity() && lastName.checkValidity() && 
        email.checkValidity() && phone.checkValidity()) {
      toggleInfoPage();
    } else {
      // Show validation messages for any invalid fields
      if (!firstName.checkValidity()) firstName.reportValidity();
      else if (!lastName.checkValidity()) lastName.reportValidity();
      else if (!email.checkValidity()) email.reportValidity();
      else if (!phone.checkValidity()) phone.reportValidity();
    }
  });
  userInfo.appendChild(contButton);
  bookingForm.appendChild(userInfo);
}

/**
 * Initializes all booking form components and appends them to the form.
 * Creates date picker, time selection dropdowns, and submit button with
 * proper accessibility features and user-friendly time constraints.
 */
function initialiseBookingInfo(){
  const bookingForm = document.getElementById('booking-form');
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
  
  // Add validation to submit button
  const submitBtn = submitButton.querySelector('button');
  submitBtn.addEventListener('click', function(e) {
    e.preventDefault();
    if (validateAllBookingFields()) {
      // If validation passes, submit the form using requestSubmit to preserve HTML5 validation
      const form = document.getElementById('booking-form');
      if (form.requestSubmit) {
        form.requestSubmit();
      } else {
        // Fallback for older browsers
        form.submit();
      }
    }
  });
  
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
  calendarElement.required = true;
  calendarElement.setAttribute('aria-required', 'true');
  calendarElement.setAttribute('aria-describedby', 'date-help');
  calendarElement.setAttribute('aria-label', 'Select your preferred booking date');    // Create help text for screen readers (visually hidden)
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
  selectElVariable = selectElName.split(' ').join('_').toLowerCase();
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
  hourSelect.name = selectElVariable + '_hour';
  hourSelect.id = selectElVariable + '_hour';
  hourSelect.classList.add('form-control');
  hourSelect.required = true;
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
  minSelect.name = selectElVariable + '_min';
  minSelect.id = selectElVariable + '_min';
  minSelect.classList.add('form-control');
  minSelect.required = true;
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

/**
 * Validates all booking form fields including date and time requirements.
 * Checks that date is selected and that time range is valid.
 * 
 * @returns {boolean} True if all fields are valid, false otherwise
 */
function validateAllBookingFields() {
  const bookingInfoContainer = document.getElementById('booking-info-container');
  const dateField = bookingInfoContainer.querySelector('#booking_date');
  
  // Check if date is selected
  if (!dateField.value) {
    showTimeError(dateField, 'Please select a booking date');
    dateField.focus();
    return false;
  }
  
  // Check time validation
  return validateBookingTimes();
}

/**
 * Validates that the earliest availability time is before the latest availability time.
 * Shows error messages if times are invalid or if latest time is not after earliest time.
 * 
 * @returns {boolean} True if times are valid and properly ordered, false otherwise
 */
function validateBookingTimes() {
  const bookingInfoContainer = document.getElementById('booking-info-container');
  const earliestHour = bookingInfoContainer.querySelector('#earliest_availability_hour');
  const earliestMin = bookingInfoContainer.querySelector('#earliest_availability_min');
  const latestHour = bookingInfoContainer.querySelector('#latest_availability_hour');
  const latestMin = bookingInfoContainer.querySelector('#latest_availability_min');
  
  // Clear any existing error styling
  clearTimeErrors([earliestHour, earliestMin, latestHour, latestMin]);
  
  // Check if all time fields are selected
  if (!earliestHour.value || !earliestMin.value || !latestHour.value || !latestMin.value) {
    showTimeError(earliestHour, 'Please select all time fields');
    return false;
  }
  
  // Convert times to minutes for comparison
  const earliestTimeMinutes = parseInt(earliestHour.value) * 60 + parseInt(earliestMin.value);
  const latestTimeMinutes = parseInt(latestHour.value) * 60 + parseInt(latestMin.value);
  
  // Check if latest time is after earliest time
  if (latestTimeMinutes <= earliestTimeMinutes) {
    showTimeError(latestHour, 'Latest availability must be after earliest availability');
    showTimeError(latestMin, 'Latest availability must be after earliest availability');
    return false;
  }
  
  // Check minimum time difference (at least 1 hour)
  const timeDifferenceMinutes = latestTimeMinutes - earliestTimeMinutes;
  if (timeDifferenceMinutes < 60) {
    showTimeError(latestHour, 'Please allow at least 1 hour between earliest and latest times');
    showTimeError(latestMin, 'Please allow at least 1 hour between earliest and latest times');
    return false;
  }
  
  return true;
}

/**
 * Displays an error message and applies error styling to time fields.
 * 
 * @param {HTMLElement} field - The form field with an error
 * @param {string} message - The error message to display
 */
function showTimeError(field, message) {
  field.classList.add('is-invalid');
  field.setAttribute('aria-invalid', 'true');
  
  // Remove any existing error message
  const existingError = field.parentNode.querySelector('.invalid-feedback');
  if (existingError) {
    existingError.remove();
  }
  
  // Create and add new error message
  const errorDiv = document.createElement('div');
  errorDiv.className = 'invalid-feedback';
  errorDiv.textContent = message;
  errorDiv.setAttribute('role', 'alert');
  errorDiv.setAttribute('aria-live', 'polite');
  
  field.parentNode.appendChild(errorDiv);
}

/**
 * Removes error styling and messages from time fields.
 * 
 * @param {Array<HTMLElement>} fields - Array of form fields to clear
 */
function clearTimeErrors(fields) {
  fields.forEach(field => {
    if (field) {
      field.classList.remove('is-invalid');
      field.removeAttribute('aria-invalid');
      
      const errorMessage = field.parentNode.querySelector('.invalid-feedback');
      if (errorMessage) {
        errorMessage.remove();
      }
    }
  });
}