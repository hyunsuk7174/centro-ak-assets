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
    initSocialLinks();
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
    var forms = document.querySelectorAll('#ca-lead-form, form.ca-form');
    if(!forms.length) return;
    var ENDPOINT = 'https://formsubmit.co/ajax/admin@centroak.com';   // 접수 메일 수신 주소
    var TYPE_LABEL = { quote:'가격/견적 상담', testdrive:'시승 신청', dealer:'딜러 상담', fleet:'법인·플릿 문의', service:'A/S·부품 문의' };
    var MODEL_LABEL = { '2van':'E-CV1 2VAN', '5van':'E-CV1 5VAN', undecided:'아직 결정하지 않음' };

    forms.forEach(function(form){
      var success = form.querySelector('.ca-form-success') || document.querySelector('#ca-form-success');
      var btn = form.querySelector('button[type="submit"]');
      var btnText = '';
      var errBox = null;

      function showError(msg){
        if(!errBox){
          errBox = document.createElement('div');
          errBox.className = 'ca-form-error';
          errBox.setAttribute('role','alert');
          errBox.style.cssText = 'margin-top:12px;padding:12px 14px;border-radius:10px;background:#fef2f2;color:#b91c1c;font-size:14px;line-height:1.6;';
          form.appendChild(errBox);
        }
        errBox.textContent = msg;
        errBox.style.display = 'block';
      }

      form.addEventListener('submit', function(e){
        e.preventDefault();
        if(!form.checkValidity()){ form.reportValidity(); return; }
        if(form.dataset.sending === '1') return;

        var raw = Object.fromEntries(new FormData(form).entries());
        var typeKo = TYPE_LABEL[raw.type] || raw.type || '';
        var modelKo = MODEL_LABEL[raw.model] || raw.model || '';
        var payload = {
          '상담유형': typeKo,
          '관심모델': modelKo,
          '이름': raw.name || '',
          '연락처': raw.phone || '',
          '지역': raw.region || '',
          '문의내용': raw.message || '',
          '접수경로': location.href,
          '접수시각': new Date().toLocaleString('ko-KR', { timeZone:'Asia/Seoul' }),
          '표시언어': (document.documentElement.getAttribute('data-ca-lang') || 'ko'),
          _subject: '[센트로에이케이 홈페이지] ' + typeKo + ' - ' + (raw.name || '') + ' (' + (raw.phone || '') + ')',
          _template: 'table',
          _captcha: 'false',
          _honey: ''
        };

        form.dataset.sending = '1';
        if(btn){ btnText = btn.textContent; btn.disabled = true; btn.textContent = '전송 중…'; }
        if(errBox) errBox.style.display = 'none';

        fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload)
        }).then(function(r){ return r.json().catch(function(){ return {}; }).then(function(j){ return { ok: r.ok, body: j }; }); })
        .then(function(res){
          if(!res.ok || (res.body && res.body.success === 'false')) throw new Error((res.body && res.body.message) || 'send failed');
          form.reset();
          if(success){
            success.classList.add('is-visible');
            success.setAttribute('tabindex','-1');
            success.focus();
            setTimeout(function(){ success.classList.remove('is-visible'); }, 8000);
          }
        })
        .catch(function(err){
          console.warn('[CENTRO AK] 상담 신청 전송 실패:', err);
          showError('전송에 실패했습니다. 전화 070-8657-0905 또는 admin@centroak.com 으로 문의해 주세요.');
        })
        .finally(function(){
          form.dataset.sending = '';
          if(btn){ btn.disabled = false; btn.textContent = btnText; }
        });
      });
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


  /* 12. 소셜 링크 (푸터) */
  function initSocialLinks(){
    var links = { '인스타그램': 'https://www.instagram.com/centroak.kor_official/' };
    document.querySelectorAll('.ca-footer-social a[aria-label]').forEach(function(a){
      var url = links[a.getAttribute('aria-label')];
      if(url){ a.setAttribute('href', url); a.setAttribute('target','_blank'); a.setAttribute('rel','noopener'); }
    });
  }

  /* 13. 다국어(KO/EN/ZH) 스크립트 로드 — 하루 단위 캐시 무효화 */
  (function(){
    try{
      var d = new Date(); var stamp = d.getFullYear()*10000 + (d.getMonth()+1)*100 + d.getDate();
      var s = document.createElement('script');
      s.src = 'https://hyunsuk7174.github.io/centro-ak-assets/ca-i18n.js?d=' + stamp;
      s.defer = true; document.head.appendChild(s);
    }catch(e){}
  })();
})();
