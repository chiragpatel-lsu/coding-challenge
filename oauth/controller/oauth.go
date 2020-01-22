package controller

import (
	"context"
	"encoding/json"
	"github.com/chiragpatel-lsu/coding-challenge/oauth/util"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"github.com/chiragpatel-lsu/coding-challenge/oauth/database"
	"github.com/chiragpatel-lsu/coding-challenge/oauth/model"

	"github.com/dgrijalva/jwt-go"

	"go.mongodb.org/mongo-driver/bson"

	"golang.org/x/crypto/bcrypt"
)

type OAuthController struct {
	MongoDbService *database.MongoDB
}

func (oauthController *OAuthController) RegisterHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("received registration request")

	w.Header().Set("Content-Type", "application/json")
	var user model.User
	body, _ := ioutil.ReadAll(r.Body)
	err := json.Unmarshal(body, &user)
	var res model.ResponseResult
	if err != nil {
		util.HandleErrors(w, err)
		return
	}

	collection, err := oauthController.MongoDbService.GetDBCollection("users")
	if err != nil {
		util.HandleErrors(w, err)
		return
	}

	var result model.User
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	err = collection.FindOne(ctx, bson.D{{"username", user.Username}}).Decode(&result)

	if err != nil {
		if err.Error() == "mongo: no documents in result" {
			hash, err := bcrypt.GenerateFromPassword([]byte(user.Password), 5)

			if err != nil {
				util.HandleErrorsWithMessage(w, "Error While Hashing Password, Try Again")
				return
			}
			user.Password = string(hash)

			_, err = collection.InsertOne(ctx, user)
			if err != nil {
				util.HandleErrorsWithMessage(w, "Error While Creating User, Try Again")
				return
			}

			// TODO dup code, move to a common place
			var result model.OAuthResult
			ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
			err = collection.FindOne(ctx, bson.D{{"username", user.Username}}).Decode(&result)
			if err != nil {
				util.HandleErrorsWithMessage(w, "error while getting user back")
				return
			}

			token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
				"username": result.Username,
			})

			tokenString, err := token.SignedString([]byte("secret"))
			if err != nil {
				util.HandleErrorsWithMessage(w, "Error while generating token,Try again")
				return
			}

			result.Token = tokenString
			json.NewEncoder(w).Encode(result)
			return
		}

		util.HandleErrors(w, err)
		return
	}

	res.Error = "Username already Exists!!"
	json.NewEncoder(w).Encode(res)
	return
}

func (oauthController *OAuthController) AuthorizeHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("received request")

	w.Header().Set("Content-Type", "application/json")

	var loginRequest model.LoginRequest

	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Fatal(err)
	}

	err = json.Unmarshal(body, &loginRequest)
	if err != nil {
		log.Fatal(err)
	}

	collection, err := oauthController.MongoDbService.GetDBCollection("users")

	if err != nil {
		log.Fatal(err)
	}

	var result model.User
	err = collection.FindOne(context.TODO(), bson.D{{"username", loginRequest.Username}}).Decode(&result)
	if err != nil {
		util.HandleErrorsWithMessage(w, "Invalid username")
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(result.Password), []byte(loginRequest.Password))
	if err != nil {
		util.HandleErrorsWithMessage(w, "Invalid username")
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"username": result.Username,
	})

	tokenString, err := token.SignedString([]byte("secret"))
	if err != nil {
		util.HandleErrorsWithMessage(w, "Error while generating token,Try again")
		return
	}

	response := model.OAuthResult{
		Username: result.Username,
		Token:    tokenString,
	}

	json.NewEncoder(w).Encode(response)
}
