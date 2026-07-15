(function(){
  'use strict';
  const KEY = 'meimei-ssn-ajisai';
  const MAX_DOLL = 16;
  const FACES = {
    niko: '😊',
    nemu: '😪',
    waku: '🤩'
  };
  const COLORS = {
    shiro: '#ffffff',
    mizu: '#bfe6f5',
    murasaki: '#ddc7ea'
  };

  window.MEIMEI_SEASONAL = {
    id: 'ajisai',
    mount(ctx) {
      if(!document.getElementById('seasonal-style-ajisai')){
        const st = document.createElement('style');
        st.id = 'seasonal-style-ajisai';
        st.textContent = `
          .ssn-ajisai-window {
            position: relative;
            width: 100%;
            min-height: 130px;
            border-radius: 20px;
            margin: 14px 0;
            padding: 20px 8px 6px;
            overflow: hidden;
            background: linear-gradient(180deg, #d7ecf7 0%, #eef8fb 100%);
          }
          .ssn-ajisai-bar {
            position: absolute;
            top: 8px;
            left: 6px;
            right: 6px;
            height: 4px;
            background: #8a9aa5;
            border-radius: 2px;
          }
          .ssn-ajisai-dolls {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px;
            padding-top: 10px;
          }
          .ssn-ajisai-doll {
            position: relative;
            width: 34px;
            display: flex;
            flex-direction: column;
            align-items: center;
            animation: ssn-ajisai-sway 2.8s ease-in-out infinite;
          }
          @keyframes ssn-ajisai-sway {
            0%, 100% { transform: rotate(-4deg); }
            50%      { transform: rotate(4deg); }
          }
          .ssn-ajisai-doll .ssn-ajisai-head {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 15px;
            box-shadow: inset -3px -3px 5px rgba(0,0,0,0.08);
            border: 1px solid rgba(0,0,0,0.08);
          }
          .ssn-ajisai-doll .ssn-ajisai-body {
            width: 18px;
            height: 22px;
            border-radius: 0 0 10px 10px;
            margin-top: -2px;
            border: 1px solid rgba(0,0,0,0.08);
          }
          .ssn-ajisai-panel {
            margin-top: 10px;
            text-align: center;
          }
          .ssn-ajisai-choices {
            display: flex;
            justify-content: center;
            gap: 8px;
            flex-wrap: wrap;
            margin: 8px 0;
          }
          .ssn-ajisai-choice {
            font-size: 1.3rem;
            padding: 6px 8px;
            border-radius: 10px;
            border: 2px solid transparent;
            background: rgba(255,255,255,0.5);
            cursor: pointer;
          }
          .ssn-ajisai-choice.selected {
            border-color: #057a10;
          }
          .ssn-ajisai-msg {
            text-align: center;
            font-size: 0.95rem;
            line-height: 1.8;
            color: #3a3a3a;
            margin-top: 8px;
          }
          @media (max-width: 480px) {
            .ssn-ajisai-window { min-height: 110px; }
          }
        `;
        document.head.appendChild(st);
      }

      let st;
      try { st = JSON.parse(localStorage.getItem(KEY)) || {}; } catch(e) { st = {}; }
      if (!Array.isArray(st.dolls)) st.dolls = [];
      if (typeof st.lastDay !== 'string') st.lastDay = '';

      function save() {
        try { localStorage.setItem(KEY, JSON.stringify(st)); } catch(e) {}
      }

      const card = ctx.card;
      card.innerHTML =
        '<h2>☔ あじさいの季節 〜てるてるパンダさん〜</h2>' +
        '<p style="font-size:0.95rem; line-height:1.9; color:#3a3a3a; text-align:center;">' +
          'かおと色をえらんで、てるてるパンダさんを窓辺につるそう（1日1体）' +
        '</p>' +
        '<div class="ssn-ajisai-panel" id="ssn-ajisai-panel"></div>' +
        '<p class="ssn-ajisai-msg" id="ssn-ajisai-msg"></p>' +
        '<div class="ssn-ajisai-window" id="ssn-ajisai-window"><div class="ssn-ajisai-bar"></div><div class="ssn-ajisai-dolls" id="ssn-ajisai-dolls"></div></div>';

      const panel = card.querySelector('#ssn-ajisai-panel');
      const msgEl = card.querySelector('#ssn-ajisai-msg');
      const dollsEl = card.querySelector('#ssn-ajisai-dolls');

      let selFace = null;
      let selColor = null;

      function renderDolls() {
        dollsEl.innerHTML = '';
        st.dolls.forEach(function(d, i) {
          const wrap = document.createElement('div');
          wrap.className = 'ssn-ajisai-doll';
          wrap.style.animationDelay = (i * 0.1) + 's';
          const head = document.createElement('div');
          head.className = 'ssn-ajisai-head';
          head.style.background = COLORS[d.c] || COLORS.shiro;
          head.textContent = FACES[d.f] || FACES.niko;
          const body = document.createElement('div');
          body.className = 'ssn-ajisai-body';
          body.style.background = COLORS[d.c] || COLORS.shiro;
          wrap.appendChild(head);
          wrap.appendChild(body);
          dollsEl.appendChild(wrap);
        });
      }

      function renderPanel() {
        if (st.lastDay === ctx.todayKey) {
          panel.innerHTML = '';
          msgEl.textContent = 'あしたは晴れるといいな〜🐼☀️';
          return;
        }
        panel.innerHTML =
          '<div class="ssn-ajisai-choices" id="ssn-ajisai-face-choices">' +
            Object.keys(FACES).map(function(k){
              return '<span class="ssn-ajisai-choice" data-face="' + k + '">' + FACES[k] + '</span>';
            }).join('') +
          '</div>' +
          '<div class="ssn-ajisai-choices" id="ssn-ajisai-color-choices">' +
            Object.keys(COLORS).map(function(k){
              return '<span class="ssn-ajisai-choice" data-color="' + k + '" style="background:' + COLORS[k] + ';">&nbsp;&nbsp;</span>';
            }).join('') +
          '</div>' +
          '<div style="text-align:center;"><button class="omikuji-btn" id="ssn-ajisai-make">つくる</button></div>';

        panel.querySelectorAll('[data-face]').forEach(function(el) {
          el.addEventListener('click', function() {
            panel.querySelectorAll('[data-face]').forEach(function(e2){ e2.classList.remove('selected'); });
            el.classList.add('selected');
            selFace = el.getAttribute('data-face');
          });
        });
        panel.querySelectorAll('[data-color]').forEach(function(el) {
          el.addEventListener('click', function() {
            panel.querySelectorAll('[data-color]').forEach(function(e2){ e2.classList.remove('selected'); });
            el.classList.add('selected');
            selColor = el.getAttribute('data-color');
          });
        });
        panel.querySelector('#ssn-ajisai-make').addEventListener('click', onMake);
        msgEl.textContent = '';
      }

      function onMake() {
        if (st.lastDay === ctx.todayKey) return;
        if (!selFace || !selColor) {
          msgEl.textContent = 'かおと色を、両方えらんでね🐼';
          return;
        }
        st.dolls.push({ f: selFace, c: selColor });
        if (st.dolls.length > MAX_DOLL) {
          st.dolls = st.dolls.slice(st.dolls.length - MAX_DOLL);
        }
        st.lastDay = ctx.todayKey;
        save();
        renderDolls();
        renderPanel();
      }

      renderDolls();
      renderPanel();
    }
  };
})();
