(function(){
  'use strict';
  const KEY = 'meimei-ssn-pandaweek';
  const TRIVIA = [
    'パンダさんのしっぽは、実は白いんだよ🐼',
    'パンダさんの前足は、指が7本あるように見えるんだって🐼',
    'パンダさんは1日に笹を10kg以上食べることもあるよ🐼',
    '赤ちゃんパンダさんは、生まれたとき150gくらいしかないんだ🐼',
    'パンダさんは木登りがとくい。子どものころからよく登るよ🐼',
    'パンダさんの体はほぼ白黒だけど、耳と目のまわりは黒いんだ🐼',
    'パンダさんは1日のうち多くの時間を食べることに使うよ🐼',
    'パンダさんは泳ぐこともできるんだって🐼',
    'パンダさんの鳴き声は「メェ〜」に近い声も出すんだよ🐼',
    'パンダさんはもともと肉食動物に近いグループなんだって🐼',
    'パンダさんの黒い模様は、雪の中でも仲間を見つけやすくするためかもって言われてるよ🐼',
    'パンダさんはひとりで過ごすのが好きな動物なんだ🐼'
  ];
  const SPECIAL = {
    emoji: '🌍',
    text: '世界パンダさんの日スペシャル！今日は特別な日だよ🐼🎉'
  };

  window.MEIMEI_SEASONAL = {
    id: 'pandaweek',
    mount(ctx) {
      if(!document.getElementById('seasonal-style-pandaweek')){
        const st = document.createElement('style');
        st.id = 'seasonal-style-pandaweek';
        st.textContent = `
          .ssn-pandaweek-wrap { text-align: center; }
          .ssn-pandaweek-card {
            width: 130px;
            height: 130px;
            margin: 14px auto;
            border-radius: 16px;
            background: linear-gradient(145deg, #079C15, #057a10);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            color: #fff;
            cursor: pointer;
            user-select: none;
            box-shadow: 0 4px 10px rgba(0,0,0,0.15);
            transition: transform 0.4s ease;
          }
          .ssn-pandaweek-card.flipped {
            transform: rotateY(180deg);
            cursor: default;
          }
          .ssn-pandaweek-inner {
            transition: transform 0.4s ease;
          }
          .ssn-pandaweek-card.flipped .ssn-pandaweek-inner {
            transform: rotateY(180deg);
          }
          .ssn-pandaweek-msg {
            font-size: 0.95rem;
            line-height: 1.9;
            color: #3a3a3a;
            margin-top: 8px;
            min-height: 60px;
            padding: 0 6px;
          }
          .ssn-pandaweek-shelf {
            margin-top: 16px;
            padding-top: 12px;
            border-top: 1px dashed #cfcfcf;
            text-align: left;
          }
          .ssn-pandaweek-shelf-title {
            font-size: 0.8rem;
            color: #057a10;
            margin-bottom: 6px;
            text-align: center;
          }
          .ssn-pandaweek-shelf-item {
            font-size: 0.82rem;
            color: #3a3a3a;
            line-height: 1.7;
          }
          @media (max-width: 480px) {
            .ssn-pandaweek-card { width: 110px; height: 110px; font-size: 32px; }
          }
        `;
        document.head.appendChild(st);
      }

      let st;
      try { st = JSON.parse(localStorage.getItem(KEY)) || {}; } catch(e) { st = {}; }
      if (!Array.isArray(st.opened)) st.opened = [];

      function save() {
        try { localStorage.setItem(KEY, JSON.stringify(st)); } catch(e) {}
      }

      const isSpecialDay = ctx.todayKey.indexOf('-3-16') !== -1;

      function nextIndex() {
        // 未取得のものから、日付に応じて選ぶ
        for (let i = 0; i < TRIVIA.length; i++) {
          if (st.opened.indexOf(i) === -1) return i;
        }
        return -1;
      }

      const card = ctx.card;
      card.innerHTML =
        '<h2>🐼 パンダさんウィーク 〜豆知識まつり〜</h2>' +
        '<p style="font-size:0.95rem; line-height:1.9; color:#3a3a3a; text-align:center;">' +
          '1日1枚、カードをめくってパンダさんの豆知識をゲットしよう🐼' +
        '</p>' +
        '<div class="ssn-pandaweek-wrap">' +
          '<div class="ssn-pandaweek-card" id="ssn-pandaweek-card">' +
            '<div class="ssn-pandaweek-inner">？</div>' +
          '</div>' +
          '<div class="ssn-pandaweek-msg" id="ssn-pandaweek-msg"></div>' +
        '</div>' +
        '<div class="ssn-pandaweek-shelf">' +
          '<div class="ssn-pandaweek-shelf-title">あつめた豆知識（' + st.opened.length + '/' + TRIVIA.length + '）</div>' +
          '<div id="ssn-pandaweek-shelf-list"></div>' +
        '</div>';

      const cardEl = card.querySelector('#ssn-pandaweek-card');
      const inner = card.querySelector('.ssn-pandaweek-inner');
      const msgEl = card.querySelector('#ssn-pandaweek-msg');
      const shelfList = card.querySelector('#ssn-pandaweek-shelf-list');

      function renderShelf() {
        shelfList.innerHTML = '';
        st.opened.forEach(i => {
          const div = document.createElement('div');
          div.className = 'ssn-pandaweek-shelf-item';
          div.textContent = '🐼 ' + TRIVIA[i];
          shelfList.appendChild(div);
        });
        if (st.special) {
          const div = document.createElement('div');
          div.className = 'ssn-pandaweek-shelf-item';
          div.textContent = SPECIAL.emoji + ' ' + SPECIAL.text;
          shelfList.appendChild(div);
        }
      }

      function showOpenedToday() {
        cardEl.classList.add('flipped');
        cardEl.style.cursor = 'default';
        if (st.special && st.lastDay === ctx.todayKey) {
          inner.textContent = SPECIAL.emoji;
          msgEl.textContent = SPECIAL.text + '　また明日めくってね🐼';
        } else {
          inner.textContent = '🐼';
          msgEl.textContent = TRIVIA[st.lastIdx] + '　また明日めくってね🐼';
        }
      }

      function flip() {
        cardEl.removeEventListener('click', flip);
        cardEl.classList.add('flipped');
        setTimeout(() => {
          if (isSpecialDay) {
            st.special = true;
            st.lastDay = ctx.todayKey;
            inner.textContent = SPECIAL.emoji;
            msgEl.textContent = SPECIAL.text;
          } else {
            const idx = nextIndex();
            const useIdx = idx === -1 ? Math.floor(Math.random() * TRIVIA.length) : idx;
            if (st.opened.indexOf(useIdx) === -1) st.opened.push(useIdx);
            st.lastIdx = useIdx;
            st.lastDay = ctx.todayKey;
            inner.textContent = '🐼';
            msgEl.textContent = TRIVIA[useIdx];
          }
          save();
          renderShelf();
          if (typeof sparkleBurst === 'function') {
            try { sparkleBurst(cardEl, 6); } catch(e) {}
          }
          card.querySelector('.ssn-pandaweek-shelf-title').textContent =
            'あつめた豆知識（' + st.opened.length + '/' + TRIVIA.length + '）';
        }, 400);
      }

      renderShelf();

      if (st.lastDay === ctx.todayKey) {
        showOpenedToday();
      } else {
        cardEl.addEventListener('click', flip);
      }

      if (st.opened.length >= TRIVIA.length && typeof pandaRain === 'function' && st.lastDay === ctx.todayKey && nextIndex() === -1) {
        try { pandaRain(30); } catch(e) {}
      }
    }
  };
})();
