import { Restaurant } from '../types';

export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: 'e63f9a7c-1b8d-4f2a-9c3e-5d4b8e7a1f0c',
    name: "벨벳 다이닝 (The Velvet Fork)",
    category: "모던 유러피안",
    address: "강남구 가로수길 123",
    external_map_url: "https://maps.google.com/?q=The+Velvet+Fork",
    image_url: "https://picsum.photos/seed/velvet/800/600",
    price_range: "$$$",
    rating: 4.8,
    reviews: [
      { content: "기념일에 방문했는데 분위기가 정말 깡패입니다. 조명이 어두워서 서로에게 집중하기 너무 좋아요." },
      { content: "트러플 리조또는 인생 리조또였어요. 다만 코스 요리라 시간은 좀 넉넉히 잡고 가야 합니다." },
      { content: "가격대는 좀 있지만 특별한 날 연인과 함께하기엔 최고의 선택." }
    ]
  },
  {
    id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    name: "화끈한 마라집",
    category: "사천 중식",
    address: "마포구 연남동 456",
    external_map_url: "https://maps.google.com/?q=Spicy+House+No+1",
    image_url: "https://picsum.photos/seed/spicy/800/600",
    price_range: "$$",
    rating: 4.5,
    reviews: [
      { content: "팀 회식으로 갔는데 원형 테이블이라 다 같이 얘기하기 좋았어요. 꿔바로우 양도 푸짐합니다." },
      { content: "경고: 진짜 맵습니다. 매운 거 못 드시는 분들은 백탕 필수 주문하세요." },
      { content: "시끌벅적하고 에너지 넘치는 분위기. 스트레스 풀리는 매운맛!" }
    ]
  },
  {
    id: 'f9e8d7c6-b5a4-3210-fedc-ba0987654321',
    name: "그린 리프 비스트로",
    category: "비건 / 오가닉",
    address: "용산구 한남동 789",
    external_map_url: "https://maps.google.com/?q=Green+Leaf+Bistro",
    image_url: "https://picsum.photos/seed/green/800/600",
    price_range: "$$",
    rating: 4.6,
    reviews: [
      { content: "비건인 친구랑 갔는데 메뉴 선택지가 많아서 너무 좋았어요. 글루텐 프리 옵션도 있습니다." },
      { content: "요가 끝나고 가볍게 브런치 먹기 딱 좋은 곳. 속이 편안해요." },
      { content: "샐러드 가격치고는 비싸지만 재료 신선도가 미쳤습니다. 아보카도가 입에서 녹아요." }
    ]
  },
  {
    id: '12345678-90ab-cdef-1234-567890abcdef',
    name: "버거 앤 브루",
    category: "수제버거 펍",
    address: "이태원동 101",
    external_map_url: "https://maps.google.com/?q=Burger+and+Brews",
    image_url: "https://picsum.photos/seed/burger/800/600",
    price_range: "$",
    rating: 4.2,
    reviews: [
      { content: "스포츠 경기 보면서 맥주 한잔하기 딱입니다. 다만 좀 시끄러워서 소개팅은 절대 금물." },
      { content: "서울에서 제일 맛있는 스매쉬 버거. 육즙이 줄줄 흐릅니다. 가성비 최고." },
      { content: "음식이 빨리 나와서 친구들이랑 2차로 가볍게 가기 좋아요." }
    ]
  },
  {
    id: '87654321-fedc-ba09-8765-43210fedcba9',
    name: "스시 젠 (Zen)",
    category: "오마카세",
    address: "청담동 202",
    external_map_url: "https://maps.google.com/?q=Omakase+Zen",
    image_url: "https://picsum.photos/seed/sushi/800/600",
    price_range: "$$$$",
    rating: 4.9,
    reviews: [
      { content: "셰프님이 한 점 한 점 설명해주시는데 예술 작품을 먹는 기분입니다. 아주 조용하고 엄숙한 분위기." },
      { content: "아이들 데려가기는 힘든 곳입니다. 비즈니스 접대나 정말 중요한 날 추천." },
      { content: "가격은 사악하지만 우니와 참치 뱃살 선도가 말도 안 됩니다. 잊을 수 없는 맛." }
    ]
  },
  {
    id: 'aabbccdd-1122-3344-5566-77889900aabb',
    name: "맘마미아 파스타",
    category: "이탈리안 가정식",
    address: "서초구 반포동 303",
    external_map_url: "https://maps.google.com/?q=Mama+Marias",
    image_url: "https://picsum.photos/seed/pasta/800/600",
    price_range: "$$",
    rating: 4.4,
    reviews: [
      { content: "진짜 이탈리아 할머니가 해주는 맛. 양이 엄청 많아서 가족 외식으로 딱이에요." },
      { content: "입맛 까다로운 우리 아이들도 여기 크림 파스타는 흡입하네요." },
      { content: "따뜻하고 정겨운 분위기. 직원분들이 너무 친절해서 기분 좋아지는 곳." }
    ]
  }
];