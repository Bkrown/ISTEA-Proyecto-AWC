document.addEventListener("DOMContentLoaded", () => {
  // Datos de cada servicio
  const servicios = [
    {
      titulo: "Alimentos balanceados",
      descripcion: `En Can Help contamos con una amplia variedad de alimentos balanceados 
        para perros y gatos de todas las edades y tamaños. Trabajamos con marcas líderes 
        en nutrición animal que garantizan la mejor calidad de proteínas, vitaminas y minerales 
        esenciales para la salud de tu mascota. 

        Nuestro equipo puede asesorarte para elegir el tipo de alimento más adecuado 
        según la edad, el tamaño, el nivel de actividad y posibles condiciones médicas 
        (como alergias o sobrepeso). También disponemos de opciones naturales, sin granos 
        y con ingredientes seleccionados para mejorar la digestión, el pelaje y la vitalidad.`,
      img: "img/servicios/alimentos.png"
    },
    {
      titulo: "Accesorios y juguetes",
      descripcion: `Sabemos que el bienestar de tu mascota también depende del entretenimiento 
        y el confort diario. Por eso ofrecemos una gran selección de juguetes, collares, 
        correas, camas, bebederos, comederos, transportadoras, ropita y mucho más. 

        Nuestros productos están diseñados para brindar seguridad y durabilidad, con materiales 
        resistentes y no tóxicos. Contamos con juguetes interactivos para estimular su mente, 
        accesorios ergonómicos para paseos cómodos y artículos que se adaptan al tamaño y 
        personalidad de cada mascota.`,
      img: "img/servicios/accesorios.png"
    },
    {
      titulo: "Higiene y cuidado",
      descripcion: `La higiene es fundamental para la salud de tu compañero. En Can Help 
        te ofrecemos productos especializados para mantener a tu mascota limpia, sana y feliz. 
        Desde shampoos y cepillos hasta toallitas, antipulgas, desinfectantes y cortaúñas, 
        todo lo que necesitás para un cuidado integral. 

        También podés encontrar soluciones específicas para piel sensible, caída del pelo, 
        control de olores y prevención de parásitos. Nuestros productos están dermatológicamente 
        probados y recomendados por veterinarios.`,
      img: "img/servicios/higiene.png"
    },
    {
      titulo: "Asesoramiento",
      descripcion: `Nuestro servicio de asesoramiento personalizado está pensado para 
        acompañarte en cada decisión importante sobre el cuidado de tu mascota. 
        Ya sea que estés eligiendo un nuevo alimento, necesites consejos sobre salud, 
        conducta o entrenamiento, o busques productos adaptados a sus necesidades, 
        nuestro equipo te guiará de forma profesional y empática.

        Trabajamos junto a veterinarios y especialistas en nutrición animal, 
        garantizando información confiable y actualizada para que tu mascota 
        reciba siempre lo mejor.`,
      img: "img/servicios/asesoramiento.png"
    }
  ];

  const modal = document.getElementById("modal-servicio");
  const modalTitulo = document.getElementById("modal-titulo");
  const modalImg = document.getElementById("modal-img");
  const modalDescripcion = document.getElementById("modal-descripcion");
  const closeBtn = document.querySelector(".close");

  // Seleccionar todas las tarjetas
  const tarjetas = document.querySelectorAll(".servicio-card");

  // Asignar evento a cada tarjeta
  tarjetas.forEach((tarjeta, index) => {
    tarjeta.addEventListener("click", (e) => {
      e.preventDefault();
      const servicio = servicios[index];
      modalTitulo.textContent = servicio.titulo;
      modalDescripcion.textContent = servicio.descripcion;
      modalImg.src = servicio.img;
      modal.style.display = "flex";
    });
  });

  // Cerrar al hacer clic fuera del contenido
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
});