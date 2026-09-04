/* =========================================================================
   CENTRO AK — 옵션 상세 데이터 (centro-option- 컴포넌트 전용)
   - 카드와 상세 팝업은 반드시 이 배열의 동일 객체(id 매칭)를 사용합니다.
   - image: null 인 항목은 "옵션 이미지 준비 중" 플레이스홀더로 렌더링됩니다.
   - 공식 도면/CAD 렌더/합성 이미지/주석(라벨) 이미지/사진+일러스트 조합도
     실제 사양을 정확히 보여준다면 사용 가능합니다.
   ========================================================================= */
(function(global){
  "use strict";

  var CENTRO_OPTIONS = [

    /* ================= 안전 사양 (Safety) ================= */
    {
      id: "dual-airbag",
      category: "safety",
      catLabel: "Passive Safety",
      applicability: "기본 적용",
      title: "듀얼 에어백 &amp; 시트벨트 리마인더",
      isNew: false,
      summary: "운전석·조수석 듀얼 에어백과 전좌석 시트벨트 착용 알림을 기본 탑재했습니다.",
      description: "운전석·조수석에 에어백을 적용하여 탑승자를 안전하게 보호합니다. 또한 전좌석 시트벨트 리마인더로 모든 좌석의 시트벨트 착용 여부를 운전석에서 한눈에 확인할 수 있습니다.",
      features: [
        "운전석·조수석 동시 전개 구조",
        "충돌 감지 시 즉시 작동",
        "전좌석 시트벨트 착용 여부 실시간 표시"
      ],
      applicModel: "E-CV1 전 트림 기본 적용",
      image: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/airbags-dual-front.png",
      imageAlt: "E-CV1 운전석·조수석 듀얼 에어백 전개 모습, 대시보드와 스티어링 컬럼 사이 실내 뷰",
      objectPosition: "center",
      images: [
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/airbags-dual-front.png", alt: "듀얼 에어백 전개 클로즈업" },
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/seatbelt-reminder-cluster-icon.jpg", alt: "전좌석 시트벨트 리마인더, 좌석별 미착용 경고 아이콘 표시" }
      ]
    },
    {
      id: "body-panel-oneside",
      category: "safety",
      catLabel: "Body Panel",
      applicability: "기본 적용",
      title: "외판부 일체형, 외관 품질과 강성을 함께",
      isNew: false,
      summary: "측면 외판부 일체형 구조로 외관 완성도와 차체 강성을 동시에 확보했습니다.",
      description: "측면 외판부를 일체형으로 적용해 외관 품질을 개선하고 차체 강성을 증대하였습니다. 이음새를 최소화한 구조로 완성도 높은 측면 라인을 구현합니다.",
      features: [
        "측면 패널 일체형 적용",
        "이음새 최소화로 외관 품질 향상",
        "차체 강성 증대"
      ],
      applicModel: "E-CV1 전 트림 기본 적용",
      image: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/body-panel-side-window.jpg",
      imageAlt: "E-CV1 측면 외판부 일체형 구조, 도어와 윈도우 라인이 자연스럽게 이어지는 외관",
      objectPosition: "center",
      images: [
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/body-panel-side-window.jpg", alt: "측면 외판부 일체형 구조 실물 사진" },
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/body-side-panel.jpg", alt: "측면 외판 패널 구조 도면, 도어 프레임·필러·이음매 최소화 부위 표기" }
      ]
    },
    {
      id: "aeb-sensor-fusion",
      category: "safety",
      catLabel: "AEB Sensor Fusion",
      applicability: "기본 적용",
      title: "카메라+레이더 융합, 전방충돌방지보조",
      isNew: false,
      summary: "카메라와 레이더 이중 센서로 앞차와의 거리를 감지해 자동 제동을 보조합니다.",
      description: "전면 카메라가 전방의 형상을 인식하고, 레이더가 반사체를 감지하는 이중 센서 융합 방식으로 앞차와의 거리를 실시간으로 판단합니다. 충돌 위험이 감지되면 자동으로 제동을 보조합니다.",
      features: [
        "카메라 — 전방 형상 인식",
        "레이더 — 반사체(장애물) 감지",
        "충돌 위험 시 자동 제동 개입"
      ],
      applicModel: "E-CV1 전 트림 기본 적용",
      image: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/aeb-camera-radar-annotated.jpg",
      imageAlt: "E-CV1 전방충돌방지보조(AEB) 실차 평가 장면, 전방 모형 차량에 접근하는 모습",
      objectPosition: "center",
      images: [
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/aeb-camera-radar-annotated.jpg", alt: "AEB 실차 평가 장면" },
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/aeb-camera-radar-overlay2.jpg", alt: "카메라(형상 인식)·레이더(반사체 감지) 융합 원리 설명" }
      ]
    },
    {
      id: "pdc-rear-sensor",
      category: "safety",
      catLabel: "Parking Convenience",
      applicability: "편의 사양",
      title: "후방 주차 센서, 후진 주차가 편해집니다",
      isNew: false,
      summary: "후방 범퍼 센서가 장애물과의 거리를 실시간으로 감지해 후진 주차를 돕습니다.",
      description: "후방 범퍼에 장착된 주차 센서(PDC)가 후진 주차 시 뒤쪽 장애물과의 거리를 실시간으로 감지합니다. 거리가 가까워질수록 경고음이 빨라져 운전자가 안심하고 후진 주차할 수 있도록 편의를 제공합니다.",
      features: [
        "후진(R단) 시 자동 작동하는 후방 거리 감지",
        "장애물과의 거리에 따라 경고음 간격 변화",
        "후진 주차·좁은 골목 주행 시 편의성 향상"
      ],
      applicModel: "E-CV1 전 트림 기본 적용",
      image: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/pdc-illustration.jpg",
      imageAlt: "E-CV1 후방 주차 센서(PDC) 작동 원리, 후진 시 장애물과의 거리 감지 illustration",
      objectPosition: "center"
    },
    {
      id: "esc-stability",
      category: "safety",
      catLabel: "ESC",
      applicability: "기본 적용",
      title: "ESC 전자식 주행안정 시스템",
      isNew: false,
      summary: "커브·미끄러운 노면에서 4륜 제동력을 개별 제어해 주행 경로를 유지합니다.",
      description: "커브 구간이나 미끄러운 노면에서 차량이 원래 주행 경로를 벗어나려 할 때, 네 바퀴의 제동력을 개별로 제어해 안정적인 궤적을 유지하도록 돕습니다.",
      features: [
        "곡선 주행 시 경로 이탈 방지",
        "4륜 개별 제동력 제어",
        "미끄러운 노면에서도 안정적인 궤적 유지"
      ],
      applicModel: "E-CV1 전 트림 기본 적용",
      image: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/esc-cornering-illustration.jpg",
      imageAlt: "E-CV1 ESC 전자식 주행안정 시스템, 커브 구간 안정적 궤적 유지 illustration",
      objectPosition: "center"
    },
    {
      id: "hac-hill-assist",
      category: "safety",
      catLabel: "HAC",
      applicability: "기본 적용",
      title: "HAC, 경사로 언덕 밀림 방지 장치",
      isNew: false,
      summary: "오르막 정차 후 출발 시 브레이크에서 발을 떼도 차량이 밀리지 않게 잡아줍니다.",
      description: "HAC(Hill-start Assist Control, 경사로 언덕 밀림 방지 장치)는 오르막에 정차했다가 다시 출발할 때, 브레이크 페달에서 발을 떼더라도 차량이 뒤로 밀리지 않도록 일정 시간 동안 제동력을 자동으로 유지해주는 안전장치입니다. 물류·배송 등 언덕길 주정차가 많은 상용차 운행에 특히 유용합니다.",
      features: [
        "경사로 정차 후 브레이크에서 발을 떼도 약 3초간 제동력 유지",
        "오르막 출발 시 차량 밀림 방지로 안전한 재출발",
        "언덕길 주정차가 많은 물류·배송 차량에 특화"
      ],
      applicModel: "E-CV1 전 트림 기본 적용",
      image: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/body-panel-oneside-illustration.jpg",
      imageAlt: "E-CV1 HAC 경사로 언덕 밀림 방지 장치, 오르막 경사로에서 차량이 밀리지 않고 재출발하는 상황 illustration(경사 방향 화살표 표기)",
      objectPosition: "center"
    },
    {
      id: "bas-brake-assist",
      category: "safety",
      catLabel: "BAS · NEW",
      applicability: "NEW",
      title: "긴급 상황에서 더 짧게 멈춥니다",
      isNew: true,
      summary: "긴급제동보조(BAS)가 작은 힘으로도 최대 제동력을 적용해 정지거리를 줄입니다.",
      description: "긴급제동보조(BAS, Brake Assist System)는 급제동 시 제동력이 불충분한 경우, 작은 힘만으로도 최대 제동력을 적용하는 안전 사양입니다. 운전자가 브레이크 페달을 급하게 밟는 상황을 감지해 정지 거리를 줄여줍니다.",
      features: [
        "급제동 상황 자동 감지",
        "작은 힘만으로도 최대 제동력 적용",
        "정지거리 단축으로 2차 사고 예방"
      ],
      applicModel: "E-CV1 전 트림 기본 적용",
      image: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/bas-diagram.jpg",
      imageAlt: "E-CV1 긴급제동보조(BAS) 작동 유무 비교 illustration",
      objectPosition: "center"
    },
    {
      id: "ess-emergency-stop-signal",
      category: "safety",
      catLabel: "ESS",
      applicability: "기본 적용",
      title: "ESS, 비상제동신호",
      isNew: false,
      summary: "급제동 시 브레이크램프를 빠르게 점멸시켜 후행 차량에 위험 상황을 즉시 알립니다.",
      description: "ESS(Emergency Stop Signal, 비상제동신호)는 급제동 상황을 감지하면 브레이크램프(제동등)를 빠르게 점멸시켜 후행 차량 운전자에게 위험 상황을 즉시 알려주는 안전장치입니다. 후방 추돌 사고를 예방하는 데 효과적입니다.",
      features: [
        "급제동 상황 자동 감지",
        "브레이크램프 비상 점멸로 후행 차량에 위험 상황 경고",
        "후방 추돌 사고 예방"
      ],
      applicModel: "E-CV1 전 트림 기본 적용",
      image: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/tail-lamp-turnsignal-arrow.jpg",
      imageAlt: "E-CV1 ESS 비상제동신호, 급제동 시 브레이크램프 비상 점멸로 후행 차량에 경고",
      objectPosition: "center"
    },
    {
      id: "ebd-abs",
      category: "safety",
      catLabel: "EBD-ABS",
      applicability: "기본 적용",
      title: "EBD-ABS, 제동력 자동 배분",
      isNew: false,
      summary: "ABS와 EBD가 함께 작동해 급제동 시에도 바퀴 잠김 없이 안정적인 제동력을 배분합니다.",
      description: "ABS(Anti-lock Brake System)는 급제동 시 바퀴가 잠기는 것을 방지해 조향 능력을 유지시켜주고, EBD(Electronic Brake-force Distribution)는 하중 조건에 따라 앞뒤 바퀴에 제동력을 자동으로 배분합니다. 두 기술이 함께 작동해 다양한 노면과 적재 상태에서도 안정적인 제동 성능을 확보합니다.",
      features: [
        "ABS — 급제동 시 바퀴 잠김 방지, 조향 능력 유지",
        "EBD — 하중 조건별 앞뒤 제동력 자동 배분",
        "다양한 노면·적재 상태에서 안정적인 제동 성능"
      ],
      applicModel: "E-CV1 전 트림 기본 적용",
      image: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/brake-disc-caliper-product.jpg",
      imageAlt: "E-CV1 EBD-ABS 적용 디스크 브레이크 & 캘리퍼 실물",
      objectPosition: "center"
    },
    {
      id: "tpms",
      category: "safety",
      catLabel: "TPMS",
      applicability: "기본 적용",
      title: "TPMS, 타이어 공기압 실시간 감지",
      isNew: false,
      summary: "4개 타이어의 공기압을 실시간으로 감지해 클러스터 화면에 표시합니다.",
      description: "TPMS(Tire Pressure Monitoring System)는 4개 타이어 각각의 공기압을 실시간으로 감지해 슈퍼비전 클러스터 화면에 표시합니다. 공기압 이상이 감지되면 운전자에게 즉시 경고하여 타이어 관리와 주행 안전을 돕습니다.",
      features: [
        "4개 타이어 공기압 실시간 개별 표시",
        "공기압 이상 시 클러스터 경고",
        "타이어 관리·주행 안전성 향상"
      ],
      applicModel: "E-CV1 전 트림 기본 적용",
      image: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/supervision-cluster-tpms.jpg",
      imageAlt: "E-CV1 TPMS 타이어 공기압 실시간 표시 클러스터 화면",
      objectPosition: "center"
    },
    {
      id: "safety-cage-body",
      category: "safety",
      catLabel: "Body Structure",
      applicability: "기본 적용",
      title: "최고 수준의 초고장력강 차체 강성",
      isNew: false,
      summary: "루프 레일부터 필러, 서브프레임까지 초고장력강판을 적용해 승객 공간을 지킵니다.",
      description: "루프 레일부터 A·B·C 필러, 사이드 도어 프레임, 프론트 서브프레임까지 최고 수준의 초고장력강판을 적용해 가볍고 안전한 차체를 구현했습니다. 차체 강성과 안전성을 동시에 향상시킨 세이프티 케이지 구조로 충돌 시 승객 공간을 지켜냅니다.",
      features: [
        "최고 수준 초고장력강판 적용",
        "충돌 시 승객 생존 공간 확보",
        "세미 본넷 타입, 전방 충격 흡수 공간 확보"
      ],
      applicModel: "E-CV1 전 트림 기본 적용",
      image: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/body-in-white-diagram.jpg",
      imageAlt: "E-CV1 차체 골격(Body-in-White) 다이어그램, A·B·C 필러 및 루프 레일 구조",
      objectPosition: "center",
      images: [
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/body-in-white-diagram.jpg", alt: "차체 골격 필러 구조 다이어그램" },
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/safety-cage-3d-cad.jpg", alt: "세이프티 케이지 3D CAD 렌더링" }
      ]
    },
    {
      id: "seatbelt-3point",
      category: "safety",
      catLabel: "Seatbelt",
      applicability: "기본 적용",
      title: "3점식 안전벨트, 확실하게 고정합니다",
      isNew: false,
      summary: "어깨부터 골반까지 하중을 분산하는 3점식 안전벨트를 전 좌석에 적용했습니다.",
      description: "어깨부터 골반까지 하중을 분산하는 3점식 안전벨트를 전 좌석에 적용했습니다. 상단 앵커, 버클 텅, 리트렉터, 버클 베이스까지 4개 고정점이 탑승자를 안정적으로 지지합니다.",
      features: [
        "전 좌석 3점식 안전벨트 적용",
        "상체·하체 하중 분산 구조",
        "4개 고정점(앵커·버클·리트렉터) 설계"
      ],
      applicModel: "E-CV1 전 트림 기본 적용",
      image: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/rear-bench-seatbelt.jpg",
      imageAlt: "E-CV1 2열 벤치 시트, 3점식 안전벨트와 헤드레스트 실물 사진",
      objectPosition: "center",
      images: [
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/rear-bench-seatbelt.jpg", alt: "2열 시트 3점식 안전벨트 실물 사진" },
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/seatbelt-3point-diagram.jpg", alt: "3점식 안전벨트 고정점(앵커·버클·리트렉터) 구조도" }
      ]
    },
    {
      id: "cmdps-brake-disc",
      category: "safety",
      catLabel: "Chassis",
      applicability: "기본 적용",
      title: "전동식 파워 스티어링 &amp; 디스크 브레이크",
      isNew: false,
      summary: "C-MDPS 전동식 파워스티어링과 벤틸레이티드 디스크 브레이크로 조타감과 제동성능을 높였습니다.",
      description: "전동식 파워 스티어링(C-MDPS)을 적용해 지능형 안전 기술을 확대하고 차량 응답성과 조타감을 향상시켰습니다. 프론트에는 주행 시 발생하는 열에 강한 벤틸레이티드 디스크 브레이크를 적용해 빗길·눈길에서도 확실한 제동성능을 발휘합니다.",
      features: [
        "C-MDPS 전동식 파워 스티어링, 조타감·응답성 향상",
        "벤틸레이티드 디스크 브레이크(Front), 방열 성능 강화",
        "빗길·눈길에서도 확실한 제동성능"
      ],
      applicModel: "E-CV1 전 트림 기본 적용",
      image: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/steering-cmdps-brake-disc.jpg",
      imageAlt: "E-CV1 C-MDPS 전동식 파워 스티어링과 벤틸레이티드 디스크 브레이크",
      objectPosition: "center",
      images: [
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/steering-cmdps-brake-disc.jpg", alt: "C-MDPS 전동식 파워 스티어링 & 디스크 브레이크" },
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/steering-rack-illustration.jpg", alt: "C-MDPS 스티어링 랙 구조 illustration" }
      ]
    },
    {
      id: "suspension-front-rear",
      category: "safety",
      catLabel: "Suspension",
      applicability: "기본 적용",
      title: "전륜 맥퍼슨 스트럿 &amp; 후륜 리프 스프링",
      isNew: false,
      summary: "전륜 맥퍼슨 스트럿과 후륜 리프 스프링 일체 차축으로 핸들링과 승차감을 동시에 확보했습니다.",
      description: "전륜은 주행 안정성과 승차감이 우수한 맥퍼슨 스트럿 타입, 후륜은 리프 스프링 일체 차축 시스템을 적용했습니다. 다양한 도로조건에서 핸들링·조정 안정성이 우수하고 노면 충격을 다수의 링크로 분산해 승차감이 우수하며, 물류·배송에 적합한 서스펜션 타입으로 저상화까지 고려해 컴포트하고 안전한 주행 성능을 확보했습니다.",
      features: [
        "전륜 — 맥퍼슨 스트럿 타입, 핸들링·조정 안정성 우수",
        "후륜 — 리프 스프링 일체 차축 시스템, 녹방지 전착도장 적용",
        "물류·배송 적합, 저상화 최적 설계"
      ],
      applicModel: "E-CV1 전 트림 기본 적용",
      image: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/suspension-front.jpg",
      imageAlt: "E-CV1 전륜 맥퍼슨 스트럿 서스펜션 실물 사진",
      objectPosition: "center",
      images: [
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/suspension-front.jpg", alt: "전륜 맥퍼슨 스트럿 서스펜션" },
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/suspension-rear-leaf.jpg", alt: "후륜 리프 스프링 일체 차축 시스템" }
      ]
    },
    {
      id: "wheel-side-step",
      category: "safety",
      catLabel: "동급 최초",
      applicability: "동급 최초",
      title: "14인치 알루미늄 휠 &amp; 사이드 스텝",
      isNew: true,
      summary: "경량 EV전용 알루미늄 휠과 동급 최초 사이드 스텝으로 승하차 편의를 더했습니다.",
      description: "기존 VAN에 적용한 스틸 휠보다 무게가 가벼워 승차감과 연비가 좋은 EV전용 14인치 알루미늄 휠을 기본 적용했습니다. 스포크 디자인으로 무게의 짐을 버틸 수 있도록 설계했으며, 차량의 측면 이미지에 존재감을 더합니다. 도어 하단에는 동급 최초로 사이드 스텝을 적용해 어린이 및 노약자의 승하차를 돕는 보조 발판 역할을 합니다.",
      features: [
        "EV전용 14인치 알루미늄 휠, 경량화로 승차감·연비 향상",
        "스포크 디자인, 측면 존재감 강화",
        "사이드 스텝(동급 최초 적용), 어린이·노약자 승하차 보조"
      ],
      applicModel: "E-CV1 전 트림 기본 적용",
      image: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/wheel-alloy-tire.jpg",
      imageAlt: "E-CV1 14인치 알루미늄 휠 실물 클로즈업",
      objectPosition: "center",
      images: [
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/wheel-alloy-tire.jpg", alt: "14인치 알루미늄 휠 클로즈업" },
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/side-running-board.jpg", alt: "도어 하단 사이드 스텝 실물 사진" }
      ]
    },
    {
      id: "black-edition-wheel",
      category: "black-edition",
      catLabel: "Black Edition",
      applicability: "블랙 에디션 전용",
      title: "블랙 에디션 전용 알루미늄 휠",
      isNew: true,
      summary: "블랙 에디션 모델에서만 만나볼 수 있는 전용 블랙 알루미늄 휠입니다.",
      description: "유광 블랙 마감의 멀티 스포크 디자인 알루미늄 휠로, 블랙 에디션 모델에만 적용되는 전용 사양입니다. 기본 트림의 알루미늄 휠과 차별화된 스포티하고 강렬한 이미지를 완성합니다.",
      features: [
        "유광 블랙 마감, 멀티 스포크 디자인",
        "블랙 에디션 모델 전용 적용",
        "기본 트림 대비 차별화된 스포티한 이미지"
      ],
      applicModel: "E-CV1 Black Edition 전용",
      image: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/black-van-wheel.jpg",
      imageAlt: "E-CV1 Black Edition 전용 블랙 알루미늄 휠 클로즈업",
      objectPosition: "center"
    },

    /* ================= 배터리 & 성능 (Battery) ================= */
    {
      id: "catl-battery-pack",
      category: "battery",
      catLabel: "CATL LFP",
      applicability: "41.9kWh",
      title: "CATL LFP 41.9kWh 배터리 팩",
      isNew: false,
      summary: "전기차 배터리 세계 1위 CATL의 리튬인산철(LFP) 배터리를 차량 하부에 탑재했습니다.",
      description: "전기차 배터리 시장 세계 1위 CATL의 리튬인산철(LFP) 배터리 팩을 차량 하부에 탑재했습니다. 열 안정성이 높고 3,000~5,000회 이상의 반복 충·방전에도 성능 저하가 적어 매일 운행하는 상용차에 최적화되어 있습니다.",
      features: [
        "CATL LFP 41.9kWh 대용량 셀",
        "우수한 열 안정성·화재 안전성",
        "3,000~5,000회 이상 충·방전 수명"
      ],
      applicModel: "E-CV1 전 트림 기본 적용",
      image: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/catl-battery-pack-product.jpg",
      imageAlt: "E-CV1 CATL LFP 41.9kWh 배터리 팩 외관, 제품 앵글(3D 렌더)",
      objectPosition: "center",
      images: [
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/catl-battery-pack-product.jpg", alt: "CATL LFP 41.9kWh 배터리 팩 제품 앵글" },
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/catl-battery-pack-ceiling-view.jpg", alt: "CATL LFP 배터리 팩, 차량 하부 장착 시점 뷰" }
      ]
    },
    {
      id: "underbody-flatten",
      category: "battery",
      catLabel: "동급 최초",
      applicability: "동급 최초",
      title: "언더 바디 평탄화, 배터리를 지킵니다",
      isNew: true,
      summary: "언더커버와 배터리 평탄화로 에너지 손실과 하부 소음·이물질 노출을 최소화했습니다.",
      description: "언더커버 적용 및 고전압 배터리 평탄화로 평평한 언더 바디를 구현해 에너지 손실을 최소로 감소시켰습니다. 또한 하부에서 올라오는 소음과 이물질 노출을 최소화하여 하부를 보호하도록 설계하였습니다.",
      features: [
        "언더커버 적용 + 고전압 배터리 평탄화",
        "공기 저항·에너지 손실 최소화",
        "하부 소음·이물질 노출 최소화"
      ],
      applicModel: "E-CV1 전 트림 기본 적용",
      image: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/underbody-panel-blue.jpg",
      imageAlt: "E-CV1 언더 바디 평탄화 패널, 리프트 상태에서 바라본 하부 외관",
      objectPosition: "center"
    },
    {
      id: "supervision-cluster",
      category: "battery",
      catLabel: "Supervision Cluster",
      applicability: "4.2인치 TFT",
      title: "슈퍼비전 클러스터",
      isNew: false,
      summary: "4.2인치 컬러 TFT LCD로 배터리·전류·주행거리·타이어 공기압까지 한눈에 보여줍니다.",
      description: "입체적으로 형상화된 클러스터에 장착된 4.2인치 컬러 TFT LCD 모니터가 배터리 잔량, 전압·전류, 출력, 주행 가능 거리, 타이어 공기압까지 다양한 차량 정보를 컬러 문자와 이미지로 전달합니다. 컬러 LED를 적용하여 눈의 피로도도 줄여줍니다.",
      features: [
        "4.2인치 컬러 TFT LCD, 한국어/English 지원",
        "타이어 공기압 실시간 화면 표시(TPMS 연동)",
        "밝기·시간 등 사용자 설정 메뉴 제공"
      ],
      applicModel: "E-CV1 전 트림 기본 적용",
      image: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/supervision-cluster-dashboard.jpg",
      imageAlt: "E-CV1 슈퍼비전 클러스터, 4.2인치 컬러 TFT LCD 계기판 전체 화면(배터리·전력·속도·READY 표시)",
      objectPosition: "center"
    },

    /* ================= 외장 디자인 (Exterior) ================= */
    {
      id: "led-headlamp",
      category: "exterior",
      catLabel: "동급 유일 · 동급 최초",
      applicability: "동급 유일",
      title: "프로젝션 LED 헤드램프",
      isNew: true,
      summary: "가로형 프로젝션 풀 LED 헤드램프로 하이테크한 전면 이미지와 안정적 시계를 확보했습니다.",
      description: "새롭게 디자인된 가로형 프로젝션 FULL LED 헤드램프를 통해 하이테크한 전면부 이미지와 안정적인 주행 시계 확보를 하였습니다. LED 차폭등과 높이 조절이 가능한 상·하향등, LED DRL 겸용 턴시그널까지 동급 유일로 적용됩니다.",
      features: [
        "프로젝션 타입 LED 상·하향등(높이 조절 기능)",
        "LED 차폭등 + LED DRL 겸용 턴시그널",
        "가로형 풀 LED 디자인으로 하이테크 이미지 완성"
      ],
      applicModel: "E-CV1 전 트림 기본 적용",
      image: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/led-headlamp-projection-official.jpg",
      imageAlt: "E-CV1 프로젝션 LED 헤드램프 클로즈업",
      objectPosition: "center",
      images: [
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/led-headlamp-projection-official.jpg", alt: "프로젝션 LED 헤드램프 실물 클로즈업" },
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/headlamp-labeled-diagram.jpg", alt: "LED 차폭등·상하향등·DRL겸용 턴시그널 구성 설명(한글 라벨)" }
      ]
    },
    {
      id: "aero-wiper",
      category: "exterior",
      catLabel: "기본 적용",
      applicability: "기본 적용",
      title: "흔들림·들뜸을 최소화한 에어로 와이퍼",
      isNew: false,
      summary: "고속 주행에서도 안정적인 닦임과 정숙성을 갖춘 에어로 타입 와이퍼입니다.",
      description: "주행 시 흔들림과 들뜸을 최소화한 디자인으로 고속 주행에서도 우수한 닦임 성능과 소음방지 성능의 에어로 타입 와이퍼를 적용하였습니다.",
      features: [
        "고속 주행에서도 안정적인 닦임 성능",
        "소음방지 설계로 정숙성 향상",
        "흔들림·들뜸 최소화 구조"
      ],
      applicModel: "E-CV1 전 트림 기본 적용",
      image: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/rear-wiper-blade.jpg",
      imageAlt: "E-CV1 리어 에어로 와이퍼 클로즈업, 들뜸·흔들림 최소화 디자인",
      objectPosition: "center"
    },
    {
      id: "grille-mirror",
      category: "exterior",
      catLabel: "기본 적용",
      applicability: "기본 적용",
      title: "와이드하고 심플한 전면부 이미지",
      isNew: false,
      summary: "블랙&크롬 그릴과 바디컬러 사이드미러로 일체감 있는 심플한 전면 인상을 완성했습니다.",
      description: "램프와 라디에이터 그릴이 연결되어 와이드하고 심플한 전면부 이미지를 제공합니다. 사이드미러는 바디 컬러와 동일한 색상을 적용해 일체감을 주며, LED 턴시그널 램프를 탑재해 진행 방향을 주변 차량과 보행자에게 알려줍니다.",
      features: [
        "블랙&크롬 라디에이터 그릴 + AEB 레이더 커버 일체화",
        "바디 컬러 사이드미러",
        "LED 턴시그널 램프 탑재"
      ],
      applicModel: "E-CV1 전 트림 기본 적용",
      image: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/grille-aeb-radar-closeup.jpg",
      imageAlt: "E-CV1 블랙&크롬 라디에이터 그릴, AEB 레이더 커버 일체화 클로즈업",
      objectPosition: "center",
      images: [
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/grille-aeb-radar-closeup.jpg", alt: "블랙&크롬 라디에이터 그릴, AEB 레이더 커버 일체화 클로즈업" },
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/mirror-turn-signal.jpg", alt: "바디 컬러 사이드미러 LED 턴시그널 클로즈업" }
      ]
    },
    {
      id: "sliding-door-rail",
      category: "exterior",
      catLabel: "동급 최초",
      applicability: "동급 최초",
      title: "슬라이딩 도어 레일, 유지 보수를 강화하다",
      isNew: true,
      summary: "슬라이딩 도어 레일에 고무 코팅을 더해 부식을 방지하고 내구성을 높였습니다.",
      description: "슬라이딩 도어 레일에 고무 코팅을 한번 더 입혀 녹이 발생될 수 있는 부분을 방지하여 유지 보수 부분을 강화하였습니다.",
      features: [
        "슬라이딩 도어 레일 고무 코팅 적용",
        "녹 발생 방지로 유지 보수 부담 감소",
        "동급 최초 적용 사양"
      ],
      applicModel: "E-CV1 전 트림 기본 적용",
      image: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/door-rail-closeup2.jpg",
      imageAlt: "E-CV1 슬라이딩 도어 레일 고무 코팅 부위 클로즈업",
      objectPosition: "center"
    },
    {
      id: "push-open-charge-port",
      category: "exterior",
      catLabel: "기본 적용",
      applicability: "기본 적용",
      title: "푸쉬 오픈 충전구, 사용 편의성을 높이다",
      isNew: false,
      summary: "조수석 하단 푸쉬 오픈 타입 충전구로 개폐가 편리하고 고무 몰딩으로 안전합니다.",
      description: "조수석 하단에는 푸쉬 오픈 타입 충전구를 적용해 사용 편의성을 높였고, 충전구 테두리 고무 몰딩으로 손 부상 위험과 이물질 유입까지 방지합니다.",
      features: [
        "푸쉬 오픈 타입 충전구",
        "고무 몰딩 테두리, 손 부상·이물질 유입 방지",
        "조수석 하단 배치로 접근성 향상"
      ],
      applicModel: "E-CV1 전 트림 기본 적용",
      image: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/charging-port-user-photo.png",
      imageAlt: "E-CV1 조수석 하단 푸쉬 오픈 타입 충전구, 개방된 모습",
      objectPosition: "center"
    },
    {
      id: "led-plate-lamp",
      category: "exterior",
      catLabel: "동급 최초",
      applicability: "동급 최초",
      title: "LED 번호판 램프",
      isNew: true,
      summary: "소형 EV밴 최초로 LED 번호판 램프를 적용해 후면부 완성도를 높였습니다.",
      description: "LED 번호판 램프를 동급 최초로 적용해 클리어 타입 램프부 커버와 함께 후면부에 전기차에 어울리는 완성도를 확보했습니다.",
      features: [
        "LED 번호판 램프 적용(동급 최초)",
        "클리어 타입 램프부 커버",
        "야간 시인성 향상"
      ],
      applicModel: "E-CV1 전 트림 기본 적용",
      image: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/tailgate-led-plate-lamp.jpg",
      imageAlt: "E-CV1 테일게이트 LED 번호판 램프 실차 점등 모습",
      objectPosition: "center"
    },
    {
      id: "led-combo-lamp",
      category: "exterior",
      catLabel: "동급 최초",
      applicability: "동급 최초",
      title: "LED 리어 콤비네이션 램프",
      isNew: true,
      summary: "소형 EV VAN 최초로 LED 리어 콤비네이션 램프를 적용해 미래지향적 이미지를 완성했습니다.",
      description: "클리어 타입의 램프부 커버와 함께 소형 EV VAN 최초로 LED 리어 콤비네이션 램프를 적용하여 미래지향적이고 테크니컬한 이미지를 제공합니다.",
      features: [
        "LED 테일램프 & 제동등",
        "LED 턴시그널 + 후방 안개등(벌브) + 리플렉터",
        "소형 EV VAN 최초 적용"
      ],
      applicModel: "E-CV1 전 트림 기본 적용",
      image: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/tail-lamp-comparison-labeled.jpg",
      imageAlt: "E-CV1 LED 리어 콤비네이션 램프, 기존 램프와의 비교(LED 테일램프&제동등, LED 턴시그널, 후진등, 리플렉터 표기)",
      objectPosition: "center",
      images: [
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/tail-lamp-comparison-labeled.jpg", alt: "LED 리어 콤비네이션 램프 구성 비교(한글 라벨)" }
      ]
    },
    {
      id: "tailgate-garnish",
      category: "exterior",
      catLabel: "기본 적용",
      applicability: "기본 적용",
      title: "바디 컬러 테일게이트 가니쉬",
      isNew: false,
      summary: "바디 컬러 일체형 테일게이트 가니쉬로 고급감과 세련미를 더했습니다.",
      description: "바디 컬러 타입 일체형 테일게이트 가니쉬를 적용하여 고급감과 세련미를 향상시켰습니다.",
      features: [
        "바디 컬러 일체형 가니쉬",
        "후면 디자인 완성도 향상",
        "기본 적용 사양"
      ],
      applicModel: "E-CV1 전 트림 기본 적용",
      image: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/tailgate-garnish-plate.jpg",
      imageAlt: "E-CV1 바디 컬러 테일게이트 가니쉬, V 로고 엠블럼 클로즈업",
      objectPosition: "center"
    },
    {
      id: "rear-privacy-glass",
      category: "exterior",
      catLabel: "동급 최초",
      applicability: "동급 최초",
      title: "리어 프라이버시 &amp; 열선 글라스",
      isNew: true,
      summary: "동급 최초 프라이버시 글라스와 열선 기능으로 사생활 보호와 안정적 후방 시야를 확보했습니다.",
      description: "리어 글라스에는 차량 내부 개인정보 보호에 유리한 프라이버시 글라스를 동급 최초로 적용하고, 열선 기능까지 더해 비·눈이 오는 날 서리를 제거해 안정적인 후방 시야를 확보해 줍니다.",
      features: [
        "리어 프라이버시 글라스(동급 최초)",
        "열선 기능, 서리 제거로 후방 시야 확보",
        "우천·강설 시 안전 주행 보조"
      ],
      applicModel: "E-CV1 전 트림 기본 적용",
      image: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/rear-privacy-glass.jpg",
      imageAlt: "E-CV1 리어 프라이버시 글라스, 짙게 틴팅된 후면 유리",
      objectPosition: "center"
    },

    /* ================= 편의 사양 (Convenience) ================= */
    {
      id: "interior-design",
      category: "convenience",
      catLabel: "Interior Design",
      applicability: "DESIGN",
      title: "운전자와 동승자를 만족시키는 드라이빙 공간",
      isNew: false,
      summary: "수평형 레이아웃과 플로팅 디스플레이로 모던하고 개방감 있는 실내를 완성했습니다.",
      description: "수평형 레이아웃으로 실내 개방감을 강화하고 모던한 이미지를 구현했습니다. 플로팅 타입 디스플레이와 최적화된 조작계를 적용하여 심플하고 편리한 드라이빙 공간을 연출하고, 모던하고 미니멀한 디테일로 편의성을 갖춘 인테리어 디자인을 완성했습니다.",
      features: [
        "수평형 레이아웃, 실내 개방감 강화",
        "플로팅 타입 디스플레이 + 최적화된 조작계",
        "모던·미니멀한 디테일의 인테리어 디자인"
      ],
      applicModel: "E-CV1 전 트림 기본 적용",
      image: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/interior-design-overview.jpg",
      imageAlt: "E-CV1 실내 디자인 전체 개요, 운전석 대시보드와 슈퍼비전 클러스터",
      objectPosition: "center"
    },
    {
      id: "multimedia-10inch",
      category: "convenience",
      catLabel: "모두 기본 적용",
      applicability: "동급 최대",
      title: "플로팅 타입 10.1인치 멀티미디어 시스템",
      isNew: false,
      summary: "동급 최대 10.1인치 플로팅 멀티미디어에 카플레이·안드로이드오토까지 모두 기본 적용됩니다.",
      description: "새로운 GUI(그래픽 유저 인터페이스)를 적용해 시각적 즐거움을 더한 동급 최대 10.1인치 플로팅 타입 멀티미디어입니다. 후방 모니터, 블루투스 커넥션, 차량 기능 설정(AEB·DRIVE MODE·TPMS·HDC·저속경보음·ESC), 애플 카플레이/안드로이드 오토, USB 미디어, 라디오까지 모두 기본 적용됩니다.",
      features: [
        "10.1인치 LCD, 후방 모니터 연동",
        "애플 카플레이 · 안드로이드 오토 무선 지원",
        "차량 기능 설정(AEB·TPMS·HDC·ESC 등) 통합 제어"
      ],
      applicModel: "E-CV1 전 트림 기본 적용",
      image: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/android-auto-tablet.jpg",
      imageAlt: "E-CV1 대시보드에 탑재된 10.1인치 태블릿형 멀티미디어 화면",
      objectPosition: "center",
      images: [
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/android-auto-tablet.jpg", alt: "10.1인치 멀티미디어 화면 클로즈업" },
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/multimedia-tablet-2.jpg", alt: "10.1인치 멀티미디어, 한국어 UI 대시보드 장착 모습" }
      ]
    },
    {
      id: "gear-dial-switch",
      category: "convenience",
      catLabel: "모두 기본 적용",
      applicability: "기본 적용",
      title: "하이그로시 전자식 변속 다이얼 &amp; 컴비네이션 스위치",
      isNew: false,
      summary: "다이얼 타입 전자식 변속기와 오토라이트 컨트롤 통합 스위치로 편의성을 더했습니다.",
      description: "하이그로시 소재로 둘러싸 고급감을 연출하며 정교한 디테일이 돋보이는 다이얼 타입 전자식 변속기를 적용해 편안한 그립감과 고급감을 동시에 제공합니다. 승용 타입 컴비네이션 스위치에는 조도센서를 통해 광량을 감지해 자동으로 헤드램프를 ON/OFF 하는 오토라이트 컨트롤과 후방 안개등 스위치가 통합되어 있습니다.",
      features: [
        "다이얼 타입 전자식 변속기",
        "조도센서 연동 오토라이트 컨트롤",
        "와이퍼 컴비네이션 스위치 + 후방 안개등 스위치 통합"
      ],
      applicModel: "E-CV1 전 트림 기본 적용",
      image: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/gear-dial-combi-switch.jpg",
      imageAlt: "E-CV1 하이그로시 전자식 변속 다이얼과 컴비네이션 스위치 클로즈업",
      objectPosition: "center",
      images: [
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/gear-dial-combi-switch.jpg", alt: "하이그로시 전자식 변속 다이얼 실물 클로즈업" },
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/steering-column-stalks.jpg", alt: "오토라이트·와이퍼 컴비네이션 스위치 스토크 클로즈업" }
      ]
    },
    {
      id: "mirror-steering-remote",
      category: "convenience",
      catLabel: "모두 기본 적용",
      applicability: "기본 적용",
      title: "사이드미러 전동 조절 &amp; 3스포크 핸들 리모컨",
      isNew: false,
      summary: "전동 사이드미러 조절과 3스포크 핸들 오디오 리모컨으로 조작 편의성을 높였습니다.",
      description: "차량 실내에서 아웃사이드 미러의 각도를 세밀하게 조절할 수 있으며, 스위치 패널에는 헤드램프 높낮이 조절 스위치와 함께 유틸리티 모드 버튼, ESC OFF 버튼까지 통합되어 있습니다. 한국형 개발 모델에 알맞게 사이드미러에는 한글 각인이 된 유리를 적용했습니다. 견고한 그립이 가능한 3스포크 휠로 스포티한 이미지를 부각시켰고, 주행 중 오디오를 안전하게 조작할 수 있도록 스티어링 휠에 리모컨을 장착했습니다.",
      features: [
        "사이드미러 전동 조절 + 헤드램프 높낮이 조절 스위치",
        "유틸리티 모드 버튼 + ESC OFF 버튼 통합 스위치",
        "3스포크 핸들 + 오디오 리모컨 스위치"
      ],
      applicModel: "E-CV1 전 트림 기본 적용",
      image: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/steering-control-panel-mirror.jpg",
      imageAlt: "E-CV1 사이드미러 전동 조절 다이얼과 헤드램프 높낮이 조절 스위치",
      objectPosition: "center",
      images: [
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/steering-control-panel-mirror.jpg", alt: "사이드미러 전동 조절 다이얼 & 헤드램프 높낮이 조절 스위치" },
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/steering-wheel-3spoke-user-photo.jpg", alt: "3스포크 스티어링 휠 및 오디오 리모컨 버튼 실차 사진" }
      ]
    },
    {
      id: "engine-sound-usb",
      category: "convenience",
      catLabel: "모두 기본 적용",
      applicability: "기본 적용",
      title: "가상 엔진 사운드 &amp; 멀티미디어 입력단자",
      isNew: false,
      summary: "가상 엔진 사운드로 보행자 안전을 높이고, USB·시거라이터 단자를 갖췄습니다.",
      description: "엔진음이 없는 전기차가 접근하는 것을 보행자가 감지할 수 있도록 가상 엔진 사운드를 적용하여 보행자와의 충돌 위험을 저감시켜 줍니다. 대시보드에는 USB 음악·영상 및 안드로이드 오토·애플 카플레이용 멀티미디어 연결 단자와 2A 고속 충전 단자, 시거라이터를 갖췄습니다.",
      features: [
        "작동 조건: 차속 0~30km/h, N단 제외, R단 별도 알림음 추가",
        "USB 멀티미디어 연결 단자(음악·영상·안드로이드오토·애플카플레이)",
        "USB 충전 단자(2A) + 시거라이터"
      ],
      applicModel: "E-CV1 전 트림 기본 적용",
      image: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/virtual-engine-sound.jpg",
      imageAlt: "E-CV1 가상 엔진 사운드 발생 illustration, 저속 주행 시 보행자 알림음",
      objectPosition: "center",
      images: [
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/virtual-engine-sound.jpg", alt: "가상 엔진 사운드 illustration" },
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/usb-c-port.jpg", alt: "USB-C 및 USB 고속 충전 단자 클로즈업" },
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/usb-port-icon-diagram.jpg", alt: "USB 멀티미디어 연결 단자 아이콘" }
      ]
    },
    {
      id: "blackbox-apillar",
      category: "convenience",
      catLabel: "동급 최초",
      applicability: "동급 최초",
      title: "룸미러형 블랙박스 &amp; A필러 손잡이",
      isNew: true,
      summary: "전방 4K·후방 2K 룸미러형 블랙박스와 A필러 손잡이를 동급 최초로 기본 적용했습니다.",
      description: "주행 및 주차 중 전방/후방 카메라로 영상을 기록하고, 메모리카드에 저장된 파일을 컴퓨터로 확인할 수 있는 룸미러형 블랙박스를 동급 최초로 기본 적용했습니다. 전방 4K·후방 2K 카메라, 후진 시 후방 카메라 전환 기능을 지원합니다. 운전석·조수석 A필러에는 승·하차를 돕는 손잡이도 기본 적용됩니다.",
      features: [
        "전방 4K / 후방 2K 카메라, 후진 시 후방 카메라 자동 전환",
        "전용 APP WIFI 연결로 무선 영상 확인 · 상시/주행 중 녹화 설정",
        "A필러 손잡이(운전석/조수석) 기본 적용"
      ],
      applicModel: "E-CV1 전 트림 기본 적용",
      image: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/blackbox-mirror-display.jpg",
      imageAlt: "E-CV1 룸미러형 블랙박스, 전방·후방 화면 동시 표시",
      objectPosition: "center",
      images: [
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/blackbox-mirror-display.jpg", alt: "룸미러형 블랙박스 전방·후방 화면" },
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/blackbox-mirror-display-2.jpg", alt: "룸미러형 블랙박스 다른 각도" },
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/apillar-handles-pair.jpg", alt: "운전석·조수석 A필러 손잡이 비교" }
      ]
    },
    {
      id: "smart-key",
      category: "convenience",
      catLabel: "동급 최초",
      applicability: "동급 최초",
      title: "테슬라 타입 스마트키 시스템",
      isNew: true,
      summary: "리모컨 잠금해제 시 자동 KEY ON, 벨트+브레이크+D/R 전환만으로 시동이 켜집니다.",
      description: "테슬라 타입 스마트키 시스템을 도입하여 리모컨으로 차량 잠금을 해제할 시 자동으로 KEY ON이 작동되며, 안전벨트를 착용한 상태에서 브레이크를 밟고 전자식 변속 다이얼을 D 또는 R로 전환 시 시동이 켜집니다. 버튼으로 시동을 OFF할 수 있고, 시동이 켜지지 않은 KEY ON 상태에서도 메인 배터리에서 계속 충전해 에어컨·히터를 사용할 수 있어 보조 배터리 방전 걱정이 없습니다.",
      features: [
        "잠금해제 시 자동 KEY ON, 안전벨트+브레이크+D/R 전환으로 시동",
        "버튼 원터치 시동 OFF",
        "KEY ON 상태에서도 에어컨·히터 사용 가능(보조 배터리 방전 없음)"
      ],
      applicModel: "E-CV1 전 트림 기본 적용",
      image: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/smart-key-buttons.jpg",
      imageAlt: "E-CV1 테슬라 타입 스마트키 실물 사진, 잠금·잠금해제·경적 버튼",
      objectPosition: "center",
      images: [
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/smart-key-buttons.jpg", alt: "스마트키 버튼부 클로즈업" },
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/smart-key-logo.jpg", alt: "스마트키 브랜드 엠블럼 각인" }
      ]
    },
    {
      id: "interior-led-lighting",
      category: "convenience",
      catLabel: "기본 적용",
      applicability: "기본 적용",
      title: "1열 &amp; 적재함 LED 실내등",
      isNew: false,
      summary: "1열 지연소등 LED와 중앙 집중식 적재함 LED 실내등을 기본 적용했습니다.",
      description: "실내 오버헤드 콘솔과 적재함에 LED 실내등을 기본 적용하여 고급감을 향상시켰습니다. 1열에는 LED 2EA를 적용하고 지연 릴레이를 장착해 문을 닫고 잠갔을 경우 10초 후 실내등이 천천히 소등됩니다. 중앙 집중식 적재함 LED 실내등은 운전석에서도 ON/OFF 할 수 있습니다.",
      features: [
        "1열 LED 2EA + 지연 릴레이(문 잠금 10초 후 서서히 소등)",
        "중앙 집중식 적재함 LED 실내등",
        "운전석에서 ON/OFF 가능"
      ],
      applicModel: "E-CV1 전 트림 기본 적용",
      image: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/dome-light-front.jpg",
      imageAlt: "E-CV1 1열 오버헤드 콘솔 LED 실내등, 점등 모습",
      objectPosition: "center",
      images: [
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/dome-light-front.jpg", alt: "1열 LED 실내등 점등 모습" },
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/cargo-led-light.jpg", alt: "적재함 중앙 집중식 LED 실내등 점등 모습" }
      ]
    },
    {
      id: "tailgate-handle-switch",
      category: "convenience",
      catLabel: "동급 유일",
      applicability: "동급 유일",
      title: "테일게이트 손잡이 &amp; 실내 개폐 스위치",
      isNew: true,
      summary: "테일게이트 외부 손잡이와 동급 유일 실내 개폐 스위치로 편의성을 높였습니다.",
      description: "키가 작으신 분도 테일게이트를 편리하게 여닫을 수 있도록 손잡이를 적용하였으며, 실내에서도 테일게이트를 OPEN 할 수 있도록 스위치를 적용하였습니다.",
      features: [
        "테일게이트 외부 손잡이, 승하차 편의성 향상",
        "실내 테일게이트 개폐 스위치(동급 유일)",
        "누구나 쉽게 개폐 가능한 설계"
      ],
      applicModel: "E-CV1 전 트림 기본 적용",
      image: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/tailgate-handle-switch.jpg",
      imageAlt: "E-CV1 테일게이트 실내 개폐 스위치(비상 릴리스 루프)와 손잡이 스트랩 클로즈업",
      objectPosition: "center",
      images: [
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/tailgate-handle-switch.jpg", alt: "테일게이트 실내 개폐 스위치 및 그랩 스트랩" }
      ]
    },
    {
      id: "cargo-floor-hooks",
      category: "convenience",
      catLabel: "기본 적용",
      applicability: "기본 적용",
      title: "알루미늄 적재함 &amp; 고정 고리 4개",
      isNew: false,
      summary: "알루미늄 체크판 바닥재와 고정 고리 4개로 화물을 안전하고 편리하게 관리합니다.",
      description: "알루미늄 체크판 바닥재를 사용해 부식 방지와 미끄럼 방지 효과가 우수합니다. 바닥재를 평탄화해 캠핑 등 다목적 용도로도 편안한 실내 공간을 제공하며, 화물을 고정할 수 있는 고정 고리를 최대 4개(운전석/조수석 × 앞/뒤) 장착해 화물을 안전하게 보호합니다.",
      features: [
        "알루미늄 체크판 바닥재, 부식·미끄럼 방지",
        "적재함 평탄화, 캠핑 등 다목적 활용",
        "화물 고정 고리 최대 4개(운전석/조수석 × 앞/뒤)"
      ],
      applicModel: "E-CV1 전 트림 기본 적용",
      image: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/cargo-hooks-4grid.jpg",
      imageAlt: "E-CV1 적재함 화물 고정 고리 4개 위치(운전석/조수석 × 앞/뒤), 한글 라벨 표기",
      objectPosition: "center",
      images: [
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/cargo-hooks-4grid.jpg", alt: "화물 고정 고리 4개 위치 안내" },
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/cargo-floor-dimension.jpg", alt: "알루미늄 적재함 바닥재, 적재 공간 치수 표시" }
      ]
    },
    {
      id: "footrest-coilmat",
      category: "convenience",
      catLabel: "기본 적용",
      applicability: "기본 적용",
      title: "승용 타입 풋레스트 &amp; 확장형 코일매트",
      isNew: false,
      summary: "장거리 운행 피로를 줄이는 승용 타입 풋레스트와 흡수력 좋은 확장형 코일매트를 적용했습니다.",
      description: "오랜 시간 주행할 경우 운전자는 다리로부터 피로감을 많이 느낍니다. 작은 부분까지 세심하게 편의를 생각하는 E-CV1은 장거리 운행에 꼭 필요한 승용 타입의 풋레스트를 적용했습니다. 확장형 코일매트는 수십만 개의 UV코팅 컬구조로 오래 사용해도 발이 편안하며, 흙·먼지를 포집한 후 밖으로 내뱉지 않고, 비·눈·음료를 쏟아도 흡수 처리가 탁월합니다.",
      features: [
        "승용 타입 풋레스트, 장거리 운행 피로 저감",
        "순정 사이즈 확장형 코일매트, 난연성 PVC 소재",
        "흙·먼지·수분 흡수 처리 우수"
      ],
      applicModel: "E-CV1 전 트림 기본 적용",
      image: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/footrest-photo.jpg",
      imageAlt: "E-CV1 승용 타입 풋레스트, 운전석 페달 옆 실물 사진",
      objectPosition: "center",
      images: [
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/footrest-photo.jpg", alt: "승용 타입 풋레스트 실물 사진" },
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/coilmat-diagram.jpg", alt: "확장형 코일매트 순정 사이즈 기본형 다이어그램" },
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/coilmat-photo.jpg", alt: "코일매트 실물 사진" }
      ]
    },
    {
      id: "cup-holder-pocket",
      category: "convenience",
      catLabel: "기본 적용",
      applicability: "기본 적용",
      title: "2구 센터 컵홀더 &amp; 도어 포켓 컵홀더",
      isNew: false,
      summary: "2구 센터 컵홀더와 도어트림 포켓·컵홀더로 수납 편의성을 대폭 향상시켰습니다.",
      description: "주행 중 음료를 손쉽게 보관할 수 있도록 2구 센터 컵홀더를 적용하였습니다. 운전석·동승석 도어트림에도 포켓과 컵홀더를 적용해 수납공간의 편의성을 대폭 향상시켰습니다.",
      features: [
        "2구 센터 컵홀더",
        "운전석/동승석 도어트림 포켓 & 컵홀더",
        "수납 편의성 향상"
      ],
      applicModel: "E-CV1 전 트림 기본 적용",
      image: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/cup-holder-bottle.jpg",
      imageAlt: "E-CV1 2구 센터 컵홀더, 생수병 거치 모습",
      objectPosition: "center",
      images: [
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/cup-holder-bottle.jpg", alt: "2구 센터 컵홀더 실물 사진" },
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/door-pocket-cupholder.jpg", alt: "도어트림 포켓 & 컵홀더 실물 사진" }
      ]
    },
    {
      id: "sunvisor-bucket-seat",
      category: "convenience",
      catLabel: "동급 최초",
      applicability: "동급 최초",
      title: "동승석 선바이저 &amp; 버킷 스타일 인조가죽 시트",
      isNew: false,
      summary: "화장거울 내장 선바이저와 블랙&레드 버킷 스타일 인조가죽 시트를 적용했습니다.",
      description: "전면 또는 측면 유리창을 통해 들어오는 직사광선을 차단하는 동승석 선바이저에는 화장거울이 내장되어 있습니다. 블랙&레드 투톤 컬러의 버킷 스타일 인조가죽 시트는 젊은 이미지를 부각시켰으며, 인조가죽 소재로 손상·오염에 강하고 부드럽고 편안한 착좌감을 제공합니다. 고속 주행이나 급회전 시에도 몸을 안정감 있게 지탱해줍니다.",
      features: [
        "동승석 선바이저(화장거울 내장)",
        "버킷 스타일 인조가죽 시트, 블랙&레드 투톤(동급 최초)",
        "고속 주행·급회전 시에도 안정적인 착좌감"
      ],
      applicModel: "E-CV1 전 트림 기본 적용",
      image: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/sunvisor-airbag-mirror.jpg",
      imageAlt: "E-CV1 동승석 선바이저, 화장거울 내장 모습",
      objectPosition: "center",
      images: [
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/sunvisor-airbag-mirror.jpg", alt: "동승석 선바이저(화장거울 내장) 실물 사진" },
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/seat-bolster-highlight.jpg", alt: "버킷 스타일 시트 사이드 볼스터 강조 사진" }
      ]
    },
    {
      id: "armrest-sliding-seat",
      category: "convenience",
      catLabel: "동급 최초",
      applicability: "동급 최초",
      title: "1열 암레스트 &amp; 슬라이딩·리클라이닝 시트",
      isNew: true,
      summary: "1열 접이식 암레스트와 슬라이딩·리클라이닝 시트로 장거리 탑승 편의성을 극대화했습니다.",
      description: "장거리 탑승 시 안전하고 편안한 자세를 취할 수 있도록 1열 시트(운전석/동승석)에 암레스트를 장착해 탑승자 편의성을 극대화했습니다. 암레스트는 접이식으로 설계해 승·하차 시 불편함이 없도록 배려했습니다. 운전석/조수석에 장착된 레버로 등받이를 앞/뒤로 젖힐 수 있는 리클라이닝 기능과 시트를 앞/뒤로 이동시키는 슬라이딩 기능도 함께 적용됩니다.",
      features: [
        "1열 접이식 암레스트(운전석/동승석), 동급 최초",
        "리클라이닝 + 슬라이딩 시트 조절 기능",
        "장거리 탑승 편의성 극대화"
      ],
      applicModel: "E-CV1 전 트림 기본 적용",
      image: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/armrest-sliding-reclining-seat.jpg",
      imageAlt: "E-CV1 운전석/동승석 암레스트와 슬라이딩·리클라이닝 시트",
      objectPosition: "center",
      images: [
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/armrest-sliding-reclining-seat.jpg", alt: "1열 암레스트 & 슬라이딩·리클라이닝 시트" },
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/armrest-folded-pair.jpg", alt: "1열 접이식 암레스트 실물 사진" },
        { src: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/mirror-armrest-seat-slide.jpg", alt: "암레스트·슬라이딩·리클라이닝 조작 부위 설명" }
      ]
    },
    {
      id: "v2l-v2v",
      category: "convenience",
      catLabel: "V2L · V2V",
      applicability: "기본 적용",
      title: "V2L/V2V, 차량이 곧 이동식 전원입니다",
      isNew: false,
      summary: "최대 출력 3.3kW, 사용 가능 전력량 29.302kWh의 이동식 전원 공급 기능을 제공합니다.",
      description: "OBC를 활용해 차량 외부로 일반 전기 전원(220V)을 제공합니다. 차량 충전구에 실외 V2L 커넥터를 연결해 사용하며, 충전 중에는 작동이 불가합니다. 최대 출력 3.3kW, 배터리 SOC 30~100% 구간(최대 용량의 70%)을 활용한 사용 가능 전력량은 29.302kWh(41.86kWh × 0.7)입니다.",
      features: [
        "최대 출력 3.3kW, 사용 가능 전력량 29.302kWh",
        "55인치 TV 68대 · 스탠드형 에어컨 2대 동시 작동 가능",
        "한국 4인 가구 기준(월평균 350kWh) 5일 이상 사용 가능"
      ],
      applicModel: "E-CV1 전 트림 기본 적용",
      image: "https://cdn.jsdelivr.net/gh/hyunsuk7174/centro-ak-assets@main/v2l-power-supply-demo.jpg",
      imageAlt: "E-CV1 실외 V2L 커넥터로 220V 전원을 공급하는 모습",
      objectPosition: "center"
    }
  ];

  global.CENTRO_OPTIONS = CENTRO_OPTIONS;

})(window);
