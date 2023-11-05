const successMessage = document.querySelector(".success-message");

document.addEventListener('DOMContentLoaded', () => {
    const createMembershipForm = document.querySelector('.create-membership form');

    createMembershipForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const price = document.getElementById('price').value;
        const description = document.getElementById('description').value;

        const data = {
            name,
            price,
            description,
        };

        if (!name || !price || !description) {
            successMessage.textContent = "All fields are required or invalid.";
            return;
        }


        try {
            const response = await fetch('http://localhost:3000/memberships', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                successMessage.textContent = "membership was inserted.";
                const newMembership = await response.json();
                console.log('Naujas narys:', newMembership);
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } else {
                successMessage.textContent = "There was an error adding the membership.";
            }
        } catch (error) {
            console.error('Klaida:', error);
        }
    });
});