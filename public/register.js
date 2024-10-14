document.getElementById('registrationForm').addEventListener('submit', function(event) {
    let valid = true;
    let message = '';

    // Clear previous messages
    message = '';

    // Validate First Name
    if (!document.getElementById('first_name').value.trim()) {
        message += 'First Name is required.\n';
        valid = false;
    }

    // Validate Last Name
    if (!document.getElementById('last_name').value.trim()) {
        message += 'Last Name is required.\n';
        valid = false;
    }

    // Validate Email
    const email = document.getElementById('email').value;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        message += 'Please enter a valid email address.\n';
        valid = false;
    }

    // Validate Password
    if (!document.getElementById('password_hash').value.trim()) {
        message += 'Password is required.\n';
        valid = false;
    }

    // Validate Phone Number
    const phone = document.getElementById('phone').value;
    const phonePattern = /^[0-9]{10}$/; // Adjust pattern as needed for your requirements
    if (!phonePattern.test(phone)) {
        message += 'Please enter a valid phone number (10 digits).\n';
        valid = false;
    }

    // Validate Date of Birth
    if (!document.getElementById('date_of_birth').value) {
        message += 'Date of Birth is required.\n';
        valid = false;
    }

    // Validate Gender
    if (!document.getElementById('gender').value) {
        message += 'Gender is required.\n';
        valid = false;
    }

    // Validate Address
    if (!document.getElementById('address').value.trim()) {
        message += 'Address is required.\n';
        valid = false;
    }

    // If validation fails, prevent form submission and alert the user
    if (!valid) {
        alert(message);
        event.preventDefault(); // Prevent form submission
    }
});