(function(){
  'use strict';
  const KEY = 'meimei-ssn-christmas';
  const MAX_ORNAMENTS = 10;
  const ORNAMENTS = ['⭐', '🔔', '🎁', '❄️', '🍬', '💚'];

  window.MEIMEI_SEASONAL = {
    id: 'christmas',
    mount(ctx) {
      if(!document.getElementById('seasonal-style-christmas')){
        const st = document.createElement('style');
        st.id = 'seasonal-style-christmas';
        st.textContent = `
          .ssn-christmas-wrap {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 14px 0;
          }
          .ssn-christmas-tree {
            position: relative;
            width: 220px;
            height: 190px;
          }
          .ssn-christmas-star {
            position: absolute;
            top: -4px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 26px;
          }
          .ssn-christmas-star.lit {
            animation: ssn-christmas-glow 1.2s ease-in-out infinite;
            filter: drop-shadow(0 0 10px gold);
          }
          @keyframes ssn-christmas-glow {
            0%, 100% { filter: drop-shadow(0 0 4px gold); }
            50% { filter: drop-shadow(0 0 16px gold); }
          }
          .ssn-christmas-triangle {
            position: absolute;
            top: 24px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 110px solid transparent;
            border-right: 110px solid transparent;
            border-bottom: 160px solid;
            border-bottom-color: #1e7a2e;
            background: none;
          }
          .ssn-christmas-triangle::before {
            content: '';
            position: absolute;
            bottom: -160px;
            left: -110px;
            width: 0;
            height: 0;
            border-left: 110px solid transparent;
            border-right: 110px solid transparent;
            border-bottom: 160px solid rgba(80,200,120,0.35);
          }
          .ssn-christmas-trunk {
            position: absolute;
            bottom: -14px;
            left: 50%;
            transform: translateX(-50%);
            width: 22px;
            height: 16px;
            background: #7a4a2a;
            border-radius: 2px;
          }
          .ssn-christmas-slot {
            position: absolute;
            font-size: 22px;
            line-height: 1;
            animation: ssn-christmas-twinkle 1.6s ease-in-out infinite;
          }
          @keyframes ssn-christmas-twinkle {
            0%, 100% { opacity: 0.85; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.12); }
          }
          .ssn-christmas-picker {
            display: flex;
            justify-content: center;
            gap: 8px;
            flex-wrap: wrap;
            margin-top: 14px;
          }
          .ssn-christmas-pick {
            font-size: 26px;
            cursor: pointer;
            padding: 4px 6px;
            border-radius: 10px;
            transition: transform 0.15s;
            user-select: none;
            touch-action: manipulation;
          }
          .ssn-christmas-pick:hover { transform: scale(1.15); }
          .ssn-christmas-msg {
            text-align: center;
            font-size: 0.95rem;
            line-height: 1.8;
            color: #3a3a3a;
            margin-top: 10px;
          }
          .ssn-christmas-count {
            text-align: center;
            font-size: 0.85rem;
            color: #057a10;
            font-weight: 700;
            margin-top: 4px;
          }
          @media (max-width: 480px) {
            .ssn-christmas-tree { width: 180px; height: 156px; }
            .ssn-christmas-triangle { border-left-width: 90px; border-right-width: 90px; border-bottom-width: 132px; }
            .ssn-christmas-triangle::before { border-left-width: 90px; border-right-width: 90px; border-bottom-width: 132px; bottom: -132px; left: -90px; }
          }
        `;
        document.head.appendChild(st);
      }

      let st;
      try { st = JSON.parse(localStorage.getItem(KEY)) || {}; } catch(e) { st = {}; }
      if (!Array.isArray(st.ornaments)) st.ornaments = [];

      function save() {
        try { localStorage.setItem(KEY, JSON.stringify(st)); } catch(e) {}
      }

      const isXmasDay = typeof ctx.todayKey === 'string' && ctx.todayKey.indexOf('-12-25') !== -1;

      const card = ctx.card;
      card.innerHTML =
        '<h2>🎄 クリスマス 〜パンダさんツリー〜</h2>' +
        '<p style="font-size:0.95rem; line-height:1.9; color:#3a3a3a; text-align:center;">' +
          'オーナメントをえらんで、ツリーをかざろう（' + MAX_ORNAMENTS + 'こまで）🐼' +
        '</p>' +
        '<div class="ssn-christmas-wrap">' +
          '<div class="ssn-christmas-tree" id="ssn-christmas-tree">' +
            '<span class="ssn-christmas-star" id="ssn-christmas-star">⭐</span>' +
            '<div class="ssn-christmas-triangle"></div>' +
            '<div class="ssn-christmas-trunk"></div>' +
          '</div>' +
        '</div>' +
        '<div class="ssn-christmas-picker" id="ssn-christmas-picker"></div>' +
        '<p class="ssn-christmas-count" id="ssn-christmas-count"></p>' +
        '<p class="ssn-christmas-msg" id="ssn-christmas-msg"></p>';

      const tree = card.querySelector('#ssn-christmas-tree');
      const star = card.querySelector('#ssn-christmas-star');
      const picker = card.querySelector('#ssn-christmas-picker');
      const countEl = card.querySelector('#ssn-christmas-count');
      const msgEl = card.querySelector('#ssn-christmas-msg');

      // ツリーの空きスロット座標（三角形内におさまる目安の位置）
      const SLOTS = [
        { left: '50%', top: '46px' },
        { left: '38%', top: '66px' },
        { left: '62%', top: '66px' },
        { left: '28%', top: '92px' },
        { left: '50%', top: '92px' },
        { left: '72%', top: '92px' },
        { left: '20%', top: '120px' },
        { left: '42%', top: '120px' },
        { left: '58%', top: '120px' },
        { left: '80%', top: '120px' }
      ];

      function renderOrnaments() {
        tree.querySelectorAll('.ssn-christmas-slot').forEach((n) => n.remove());
        st.ornaments.forEach((emoji, i) => {
          const slot = SLOTS[i] || SLOTS[SLOTS.length - 1];
          const s = document.createElement('span');
          s.className = 'ssn-christmas-slot';
          s.textContent = emoji;
          s.style.left = slot.left;
          s.style.top = slot.top;
          s.style.animationDelay = (i * 0.15) + 's';
          tree.appendChild(s);
        });
      }

      function updateCount() {
        countEl.textContent = 'かざり：' + st.ornaments.length + '/' + MAX_ORNAMENTS + 'こ';
      }

      function updateMsg() {
        if (st.ornaments.length >= MAX_ORNAMENTS) {
          msgEl.textContent = 'メリークリスマス！パンダさんパワーのツリー完成🐼🎄';
        } else if (isXmasDay) {
          msgEl.textContent = '今日はクリスマス！ツリーのお星さまがキラキラだよ🐼';
        } else {
          msgEl.textContent = '';
        }
      }

      function renderPicker() {
        if (st.ornaments.length >= MAX_ORNAMENTS) {
          picker.innerHTML = '';
          return;
        }
        picker.innerHTML = '';
        ORNAMENTS.forEach((emoji) => {
          const b = document.createElement('span');
          b.className = 'ssn-christmas-pick';
          b.textContent = emoji;
          b.addEventListener('click', () => addOrnament(emoji));
          picker.appendChild(b);
        });
      }

      function addOrnament(emoji) {
        if (st.ornaments.length >= MAX_ORNAMENTS) return;
        st.ornaments.push(emoji);
        save();
        renderOrnaments();
        updateCount();
        updateMsg();
        renderPicker();
        if (st.ornaments.length >= MAX_ORNAMENTS && typeof pandaRain === 'function') {
          try { pandaRain(40); } catch(e) {}
        }
      }

      if (isXmasDay) {
        star.classList.add('lit');
      }

      renderOrnaments();
      updateCount();
      updateMsg();
      renderPicker();
    }
  };
})();
