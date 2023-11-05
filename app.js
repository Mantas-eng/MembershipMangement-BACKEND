document.addEventListener('DOMContentLoaded', () => {
    const membershipList = document.querySelector('.Management-list');
    const newMembershipBtn = document.querySelector('.btn');
    const apiUrl = "http://localhost:3000/memberships";

    // Funkcija, kuri gauna narystes iš serverio ir atvaizduoja jas
    function getMemberships() {
        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                membershipList.innerHTML = ''; // Išvalyti esamą sąrašą

                data.forEach((membership) => {
                    const { _id, name, description } = membership;
                    createMembership(_id, name, description);
                });
            })
            .catch((error) => {
                console.error('Klaida gaunant narystes:', error);
            });
    }

    // Funkcija, kuri sukuria naują narystę
    function createMembership(id, name, description) {
        const membershipItem = document.createElement('div');
        membershipItem.className = 'Membership-Management';
        membershipItem.dataset.id = id; // Saugoti narystės unikalų ID
        membershipItem.innerHTML = `
            <h2>${name}</h2>
            <p>${description}</p>
            <div class="box">
                <div class="delete-icon">
                    <i class="fas fa-trash"></i>
                </div>
            </div>
        `;

        // Priskiriame šalinimo funkcionalumą
        const deleteIcon = membershipItem.querySelector('.delete-icon');
        deleteIcon.addEventListener('click', () => {
            deleteMembership(id);
        });

        membershipList.appendChild(membershipItem);
    }

    // Pridėti naują narystę paspaudus mygtuką
    newMembershipBtn.addEventListener('click', () => {
        const name = prompt('Įveskite narystės pavadinimą:');
        const description = prompt('Įveskite narystės aprašymą:');

        if (name && description) {
            // Siųsti naują narystę į serverį
            fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, description }),
            })
                .then((response) => {
                    if (response.status === 200) {
                        // Narystė sėkmingai sukurtas
                        response.json().then((data) => {
                            createMembership(data._id, name, description); // Naudoti gautą ID
                            console.log('Narystė sėkmingai sukurtas.');
                        });
                    } else {
                        console.error('Klaida sukūrus narystę:', response.statusText);
                    }
                })
                .catch((error) => {
                    console.error('Klaida sukūrus narystę:', error);
                });
        }
    });

    // Trinti narystes
    function deleteMembership(id) {
        const confirmed = confirm(`Are you sure you want to delete membership with ID ${id}?`);
        if (!confirmed) return;

        fetch(apiUrl + '/' + id, {
            method: 'DELETE',
        })
            .then((response) => {
                if (response.status === 200) {
                    // Narystė sėkmingai ištrinta
                    const membershipItem = document.querySelector(`[data-id="${id}"]`);
                    membershipItem.remove();
                    console.log('Narystė sėkmingai ištrinta.');
                } else {
                    console.error('Klaida trinant narystę:', response.statusText);
                }
            })
            .catch((error) => {
                console.error('Klaida trinant narystę:', error);
            });
    }

    // Gauti pradinius narystes duomenis iš serverio
    getMemberships();
});
