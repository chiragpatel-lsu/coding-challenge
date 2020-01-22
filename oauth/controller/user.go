package controller

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
	"time"

	"github.com/chiragpatel-lsu/coding-challenge/oauth/database"
	"github.com/chiragpatel-lsu/coding-challenge/oauth/model"
	"github.com/chiragpatel-lsu/coding-challenge/oauth/util"

	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"

	log "github.com/sirupsen/logrus"
)

type UserController struct {
	MongoDbService *database.MongoDB
}

func (userController *UserController) ProfileHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	username := vars["username"]

	// TODO duplicate code, move this to a middleware
	// TODO handling or encode errors

	w.Header().Set("Content-Type", "application/json")
	tokenString := r.Header.Get("Authorization")

	// TODO validate the length of the token
	tokenValue := strings.Split(tokenString, " ")[1]

	token, err := jwt.Parse(tokenValue, func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			log.Error("failed")
			return nil, fmt.Errorf("unexpected signing method")
		}
		return []byte("secret"), nil
	})
	if err != nil {
		util.HandleErrorsWithMessage(w, "invalid claims")
		return
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		util.HandleErrorsWithMessage(w, "invalid claims")
		return
	}

	jwtUsername := claims["username"].(string)
	if !strings.EqualFold(jwtUsername, username) {
		util.HandleErrorsWithMessage(w, "username does not match token username")
		return
	}

	// TODO move to a data layer
	collection, err := userController.MongoDbService.GetDBCollection("users")
	if err != nil {
		util.HandleErrors(w, err)
		return
	}

	var result model.User
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)

	// TODO figure out how to not return "password" {password: 0}
	err = collection.FindOne(ctx, bson.D{{"username", username}}).Decode(&result)
	if err != nil {
		util.HandleErrors(w, err)
		return
	}

	result.Password = ""
	json.NewEncoder(w).Encode(result)
	return
}

func (userController *UserController) AddGifHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	username := vars["username"]
	fmt.Println(vars)

	// TODO duplicate code, move this to a middleware
	// TODO handling or encode errors

	w.Header().Set("Content-Type", "application/json")
	tokenString := r.Header.Get("Authorization")

	// TODO validate the length of the token
	tokenValue := strings.Split(tokenString, " ")[1]

	token, err := jwt.Parse(tokenValue, func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			log.Error("failed")
			return nil, fmt.Errorf("unexpected signing method")
		}
		return []byte("secret"), nil
	})
	if err != nil {
		util.HandleErrors(w, err)
		return
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		util.HandleErrorsWithMessage(w, "invalid claims")
		return
	}

	jwtUsername := claims["username"].(string)
	if !strings.EqualFold(jwtUsername, username) {
		fmt.Println(username)
		fmt.Println(jwtUsername)
		util.HandleErrorsWithMessage(w, "username does not match token username")
		return
	}

	var gif model.Gif
	body, _ := ioutil.ReadAll(r.Body)
	err = json.Unmarshal(body, &gif)
	if err != nil {
		util.HandleErrors(w, err)
		return
	}

	// TODO move to a data layer
	collection, err := userController.MongoDbService.GetDBCollection("users")
	if err != nil {
		util.HandleErrors(w, err)
		return
	}

	update := bson.M{
		"$addToSet": bson.M{
			"gifs": bson.M{"$each": []model.Gif{gif}},
		},
	}

	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	_, err = collection.UpdateOne(ctx, bson.D{{"username", username}}, update)
	if err != nil {
		util.HandleErrorsWithMessage(w, "error while getting user back")
		return
	}

	result := model.ResponseResult{}
	json.NewEncoder(w).Encode(result)
	return
}
