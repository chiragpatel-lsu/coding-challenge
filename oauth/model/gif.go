package model

// Gif model
type Gif struct {
	ID         string   `json:"id"`
	URL        string   `json:"url"`
	Title      string   `json:"title"`
	Categories []string `json:"categories"`
	Favorite   bool     `json:"favorite"`
}
