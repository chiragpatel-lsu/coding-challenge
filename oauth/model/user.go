package model

type User struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Gifs     []Gif  `json:"gifs"`
}