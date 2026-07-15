(function(){
  'use strict';
  const KEY = 'meimei-ssn-halloween';
  const RESULTS = [
    { emoji: '🍬', text: 'あめちゃんゲット！' },
    { emoji: '🍭', text: 'ぺろぺろキャンディだ！' },
    { emoji: '🍫', text: 'チョコレート、あたり〜！' },
    { emoji: '🎋', text: '笹スペシャル！パンダさんパワーの笹っぱ🐼' },
    { emoji: '🐼', text: 'わっ！おどかしちゃった笑' },
    { emoji: '🍪', text: 'クッキーみっけ！' },
    { emoji: '🍩', text: 'ドーナツ、まんまる〜' },
    { emoji: '🐼', text: 'いたずらパンダさんが変装してた〜🐼' }
  ];

  window.MEIMEI_SEASONAL = {
    id: 'halloween',
    mount(ctx) {
      if(!document.getElementById('seasonal-style-halloween')){
        const st = document.createElement('style');
        st.id = 'seasonal-style-halloween';
        st.textContent = `
          .ssn-halloween-doors {
            display: flex;
            justify-content: center;
            gap: 14px;
            margin: 16px 0;
            flex-wrap: wrap;
          }
          .ssn-halloween-door {
            width: 78px;
            height: 110px;
            border-radius: 10px 10px 4px 4px;
            background: linear-gradient(180deg, #6b3fa0 0%, #4a2a72 100%);
            border: 3px solid #2e1a48;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 34px;
            animation: ssn-halloween-sway 2.4s ease-in-out infinite;
            transition: transform 0.2s;
            user-select: none;
            touch-action: manipulation;
          }
          .ssn-halloween-door:hover { transform: scale(1.05); }
          .ssn-halloween-door.chosen {
            animation: ssn-halloween-open 0.6s ease-out forwards;
          }
          .ssn-halloween-door.dim { opacity: 0.35; animation: none; }
          @keyframes ssn-halloween-sway {
            0%, 100% { transform: rotate(-1.5deg); }
            50% { transform: rotate(1.5deg); }
          }
          @keyframes ssn-halloween-open {
            0% { transform: scale(1); }
            50% { transform: scale(1.15) rotate(3deg); }
            100% { transform: scale(1.05) rotate(0deg); }
          }
          .ssn-halloween-result {
            text-align: center;
            font-size: 1.4rem;
            margin-top: 12px;
          }
          .ssn-halloween-msg {
            text-align: center;
            font-size: 0.95rem;
            line-height: 1.8;
            color: #3a3a3a;
            margin-top: 8px;
          }
          .ssn-halloween-collection {
            display: flex;
            justify-content: center;
            gap: 6px;
            flex-wrap: wrap;
            margin-top: 10px;
            font-size: 1.3rem;
          }
          @media (max-width: 480px) {
            .ssn-halloween-door { width: 64px; height: 92px; font-size: 28px; }
          }
        `;
        document.head.appendChild(st);
      }

      let st;
      try { st = JSON.parse(localStorage.getItem(KEY)) || {}; } catch(e) { st = {}; }
      if (!Array.isArray(st.collection)) st.collection = [];
      if (st.day !== ctx.todayKey) { st.day = null; st.result = null; }
      // 保持: collectionは日をまたいで蓄積。dayとresultだけ当日分

      function save() {
        try { localStorage.setItem(KEY, JSON.stringify(st)); } catch(e) {}
      }

      const card = ctx.card;
      card.innerHTML =
        '<h2>🎃 トリック・オア・笹 〜おかしくじ〜</h2>' +
        '<p style="font-size:0.95rem; line-height:1.9; color:#3a3a3a; text-align:center;">' +
          '扉を1つえらんでね（1日1回）🐼' +
        '</p>' +
        '<div class="ssn-halloween-doors" id="ssn-halloween-doors"></div>' +
        '<div class="ssn-halloween-result" id="ssn-halloween-result"></div>' +
        '<p class="ssn-halloween-msg" id="ssn-halloween-msg"></p>' +
        '<div class="ssn-halloween-collection" id="ssn-halloween-collection"></div>';

      const doorsEl = card.querySelector('#ssn-halloween-doors');
      const resultEl = card.querySelector('#ssn-halloween-result');
      const msgEl = card.querySelector('#ssn-halloween-msg');
      const collectionEl = card.querySelector('#ssn-halloween-collection');

      function renderCollection() {
        if (st.collection.length === 0) { collectionEl.textContent = ''; return; }
        collectionEl.textContent = st.collection.join(' ');
      }

      function renderDone() {
        doorsEl.innerHTML = '';
        const r = st.result;
        resultEl.textContent = r ? (r.emoji + ' ' + r.text) : '';
        msgEl.textContent = 'また明日トリック・オア・笹！🐼';
        renderCollection();
      }

      function renderDoors() {
        doorsEl.innerHTML = '';
        for (let i = 0; i < 3; i++) {
          const d = document.createElement('div');
          d.className = 'ssn-halloween-door';
          d.textContent = '🚪';
          d.addEventListener('click', () => chooseDoor(d));
          doorsEl.appendChild(d);
        }
      }

      function chooseDoor(chosen) {
        const all = doorsEl.querySelectorAll('.ssn-halloween-door');
        all.forEach((d) => { if (d !== chosen) d.classList.add('dim'); });
        chosen.classList.add('chosen');

        const pick = RESULTS[Math.floor(Math.random() * RESULTS.length)];
        st.day = ctx.todayKey;
        st.result = pick;
        st.collection.push(pick.emoji);
        save();

        setTimeout(() => {
          chosen.textContent = pick.emoji;
          resultEl.textContent = pick.emoji + ' ' + pick.text;
          msgEl.textContent = 'また明日トリック・オア・笹！🐼';
          if (pick.emoji === '🐼' && typeof sparkleBurst === 'function') {
            try { sparkleBurst(chosen, 6); } catch(e) {}
          }
          renderCollection();
        }, 500);
      }

      if (st.day === ctx.todayKey && st.result) {
        renderDone();
      } else {
        renderDoors();
        renderCollection();
      }
    }
  };
})();
