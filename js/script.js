// Function to load the main menu
function loadHeader() {
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            // Create a temporary container
            const temp = document.createElement('div');
            temp.innerHTML = data;
            
            // Insert the nav into the mainMenu div
            document.getElementById('header-content').appendChild(temp);
        })
        .catch(error => console.error('Error loading menu:', error));
}

function loadFooter() {
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            // Create a temporary container
            const temp = document.createElement('div');
            temp.innerHTML = data;
            
            // Insert the nav into the mainMenu div
            document.getElementById('footer').appendChild(temp);
        })
        .catch(error => console.error('Error loading footer:', error));
}


// Load the menu when the page loads
document.addEventListener('DOMContentLoaded', loadHeader);
document.addEventListener('DOMContentLoaded', loadFooter);

