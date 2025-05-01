// Fetch all zones and populate them in the grid
function fetchShippingZones() {
    fetch('/api/shipping/zones')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const zonesGrid = document.getElementById('shipping-zones-grid');
                zonesGrid.innerHTML = '';  // Clear the current grid
                data.zones.forEach(zone => {
                    const zoneCard = document.createElement('div');
                    zoneCard.classList.add('border', 'p-4', 'rounded-lg', 'shadow-lg', 'bg-white');
                    zoneCard.innerHTML = `
                        <h4 class="font-semibold">${zone.city}</h4>
                        <p class="text-gray-500">Price: ${zone.price} IQD</p>
                        <div class="flex space-x-2 mt-4">
                            <button onclick="openEditModal('${zone._id}', '${zone.city}', ${zone.price})" class="text-blue-500">Edit</button>
                            <button onclick="deleteZone('${zone._id}')" class="text-red-500">Delete</button>
                        </div>
                    `;
                    zonesGrid.appendChild(zoneCard);
                });
            } else {
                alert('Failed to load zones');
            }
        })
        .catch(error => console.error('Error fetching shipping zones:', error));
}

// Open modal for adding a new zone
function openAddModal() {
    document.getElementById('zoneModal').classList.remove('hidden');
    document.getElementById('modalTitle').textContent = 'Add New Zone';
    document.getElementById('zoneForm').reset();
    window.currentZoneId = null;  // Reset the zone ID for new zone
}

// Open modal for editing a zone
function openEditModal(zoneId, city, price) {
    window.currentZoneId = zoneId;  // Store the zone ID in the window object
    document.getElementById('zoneModal').classList.remove('hidden');
    document.getElementById('modalTitle').textContent = 'Edit Shipping Zone';
    document.getElementById('cityName').value = city;
    document.getElementById('zonePrice').value = price;
}

// Submit the form to add a new zone or update an existing one
document.getElementById('zoneForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const cityName = document.getElementById('cityName').value;
    const zonePrice = document.getElementById('zonePrice').value;
    const method = window.currentZoneId ? 'PUT' : 'POST';
    const url = window.currentZoneId 
        ? `/api/shipping/admin/update-zone/${window.currentZoneId}` 
        : '/api/shipping/admin/add-zone';

    fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city: cityName, price: zonePrice })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            closeModal();
            fetchShippingZones();  // Refresh the grid
        } else {
            alert(data.message);
        }
    })
    .catch(error => console.error('Error saving shipping zone:', error));
});

// Close modal
function closeModal() {
    document.getElementById('zoneModal').classList.add('hidden');
}

// Delete a shipping zone
function deleteZone(zoneId) {
    if (confirm('Are you sure you want to delete this zone?')) {
        fetch(`/api/shipping/admin/delete-zone/${zoneId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                fetchShippingZones();  // Refresh the grid
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error('Error deleting shipping zone:', error));
}

}
// Initially fetch zones when the page loads
document.addEventListener('DOMContentLoaded', fetchShippingZones);


function handleLogout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('theme');
    window.location.href = '/';
  }