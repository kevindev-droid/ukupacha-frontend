// CONFIGURACIÓN — URL de la API
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api' 
  : 'https://tu-dominio.com/api'; // Cambiar cuando publiques

const sliderData = [
  {
    title:[{text:'Tu marca,',orange:false},{text:'visible',orange:true},{text:'donde más importa.',orange:false}],
    sub:'Vinilos de alta durabilidad para vitrinas, paredes y vehículos. Colores vivos que no se desvanecen.'
  },
  {
    title:[{text:'Grande o pequeño,',orange:false},{text:'nosotros',orange:true},{text:'lo hacemos.',orange:false}],
    sub:'Desde banners de escritorio hasta lonas gigantes para exteriores. Entrega en 48 horas.'
  },
  {
    title:[{text:'Paredes que',orange:false},{text:'hablan',orange:true},{text:'por tu negocio.',orange:false}],
    sub:'Murales publicitarios de alto impacto en las zonas de mayor tráfico de la ciudad.'
  },
  {
    title:[{text:'Tu flota, tu mejor',orange:false},{text:'publicidad',orange:true},{text:'móvil.',orange:false}],
    sub:'Convierte tus vehículos en herramientas publicitarias que recorren la ciudad las 24 horas.'
  }
];

function buildSlides() {
  sliderData.forEach((d, i) => {
    const titleEl = document.getElementById('title-' + i);
    const subEl = document.getElementById('sub-' + i);
    if(!titleEl || !subEl) return;

    titleEl.innerHTML = '';
    d.title.forEach((part, pi) => {
      if(pi > 0) titleEl.appendChild(document.createTextNode(' '));
      const wordSpan = document.createElement('span');
      wordSpan.className = 'word' + (part.orange ? ' orange' : '');
      part.text.split('').forEach((ch, ci) => {
        const span = document.createElement('span');
        span.className = 'letter' + (part.orange ? ' orange' : '');
        span.style.transitionDelay = (0.3 + pi * 0.18 + ci * 0.04) + 's';
        span.textContent = ch === ' ' ? '\u00a0' : ch;
        wordSpan.appendChild(span);
      });
      titleEl.appendChild(wordSpan);
      if(pi === 0) titleEl.appendChild(document.createElement('br'));
    });

    subEl.innerHTML = '';
    d.sub.split(' ').forEach((word, wi) => {
      const span = document.createElement('span');
      span.className = 'word-sub';
      span.style.transitionDelay = (0.9 + wi * 0.06) + 's';
      span.textContent = word;
      subEl.appendChild(span);
    });

    const btnsEl = titleEl.closest('.slide-content').querySelector('.slide-btns');
    if(btnsEl) btnsEl.style.transitionDelay = '1.4s';
  });
}

function initSlider() {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const progress = document.getElementById('progress');
  const curNum = document.getElementById('cur-num');
  if(!slides.length) return;

  let current = 0;
  let timer;
  const DURATION = 6000;

  function goTo(n) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    curNum.textContent = String(current + 1).padStart(2,'0');
    resetProgress();
  }

  function resetProgress() {
    progress.style.transition = 'none';
    progress.style.width = '0%';
    setTimeout(() => {
      progress.style.transition = 'width ' + DURATION + 'ms linear';
      progress.style.width = '100%';
    }, 50);
  }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), DURATION);
  }

  document.getElementById('next').onclick = () => { goTo(current + 1); startAuto(); };
  document.getElementById('prev').onclick = () => { goTo(current - 1); startAuto(); };
  dots.forEach(d => d.onclick = () => { goTo(+d.dataset.i); startAuto(); });

  resetProgress();
  startAuto();
}

buildSlides();
initSlider();

// FORMULARIO CON VALIDACIÓN Y RATE LIMITING
const btn = document.getElementById('btn-enviar');
const mensaje = document.getElementById('form-mensaje');

// Rate limiting — evitar clicks múltiples
let enviando = false;
let ultimoEnvio = 0;
const DELAY_ENVIO = 3000; // 3 segundos entre envíos

// Validadores
function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validarTelefono(telefono) {
  return /^[0-9+\s\-]{7,20}$/.test(telefono);
}

function mostrarError(texto) {
  mensaje.className = 'form-mensaje error';
  mensaje.textContent = texto;
  mensaje.classList.remove('oculto');
}

function mostrarExito(texto) {
  mensaje.className = 'form-mensaje exito';
  mensaje.textContent = texto;
  mensaje.classList.remove('oculto');
}

btn.addEventListener('click', async () => {
  // Rate limiting
  const ahora = Date.now();
  if (enviando || ahora - ultimoEnvio < DELAY_ENVIO) {
    mostrarError('Por favor espera unos segundos antes de intentar nuevamente.');
    return;
  }

  const nombre = document.getElementById('nombre').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const correo = document.getElementById('correo').value.trim();
  const servicio = document.getElementById('servicio').value;
  const mensajeTexto = document.getElementById('mensaje').value.trim();

  // Validación de campos obligatorios
  if (!nombre || !telefono || !correo || !servicio) {
    mostrarError('Por favor completa todos los campos obligatorios.');
    return;
  }

  // Validación de formato
  if (nombre.length < 2 || nombre.length > 100) {
    mostrarError('El nombre debe tener entre 2 y 100 caracteres.');
    return;
  }

  if (!validarTelefono(telefono)) {
    mostrarError('El teléfono no es válido. Usa solo números, +, - y espacios.');
    return;
  }

  if (!validarEmail(correo)) {
    mostrarError('El correo electrónico no es válido.');
    return;
  }

  if (mensajeTexto.length > 500) {
    mostrarError('El mensaje no puede superar 500 caracteres.');
    return;
  }

  enviando = true;
  ultimoEnvio = ahora;
  btn.textContent = 'Enviando...';
  btn.disabled = true;

  try {
    const response = await fetch(`${API_URL}/cotizaciones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, telefono, correo, servicio, mensaje: mensajeTexto })
    });

    const data = await response.json();

    if (response.ok) {
      mostrarExito('¡Cotización enviada! Nos pondremos en contacto contigo pronto.');

      // Limpiar formulario
      document.getElementById('nombre').value = '';
      document.getElementById('telefono').value = '';
      document.getElementById('correo').value = '';
      document.getElementById('servicio').value = '';
      document.getElementById('mensaje').value = '';

      setTimeout(() => {
        window.open(data.whatsappUrl, '_blank');
      }, 1500);

    } else {
      // No exponer errores del servidor, mostrar genérico
      mostrarError('No pudimos procesar tu solicitud. Intenta nuevamente.');
    }

  } catch (error) {
    console.error('Error:', error);
    mostrarError('Error de conexión. Verifica tu internet e intenta nuevamente.');
  } finally {
    enviando = false;
    btn.textContent = 'Enviar Cotización';
    btn.disabled = false;
  }
});

// PROCESO CON MONITO SALTARÍN
function initProceso() {
  const wrap = document.querySelector('.proceso');
  const monito = document.getElementById('monito');
  const pasos = document.querySelectorAll('.paso');
  const fill = document.getElementById('connectorFill');
  if(!wrap || !monito || !pasos.length) return;

  let animating = false;
  let animTimer = null;

  function getPasoCenter(i) {
    const grid = document.getElementById('pasosGrid');
    const paso = pasos[i];
    const gridRect = grid.getBoundingClientRect();
    const pasoRect = paso.getBoundingClientRect();
    return pasoRect.left - gridRect.left + pasoRect.width / 2;
  }

  function activatePaso(i) {
    pasos.forEach((p, idx) => {
      if(idx === i) p.classList.add('activo');
      else p.classList.remove('activo');
    });
    const center = getPasoCenter(i);
    monito.style.left = center + 'px';
    monito.classList.remove('jumping');
    void monito.offsetWidth;
    monito.classList.add('jumping');
    const pct = i === 0 ? 0 : (i / 3) * 75;
    fill.style.width = pct + '%';
  }

  function runAnimation() {
    if(animating) return;
    animating = true;
    let step = 0;
    activatePaso(0);
    animTimer = setInterval(() => {
      step++;
      if(step > 3) {
        clearInterval(animTimer);
        animating = false;
        return;
      }
      activatePaso(step);
    }, 700);
  }

  wrap.addEventListener('mouseenter', () => {
    clearInterval(animTimer);
    animating = false;
    runAnimation();
  });

  setTimeout(() => {
    const center = getPasoCenter(0);
    monito.style.left = center + 'px';
  }, 200);
}

initProceso();