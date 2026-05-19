/* ============================================================
   MARCENARIA — Script principal
   Padrões: Oficina Senac (revelar, FAQ, lightbox, comparação)
   ============================================================ */

// ── NAVBAR MOBILE ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.getElementById('nav-toggle');
  const menu   = document.getElementById('nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      menu.classList.toggle('aberto');
    });
    // fecha o menu ao clicar em um link
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('aberto');
      });
    });
  }
});

// ── ANIMAÇÃO DE REVELAÇÃO AO ROLAR ────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  const elementosRevelar = document.querySelectorAll('.revelar');
  const opcoesRevelacao  = { threshold: 0.12 };

  const animacaoAoRolar = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('ativo');
      } else {
        entrada.target.classList.remove('ativo');
      }
    });
  }, opcoesRevelacao);

  elementosRevelar.forEach(function (el) {
    animacaoAoRolar.observe(el);
  });
});

// ── FAQ — ACCORDION ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  const perguntas = document.querySelectorAll('.faq-pergunta');
  if (!perguntas.length) return;

  perguntas.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const estaAberto = btn.classList.contains('ativo');
      const resposta   = btn.nextElementSibling;

      // fecha todos
      perguntas.forEach(function (outroBt) {
        outroBt.classList.remove('ativo');
        outroBt.setAttribute('aria-expanded', 'false');
        const outraResp = outroBt.nextElementSibling;
        if (outraResp) outraResp.classList.remove('aberta');
      });

      // abre o clicado (se não estava aberto)
      if (!estaAberto) {
        btn.classList.add('ativo');
        btn.setAttribute('aria-expanded', 'true');
        if (resposta) resposta.classList.add('aberta');
      }
    });
  });
});

// ── LIGHTBOX (portfólio) ────────────────────────────────────
function abrirImagem(src) {
  const lightbox = document.getElementById('lightbox');
  const img      = document.getElementById('imgAmpliada');
  img.src = src;
  lightbox.style.display = 'flex';
}
function fecharImagem() {
  document.getElementById('lightbox').style.display = 'none';
}

// ── BEFORE / AFTER IMAGE COMPARISON ───────────────────────
function initComparisons() {
  const overlays = document.getElementsByClassName('img-comp-overlay');
  for (let i = 0; i < overlays.length; i++) {
    compareImages(overlays[i]);
  }

  function compareImages(img) {
    let clicked = 0;
    const container = img.parentElement;
    
    // Aguarda o carregamento da imagem para obter as dimensões corretas
    const imageElement = img.querySelector('img');
    if (imageElement.complete) {
      startComp();
    } else {
      imageElement.onload = startComp;
    }

    function startComp() {
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      
      // Define a largura inicial da sobreposição (50%)
      img.style.width = (w / 2) + 'px';

      // Cria o slider (linha vertical)
      const slider = document.createElement('DIV');
      slider.setAttribute('class', 'img-comp-slider');
      
      // Cria o handle (círculo com setas)
      const handle = document.createElement('DIV');
      handle.setAttribute('class', 'img-comp-handle');
      handle.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none"
             stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 21 12 15 6"></polyline>
          <polyline points="9 6 3 12 9 18"></polyline>
        </svg>`;
      
      slider.appendChild(handle);
      container.insertBefore(slider, img);

      // Posicionamento inicial
      slider.style.left = (w / 2 - slider.offsetWidth / 2) + 'px';

      // Eventos
      slider.addEventListener('mousedown', slideReady);
      slider.addEventListener('touchstart', slideReady);
      window.addEventListener('mouseup', slideFinish);
      window.addEventListener('touchend', slideFinish);

      function slideReady(e) {
        e.preventDefault();
        clicked = 1;
        window.addEventListener('mousemove', slideMove);
        window.addEventListener('touchmove', slideMove);
      }

      function slideFinish() {
        clicked = 0;
        window.removeEventListener('mousemove', slideMove);
        window.removeEventListener('touchmove', slideMove);
      }

      function slideMove(e) {
        if (clicked === 0) return;
        let pos = getCursorPos(e);
        if (pos < 0) pos = 0;
        if (pos > w) pos = w;
        slide(pos);
      }

      function getCursorPos(e) {
        e = e.changedTouches ? e.changedTouches[0] : e;
        const rect = container.getBoundingClientRect();
        return (e.pageX - rect.left) - window.pageXOffset;
      }

      function slide(x) {
        img.style.width = x + 'px';
        slider.style.left = x - (slider.offsetWidth / 2) + 'px';
      }

      // Reajusta em caso de redimensionamento da janela
      window.addEventListener('resize', () => {
        const newW = container.offsetWidth;
        const currentRatio = parseFloat(img.style.width) / w;
        img.style.width = (newW * currentRatio) + 'px';
        slider.style.left = (newW * currentRatio - slider.offsetWidth / 2) + 'px';
      });
    }
  }
}
document.addEventListener('DOMContentLoaded', initComparisons);

// ── SCROLL SUAVE PARA CONTATO ──────────────────────────────
function scrollToContato() {
  document.getElementById('contato').scrollIntoView({ behavior: 'smooth' });
}

// ── WHATSAPP ────────────────────────────────────────────────
function whatsapp() {
  window.open('https://wa.me/5500000000000', '_blank');
}

// ── EMAILJS — INICIALIZAÇÃO ────────────────────────────────
(function () {
  emailjs.init('B7VdbJlUZwo70S_RF');
})();

// ── FORMULÁRIO DE CONTATO ──────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  const form    = document.getElementById('form-contato');
  const sucesso = document.getElementById('form-sucesso');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Desabilita o botão para evitar envios duplicados
    const btnSubmit = form.querySelector('button[type="submit"]');
    const textoOriginal = btnSubmit.textContent;
    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Enviando...';

    emailjs.sendForm('service_k8nmb0o', 'template_vt34van', form)
      .then(function () {
        form.style.display = 'none';
        sucesso.classList.add('visivel');
        form.reset();
      })
      .catch(function (erro) {
        alert('Ops! Ocorreu um erro ao enviar. Tente novamente ou entre em contato pelo WhatsApp.');
        console.error('EmailJS erro:', erro);
      })
      .finally(function () {
        btnSubmit.disabled = false;
        btnSubmit.textContent = textoOriginal;
      });
  });
});
