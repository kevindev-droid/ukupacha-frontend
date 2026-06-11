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
    title:[{text:'Tu flota, tu mejor',orange:false},{text:'publicidad',orange:true},{text:'vehicular.',orange:false}],
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


const btn = document.getElementById('btn-enviar');
const mensaje = document.getElementById('form-mensaje');

btn.addEventListener('click', async () => {
  const nombre = document.getElementById('nombre').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const correo = document.getElementById('correo').value.trim();
  const servicio = document.getElementById('servicio').value;
  const mensajeTexto = document.getElementById('mensaje').value.trim();

  if (!nombre || !telefono || !correo || !servicio) {
    mensaje.className = 'form-mensaje error';
    mensaje.textContent = 'Por favor completa todos los campos obligatorios.';
    mensaje.classList.remove('oculto');
    return;
  }

  btn.textContent = 'Enviando...';
  btn.disabled = true;

  try {
    const response = await fetch('http://localhost:3000/api/cotizaciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, telefono, correo, servicio, mensaje: mensajeTexto })
    });

    const data = await response.json();

    if (response.ok) {
      mensaje.className = 'form-mensaje exito';
      mensaje.textContent = '¡Cotización enviada! Nos pondremos en contacto contigo pronto.';
      mensaje.classList.remove('oculto');

      document.getElementById('nombre').value = '';
      document.getElementById('telefono').value = '';
      document.getElementById('correo').value = '';
      document.getElementById('servicio').value = '';
      document.getElementById('mensaje').value = '';

      setTimeout(() => {
        window.open(data.whatsappUrl, '_blank');
      }, 1500);

    } else {
      throw new Error(data.error);
    }

  } catch (error) {
    mensaje.className = 'form-mensaje error';
    mensaje.textContent = 'Ocurrió un error al enviar. Intenta nuevamente.';
    mensaje.classList.remove('oculto');
  } finally {
    btn.textContent = 'Enviar Cotización';
    btn.disabled = false;
  }
});



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