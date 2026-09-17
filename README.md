# 포트폴리오용 랜덤 시계

새로고침/접속마다 등록된 시계 중 **랜덤 1점**이 실시간으로 움직입니다.

## 구조
```
watches/
├─ clock.js            공용 시계 엔진 (config 받아 렌더, 초침 스무스)
├─ watches.js          시계 목록(config 배열) — 여기에 시계 등록
├─ embed-example.html  포트폴리오에 넣을 최소 예제
├─ calibrate.html      새 시계 축·각도 보정 도구
└─ assets/
   ├─ jlc/    body / hour / minute / second / date .png   ← 시계1 (완성)
   ├─ watch2/ (준비되면 5장)
   └─ watch3/ (준비되면 5장)
```

## 포트폴리오에 심기
페이지에 이 부분만 넣으면 됩니다(경로는 실제 배치에 맞게):
```html
<div id="watchSlot" style="width:min(72vw,340px)"></div>
<script src="/watches/clock.js"></script>
<script src="/watches/watches.js"></script>
<script>
  var w = WATCHES[Math.floor(Math.random() * WATCHES.length)];
  mountWatch(document.getElementById('watchSlot'), w);
</script>
```
- 시계 크기 = 컨테이너 `width`로 조절(정사각 자동).
- 한 페이지에 여러 개도 가능: 컨테이너를 여러 개 두고 각각 `mountWatch` 호출.

## 로컬에서 열 때
분리형은 이미지가 상대경로라 **`file://` 더블클릭이면 이미지가 안 뜹니다.**
`watches/` 폴더에서 로컬 서버로 여세요:
```
python -m http.server
# → http://localhost:8000/embed-example.html
```
실제 웹서버(배포 환경)에 올리면 그냥 동작합니다.

## 새 시계(2·3점) 추가
1. `assets/watch2/` 에 5장 넣기 — **모두 같은 정사각 캔버스·같은 위치, 크롭 금지.** date 서브다이얼이 없으면 date.png 없이 4장 + `hasDate:false`.
2. `calibrate.html`(로컬 서버로) 열고 상단에서 그 시계 선택.
3. 활성 축(●)을 **드래그 / 화살표키**로 다이얼·서브다이얼 중심에 맞추고, '시간 고정'으로 특정 시각에 멈춰 각도(originAngle)를 눈금과 맞춤.
4. **config 복사** → `watches.js` 배열에 항목으로 붙여넣기.

## config 필드
| 필드 | 뜻 |
|---|---|
| `base` | 이미지 폴더 경로 |
| `hasDate` | date 서브다이얼 유무 |
| `centers` | **바늘별 개별 회전축** `{hour,minute,second,date}` 각각 `{x,y}` (이미지 대비 0~1 비율). 각 바늘이 자기 허브를 축으로 돔 |
| `originAngle` | 소스 이미지에서 각 바늘이 현재 가리키는 각(°, 12시=0, 시계방향) |
| `dateZero`, `dateStep` | date 1일 각도 / 하루당 각도(기본 360/31) |

> 세 바늘 허브가 편집 과정에서 미세하게 어긋날 수 있어 **바늘마다 축을 따로** 둡니다. `calibrate.html`에서 시/분/초/date를 각각 골라 맞추세요. (구버전 `dialCenter`/`subCenter`만 있는 config도 그대로 동작합니다.)

좌표를 **비율(0~1)** 로 저장하므로 이미지 해상도가 달라도 정렬이 유지됩니다.
