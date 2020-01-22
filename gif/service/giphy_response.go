package service

// The Giphy API response
type GiphyResponses struct {
	Data       []Data     `json:"data"`
	Pagination Pagination `json:"pagination"`
}

// Pagination information
type Pagination struct {
	TotalCount int `json:"total_count"`
	Count      int `json:"count"`
	Offset     int `json:"offset"`
}

// The gifs returned by Giphy API
type Data struct {
	Type           string `json:"type"`
	ID             string `json:"id"`
	URL            string `json:"url"`
	Title          string `json:"title"`
	Rating         string `json:"rating"`
	ImportDatetime string `json:"import_datetime"`
	Images         Images `json:"images"`
}

// The different size images returned by Giphy API
type Images struct {
	FixedHeightSmall FixedHeight `json:"fixed_height_small"`
}

// The image properties
type FixedHeight struct {
	Height   string `json:"height"`
	Mp4      string `json:"mp4"`
	Mp4Size  string `json:"mp4_size"`
	Size     string `json:"size"`
	URL      string `json:"url"`
	Webp     string `json:"webp"`
	WebpSize string `json:"webp_size"`
	Width    string `json:"width"`
}
