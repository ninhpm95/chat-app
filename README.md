# About
A chat application implemented in React, Redux, WebSocket, MongoDB...

## Technologies
+ **Front-end:** React, Redux
+ **Back-end:** WebSocket
+ **Database:** MongoDB
+ **Others:** webpack, scss, i18next...

## Before running the app
1. Change `/client/.env.example` to `/client/.env`
2. Change `/server/.env.example` to `/server/.env`
3. Find the following line in /server/index.js, which indicates the URI to MongoDB
```js
let mongodbUri = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.yqfofiw.mongodb.net/${DB}?retryWrites=true&w=majority`;
```
4. Change the URI and `/server/.env` based on your mongoDB settings

## How to run
### Using Docker (make sure docker is installed)
+ Build docker images
  ```
  docker-compose build
  ```
+ Run
  ```
  docker-compose up
  ```
+ Access the app via http://localhost:3000/

### Using traditional way
+ Install dependencies
  + Open 2 terminals in "chat-app" directory
    + First terminal:
      ```
      cd client
      npm install
      ```
    + Second terminal:
      ```
      cd server
      npm install
      ```
+ Run client
  + First terminal:
    ```
    npm start
    ```
+ Run server
  + Second terminal:
    ```
    npm start
    ```
+ Access the app via http://localhost:3000/

## How to use the app
### Basic functionality
+ Enter a message inside the chatbox and press Enter to send the message to everyone.
+ You can use these characters for emoji:
  ```
  :), :D, :P, ;), :(
  ```

### How to change username
Type the following content to the chatbox:
  ```
  /change_username <username>
  ```

### How to change language
Hover over the language button and click on the preferred language that appears

## Screenshot
![Mobile Layout](https://github.com/ninhpm95/chat-app/blob/master/MobileLayout.png?raw=true)

![PC Layout](https://github.com/ninhpm95/chat-app/blob/master/PCLayout.png?raw=true)
