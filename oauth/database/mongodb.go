package database

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

type MongoDB struct {
	// "mongodb://192.168.99.100:27017"
	ConnectionString string
	DatabaseName     string // heb
}

func (mongoDB *MongoDB) GetDBCollection(collectionName string) (*mongo.Collection, error) {
	// TODO read from config, pass it as a dependency
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoDB.ConnectionString))
	if err != nil {
		return nil, err
	}

	ctx, _ = context.WithTimeout(context.Background(), 2*time.Second)
	err = client.Ping(ctx, readpref.Primary())

	collection := client.Database(mongoDB.DatabaseName).Collection(collectionName)
	return collection, nil
}
