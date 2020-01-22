#!/bin/bash


# start the gif service
go run ./gif/main.go &

# Star the oauth service
go run ./oauth/main.go &

# Start the backend piece of the ui
npm start --prefix ./ui/api &

# Start the front end ui portion of the app
npm start --prefix ./ui/frontend &
