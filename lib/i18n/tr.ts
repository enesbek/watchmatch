import type { Dictionary } from "./en";

const tr: Dictionary = {
  home: {
    tagline: "Bu akşam ne izlesek? Swipe edin, eşleşin, izleyin.",
    contentType: "İçerik Türü",
    movie: "🎬 Film",
    tv: "📺 Dizi",
    discovery: "Bilindiklik Tercihi",
    popular: "🔥 Popüler Klasikler",
    hiddenGems: "💎 Gizli Cevherler",
    mixed: "🎲 Karışık",
    creating: "Oluşturuluyor...",
    createRoom: "Yeni Oda Oluştur",
    orJoin: "veya odaya katıl",
    codePlaceholder: "4 haneli oda kodu",
    joinRoom: "Odaya Katıl",
  },
  room: {
    loading: "Yükleniyor...",
    waiting: "Partnerini bekliyorsun...",
    qrAlt: "QR kod",
    shareHint: "Bu kodu veya linki WhatsApp'tan partnerine gönder. Katıldığında otomatik başlayacaksın.",
    roomLabel: "Oda: {code}",
    deckFinished: "Kartlar bitti!",
    deckFinishedHint: "Daha fazla içerik için filtreleri değiştirip yeni bir oda deneyebilirsiniz.",
  },
  card: {
    like: "BEĞENDİM",
    pass: "PAS",
    noOverview: "Özet bulunamadı.",
    tapForTrailer: "Fragman için karta dokun",
    passAria: "Pas geç",
    likeAria: "Beğen",
  },
  match: {
    title: "EŞLEŞME!",
    bothSaid: "İkiniz de \"{title}\" dedi 🎉",
    availableOn: "Türkiye'de şurada izlenebilir:",
    noProviders: "Bu bölgede dijital platform bilgisi bulunamadı.",
    watchNow: "Hemen İzle",
    keepSwiping: "Kaydırmaya Devam Et",
  },
  trailer: {
    title: "Fragman",
    notFound: "Bu içerik için fragman bulunamadı.",
    close: "Kapat",
  },
  errors: {
    createFailed: "Oda oluşturulamadı.",
    invalidCode: "Lütfen 4 haneli oda kodunu girin.",
    joinFailed: "Odaya katılınamadı.",
    roomNotFound: "Oda bulunamadı. Kodu kontrol edin veya yeni bir oda oluşturun.",
    contentFailed: "İçerik yüklenemedi.",
  },
};

export default tr;
