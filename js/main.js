// A Todo Fuego - Realistic Fire Simulation & Interactive Catering Experience

(function () {
  'use strict';

  // Config: WhatsApp business phone (Argentine international format)
  const WHATSAPP_PHONE = '5491123456789';

  // ==========================================
  // 1. REALISTIC FIRE SIMULATION (CANVAS)
  // ==========================================
  const splash = document.getElementById('splash');
  const skipBtn = document.getElementById('skip');
  const canvas = document.getElementById('fire');

  let fireAnimationId = null;
  let isFireRunning = false;
  let flameParticles = [];
  let emberParticles = [];
  let smokeParticles = [];

  const FLAME_COUNT = 240;
  const EMBER_COUNT = 130;
  const SMOKE_COUNT = 45;

  function initFireCanvas() {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // --- Flame Particle (Core, hot tongues of fire) ---
    class FlameParticle {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        const hearthWidth = Math.min(canvas.width * 0.75, 620);
        const center = canvas.width * 0.5;
        // Bell curve distribution around center
        const u = Math.random() + Math.random() - 1;
        this.x = center + u * (hearthWidth * 0.5);
        this.y = canvas.height * 0.94 + Math.random() * 25;

        // Upward buoyancy with slight horizontal drift
        const distFromCenter = (this.x - center) / (hearthWidth * 0.5);
        this.vx = -distFromCenter * 0.8 + (Math.random() - 0.5) * 1.5;
        this.vy = -(Math.random() * 4.2 + 3.8);

        this.size = Math.random() * 28 + 20;
        this.initialSize = this.size;
        this.life = initial ? Math.random() * 50 : 0;
        this.maxLife = Math.random() * 42 + 36;
        this.stretchY = Math.random() * 0.6 + 1.4; // Vertical stretch
        this.turbPhase = Math.random() * Math.PI * 2;
      }

      update(time) {
        this.life++;
        const progress = this.life / this.maxLife;

        // Turbulence
        this.x += this.vx + Math.sin(time * 0.05 + this.turbPhase) * 1.2;
        this.y += this.vy;

        // Size curve: swells at first, then shrinks into flame tongue tip
        if (progress < 0.25) {
          this.size = this.initialSize * (1 + progress * 0.6);
        } else {
          this.size = this.initialSize * 1.15 * (1 - (progress - 0.25) / 0.75);
        }

        if (this.life >= this.maxLife || this.size <= 0.8) {
          this.reset();
        }
      }

      draw(c) {
        const progress = this.life / this.maxLife;
        c.save();
        c.translate(this.x, this.y);
        c.scale(1, this.stretchY);

        let colorStop0, colorStop1, colorStop2, alpha;

        if (progress < 0.2) {
          // White-hot core (Hearth ignition)
          alpha = (1 - progress * 0.4) * 0.85;
          colorStop0 = `rgba(255, 255, 230, ${alpha})`;
          colorStop1 = `rgba(255, 205, 70, ${alpha * 0.8})`;
          colorStop2 = `rgba(255, 100, 0, 0)`;
        } else if (progress < 0.55) {
          // Pure golden-orange combustion
          alpha = (1 - (progress - 0.2) / 0.35 * 0.3) * 0.75;
          colorStop0 = `rgba(255, 185, 30, ${alpha})`;
          colorStop1 = `rgba(255, 80, 0, ${alpha * 0.75})`;
          colorStop2 = `rgba(215, 25, 0, 0)`;
        } else {
          // Deep crimson flame tips
          alpha = (1 - (progress - 0.55) / 0.45) * 0.65;
          colorStop0 = `rgba(240, 65, 10, ${alpha})`;
          colorStop1 = `rgba(180, 20, 5, ${alpha * 0.6})`;
          colorStop2 = `rgba(80, 5, 0, 0)`;
        }

        const radGrad = c.createRadialGradient(0, 0, 0, 0, 0, Math.max(1, this.size));
        radGrad.addColorStop(0, colorStop0);
        radGrad.addColorStop(0.45, colorStop1);
        radGrad.addColorStop(1, colorStop2);

        c.fillStyle = radGrad;
        c.beginPath();
        c.arc(0, 0, Math.max(1, this.size), 0, Math.PI * 2);
        c.fill();
        c.restore();
      }
    }

    // --- Ember Particle (Realistic swirling sparks from burning wood) ---
    class EmberParticle {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        const hearthWidth = Math.min(canvas.width * 0.8, 650);
        this.x = canvas.width * 0.5 + (Math.random() - 0.5) * hearthWidth;
        this.y = canvas.height * 0.92 + Math.random() * 40;
        this.vx = (Math.random() - 0.5) * 1.8;
        this.vy = -(Math.random() * 3.8 + 2.4);
        this.size = Math.random() * 2.8 + 1.2;
        this.life = initial ? Math.random() * 70 : 0;
        this.maxLife = Math.random() * 60 + 55;
        this.flickerSpeed = Math.random() * 0.35 + 0.15;
        this.swirlSpeed = Math.random() * 0.04 + 0.02;
        this.swirlRadius = Math.random() * 35 + 15;
        this.colorType = Math.random();
      }

      update(time) {
        this.life++;
        const progress = this.life / this.maxLife;

        // Spiral convection upward
        this.x += this.vx + Math.cos(time * this.swirlSpeed + this.life * 0.1) * 1.6;
        this.y += this.vy;
        this.vy *= 0.995; // slight deceleration as air cools

        if (this.life >= this.maxLife || this.y < canvas.height * 0.12) {
          this.reset();
        }
      }

      draw(c, time) {
        const progress = this.life / this.maxLife;
        const flicker = Math.sin(time * this.flickerSpeed + this.life) * 0.3 + 0.7;
        const alpha = (1 - progress) * flicker;

        c.save();
        c.shadowBlur = 12;
        if (this.colorType > 0.4) {
          c.fillStyle = `rgba(255, 230, 130, ${alpha})`;
          c.shadowColor = `rgba(255, 170, 0, ${alpha})`;
        } else {
          c.fillStyle = `rgba(255, 120, 20, ${alpha})`;
          c.shadowColor = `rgba(244, 81, 30, ${alpha})`;
        }

        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }
    }

    // --- Smoke Particle (Wisps drifting up into the dark) ---
    class SmokeParticle {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = canvas.width * 0.5 + (Math.random() - 0.5) * 350;
        this.y = canvas.height * 0.65 + Math.random() * 60;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = -(Math.random() * 1.8 + 1.2);
        this.size = Math.random() * 25 + 20;
        this.maxLife = Math.random() * 65 + 50;
        this.life = initial ? Math.random() * this.maxLife : 0;
      }

      update() {
        this.life++;
        this.x += this.vx + (Math.random() - 0.5) * 0.6;
        this.y += this.vy;
        this.size += 0.45; // Expands as it rises

        if (this.life >= this.maxLife || this.y < 0) {
          this.reset();
        }
      }

      draw(c) {
        const progress = this.life / this.maxLife;
        const alpha = Math.sin(progress * Math.PI) * 0.08;

        c.save();
        c.fillStyle = `rgba(45, 30, 25, ${alpha})`;
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }
    }

    // Initialize particle arrays
    flameParticles = [];
    emberParticles = [];
    smokeParticles = [];

    for (let i = 0; i < FLAME_COUNT; i++) flameParticles.push(new FlameParticle());
    for (let i = 0; i < EMBER_COUNT; i++) emberParticles.push(new EmberParticle());
    for (let i = 0; i < SMOKE_COUNT; i++) smokeParticles.push(new SmokeParticle());

    let frameCount = 0;

    function render() {
      frameCount++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Hearth Bed Glow (The glowing bed of burning wood)
      const hearthW = Math.min(canvas.width * 0.85, 750);
      const hearthH = 160;
      const hearthGlow = ctx.createRadialGradient(
        canvas.width * 0.5,
        canvas.height * 0.96,
        10,
        canvas.width * 0.5,
        canvas.height * 0.96,
        hearthW * 0.55
      );
      const pulse = Math.sin(frameCount * 0.08) * 0.12 + 0.88;
      hearthGlow.addColorStop(0, `rgba(255, 230, 150, ${0.45 * pulse})`);
      hearthGlow.addColorStop(0.35, `rgba(255, 110, 0, ${0.35 * pulse})`);
      hearthGlow.addColorStop(0.7, `rgba(180, 30, 0, ${0.18 * pulse})`);
      hearthGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.save();
      ctx.fillStyle = hearthGlow;
      ctx.fillRect(0, canvas.height - hearthH * 1.5, canvas.width, hearthH * 1.5);
      ctx.restore();

      // 2. Smoke plumes (in background)
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
      for (let i = 0; i < smokeParticles.length; i++) {
        smokeParticles[i].update();
        smokeParticles[i].draw(ctx);
      }
      ctx.restore();

      // 3. Flame Tongues with Additive Blending (Real combustion luminescence)
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < flameParticles.length; i++) {
        flameParticles[i].update(frameCount);
        flameParticles[i].draw(ctx);
      }

      // 4. Licking Base Flame Curves (Organic ribbon of fire)
      ctx.beginPath();
      const waveY = canvas.height * 0.94;
      ctx.moveTo(canvas.width * 0.5 - hearthW * 0.5, waveY);
      for (let x = canvas.width * 0.5 - hearthW * 0.5; x <= canvas.width * 0.5 + hearthW * 0.5; x += 15) {
        const offset = Math.sin(x * 0.03 + frameCount * 0.08) * 12 +
                       Math.cos(x * 0.06 - frameCount * 0.12) * 8;
        ctx.lineTo(x, waveY + offset);
      }
      ctx.lineTo(canvas.width * 0.5 + hearthW * 0.5, canvas.height);
      ctx.lineTo(canvas.width * 0.5 - hearthW * 0.5, canvas.height);
      ctx.closePath();
      const baseFlameGrad = ctx.createLinearGradient(0, waveY - 20, 0, canvas.height);
      baseFlameGrad.addColorStop(0, `rgba(255, 200, 50, ${0.4 * pulse})`);
      baseFlameGrad.addColorStop(0.5, `rgba(255, 90, 0, ${0.6 * pulse})`);
      baseFlameGrad.addColorStop(1, `rgba(180, 20, 0, ${0.8 * pulse})`);
      ctx.fillStyle = baseFlameGrad;
      ctx.fill();

      // 5. Flying Glowing Embers & Sparks
      for (let i = 0; i < emberParticles.length; i++) {
        emberParticles[i].update(frameCount);
        emberParticles[i].draw(ctx, frameCount);
      }
      ctx.restore();

      if (isFireRunning) {
        fireAnimationId = requestAnimationFrame(render);
      }
    }

    isFireRunning = true;
    render();
  }

  function hideSplash() {
    if (!splash) return;
    splash.classList.add('hidden-splash');
    splash.setAttribute('aria-hidden', 'true');
    // Keep canvas low-power or pause until requested
    setTimeout(() => {
      isFireRunning = false;
      if (fireAnimationId) {
        cancelAnimationFrame(fireAnimationId);
        fireAnimationId = null;
      }
    }, 800);
  }

  function showSplash() {
    if (!splash) return;
    splash.classList.remove('hidden-splash');
    splash.setAttribute('aria-hidden', 'false');
    if (!isFireRunning) {
      isFireRunning = true;
      initFireCanvas();
    }
  }

  if (skipBtn) {
    skipBtn.addEventListener('click', hideSplash);
  }

  // Auto-hide splash after 3.2s
  const autoHideTimer = setTimeout(hideSplash, 3200);

  if (splash) {
    splash.addEventListener('click', (e) => {
      if (e.target.id !== 'skip') {
        clearTimeout(autoHideTimer);
        hideSplash();
      }
    });
  }

  initFireCanvas();

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

            <div class="bg-black/40 rounded-xl p-4 border border-white/5 mb-6">
              <p class="text-xs text-brand-accent2 uppercase font-bold tracking-wider mb-2.5 flex items-center gap-1.5">
                <i class="ph-bold ph-check-circle text-sm text-brand-whatsapp"></i> Incluye en el servicio:
              </p>
              <ul class="text-xs md:text-sm text-brand-text1/90 space-y-1.5">
                ${item.features.map((f) => `<li class="flex items-start gap-2"><span class="text-brand-primary font-bold">•</span><span>${f}</span></li>`).join('')}
              </ul>
            </div>
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
                <span class="flex items-center gap-1"><i class="ph-bold ph-magnifying-glass-plus"></i> Ampliar foto</span>
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
  // 4. LIGHTBOX MODAL FOR PHOTOS
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
          <button type="button" id="lightbox-close" class="text-brand-text2 hover:text-white p-2 text-2xl transition-colors" aria-label="Cerrar foto">
            <i class="ph-bold ph-x"></i>
          </button>
        </div>

        <div class="rounded-xl overflow-hidden max-h-[65vh] bg-black flex items-center justify-center mb-4 border border-white/10">
          <img id="lightbox-img" src="" alt="" class="max-h-[65vh] w-auto max-w-full object-contain" />
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
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCategory = document.getElementById('lightbox-category');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxWaBtn = document.getElementById('lightbox-wa-btn');

  function openLightbox(index) {
    const item = galleryItems[index];
    if (!item) return;

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
