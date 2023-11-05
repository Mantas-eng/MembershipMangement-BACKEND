document.addEventListener('DOMContentLoaded', () => {
    const userForm = document.getElementById('userForm');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    const userList = document.querySelector('.user-grid');
    const apiUrl = 'http://localhost:3000/api/users';

    userForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';


        const userIp = window.location.hostname;

        const formData = new FormData(userForm);

        // Gauti pasirinkimo reikšmę
        const membershipPlan = formData.get('membershipPlan');

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                body: JSON.stringify({
                    firstName: formData.get('firstName'),
                    lastName: formData.get('lastName'),
                    email: formData.get('email'),
                    membershipPlan: membershipPlan,
                    IP: userIp, // Siunčiame kliento IP
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                successMessage.style.display = 'block';
                setTimeout(() => {
                    window.location.href = 'UserManagement.html';
                }, 1000);
                getUsers();
            } else {
                const errorData = await response.json();
                console.error('Nepavyko išsaugoti vartotojo:', errorData.error);
                errorMessage.style.display = 'block';
                errorMessage.innerText = 'Klaida: ' + errorData.error;
            }
        } catch (error) {
            console.error('Klaida:', error);
            errorMessage.style.display = 'block';
            errorMessage.innerText = 'Klaida: Nepavyko išsaugoti vartotojo';
        }
    });

    getUsers();
});
