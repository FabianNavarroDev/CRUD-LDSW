const form = document.getElementById("item-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const tableBody = document.querySelector("#items-table tbody");

const API_URL = "/api/items";

async function fetchItems() {
  const res = await fetch(API_URL);
  const items = await res.json();
  tableBody.innerHTML = "";
  items.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>${item.email}</td>
      <td>
        <button onclick="editItem(${item.id}, '${item.name}', '${item.email}')">Editar</button>
        <button onclick="deleteItem(${item.id})">Eliminar</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  if (!name || !email) return;

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email }),
  });

  nameInput.value = "";
  emailInput.value = "";
  fetchItems();
});

async function deleteItem(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  fetchItems();
}

function editItem(id, currentName, currentEmail) {
  const newName = prompt("Nuevo nombre:", currentName);
  const newEmail = prompt("Nuevo correo:", currentEmail);
  if (newName && newEmail) {
    fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, email: newEmail }),
    }).then(fetchItems);
  }
}

fetchItems();
