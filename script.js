const API_URL = (() => {
  const localHosts = ['localhost', '127.0.0.1'];
  return localHosts.includes(window.location.hostname)
    ? 'http://localhost:3000/api'
    : 'https://ukupacha-backend-production.up.railway.app/api';
})();

const sliderData = [
  {
    title: [
      { text: 'Tu marca,', orange: false },
      { text: 'visible', orange: true },
      { text: 'donde más importa.', orange: false }
    ],
    sub: 'Vinilos de alta durabilidad para vitrinas, paredes y vehículos. Colores vivos que no se desvanecen.'
  },
  {
    title: [
      { text: 'Grande o pequeño,', orange: false },
      { text: 'nosotros', orange: true },
      { text: 'lo hacemos.', orange: false }
    ],
    sub: 'Desde banners de escritorio hasta lonas gigantes para exteriores. Entrega en 48 horas.'
  },
  {
    title: [
      { text: 'Paredes que', orange: false },
      { text: 'hablan', orange: true },
      { text: 'por tu negocio.', orange: false }
    ],
    sub: 'Murales publicitarios de alto impacto en las zonas de mayor tráfico de la ciudad.'
  },
  {
    title: [
      { text: 'Tu flota, tu mejor', orange: false },
      { text: 'publicidad', orange: true },
      { text: 'móvil.', orange: false }
    ],
    sub: 'Convierte tus vehículos en herramientas publicitarias que recorren la ciudad las 24 horas.'
  }
];

function getById(id) {
  return document.getElementById(id);
}

function buildSlides() {
  sliderData.forEach((data, index) => {
    const titleEl = getById(`title-${index}`);
    const subEl = getById(`sub-${index}`);

    if (!titleEl || !subEl) {
      return;
    }

    titleEl.innerHTML = '';
    data.title.forEach((part, partIndex) => {
      if (partIndex > 0) {
        titleEl.appendChild(document.createTextNode(' '));
      }

      const wordSpan = document.createElement('span');
      wordSpan.className = `word${part.orange ? ' orange' : ''}`;

      part.text.split('').forEach((char, charIndex) => {
        const span = document.createElement('span');
        span.className = `letter${part.orange ? ' orange' : ''}`;
        span.style.transitionDelay = `${0.3 + partIndex * 0.18 + charIndex * 0.04}s`;
        span.textContent = char === ' ' ? '\u00a0' : char;
        wordSpan.appendChild(span);
      });

      titleEl.appendChild(wordSpan);

      if (partIndex === 0) {
        titleEl.appendChild(document.createElement('br'));
      }
    });

    subEl.innerHTML = '';
    data.sub.split(' ').forEach((word, wordIndex) => {
      const span = document.createElement('span');
      span.className = 'word-sub';
      span.style.transitionDelay = `${0.9 + wordIndex * 0.06}s`;
      span.textContent = word;
      subEl.appendChild(span);
    });

    const btnsEl = titleEl.closest('.slide-content')?.querySelector('.slide-btns');
    if (btnsEl) {
      btnsEl.style.transitionDelay = '1.4s';
    }
  });
}

function initSlider() {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const progress = getById('progress');
  const curNum = getById('cur-num');
  const next = getById('next');
  const prev = getById('prev');

  if (!slides.length) {
    return;
  }

  let current = 0;
  let timer;
  const duration = 6000;

  function resetProgress() {
    if (!progress) {
      return;
    }

    progress.style.transition = 'none';
    progress.style.width = '0%';

    setTimeout(() => {
      progress.style.transition = `width ${duration}ms linear`;
      progress.style.width = '100%';
    }, 50);
  }

  function goTo(nextIndex) {
    slides[current]?.classList.remove('active');
    dots[current]?.classList.remove('active');

    current = (nextIndex + slides.length) % slides.length;

    slides[current]?.classList.add('active');
    dots[current]?.classList.add('active');

    if (curNum) {
      curNum.textContent = String(current + 1).padStart(2, '0');
    }

    resetProgress();
  }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), duration);
  }

  if (next) {
    next.addEventListener('click', () => {
      goTo(current + 1);
      startAuto();
    });
  }

  if (prev) {
    prev.addEventListener('click', () => {
      goTo(current - 1);
      startAuto();
    });
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      goTo(Number(dot.dataset.i));
      startAuto();
    });
  });

  resetProgress();
  startAuto();
}

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validarTelefono(telefono) {
  return /^[0-9+\s-]{7,20}$/.test(telefono);
}

function setFeedback(feedbackEl, type, text) {
  feedbackEl.className = `form-mensaje ${type}`;
  feedbackEl.textContent = text;
  feedbackEl.classList.remove('oculto');
}

async function parseJsonSafely(response) {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    return { error: text };
  }
}

function initCotizacionForm() {
  const btn = getById('btn-enviar');
  const feedback = getById('form-mensaje');

  if (!btn || !feedback) {
    return;
  }

  const fields = {
    nombre: getById('nombre'),
    telefono: getById('telefono'),
    correo: getById('correo'),
    servicio: getById('servicio'),
    mensaje: getById('mensaje')
  };

  if (Object.values(fields).some((field) => !field)) {
    console.warn('Formulario de cotización incompleto en el DOM.');
    return;
  }

  let enviando = false;
  let ultimoEnvio = 0;
  const delayEnvio = 3000;

  btn.addEventListener('click', async () => {
    const ahora = Date.now();

    if (enviando || ahora - ultimoEnvio < delayEnvio) {
      setFeedback(feedback, 'error', 'Por favor espera unos segundos antes de intentar nuevamente.');
      return;
    }

    const nombre = fields.nombre.value.trim();
    const telefono = fields.telefono.value.trim();
    const correo = fields.correo.value.trim();
    const servicio = fields.servicio.value;
    const mensaje = fields.mensaje.value.trim();

    if (!nombre || !telefono || !correo || !servicio) {
      setFeedback(feedback, 'error', 'Por favor completa todos los campos obligatorios.');
      return;
    }

    if (nombre.length < 2 || nombre.length > 100) {
      setFeedback(feedback, 'error', 'El nombre debe tener entre 2 y 100 caracteres.');
      return;
    }

    if (!validarTelefono(telefono)) {
      setFeedback(feedback, 'error', 'El teléfono no es válido. Usa solo números, +, - y espacios.');
      return;
    }

    if (!validarEmail(correo)) {
      setFeedback(feedback, 'error', 'El correo electrónico no es válido.');
      return;
    }

    if (mensaje.length > 500) {
      setFeedback(feedback, 'error', 'El mensaje no puede superar 500 caracteres.');
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
        body: JSON.stringify({ nombre, telefono, correo, servicio, mensaje })
      });

      const data = await parseJsonSafely(response);

      if (!response.ok) {
        setFeedback(
          feedback,
          'error',
          data.error || 'No pudimos procesar tu solicitud. Intenta nuevamente.'
        );
        return;
      }

      setFeedback(feedback, 'exito', 'Cotización enviada. Nos pondremos en contacto contigo pronto.');

      Object.values(fields).forEach((field) => {
        field.value = '';
      });

      if (data.whatsappUrl) {
        setTimeout(() => {
          window.open(data.whatsappUrl, '_blank', 'noopener,noreferrer');
        }, 1200);
      }
    } catch (error) {
      console.error('Error enviando cotización:', error);
      setFeedback(feedback, 'error', 'Error de conexión. Verifica tu internet e intenta nuevamente.');
    } finally {
      enviando = false;
      btn.textContent = 'Enviar Cotización';
      btn.disabled = false;
    }
  });
}

function initProceso() {
  const wrap = document.querySelector('.proceso');
  const monito = getById('monito');
  const pasos = document.querySelectorAll('.paso');
  const fill = getById('connectorFill');
  const grid = getById('pasosGrid');

  if (!wrap || !monito || !pasos.length || !fill || !grid) {
    return;
  }

  let animating = false;
  let animTimer = null;

  function getPasoCenter(index) {
    const paso = pasos[index];
    const gridRect = grid.getBoundingClientRect();
    const pasoRect = paso.getBoundingClientRect();
    return pasoRect.left - gridRect.left + pasoRect.width / 2;
  }

  function activatePaso(index) {
    pasos.forEach((paso, pasoIndex) => {
      paso.classList.toggle('activo', pasoIndex === index);
    });

    const center = getPasoCenter(index);
    monito.style.left = `${center}px`;
    monito.classList.remove('jumping');
    void monito.offsetWidth;
    monito.classList.add('jumping');
    fill.style.width = `${index === 0 ? 0 : (index / 3) * 75}%`;
  }

  function runAnimation() {
    if (animating) {
      return;
    }

    animating = true;
    let step = 0;
    activatePaso(0);

    animTimer = setInterval(() => {
      step += 1;

      if (step > 3) {
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
    monito.style.left = `${getPasoCenter(0)}px`;
  }, 200);
}

document.addEventListener('DOMContentLoaded', () => {
  buildSlides();
  initSlider();
  initCotizacionForm();
  initProceso();
});
