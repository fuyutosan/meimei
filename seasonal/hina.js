(function(){
  'use strict';
  const KEY = 'meimei-ssn-hina';
  const DECOR = ['🎎', '🐼', '🐼', '🏮', '🌸', '🍑', '🍡'];
  const DECOR_LABEL = [
    'ひな人形', 'お内裏さまパンダさん', 'おひなさまパンダさん', 'ぼんぼり', 'さくら', 'もも', 'ひしもち'
  ];

  window.MEIMEI_SEASONAL = {
    id: 'hina',
    mount(ctx) {
      if(!document.getElementById('seasonal-style-hina')){
        const st = document.createElement('style');
        st.id = 'seasonal-style-hina';
        st.textContent = `
          .ssn-hina-dan {
            display: flex;
            flex-direction: column;
            gap: 6px;
            margin: 14px 0;
          }
          .ssn-hina-step {
            border-radius: 10px;
            min-height: 54px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            font-size: 30px;
          }
          .ssn-hina-step:nth-child(1) { background: linear-gradient(180deg, #e6413a, #c92f28); }
          .ssn-hina-step:nth-child(2) { background: linear-gradient(180deg, #d63a33, #b62923); }
          .ssn-hina-step:nth-child(3) { background: linear-gradient(180deg, #c6332d, #a4211c); }
          .ssn-hina-item {
            opacity: 0;
            transform: scale(0.3) translateY(10px);
            animation: ssn-hina-pop 0.5s ease-out forwards;
          }
          @keyframes ssn-hina-pop {
            0% { opacity: 0; transform: scale(0.3) translateY(10px); }
            70% { opacity: 1; transform: scale(1.2) translateY(-4px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
          }
          .ssn-hina-btn-row { text-align: center; margin-top: 6px; }
          .ssn-hina-msg {
            text-align: center;
            font-size: 0.95rem;
            line-height: 1.8;
            color: #3a3a3a;
            margin-top: 10px;
          }
          .ssn-hina-progress {
            text-align: center;
            font-size: 0.8rem;
            color: #057a10;
            margin-top: 4px;
          }
          @media (max-width: 480px) {
            .ssn-hina-step { font-size: 24px; min-height: 44px; }
          }
        `;
        document.head.appendChild(st);
      }

      let st;
      try { st = JSON.parse(localStorage.getItem(KEY)) || {}; } catch(e) { st = {}; }
      if (typeof st.count !== 'number') st.count = 0;

      function save() {
        try { localStorage.setItem(KEY, JSON.stringify(st)); } catch(e) {}
      }

      const card = ctx.card;
      card.innerHTML =
        '<h2>🎎 ひなまつり 〜パンダさんおひなさま〜</h2>' +
        '<p style="font-size:0.95rem; line-height:1.9; color:#3a3a3a; text-align:center;">' +
          '1日1個、ひな壇をかざっていこう🐼' +
        '</p>' +
        '<div class="ssn-hina-dan">' +
          '<div class="ssn-hina-step" id="ssn-hina-step0"></div>' +
          '<div class="ssn-hina-step" id="ssn-hina-step1"></div>' +
          '<div class="ssn-hina-step" id="ssn-hina-step2"></div>' +
        '</div>' +
        '<div class="ssn-hina-progress" id="ssn-hina-progress"></div>' +
        '<div class="ssn-hina-btn-row">' +
          '<button class="omikuji-btn" id="ssn-hina-decorate">かざる</button>' +
        '</div>' +
        '<p class="ssn-hina-msg" id="ssn-hina-msg"></p>';

      const steps = [
        card.querySelector('#ssn-hina-step0'),
        card.querySelector('#ssn-hina-step1'),
        card.querySelector('#ssn-hina-step2')
      ];
      const progress = card.querySelector('#ssn-hina-progress');
      const btn = card.querySelector('#ssn-hina-decorate');
      const msgEl = card.querySelector('#ssn-hina-msg');

      function stepForIndex(i) {
        // 7個を3段に配分: 段0=3, 段1=2, 段2=2
        if (i < 3) return 0;
        if (i < 5) return 1;
        return 2;
      }

      function render(animateLast) {
        steps.forEach(s => { s.innerHTML = ''; });
        for (let i = 0; i < st.count; i++) {
          const span = document.createElement('span');
          span.className = 'ssn-hina-item';
          span.textContent = DECOR[i];
          span.title = DECOR_LABEL[i];
          if (!animateLast || i < st.count - 1) {
            span.style.animation = 'none';
            span.style.opacity = '1';
            span.style.transform = 'none';
          }
          steps[stepForIndex(i)].appendChild(span);
        }
        progress.textContent = st.count + ' / ' + DECOR.length;
      }

      function decorate() {
        if (st.count >= DECOR.length) return;
        st.count++;
        st.lastDay = ctx.todayKey;
        save();
        render(true);
        if (typeof sparkleBurst === 'function') {
          try { sparkleBurst(steps[stepForIndex(st.count - 1)], 6); } catch(e) {}
        }
        if (st.count >= DECOR.length) {
          msgEl.textContent = 'みんなそろったよ！パンダさんパワーのひなまつり🐼🎎';
          btn.disabled = true;
          if (typeof pandaRain === 'function') {
            try { pandaRain(40); } catch(e) {}
          }
        } else {
          msgEl.textContent = DECOR_LABEL[st.count - 1] + 'をかざったよ🐼 また明日ね🐼';
          btn.disabled = true;
        }
      }

      render(false);

      if (st.count >= DECOR.length) {
        msgEl.textContent = 'みんなそろったよ！パンダさんパワーのひなまつり🐼🎎';
        btn.disabled = true;
      } else if (st.lastDay === ctx.todayKey) {
        msgEl.textContent = '今日はもうかざったよ。また明日ね🐼';
        btn.disabled = true;
      } else {
        btn.addEventListener('click', decorate);
      }
    }
  };
})();
