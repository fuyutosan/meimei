(function(){
  'use strict';
  const KEY = 'meimei-ssn-kodomo';
  const MAX_KOI = 7;
  const KOI_COLORS = ['🎏','🎏','🎏','🎏','🎏','🎏'];

  window.MEIMEI_SEASONAL = {
    id: 'kodomo',
    mount(ctx) {
      if(!document.getElementById('seasonal-style-kodomo')){
        const st = document.createElement('style');
        st.id = 'seasonal-style-kodomo';
        st.textContent = `
          .ssn-kodomo-scene {
            position: relative;
            width: 100%;
            height: 220px;
            border-radius: 20px;
            margin: 14px 0;
            overflow: hidden;
            background: linear-gradient(180deg, #bfe4ff 0%, #d8f1ff 100%);
          }
          .ssn-kodomo-pole {
            position: absolute;
            left: 18px;
            top: 10px;
            bottom: 10px;
            width: 6px;
            background: linear-gradient(90deg, #a08060, #c8a878);
            border-radius: 3px;
          }
          .ssn-kodomo-koi {
            position: absolute;
            left: 26px;
            font-size: 34px;
            line-height: 1;
            transform-origin: left center;
            animation: ssn-kodomo-wave 2.6s ease-in-out infinite;
          }
          .ssn-kodomo-koi.top {
            font-size: 38px;
          }
          .ssn-kodomo-koi .ssn-kodomo-face {
            position: absolute;
            left: 2px;
            top: 3px;
            font-size: 16px;
          }
          @keyframes ssn-kodomo-wave {
            0%, 100% { transform: rotate(-6deg) translateY(0); }
            50%      { transform: rotate(4deg) translateY(-4px); }
          }
          .ssn-kodomo-msg {
            text-align: center;
            font-size: 0.95rem;
            line-height: 1.8;
            color: #3a3a3a;
            margin-top: 8px;
          }
          .ssn-kodomo-count {
            text-align: center;
            font-size: 0.85rem;
            color: #057a10;
            font-weight: 700;
            margin-top: 4px;
          }
          @media (max-width: 480px) {
            .ssn-kodomo-scene { height: 190px; }
            .ssn-kodomo-koi { font-size: 28px; }
            .ssn-kodomo-koi.top { font-size: 32px; }
          }
        `;
        document.head.appendChild(st);
      }

      let st;
      try { st = JSON.parse(localStorage.getItem(KEY)) || {}; } catch(e) { st = {}; }
      if (typeof st.count !== 'number') st.count = 0;
      if (typeof st.lastDay !== 'string') st.lastDay = '';

      function save() {
        try { localStorage.setItem(KEY, JSON.stringify(st)); } catch(e) {}
      }

      const card = ctx.card;
      card.innerHTML =
        '<h2>🎏 こどもの日 〜パンダさんこいのぼり〜</h2>' +
        '<p style="font-size:0.95rem; line-height:1.9; color:#3a3a3a; text-align:center;">' +
          '毎日1匹こいのぼりを揚げよう。7匹そろうと、てっぺんはパンダさんこいのぼり🐼' +
        '</p>' +
        '<div class="ssn-kodomo-scene" id="ssn-kodomo-scene"><div class="ssn-kodomo-pole"></div></div>' +
        '<p class="ssn-kodomo-count" id="ssn-kodomo-count"></p>' +
        '<div style="text-align:center;"><button class="omikuji-btn" id="ssn-kodomo-btn">こいのぼりを揚げる</button></div>' +
        '<p class="ssn-kodomo-msg" id="ssn-kodomo-msg"></p>';

      const scene = card.querySelector('#ssn-kodomo-scene');
      const btn = card.querySelector('#ssn-kodomo-btn');
      const countEl = card.querySelector('#ssn-kodomo-count');
      const msgEl = card.querySelector('#ssn-kodomo-msg');

      function renderKoi() {
        const existing = scene.querySelectorAll('.ssn-kodomo-koi');
        existing.forEach(function(el){ el.remove(); });
        const scenH = 200;
        for (let i = 0; i < st.count; i++) {
          const isTop = (i === st.count - 1) && (st.count === MAX_KOI);
          const k = document.createElement('span');
          k.className = 'ssn-kodomo-koi' + (isTop ? ' top' : '');
          k.style.top = (scenH - 20 - i * 24) + 'px';
          k.style.animationDelay = (i * 0.15) + 's';
          k.textContent = '🎏';
          if (isTop) {
            const face = document.createElement('span');
            face.className = 'ssn-kodomo-face';
            face.textContent = '🐼';
            k.appendChild(face);
          }
          scene.appendChild(k);
        }
      }

      function updateCount() {
        countEl.textContent = st.count + '/' + MAX_KOI + 'ひき';
      }

      function updateMsg() {
        if (st.count >= MAX_KOI) {
          msgEl.textContent = 'おおぞらをおよぐパンダさんこいのぼり！🐼🎏';
          btn.disabled = true;
          btn.textContent = 'かんせい！';
        } else if (st.lastDay === ctx.todayKey) {
          msgEl.textContent = 'また明日、次のこいのぼりを揚げてね🎏';
          btn.disabled = true;
          btn.textContent = 'きょうはあげたよ';
        } else {
          msgEl.textContent = '';
          btn.disabled = false;
          btn.textContent = 'こいのぼりを揚げる';
        }
      }

      function onRaise() {
        if (st.count >= MAX_KOI) return;
        if (st.lastDay === ctx.todayKey) return;
        st.count++;
        st.lastDay = ctx.todayKey;
        save();
        renderKoi();
        updateCount();
        updateMsg();
        if (st.count >= MAX_KOI && typeof pandaRain === 'function') {
          try { pandaRain(40); } catch(e) {}
        }
      }

      btn.addEventListener('click', onRaise);

      renderKoi();
      updateCount();
      updateMsg();
    }
  };
})();
