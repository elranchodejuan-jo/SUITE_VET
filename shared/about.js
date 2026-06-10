// =============================================================================
// SUITE VET - shared/about.js
// Vista institucional, footer legal y modales informativos.
// =============================================================================

(function () {
  "use strict";

  const CREATOR_PHOTOS = [
    {
      sources: [
        "assets/creator/juan-bajana-1.jpg",
        "assets/creator/juan-bajana-1.jpeg",
        "assets/creator/juan-bajana-1.png",
        "assets/creator/juan-bajana-1.webp",
      ],
      alt: "Juan Baja\u00f1a junto a un perro en el campo",
    },
    {
      sources: [
        "assets/creator/juan-bajana-2.jpg",
        "assets/creator/juan-bajana-2.jpeg",
        "assets/creator/juan-bajana-2.png",
        "assets/creator/juan-bajana-2.webp",
      ],
      alt: "Juan Baja\u00f1a en campo con peces",
    },
    {
      sources: [
        "assets/creator/juan-bajana-3.jpg",
        "assets/creator/juan-bajana-3.jpeg",
        "assets/creator/juan-bajana-3.png",
        "assets/creator/juan-bajana-3.webp",
      ],
      alt: "Juan Baja\u00f1a sosteniendo lechones",
    },
  ];

  const CREATOR_PHOTO_CACHE_KEY = Date.now().toString(36);

  const LEGAL_CONTENT = {
    privacy: {
      title: "Pol&iacute;tica de privacidad",
      html: `
        <p>Esta secci&oacute;n estar&aacute; destinada a explicar c&oacute;mo SUITE VET manejar&aacute; la informaci&oacute;n del usuario, datos acad&eacute;micos, registros, formularios y futuras funciones conectadas a bases de datos. Actualmente esta versi&oacute;n se encuentra en desarrollo.</p>
      `,
    },
    legal: {
      title: "Aviso legal",
      html: `
        <p>SUITE VET es un proyecto educativo y tecnol&oacute;gico en desarrollo. La informaci&oacute;n presentada tiene fines acad&eacute;micos y de apoyo al aprendizaje veterinario. No reemplaza el criterio profesional, docente o cl&iacute;nico.</p>
      `,
    },
    terms: {
      title: "T&eacute;rminos de uso",
      html: `
        <p>El uso de SUITE VET implica reconocer que sus herramientas, calculadoras, fichas, protocolos y recursos est&aacute;n dise&ntilde;ados como apoyo educativo. Las decisiones cl&iacute;nicas, laboratoriales o productivas deben ser verificadas por profesionales capacitados.</p>
      `,
    },
  };

  const SITE_LINKS = [
    { label: "Inicio", view: "home" },
    { label: "Fisiolog&iacute;a", view: "fisiologia" },
    { label: "Farmacolog&iacute;a", view: "farmacologia" },
    { label: "Microbiolog&iacute;a", view: "microbiologia" },
    { label: "Patolog&iacute;a", view: "patologia" },
    { label: "Nutrici&oacute;n Animal", view: "nutricion" },
    { label: "Cl&iacute;nica Integrada", view: "clinica" },
    { label: "Semiolog&iacute;a &amp; Anamnesis Pro", view: "semiologia" },
    { label: "Casos 360", view: "casos360" },
    { label: "Favoritos", view: "favoritos" },
    { label: "Sobre SUITE VET", view: "about" },
  ];

  const LEGAL_LINKS = [
    { label: "Pol&iacute;tica de privacidad", modal: "privacy" },
    { label: "Aviso legal", modal: "legal" },
    { label: "T&eacute;rminos de uso", modal: "terms" },
  ];

  function renderAboutView() {
    const root = document.getElementById("about-suite-vet-root");
    if (!root) return;

    root.innerHTML = `
      <section class="sv-about-page" aria-labelledby="sv-about-title">
        <header class="sv-about-hero">
          <div class="sv-about-toolbar">
            <button class="sv-btn sv-btn-ghost sv-about-back" type="button" data-suite-view="home">Volver</button>
            <span class="sv-about-kicker">Proyecto institucional</span>
          </div>
          <div class="sv-about-identity">
            <div class="sv-about-photo-carousel" id="sv-about-creator-carousel" tabindex="0" aria-label="Carrusel de fotos de Juan Baja&ntilde;a">
              <div class="sv-about-photo-stage">
                <button class="sv-about-photo-btn sv-about-photo-prev" type="button" data-creator-prev aria-label="Foto anterior" hidden>&#8249;</button>
                <div class="sv-about-avatar" id="sv-about-creator-avatar" aria-label="Foto de Juan Baja&ntilde;a, creador de SUITE VET">
                  <span>JB</span>
                </div>
                <button class="sv-about-photo-btn sv-about-photo-next" type="button" data-creator-next aria-label="Foto siguiente" hidden>&#8250;</button>
              </div>
              <div class="sv-about-photo-dots" id="sv-about-creator-dots" aria-label="Fotos del creador" hidden></div>
            </div>
            <div>
              <h1 id="sv-about-title">Sobre SUITE VET</h1>
              <p class="sv-about-subtitle">Un proyecto que une la Medicina Veterinaria, la educaci&oacute;n, la tecnolog&iacute;a y el campo.</p>
            </div>
            <div class="sv-about-creator-summary">
              <strong>Juan Baja&ntilde;a</strong>
              <span>Estudiante de Medicina Veterinaria</span>
              <span>Creador de SUITE VET</span>
            </div>
            <p class="sv-about-tagline">&ldquo;Uniendo la Medicina Veterinaria, la educaci&oacute;n, la tecnolog&iacute;a y el campo.&rdquo;</p>
          </div>
        </header>

        <div class="sv-about-grid sv-about-grid-two">
          <article class="sv-card sv-about-card sv-about-creator-card">
            <span class="sv-about-card-label">Creador</span>
            <h3>Juan Baja&ntilde;a</h3>
            <p class="sv-about-role">Estudiante de Medicina Veterinaria</p>
            <p>Soy Juan Baja&ntilde;a, estudiante de Medicina Veterinaria y creador de SUITE VET. Mi prop&oacute;sito es unir la veterinaria con la tecnolog&iacute;a para desarrollar herramientas &uacute;tiles, pr&aacute;cticas y accesibles para estudiantes, docentes, profesionales, cl&iacute;nicas, laboratorios y productores.</p>
            <blockquote>&ldquo;No quiero crear solo una aplicaci&oacute;n; quiero construir herramientas que ayuden a la Medicina Veterinaria a avanzar.&rdquo;</blockquote>
          </article>

          <article class="sv-card sv-about-card">
            <span class="sv-about-card-label">Historia</span>
            <h3>Origen del proyecto</h3>
            <p>SUITE VET nace como una idea universitaria, pero con una visi&oacute;n mucho m&aacute;s grande: transformar apuntes, c&aacute;lculos, protocolos y conocimientos veterinarios en herramientas digitales &uacute;tiles, visuales y f&aacute;ciles de usar.</p>
          </article>

          <article class="sv-card sv-about-card">
            <span class="sv-about-card-label">Misi&oacute;n</span>
            <h3>Misi&oacute;n</h3>
            <p>Desarrollar una herramienta educativa y pr&aacute;ctica que facilite el aprendizaje y la aplicaci&oacute;n de la Medicina Veterinaria mediante m&oacute;dulos interactivos, calculadoras, fichas t&eacute;cnicas, protocolos, recursos visuales, registros y funciones aplicadas a la vida universitaria y profesional.</p>
          </article>

          <article class="sv-card sv-about-card">
            <span class="sv-about-card-label">Visi&oacute;n</span>
            <h3>Visi&oacute;n</h3>
            <p>Convertir SUITE VET en un ecosistema veterinario digital capaz de integrar educaci&oacute;n, cl&iacute;nica, laboratorio, farmacolog&iacute;a, microbiolog&iacute;a, fisiolog&iacute;a, registros, cartillas digitales e inventario animal, aportando a la modernizaci&oacute;n de la Medicina Veterinaria.</p>
          </article>
        </div>

        <section class="sv-about-section" aria-labelledby="sv-about-goals-title">
          <div class="sv-about-section-head">
            <span class="sv-about-card-label">Direcci&oacute;n</span>
            <h3 id="sv-about-goals-title">Objetivos del proyecto</h3>
          </div>
          <ul class="sv-about-objectives">
            <li>Crear tecnolog&iacute;a &uacute;til para la Medicina Veterinaria.</li>
            <li>Ayudar a estudiantes a aprender de forma m&aacute;s pr&aacute;ctica, visual y organizada.</li>
            <li>Desarrollar herramientas aplicables a cl&iacute;nicas, laboratorios, granjas y campo.</li>
            <li>Integrar m&oacute;dulos educativos, cl&iacute;nicos y productivos en un solo ecosistema.</li>
            <li>Fortalecer proyectos relacionados como Cartilla Digital y CATTLE.</li>
            <li>Facilitar el acceso a informaci&oacute;n organizada, calculadoras, protocolos y recursos veterinarios.</li>
            <li>Construir una herramienta que pueda crecer con el tiempo y adaptarse a nuevas &aacute;reas de la profesi&oacute;n.</li>
          </ul>
        </section>

        <section class="sv-about-section" aria-labelledby="sv-about-values-title">
          <div class="sv-about-section-head">
            <span class="sv-about-card-label">Cultura</span>
            <h3 id="sv-about-values-title">Valores que gu&iacute;an SUITE VET</h3>
          </div>
          <div class="sv-about-values">
            <span>Amor por los animales</span>
            <span>Educaci&oacute;n pr&aacute;ctica</span>
            <span>Innovaci&oacute;n veterinaria</span>
            <span>Tecnolog&iacute;a con prop&oacute;sito</span>
            <span>Organizaci&oacute;n</span>
            <span>Servicio al campo</span>
            <span>Apoyo a estudiantes</span>
            <span>Responsabilidad profesional</span>
          </div>
        </section>

        <section class="sv-about-section" aria-labelledby="sv-about-ecosystem-title">
          <div class="sv-about-section-head">
            <span class="sv-about-card-label">Ecosistema</span>
            <h3 id="sv-about-ecosystem-title">Ecosistema de proyectos</h3>
            <p>SUITE VET forma parte de una visi&oacute;n m&aacute;s amplia junto con otros proyectos como Cartilla Digital y CATTLE, orientados a la educaci&oacute;n veterinaria, el registro cl&iacute;nico, el seguimiento de pacientes y el manejo animal en campo.</p>
          </div>
          <div class="sv-about-project-grid">
            <article class="sv-card sv-about-project">
              <h4>SUITE VET</h4>
              <p>App educativa y pr&aacute;ctica para estudiantes y profesionales de Medicina Veterinaria.</p>
            </article>
            <article class="sv-card sv-about-project">
              <h4>Cartilla Digital</h4>
              <p>Proyecto orientado al registro cl&iacute;nico, vacunas, pacientes y transferencia de informaci&oacute;n entre veterinarias.</p>
            </article>
            <article class="sv-card sv-about-project">
              <h4>CATTLE</h4>
              <p>Sistema enfocado en inventario, identificaci&oacute;n y manejo de ganado, con visi&oacute;n de integraci&oacute;n tecnol&oacute;gica para el campo.</p>
            </article>
          </div>
        </section>

        <div class="sv-about-grid sv-about-grid-two">
          <article class="sv-card sv-about-card">
            <span class="sv-about-card-label">Autor&iacute;a</span>
            <h3>Cr&eacute;ditos</h3>
            <p>SUITE VET es un proyecto creado por Juan Baja&ntilde;a.</p>
            <p>Proyecto en desarrollo. Todos los derechos reservados.</p>
            <p class="sv-about-note">La informaci&oacute;n presentada dentro de SUITE VET tiene fines educativos y de apoyo al aprendizaje veterinario. No reemplaza el criterio profesional, docente o cl&iacute;nico.</p>
          </article>

          <article class="sv-card sv-about-card">
            <span class="sv-about-card-label">Contacto</span>
            <h3>Contacto</h3>
            <p>Canales de contacto oficiales del proyecto.</p>
            <dl class="sv-about-contact-list">
              <div><dt>Tel&eacute;fono / WhatsApp</dt><dd><a href="https://wa.me/593988048481" target="_blank" rel="noopener noreferrer">0988048481</a></dd></div>
              <div><dt>Correo</dt><dd><a href="mailto:bajanajua710@gmail.com">bajanajua710@gmail.com</a></dd></div>
              <div><dt>Instagram</dt><dd><a href="https://www.instagram.com/elranchodejuan_jo/?hl=es" target="_blank" rel="noopener noreferrer">@elranchodejuan_jo</a></dd></div>
              <div><dt>GitHub</dt><dd>Pendiente</dd></div>
              <div><dt>Sitio web</dt><dd>Pendiente</dd></div>
              <div><dt>Ubicaci&oacute;n</dt><dd>Balao Grande - Guayas - Ecuador</dd></div>
            </dl>
          </article>
        </div>

        <aside class="sv-about-manifesto">
          <p>&ldquo;SUITE VET nace del sue&ntilde;o de transformar la Medicina Veterinaria con herramientas simples, pr&aacute;cticas y humanas; hechas para aprender mejor, trabajar mejor y cuidar mejor a los animales.&rdquo;</p>
        </aside>
      </section>

      <div class="sv-about-photo-lightbox" id="sv-about-photo-lightbox" aria-hidden="true" hidden>
        <div class="sv-about-photo-lightbox-backdrop" data-creator-lightbox-close></div>
        <figure class="sv-about-photo-lightbox-dialog" role="dialog" aria-modal="true" aria-label="Vista previa de foto del creador">
          <button class="sv-about-photo-lightbox-close" type="button" data-creator-lightbox-close aria-label="Cerrar vista previa">&times;</button>
          <button class="sv-about-photo-lightbox-nav sv-about-photo-lightbox-prev" type="button" data-creator-lightbox-prev aria-label="Foto anterior" hidden>&#8249;</button>
          <img id="sv-about-photo-lightbox-image" alt="" />
          <button class="sv-about-photo-lightbox-nav sv-about-photo-lightbox-next" type="button" data-creator-lightbox-next aria-label="Foto siguiente" hidden>&#8250;</button>
          <figcaption id="sv-about-photo-lightbox-caption"></figcaption>
        </figure>
      </div>
    `;
  }

  function preloadPhoto(photo, sourceIndex = 0) {
    const src = photo.sources[sourceIndex];
    if (!src) return Promise.resolve(null);
    const cacheBustedSrc = `${src}?v=${CREATOR_PHOTO_CACHE_KEY}`;

    return new Promise((resolve) => {
      const probe = new Image();
      probe.onload = () => resolve({ src: cacheBustedSrc, alt: photo.alt });
      probe.onerror = () => resolve(preloadPhoto(photo, sourceIndex + 1));
      probe.src = cacheBustedSrc;
    });
  }

  function preloadCreatorPhotos() {
    return Promise.all(CREATOR_PHOTOS.map((photo) => preloadPhoto(photo)))
      .then((photos) => photos.filter(Boolean));
  }

  function setCreatorFallback(avatar) {
    avatar.innerHTML = "<span>JB</span>";
    avatar.classList.remove("sv-about-avatar-has-image");
  }

  async function initCreatorCarousel() {
    const carousel = document.getElementById("sv-about-creator-carousel");
    const avatar = document.getElementById("sv-about-creator-avatar");
    const dots = document.getElementById("sv-about-creator-dots");
    const prevButton = carousel?.querySelector("[data-creator-prev]");
    const nextButton = carousel?.querySelector("[data-creator-next]");
    const lightbox = document.getElementById("sv-about-photo-lightbox");
    const lightboxImage = document.getElementById("sv-about-photo-lightbox-image");
    const lightboxCaption = document.getElementById("sv-about-photo-lightbox-caption");
    const lightboxPrev = lightbox?.querySelector("[data-creator-lightbox-prev]");
    const lightboxNext = lightbox?.querySelector("[data-creator-lightbox-next]");
    if (!carousel || !avatar || !dots || !prevButton || !nextButton) return;

    const photos = await preloadCreatorPhotos();
    if (!photos.length) {
      setCreatorFallback(avatar);
      return;
    }

    let activeIndex = 0;
    let pointerStartX = null;
    let isLightboxOpen = false;
    let lastFocusBeforeLightbox = null;

    function renderLightboxPhoto() {
      if (!lightbox || !lightboxImage) return;
      const photo = photos[activeIndex];
      lightboxImage.src = photo.src;
      lightboxImage.alt = photo.alt;
      if (lightboxCaption) {
        lightboxCaption.textContent = photo.alt || `Foto ${activeIndex + 1}`;
      }
    }

    function openLightbox() {
      if (!lightbox || !lightboxImage) return;
      if (isLightboxOpen) return;
      isLightboxOpen = true;
      lastFocusBeforeLightbox = document.activeElement instanceof HTMLElement ? document.activeElement : avatar;
      renderLightboxPhoto();
      lightbox.hidden = false;
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("sv-about-lightbox-open");
      window.requestAnimationFrame(() => lightbox.classList.add("is-open"));
      const closeBtn = lightbox.querySelector("[data-creator-lightbox-close]");
      closeBtn?.focus();
    }

    function closeLightbox() {
      if (!lightbox) return;
      if (!isLightboxOpen) return;
      isLightboxOpen = false;
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.classList.remove("sv-about-lightbox-open");
      window.setTimeout(() => {
        if (!isLightboxOpen) lightbox.hidden = true;
      }, 170);

      if (lastFocusBeforeLightbox && typeof lastFocusBeforeLightbox.focus === "function") {
        lastFocusBeforeLightbox.focus();
      } else {
        avatar.focus();
      }
    }

    function renderPhoto(nextIndex) {
      activeIndex = (nextIndex + photos.length) % photos.length;
      const photo = photos[activeIndex];
      const image = document.createElement("img");
      image.src = photo.src;
      image.alt = photo.alt;

      avatar.innerHTML = "";
      avatar.appendChild(image);
      avatar.classList.add("sv-about-avatar-has-image");
      avatar.dataset.previewSrc = photo.src;
      avatar.dataset.previewAlt = photo.alt;

      dots.querySelectorAll("button").forEach((dot, dotIndex) => {
        const isActive = dotIndex === activeIndex;
        dot.classList.toggle("is-active", isActive);
        dot.setAttribute("aria-current", isActive ? "true" : "false");
      });
    }

    function goToPhoto(nextIndex) {
      if (photos.length <= 1) return;
      renderPhoto(nextIndex);
      if (isLightboxOpen) renderLightboxPhoto();
    }

    dots.innerHTML = photos
      .map((_, index) => (
        `<button type="button" data-creator-dot="${index}" aria-label="Ver foto ${index + 1}"></button>`
      ))
      .join("");

    const hasManyPhotos = photos.length > 1;
    prevButton.hidden = !hasManyPhotos;
    nextButton.hidden = !hasManyPhotos;
    dots.hidden = !hasManyPhotos;
    if (lightboxPrev) lightboxPrev.hidden = !hasManyPhotos;
    if (lightboxNext) lightboxNext.hidden = !hasManyPhotos;

    avatar.classList.add("sv-about-avatar-clickable");
    avatar.setAttribute("role", "button");
    avatar.setAttribute("tabindex", "0");
    avatar.setAttribute("aria-label", "Abrir foto del creador en vista previa");
    avatar.setAttribute("title", "Abrir vista previa");

    avatar.addEventListener("click", () => openLightbox());
    avatar.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openLightbox();
    });

    prevButton.addEventListener("click", () => goToPhoto(activeIndex - 1));
    nextButton.addEventListener("click", () => goToPhoto(activeIndex + 1));
    dots.addEventListener("click", (event) => {
      const dot = event.target.closest("[data-creator-dot]");
      if (!dot) return;
      goToPhoto(Number(dot.dataset.creatorDot));
    });

    carousel.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToPhoto(activeIndex - 1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goToPhoto(activeIndex + 1);
      }
    });

    carousel.addEventListener("pointerdown", (event) => {
      pointerStartX = event.clientX;
    });

    carousel.addEventListener("pointerup", (event) => {
      if (pointerStartX === null) return;
      const deltaX = event.clientX - pointerStartX;
      pointerStartX = null;

      if (Math.abs(deltaX) < 36) return;
      goToPhoto(deltaX < 0 ? activeIndex + 1 : activeIndex - 1);
    });

    carousel.addEventListener("pointercancel", () => {
      pointerStartX = null;
    });

    lightbox?.addEventListener("click", (event) => {
      if (event.target.closest("[data-creator-lightbox-close]")) {
        closeLightbox();
      }
    });

    lightboxPrev?.addEventListener("click", () => goToPhoto(activeIndex - 1));
    lightboxNext?.addEventListener("click", () => goToPhoto(activeIndex + 1));

    document.addEventListener("keydown", (event) => {
      if (!isLightboxOpen) return;
      if (event.key === "Escape") {
        event.preventDefault();
        closeLightbox();
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToPhoto(activeIndex - 1);
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goToPhoto(activeIndex + 1);
      }
    });

    renderPhoto(0);
  }

  function buildSiteMap() {
    const views = SITE_LINKS.map((item) => (
      `<button type="button" class="sv-site-map-link" data-suite-view="${item.view}">${item.label}</button>`
    )).join("");

    const legal = LEGAL_LINKS.map((item) => (
      `<button type="button" class="sv-site-map-link" data-legal-link="${item.modal}">${item.label}</button>`
    )).join("");

    return `
      <p>Accesos r&aacute;pidos a las vistas principales e informaci&oacute;n institucional de SUITE VET.</p>
      <div class="sv-site-map-grid">
        ${views}
        ${legal}
      </div>
    `;
  }

  function openLegalModal(type) {
    if (type === "sitemap") {
      renderLegalModal("Mapa del sitio", buildSiteMap());
      return;
    }

    const content = LEGAL_CONTENT[type];
    if (!content) return;
    renderLegalModal(content.title, content.html);
  }

  function renderLegalModal(title, html) {
    const modal = document.getElementById("sv-legal-modal");
    const modalTitle = document.getElementById("sv-legal-modal-title");
    const body = document.getElementById("sv-legal-modal-body");
    if (!modal || !modalTitle || !body) return;

    modalTitle.innerHTML = title;
    body.innerHTML = html;
    modal.classList.add("sv-modal-active");
    modal.setAttribute("aria-hidden", "false");

    const closeButton = modal.querySelector("[data-legal-close]");
    if (closeButton) closeButton.focus();
  }

  function closeLegalModal() {
    const modal = document.getElementById("sv-legal-modal");
    if (!modal) return;
    modal.classList.remove("sv-modal-active");
    modal.setAttribute("aria-hidden", "true");
  }

  function goToSuiteView(view) {
    if (!view || !window.SuiteVet?.showView) return;
    closeLegalModal();
    window.SuiteVet.showView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDocumentClick(event) {
    const legalTrigger = event.target.closest("[data-legal-link]");
    if (legalTrigger) {
      event.preventDefault();
      openLegalModal(legalTrigger.dataset.legalLink);
      return;
    }

    const viewTrigger = event.target.closest("[data-suite-view]");
    if (viewTrigger) {
      event.preventDefault();
      goToSuiteView(viewTrigger.dataset.suiteView);
      return;
    }

    const closeTrigger = event.target.closest("[data-legal-close]");
    if (closeTrigger) {
      event.preventDefault();
      closeLegalModal();
      return;
    }

    if (event.target?.id === "sv-legal-modal") {
      closeLegalModal();
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderAboutView();
    initCreatorCarousel();
    document.addEventListener("click", handleDocumentClick);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeLegalModal();
    });
  });
})();
