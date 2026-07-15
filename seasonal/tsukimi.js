(function(){
  'use strict';
  const KEY = 'meimei-ssn-tsukimi';

  window.MEIMEI_SEASONAL = {
    id: 'tsukimi',
    mount(ctx) {
      if(!document.getElementById('seasonal-style-tsukimi')){
        const st = document.createElement('style');
        st.id = 'seasonal-style-tsukimi';
        st.textContent = `
          .ssn-tsukimi-wrap {
            position: relative;
            width: 100%;
            min-height: 220px;
            border-radius: 20px;
            margin: 14px 0;
            overflow: hidden;
            background: linear-gradient(180deg, #1b1f3a 0%, #2c2f57 55%, #3a3d6e 100%);
            box-shadow: inset 0 0 18px rgba(0,0,0,0.25);
            display: flex;
            flex-direction: column-reverse;
            align-items: center;
            padding: 10px 0;
          }
          .ssn-tsukimi-moon {
            position: absolute;
            top: 14px;
            right: 18px;
            font-size: 34px;
            filter: drop-shadow(0 0 8px rgba(255,255,200,0.6));
          }
          .ssn-tsukimi-dango {
            font-size: 34px;
            line-height: 1;
            animation: ssn-tsukimi-wobble 1.8s ease-in-out infinite;
            margin-bottom: -6px;
          }
          @keyframes ssn-tsukimi-wobble {
            0%, 100% { transform: rotate(-2deg); }
            50% { transform: rotate(2deg); }
          }
          .ssn-tsukimi-dango.falling {
            animation: ssn-tsukimi-fall 0.7s ease-in forwards;
          }
          @keyframes ssn-tsukimi-fall {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(140px) rotate(360deg); opacity: 0; }
          }
          .ssn-tsukimi-msg {
            text-align: center;
            font-size: 0.95rem;
            line-height: 1.8;
            color: #3a3a3a;
            margin-top: 10px;
          }
          .ssn-tsukimi-count {
            text-align: center;
            font-size: 0.85rem;
            color: #057a10;
            font-weight: 700;
            margin-top: 4px;
          }
          .ssn-tsukimi-btnrow {
            display: flex;
            justify-content: center;
            margin-top: 10px;
          }
          @media (max-width: 480px) {
            .ssn-tsukimi-wrap { min-height: 190px; }
            .ssn-tsukimi-dango { font-size: 28px; }
          }
        `;
        document.head.appendChild(st);
      }

      let st;
      try { st = JSON.parse(localStorage.getItem(KEY)) || {}; } catch(e) { st = {}; }
      if (st.day !== ctx.todayKey) { st = { day: ctx.todayKey, todayBest: 0, allBest: st.allBest || 0 }; }
      if (typeof st.allBest !== 'number') st.allBest = 0;
      if (typeof st.todayBest !== 'number') st.todayBest = 0;

      function save() {
        try { localStorage.setItem(KEY, JSON.stringify(st)); } catch(e) {}
      }

      const card = ctx.card;
      card.innerHTML =
        '<h2>🌕 お月見の会 〜お団子タワー〜</h2>' +
        '<p style="font-size:0.95rem; line-height:1.9; color:#3a3a3a; text-align:center;">' +
          '「つむ」を押してお団子をタワーにしよう。高く積むほど崩れやすいよ🐼' +
        '</p>' +
        '<div class="ssn-tsukimi-wrap" id="ssn-tsukimi-wrap"><span class="ssn-tsukimi-moon">🌕</span></div>' +
        '<div class="ssn-tsukimi-btnrow"><button class="omikuji-btn" id="ssn-tsukimi-btn">つむ</button></div>' +
        '<p class="ssn-tsukimi-count" id="ssn-tsukimi-count"></p>' +
        '<p class="ssn-tsukimi-msg" id="ssn-tsukimi-msg"></p>';

      const wrap = card.querySelector('#ssn-tsukimi-wrap');
      const btn = card.querySelector('#ssn-tsukimi-btn');
      const countEl = card.querySelector('#ssn-tsukimi-count');
      const msgEl = card.querySelector('#ssn-tsukimi-msg');

      let tower = 0;
      let busy = false;

      function updateCount() {
        countEl.textContent = 'いまの高さ：' + tower + 'だん　（今日の最高：' + st.todayBest + 'だん　歴代最高：' + st.allBest + 'だん）';
      }

      function collapseChance(n) {
        // 3段までは崩れない。以降1段ごとに約8%ずつ上昇（上限70%）
        if (n <= 3) return 0;
        return Math.min(0.08 * (n - 3), 0.7);
      }

      function collapseTower() {
        const dangos = wrap.querySelectorAll('.ssn-tsukimi-dango');
        dangos.forEach((d, i) => {
          setTimeout(() => { d.classList.add('falling'); }, i * 60);
        });
        setTimeout(() => {
          wrap.innerHTML = '<span class="ssn-tsukimi-moon">🌕</span>';
          msgEl.textContent = 'あちゃ〜！でも' + tower + 'だんはすごいよ🐼';
          tower = 0;
          busy = false;
        }, 900);
      }

      btn.addEventListener('click', () => {
        if (busy) return;
        const chance = collapseChance(tower + 1);
        if (Math.random() < chance) {
          busy = true;
          tower++;
          const d = document.createElement('div');
          d.className = 'ssn-tsukimi-dango';
          d.textContent = '🍡';
          wrap.appendChild(d);
          setTimeout(collapseTower, 300);
          return;
        }

        tower++;
        const d = document.createElement('div');
        d.className = 'ssn-tsukimi-dango';
        d.textContent = '🍡';
        wrap.appendChild(d);

        if (tower > st.todayBest) st.todayBest = tower;
        if (tower > st.allBest) st.allBest = tower;
        save();
        updateCount();

        if (tower > 10) {
          msgEl.textContent = 'お月さまに届きそう！パンダさんパワー！🐼';
          if (typeof pandaRain === 'function') {
            try { pandaRain(30); } catch(e) {}
          }
        } else {
          msgEl.textContent = '';
        }
      });

      updateCount();
    }
  };
})();
