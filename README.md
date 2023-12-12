
# Movie Lobby for OTT

API for a movie lobby for OTT applications. The lobby has a collection of movies with
genre, rating, and streaming link.


## Tech Stack

**Server side:** Node (v20.10.0), ExpressJS, Mongoose

**Databse:** MongoDB

**Testing:** Jest, Supertest


## Features

- `POST /login`: Login as a user role or admin role
- `GET /movies`: List all the movies in the lobby
- `GET /search?q={query}`: Search for a movie by title or genre
- `POST /movies`: Add a new movie to the lobby (requires "admin" role)
- `PUT /movies/:id`: Update an existing movie's information (title, genre, rating, or streaming link)
(requires "admin" role)
- `DELETE /movies/:id`: Delete a movie from the lobby (requires "admin" role)


## Setup guide

**NodeJS**

Install node version **20.10.0** LTS from [here](https://nodejs.org/en/download/)

**MongoDB**

-   Install MongoDB Server from [here](https://www.mongodb.com/try/download/community)
-   Download MongoDB Compass from [here](https://www.mongodb.com/try/download/compass)
-  After installing MongoDB Compass, launch the application.

 -   Connect MongoDB Compass to your MongoDB server by providing the URI `mongodb://localhost:27017`  
- Create database movie-lobby.
- Create collections movies and users. 
- Add a user with "admin" role to collection users. 

	   {
	     "id": 1,
	     "username": "admin",
	     "password": "adminpassword",
	     "role": "admin"
	   }

- Add a user with "user" role to collection admin


	    {
	      "id": 2,
	      "username": "user",
	      "password": "userpassword",
	      "role": "user"
	    }

Open Terminal (Linux) and clone the repository

    mkdir app
    cd app
    git clone https://github.com/mrajkishor/Movie-Lobby-OTT-API.git
    cd Movie-Lobby-OTT-API

To start the application

    npm run start
To run test

    npm run test
To run unit test with coverage report

    npm run coverage    
To lint

    npm run lint
To lint fix

    npm run lint:fix


 


## API Reference


[Refer to Postman Collection](https://github.com/mrajkishor/Movie-Lobby-OTT-API/blob/main/collection/Movie_Lobby_API_for_OTT.postman_collection.json)

#### Authentication

```http
  POST /login
```
Request (as a user)
| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `{ "username": "user", "password": "userpassword"}   ` | `json` | Login as a user |

Request (as an admin)
| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| ` { "username": "admin", "password": "adminpassword"} ` | `json` | Login as an admin  |

Response
|  Type     | Response body               |
|  :------- | :------------------------- |
|  `json` | { "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJpZCI6IjY1Nzc1NzBhY2UzYzVmMDk5YjU2NzU1MSIsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDIzOTc3NTcsImV4cCI6MTcwMjQwMTM1N30.xcTsUFSv7fZ7CUOCssSn1hnIj2_NMipQ0WwtxfAMy9M"} |

#### Get all movies 

```http
  GET /movies
```
Response
|  Type     | Response body               |
|  :------- | :------------------------- |
|  `json` | [{"_id":"65787e39be650819f3258211","title":"Movie1","genre":"Action","rating":3.4,"streamingLink":"https://imdb.com/33/","__v":0},{"_id":"65787e39be650819f3258212","title":"Movie2","genre":"Drama","rating":5.6,"streamingLink":"https://imdb.com/dummy","__v":0},...] |

#### Search movies

```http
 GET /search?q={query}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `q`      | `string` | Provide title or genre |

#### Post movies

```http
  POST /movies
```

Request Header
| Key | Value                     |
| :-------- | :------- |
| `Authorization` | Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1Nzc1NzBhY2UzYzVmMDk5YjU2NzU1MSIsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDIzNTkzOTksImV4cCI6MTcwMjM2Mjk5OX0.aQq0MJpyEK__DB7OSD0SndtvHtgXCPZpeDwQKupSkTY |

Request Body
| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `{"title": "Animal", "genre": "Action", "rating": "7.3", "streamingLink": "https://www.dazn.com en-IN/home/ArticleId:1nqjt5ylvzmop1kjlnlbabe4xj"}` | `json` | Add a new movie to the lobby (requires "admin" role) |


Response Success
|  Type     | Response body               |
|  :------- | :------------------------- |
|  `json` | { "_id": "65788b7f47cb86774e88f213", "title": "JAKE PAUL VS. AUGUST: FIGHT NIGHT", "genre": "Fight", "rating": 7.3,"streamingLink": "https://www.dazn.com/en-IN/home/ArticleId:1nqjt5ylvzmop1kjlnlbabe4xj", "__v": 0} |

Response Error (Without JWT token)
|  Type     | Response body               |
|  :------- | :------------------------- |
|  `json` | {"error": "Unauthorized - Invalid token"} |

Response Error (Without admin privilege)
|  Type     | Response body               |
|  :------- | :------------------------- |
|  `json` | { "error": "Forbidden - Insufficient permissions"} |


#### Update a movie

```http
  PUT /movies/:id
```

Request Header
| Key | Value                     |
| :-------- | :------- |
| `Authorization` | Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1Nzc1NzBhY2UzYzVmMDk5YjU2NzU1MSIsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDIzNTkzOTksImV4cCI6MTcwMjM2Mjk5OX0.aQq0MJpyEK__DB7OSD0SndtvHtgXCPZpeDwQKupSkTY |

Request Parameter
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `65787e39be650819f3258212` | `string` | **requires** movie ID |


Request Body
| Body | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `{"title": "Animal Park 2","genre": "Action","rating": "7.8","streamingLink":  "https://www.dazn.com/en-IN/home/ArticleId:1nqjt5ylvzmop1kjlasdfasdf3"}` | `json` | Update an existing movie's information (title, genre, rating, or streaming link |


Response Success
|  Type     | Response body               |
|  :------- | :------------------------- |
|  `json` | { "_id": "65787e39be650819f3258212", "title": "Animal Park 2", "genre": "Action", "rating": 7.8,"streamingLink": "https://www.dazn.com/en-IN/home/ArticleId:1nqjt5ylvzmop1kjlasdfasdf3" ,"__v": 0} |

Response Error (Without movie id)
|  Type     | Response body               |
|  :------- | :------------------------- |
|  `html` | Cannot PUT /movies/ |

Response Error (Without JWT token)
|  Type     | Response body               |
|  :------- | :------------------------- |
|  `json` | {"error": "Unauthorized - Invalid token"} |

Response Error (Without admin privilege)
|  Type     | Response body               |
|  :------- | :------------------------- |
|  `json` | { "error": "Forbidden - Insufficient permissions"} |




#### Delete a movie

```http
  DELETE /movies/:id
```

Request Header
| Key | Value                     |
| :-------- | :------- |
| `Authorization` | Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1Nzc1NzBhY2UzYzVmMDk5YjU2NzU1MSIsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDIzNTkzOTksImV4cCI6MTcwMjM2Mjk5OX0.aQq0MJpyEK__DB7OSD0SndtvHtgXCPZpeDwQKupSkTY |

Request Parameter
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `65787e39be650819f3258212` | `string` | **requires** movie ID |


Response Success
|  Type     | Response body               |
|  :------- | :------------------------- |
|  `json` | { "message": "Movie deleted successfully"} |

Response Error (With wrong movie id)
|  Type     | Response body               |
|  :------- | :------------------------- |
|  `json` | {"error":"Internal Server Error"} |

Response Error (Without movie id)
|  Type     | Response body               |
|  :------- | :------------------------- |
|  `html` | Cannot DELETE /movies/ |

Response Error (Without JWT token)
|  Type     | Response body               |
|  :------- | :------------------------- |
|  `json` | {"error": "Unauthorized - Invalid token"} |

Response Error (Without admin privilege)
|  Type     | Response body               |
|  :------- | :------------------------- |
|  `json` | { "error": "Forbidden - Insufficient permissions"} |

## Author

- [mrajkishor](https://www.github.com/mrajkishor)

