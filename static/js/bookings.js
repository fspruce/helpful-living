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
  
  // Add autofill notification if user data is available
  if (window.userData && (window.userData.first_name || window.userData.last_name || window.userData.email)) {
    const autofillNotice = document.createElement('div');
    autofillNotice.classList.add('alert', 'alert-info', 'mb-3');
    autofillNotice.innerHTML = '<i class="fas fa-info-circle me-2"></i>We\'ve pre-filled your information from your account. You can edit any field if needed.';
    userInfo.appendChild(autofillNotice);
  }
  
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
  
  // Autofill first name if user data is available
  if (window.userData && window.userData.first_name) {
    firstName.value = window.userData.first_name;
    firstName.style.backgroundColor = '#f8f9fa'; // Light background to indicate autofill
  }
  
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
  
  // Autofill last name if user data is available
  if (window.userData && window.userData.last_name) {
    lastName.value = window.userData.last_name;
    lastName.style.backgroundColor = '#f8f9fa'; // Light background to indicate autofill
  }
  
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
  
  // Autofill email if user data is available
  if (window.userData && window.userData.email) {
    email.value = window.userData.email;
    email.style.backgroundColor = '#f8f9fa'; // Light background to indicate autofill
  }
  
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