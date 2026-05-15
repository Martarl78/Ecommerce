/* =============================================
   MAISON LURÉ — app.js
   Funcionalidades:
   1. Gestión del carrito (array)
   2. Cálculo del total y envío
   3. Filtrado por categoría
   4. Ordenación por precio (sort)
   5. Simulación de sesión de usuario
   ============================================= */

'use strict';

/* ============================================
   1. DATOS: CATÁLOGO DE PRODUCTOS
   ============================================ */
const PRODUCTOS = [
  {
    id: 1,
    nombre: 'Tote Milano',
    descripcion: 'Cuero vacuno italiano, forro en lino natural. Amplio espacio interior.',
    precio: 289,
    categoria: 'tote',
    imagen: 'Resources/ToteMilano.png',
  },
  {
    id: 2,
    nombre: 'Clutch Venezia',
    descripcion: 'Piel de napa suave, cierre magnético dorado. Ideal para ocasiones especiales.',
    precio: 145,
    categoria: 'clutch',
    imagen: 'Resources/ClutchVenezia.png',
  },
  {
    id: 3,
    nombre: 'Bandolera Capri',
    descripcion: 'Correa ajustable, compartimento frontal con cremallera. Estilo casual-chic.',
    precio: 198,
    categoria: 'bandolera',
    imagen: 'Resources/BandoleraCapri.png',
  },
  {
    id: 4,
    nombre: 'Mochila Firenze',
    descripcion: 'Cuero curtido al vegetal, antirraya. Porta portátil 15". La compañera perfecta.',
    precio: 345,
    categoria: 'mochila',
    imagen: 'Resources/MochilaFirenze.png',
  },
  {
    id: 5,
    nombre: 'Tote Roma',
    descripcion: 'Bolso tote oversize en cuero granulado. Asa corta y larga intercambiables.',
    precio: 320,
    categoria: 'tote',
    imagen: 'Resources/ToteRoma.png',
  },
  {
    id: 6,
    nombre: 'Clutch Napoli',
    descripcion: 'Mini clutch con cadena desmontable. Cierre de solapa con logo grabado.',
    precio: 99,
    categoria: 'clutch',
    imagen: 'Resources/ClutchNapoli.png',
  },
  {
    id: 7,
    nombre: 'Bandolera Portofino',
    descripcion: 'Piel de becerro soft, cierre de torniquete vintage. Compartimento trasero plano.',
    precio: 235,
    categoria: 'bandolera',
    imagen: 'Resources/BandoleraPortofino.png',
  },
  {
    id: 8,
    nombre: 'Mochila Siena',
    descripcion: 'Pequeña mochila en cuero liso. Perfecta para el día a día con estilo.',
    precio: 189,
    categoria: 'mochila',
    imagen: 'Resources/MochilaSiena.png',
  },
  {
    id: 9,
    nombre: 'Tote Amalfi',
    descripcion: 'Cuero pullup de alta calidad que embellece con el uso. Colores vivos.',
    precio: 265,
    categoria: 'tote',
    imagen: 'Resources/ToteAmalfi.png',
  },
  {
    id: 10,
    nombre: 'Clutch Sorento',
    descripcion: 'Sobre rectangular con tira de eslabones dorados. Edición limitada.',
    precio: 175,
    categoria: 'clutch',
    imagen: 'Resources/ClutchSorento.png',
  },
  {
    id: 11,
    nombre: 'Bandolera Taormina',
    descripcion: 'Diseño compacto con múltiples tarjeteros. Correa trenzada artesanal.',
    precio: 158,
    categoria: 'bandolera',
    imagen: 'Resources/BandoleraTaormina.png',
  },
  {
    id: 12,
    nombre: 'Mochila Palermo',
    descripcion: 'Mochila city de cuero con refuerzos en latón. Capacidad 20L.',
    precio: 420,
    categoria: 'mochila',
    imagen: 'Resources/MochilaPalermo.png',
  },
];

/* ============================================
   2. ESTADO DE LA APLICACIÓN
   ============================================ */
const estado = {
  // Carrito: array de { id, nombre, precio, imagen, cantidad }
  carrito: [],

  // Filtro activo
  categoriaActual: 'todas',

  // Orden activo
  ordenActual: 'default',

  // Sesión de usuario simulada
  usuarios: [
    { nombre: 'Ana García', email: 'ana@example.com', password: '123456' },
  ],
  usuarioActual: null,
};

/* ============================================
   3. UTILIDADES
   ============================================ */
function formatearPrecio(precio) {
  return precio.toFixed(2).replace('.', ',') + ' €';
}

function mostrarToast(mensaje) {
  const toast = document.getElementById('toast');
  toast.textContent = mensaje;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

/* ============================================
   4. GESTIÓN DEL CARRITO
   ============================================ */
function agregarAlCarrito(idProducto) {
  const producto = PRODUCTOS.find(p => p.id === idProducto);
  if (!producto) return;

  const itemExistente = estado.carrito.find(item => item.id === idProducto);

  if (itemExistente) {
    itemExistente.cantidad += 1;
  } else {
    estado.carrito.push({
      id:       producto.id,
      nombre:   producto.nombre,
      precio:   producto.precio,
      imagen:   producto.imagen,
      cantidad: 1,
    });
  }

  actualizarUICarrito();
  animarBotonCarrito();
  mostrarToast(`✓  "${producto.nombre}" añadido al carrito`);
}

function eliminarDelCarrito(idProducto) {
  estado.carrito = estado.carrito.filter(item => item.id !== idProducto);
  actualizarUICarrito();
}

function cambiarCantidad(idProducto, delta) {
  const item = estado.carrito.find(i => i.id === idProducto);
  if (!item) return;

  item.cantidad += delta;

  if (item.cantidad <= 0) {
    eliminarDelCarrito(idProducto);
  } else {
    actualizarUICarrito();
  }
}

function calcularSubtotal() {
  return estado.carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
}

function calcularEnvio() {
  const subtotal = calcularSubtotal();

  if (estado.carrito.length === 0) {
    return { coste: 0, info: '' };
  }

  if (subtotal >= 150) {
    return {
      coste: 0,
      info: '¡Envío gratuito aplicado!',
    };
  }

  const restante = (150 - subtotal).toFixed(2).replace('.', ',');
  return {
    coste: 9.95,
    info: `Añade ${restante} € más para envío gratuito.`,
  };
}

/* ============================================
   5. RENDERIZADO DEL CARRITO EN LA UI
   ============================================ */
function actualizarUICarrito() {
  const cartItems   = document.getElementById('cartItems');
  const cartEmpty   = document.getElementById('cartEmpty');
  const cartSummary = document.getElementById('cartSummary');
  const cartBadge   = document.getElementById('cartBadge');

  const totalUnidades = estado.carrito.reduce((acc, i) => acc + i.cantidad, 0);
  cartBadge.textContent = totalUnidades;

  if (estado.carrito.length === 0) {
    cartItems.innerHTML   = '';
    cartEmpty.style.display   = 'flex';
    cartSummary.style.display = 'none';
    return;
  }

  cartEmpty.style.display   = 'none';
  cartSummary.style.display = 'block';

  cartItems.innerHTML = estado.carrito.map(item => `
    <div class="cart-item" role="listitem">
      <div class="cart-item-img">
        <img src="${item.imagen}" alt="${item.nombre}" style="width:100%;height:100%;object-fit:cover;border-radius:4px;">
      </div>
      <div>
        <p class="cart-item-name">${item.nombre}</p>
        <p class="cart-item-price">${formatearPrecio(item.precio)} / ud.</p>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="cambiarCantidad(${item.id}, -1)" aria-label="Disminuir cantidad">−</button>
          <span class="qty-num" aria-label="Cantidad: ${item.cantidad}">${item.cantidad}</span>
          <button class="qty-btn" onclick="cambiarCantidad(${item.id}, +1)" aria-label="Aumentar cantidad">+</button>
        </div>
      </div>
      <button class="btn-remove" onclick="eliminarDelCarrito(${item.id})" aria-label="Eliminar ${item.nombre}">✕</button>
    </div>
  `).join('');

  const subtotal        = calcularSubtotal();
  const envio           = calcularEnvio();
  const total           = subtotal + envio.coste;

  document.getElementById('subtotal').textContent     = formatearPrecio(subtotal);
  document.getElementById('shippingCost').textContent = envio.coste === 0
    ? (estado.carrito.length > 0 ? 'Gratis' : '—')
    : formatearPrecio(envio.coste);
  document.getElementById('shippingInfo').textContent = envio.info;
  document.getElementById('totalFinal').textContent   = formatearPrecio(total);
}

function animarBotonCarrito() {
  const btn = document.getElementById('cartBtn');
  btn.classList.remove('bump');
  void btn.offsetWidth;
  btn.classList.add('bump');
}

/* ============================================
   6. FILTRAR POR CATEGORÍA
   ============================================ */
function filtrarPorCategoria(categoria) {
  if (categoria === 'todas') return [...PRODUCTOS];
  return PRODUCTOS.filter(p => p.categoria === categoria);
}

/* ============================================
   7. ORDENAR POR PRECIO (sort)
   ============================================ */
function ordenarProductos(productos, orden) {
  const copia = [...productos];

  if (orden === 'asc') {
    copia.sort((a, b) => a.precio - b.precio);
  } else if (orden === 'desc') {
    copia.sort((a, b) => b.precio - a.precio);
  }

  return copia;
}

/* ============================================
   8. RENDERIZADO DE PRODUCTOS
   ============================================ */
function crearTarjetaProducto(producto) {
  const nombreCategoria = {
    tote:       'Tote Bag',
    clutch:     'Clutch',
    bandolera:  'Bandolera',
    mochila:    'Mochila',
  };

  return `
    <article class="product-card" role="listitem" aria-label="${producto.nombre}">
      <div class="product-img">
        <img src="${producto.imagen}" alt="${producto.nombre}" class="product-photo">
        <span class="product-category-tag">${nombreCategoria[producto.categoria] || producto.categoria}</span>
      </div>
      <div class="product-info">
        <h3 class="product-name">${producto.nombre}</h3>
        <p class="product-desc">${producto.descripcion}</p>
        <div class="product-footer">
          <span class="product-price">${formatearPrecio(producto.precio)}</span>
          <button class="btn-add" onclick="agregarAlCarrito(${producto.id})" aria-label="Añadir ${producto.nombre} al carrito">
            + Añadir
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderizarProductos() {
  const grid       = document.getElementById('productsGrid');
  const noResults  = document.getElementById('noResults');
  const countEl    = document.getElementById('productCount');

  let productos = filtrarPorCategoria(estado.categoriaActual);
  productos = ordenarProductos(productos, estado.ordenActual);

  if (productos.length === 0) {
    grid.innerHTML        = '';
    noResults.style.display = 'block';
    countEl.textContent     = '0 productos';
    return;
  }

  noResults.style.display = 'none';
  grid.innerHTML = productos.map(crearTarjetaProducto).join('');

  const plural = productos.length === 1 ? 'producto' : 'productos';
  countEl.textContent = `${productos.length} ${plural}`;
}

/* ============================================
   9. SIMULACIÓN DE SESIÓN DE USUARIO
   ============================================ */
function registrarUsuario(nombre, email, password) {
  if (!nombre.trim() || !email.trim() || !password.trim()) {
    return { ok: false, mensaje: 'Por favor, completa todos los campos.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { ok: false, mensaje: 'El correo electrónico no es válido.' };
  }

  if (password.length < 6) {
    return { ok: false, mensaje: 'La contraseña debe tener al menos 6 caracteres.' };
  }

  const existe = estado.usuarios.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existe) {
    return { ok: false, mensaje: 'Ya existe una cuenta con este correo.' };
  }

  estado.usuarios.push({ nombre: nombre.trim(), email: email.toLowerCase(), password });
  return { ok: true, mensaje: '' };
}

function iniciarSesion(email, password) {
  if (!email.trim() || !password.trim()) {
    return { ok: false, mensaje: 'Por favor, introduce tu correo y contraseña.' };
  }

  const usuario = estado.usuarios.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!usuario) {
    return { ok: false, mensaje: 'Correo o contraseña incorrectos.' };
  }

  return { ok: true, usuario, mensaje: '' };
}

function cerrarSesion() {
  estado.usuarioActual = null;
  actualizarUISession();
  mostrarToast('Sesión cerrada. ¡Hasta pronto!');
}

function actualizarUISession() {
  const sessionArea = document.getElementById('sessionArea');

  if (estado.usuarioActual) {
    const primerNombre = estado.usuarioActual.nombre.split(' ')[0];
    sessionArea.innerHTML = `
      <div class="session-welcome">
        <span class="session-name">Hola, ${primerNombre}</span>
        <button class="btn-ghost" onclick="cerrarSesion()">Salir</button>
      </div>
    `;
  } else {
    sessionArea.innerHTML = `<button class="btn-ghost" id="btnLogin">Acceder</button>`;
    document.getElementById('btnLogin').addEventListener('click', () => abrirModal('loginModal'));
  }
}

/* ============================================
   10. LÓGICA DE MODALES
   ============================================ */
function abrirModal(id) {
  const modal = document.getElementById(id);
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function cerrarModal(id) {
  const modal = document.getElementById(id);
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

function cerrarTodosLosModales() {
  document.querySelectorAll('.modal-overlay').forEach(m => {
    m.classList.remove('open');
  });
  document.body.style.overflow = '';
}

/* ============================================
   11. PANEL DEL CARRITO (abrir/cerrar)
   ============================================ */
function abrirCarrito() {
  document.getElementById('cartPanel').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function cerrarCarrito() {
  document.getElementById('cartPanel').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* ============================================
   12. EVENTOS (Event Listeners)
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {

  renderizarProductos();
  actualizarUICarrito();

  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  });

  document.getElementById('cartBtn').addEventListener('click', abrirCarrito);
  document.getElementById('closeCart').addEventListener('click', cerrarCarrito);
  document.getElementById('cartOverlay').addEventListener('click', cerrarCarrito);

  document.getElementById('btnCheckout').addEventListener('click', () => {
    if (estado.usuarioActual) {
      mostrarToast('¡Pedido enviado! Recibirás confirmación por email.');
      estado.carrito = [];
      actualizarUICarrito();
      cerrarCarrito();
    } else {
      cerrarCarrito();
      abrirModal('loginModal');
      mostrarToast('Inicia sesión para finalizar tu compra.');
    }
  });

  document.getElementById('filterButtons').addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    estado.categoriaActual = btn.dataset.category;
    renderizarProductos();
  });

  document.getElementById('sortSelect').addEventListener('change', (e) => {
    estado.ordenActual = e.target.value;
    renderizarProductos();
  });

  document.getElementById('btnLogin').addEventListener('click', () => abrirModal('loginModal'));

  document.getElementById('closeLogin').addEventListener('click', () => cerrarModal('loginModal'));
  document.getElementById('closeRegister').addEventListener('click', () => cerrarModal('registerModal'));

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) cerrarTodosLosModales();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      cerrarTodosLosModales();
      cerrarCarrito();
    }
  });

  document.getElementById('switchToRegister').addEventListener('click', (e) => {
    e.preventDefault();
    cerrarModal('loginModal');
    limpiarErrores();
    abrirModal('registerModal');
  });

  document.getElementById('switchToLogin').addEventListener('click', (e) => {
    e.preventDefault();
    cerrarModal('registerModal');
    limpiarErrores();
    abrirModal('loginModal');
  });

  document.getElementById('btnDoLogin').addEventListener('click', () => {
    const email    = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPass').value;
    const errorEl  = document.getElementById('loginError');

    const resultado = iniciarSesion(email, password);

    if (resultado.ok) {
      estado.usuarioActual = resultado.usuario;
      cerrarModal('loginModal');
      limpiarCamposLogin();
      actualizarUISession();
      mostrarToast(`¡Bienvenida, ${resultado.usuario.nombre.split(' ')[0]}!`);
    } else {
      errorEl.textContent = resultado.mensaje;
    }
  });

  document.getElementById('btnDoRegister').addEventListener('click', () => {
    const nombre   = document.getElementById('regName').value;
    const email    = document.getElementById('regEmail').value;
    const password = document.getElementById('regPass').value;
    const errorEl  = document.getElementById('registerError');

    const resultado = registrarUsuario(nombre, email, password);

    if (resultado.ok) {
      const login = iniciarSesion(email, password);
      if (login.ok) estado.usuarioActual = login.usuario;

      cerrarModal('registerModal');
      limpiarCamposRegistro();
      actualizarUISession();
      mostrarToast(`¡Cuenta creada! Bienvenida, ${nombre.split(' ')[0]}.`);
    } else {
      errorEl.textContent = resultado.mensaje;
    }
  });

  ['loginEmail', 'loginPass'].forEach(id => {
    document.getElementById(id).addEventListener('keydown', (e) => {
      if (e.key === 'Enter') document.getElementById('btnDoLogin').click();
    });
  });

  ['regName', 'regEmail', 'regPass'].forEach(id => {
    document.getElementById(id).addEventListener('keydown', (e) => {
      if (e.key === 'Enter') document.getElementById('btnDoRegister').click();
    });
  });

});

/* ============================================
   13. HELPERS DE LIMPIEZA DE FORMULARIOS
   ============================================ */
function limpiarErrores() {
  ['loginError', 'registerError'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });
}

function limpiarCamposLogin() {
  document.getElementById('loginEmail').value = '';
  document.getElementById('loginPass').value  = '';
  document.getElementById('loginError').textContent = '';
}

function limpiarCamposRegistro() {
  document.getElementById('regName').value    = '';
  document.getElementById('regEmail').value   = '';
  document.getElementById('regPass').value    = '';
  document.getElementById('registerError').textContent = '';
}
