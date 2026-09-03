/* =========================================================================
   CENTRO AK — 옵션 카드/상세 팝업/확대 컴포넌트 (신규, 전면 재구축)
   - centroOptions(js/centro-option-data.js)의 데이터 객체로부터
     카드와 모달을 동일하게 렌더링합니다 (id 매칭으로 불일치 방지).
   - 이 스크립트는 .centro-option-* 요소에만 동작하며 다른 사이트 영역(ca-*)에는
     관여하지 않습니다.
   ========================================================================= */
(function(){
  "use strict";

  function escAttr(str){
    return String(str == null ? "" : str).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  }

  function placeholderHTML(){
    return '<div class="centro-option-placeholder">' +
      '<i class="fa-solid fa-image"></i>' +
      '<span>옵션 이미지 준비 중</span>' +
      '</div>';
  }

  function cardMediaHTML(opt){
    var badgeClass = "centro-option-applic-badge" + (opt.isNew ? " is-accent" : "");
    var badge = '<span class="' + badgeClass + '">' + escAttr(opt.applicability || opt.catLabel || "") + '</span>';
    if(opt.image){
      return badge +
        '<img src="' + escAttr(opt.image) + '" alt="' + escAttr(opt.imageAlt || opt.title) + '" loading="lazy" style="object-position:' + escAttr(opt.objectPosition || "center") + ';">';
    }
    return badge + placeholderHTML();
  }

  function renderCard(opt){
    var newTag = opt.isNew ? '<span class="centro-option-new-tag">NEW</span>' : "";
    return (
      '<button type="button" class="centro-option-card" data-option-id="' + escAttr(opt.id) + '" aria-haspopup="dialog">' +
        '<div class="centro-option-card-media">' + cardMediaHTML(opt) + '</div>' +
        '<div class="centro-option-card-body">' +
          '<span class="centro-option-card-cat">' + escAttr(opt.catLabel || "") + '</span>' +
          '<div class="centro-option-card-title-row">' +
            '<span class="centro-option-card-title">' + opt.title + '</span>' + newTag +
          '</div>' +
          '<p class="centro-option-card-desc">' + escAttr(opt.summary || "") + '</p>' +
          '<span class="centro-option-card-more">자세히 보기<i class="fa-solid fa-arrow-right"></i></span>' +
        '</div>' +
      '</button>'
    );
  }

  /**
   * 지정된 컨테이너에 카테고리별 옵션 카드 그리드를 렌더링합니다.
   * @param {string} containerSelector - .centro-option-grid 컨테이너 셀렉터
   * @param {string} category - CENTRO_OPTIONS 항목의 category 값
   */
  function renderOptionGrid(containerSelector, category){
    var container = document.querySelector(containerSelector);
    if(!container || !window.CENTRO_OPTIONS) return;
    var items = window.CENTRO_OPTIONS.filter(function(o){ return o.category === category; });
    container.innerHTML = items.map(renderCard).join("");
  }

  /**
   * 지정된 컨테이너에 id 배열 순서대로 선택된 옵션 카드만 렌더링합니다.
   * (ecv1-2van.html / ecv1-5van.html처럼 카테고리 전체가 아닌 일부 옵션만
   *  큐레이션해서 보여줘야 하는 페이지에서 사용)
   * @param {string} containerSelector - .centro-option-grid 컨테이너 셀렉터
   * @param {string[]} ids - CENTRO_OPTIONS 항목의 id 배열(표시 순서대로)
   */
  function renderOptionGridByIds(containerSelector, ids){
    var container = document.querySelector(containerSelector);
    if(!container || !window.CENTRO_OPTIONS || !ids) return;
    var byId = {};
    window.CENTRO_OPTIONS.forEach(function(o){ byId[o.id] = o; });
    var items = ids.map(function(id){ return byId[id]; }).filter(Boolean);
    container.innerHTML = items.map(renderCard).join("");
  }

  /* ---------------- Modal / Lightbox ---------------- */
  var modalEl, lightboxEl;
  var savedScrollY = 0;
  var lastActiveCard = null;
  var currentOption = null;
  var currentImageIndex = 0;

  function ensureModalMarkup(){
    if(document.getElementById("centro-option-modal")) return;
    var wrap = document.createElement("div");
    wrap.innerHTML =
      '<div class="centro-option-modal" id="centro-option-modal">' +
        '<div class="centro-option-modal-backdrop"></div>' +
        '<div class="centro-option-modal-panel" role="dialog" aria-modal="true" aria-label="옵션 상세 정보">' +
          '<button type="button" class="centro-option-modal-close" aria-label="닫기"><i class="fa-solid fa-xmark"></i></button>' +
          '<div class="centro-option-modal-media"></div>' +
          '<div class="centro-option-modal-body"></div>' +
        '</div>' +
      '</div>' +
      '<div class="centro-option-lightbox" id="centro-option-lightbox">' +
        '<div class="centro-option-lightbox-backdrop"></div>' +
        '<button type="button" class="centro-option-lightbox-close" aria-label="확대 이미지 닫기"><i class="fa-solid fa-xmark"></i></button>' +
        '<img src="" alt="">' +
      '</div>';
    while(wrap.firstChild){ document.body.appendChild(wrap.firstChild); }
    modalEl = document.getElementById("centro-option-modal");
    lightboxEl = document.getElementById("centro-option-lightbox");

    modalEl.querySelector(".centro-option-modal-backdrop").addEventListener("click", closeModal);
    modalEl.querySelector(".centro-option-modal-close").addEventListener("click", closeModal);
    lightboxEl.querySelector(".centro-option-lightbox-backdrop").addEventListener("click", closeLightbox);
    lightboxEl.querySelector(".centro-option-lightbox-close").addEventListener("click", closeLightbox);

    document.addEventListener("keydown", function(e){
      if(e.key !== "Escape") return;
      if(lightboxEl.classList.contains("is-open")){ closeLightbox(); }
      else if(modalEl.classList.contains("is-open")){ closeModal(); }
    });
  }

  function getImageList(opt){
    if(opt.images && opt.images.length){ return opt.images; }
    if(opt.image){ return [{ src: opt.image, alt: opt.imageAlt || opt.title }]; }
    return [];
  }

  function renderModalMedia(){
    var mediaEl = modalEl.querySelector(".centro-option-modal-media");
    var list = getImageList(currentOption);
    if(!list.length){
      mediaEl.innerHTML = placeholderHTML();
      return;
    }
    var current = list[currentImageIndex] || list[0];
    var thumbsHTML = "";
    if(list.length > 1){
      thumbsHTML = '<div class="centro-option-modal-thumbs">' +
        list.map(function(im, i){
          return '<button type="button" class="centro-option-modal-thumb' + (i === currentImageIndex ? ' is-active' : '') + '" data-idx="' + i + '">' +
            '<img src="' + escAttr(im.src) + '" alt="' + escAttr(im.alt || "") + '">' +
          '</button>';
        }).join("") +
      '</div>';
    }
    mediaEl.innerHTML =
      '<img src="' + escAttr(current.src) + '" alt="' + escAttr(current.alt || "") + '" style="object-position:' + escAttr(currentOption.objectPosition || "center") + ';">' +
      thumbsHTML;

    var img = mediaEl.querySelector("img");
    if(img){ img.addEventListener("click", function(){ openLightbox(current.src, current.alt || ""); }); }

    mediaEl.querySelectorAll(".centro-option-modal-thumb").forEach(function(btn){
      btn.addEventListener("click", function(){
        currentImageIndex = parseInt(btn.getAttribute("data-idx"), 10) || 0;
        renderModalMedia();
      });
    });
  }

  function renderModalBody(){
    var bodyEl = modalEl.querySelector(".centro-option-modal-body");
    var badgeClass = "centro-option-modal-badge" + (currentOption.isNew ? " is-accent" : "");
    var newTag = currentOption.isNew ? '<span class="centro-option-new-tag">NEW</span>' : "";
    var featuresHTML = (currentOption.features || []).slice(0, 3).map(function(f){
      return '<li><i class="fa-solid fa-check"></i>' + escAttr(f) + '</li>';
    }).join("");
    bodyEl.innerHTML =
      '<span class="' + badgeClass + '">' + escAttr(currentOption.applicability || currentOption.catLabel || "") + '</span>' +
      '<span class="centro-option-modal-cat">' + escAttr(currentOption.catLabel || "") + '</span>' +
      '<h3 class="centro-option-modal-title">' + currentOption.title + newTag + '</h3>' +
      (currentOption.summary ? '<p class="centro-option-modal-summary">' + escAttr(currentOption.summary) + '</p>' : "") +
      '<p class="centro-option-modal-desc">' + escAttr(currentOption.description || "") + '</p>' +
      (featuresHTML ? '<ul class="centro-option-modal-features">' + featuresHTML + '</ul>' : "") +
      (currentOption.applicModel ? '<p class="centro-option-modal-applic"><strong>적용 모델:</strong> ' + escAttr(currentOption.applicModel) + '</p>' : "");
  }

  function openModal(id, triggerEl){
    ensureModalMarkup();
    var opt = (window.CENTRO_OPTIONS || []).filter(function(o){ return o.id === id; })[0];
    if(!opt) return;
    currentOption = opt;
    currentImageIndex = 0;
    lastActiveCard = triggerEl || null;

    renderModalMedia();
    renderModalBody();

    modalEl.classList.add("is-open");
    savedScrollY = window.scrollY || window.pageYOffset || 0;
    document.body.classList.add("centro-option-noscroll");
    document.body.style.top = "-" + savedScrollY + "px";
    modalEl.querySelector(".centro-option-modal-close").focus();
  }

  function closeModal(){
    if(!modalEl || !modalEl.classList.contains("is-open")) return;
    modalEl.classList.remove("is-open");
    document.body.classList.remove("centro-option-noscroll");
    document.body.style.top = "";
    window.scrollTo(0, savedScrollY);
    if(lastActiveCard){ lastActiveCard.focus(); }
  }

  function openLightbox(src, alt){
    ensureModalMarkup();
    var img = lightboxEl.querySelector("img");
    img.src = src;
    img.alt = alt || "";
    lightboxEl.classList.add("is-open");
  }
  function closeLightbox(){
    if(!lightboxEl) return;
    lightboxEl.classList.remove("is-open");
    var img = lightboxEl.querySelector("img");
    img.src = "";
  }

  function initOptionCardClicks(){
    document.addEventListener("click", function(e){
      var card = e.target.closest(".centro-option-card");
      if(!card) return;
      var id = card.getAttribute("data-option-id");
      if(id){ openModal(id, card); }
    });
  }

  window.CentroOption = {
    renderOptionGrid: renderOptionGrid,
    renderOptionGridByIds: renderOptionGridByIds,
    openModal: openModal
  };

  document.addEventListener("DOMContentLoaded", function(){
    ensureModalMarkup();
    initOptionCardClicks();
  });

})();
