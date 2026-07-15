(function(){
  'use strict';
  const KEY = 'meimei-ssn-hanami';
  const ALL_ITEMS = ['🍙','🍡','🌸','🍤','🥚','🥕','🎋','🍱','🍒'];

  window.MEIMEI_SEASONAL = {
    id: 'hanami',
    mount(ctx) {
      if(!document.getElementById('seasonal-style-hanami')){
        const st = document.createElement('style');
        st.id = 'seasonal-style-hanami';
        st.textContent = `
          .ssn-hanami-scene {
            position: relative;
            width: 100%;
            height: 140px;
            border-radius: 20px;
            margin: 14px 0;
            overflow: hidden;
            background: linear-gradient(180deg, #ffe0ec 0%, #ffd0e0 60%, #ffe8f0 100%);
          }
          .ssn-hanami-petal {
            position: absolute;
            top: -20px;
            font-size: 20px;
            line-height: 1;
            user-select: none;
            animation: ssn-hanami-fall linear infinite;
          }
          @keyframes ssn-hanami-fall {
            0%   { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0.95; }
            100% { transform: translateY(170px) translateX(14px) rotate(320deg); opacity: 0.6; }
          }
          .ssn-hanami-bento {
            text-align: center;
            font-size: 2.4rem;
            margin: 6px 0;
          }
          .ssn-hanami-okazu {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px;
            margin: 10px 0;
          }
          .ssn-hanami-okazu span {
            font-size: 1.7rem;
            animation: ssn-hanami-pop 0.5s ease-out;
          }
          @keyframes ssn-hanami-pop {
            0%   { transform: scale(0); opacity: 0; }
            70%  { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(1); }
          }
          .ssn-hanami-stamps {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 8px;
            margin: 10px 0;
            padding: 10px;
            background: rgba(255,255,255,0.4);
            border-radius: 14px;
          }
          .ssn-hanami-stamps span {
            font-size: 1.3rem;
            width: 34px;
            height: 34px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: rgba(255,255,255,0.6);
          }
          .ssn-hanami-stamps span.empty {
            opacity: 0.25;
            filter: grayscale(1);
          }
          .ssn-hanami-msg {
            text-align: center;
            font-size: 0.95rem;
            line-height: 1.8;
            color: #3a3a3a;
            margin-top: 8px;
          }
          @media (max-width: 480px) {
            .ssn-hanami-scene { height: 110px; }
          }
        `;
        document.head.appendChild(st);
      }

      let st;
      try { st = JSON.parse(localStorage.getItem(KEY)) || {}; } catch(e) { st = {}; }
      if (!Array.isArray(st.stamps)) st.stamps = [];
      if (typeof st.day !== 'string') st.day = '';

      function save() {
        try { localStorage.setItem(KEY, JSON.stringify(st)); } catch(e) {}
      }

      const card = ctx.card;
      card.innerHTML =
        '<h2>🌸 お花見 〜お花見弁当〜</h2>' +
        '<p style="font-size:0.95rem; line-height:1.9; color:#3a3a3a; text-align:center;">' +
          'パンダさんと一緒にお花見しよう。お弁当を広げておかずを見つけてね（1日1回）' +
        '</p>' +
        '<div class="ssn-hanami-scene" id="ssn-hanami-scene"></div>' +
        '<div class="ssn-hanami-bento">🧺</div>' +
        '<div style="text-align:center;"><button class="omikuji-btn" id="ssn-hanami-open">お弁当を広げる</button></div>' +
        '<div class="ssn-hanami-okazu" id="ssn-hanami-okazu"></div>' +
        '<p class="ssn-hanami-msg" id="ssn-hanami-msg"></p>' +
        '<div class="ssn-hanami-stamps" id="ssn-hanami-stamps"></div>';

      const scene = card.querySelector('#ssn-hanami-scene');
      const openBtn = card.querySelector('#ssn-hanami-open');
      const okazuEl = card.querySelector('#ssn-hanami-okazu');
      const msgEl = card.querySelector('#ssn-hanami-msg');
      const stampsEl = card.querySelector('#ssn-hanami-stamps');

      function spawnPetals(n) {
        for (let i = 0; i < n; i++) {
          const p = document.createElement('span');
          p.className = 'ssn-hanami-petal';
          p.textContent = '🌸';
          p.style.left = (Math.random() * 92) + '%';
          p.style.animationDuration = (3 + Math.random() * 2.5) + 's';
          p.style.animationDelay = (Math.random() * 3) + 's';
          scene.appendChild(p);
        }
      }
      spawnPetals(7);

      function renderStamps() {
        stampsEl.innerHTML = '';
        ALL_ITEMS.forEach(function(it) {
          const s = document.createElement('span');
          if (st.stamps.indexOf(it) !== -1) {
            s.textContent = it;
          } else {
            s.className = 'empty';
            s.textContent = it;
          }
          stampsEl.appendChild(s);
        });
      }

      function renderOpened() {
        openBtn.disabled = true;
        openBtn.textContent = 'ひろげたよ';
        if (Array.isArray(st.todayOkazu)) {
          okazuEl.innerHTML = '';
          st.todayOkazu.forEach(function(it) {
            const s = document.createElement('span');
            s.textContent = it;
            okazuEl.appendChild(s);
          });
        }
        if (st.stamps.length >= ALL_ITEMS.length) {
          msgEl.textContent = 'お花見マスター！パンダさんパワー満開🌸🌸';
        } else {
          msgEl.textContent = 'また明日もお弁当を広げてみてね🌿';
        }
      }

      function onOpen() {
        if (st.day === ctx.todayKey) return;
        const pool = ALL_ITEMS.slice();
        const picked = [];
        for (let i = 0; i < 3 && pool.length > 0; i++) {
          const idx = Math.floor(Math.random() * pool.length);
          picked.push(pool.splice(idx, 1)[0]);
        }
        st.day = ctx.todayKey;
        st.todayOkazu = picked;
        picked.forEach(function(it) {
          if (st.stamps.indexOf(it) === -1) st.stamps.push(it);
        });
        save();
        renderOpened();
        renderStamps();
        if (st.stamps.length >= ALL_ITEMS.length && typeof pandaRain === 'function') {
          try { pandaRain(40); } catch(e) {}
        }
      }

      openBtn.addEventListener('click', onOpen);

      if (st.day === ctx.todayKey) {
        renderOpened();
      } else {
        msgEl.textContent = '';
      }
      renderStamps();
    }
  };
})();
