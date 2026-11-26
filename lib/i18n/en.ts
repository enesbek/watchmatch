const en = {
  home: {
    tagline: "What should we watch tonight? Swipe, match, watch.",
    contentType: "Content Type",
    movie: "🎬 Movie",
    tv: "📺 TV Show",
    discovery: "Discovery Preference",
    popular: "🔥 Popular Classics",
    hiddenGems: "💎 Hidden Gems",
    mixed: "🎲 Mixed",
    creating: "Creating...",
    createRoom: "Create New Room",
    orJoin: "or join a room",
    codePlaceholder: "4-digit room code",
    joinRoom: "Join Room",
  },
  room: {
    loading: "Loading...",
    waiting: "Waiting for your partner...",
    qrAlt: "QR code",
    shareHint: "Send this code or link to your partner. You'll start automatically when they join.",
    roomLabel: "Room: {code}",
    deckFinished: "No more cards!",
    deckFinishedHint: "Try a new room with different filters for more titles.",
  },
  card: {
    like: "LIKE",
    pass: "PASS",
    noOverview: "No overview available.",
    tapForTrailer: "Tap the card for the trailer",
    passAria: "Pass",
    likeAria: "Like",
  },
  match: {
    title: "IT'S A MATCH!",
    bothSaid: "You both picked \"{title}\" 🎉",
    availableOn: "Available to stream on:",
    noProviders: "No streaming information found for this region.",
    watchNow: "Watch Now",
    keepSwiping: "Keep Swiping",
  },
  trailer: {
    title: "Trailer",
    notFound: "No trailer found for this title.",
    close: "Close",
  },
  errors: {
    createFailed: "Couldn't create the room.",
    invalidCode: "Please enter the 4-digit room code.",
    joinFailed: "Couldn't join the room.",
    roomNotFound: "Room not found. Check the code or create a new room.",
    contentFailed: "Couldn't load content.",
  },
};

export type Dictionary = typeof en;
export default en;
