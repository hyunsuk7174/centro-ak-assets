/* =========================================================================
   CENTRO AK — Common Site Script (ca- prefix)
   헤더 스크롤, 모바일 메뉴, 모델탭, FAQ 아코디언, 카운트업, 폼 검증
   ========================================================================= */
(function(){
  "use strict";

  document.addEventListener('DOMContentLoaded', function(){
    initHeaderScroll();
    initMobileNav();
    initDesktopDropdown();
    initModelTabs();
    initFaqAccordion();
    initCountUp();
    initFadeUp();
    initLeadForm();
    initFooterYear();
    initOptionGallery();
    initVideoGallery();
  });

  /* 1. 헤더 스크롤 시 배경 전환 */
  function initHeaderScroll(){
    var header = document.querySelector('.ca-header');
    if(!header) return;
    function onScroll(){
      if(window.scrollY > 8){ header.classList.add('is-scrolled'); }
      else { header.classList.remove('is-scrolled'); }
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive:true });
  }

  /* 2. 모바일 메뉴 토글 */
  function initMobileNav(){
    var toggle = document.querySelector('.ca-menu-toggle');
    var nav = document.querySelector('.ca-mobile-nav');
    var header = document.querySelector('.ca-header');
    if(!toggle || !nav) return;

    toggle.addEventListener('click', function(){
      var willOpen = !nav.classList.contains('is-open');
      nav.classList.toggle('is-open', willOpen);
      toggle.setAttribute('aria-expanded', String(willOpen));
      if(header) header.classList.toggle('is-open', willOpen);
      document.body.style.overflow = willOpen ? 'hidden' : '';
      toggle.querySelector('i').className = willOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    });

    // 그룹 아코디언 (Models 등)
    nav.querySelectorAll('.ca-mobile-group-toggle').forEach(function(btn){
      btn.addEventListener('click', function(){
        var group = btn.closest('.ca-mobile-group');
        group.classList.toggle('is-open');
      });
    });

    // 링크 클릭 시 메뉴 닫기
    nav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        if(header) header.classList.remove('is-open');
        document.body.style.overflow = '';
        var icon = toggle.querySelector('i');
        if(icon) icon.className = 'fa-solid fa-bars';
      });
    });
  }

  /* 3. 데스크톱 드롭다운 키보드 접근성 */
  function initDesktopDropdown(){
    document.querySelectorAll('.ca-nav-item').forEach(function(item){
      var link = item.querySelector('.ca-nav-link');
      var dropdown = item.querySelector('.ca-dropdown');
      if(!link || !dropdown) return;
      link.setAttribute('aria-haspopup', 'true');
      link.setAttribute('aria-expanded', 'false');

      item.addEventListener('focusin', function(){ link.setAttribute('aria-expanded','true'); });
      item.addEventListener('focusout', function(e){
        if(!item.contains(e.relatedTarget)) link.setAttribute('aria-expanded','false');
      });
      item.addEventListener('mouseenter', function(){ link.setAttribute('aria-expanded','true'); });
      item.addEventListener('mouseleave', function(){ link.setAttribute('aria-expanded','false'); });
    });
  }

  /* 4. 모델 탭 (2VAN / 5VAN) */
  function initModelTabs(){
    var tabsWrap = document.querySelector('.ca-model-tabs');
    if(!tabsWrap) return;
    var tabs = tabsWrap.querySelectorAll('.ca-model-tab');
    var panels = document.querySelectorAll('.ca-model-panel');

    tabs.forEach(function(tab){
      tab.addEventListener('click', function(){
        var target = tab.getAttribute('data-target');
        tabs.forEach(function(t){ t.classList.remove('is-active'); t.setAttribute('aria-selected','false'); });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');
        panels.forEach(function(p){
          p.classList.toggle('is-active', p.getAttribute('data-panel') === target);
        });
      });
    });
  }

  /* 5. FAQ 아코디언 */
  function initFaqAccordion(){
    document.querySelectorAll('.ca-faq-item').forEach(function(item){
      var q = item.querySelector('.ca-faq-q');
      if(!q) return;
      q.addEventListener('click', function(){
        var isOpen = item.classList.contains('is-open');
        // 같은 그룹 내 다른 항목 닫기
        var faqWrap = item.closest('.ca-faq');
        if(faqWrap){
          faqWrap.querySelectorAll('.ca-faq-item.is-open').forEach(function(other){
            if(other !== item) other.classList.remove('is-open');
          });
        }
        item.classList.toggle('is-open', !isOpen);
        q.setAttribute('aria-expanded', String(!isOpen));
      });
    });
  }

  /* 6. 숫자 카운트업 (성능 숫자 섹션) */
  function initCountUp(){
    var nums = document.querySelectorAll('[data-count-to]');
    if(!nums.length || !('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    nums.forEach(function(el){ observer.observe(el); });

    function animateCount(el){
      var to = parseFloat(el.getAttribute('data-count-to'));
      var decimals = (el.getAttribute('data-count-to').split('.')[1] || '').length;
      var duration = 1100;
      var start = null;

      function step(ts){
        if(!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = (to * eased).toFixed(decimals);
        el.textContent = Number(current).toLocaleString(undefined, {minimumFractionDigits:decimals, maximumFractionDigits:decimals});
        if(progress < 1){ requestAnimationFrame(step); }
      }
      requestAnimationFrame(step);
    }
  }

  /* 7. 스크롤 페이드업 */
  function initFadeUp(){
    var targets = document.querySelectorAll('.ca-fade-up');
    if(!targets.length) return;
    if(!('IntersectionObserver' in window)){
      targets.forEach(function(t){ t.classList.add('is-visible'); });
      return;
    }
    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    targets.forEach(function(t){ observer.observe(t); });
  }

  /* 8. 상담/견적 신청 폼 (프론트 검증 + 로컬 데모 처리) */
  function initLeadForm(){
    var form = document.querySelector('#ca-lead-form');
    if(!form) return;
    var success = document.querySelector('#ca-form-success');

    form.addEventListener('submit', function(e){
      e.preventDefault();
      if(!form.checkValidity()){
        form.reportValidity();
        return;
      }
      // 실제 서버가 없는 정적 사이트이므로, 아임웹 폼 위젯 또는
      // 폼 수집 서비스 연동 전까지는 콘솔 로그 + 완료 메시지로 대체합니다.
      var data = Object.fromEntries(new FormData(form).entries());
      console.log('[CENTRO AK] 상담 신청 데이터:', data);

      form.reset();
      if(success){
        success.classList.add('is-visible');
        success.setAttribute('tabindex','-1');
        success.focus();
        setTimeout(function(){ success.classList.remove('is-visible'); }, 6000);
      }
    });
  }

  /* 9. 푸터 연도 자동 갱신 */
  function initFooterYear(){
    var el = document.querySelector('#ca-year');
    if(el) el.textContent = new Date().getFullYear();
  }

  /* 10. 옵션 세부사양 카드 갤러리 — 현대·기아 스타일: 썸네일 클릭 → 확대 이미지 + 우측 설명 모달 */
  function initOptionGallery(){
    var modal = document.querySelector('#ca-opt-modal');
    var cards = document.querySelectorAll('.ca-opt-card');
    if(!modal || !cards.length) return;

    var mediaWrap = modal.querySelector('.ca-opt-modal-media');
    var mediaImg = modal.querySelector('.ca-opt-modal-media img');
    var tagEl = modal.querySelector('.ca-opt-modal-tag');
    var bodyWrap = modal.querySelector('.ca-opt-modal-body');
    var closeBtn = modal.querySelector('.ca-opt-modal-close');
    var backdrop = modal.querySelector('.ca-opt-modal-backdrop');
    var lastActive = null;

    cards.forEach(function(card){
      card.addEventListener('click', function(){ openModal(card); });
      card.addEventListener('keydown', function(e){
        if(e.key === 'Enter' || e.key === ' '){
          e.preventDefault();
          openModal(card);
        }
      });
    });

    function openModal(card){
      var mediaBox = card.querySelector('.ca-opt-card-media');
      var img = card.querySelector('.ca-opt-card-media img');
      var tag = card.querySelector('.ca-opt-card-tag');
      var badge = card.querySelector('.ca-opt-card-badge');
      var title = card.querySelector('.ca-opt-card-title');
      var detailTpl = card.querySelector('.ca-opt-card-detail');
      if(!img) return;

      lastActive = card;

      mediaImg.src = img.getAttribute('src');
      mediaImg.alt = img.getAttribute('alt') || '';
      mediaWrap.classList.toggle('is-contain', !!(mediaBox && mediaBox.classList.contains('is-contain')));

      if(tag){
        tagEl.textContent = tag.textContent;
        tagEl.className = 'ca-opt-modal-tag' + (tag.classList.contains('is-red') ? ' is-red' : '');
        tagEl.style.display = '';
      } else {
        tagEl.style.display = 'none';
      }

      var html = '';
      if(badge){
        html += '<span class="ca-opt-modal-badge' +
          (badge.classList.contains('is-red') ? ' is-red' : '') +
          (badge.classList.contains('is-new') ? ' is-new' : '') +
          '">' + badge.textContent + '</span>';
      }
      html += '<h3 class="ca-opt-modal-title">' + (title ? title.textContent : '') + '</h3>';
      if(detailTpl && detailTpl.content){
        var tmp = document.createElement('div');
        tmp.appendChild(detailTpl.content.cloneNode(true));
        html += tmp.innerHTML;
      }
      bodyWrap.innerHTML = html;

      modal.classList.add('is-open');
      document.body.classList.add('ca-noscroll');
      closeBtn.focus();
    }

    function closeModal(){
      modal.classList.remove('is-open');
      document.body.classList.remove('ca-noscroll');
      if(lastActive){ lastActive.focus(); }
    }

    if(closeBtn) closeBtn.addEventListener('click', closeModal);
    if(backdrop) backdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });
  }

  /* 11. 홍보 영상 갤러리 — 유튜브 라이트박스 */
  function initVideoGallery(){
    var modal = document.querySelector('#ca-video-modal');
    var cards = document.querySelectorAll('.ca-video-card');
    if(!modal || !cards.length) return;

    var frame = modal.querySelector('#ca-video-modal-frame');
    var titleEl = modal.querySelector('#ca-video-modal-title');
    var closeEls = modal.querySelectorAll('[data-video-close]');
    var lastActive = null;

    cards.forEach(function(card){
      card.addEventListener('click', function(){ openVideo(card); });
    });

    function openVideo(card){
      var videoId = card.getAttribute('data-video-id');
      var title = card.getAttribute('data-video-title') || '';
      if(!videoId) return;
      lastActive = card;
      frame.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0';
      if(titleEl) titleEl.textContent = title;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('ca-noscroll');
    }

    function closeVideo(){
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      frame.src = '';
      document.body.classList.remove('ca-noscroll');
      if(lastActive){ lastActive.focus(); }
    }

    closeEls.forEach(function(el){ el.addEventListener('click', closeVideo); });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && modal.classList.contains('is-open')) closeVideo();
    });
  }

})();
