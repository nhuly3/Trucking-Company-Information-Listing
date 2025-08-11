// Function to fetch and display trucking companies
function loadTruckingCompanies() {
  const jsonUrl = document.getElementById('jsonUrl').value.trim();
  const errorMessage = document.getElementById('errorMessage');
  errorMessage.textContent = '';

  if (!jsonUrl) {
    errorMessage.textContent = 'Please enter a valid JSON file URL.';
    return;
  }

  fetch(jsonUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      return response.json();
    })
    .then(data => {
      const companies = data?.Mainline?.Table?.Row;
      const headers = data?.Mainline?.Table?.Header?.Data;

      if (!Array.isArray(companies) || companies.length === 0) {
        throw new Error('No trucking companies found in the JSON file.');
      }

      displayTruckingCompanies(headers, companies);
    })
    .catch(error => {
      errorMessage.textContent = `Error: ${error.message}`;
    });
}

// Function to display trucking companies in a new popup window
function displayTruckingCompanies(headers, companies) {
  const popup = window.open('', '', 'width=1000,height=600,scrollbars=yes');
  let tableHTML = `
    <html>
    <head>
      <title>Trucking Companies</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #000; padding: 10px; text-align: left; }
      </style>
    </head>
    <body>
      <h2>Trucking Companies</h2>
      <table>
        <thead>
          <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
        </thead>
        <tbody>
  `;

  companies.forEach(company => {
    tableHTML += `
      <tr>
        <td>${company.Company || ''}</td>
        <td>${company.Services || ''}</td>
        <td>${company.Hubs?.Hub?.join('<br>') || ''}</td>
        <td>${company.Revenue || ''}</td>
        <td>${company.HomePage ? `<a href="${company.HomePage}" target="_blank">HomePage</a>` : ''}</td>
        <td>${company.Logo ? `<img src="${company.Logo}" alt="${company.Company || ''} Logo" width="50" />` : ''}</td>
      </tr>
    `;
  });

  tableHTML += `
        </tbody>
      </table>
    </body>
    </html>
  `;

  popup.document.write(tableHTML);
  popup.document.close();
}
