var sortState = [];
var data = [];
var sortableFields = [];
var specialStyles = 'all';
/* get data from JSON file */
fetch('animals.json')
  .then(response => response.json())
  .then(async datai => {
    await data.push(datai);
    renderTable('bigCatsTable', datai.bigCats, ['name', 'location', 'size'], 'all');
    renderTable('dogsTable', datai.dogs, ['name', 'location'], 'name-location');
    renderTable('bigFishTable', datai.bigFish, ['size'], 'size');
  });

/* render a table */
function renderTable(containerId, data, sortableFields, specialStyles) { 
  const container = document.getElementById(containerId);
  const table = document.createElement('table');
  table.className = 'table table-bordered table-striped';

  /* table header */
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  ['Image', 'Name', 'Location', 'Size', 'Actions'].forEach(field => {
    const th = document.createElement('th');
    th.textContent = field;

    if (sortableFields.includes(field.toLowerCase())) {
      th.style.cursor = 'pointer';

      /* sort feature */
      th.addEventListener('click', () => {
        const key = field.toLowerCase();

        /* sort direction */
        sortState[key] = sortState[key] === 'asc' ? 'desc' : 'asc';

        /* sort data */
        data.sort((a, b) => {
          if (a[key] < b[key]) return sortState[key] === 'asc' ? -1 : 1;
          if (a[key] > b[key]) return sortState[key] === 'asc' ? 1 : -1;
          return 0;
        });

        renderTable(containerId, data, sortableFields, specialStyles); // Re-render table
      });
    }
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  /* table body */
  const tbody = document.createElement('tbody'); 
  data = data;
  data.forEach((item, index) => { 
    const row = document.createElement('tr');

    /* pic column */
    const imgCell = document.createElement('td');
    const img = document.createElement('img');
    img.src = './images/'+item.image;
    img.alt = item.name;
    img.width = 50;
    img.height = 50;
    img.className = 'animal-image';
    img.title = item.name;
    imgCell.appendChild(img);
    row.appendChild(imgCell);

    /* name column */
    const nameCell = document.createElement('td'); console.log("tableitems=>", data);
    nameCell.textContent = item.name;
    if (specialStyles === 'name-location') nameCell.className = 'bold-text';
    if (specialStyles === 'size') nameCell.className = 'bold-italic-blue';
    row.appendChild(nameCell);

    /* location column */
    const locationCell = document.createElement('td');
    locationCell.textContent = item.location;
    row.appendChild(locationCell);

    /* size columns */
    const sizeCell = document.createElement('td');
    sizeCell.textContent = item.size;
    row.appendChild(sizeCell);

    /* actions columns */
    const actionsCell = document.createElement('td');
    actionsCell.innerHTML = `
      <button class="btn btn-sm btn-warning me-2" onclick="editAnimal(${index}, '${containerId}')">Edit</button>
      <button class="btn btn-sm btn-danger" onclick="deleteAnimal(${index}, '${containerId}')">Delete</button>
    `;
    row.appendChild(actionsCell);

    tbody.appendChild(row);
  });
  table.appendChild(tbody);

  /* container and append new table */
  container.innerHTML = '';
  container.appendChild(table);

  /* animal form */
  const form = document.createElement('form');
  form.className = 'mt-3';
  form.innerHTML = `
    <input type="text" class="form-control mb-2" id="${containerId}Name" placeholder="Name" required>
    <input type="text" class="form-control mb-2" id="${containerId}Location" placeholder="Location" required>
    <input type="number" class="form-control mb-2" id="${containerId}Size" placeholder="Size" required>
    <button type="button" class="btn btn-primary" onclick="addAnimal('${containerId}', data)">Add Animal</button>
  `;
  container.appendChild(form);
}
console.log('=this data=>',data);
/* add, edit, and delete animals */
function addAnimal(containerId, data) { 
  const name = document.getElementById(`${containerId}Name`).value;
  const location = document.getElementById(`${containerId}Location`).value;
  const size = document.getElementById(`${containerId}Size`).value;

  if (!name || !location || !size) {
    alert('All fields are required!');
    return;
  }

  if (data.some(animal => animal.name === name)) {
    alert('Duplicate animal name!');
    return;
  }
  let newContainerType = containerId.replace("Table",""); console.log("id=", data[0][newContainerType]);
  data[0][newContainerType].push({ name, location, size: parseInt(size, 10), image: 'default.png' });
  renderTable(containerId, data[0][newContainerType], sortableFields, specialStyles);
}

function deleteAnimal(index, containerId) {
    let newContainerType = containerId.replace("Table","");
    data[0][newContainerType].splice(index, 1);
  renderTable(containerId, data[0][newContainerType], sortableFields, specialStyles);
}

function editAnimal(index, containerId) {
    let newContainerType = containerId.replace("Table","");
    data = data[0][newContainerType];
  const name = prompt('Enter new name:', data[index].name);
  const location = prompt('Enter new location:', data[index].location);
  const size = prompt('Enter new size:', data[index].size);

  if (!name || !location || !size) {
    alert('All fields are required!');
    return;
  }

  data[index] = { ...data[index], name, location, size: parseInt(size, 10) };
  renderTable(containerId, data, sortableFields, specialStyles);
}
