(function(){
  'use strict';
  const KEY = 'meimei-ssn-setsubun';
  const MAX_HP = 3;
  const ONIS = [
    { id: 'shinpai', label: 'しんぱいオニ', emoji: '👹' },
    { id: 'fuan', label: 'ふあんオニ', emoji: '👹' },
    { id: 'mendou', label: 'めんどうオニ', emoji: '👹' }
  ];

  window.MEIMEI_SEASONAL = {
    id: 'setsubun',
    mount(ctx) {
      if(!document.getElementById('seasonal-style-setsubun')){
        const st = document.createElement('style');
        st.id = 'seasonal-style-setsubun';
        st.textContent = `
          .ssn-setsubun-field {
            position: relative;
            width: 100%;
            min-height: 210px;
            border-radius: 20px;
            margin: 14px 0;
            background: linear-gradient(180deg, #fff6e0 0%, #ffe9c2 100%);
            box-shadow: inset 0 0 18px rgba(120,80,0,0.12);
            display: flex;
            align-items: flex-end;
            justify-content: space-around;
            padding: 16px 8px;
            box-sizing: border-box;
          }
          .ssn-setsubun-oni {
            text-align: center;
            width: 30%;
          }
          .ssn-setsubun-face {
            font-size: 48px;
            line-height: 1;
            animation: ssn-setsubun-float 2.2s ease-in-out infinite;
          }
          .ssn-setsubun-oni.gone .ssn-setsubun-face {
            animation: none;
          }
          @keyframes ssn-setsubun-float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          .ssn-setsubun-label { font-size: 0.75rem; color: #3a3a3a; margin-top: 4px; }
          .ssn-setsubun-hp { font-size: 0.75rem; color: #b04a4a; margin-top: 2px; }
          .ssn-setsubun-oni.hit .ssn-setsubun-face { animation: ssn-setsubun-shake 0.3s ease; }
          @keyframes ssn-setsubun-shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-6px); }
            75% { transform: translateX(6px); }
          }
          .ssn-setsubun-pop {
            position: absolute;
            font-size: 28px;
            top: -20px;
            left: 50%;
            transform: translateX(-50%) scale(0.5);
            opacity: 0;
            animation: ssn-setsubun-pop-anim 0.7s ease-out forwards;
            pointer-events: none;
          }
          @keyframes ssn-setsubun-pop-anim {
            0% { opacity: 0; transform: translateX(-50%) scale(0.5); }
            40% { opacity: 1; transform: translateX(-50%) scale(1.3) translateY(-10px); }
            100% { opacity: 0; transform: translateX(-50%) scale(0.6) translateY(-40px); }
          }
          .ssn-setsubun-btn-row { text-align: center; margin-top: 10px; }
          .ssn-setsubun-msg {
            text-align: center;
            font-size: 0.95rem;
            line-height: 1.8;
            color: #3a3a3a;
            margin-top: 10px;
          }
          @media (max-width: 480px) {
            .ssn-setsubun-face { font-size: 38px; }
          }
        `;
        document.head.appendChild(st);
      }

      let st;
      try { st = JSON.parse(localStorage.getItem(KEY)) || {}; } catch(e) { st = {}; }
      if (st.day !== ctx.todayKey || !st.hp) {
        st = { day: ctx.todayKey, hp: { shinpai: MAX_HP, fuan: MAX_HP, mendou: MAX_HP }, cleared: false };
      }
      if (typeof st.cleared !== 'boolean') st.cleared = false;

      function save() {
        try { localStorage.setItem(KEY, JSON.stringify(st)); } catch(e) {}
      }

      const card = ctx.card;
      card.innerHTML =
        '<h2>👹 節分 〜こころのオニたいじ〜</h2>' +
        '<p style="font-size:0.95rem; line-height:1.9; color:#3a3a3a; text-align:center;">' +
          'こころの中の小さなオニに、豆をぶつけよう🫘' +
        '</p>' +
        '<div class="ssn-setsubun-field" id="ssn-setsubun-field"></div>' +
        '<div class="ssn-setsubun-btn-row">' +
          '<button class="omikuji-btn" id="ssn-setsubun-throw">🫘 豆をまく</button>' +
        '</div>' +
        '<p class="ssn-setsubun-msg" id="ssn-setsubun-msg"></p>';

      const field = card.querySelector('#ssn-setsubun-field');
      const throwBtn = card.querySelector('#ssn-setsubun-throw');
      const msgEl = card.querySelector('#ssn-setsubun-msg');

      function renderOnis() {
        field.innerHTML = '';
        ONIS.forEach(o => {
          const hp = st.hp[o.id];
          const wrap = document.createElement('div');
          wrap.className = 'ssn-setsubun-oni' + (hp <= 0 ? ' gone' : '');
          wrap.id = 'ssn-setsubun-oni-' + o.id;
          wrap.innerHTML =
            '<div class="ssn-setsubun-face">' + (hp <= 0 ? '⭐' : o.emoji) + '</div>' +
            '<div class="ssn-setsubun-label">' + o.label + '</div>' +
            '<div class="ssn-setsubun-hp">' + (hp <= 0 ? 'たいじ完了' : 'HP ' + hp) + '</div>';
          field.appendChild(wrap);
        });
      }

      function remaining() {
        return ONIS.filter(o => st.hp[o.id] > 0);
      }

      function allCleared() {
        return remaining().length === 0;
      }

      function finish() {
        st.cleared = true;
        save();
        msgEl.textContent = '福はうち！パンダさんパワーはうち！🐼';
        throwBtn.disabled = true;
        if (typeof pandaRain === 'function') {
          try { pandaRain(40); } catch(e) {}
        }
      }

      function throwBean() {
        if (st.cleared) return;
        const rest = remaining();
        if (rest.length === 0) { finish(); return; }
        const target = rest[Math.floor(Math.random() * rest.length)];
        st.hp[target.id]--;
        save();

        const oniEl = field.querySelector('#ssn-setsubun-oni-' + target.id);
        oniEl.classList.add('hit');
        const pop = document.createElement('div');
        pop.className = 'ssn-setsubun-pop';
        pop.textContent = st.hp[target.id] <= 0 ? 'ぽんっ！' : 'めいちゅう！';
        oniEl.appendChild(pop);
        setTimeout(() => pop.remove(), 700);
        setTimeout(() => oniEl.classList.remove('hit'), 300);

        setTimeout(() => {
          renderOnis();
          if (allCleared()) {
            finish();
          }
        }, 350);
      }

      throwBtn.addEventListener('click', throwBean);

      renderOnis();
      if (st.cleared) {
        msgEl.textContent = '福はうち！パンダさんパワーはうち！🐼 また明日あそぼうね🐼';
        throwBtn.disabled = true;
      } else {
        msgEl.textContent = '';
      }
    }
  };
})();
