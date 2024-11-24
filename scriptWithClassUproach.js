class AnimalTable {
  constructor(containerId, data, sortableFields, specialStyles) {
    this.containerId = containerId;
    this.data = data;
    this.sortableFields = sortableFields;
    this.specialStyles = specialStyles;
    this.sortState = {};
    this.renderTable();
  }

  /* Render the table */
  renderTable() {
    const container = document.getElementById(this.containerId);
    const table = document.createElement('table');
    table.className = 'table table-bordered table-striped';

    /* table header */
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Image', 'Name', 'Location', 'Size', 'Actions'].forEach(field => {
      const th = document.createElement('th');
      th.textContent = field;

      if (this.sortableFields.includes(field.toLowerCase())) {
        th.style.cursor = 'pointer';

        /* sort feature */
        th.addEventListener('click', () => {
          const key = field.toLowerCase();

          /* sort direction */
          this.sortState[key] = this.sortState[key] === 'asc' ? 'desc' : 'asc';

          /* sort data */
          this.sortData(key);
          this.renderTable(); // Re-render table
        });
      }
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    /* table body */
    const tbody = document.createElement('tbody'); 
    this.data.forEach((item, index) => { 
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
      const nameCell = document.createElement('td');
      nameCell.textContent = item.name;
      if (this.specialStyles === 'name-location') nameCell.className = 'bold-text';
      if (this.specialStyles === 'size') nameCell.className = 'bold-italic-blue';
      row.appendChild(nameCell);

      /* location column */
      const locationCell = document.createElement('td');
      locationCell.textContent = item.location;
      row.appendChild(locationCell);

      /* size column */
      const sizeCell = document.createElement('td');
      sizeCell.textContent = item.size;
      row.appendChild(sizeCell);

      /* actions column */
      const actionsCell = document.createElement('td');
      actionsCell.innerHTML = `
        <button class="btn btn-sm btn-warning me-2" onclick="animalTable.editAnimal(${index})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="animalTable.deleteAnimal(${index})">Delete</button>
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
      <input type="text" class="form-control mb-2" id="${this.containerId}Name" placeholder="Name" required>
      <input type="text" class="form-control mb-2" id="${this.containerId}Location" placeholder="Location" required>
      <input type="number" class="form-control mb-2" id="${this.containerId}Size" placeholder="Size" required>
      <button type="button" class="btn btn-primary" onclick="animalTable.addAnimal()">Add Animal</button>
    `;
    container.appendChild(form);
  }

  /* Sort the data */
  sortData(key) {
    this.data.sort((a, b) => {
      if (a[key] < b[key]) return this.sortState[key] === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return this.sortState[key] === 'asc' ? 1 : -1;
      return 0;
    });
  }

  /* Add an animal */
  addAnimal() { 
    const name = document.getElementById(`${this.containerId}Name`).value;
    const location = document.getElementById(`${this.containerId}Location`).value;
    const size = document.getElementById(`${this.containerId}Size`).value;

    if (!name || !location || !size) {
      alert('All fields are required!');
      return;
    }

    if (this.data.some(animal => animal.name === name)) {
      alert('Duplicate animal name!');
      return;
    }

    const newAnimal = { name, location, size: parseInt(size, 10), image: 'default.png' };
    this.data.push(newAnimal);
    this.renderTable();
  }

  /* Delete an animal */
  deleteAnimal(index) {
    this.data.splice(index, 1);
    this.renderTable();
  }

  /* Edit an animal */
  editAnimal(index) {
    const name = prompt('Enter new name:', this.data[index].name);
    const location = prompt('Enter new location:', this.data[index].location);
    const size = prompt('Enter new size:', this.data[index].size);

    if (!name || !location || !size) {
      alert('All fields are required!');
      return;
    }

    this.data[index] = { ...this.data[index], name, location, size: parseInt(size, 10) };
    this.renderTable();
  }
}


/* JSON file */
fetch('animals.json')
  .then(response => response.json())
  .then(async datai => {
    const bigCatsTable = new AnimalTable('bigCatsTable', datai.bigCats, ['name', 'location', 'size'], 'all');
    const dogsTable = new AnimalTable('dogsTable', datai.dogs, ['name', 'location'], 'name-location');
    const bigFishTable = new AnimalTable('bigFishTable', datai.bigFish, ['size'], 'size');
  });
