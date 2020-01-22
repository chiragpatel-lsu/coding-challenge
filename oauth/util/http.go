package util

import (
	"encoding/json"
	"net/http"

	"github.com/chiragpatel-lsu/coding-challenge/oauth/model"

	log "github.com/sirupsen/logrus"
)

func HandleErrors(writter http.ResponseWriter, error error) {
	HandleErrorsWithMessage(writter, error.Error())
	return
}

func HandleErrorsWithMessage(writter http.ResponseWriter, error string) {
	var res model.ResponseResult

	// TODO handle encode error
	log.Error(error)
	res.Error = error
	writter.WriteHeader(http.StatusInternalServerError)
	json.NewEncoder(writter).Encode(res)
	return
}
