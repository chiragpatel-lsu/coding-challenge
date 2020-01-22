# Chirag Coding Challenge

## Dependencies
* Golang
    * Follow the steps at https://golang.org/doc/install
* Node
    * Install node from https://nodejs.org/en/download/
* MongoDB
    * Using docker
        * Install docker by following the instructions at https://docs.docker.com/install/
        * Once install, run `docker run -d -p 27017:27017 --name mongodb mongo:latest
    * Using mongoDB
        * Follow the instructions at https://docs.mongodb.com/v3.2/administration/install-community/
 
 ## Setup
 * Navigate to $GOPATH/src/github.com/chiragpatel-lsu
 * git clone https://github.com/chiragpatel-lsu/coding-challenge
 
 ## Running the applications
 This setup consist of 4 applications: gif api, oauth api, frontend ui, and frontend api.
 
 # start the gif service
 go run ./gif/main.go &
 
 # Star the oauth service
 go run ./oauth/main.go &
 
 # Start the backend piece of the ui
 npm start --prefix ./ui/api &
 
 # Start the front end ui portion of the app
 npm start --prefix ./ui/frontend &
 
 ## TODOs
 ### OAuth Server
 * The OAuth service is not really functioning as a full OAuth service. I simply created a service to demonstrate 
 how we could retrieve a JWT token, register a user.
 * The OAuth service endpoints should be locked down. Currently, you are able to authorize a user 
 without a clientId, secret (implicit grant)
 * Separate the OAuth server and User API. Currently all the user operations are through the same API. Ideally we would want to separate this..
 * Move operations to a data layer, also use a interface
 * Filter out Gif that the user already has
 * Instead of passing all the information about a Gif from the front end, maybe pass just an ID and query the Gif API.
    * This would allow of validation of the Gif to make sure the rating is correct.
 * Maybe store the gif instead of a URL. OR Store the Gif internally in case it gets removed. 
 * Categories validation and filtering. This would allow to filter out any words that are not allowed
 
 ### UI
 * Serve the react app through the backend api. That way they both can run on the same port, removing the need to allow cors
 * Validate password strength
 * Better usage of screen spacing
 * Back button
 * Probably introduce redux or use context 
 
 ### Gif API
 * Filter out Gif that the user already has
 
 ### General
 * TESTING! Need to add unit test, integration test
 * COMMENTS!!
 * MORE setup details on README. A README for each application
 * DOCKERIZE! To make it easier to run 
 * UI tests using something like cypress.io (I have used selinum before)
 * Using interfaces in dependency injection instead of specific implementation
 * Validating the password in the front end and backend api
    * The rules should be in 1 place (maybe a separate API or config server)
        * This would allow the front end backend to maintain the same password strength validation
        * Changes to the strength wouldn't have to happen in multiple places
        * Frontend validation would give the ability to quickly response to user inout
        * Backend validation would give the ability to double validate in-case a "savvy" person can get through the js validation
 * To save time, I broke one of my biggest rules, Single responsibility principle. I have few functions that are fairly log and do multiple things
 * Return proper error codes from APIs
 * Proper error handling throughout the application