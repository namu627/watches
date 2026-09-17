/* watches.js — 포트폴리오에 노출할 시계 목록.
 * 새 시계 추가: assets/<폴더>/ 에 5장(body/hour/minute/second/date.png) 넣고
 * 아래 배열에 한 항목 추가 → 끝. (축·각도 값은 calibrate.html로 측정)
 *
 * 좌표계: 12시=0°, 시계방향. center들은 정사각 이미지 대비 0~1 비율.
 * centers = 바늘별 개별 회전축(허브 위치). 각 바늘이 자기 허브를 중심으로 돈다.
 * originAngle = "소스 이미지에서 각 바늘이 현재 가리키는 각(°)".
 */
const WATCHES = [
  {
    id: 'jlc-master-moon',
    name: 'Jaeger-LeCoultre Master Ultra Thin Moon',
    base: 'assets/jlc',
    hasDate: true,
    centers: {
      hour:   { x: 0.5010, y: 0.4336 },
      minute: { x: 0.5015, y: 0.4336 },
      second: { x: 0.5010, y: 0.4326 },
      date:   { x: 0.4998, y: 0.5185 }
    },
    originAngle: { hour: 302.91, minute: 52.28, second: 247.35, date: 200.91 },
    dateZero: 4,
    dateStep: 11.6129            // 360 / 31
  },

  {
    id: 'hamilton-khaki-field',
    name: 'Hamilton Khaki Field',
    base: 'assets/khaki',
    hasDate: false,           // date 서브다이얼 없으면 false (date.png 불필요)
    centers: {
      hour:   { x: 0.4807, y: 0.4689 },
      minute: { x: 0.4807, y: 0.4689 },
      second: { x: 0.4807, y: 0.4689 },
    },
    originAngle: { hour: 305.00, minute: 54.50, second: 221.77 }
  },

  {
    id: 'grand-seiko-sbgx261',
    name: 'Grand Seiko SBGX261',
    base: 'assets/gs',
    hasDate: false,           
    centers: {
      hour:   { x: 0.4822, y: 0.4268 },
      minute: { x: 0.4822, y: 0.4268 },
      second: { x: 0.4822, y: 0.4268 },
    },
    originAngle: { hour: 307.058, minute: 52.55, second: 252.20 },
     dateWindow: {                                    // 3시 방향 날짜 창 (오늘 날짜 텍스트)
      x: 0.6220, y: 0.4292,        // 창 중심 (calibrate로 맞추기)
      size: 0.028,             // 글자 크기 (이미지 폭 대비)
      color: '#ffffff',        // 흰 숫자 (검정 창 배경 위)
      font: 'Arial, Helvetica, sans-serif',  // 다이얼 숫자체와 비슷하게
      pad: false,              // true면 한 자리도 '06'
      align: 'center'
    }
  },
];

if (typeof module !== 'undefined') module.exports = WATCHES;
