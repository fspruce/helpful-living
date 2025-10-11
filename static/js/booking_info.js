/**
 * Main initialization function that runs when the DOM is fully loaded.
 * Sets up event listeners and initializes the booking form components.
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM is fully loaded and parsed');
    
    // Set up event listener for when the edit modal is shown
    const editModal = document.getElementById('editBookingModal');
    if (editModal) {
        editModal.addEventListener('show.bs.modal', function(event) {
            console.log('Edit modal is being shown');
            initialiseInfoEdit();
        });
    }
});

function initialiseInfoEdit() {
  // Check if form elements already exist to avoid duplicates
  const modalBody = document.querySelector('#editBookingModal .modal-body');
  const modalFooter = document.querySelector('#editBookingModal .modal-footer');
  
  if (!modalBody || !modalFooter) {
    console.error('Modal body or footer not found');
    return;
  }
  
  // Clear existing content to avoid duplicates
  modalBody.innerHTML = '';
  modalFooter.innerHTML = '';
  
  console.log('Initializing edit form...');
  
  // Define business hours for time selection (9:30 AM to 6:00 PM)
  const dayStart = [9, 30];  // 9:30 AM
  const dayEnd = [18, 0];    // 6:00 PM
  
  // Create all form components with accessibility features
  const calendarElement = initialiseCalendar();
  const backButton = initialiseButton('back');
  backButton.addEventListener('click', function() {
    // Close modal when back button is clicked
    const modal = bootstrap.Modal.getInstance(document.getElementById('editBookingModal'));
    modal.hide();
  });
  
  const submitButton = initialiseButton('submit');
  
  // Add validation to submit button
  const submitBtn = submitButton.querySelector('button');
  submitBtn.addEventListener('click', function(e) {
    e.preventDefault();
    console.log('Submit button clicked');
    
    // Validate all form fields
    const form = document.getElementById('edit-form');
    const dateField = form.querySelector('#booking_date');
    const earliestHour = form.querySelector('#earliest_availability_hour');
    const earliestMin = form.querySelector('#earliest_availability_min');
    const latestHour = form.querySelector('#latest_availability_hour');
    const latestMin = form.querySelector('#latest_availability_min');
    
    // Check if all fields are filled
    if (!dateField.value || !earliestHour.value || !earliestMin.value || 
        !latestHour.value || !latestMin.value) {
      alert('Please fill in all fields');
      return;
    }
    
    // Validate time range
    const earliestTime = parseInt(earliestHour.value) * 60 + parseInt(earliestMin.value);
    const latestTime = parseInt(latestHour.value) * 60 + parseInt(latestMin.value);
    
    if (latestTime <= earliestTime) {
      alert('Latest availability must be after earliest availability');
      return;
    }
    
    // If validation passes, submit the form
    form.submit();
  });

  // Create time selectors with 20-minute increments
  const startTime = initialiseTime('Earliest Availability', dayStart, dayEnd, 20);
  const endTime = initialiseTime('Latest Availability', dayStart, dayEnd, 20);

  // Append all components to the form in logical order
  modalBody.appendChild(calendarElement);
  modalBody.appendChild(startTime);
  modalBody.appendChild(endTime);
  modalFooter.appendChild(backButton);
  modalFooter.appendChild(submitButton);
  
  // Pre-populate form with current booking data
  populateEditForm();
  
  console.log('Edit form initialized successfully');
}

function populateEditForm() {
  // Get current booking data from the page using specific IDs
  const bookingDateElement = document.querySelector('#current-booking-date');
  const earliestTimeElement = document.querySelector('#current-earliest-time');
  const latestTimeElement = document.querySelector('#current-latest-time');
  
  if (bookingDateElement && earliestTimeElement && latestTimeElement) {
    // Get date from data attribute (already in YYYY-MM-DD format)
    const dateValue = bookingDateElement.getAttribute('data-date');
    if (dateValue) {
      const dateField = document.querySelector('#booking_date');
      if (dateField) {
        dateField.value = dateValue;
        console.log('Set date field to:', dateValue);
      }
    }
    
    // Extract earliest time (assuming format like "12:30")
    const earliestText = earliestTimeElement.textContent.trim();
    const earliestMatch = earliestText.match(/(\d{1,2}):(\d{2})/);
    if (earliestMatch) {
      const earliestHour = document.querySelector('#earliest_availability_hour');
      const earliestMin = document.querySelector('#earliest_availability_min');
      if (earliestHour && earliestMin) {
        earliestHour.value = parseInt(earliestMatch[1], 10);
        earliestMin.value = parseInt(earliestMatch[2], 10);
        console.log('Set earliest time to:', earliestMatch[1], ':', earliestMatch[2]);
      }
    }
    
    // Extract latest time (assuming format like "18:00")
    const latestText = latestTimeElement.textContent.trim();
    const latestMatch = latestText.match(/(\d{1,2}):(\d{2})/);
    if (latestMatch) {
      const latestHour = document.querySelector('#latest_availability_hour');
      const latestMin = document.querySelector('#latest_availability_min');
      if (latestHour && latestMin) {
        latestHour.value = parseInt(latestMatch[1], 10);
        latestMin.value = parseInt(latestMatch[2], 10);
        console.log('Set latest time to:', latestMatch[1], ':', latestMatch[2]);
      }
    }
  } else {
    console.error('Could not find booking data elements');
  }
}