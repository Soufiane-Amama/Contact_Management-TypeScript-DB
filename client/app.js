
const contactList = document.getElementById("contact-list");
const addContactForm = document.getElementById("addContact-form")


fetch("/contacts")
  .then((response) => response.json())
  .then((data) => {
    data.forEach((contact) => {
      const li = document.createElement("li");
      li.textContent = ` Name: ${contact.name}  |  Email: ${contact.email}  |  Phone: ${contact.phone}  `;

      const deleteButton = document.createElement("button");
      deleteButton.textContent = " X ";
      deleteButton.addEventListener("click", () => deleteContact(contact.id));

      li.appendChild(deleteButton);
      contactList.appendChild(li);
    });
  })
  .catch((error) => console.error("Error fetching data:", error));


function deleteContact(contactId) {
  fetch(`/delete-contact/${contactId}`, {
    method: "DELETE",
  })
    .then((response) => response.text())
    .then((message) => {
      if (message === "Contact deleted successfully! 👍") {
        alert(message);
        location.reload();
      } else {
        console.log("Error:", message);
      }
    })
    .catch((error) => console.error("Error deleting contact:", error));
}



let ContactName, ContactEmail, ContactPhone;
const showInput = () =>{
      ContactName = document.getElementById("name").value;
      ContactEmail = document.getElementById("email").value;
      ContactPhone = document.getElementById("phone").value;
}


addContactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  fetch("/add-contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ ContactName, ContactEmail, ContactPhone })
  })
  .then(response => response.text())
  .then(message => {
    if(message === "New contact added successfully! ✔"){
      alert(message);
      location.reload();
    }else{
      alert("Error: " + message);
      console.log("Error: " + message);
    }
  })
  .catch(error => console.error(" Error: "+ error));
});
