const productos = JSON.parse(localStorage.getItem("carrito"));

let divProducto = document.getElementById("divProducto");
let divPrecio = document.getElementById("divPrecio");
let divCantidad = document.getElementById("divCantidad");
let precioFinal = document.getElementById("precioFinal");

const total = () => {
  let totalPagar = 0;
  precioFinal.innerHTML = "";
  for (const prod of productos) {
    totalPagar += prod.precio * prod.cantidad;
  }
  precioFinal.innerHTML +=
    "<h5>Total: <span id='finalCeroQuizas'>" + totalPagar + "</span></h5>";
};

const renderCheckOut = () => {
  divProducto.innerHTML = "";
  divPrecio.innerHTML = "";
  divCantidad.innerHTML = "";
  for (const prod of productos) {
    divProducto.innerHTML += "<h5>" + prod.titulo + "</h5>";
    divPrecio.innerHTML += "<h5>" + prod.precio * prod.cantidad + "</h5>";
    divCantidad.innerHTML +=
      "<h5><button class='botonesCheckout' onclick= 'removeItem(" +
      prod.id +
      ")'>- </button> " +
      prod.cantidad +
      " <button class='botonesCheckout' onclick= 'addItem(" +
      prod.id +
      ")'>+</button></h5 >";
  }
  total();
  comparando();
};

const removeItem = (idProducto) => {
  productos.map((producto) => {
    if (producto.id == idProducto) {
      if (producto.cantidad > 1) {
        producto.cantidad--;
        renderCheckOut();
      } else {
        productos.splice(productos.indexOf(producto), 1);
        localStorage.setItem("carrito", JSON.stringify(productos));
        renderCheckOut();
      }
    }
  });
};

const addItem = (idProducto) => {
  productos.map((producto) => {
    if (producto.id == idProducto) {
      producto.cantidad++;
      renderCheckOut();
    }
  });
};

renderCheckOut();

const comprar = () => {
  const productos = JSON.parse(localStorage.getItem("carrito"));

  // Construir el mensaje del SweetAlert con los elementos seleccionados del carrito
  let mensaje = "📌<h5>Resumen de tu pedido:</h5>";
  for (const prod of productos) {
    mensaje += `<p>${prod.titulo} - Cantidad: ${prod.cantidad} - Precio Total: ${prod.precio * prod.cantidad}</p>`;
  }

  // Mostrar SweetAlert con botones "Cerrar" y "Copiar"
  Swal.fire({
    title: "Resumen de tu pedido",
    html: mensaje,
    icon: "info",
    showCancelButton: true,
    confirmButtonText: "Volver a Home",
    cancelButtonText: "Enviar por What´s App",
    customClass: {
      cancelButton: "copy-button" // Clase CSS personalizada para el botón de Copiar
    }
  }).then((result) => {
    if (result.isConfirmed) {
      vaciarCarrito(); // Vaciar el carrito después de confirmar la compra
      volverATienda(); // Redirigir al usuario de vuelta a la tienda
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      // Copiar al portapapeles cuando se hace clic en Copiar
      const textoACopiar = generarTextoACopiar(productos);
      copiarAlPortapapeles(textoACopiar);
    }
  });
};

// Función para generar el texto que se copiará al portapapeles
const generarTextoACopiar = (productos) => {
  let texto = "Resumen del pedido:\n";
  for (const prod of productos) {
    texto += `${prod.titulo} - Cant.: ${prod.cantidad} - Precio Total: ${prod.precio * prod.cantidad}\n`;
  }
  return texto;
};

// Función para copiar texto al portapapeles y abrir WhatsApp con el contenido
// Función para copiar texto al portapapeles y abrir WhatsApp con el contenido
const copiarAlPortapapeles = (texto) => {
  const telefono = "+5491169123268"; // Número de teléfono de WhatsApp
  const titulo = "Hola, este es mi pedido de tus servicios y uso este número de WhatsApp, muchas gracias!\n\n"; // Título del mensaje inicial

  // Codificar el título y el mensaje principal para URL
  const tituloCodificado = encodeURIComponent(titulo);
  const mensajeCodificado = encodeURIComponent(titulo + texto);

  // Construir el enlace de WhatsApp con el número y el mensaje
  const whatsappURL = `https://wa.me/${telefono}?text=${mensajeCodificado}`;

  // Abrir la ventana de WhatsApp en una nueva pestaña
  window.open(whatsappURL, "_blank");

  // Copiar el texto al portapapeles (opcional, si deseas mantener esta funcionalidad)
  const textarea = document.createElement("textarea");
  textarea.value = titulo + texto; // Incluir título en el texto copiado
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);

  Swal.fire("Copiado al portapapeles", "", "success");
};


// Evento al hacer click en el botón "Listo, comprar y terminar"
document.getElementById("btnComprar").addEventListener("click", comprar);

function comparando() {
  const finalCero = document.querySelector("#finalCeroQuizas");
  if (finalCero.innerText == 0) {
    document.getElementById("btnComprar").disabled = true;
  }
}

function vaciarCarrito() {
  localStorage.setItem("carrito", JSON.stringify([]));
}

const volverATienda = () => {
  window.location.href = "/../../src/index.html";
};
