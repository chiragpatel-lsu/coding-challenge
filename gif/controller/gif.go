package controller

import (
	"encoding/json"
	"fmt"
	"github.com/chiragpatel-lsu/coding-challenge/gif/model"
	"github.com/chiragpatel-lsu/coding-challenge/gif/service"
	log "github.com/sirupsen/logrus"
	"net/http"
	"strconv"
	"strings"

	jwt "github.com/dgrijalva/jwt-go"
)

type GifController struct {
	GifService *service.Giphy
}

func (gifApi *GifController) GifHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	tokenString := r.Header.Get("Authorization")

	// TODO validate the length of the token
	token := strings.Split(tokenString, " ")[1]

	_, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			log.Error("failed")
			return nil, fmt.Errorf("unexpected signing method")
		}
		return []byte("secret"), nil
	})
	if err != nil {
		log.Info(tokenString)
		json.NewEncoder(w).Encode(err.Error())
		return
	}

	term := strings.TrimSpace(r.URL.Query().Get("term"))
	if term == "" {
		json.NewEncoder(w).Encode([]model.Gif{})
		return
	}

	page := strings.TrimSpace(r.URL.Query().Get("page"))
	pageNumber, err := strconv.Atoi(page)
	if err != nil {
		pageNumber = 1
	}

	json.NewEncoder(w).Encode(gifApi.GifService.Search(term, pageNumber))
}
