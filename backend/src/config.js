module.exports = {
    spotifyQueueSecret: process.env.SPOTIFY_QUEUE_SECRET,
    isProduction: process.env.NODE_ENV === "production"
}