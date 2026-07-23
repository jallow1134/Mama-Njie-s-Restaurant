// Smooth scroll for links
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        const target = document.querySelector(targetId);

        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Back to Top Button
const backToTopBtn = document.getElementById('backToTopBtn');
if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Reservation form handling
document.addEventListener('DOMContentLoaded', () => {
    const reservationForm = document.getElementById('reservationForm');
    const successMsg = document.getElementById('successMsg');
    const dishInput = document.getElementById('dish');

    if (!reservationForm) return;

    reservationForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const time = document.getElementById('time').value;
        const guests = document.getElementById('guests').value;
        const notes = document.getElementById('notes').value.trim();
        const selectedDish = dishInput ? dishInput.value : '';

        if (!name || !phone || !time || !guests) {
            if (successMsg) {
                successMsg.textContent = 'Please complete the required fields before confirming your reservation.';
                successMsg.classList.remove('hidden');
                setTimeout(() => successMsg.classList.add('hidden'), 4000);
            }
            return;
        }

        const reservationData = {
            name,
            phone,
            dish: selectedDish,
            time,
            guests,
            notes,
            createdAt: new Date().toISOString()
        };

        localStorage.setItem('latestReservation', JSON.stringify(reservationData));

        const message = `Hello! I would like to make a reservation at Mama Njie's Restaurant.\n\nReservation Details:\n- Name: ${name}\n- Phone: ${phone}\n- Dish: ${selectedDish || 'Not specified'}\n- Time: ${time}\n- Guests: ${guests}\n- Notes: ${notes}`;
        const whatsappURL = `https://wa.me/2205169685?text=${encodeURIComponent(message)}`;

        try {
            window.location.href = whatsappURL;
        } catch (error) {
            console.warn('Could not open WhatsApp, using fallback.', error);
        }

        if (successMsg) {
            successMsg.textContent = `Thanks ${name}! Your reservation request has been received. We will contact you soon on ${phone}.`;
            successMsg.classList.remove('hidden');
        }

        reservationForm.reset();

        if (dishInput) {
            dishInput.value = selectedDish;
            dishInput.classList.add('filled');
        }

        setTimeout(() => {
            if (successMsg) {
                successMsg.classList.add('hidden');
            }
        }, 5000);
    });
});