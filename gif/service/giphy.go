package service

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"

	log "github.com/sirupsen/logrus"

	"github.com/chiragpatel-lsu/coding-challenge/gif/model"
)

type Giphy struct {
	URL      string
	ApiKey   string
	Limit    int
	Rating   string
	Language string
}

func (giphy *Giphy) Search(term string, pageNumber int) []model.Gif {
	// validate that the page number is positive, if not set to page 1
	if pageNumber < 1 {
		pageNumber = 1
	}

	url := fmt.Sprintf("%s/search?api_key=%s&q=%s&limit=%d&offset=%d&rating=%s&lang=%s",
		giphy.URL,
		giphy.ApiKey,
		term,
		giphy.Limit,
		pageNumber-1,
		giphy.Rating,
		giphy.Language)
	resp, err := http.Get(url)
	if err != nil {
		log.Errorf("failed to search the giphy endpoint: %s", err.Error())
		return []model.Gif{}
	}

	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Errorf("failed to read the body of the giphy response: %s", err.Error())
		return []model.Gif{}
	}

	var result *GiphyResponses
	json.Unmarshal(body, &result)

	var response []model.Gif
	if result != nil && len(result.Data) > 0 {
		for _, image := range result.Data {
			if !strings.EqualFold(image.Rating, giphy.Rating) {
				log.Infof("giphy with id %s did not match rating", image.ID)
				continue
			}

			gif := model.Gif{
				ID:    image.ID,
				URL:   image.Images.FixedHeightSmall.URL,
				Title: image.Title,
			}

			response = append(response, gif)
		}
	}

	return response
}
