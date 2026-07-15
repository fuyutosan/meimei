(function(){
  'use strict';
  const KEY = 'meimei-ssn-newyear';
  const FORTUNES = [
    { name: '大大吉', rare: true, msg: 'さいこうのはじまり！パンダさんパワーが満タンだよ🐼' },
    { name: '大吉', rare: false, msg: 'とってもいいスタート！今日はいいことありそう🐼' },
    { name: '吉', rare: false, msg: 'まずまず順調。のんびりいこう🐼' },
    { name: '中吉', rare: false, msg: 'じわじわ上向き。あせらずいこうね🐼' },
    { name: '小吉', rare: false, msg: 'ちいさな幸せがいっぱいの日だよ🐼' },
    { name: '末吉', rare: false, msg: 'これからよくなる予感。楽しみにしててね🐼' },
    { name: '笹吉', rare: true, msg: 'めずらしい笹吉！パンダさんも大よろこびだよ🐼🎋' }
  ];
  const WORDS = [
    '初笹', 'もちもちパンダさん', '笹まみれ', 'ぽかぽか肉球',
    'まんまる背中', 'ごろ寝日和', '笹どっさり', 'ゆるゆる歩き',
    'ぽてぽて足あと', '笹ふぶき', 'すやすやタイム', 'パンダさん日和'
  ];

  window.MEIMEI_SEASONAL = {
    id: 'newyear',
    mount(ctx) {
      if(!document.getElementById('seasonal-style-newyear')){
        const st = document.createElement('style');
        st.id = 'seasonal-style-newyear';
        st.textContent = `
          .ssn-newyear-wrap { text-align: center; }
          .ssn-newyear-box {
            font-size: 64px;
            line-height: 1;
            margin: 14px auto;
            cursor: pointer;
            user-select: none;
            display: inline-block;
            transition: transform 0.15s ease;
          }
          .ssn-newyear-box:active { transform: scale(0.94); }
          .ssn-newyear-box.shaking { animation: ssn-newyear-shake 0.5s ease-in-out 4; }
          @keyframes ssn-newyear-shake {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-14deg); }
            75% { transform: rotate(14deg); }
          }
          .ssn-newyear-result {
            margin-top: 10px;
            min-height: 120px;
          }
          .ssn-newyear-fortune {
            font-size: 1.6rem;
            font-weight: 800;
            color: #057a10;
            opacity: 0;
            transform: scale(0.6);
            animation: ssn-newyear-pop 0.5s ease-out forwards;
          }
          .ssn-newyear-fortune.rare { color: #b8860b; }
          @keyframes ssn-newyear-pop {
            0% { opacity: 0; transform: scale(0.4); }
            70% { opacity: 1; transform: scale(1.15); }
            100% { opacity: 1; transform: scale(1); }
          }
          .ssn-newyear-word {
            margin-top: 8px;
            font-size: 0.95rem;
            color: #3a3a3a;
          }
          .ssn-newyear-word b { color: #057a10; }
          .ssn-newyear-msg {
            margin-top: 10px;
            font-size: 0.9rem;
            line-height: 1.8;
            color: #3a3a3a;
          }
          @media (max-width: 480px) {
            .ssn-newyear-box { font-size: 52px; }
          }
        `;
        document.head.appendChild(st);
      }

      let st;
      try { st = JSON.parse(localStorage.getItem(KEY)) || {}; } catch(e) { st = {}; }

      function save() {
        try { localStorage.setItem(KEY, JSON.stringify(st)); } catch(e) {}
      }

      function wordForToday() {
        let n = 0;
        for (let i = 0; i < ctx.todayKey.length; i++) n += ctx.todayKey.charCodeAt(i);
        return WORDS[n % WORDS.length];
      }

      const card = ctx.card;
      card.innerHTML =
        '<h2>🎍 新春おみくじ豪華版</h2>' +
        '<p style="font-size:0.95rem; line-height:1.9; color:#3a3a3a; text-align:center;">' +
          'おみくじ箱をタップして今年の運勢を占おう🐼' +
        '</p>' +
        '<div class="ssn-newyear-wrap">' +
          '<div class="ssn-newyear-box" id="ssn-newyear-box">🎁</div>' +
          '<div class="ssn-newyear-result" id="ssn-newyear-result"></div>' +
        '</div>';

      const box = card.querySelector('#ssn-newyear-box');
      const result = card.querySelector('#ssn-newyear-result');

      function showResult() {
        const f = FORTUNES[st.resultIdx];
        const word = st.word;
        box.textContent = '🎋';
        box.style.cursor = 'default';
        result.innerHTML =
          '<div class="ssn-newyear-fortune' + (f.rare ? ' rare' : '') + '">' + f.name + '</div>' +
          '<div class="ssn-newyear-word">今年のラッキー笹ワード：<b>' + word + '</b></div>' +
          '<div class="ssn-newyear-msg">' + f.msg + '</div>' +
          '<div class="ssn-newyear-msg">また明日引けるよ🐼</div>';
      }

      function draw() {
        box.removeEventListener('click', draw);
        box.classList.add('shaking');
        setTimeout(() => {
          box.classList.remove('shaking');
          const idx = Math.floor(Math.random() * FORTUNES.length);
          const word = wordForToday();
          st = { day: ctx.todayKey, resultIdx: idx, word: word };
          save();
          showResult();
          const f = FORTUNES[idx];
          if (f.rare && typeof pandaRain === 'function') {
            try { pandaRain(40); } catch(e) {}
          }
        }, 500);
      }

      if (st.day === ctx.todayKey && typeof st.resultIdx === 'number') {
        showResult();
      } else {
        box.addEventListener('click', draw);
      }
    }
  };
})();
