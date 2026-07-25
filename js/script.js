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

    reservationForm.addEventListener('submit', async (event) => {
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
            dish: selectedDish || 'Not specified',
            time,
            guests,
            notes,
            createdAt: new Date().toISOString()
        };

        localStorage.setItem('latestReservation', JSON.stringify(reservationData));

        try {
            const response = await fetch('https://mama-njie-s-restaurant-7kv7.onrender.com/reserve', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reservationData)
            });
            if (!response.ok) {
                throw new Error('Server error');
            }

            const whatsappPhone = '2205169685';
            const whatsappMessage = `New reservation received!\n` +
                `Name: ${reservationData.name}\n` +
                `Phone: ${reservationData.phone}\n` +
                `Dish: ${reservationData.dish}\n` +
                `Time: ${reservationData.time}\n` +
                `Guests: ${reservationData.guests}\n` +
                `Notes: ${reservationData.notes || 'None'}`;
            const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(whatsappMessage)}`;

            window.open(whatsappUrl, '_blank');
            alert('Booking received! A WhatsApp message has been prepared for you.');

            reservationForm.reset();
            if (dishInput) {
                dishInput.value = selectedDish;
                dishInput.classList.add('filled');
            }
        } catch (error) {
            console.error('Reservation API error:', error);
            alert('Error, please try again');
            if (successMsg) {
                successMsg.textContent = 'Unable to save reservation to the server. Please try again later.';
                successMsg.classList.remove('hidden');
                setTimeout(() => successMsg.classList.add('hidden'), 5000);
            }
        }
    });
});