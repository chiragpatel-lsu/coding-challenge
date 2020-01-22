package main

import (
	"github.com/chiragpatel-lsu/coding-challenge/gif/service"
	"log"
	"net/http"

	"github.com/gorilla/mux"

	"github.com/chiragpatel-lsu/coding-challenge/gif/controller"
)

func main() {
	// TODO move route setup
	gifApi := getGifApi()
	router := mux.NewRouter()
	router.HandleFunc("/v1/api/gif/search", gifApi.GifHandler).Methods(http.MethodGet)

	// TODO handle sigterm
	log.Println("Starting Gif API")

	// TODO read port from config
	log.Fatal(http.ListenAndServe(":8081", router))
}

func getGifApi() *controller.GifController {
	return &controller.GifController{
		GifService: getGiphyService(),
	}
}

func getGiphyService() *service.Giphy {
	// TODO url, apikey, rating, language all from config
	return &service.Giphy{
		URL:      "https://api.giphy.com/v1/gifs",
		ApiKey:   "9uup465uHLKJ7Dg77nzY9DynHYTalxJY",
		Limit:    20,
		Rating:   "G",
		Language: "en",
	}
}
