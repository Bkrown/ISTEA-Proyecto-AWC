import { AIRTABLE_TOKEN, BASE_ID } from './env.js';

const TABLE_NAME = "Contacto";
const airtableUrl = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

document.getElementById("contact-form").addEventListener("submit", saveContact);

async function saveContact(e) {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const correo = document.getElementById("email").value;
  const telefono = document.getElementById("telefono").value || "";
  const mensaje = document.getElementById("mensaje").value;

  const contactData = {
    fields: {
      Nombre: nombre,
      Correo: correo,
      Telefono: telefono,
      Mensaje: mensaje
    }
  };

  try {
    const response = await fetch(airtableUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(contactData)
    });

    if (!response.ok) {
      throw new Error("Error al guardar en Airtable");
    }

    document.getElementById("contact-form").reset();
    window.location.href = "gracias.html";

  } catch (error) {
    console.error("Error enviando contacto:", error);

    console.log("Payload enviado:", contactData); 
  }
}