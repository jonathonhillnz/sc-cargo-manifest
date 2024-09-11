const appVersion = '2.0.1'; // Update this version number when there are major changes

function checkVersionAndClearStorage() {
  const storedVersion = localStorage.getItem('appVersion');

  if (storedVersion !== appVersion) {
    // Clear all the localStorage except the version
    localStorage.clear();
    localStorage.setItem('appVersion', appVersion);
    
    // Show notification popup
    showVersionChangePopup();
  }
}

function showVersionChangePopup() {
  const versionModal = document.getElementById('versionModal');
  versionModal.style.display = 'flex'; // Show the modal
}

document.addEventListener('DOMContentLoaded', () => {
  const hideDeliveredPreference = localStorage.getItem('hideDelivered');
  if (hideDeliveredPreference === 'true') {
    document.getElementById('hideDelivered').checked = true;
  } else {
    document.getElementById('hideDelivered').checked = false;
  }
  
  checkVersionAndClearStorage(); // Check version on page load
  populateTable(); // Populate the table based on the loaded preference
});

let jobCounter = localStorage.getItem('jobCounter') ? parseInt(localStorage.getItem('jobCounter')) : 1;

function getCargoJobs() {
  return JSON.parse(localStorage.getItem('cargoJobs')) || [];
}

function saveCargoJobs(jobs) {
  localStorage.setItem('cargoJobs', JSON.stringify(jobs));
}

function saveJobCounter() {
  localStorage.setItem('jobCounter', jobCounter);
}

function populateTable() {
  const cargoJobs = getCargoJobs();
  const cargoBody = document.getElementById('cargoBody');
  cargoBody.innerHTML = '';

  const destinationTotals = {}; // To store the total cargo per destination
  let overallTotal = 0; // To store the total cargo amount overall

  cargoJobs.forEach((job, index) => {
    if (document.getElementById('hideDelivered').checked && job.delivered) return;

    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${job.id}</td>
      <td>${job.source.join(', ')}</td>
      <td>${job.destination.join(', ')}</td>
      <td>${job.amount}</td>
      <td>${job.type}</td>
      <td>${job.notes || ''}</td>
      <td><input type="checkbox" ${job.pickedUp ? 'checked' : ''} onclick="togglePickedUp(${index})"></td>
      <td><input type="checkbox" ${job.delivered ? 'checked' : ''} onclick="toggleDelivered(${index})"></td>
      <td><button onclick="deleteJob(${index})">Delete</button></td>
    `;
    cargoBody.appendChild(row);

    // Calculate totals
    const destination = job.destination.join(', ');
    const amount = parseFloat(job.amount) || 0; // Ensure amount is a number

    if (!destinationTotals[destination]) {
      destinationTotals[destination] = 0;
    }
    destinationTotals[destination] += amount;
    overallTotal += amount;
  });

  // Add totals row
  const totalsRow = document.createElement('tr');
  totalsRow.innerHTML = `
    <td colspan="3"><strong>Total Cargo Overall:</strong></td>
    <td colspan="6"><strong>${overallTotal}</strong></td>
  `;
  cargoBody.appendChild(totalsRow);

  // Add destination-specific totals
  Object.keys(destinationTotals).forEach(destination => {
    const totalRow = document.createElement('tr');
    totalRow.innerHTML = `
      <td colspan="3"><strong>Total for ${destination}:</strong></td>
      <td colspan="6"><strong>${destinationTotals[destination]}</strong></td>
    `;
    cargoBody.appendChild(totalRow);
  });
}

function sortTable(columnIndex) {
  const cargoJobs = getCargoJobs();
  cargoJobs.sort((a, b) => {
    const valueA = columnIndex === 0 ? a.source[0] : a.destination[0];
    const valueB = columnIndex === 0 ? b.source[0] : b.destination[0];
    return valueA.localeCompare(valueB);
  });
  saveCargoJobs(cargoJobs);
  populateTable();
}

function togglePickedUp(index) {
  const cargoJobs = getCargoJobs();
  cargoJobs[index].pickedUp = !cargoJobs[index].pickedUp;
  saveCargoJobs(cargoJobs);
  populateTable();
}

function toggleDelivered(index) {
  const cargoJobs = getCargoJobs();
  cargoJobs[index].delivered = !cargoJobs[index].delivered;
  saveCargoJobs(cargoJobs);
  populateTable();
}

function deleteJob(index) {
  const cargoJobs = getCargoJobs();
  cargoJobs.splice(index, 1);
  saveCargoJobs(cargoJobs);
  populateTable();
}

function clearAllJobs() {
  localStorage.removeItem('cargoJobs');
  localStorage.removeItem('jobCounter');
  jobCounter = 1;
  populateTable();
}

document.getElementById('addJobButton').addEventListener('click', () => {
  clearJobForm(); // Clear the form when opening the modal
  document.getElementById('addJobModal').style.display = 'flex';
});

function closeModal() {
  document.getElementById('addJobModal').style.display = 'none';
}

function closeVersionModal() {
    const versionModal = document.getElementById('versionModal');
    versionModal.style.display = 'none'; // Hide the modal
  }

function generateCargoDetails() {
  const pickupLocations = Array.from(document.querySelectorAll('#pickupLocation input:checked')).map(input => input.value);
  const deliveryLocations = Array.from(document.querySelectorAll('#deliveryLocation input:checked')).map(input => input.value);
  const cargoDetailsDiv = document.getElementById('cargoDetails');
  cargoDetailsDiv.innerHTML = '';

  pickupLocations.forEach(pickup => {
    const detailRow = document.createElement('div');
    detailRow.innerHTML = `
      <h4>${pickup} (Pickups)</h4>
      <label for="pickupAmount_${pickup}">Amount:</label>
      <input type="number" id="pickupAmount_${pickup}" min="1" placeholder="Leave empty to auto-fill"><br>
    `;
    cargoDetailsDiv.appendChild(detailRow);
  });

  deliveryLocations.forEach(delivery => {
    const detailRow = document.createElement('div');
    detailRow.innerHTML = `
      <h4>${delivery} (Deliveries)</h4>
      <label for="deliveryAmount_${delivery}">Amount:</label>
      <input type="number" id="deliveryAmount_${delivery}" min="1" placeholder="Leave empty to auto-fill"><br>
    `;
    cargoDetailsDiv.appendChild(detailRow);
  });
}

function clearJobForm() {
  document.getElementById('cargoType').value = ''; // Clear cargo type input
  document.getElementById('cargoDetails').innerHTML = ''; // Clear generated cargo details
  document.getElementById('jobNotes').value = ''; // Clear notes field
  const pickupCheckboxes = document.querySelectorAll('#pickupLocation input[type="checkbox"]');
  const deliveryCheckboxes = document.querySelectorAll('#deliveryLocation input[type="checkbox"]');
  
  pickupCheckboxes.forEach(checkbox => checkbox.checked = false); // Uncheck all pickup locations
  deliveryCheckboxes.forEach(checkbox => checkbox.checked = false); // Uncheck all delivery locations
}

function addJob() {
  const pickupLocations = Array.from(document.querySelectorAll('#pickupLocation input:checked')).map(input => input.value);
  const deliveryLocations = Array.from(document.querySelectorAll('#deliveryLocation input:checked')).map(input => input.value);
  const cargoType = document.getElementById('cargoType').value;  // Get the cargo type
  const notes = document.getElementById('jobNotes').value; // Get the notes value
  const cargoJobs = getCargoJobs();

  pickupLocations.forEach(pickup => {
    const pickupAmountInput = document.getElementById(`pickupAmount_${pickup}`);
    let pickupAmount = pickupAmountInput.value;

    deliveryLocations.forEach(delivery => {
      const deliveryAmountInput = document.getElementById(`deliveryAmount_${delivery}`);
      let deliveryAmount = deliveryAmountInput.value;

      let amount = 0;

      console.log("pickupAmount: " + pickupAmount)
      console.log("deliveryAmount: " + deliveryAmount)

      // Calculate the pickup or delivery amount if one is missing
      if (!pickupAmount && deliveryAmount) {
        amount = deliveryAmount;
        // pickupAmountInput.value = pickupAmount; // Update the UI for clarity
      }
      if (!deliveryAmount && pickupAmount) {
        amount = pickupAmount;
        // deliveryAmountInput.value = deliveryAmount; // Update the UI for clarity
      }

      cargoJobs.push({
        id: jobCounter,
        source: [pickup],
        destination: [delivery],
        amount: `${amount}`,  // Just the amount here
        type: cargoType,  // Store cargo type separately
        notes: notes,  // Add notes here
        pickedUp: false,
        delivered: false
      });
    });
  });

  jobCounter++;
  saveCargoJobs(cargoJobs);
  saveJobCounter();
  populateTable();
  closeModal();

  // Clear the form after the job is added
  clearJobForm();
}

document.getElementById('clearAllButton').addEventListener('click', clearAllJobs);
document.getElementById('hideDelivered').addEventListener('change', function () {
  const hideDelivered = document.getElementById('hideDelivered').checked;
  localStorage.setItem('hideDelivered', hideDelivered ? 'true' : 'false'); // Save preference in localStorage
  populateTable(); // Re-populate the table based on the new preference
});


// Accordion toggle logic
const accordions = document.querySelectorAll(".accordion");
accordions.forEach(accordion => {
  accordion.addEventListener("click", function() {
    this.classList.toggle("active");
    const content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
});

// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const toggleLabel = document.getElementById('toggleLabel');

function setDarkMode(enabled) {
  if (enabled) {
    document.body.classList.add('dark-mode');
    toggleLabel.textContent = 'Dark Mode';
    localStorage.setItem('darkMode', 'enabled');
  } else {
    document.body.classList.remove('dark-mode');
    toggleLabel.textContent = 'Light Mode';
    localStorage.setItem('darkMode', 'disabled');
  }
}

darkModeToggle.addEventListener('change', function () {
  setDarkMode(darkModeToggle.checked);
});

// Load dark mode preference from localStorage
const darkModePreference = localStorage.getItem('darkMode');
if (darkModePreference === 'enabled') {
  darkModeToggle.checked = true;
  setDarkMode(true);
}

const locations = [
  'ARC-L1', 'ARC-L2', 'ARC-L3', 'ARC-L4', 'ARC-L5',
  'Area18', 'Baijini Point', 'CRU-L1', 'CRU-L2', 'CRU-L3', 
  'CRU-L4', 'CRU-L5', 'Orison', 'Seraphim', 'HUR-L1', 
  'HUR-L2', 'HUR-L3', 'HUR-L4', 'HUR-L5', 'Lorville', 
  'Everus Harbour', 'MIC-L1', 'MIC-L2', 'MIC-L3', 'MIC-L4', 
  'MIC-L5', 'New Babbage', 'Port Tressler', 'Magnus Gateway', 
  'Pyro Gateway', 'Terra Gateway'
];

const pickupLocationDiv = document.getElementById('pickupLocation');
const deliveryLocationDiv = document.getElementById('deliveryLocation');

locations.forEach(location => {
  // Create checkbox for pickup locations
  const pickupCheckbox = document.createElement('input');
  pickupCheckbox.type = 'checkbox';
  pickupCheckbox.value = location;
  pickupCheckbox.addEventListener('change', generateCargoDetails);
  pickupLocationDiv.appendChild(pickupCheckbox);

  const pickupLabel = document.createElement('label');
  pickupLabel.textContent = location;
  pickupLocationDiv.appendChild(pickupLabel);

  // Create checkbox for delivery locations
  const deliveryCheckbox = document.createElement('input');
  deliveryCheckbox.type = 'checkbox';
  deliveryCheckbox.value = location;
  deliveryCheckbox.addEventListener('change', generateCargoDetails);
  deliveryLocationDiv.appendChild(deliveryCheckbox);

  const deliveryLabel = document.createElement('label');
  deliveryLabel.textContent = location;
  deliveryLocationDiv.appendChild(deliveryLabel);
});

populateTable();
