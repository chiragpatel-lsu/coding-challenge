package main

import (
	"log"
	"net/http"

	"github.com/chiragpatel-lsu/coding-challenge/oauth/controller"
	"github.com/chiragpatel-lsu/coding-challenge/oauth/database"

	"github.com/gorilla/mux"
)

func main() {
	// TODO move route setup
	database := getDatabaseService()

	router := mux.NewRouter()
	oauthController := getOAuthController(database)
	router.HandleFunc("/v1/api/oauth/register", oauthController.RegisterHandler).Methods(http.MethodPost)
	router.HandleFunc("/v1/api/oauth/authorize", oauthController.AuthorizeHandler).Methods(http.MethodPost)

	userController := getUserController(database)
	router.HandleFunc("/v1/api/user/{username}", userController.ProfileHandler).Methods(http.MethodGet)
	router.HandleFunc("/v1/api/user/{username}/gif", userController.AddGifHandler).Methods(http.MethodPut)

	// TODO handle sigterm
	log.Println("Starting User API")

	// TODO read port from config
	log.Fatal(http.ListenAndServe(":8080", router))
}

func getOAuthController(database *database.MongoDB) *controller.OAuthController {
	return &controller.OAuthController{MongoDbService: database}
}

func getUserController(database *database.MongoDB) *controller.UserController {
	return &controller.UserController{MongoDbService: database}
}

func getDatabaseService() *database.MongoDB {
	return &database.MongoDB{
		ConnectionString: "mongodb://192.168.99.100:27017",
		DatabaseName:     "heb",
	}
}
