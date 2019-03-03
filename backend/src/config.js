module.exports = {
    spotifyQueueSecret: process.env.SPOTIFY_QUEUE_SECRET,
    spotifyRedirectUri: process.env.SPOTIFY_REDIRECT_URI,
    isProduction: process.env.NODE_ENV === "production",
}