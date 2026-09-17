/* clock.js — 이미지 겹침 방식 실시간 시계 엔진 (프레임워크 불필요)
 * 사용: mountWatch(containerEl, config)
 *
 * 회전 바늘: 각 바늘은 자기 축(center)을 중심으로 회전.
 *   config.centers = { hour, minute, second, date }  (각각 {x,y} 0~1 비율)
 *   (구버전 호환) centers 없으면 dialCenter(시·분·초)/subCenter(date) 사용.
 *
 * 날짜 창(date window): 회전 대신 텍스트로 오늘 날짜 표시.
 *   config.dateWindow = { x, y, size, color, font, pad, align }
 *     x,y   창 중심 (0~1 비율) / size 글자크기 (이미지 폭 대비 비율)
 *     color 글자색(예 '#fff') / font 폰트 / pad true면 한자리도 '06' / align 기본 center
 *   (dateWindow가 있으면 hasDate와 무관하게 창 텍스트를 그림)
 *
 * 반환: { stop() }
 */
(function (global) {
  function ctr(cfg, hand) {
    if (cfg.centers && cfg.centers[hand]) return cfg.centers[hand];
    if (hand === 'date') return cfg.subCenter || { x: 0.5, y: 0.5 };
    return cfg.dialCenter || { x: 0.5, y: 0.5 };
  }

  function mountWatch(container, cfg) {
    container.innerHTML = '';
    const stage = document.createElement('div');
    stage.className = 'watch-stage';
    stage.style.cssText = 'position:relative;width:100%;aspect-ratio:1/1;user-select:none;';

    const Z = { body: 1, date: 2, hour: 3, minute: 4, second: 5 };
    const layers = {};
    ['body', 'date', 'hour', 'minute', 'second'].forEach(function (key) {
      if (key === 'date' && !cfg.hasDate) return;
      const img = document.createElement('img');
      img.src = cfg.base.replace(/\/$/, '') + '/' + key + '.png';
      img.alt = key; img.draggable = false;
      img.style.cssText =
        'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;will-change:transform;z-index:' + Z[key] + ';';
      if (key !== 'body') {
        const c = ctr(cfg, key);
        img.style.transformOrigin = (c.x * 100) + '% ' + (c.y * 100) + '%';
      }
      stage.appendChild(img); layers[key] = img;
    });

    // ── 날짜 창(텍스트) ──
    let dw = null, ro = null;
    if (cfg.dateWindow) {
      const w = cfg.dateWindow;
      dw = document.createElement('div');
      dw.className = 'date-window';
      dw.style.cssText =
        'position:absolute;left:' + (w.x * 100) + '%;top:' + (w.y * 100) + '%;' +
        'transform:translate(-50%,-50%);z-index:2;pointer-events:none;line-height:1;' +
        'text-align:' + (w.align || 'center') + ';color:' + (w.color || '#fff') + ';' +
        'font-family:' + (w.font || 'Arial, Helvetica, sans-serif') + ';' +
        'font-variant-numeric:lining-nums tabular-nums;';
      stage.appendChild(dw);
      // 글자 크기는 스테이지 폭에 비례 (반응형)
      const setSize = function () { dw.style.fontSize = ((w.size || 0.04) * stage.clientWidth) + 'px'; };
      setSize();
      if (window.ResizeObserver) { ro = new ResizeObserver(setSize); ro.observe(stage); }
      else window.addEventListener('resize', setSize);
    }

    container.appendChild(stage);

    const O = cfg.originAngle, dz = cfg.dateZero || 0, ds = cfg.dateStep || (360 / 31);
    let raf = 0, lastDate = -1;
    function frame() {
      const t = new Date();
      const sec = t.getSeconds() + t.getMilliseconds() / 1000;
      const secA = sec * 6;
      const minA = (t.getMinutes() + sec / 60) * 6;
      const hrA = ((t.getHours() % 12) + t.getMinutes() / 60 + sec / 3600) * 30;
      layers.hour.style.transform   = 'rotate(' + (hrA  - O.hour)   + 'deg)';
      layers.minute.style.transform = 'rotate(' + (minA - O.minute) + 'deg)';
      layers.second.style.transform = 'rotate(' + (secA - O.second) + 'deg)';
      if (layers.date) {
        const dA = dz + (t.getDate() - 1) * ds;
        layers.date.style.transform = 'rotate(' + (dA - O.date) + 'deg)';
      }
      if (dw && t.getDate() !== lastDate) {
        lastDate = t.getDate();
        dw.textContent = cfg.dateWindow.pad ? String(lastDate).padStart(2, '0') : String(lastDate);
      }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return { stop: function () { cancelAnimationFrame(raf); if (ro) ro.disconnect(); } };
  }

  global.mountWatch = mountWatch;
})(window);