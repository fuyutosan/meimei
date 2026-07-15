(function(){
  'use strict';
  const KEY = 'meimei-ssn-momiji';
  const MAX_DIGS = 3;
  const ITEMS = [
    { emoji: '🌰', text: 'くりみっけ！' },
    { emoji: '🍄', text: 'きのこがひょっこり' },
    { emoji: '🐿️', text: 'りすさんとばったり' },
    { emoji: '🐼', text: '落ち葉のなかからパンダさん！？' }
  ];
  const WEIGHTS = [0.4, 0.3, 0.22, 0.08];

  window.MEIMEI_SEASONAL = {
    id: 'momiji',
    mount(ctx) {
      if(!document.getElementById('seasonal-style-momiji')){
        const st = document.createElement('style');
        st.id = 'seasonal-style-momiji';
        st.textContent = `
          .ssn-momiji-field {
            position: relative;
            width: 100%;
            height: 150px;
            border-radius: 20px;
            margin: 14px 0;
            overflow: hidden;
            background: linear-gradient(180deg, #f6d9a0 0%, #e8a15a 60%, #c97a3c 100%);
            box-shadow: inset 0 0 18px rgba(90,40,0,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            gap: 4px;
            flex-wrap: wrap;
            padding: 8px;
          }
          .ssn-momiji-leaf {
            display: inline-block;
            animation: ssn-momiji-sway 2.4s ease-in-out infinite;
          }
          @keyframes ssn-momiji-sway {
            0%, 100% { transform: rotate(-6deg); }
            50% { transform: rotate(6deg); }
          }
          .ssn-momiji-field.digging .ssn-momiji-leaf {
            animation: ssn-momiji-scatter 0.7s ease-out forwards;
          }
          @keyframes ssn-momiji-scatter {
            0% { transform: translate(0,0) rotate(0deg); opacity: 1; }
            100% { transform: translate(var(--dx,20px), var(--dy,-30px)) rotate(180deg); opacity: 0; }
          }
          .ssn-momiji-found {
            font-size: 2rem;
            text-align: center;
            margin-top: 10px;
          }
          .ssn-momiji-msg {
            text-align: center;
            font-size: 0.95rem;
            line-height: 1.8;
            color: #3a3a3a;
            margin-top: 6px;
          }
          .ssn-momiji-count {
            text-align: center;
            font-size: 0.85rem;
            color: #057a10;
            font-weight: 700;
            margin-top: 4px;
          }
          .ssn-momiji-shelf {
            display: flex;
            justify-content: center;
            gap: 6px;
            flex-wrap: wrap;
            margin-top: 10px;
            font-size: 1.3rem;
          }
          .ssn-momiji-btnrow {
            display: flex;
            justify-content: center;
            margin-top: 10px;
          }
          @media (max-width: 480px) {
            .ssn-momiji-field { height: 120px; font-size: 32px; }
          }
        `;
        document.head.appendChild(st);
      }

      let st;
      try { st = JSON.parse(localStorage.getItem(KEY)) || {}; } catch(e) { st = {}; }
      if (st.day !== ctx.todayKey) { st = { day: ctx.todayKey, digs: 0, found: [] }; }
      if (typeof st.digs !== 'number') st.digs = 0;
      if (!Array.isArray(st.found)) st.found = [];

      function save() {
        try { localStorage.setItem(KEY, JSON.stringify(st)); } catch(e) {}
      }

      const card = ctx.card;
      card.innerHTML =
        '<h2>🍁 紅葉狩り 〜落ち葉のじゅうたん〜</h2>' +
        '<p style="font-size:0.95rem; line-height:1.9; color:#3a3a3a; text-align:center;">' +
          '落ち葉をかき集めて宝さがし（1日' + MAX_DIGS + 'かいまで）🐼' +
        '</p>' +
        '<div class="ssn-momiji-field" id="ssn-momiji-field"></div>' +
        '<div class="ssn-momiji-found" id="ssn-momiji-found"></div>' +
        '<div class="ssn-momiji-btnrow"><button class="omikuji-btn" id="ssn-momiji-btn">かき集める</button></div>' +
        '<p class="ssn-momiji-count" id="ssn-momiji-count"></p>' +
        '<p class="ssn-momiji-msg" id="ssn-momiji-msg"></p>' +
        '<div class="ssn-momiji-shelf" id="ssn-momiji-shelf"></div>';

      const field = card.querySelector('#ssn-momiji-field');
      const foundEl = card.querySelector('#ssn-momiji-found');
      const btn = card.querySelector('#ssn-momiji-btn');
      const countEl = card.querySelector('#ssn-momiji-count');
      const msgEl = card.querySelector('#ssn-momiji-msg');
      const shelfEl = card.querySelector('#ssn-momiji-shelf');

      const LEAVES = ['🍁', '🍂', '🍁', '🍂', '🍁'];

      function renderField() {
        field.classList.remove('digging');
        field.innerHTML = LEAVES.map((l) => '<span class="ssn-momiji-leaf">' + l + '</span>').join('');
      }

      function updateCount() {
        countEl.textContent = '今日：' + st.digs + '/' + MAX_DIGS + 'かい';
      }

      function updateShelf() {
        shelfEl.textContent = st.found.join(' ');
      }

      function pickItem() {
        const r = Math.random();
        let acc = 0;
        for (let i = 0; i < ITEMS.length; i++) {
          acc += WEIGHTS[i];
          if (r < acc) return ITEMS[i];
        }
        return ITEMS[0];
      }

      function finishedMsg() {
        msgEl.textContent = '今日はここまで。また明日紅葉狩りにこようね🐼';
      }

      btn.addEventListener('click', () => {
        if (st.digs >= MAX_DIGS) return;
        btn.disabled = true;
        field.classList.add('digging');
        const leaves = field.querySelectorAll('.ssn-momiji-leaf');
        leaves.forEach((l) => {
          l.style.setProperty('--dx', (Math.random() * 60 - 30) + 'px');
          l.style.setProperty('--dy', (-40 - Math.random() * 30) + 'px');
        });

        setTimeout(() => {
          const item = pickItem();
          foundEl.textContent = item.emoji + ' ' + item.text;
          st.digs++;
          st.found.push(item.emoji);
          save();
          updateCount();
          updateShelf();

          if (item.emoji === '🐼' && typeof sparkleBurst === 'function') {
            try { sparkleBurst(field, 8); } catch(e) {}
          }

          if (st.digs >= MAX_DIGS) {
            finishedMsg();
            btn.style.display = 'none';
          } else {
            renderField();
            btn.disabled = false;
          }
        }, 700);
      });

      updateCount();
      updateShelf();

      if (st.digs >= MAX_DIGS) {
        finishedMsg();
        btn.style.display = 'none';
        field.innerHTML = LEAVES.map((l) => '<span class="ssn-momiji-leaf">' + l + '</span>').join('');
      } else {
        renderField();
      }
    }
  };
})();
