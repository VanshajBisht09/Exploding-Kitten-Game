package main

import (
  "context"
  "net/http"
  "github.com/gin-contrib/cors"
  "github.com/gin-gonic/gin"
  "github.com/go-redis/redis/v8"
)

var ctx = context.Background()

func main() {
  r := gin.Default()

  // CORS middleware configuration
  r.Use(cors.New(cors.Config{
	AllowOrigins:     []string{"http://localhost:3000"}, // Replace with your frontend's origin
	AllowMethods:     []string{"GET", "POST", "OPTIONS"},
	AllowHeaders:     []string{"Content-Type"},
	AllowCredentials: true, // If needed for cookies/auth
}))

  rdb := redis.NewClient(&redis.Options{
    Addr: "localhost:6379",
  })

  r.POST("/save-score", func(c *gin.Context) {
    var data struct {
        Username string `json:"username"`
        Score    int    `json:"score"`
    }
    if err := c.ShouldBindJSON(&data); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Check if the user already exists in the leaderboard
    _, err := rdb.ZScore(ctx, "leaderboard", data.Username).Result()
    if err != nil && err != redis.Nil { // Check for errors that are not related to missing keys
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    // Update the score with the new value (replace or add if not present)
    newScore := float64(data.Score)
    err = rdb.ZAdd(ctx, "leaderboard", &redis.Z{
        Score:    newScore,
        Member:   data.Username,
    }).Err()

    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"status": "success"})
})

  r.GET("/leaderboard", func(c *gin.Context) {
    scores, err := rdb.ZRevRangeWithScores(ctx, "leaderboard", 0, 10).Result()
    if err != nil {
      c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
      return
    }

    if len(scores) == 0 {
      c.JSON(http.StatusOK, gin.H{"message": "Leaderboard is empty"})
      return
    }

    c.JSON(http.StatusOK, scores)
  })

  r.Run() // Default listens on :8080
}