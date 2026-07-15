(function(){
  'use strict';
  const KEY = 'meimei-ssn-valentine';
  const MESSAGES = [
    'いつも来てくれてありがとう。パンダさんパワーをちょこっとおすそわけ🐼',
    'あなたのこと、パンダさんはちゃんと見てるよ🐼',
    'がんばりすぎなくていいんだよ。今日もおつかれさま🐼',
    'ここに来てくれるだけで、パンダさんはうれしいんだ🐼',
    '甘いものと一緒に、ひとやすみしてね🐼',
    '今日のあなたに、めいっぱいの「よくやってるね」を🐼',
    'パンダさんパワー、ちょっとずつ充電していこうね🐼',
    'ちいさな一歩も、ちゃんと前進だよ🐼',
    'つかれた日も、来てくれてありがとう🐼',
    'あなたのペースでだいじょうぶだよ🐼',
    '笹よりちょっと甘い、パンダさんからの気持ちです🐼',
    'これからもよろしくね。パンダさんはずっと応援してるよ🐼'
  ];

  window.MEIMEI_SEASONAL = {
    id: 'valentine',
    mount(ctx) {
      if(!document.getElementById('seasonal-style-valentine')){
        const st = document.createElement('style');
        st.id = 'seasonal-style-valentine';
        st.textContent = `
          .ssn-valentine-wrap { text-align: center; }
          .ssn-valentine-gift {
            font-size: 60px;
            line-height: 1;
            margin: 14px auto;
            cursor: pointer;
            user-select: none;
            display: inline-block;
            transition: transform 0.15s ease;
          }
          .ssn-valentine-gift:active { transform: scale(0.92); }
          .ssn-valentine-gift.opening { animation: ssn-valentine-open 0.5s ease-out forwards; }
          @keyframes ssn-valentine-open {
            0% { transform: scale(1) rotate(0deg); }
            30% { transform: scale(1.2) rotate(-8deg); }
            60% { transform: scale(1.3) rotate(8deg); }
            100% { transform: scale(1.1) rotate(0deg); }
          }
          .ssn-valentine-msg {
            margin-top: 12px;
            font-size: 0.95rem;
            line-height: 1.9;
            color: #3a3a3a;
            min-height: 60px;
          }
          .ssn-valentine-shelf {
            margin-top: 16px;
            padding-top: 12px;
            border-top: 1px dashed #cfcfcf;
          }
          .ssn-valentine-shelf-title {
            font-size: 0.8rem;
            color: #057a10;
            margin-bottom: 6px;
          }
          .ssn-valentine-row {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            justify-content: center;
          }
          .ssn-valentine-choco {
            font-size: 22px;
          }
          @media (max-width: 480px) {
            .ssn-valentine-gift { font-size: 48px; }
          }
        `;
        document.head.appendChild(st);
      }

      let st;
      try { st = JSON.parse(localStorage.getItem(KEY)) || {}; } catch(e) { st = {}; }
      if (!Array.isArray(st.days)) st.days = [];

      function save() {
        try { localStorage.setItem(KEY, JSON.stringify(st)); } catch(e) {}
      }

      function msgForToday() {
        let n = 0;
        for (let i = 0; i < ctx.todayKey.length; i++) n += ctx.todayKey.charCodeAt(i);
        return MESSAGES[n % MESSAGES.length];
      }

      const card = ctx.card;
      card.innerHTML =
        '<h2>🍫 パンダさんからチョコ</h2>' +
        '<p style="font-size:0.95rem; line-height:1.9; color:#3a3a3a; text-align:center;">' +
          'つつみをタップして、今日のチョコを開けよう🐼' +
        '</p>' +
        '<div class="ssn-valentine-wrap">' +
          '<div class="ssn-valentine-gift" id="ssn-valentine-gift">🎁</div>' +
          '<div class="ssn-valentine-msg" id="ssn-valentine-msg"></div>' +
        '</div>' +
        '<div class="ssn-valentine-shelf">' +
          '<div class="ssn-valentine-shelf-title">これまでにもらったチョコ（' + st.days.length + '個）</div>' +
          '<div class="ssn-valentine-row" id="ssn-valentine-shelf"></div>' +
        '</div>';

      const gift = card.querySelector('#ssn-valentine-gift');
      const msgEl = card.querySelector('#ssn-valentine-msg');
      const shelf = card.querySelector('#ssn-valentine-shelf');

      function renderShelf() {
        shelf.innerHTML = '';
        st.days.forEach(() => {
          const c = document.createElement('span');
          c.className = 'ssn-valentine-choco';
          c.textContent = '💚';
          shelf.appendChild(c);
        });
      }

      function showOpened() {
        gift.textContent = '💚';
        gift.style.cursor = 'default';
        msgEl.textContent = st.lastMsg || msgForToday();
      }

      function open() {
        gift.removeEventListener('click', open);
        gift.classList.add('opening');
        setTimeout(() => {
          const m = msgForToday();
          st.days.push(ctx.todayKey);
          st.lastMsg = m;
          save();
          showOpened();
          renderShelf();
          if (typeof sparkleBurst === 'function') {
            try { sparkleBurst(gift, 8); } catch(e) {}
          }
        }, 500);
      }

      renderShelf();

      if (st.days.indexOf(ctx.todayKey) !== -1) {
        showOpened();
        msgEl.textContent += '　また明日あけてね🐼';
      } else {
        gift.addEventListener('click', open);
      }
    }
  };
})();
