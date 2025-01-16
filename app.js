document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Realiza la consulta GET
    const response = await fetch('http://localhost:3000/productos');
    const data = await response.json(); // Convierte la respuesta a JSON

    const container = document.querySelector('.cards-container');
    container.innerHTML = ''; // Limpiar contenido anterior

    data.forEach(item => {
      // Crear el HTML para cada tarjeta usando innerHTML
      const cardHTML = `
        <div class="card" data-id="${item.id}">
          <p class="product-name">${item.nombre}</p>
          <img class="product-img" src="img/${item.imagen}" alt="${item.nombre}">
          <div class="product-precio-container">
            <span class="product-precio">$${item.precio}</span>
            <button class="delete-btn"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      `;

      // Agregar el HTML al contenedor
      container.innerHTML += cardHTML;
    });

    // Agregar eventos a los botones "Eliminar" después de que el HTML ha sido insertado
    container.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', async (event) => {
        const card = event.target.closest('.card');
        const productId = card.getAttribute('data-id');

        try {
          // Realizar la solicitud DELETE
          const response = await fetch(`http://localhost:3000/productos/${productId}`, {
            method: 'DELETE'
          });

          if (response.ok) {
            console.log('Producto eliminado exitosamente');
            card.remove(); // Elimina la tarjeta del DOM
          } else {
            console.error('Error al eliminar el producto');
          }
        } catch (error) {
          console.error('Error en la solicitud de eliminación:', error);
        }
      });
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  // Obtener referencias al formulario y al botón de limpiar
  const form = document.getElementById('product-form');
  const clearButton = document.getElementById('clear-btn');

  // Manejar el evento de envío del formulario
  form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita el envío del formulario por defecto

    // Obtener los valores del formulario
    const nombre = document.getElementById('nombre').value;
    const precio = document.getElementById('precio').value;
    const imagen = document.getElementById('imagen').value;

    // Crear objeto con los datos
    const formData = {
      nombre,
      precio,
      imagen
    };

    try {
      // Realizar la solicitud POST
      const response = await fetch('http://localhost:3000/productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        console.log('Producto enviado exitosamente');
        form.reset(); // Limpiar el formulario
        // Opcional: Recargar los productos después de añadir uno nuevo
        document.dispatchEvent(new Event('DOMContentLoaded'));
      } else {
        console.error('Error al enviar el producto');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  });

  // Limpiar el formulario al hacer clic en el botón "Limpiar"
  clearButton.addEventListener('click', () => {
    form.reset();
  });
});
