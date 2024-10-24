# Start backend application
In the terminal navigate to the mp4GifConverter folder and run:
```
npm install
```
to install the dependencies and then
```
node server.js
```
to start the server

# Start frontend application
In the terminal navigate to the mp4-gif-frontend folder and run:
```
npm install
```
to install the dependencies and then
````
npm start
````
to start the application

# Deploying
While the docker and docker-compose yaml files have been created for both applications, this has not been properly tested due to time restrictions. But the following command: 
```
docker-compose up --scale worker=5
```
should set configuration to run 1 web server instance and 5 worker instances (I hope!!!)
