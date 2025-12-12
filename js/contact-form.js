document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contactForm');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // Change button state to loading
            const submitBtn = form.querySelector('.btn-submit');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
            submitBtn.disabled = true;

            // Collect form data as URLSearchParams (better compatibility for Google Apps Script)
            const formData = new URLSearchParams();
            formData.append('name', document.getElementById('name').value);
            formData.append('email', document.getElementById('email').value);
            formData.append('mobile', document.getElementById('mobile').value);
            formData.append('pol', document.getElementById('pol').value);
            formData.append('pod', document.getElementById('pod').value);
            formData.append('cargo', document.getElementById('cargo').value);
            formData.append('containers', document.getElementById('containers').value);
            formData.append('containersize', document.getElementById('containersize').value);
            formData.append('weight', document.getElementById('weight').value);
            formData.append('message', document.getElementById('message').value);

            // REPLACE THIS URL WITH YOUR GOOGLE APPS SCRIPT WEB APP URL
            const scriptURL = 'https://script.google.com/macros/s/AKfycbwZl94O1VREAb6qTNBOwrZ1ZgZHysKmvHpLBSYOXsbqAKqO0hnwUBTlTCP_Wbvo94vshg/exec';

            console.log('Sending data to:', scriptURL);
            console.log('Data:', Object.fromEntries(formData));

            fetch(scriptURL, {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Response:', data);
                    if (data.result === 'success') {
                        alert('Thank you! Your inquiry has been sent successfully.');
                        form.reset();
                    } else {
                        alert('Oops! Something went wrong. Please try again. Error: ' + (data.error || 'Unknown error'));
                        console.error('Script Error:', data);
                    }
                })
                .catch(error => {
                    alert('Oops! Something went wrong. Please check your internet connection and try again.');
                    console.error('Error!', error.message);
                })
                .finally(() => {
                    // Reset button state
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                });
        });
    }
});
