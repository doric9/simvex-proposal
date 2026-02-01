# SIMVEX

**공학 교육을 위한 인터랙티브 3D 기계 부품 뷰어**

SIMVEX는 기계공학 학습자를 위한 웹 기반 3D 시각화 교육 플랫폼입니다. V4 엔진, 드론 등 다양한 기계 시스템의 조립/분해 과정을 인터랙티브하게 학습하고, AI 학습 도우미와 대화하며, 퀴즈로 학습 내용을 점검할 수 있습니다.

## 주요 기능

- **3D 기계 부품 뷰어** - WebGL 기반 인터랙티브 3D 모델 탐색
- **조립/분해 시뮬레이션** - 슬라이더를 통한 부드러운 분해 애니메이션
- **부품 정보 표시** - 부품 클릭 시 명칭, 재질, 기능 등 상세 정보 제공
- **AI 학습 도우미** - 기계 구조에 대한 질문과 답변
- **학습 노트** - 브라우저 내 노트 작성 및 저장
- **퀴즈 기능** - 학습 내용 점검을 위한 문제 풀이
- **PDF 내보내기** - 학습 자료를 PDF 문서로 저장
- **조립 순서 다이어그램** - 조립 워크플로우 시각화

## 지원 기계 시스템

| 기계 | 부품 수 | 퀴즈 |
|------|--------|------|
| V4 엔진 | 7개 | 5문제 |
| 드론 | 9개 | 5문제 |
| 로봇 암 | 준비 중 | - |
| 로봇 그리퍼 | 준비 중 | - |
| 서스펜션 | 준비 중 | - |
| 판 스프링 | 준비 중 | - |
| 기계 바이스 | 준비 중 | - |

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | React 18 + TypeScript + Vite |
| 3D 렌더링 | Three.js + React Three Fiber + Drei |
| UI 컴포넌트 | shadcn/ui + Tailwind CSS |
| 상태 관리 | Zustand |
| 데이터 저장 | Dexie.js (IndexedDB) |
| AI 통합 | OpenAI API (Vercel AI SDK) |
| PDF 생성 | jsPDF |
| 애니메이션 | React Spring + Framer Motion |

## 시작하기

### 요구 사항

- Node.js 18.0 이상
- npm 또는 yarn

### 설치

```bash
# 저장소 클론
git clone https://github.com/your-username/simvex.git
cd simvex

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 환경 변수 설정

AI 채팅 기능을 사용하려면 `.env.local` 파일을 생성하세요:

```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_OPENAI_MODEL=gpt-4o-mini
```

## 사용 방법

1. **기계 선택** - 상단 헤더에서 학습할 기계를 선택합니다
2. **3D 탐색** - 마우스로 회전, 확대/축소하여 모델을 탐색합니다
3. **분해 보기** - 좌측 하단 슬라이더로 조립/분해 상태를 조절합니다
4. **부품 선택** - 3D 모델에서 부품을 클릭하여 상세 정보를 확인합니다
5. **노트 작성** - 우측 패널의 '노트' 탭에서 학습 내용을 기록합니다
6. **AI 질문** - 'AI 채팅' 탭에서 기계에 대해 질문합니다
7. **퀴즈 풀기** - 상단의 퀴즈 버튼으로 학습 내용을 점검합니다
8. **PDF 저장** - 학습 자료를 PDF로 내보냅니다

## 프로젝트 구조

```
simvex/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui 컴포넌트
│   │   ├── layout/          # 레이아웃 (Header, Layout)
│   │   ├── viewer/          # 3D 뷰어 (Scene, ModelLoader)
│   │   ├── panels/          # 사이드 패널 (Info, Notes, Chat)
│   │   ├── quiz/            # 퀴즈 모달
│   │   ├── export/          # PDF 내보내기
│   │   ├── workflow/        # 조립 순서 모달
│   │   └── settings/        # 설정 모달
│   ├── stores/              # Zustand 상태 관리
│   ├── data/                # 기계/부품 데이터, 퀴즈
│   ├── lib/                 # 유틸리티, DB 설정
│   ├── types/               # TypeScript 타입 정의
│   └── styles/              # 전역 스타일
├── 3D Asset/                # GLB 3D 모델 파일
└── docs/                    # 기획 문서
```

## 스크립트

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview

# 린트 검사
npm run lint
```

## 브라우저 지원

- Chrome 90+
- Firefox 90+
- Safari 15+
- Edge 90+

WebGL 2.0을 지원하는 최신 브라우저에서 사용을 권장합니다.

## 라이선스

이 프로젝트는 교육 목적으로 개발되었습니다.

---

**SIMVEX** - 기계공학 학습의 새로운 경험
