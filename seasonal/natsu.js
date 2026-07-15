(function(){
  'use strict';
  const KEY = 'meimei-ssn-natsu';
  const MAX_CATCH = 5;
  const FISH = ['🐠','🐟','🐠','🐟','🐡'];

  window.MEIMEI_SEASONAL = {
    id: 'natsu',
    mount(ctx) {
      if(!document.getElementById('seasonal-style-natsu')){
        const st = document.createElement('style');
        st.id = 'seasonal-style-natsu';
        st.textContent = `
          .ssn-natsu-pond {
            position: relative;
            width: 100%;
            height: 190px;
            border-radius: 20px;
            margin: 14px 0;
            overflow: hidden;
            background: linear-gradient(180deg, #bfe8f5 0%, #8fd3ea 55%, #6fc0dd 100%);
            box-shadow: inset 0 0 18px rgba(0,60,90,0.15);
          }
          .ssn-natsu-fish {
            position: absolute;
            font-size: 30px;
            line-height: 1;
            cursor: pointer;
            user-select: none;
            padding: 6px;
            touch-action: manipulation;
            filter: drop-shadow(0 2px 2px rgba(0,0,0,0.15));
            animation: ssn-natsu-swim 3.6s ease-in-out infinite;
          }
          .ssn-natsu-fish.caught {
            animation: ssn-natsu-caught 0.6s ease-out forwards;
            pointer-events: none;
          }
          @keyframes ssn-natsu-swim {
            0%   { transform: translateX(0) scaleX(1); }
            48%  { transform: translateX(18px) scaleX(1); }
            50%  { transform: translateX(18px) scaleX(-1); }
            98%  { transform: translateX(0) scaleX(-1); }
            100% { transform: translateX(0) scaleX(1); }
          }
          @keyframes ssn-natsu-caught {
            0%   { transform: translateY(0) scale(1); opacity: 1; }
            40%  { transform: translateY(-30px) scale(1.3); opacity: 1; }
            100% { transform: translateY(-60px) scale(0.3); opacity: 0; }
          }
          .ssn-natsu-msg {
            text-align: center;
            font-size: 0.95rem;
            line-height: 1.8;
            color: #3a3a3a;
            margin-top: 8px;
          }
          .ssn-natsu-count {
            text-align: center;
            font-size: 0.85rem;
            color: #057a10;
            font-weight: 700;
            margin-top: 4px;
          }
          .ssn-natsu-float {
            position: absolute;
            font-size: 0.85rem;
            font-weight: 700;
            color: #057a10;
            pointer-events: none;
            animation: ssn-natsu-float-up 1s ease-out forwards;
          }
          @keyframes ssn-natsu-float-up {
            0%   { transform: translateY(0); opacity: 1; }
            100% { transform: translateY(-36px); opacity: 0; }
          }
          @media (max-width: 480px) {
            .ssn-natsu-pond { height: 160px; }
            .ssn-natsu-fish { font-size: 26px; }
          }
        `;
        document.head.appendChild(st);
      }

      let st;
      try { st = JSON.parse(localStorage.getItem(KEY)) || {}; } catch(e) { st = {}; }
      if (st.day !== ctx.todayKey) { st = { day: ctx.todayKey, caught: 0, total: st.total || 0 }; }
      if (typeof st.total !== 'number') st.total = 0;
      if (typeof st.caught !== 'number') st.caught = 0;

      function save() {
        try { localStorage.setItem(KEY, JSON.stringify(st)); } catch(e) {}
      }

      const card = ctx.card;
      card.innerHTML =
        '<h2>🍧 夏まつり 〜金魚すくい〜</h2>' +
        '<p style="font-size:0.95rem; line-height:1.9; color:#3a3a3a; text-align:center;">' +
          '池をのぞいて、金魚をタップしてすくってね（1日' + MAX_CATCH + 'ぴきまで）🐼' +
        '</p>' +
        '<div class="ssn-natsu-pond" id="ssn-natsu-pond"></div>' +
        '<p class="ssn-natsu-count" id="ssn-natsu-count"></p>' +
        '<p class="ssn-natsu-msg" id="ssn-natsu-msg"></p>';

      const pond = card.querySelector('#ssn-natsu-pond');
      const countEl = card.querySelector('#ssn-natsu-count');
      const msgEl = card.querySelector('#ssn-natsu-msg');

      function updateCount() {
        countEl.textContent = '今日：' + st.caught + '/' + MAX_CATCH + 'ぴき　（るいけい：' + st.total + 'ぴき）';
      }

      function updateMsg() {
        if (st.caught >= MAX_CATCH) {
          msgEl.textContent = '今日は大漁！パンダさんパワー満タンだね🐼';
        } else {
          msgEl.textContent = '';
        }
      }

      function finishedMsg() {
        msgEl.textContent = '今日はここまで。また明日すくいにきてね🐼';
      }

      function spawnFish(n) {
        for (let i = 0; i < n; i++) {
          const f = document.createElement('span');
          f.className = 'ssn-natsu-fish';
          f.textContent = FISH[Math.floor(Math.random() * FISH.length)];
          f.style.left = (8 + Math.random() * 78) + '%';
          f.style.top = (14 + Math.random() * 64) + '%';
          f.style.animationDuration = (2.8 + Math.random() * 1.8) + 's';
          f.style.animationDelay = (Math.random() * 1.5) + 's';
          f.addEventListener('click', onCatch);
          pond.appendChild(f);
        }
      }

      function onCatch(e) {
        if (st.caught >= MAX_CATCH) return;
        const f = e.currentTarget;
        if (f.classList.contains('caught')) return;
        f.classList.add('caught');
        f.removeEventListener('click', onCatch);

        const rect = f.getBoundingClientRect();
        const pondRect = pond.getBoundingClientRect();
        const float = document.createElement('span');
        float.className = 'ssn-natsu-float';
        float.textContent = 'すくえた！';
        float.style.left = (rect.left - pondRect.left) + 'px';
        float.style.top = (rect.top - pondRect.top) + 'px';
        pond.appendChild(float);
        setTimeout(() => float.remove(), 1000);

        if (typeof sparkleBurst === 'function') {
          try { sparkleBurst(f, 6); } catch(e2) {}
        }

        st.caught++;
        st.total++;
        save();
        updateCount();

        setTimeout(() => {
          f.remove();
          if (st.caught >= MAX_CATCH) {
            updateMsg();
            if (typeof pandaRain === 'function') {
              try { pandaRain(40); } catch(e3) {}
            }
            setTimeout(finishedMsg, 2600);
          } else {
            spawnFish(1);
          }
        }, 620);
      }

      updateCount();

      if (st.caught >= MAX_CATCH) {
        finishedMsg();
      } else {
        spawnFish(5 + Math.floor(Math.random() * 2));
        updateMsg();
      }
    }
  };
})();
