// A Todo Fuego - Realistic Fire Simulation & Interactive Catering Experience

(function () {
  'use strict';

  // Config: WhatsApp business phone (Argentine international format)
  const WHATSAPP_PHONE = '5491123456789';

  // ==========================================
  // 1. BRAND VIDEO INTRO
  // ==========================================
  const splash = document.getElementById('splash');
  const skipBtn = document.getElementById('skip');
  const introVideo = document.getElementById('intro-video');
  const soundBtn = document.getElementById('video-sound-btn');
  const soundIcon = document.getElementById('sound-icon');

  let videoTimeout = null;

  function hideSplash() {
    if (!splash || splash.classList.contains('hidden-splash')) return;
    splash.classList.add('hidden-splash');
    splash.setAttribute('aria-hidden', 'true');
    if (videoTimeout) {
      clearTimeout(videoTimeout);
      videoTimeout = null;
    }
    if (introVideo) {
      try {
        introVideo.pause();
      } catch (_) {}
    }
  }

  function showSplash() {
    if (!splash) return;
    splash.classList.remove('hidden-splash');
    splash.setAttribute('aria-hidden', 'false');

    if (introVideo) {
      introVideo.currentTime = 0;
      const playPromise = introVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          introVideo.muted = true;
          introVideo.play();
        });
      }
    }

    // Safety fallback: auto-hide after 12s if video stalls
    if (videoTimeout) clearTimeout(videoTimeout);
    videoTimeout = setTimeout(hideSplash, 12000);
  }

  // Play immediately on load
  if (introVideo) {
    introVideo.play().catch(() => {
      introVideo.muted = true;
      introVideo.play().catch(() => {});
    });

    // When the video finishes, automatically enter the menu!
    introVideo.addEventListener('ended', () => {
      hideSplash();
    });
  }

  // Sound toggle button
  if (soundBtn && introVideo) {
    soundBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      introVideo.muted = !introVideo.muted;
      if (soundIcon) {
        if (introVideo.muted) {
          soundIcon.className = 'ph-bold ph-speaker-simple-slash';
        } else {
          soundIcon.className = 'ph-bold ph-speaker-high text-brand-accent2';
        }
      }
    });
  }

  // Skip button
  if (skipBtn) {
    skipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      hideSplash();
    });
  }

  // Click on splash also advances to menu
  if (splash) {
    splash.addEventListener('click', (e) => {
      if (e.target.closest('#video-sound-btn') || e.target.closest('#skip')) return;
      hideSplash();
    });
  }

  // Safety fallback timer for first load
  videoTimeout = setTimeout(hideSplash, 11000);

  // ==========================================
  // 2. CATERING MENUS WITH USER PHOTOS
  // ==========================================
  // High quality local paths for user's uploaded real photos
  const PHOTOS = {
    steak: '/public/assets/aistudio/39cadc70-1050-4b40-b48b-e241296c2c2a_97f56763.jpg',
    empanadas: '/public/assets/aistudio/0769b56d-f360-404e-8a85-4a8618ffc672_f02dca33.jpg',
    fingerFoodPlate: '/public/assets/aistudio/913f18db-667e-4bf3-8fca-82d0863659b9_0c5cd1c4.jpg',
    skewers: '/public/assets/aistudio/e696af51-7ff0-4c97-8636-862c2b0d5eeb_845b5539.jpg',
    pastriesSandwiches: '/public/assets/aistudio/4abd7ecc-79cb-4652-b83e-7451559f67e6_32e138e8.jpg',
    strawberryTart: '/public/assets/aistudio/fe5c6773-a0b4-4119-82b2-b9cd403d89de_25737b59.jpg',
    bruschettas: '/public/assets/aistudio/c6e3aa2f-a323-4c01-a934-e3a7d0df2647_132f55af.jpg'
  };

  const menuItems = [
    {
      id: 'cortes-premium',
      title: 'Parrillada Gourmet Premium',
      tag: 'Cortes Seleccionados',
      category: 'Parrilla de Autor',
      badgeColor: 'border-brand-primary text-brand-primary',
      image: PHOTOS.steak,
      imageAlt: 'Ojo de bife a la parrilla con vino tinto y vegetales asados',
      description: 'El protagonista indiscutido del fuego: ojo de bife grueso, entraña jugosa y cortes de raza británica con vegetales al rescoldo y maridaje de vino reserva.',
      features: [
        'Cortes: Ojo de bife al punto, Entraña fina marinada y Picaña tiernizada.',
        'Acompañamiento: Vegetales grillados, papas al rescoldo con romero fresco.',
        'Entradas: Canastas de empanadas al disco cortadas a cuchillo y provoletas de campo.',
        'Salsas exclusivas: Chimichurri artesanal ahumado y salsa criolla de pimientos.'
      ],
      guests: 'Desde 15 hasta 250 comensales',
      highlights: 'Foto Real · Brasas en vivo · Asadores dedicados'
    },
    {
      id: 'asado-criollo',
      title: 'Gran Asado Criollo & Empanadas',
      tag: 'Recepción Criolla Tradicional',
      category: 'Parrilla Completa',
      badgeColor: 'border-brand-accent2 text-brand-accent2',
      image: PHOTOS.empanadas,
      imageAlt: 'Canasta artesanal con empanadas criollas tradicionales doradas',
      description: 'Recepción campestre con empanadas salteñas de carne suave o a cuchillo, seguido de un despliegue completo de vacío, asado banderita y achuras.',
      features: [
        'Recepción: Canasta de empanadas criollas fritas en disco con repulgue tradicional.',
        'Achuras: Chorizos bombón puro cerdo, morcillas y mollejas crocantes al limón.',
        'Cortes principales: Vacío a fuego lento, asado de tira y matambrito de cerdo.',
        'Guarniciones: Ensalada mixta, rusa casera y panes de campo horneados.'
      ],
      guests: 'A partir de 20 personas',
      highlights: 'Foto Real · Menú clásico argentino · Abundante'
    },
    {
      id: 'finger-food-tapeo',
      title: 'Finger Food & Tapeo a las Brasas',
      tag: 'Formato Cóctel Dinámico',
      category: 'Finger Food Gourmet',
      badgeColor: 'border-emerald-400 text-emerald-400',
      image: PHOTOS.fingerFoodPlate,
      imageAlt: 'Bandeja gourmet de finger food con mini hamburguesas y bruschettas',
      description: 'Propuesta moderna y descontracturada para eventos de pie. Los comensales disfrutan de variedad permanente de bocaditos calientes y fríos de alta cocina.',
      features: [
        'Bocados: Mini hamburguesitas gourmet en pan brioche artesanal y tostines.',
        'Bruschettas: Pan de masa madre tostado con morrones asados, tomates secos y albahaca.',
        'Bocaditos hojaldrados: Mini cuadraditos de queso gratinado y cazuelitas de carne.',
        'Variedad constante: Servicio fluido con camareros pasando bandejas.'
      ],
      guests: 'Excelente para 25 a 300 invitados',
      highlights: 'Foto Real · Servicio dinámico · Gran impacto visual'
    },
    {
      id: 'brochetas-showcooking',
      title: 'Brochetas & Fuego Vivo',
      tag: 'Showcooking en Madera',
      category: 'Estación de Brasas',
      badgeColor: 'border-amber-400 text-amber-400',
      image: PHOTOS.skewers,
      imageAlt: 'Bandeja de madera rústica con brochetas parrilladas al fuego',
      description: 'Presentación rústica de categoría en bandejas de madera noble adornadas con hierbas aromáticas. Carnes marinadas y vegetales asados en pinchos individuales.',
      features: [
        'Brochetas: Lomo, panceta ahumada, pollo a la mostaza antigua y pimientos dulces.',
        'Montaje: Bandejas de quebracho y eucalipto con hierbas frescas en mesa.',
        'Acompañamiento: Dips de salsas artesanales, panes de masa madre y focaccias.',
        'Parrilla móvil: Cocción a la vista para una experiencia gastronómica interactiva.'
      ],
      guests: 'Ideal para celebraciones sociales y corporativos',
      highlights: 'Foto Real · Presentación rústica · Fácil de degustar'
    },
    {
      id: 'sandwiches-hojaldres',
      title: 'Mesa Salada, Medialunas & Hojaldres',
      tag: 'Recepción & Fin de Fiesta',
      category: 'Sandwiches & Hojaldre',
      badgeColor: 'border-orange-400 text-orange-400',
      image: PHOTOS.pastriesSandwiches,
      imageAlt: 'Bandeja de catering con mini medialunas de jamón y queso y fosforitos',
      description: 'Para recibir a los invitados o como estación de trasnoche / fin de fiesta: medialunas calentitas de manteca con jamón y queso y fosforitos crocantes recién horneados.',
      features: [
        'Medialunas: Mini medialunas de manteca artesanales rellenas de jamón cocido y queso.',
        'Hojaldres: Fosforitos glaseados crocantes rellenos de queso gouda y jamón.',
        'Sandwiches calientes: Vacío desmechado y bondiola a la cerveza en panes rústicos.',
        'Opciones al paso: Ideales tanto para la recepción de bienvenida como trasnoche.'
      ],
      guests: 'Apto para todo tipo de eventos y horarios',
      highlights: 'Foto Real · Clásico irresistible · Alta demanda'
    },
    {
      id: 'mesa-dulce-gourmet',
      title: 'Mesa Dulce & Tarta de Frutillas',
      tag: 'Pastelería de Celebración',
      category: 'Postres & Cierre',
      badgeColor: 'border-rose-400 text-rose-400',
      image: PHOTOS.strawberryTart,
      imageAlt: 'Tarta gourmet de frutillas frescas glaseadas sobre crema pastelera',
      description: 'El broche de oro dulce para tu evento: tartas artesanales de frutas frescas de estación, pastelería fina, panqueques al disco con dulce de leche y café.',
      features: [
        'Tartas de autor: Tarta de frutillas glaseadas con crema pastelera suave y base crocante.',
        'Clásicos parrilleros: Panqueques tibios dorados al disco con dulce de leche flambeado.',
        'Variedad dulce: Shots individuales, cuadraditos de brownie con nuez y lemon pie.',
        'Servicio de café y té para la sobremesa de los invitados.'
      ],
      guests: 'Adicional o incluido con cualquier menú',
      highlights: 'Foto Real · Frutillas seleccionadas · Pastelería artesanal'
    }
  ];

  // --- Render Menu Cards ---
  const grid = document.getElementById('grid');
  if (grid) {
    grid.innerHTML = menuItems
      .map((item) => {
        return `
      <article class="menu-card group">
        <div class="menu-card-img-wrap">
          <img src="${item.image}" alt="${item.imageAlt}" loading="lazy" />
          <div class="menu-card-img-gradient"></div>
          <span class="absolute top-3 left-3 menu-card-badge border px-3 py-1 rounded-full ${item.badgeColor} bg-black/60 backdrop-blur-md">
            ${item.category}
          </span>
          <span class="absolute top-3 right-3 text-[11px] font-bold uppercase tracking-wider text-white/90 bg-brand-black/70 border border-white/10 px-2.5 py-0.5 rounded-full backdrop-blur-md">
            📸 ${item.highlights.split('·')[0].trim()}
          </span>
        </div>

        <div class="p-6 md:p-7 flex flex-col flex-1 justify-between">
          <div>
            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="text-xs text-brand-accent2 font-bold uppercase tracking-wider">
                ${item.tag}
              </span>
            </div>

            <h3 class="font-display text-2xl md:text-3xl font-bold uppercase text-white mb-3 group-hover:text-brand-accent2 transition-colors">
              ${item.title}
            </h3>

            <p class="text-brand-text2 text-sm leading-relaxed mb-5">
              ${item.description}
            </p>
          </div>


          <div class="pt-4 border-t border-white/10 mt-auto">
            <div class="flex items-center justify-between text-xs text-brand-text2 mb-4">
              <span class="flex items-center gap-1"><i class="ph-bold ph-users text-sm text-brand-primary"></i> ${item.guests}</span>
              <span class="text-white/60 text-[11px] truncate max-w-[130px] text-right">A Todo Fuego</span>
            </div>
            
            <button 
              type="button"
              data-wa="${item.title}"
              class="w-full bg-brand-whatsapp hover:bg-brand-whatsappHover text-white font-bold text-sm py-3 px-4 rounded-xl shadow-whatsapp hover:shadow-whatsapp-strong transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <i class="ph-bold ph-whatsapp text-lg"></i>
              <span>CONSULTAR ESTE MENÚ</span>
            </button>
          </div>
        </div>
      </article>
    `;
      })
      .join('');
  }

  // ==========================================
  // 3. REAL PHOTO GALLERY SECTION
  // ==========================================
  const galleryItems = [
    {
      src: PHOTOS.steak,
      title: 'Ojo de Bife a las Brasas & Vino Malbec',
      subtitle: 'Cortes seleccionados de exportación con vegetales asados',
      category: 'Parrilla Gourmet'
    },
    {
      src: PHOTOS.empanadas,
      title: 'Canasta de Empanadas Criollas al Disco',
      subtitle: 'Repulgue tradicional y masa crocante dorada al fuego',
      category: 'Recepción Criolla'
    },
    {
      src: PHOTOS.skewers,
      title: 'Brochetas Parrilleras en Madera Rústica',
      subtitle: 'Carnes marinadas y vegetales en bandeja de quebracho',
      category: 'Showcooking'
    },
    {
      src: PHOTOS.fingerFoodPlate,
      title: 'Mesa de Finger Food & Bocaditos de Autor',
      subtitle: 'Mini hamburguesas gourmet, tartitas y montaditos',
      category: 'Tapeo & Cóctel'
    },
    {
      src: PHOTOS.pastriesSandwiches,
      title: 'Mini Medialunas & Fosforitos Hojaldrados',
      subtitle: 'Rellenos de jamón y queso, ideales para recepción y trasnoche',
      category: 'Sandwiches'
    },
    {
      src: PHOTOS.strawberryTart,
      title: 'Tarta Gourmet de Frutillas Frescas',
      subtitle: 'Pastelería fina y frutas seleccionadas para mesa dulce',
      category: 'Mesa Dulce'
    },
    {
      src: PHOTOS.bruschettas,
      title: 'Bruschettas Rústicas con Albahaca y Pimientos',
      subtitle: 'Pan de masa madre tostado al rescoldo con aceite de oliva',
      category: 'Entradas'
    }
  ];

  // Inject the Gallery Section after the main grid
  let gallerySection = document.getElementById('gallery-section');
  if (!gallerySection) {
    gallerySection = document.createElement('section');
    gallerySection.id = 'gallery-section';
    gallerySection.className = 'max-w-[1400px] mx-auto px-4 md:px-8 pt-10 pb-20 border-t border-white/5';
    gallerySection.innerHTML = `
      <div class="text-center max-w-2xl mx-auto mb-10">
        <div class="inline-flex items-center gap-2 border border-brand-primary text-brand-primary uppercase font-bold text-xs tracking-wider px-4 py-1.5 rounded-full mb-4 bg-brand-primary/10">
          <i class="ph-bold ph-camera text-sm"></i> Fotos 100% Reales
        </div>
        <h3 class="font-display text-3xl md:text-5xl font-bold uppercase text-white mb-4">
          Nuestros Platos & <span class="text-brand-accent2">Eventos Reales</span>
        </h3>
        <p class="text-brand-text2 text-sm md:text-base">
          Mirá las presentaciones, bandejas de catering y carnes a las brasas preparadas en vivo para nuestros clientes.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6" id="gallery-grid">
        ${galleryItems
          .map(
            (g, idx) => `
          <div class="gallery-card group" data-gallery-index="${idx}">
            <img src="${g.src}" alt="${g.title}" loading="lazy" />
            <div class="gallery-overlay">
              <span class="text-[11px] font-bold uppercase tracking-wider text-brand-accent2 mb-1">
                ${g.category}
              </span>
              <h4 class="font-display font-bold text-lg uppercase text-white leading-tight mb-1 group-hover:text-brand-primary transition-colors">
                ${g.title}
              </h4>
              <p class="text-white/80 text-xs line-clamp-1 mb-2">
                ${g.subtitle}
              </p>
              <div class="flex items-center justify-between text-[11px] text-white/70 font-semibold pt-1 border-t border-white/10">
                <span class="flex items-center gap-1 text-brand-accent2"><i class="ph-bold ph-magnifying-glass-plus"></i> Ampliar & Zoom</span>
                <span class="text-brand-whatsapp flex items-center gap-0.5"><i class="ph-bold ph-whatsapp"></i> Cotizar</span>
              </div>
            </div>
          </div>
        `
          )
          .join('')}
      </div>
    `;

    const mainContainer = document.querySelector('main');
    if (mainContainer && mainContainer.parentNode) {
      mainContainer.parentNode.insertBefore(gallerySection, mainContainer.nextSibling);
    }
  }

  // ==========================================
  // 4. LIGHTBOX MODAL WITH INTERACTIVE ZOOM
  // ==========================================
  let lightboxBackdrop = document.getElementById('lightbox-modal');
  if (!lightboxBackdrop) {
    lightboxBackdrop = document.createElement('div');
    lightboxBackdrop.id = 'lightbox-modal';
    lightboxBackdrop.className = 'lightbox-backdrop';
    lightboxBackdrop.innerHTML = `
      <div class="lightbox-modal" role="dialog" aria-modal="true">
        <div class="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
          <div class="flex items-center gap-2">
            <i class="ph-fill ph-fire text-brand-accent2 text-2xl"></i>
            <div>
              <h3 id="lightbox-title" class="font-display font-bold text-xl uppercase text-white">Foto del Plato</h3>
              <p id="lightbox-category" class="text-xs text-brand-accent2 uppercase font-bold tracking-wider"></p>
            </div>
          </div>

          <!-- Zoom & Close Controls -->
          <div class="flex items-center gap-3">
            <div class="zoom-toolbar" role="toolbar" aria-label="Controles de zoom">
              <button type="button" id="zoom-out" class="zoom-btn" title="Alejar (-)" aria-label="Alejar">
                <i class="ph-bold ph-minus"></i>
              </button>
              <span id="zoom-level" class="zoom-level-badge">100%</span>
              <button type="button" id="zoom-in" class="zoom-btn" title="Acercar (+)" aria-label="Acercar">
                <i class="ph-bold ph-plus"></i>
              </button>
              <button type="button" id="zoom-reset" class="zoom-btn" title="Restablecer tamaño (100%)" aria-label="Restablecer tamaño">
                <i class="ph-bold ph-arrow-counter-clockwise"></i>
              </button>
            </div>

            <button type="button" id="lightbox-close" class="text-brand-text2 hover:text-white p-2 text-2xl transition-colors ml-1" aria-label="Cerrar foto">
              <i class="ph-bold ph-x"></i>
            </button>
          </div>
        </div>

        <div id="lightbox-viewport" class="lightbox-viewport zoomable border border-white/10 mb-4">
          <img id="lightbox-img" src="" alt="" draggable="false" />
          <div class="absolute bottom-3 left-3 text-[11px] bg-black/80 px-3 py-1.5 rounded-full text-white/80 border border-white/10 pointer-events-none backdrop-blur-md flex items-center gap-1.5">
            <i class="ph-bold ph-magnifying-glass-plus text-brand-primary"></i>
            <span>Doble clic o rueda del mouse para hacer zoom · Arrastrá para mover</span>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
          <p id="lightbox-desc" class="text-brand-text2 text-xs md:text-sm"></p>
          <button 
            type="button" 
            id="lightbox-wa-btn" 
            class="bg-brand-whatsapp hover:bg-brand-whatsappHover text-white font-bold text-xs md:text-sm py-2.5 px-6 rounded-full shadow-whatsapp transition-all flex items-center gap-2 shrink-0 active:scale-95"
          >
            <i class="ph-bold ph-whatsapp text-lg"></i>
            <span>PEDIR ESTE PLATO</span>
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(lightboxBackdrop);
  }

  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxViewport = document.getElementById('lightbox-viewport');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCategory = document.getElementById('lightbox-category');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxWaBtn = document.getElementById('lightbox-wa-btn');

  const zoomInBtn = document.getElementById('zoom-in');
  const zoomOutBtn = document.getElementById('zoom-out');
  const zoomResetBtn = document.getElementById('zoom-reset');
  const zoomLevelBadge = document.getElementById('zoom-level');

  // Zoom and Pan State
  let zoomLevel = 1;
  const MIN_ZOOM = 1;
  const MAX_ZOOM = 3.5;
  const ZOOM_STEP = 0.35;
  let panX = 0;
  let panY = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;

  function updateTransform(smooth = true) {
    if (!lightboxImg) return;
    if (smooth) {
      lightboxImg.style.transition = 'transform 0.18s ease-out';
    } else {
      lightboxImg.style.transition = 'none';
    }
    lightboxImg.style.transform = `translate(${panX}px, ${panY}px) scale(${zoomLevel})`;

    if (zoomLevelBadge) {
      zoomLevelBadge.textContent = `${Math.round(zoomLevel * 100)}%`;
    }
    if (zoomOutBtn) {
      zoomOutBtn.disabled = zoomLevel <= MIN_ZOOM;
    }
    if (zoomInBtn) {
      zoomInBtn.disabled = zoomLevel >= MAX_ZOOM;
    }

    if (lightboxViewport) {
      if (zoomLevel > 1) {
        lightboxViewport.classList.remove('zoomable');
        lightboxViewport.classList.add('is-zoomed');
      } else {
        lightboxViewport.classList.remove('is-zoomed', 'is-dragging');
        lightboxViewport.classList.add('zoomable');
      }
    }
  }

  function resetZoom() {
    zoomLevel = 1;
    panX = 0;
    panY = 0;
    isDragging = false;
    updateTransform(true);
  }

  function setZoom(newZoom, centerX = 0, centerY = 0) {
    const clamped = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom));
    if (clamped === zoomLevel) return;

    if (clamped === 1) {
      panX = 0;
      panY = 0;
    } else {
      // Adjust pan to zoom into the focal point
      const scaleFactor = clamped / zoomLevel;
      panX = panX * scaleFactor;
      panY = panY * scaleFactor;
    }

    zoomLevel = clamped;
    clampPan();
    updateTransform(true);
  }

  function clampPan() {
    if (!lightboxViewport || !lightboxImg) return;
    const vpRect = lightboxViewport.getBoundingClientRect();
    const maxPanX = Math.max(0, (vpRect.width * (zoomLevel - 1)) / 2);
    const maxPanY = Math.max(0, (vpRect.height * (zoomLevel - 1)) / 2);

    panX = Math.max(-maxPanX, Math.min(maxPanX, panX));
    panY = Math.max(-maxPanY, Math.min(maxPanY, panY));
  }

  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      setZoom(zoomLevel + ZOOM_STEP);
    });
  }

  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      setZoom(zoomLevel - ZOOM_STEP);
    });
  }

  if (zoomResetBtn) {
    zoomResetBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      resetZoom();
    });
  }

  // Double click toggles 1x and 2x zoom
  if (lightboxViewport) {
    lightboxViewport.addEventListener('dblclick', (e) => {
      e.preventDefault();
      if (zoomLevel > 1) {
        resetZoom();
      } else {
        setZoom(2.2);
      }
    });

    // Wheel zoom
    lightboxViewport.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
      setZoom(zoomLevel + delta);
    }, { passive: false });

    // Pointer events for smooth drag / pan when zoomed
    lightboxViewport.addEventListener('pointerdown', (e) => {
      if (zoomLevel <= 1) {
        // Single click when 1x can zoom in to 1.8x
        return;
      }
      isDragging = true;
      dragStartX = e.clientX - panX;
      dragStartY = e.clientY - panY;
      lightboxViewport.classList.add('is-dragging');
      lightboxViewport.setPointerCapture(e.pointerId);
    });

    lightboxViewport.addEventListener('pointermove', (e) => {
      if (!isDragging || zoomLevel <= 1) return;
      panX = e.clientX - dragStartX;
      panY = e.clientY - dragStartY;
      clampPan();
      updateTransform(false);
    });

    const stopDragging = (e) => {
      if (!isDragging) return;
      isDragging = false;
      if (lightboxViewport) {
        lightboxViewport.classList.remove('is-dragging');
        try {
          lightboxViewport.releasePointerCapture(e.pointerId);
        } catch (_) {}
      }
      clampPan();
      updateTransform(true);
    };

    lightboxViewport.addEventListener('pointerup', stopDragging);
    lightboxViewport.addEventListener('pointercancel', stopDragging);

    // Single click on image toggles zoom if not dragging
    lightboxViewport.addEventListener('click', (e) => {
      if (e.target.closest('.zoom-toolbar') || e.target.closest('#lightbox-close')) return;
      if (zoomLevel === 1) {
        setZoom(1.8);
      }
    });
  }

  function openLightbox(index) {
    const item = galleryItems[index];
    if (!item) return;

    resetZoom();

    lightboxImg.src = item.src;
    lightboxImg.alt = item.title;
    lightboxTitle.textContent = item.title;
    lightboxCategory.textContent = item.category;
    lightboxDesc.textContent = item.subtitle;

    lightboxWaBtn.onclick = () => {
      closeLightbox();
      openQuoteModal(`Consulta por ${item.title}`);
    };

    lightboxBackdrop.classList.add('active');
  }

  function closeLightbox() {
    if (lightboxBackdrop) {
      lightboxBackdrop.classList.remove('active');
      resetZoom();
    }
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) {
    lightboxBackdrop.addEventListener('click', (e) => {
      if (e.target === lightboxBackdrop) closeLightbox();
    });
  }

  document.addEventListener('click', (e) => {
    const card = e.target.closest('[data-gallery-index]');
    if (card) {
      const idx = parseInt(card.getAttribute('data-gallery-index'), 10);
      openLightbox(idx);
    }
  });

  // ==========================================
  // 5. QUICK QUOTE MODAL (WHATSAPP)
  // ==========================================
  let modalBackdrop = document.getElementById('wa-quote-modal');
  if (!modalBackdrop) {
    modalBackdrop = document.createElement('div');
    modalBackdrop.id = 'wa-quote-modal';
    modalBackdrop.className = 'wa-modal-backdrop';
    modalBackdrop.innerHTML = `
      <div class="wa-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div class="flex items-center gap-2">
            <i class="ph-fill ph-fire text-brand-accent2 text-2xl"></i>
            <h3 id="modal-title" class="font-display font-bold text-xl uppercase text-white">Presupuesto WhatsApp</h3>
          </div>
          <button type="button" id="modal-close" class="text-brand-text2 hover:text-white p-1 text-2xl transition-colors" aria-label="Cerrar ventana">
            <i class="ph-bold ph-x"></i>
          </button>
        </div>

        <form id="quote-form" class="space-y-4">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-brand-text2 mb-1.5" for="form-menu">
              Menú o Plato Seleccionado
            </label>
            <input 
              type="text" 
              id="form-menu" 
              class="w-full bg-[#202020] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-primary"
              required
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-brand-text2 mb-1.5" for="form-guests">
                Cantidad de Comensales
              </label>
              <input 
                type="number" 
                id="form-guests" 
                min="5" 
                max="1000" 
                value="30" 
                class="w-full bg-[#202020] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-primary"
              />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-brand-text2 mb-1.5" for="form-type">
                Tipo de Evento
              </label>
              <select 
                id="form-type" 
                class="w-full bg-[#202020] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-primary"
              >
                <option value="Cumpleaños / Fiesta Privada">Cumpleaños / Fiesta</option>
                <option value="Boda / Casamiento">Boda / Casamiento</option>
                <option value="Evento Corporativo / Fin de Año">Corporativo / Empresa</option>
                <option value="Bautismo / Comunión / Aniversario">Bautismo / Aniversario</option>
                <option value="Reunión de Amigos / Asado">Reunión de Amigos</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-brand-text2 mb-1.5" for="form-date">
                Fecha Estimada
              </label>
              <input 
                type="text" 
                id="form-date" 
                placeholder="Ej: Sábado 15 de Noviembre" 
                class="w-full bg-[#202020] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-primary"
              />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-brand-text2 mb-1.5" for="form-location">
                Ubicación / Zona
              </label>
              <input 
                type="text" 
                id="form-location" 
                placeholder="Ej: CABA / Pilar / Tigre" 
                class="w-full bg-[#202020] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          <div class="pt-3">
            <button 
              type="submit" 
              class="w-full bg-brand-whatsapp hover:bg-brand-whatsappHover text-white font-bold py-3.5 px-6 rounded-xl shadow-whatsapp-strong transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <i class="ph-bold ph-whatsapp text-2xl"></i>
              <span class="tracking-wide uppercase text-sm">ENVIAR AHORA POR WHATSAPP</span>
            </button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(modalBackdrop);
  }

  const modalClose = document.getElementById('modal-close');
  const quoteForm = document.getElementById('quote-form');
  const formMenuInput = document.getElementById('form-menu');

  function openQuoteModal(menuName) {
    if (formMenuInput) {
      formMenuInput.value = menuName || 'Consulta General de Catering';
    }
    if (modalBackdrop) {
      modalBackdrop.classList.add('active');
    }
  }

  function closeQuoteModal() {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('active');
    }
  }

  if (modalClose) modalClose.addEventListener('click', closeQuoteModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeQuoteModal();
    });
  }

  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const menu = document.getElementById('form-menu').value.trim();
      const guests = document.getElementById('form-guests').value.trim();
      const eventType = document.getElementById('form-type').value;
      const date = document.getElementById('form-date').value.trim();
      const location = document.getElementById('form-location').value.trim();

      let text = `¡Hola *A Todo Fuego*! 🔥\nQuiero consultar presupuesto para un evento:\n\n`;
      text += `📌 *Menú / Servicio:* ${menu}\n`;
      if (guests) text += `👥 *Invitados:* aprox. ${guests} personas\n`;
      if (eventType) text += `🎉 *Tipo de Evento:* ${eventType}\n`;
      if (date) text += `📅 *Fecha Tentativa:* ${date}\n`;
      if (location) text += `📍 *Ubicación / Zona:* ${location}\n`;
      text += `\n¿Podrían indicarme opciones y disponibilidad? ¡Muchas gracias!`;

      const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
      window.open(waUrl, '_blank');
      closeQuoteModal();
    });
  }

  // --- Attach click handlers to all buttons with [data-wa] ---
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-wa]');
    if (btn) {
      e.preventDefault();
      const waTopic = btn.getAttribute('data-wa') || 'Consulta General';
      openQuoteModal(waTopic);
    }
  });

  // Replay fire button support
  document.addEventListener('click', (e) => {
    const replayBtn = e.target.closest('[data-replay-fire]');
    if (replayBtn) {
      e.preventDefault();
      showSplash();
    }
  });

  // ESC key closes any open modal or splash
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeQuoteModal();
      closeLightbox();
      hideSplash();
    }
  });
})();
