(function(){
  'use strict';
  const KEY = 'meimei-ssn-meibday';
  const MAX_PER_DAY = 3;
  const STAMP_SET = ['💙','🎂','🐼','✨','🎉','🎈','🐘'];
  const ACCENT = '#0033A0';

  window.MEIMEI_SEASONAL = {
    id: 'meibday',
    mount(ctx) {
      if(!document.getElementById('seasonal-style-meibday')){
        const st = document.createElement('style');
        st.id = 'seasonal-style-meibday';
        st.textContent = `
          .ssn-meibday-title {
            text-align: center;
            border-bottom: 3px solid ${ACCENT};
            display: inline-block;
            padding-bottom: 2px;
            margin: 0 auto 6px;
          }
          .ssn-meibday-board {
            position: relative;
            width: 100%;
            min-height: 190px;
            border-radius: 20px;
            margin: 14px 0;
            overflow: hidden;
            background: linear-gradient(180deg, #f4f8ff 0%, #eaf1ff 100%);
            border: 2px dashed rgba(0,51,160,0.35);
          }
          .ssn-meibday-stamp {
            position: absolute;
            font-size: 1.9rem;
            animation: ssn-meibday-drop 0.4s ease-out;
            user-select: none;
          }
          @keyframes ssn-meibday-drop {
            0%   { transform: scale(0) rotate(0deg); opacity: 0; }
            70%  { transform: scale(1.25) rotate(var(--r, 0deg)); opacity: 1; }
            100% { transform: scale(1) rotate(var(--r, 0deg)); }
          }
          .ssn-meibday-tray {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px;
            margin: 10px 0;
          }
          .ssn-meibday-tray span {
            font-size: 1.5rem;
            padding: 6px 8px;
            border-radius: 12px;
            border: 2px solid ${ACCENT};
            cursor: pointer;
            background: rgba(255,255,255,0.6);
          }
          .ssn-meibday-tray span.used {
            opacity: 0.35;
            pointer-events: none;
            border-color: rgba(0,51,160,0.25);
          }
          .ssn-meibday-count {
            text-align: center;
            font-size: 0.85rem;
            color: ${ACCENT};
            font-weight: 700;
            margin-top: 4px;
          }
          .ssn-meibday-msg {
            text-align: center;
            font-size: 0.95rem;
            line-height: 1.8;
            color: #3a3a3a;
            margin-top: 8px;
          }
          .ssn-meibday-banner {
            text-align: center;
            font-size: 1.05rem;
            font-weight: 700;
            color: ${ACCENT};
            background: rgba(0,51,160,0.08);
            border-radius: 14px;
            padding: 10px;
            margin-bottom: 10px;
          }
          @media (max-width: 480px) {
            .ssn-meibday-board { min-height: 160px; }
          }
        `;
        document.head.appendChild(st);
      }

      let st;
      try { st = JSON.parse(localStorage.getItem(KEY)) || {}; } catch(e) { st = {}; }
      if (!Array.isArray(st.stamps)) st.stamps = [];
      if (typeof st.day !== 'string') st.day = '';
      if (typeof st.count !== 'number') st.count = 0;
      if (st.day !== ctx.todayKey) { st.day = ctx.todayKey; st.count = 0; }

      function save() {
        try { localStorage.setItem(KEY, JSON.stringify(st)); } catch(e) {}
      }

      const isBirthday = typeof ctx.todayKey === 'string' && ctx.todayKey.indexOf('-6-30') !== -1;

      const card = ctx.card;
      card.innerHTML =
        (isBirthday ? '<div class="ssn-meibday-banner">🎂お誕生日おめでとう！</div>' : '') +
        '<h2 class="ssn-meibday-title">💙 愛生ちゃんバースデーウィーク 〜お祝いボード〜</h2>' +
        '<p style="font-size:0.95rem; line-height:1.9; color:#3a3a3a; text-align:center;">' +
          '愛生ちゃんへ、お祝いスタンプをボードに貼ろう（1日' + MAX_PER_DAY + 'こまで）🐼' +
        '</p>' +
        '<div class="ssn-meibday-board" id="ssn-meibday-board"></div>' +
        '<p class="ssn-meibday-count" id="ssn-meibday-count"></p>' +
        '<div class="ssn-meibday-tray" id="ssn-meibday-tray"></div>' +
        '<p class="ssn-meibday-msg" id="ssn-meibday-msg"></p>';

      const board = card.querySelector('#ssn-meibday-board');
      const tray = card.querySelector('#ssn-meibday-tray');
      const countEl = card.querySelector('#ssn-meibday-count');
      const msgEl = card.querySelector('#ssn-meibday-msg');

      function renderBoard() {
        board.innerHTML = '';
        st.stamps.forEach(function(s) {
          const el = document.createElement('span');
          el.className = 'ssn-meibday-stamp';
          el.textContent = s.e;
          el.style.left = s.x + '%';
          el.style.top = s.y + '%';
          el.style.setProperty('--r', s.r + 'deg');
          el.style.transform = 'rotate(' + s.r + 'deg)';
          board.appendChild(el);
        });
      }

      function renderTray() {
        tray.innerHTML = '';
        STAMP_SET.forEach(function(e) {
          const el = document.createElement('span');
          el.textContent = e;
          if (st.count >= MAX_PER_DAY) el.classList.add('used');
          el.addEventListener('click', function() { onStamp(e); });
          tray.appendChild(el);
        });
      }

      function updateCount() {
        countEl.textContent = '今日：' + st.count + '/' + MAX_PER_DAY + 'こ　（るいけい：' + st.stamps.length + 'こ）';
      }

      function updateMsg() {
        if (st.count >= MAX_PER_DAY) {
          msgEl.textContent = '今日はここまで。また明日もお祝いしにきてね🐼';
        } else {
          msgEl.textContent = '';
        }
      }

      function onStamp(e) {
        if (st.count >= MAX_PER_DAY) return;
        st.stamps.push({
          e: e,
          x: 6 + Math.random() * 82,
          y: 6 + Math.random() * 76,
          r: Math.round(-18 + Math.random() * 36)
        });
        st.count++;
        save();
        renderBoard();
        renderTray();
        updateCount();
        updateMsg();
      }

      renderBoard();
      renderTray();
      updateCount();
      updateMsg();

      if (isBirthday && typeof pandaRain === 'function') {
        try { pandaRain(40); } catch(e) {}
      }
    }
  };
})();
