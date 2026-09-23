export interface GiftData {
  senderName: string;
  receiverName: string;
  envelopeImage: string;
  cardMessage: string;
  birthdayImage: string;
  birthdayTitle: string;
  birthdayText: string;
  collageImages: string[];
  musicCoverImage: string;
  musicUrl: string;
  songTitle: string;
}

const giftData: Record<string, GiftData> = {
  aya: {
    senderName: "Youssef",
    receiverName: "Aya",
    // مسار صورة الظرف التي ستضعها لاحقاً
    envelopeImage: "/images/envelope-placeholder.png", 
    cardMessage: "Check out this awesome surprises for YOU!",
    // مسار صورة الطفل/صاحبة العيد ميلاد
    birthdayImage: "/images/kid-placeholder.jpg", 
    birthdayTitle: "Happy Birthday, my love.",
    birthdayText: "Being with you is truly one of the best things that has ever happened to me. From the moment you came into my life, everything started to feel brighter and more meaningful...",
    // مسارات الـ 4 صور
    collageImages: [
      "/images/pic1.jpg", 
      "/images/pic2.jpg", 
      "/images/pic3.jpg", 
      "/images/pic4.jpg"  
    ],
    // مسار صورة الأغنية
    musicCoverImage: "/images/song-cover.jpg",
    // مسار ملف الأغنية (mp3)
    musicUrl: "/music/our-song.mp3",
    songTitle: "Our Special Song"
  },
};

export default giftData;