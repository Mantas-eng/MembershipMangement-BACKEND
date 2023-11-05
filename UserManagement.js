document.addEventListener('DOMContentLoaded', () => {
    const userGrid = document.querySelector('.user-grid');
    let sortAscending = true; // Pradinė rikiavimo tvarka
    const apiUrl = 'http://localhost:3000/api/users';
    const userIp = window.location.hostname; // Gauti vartotojo IP adresą (galite naudoti kitą IP gavimo būdą, jei reikia)

    const request = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        membershipPlan: 'Gold',
        ip: userIp, // Pridėti vartotojo IP adresą
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    })
        .then((response) => response.json())
        .then((data) => {
            // Čia gausite atsakymą iš serverio, kuriame turėsite ir vartotojo IP adresą
        })
        .catch((error) => {
            console.error('Klaida registracijos metu:', error);
        });

    // Funkcija, kuri gauna vartotojų duomenis iš serverio ir atvaizduoja juos
    function getUsers() {
        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                userGrid.innerHTML = ''; // Išvalyti esamą vartotojų sąrašą
                createUserCards(data);
            })
            .catch((error) => {
                console.error('Klaida gaunant vartotojus:', error);
            });
    }

    // Funkcija, kuri atvaizduoja vartotojo korteles
    function createUserCards(users) {
        users.forEach((user) => {
            const userBox = document.createElement('div');
            userBox.classList.add('user-box');
            userBox.innerHTML = `
                <h2>${user.firstName} ${user.lastName}</h2>
                <p>Email Address: ${user.email}</p>
                <p>Membership: ${user.membershipPlan}</p>
                <p>IP: ${user.IP}</p>
            `;
            userGrid.appendChild(userBox);
        });
    }

    // Funkcija, kuri rikiuoja vartotojus pagal vardą A-Z arba Z-A
    function sortUsers() {
        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                data.sort((a, b) => {
                    const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
                    const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
                    if (sortAscending) {
                        return nameA.localeCompare(nameB);
                    } else {
                        return nameB.localeCompare(nameA);
                    }
                });
                userGrid.innerHTML = ''; // Išvalyti esamą vartotojų sąrašą
                createUserCards(data);
            })
            .catch((error) => {
                console.error('Klaida gaunant ir rikiuojant vartotojus:', error);
            });

        // Pakeisti rikiavimo tvarką
        sortAscending = !sortAscending;

        // Pakeisti mygtuko teksta
        const sortButton = document.getElementById('sortButton');
        sortButton.textContent = `Sort by Name: ${sortAscending ? 'A-Z' : 'Z-A'}`;
    }

    getUsers();

    // Rikiavimo mygtuko paspaudimo apdorojimas
    const sortButton = document.getElementById('sortButton');
    sortButton.addEventListener('click', () => {
        sortUsers();
    });
});



