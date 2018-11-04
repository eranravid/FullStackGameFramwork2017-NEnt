## About

FullStackGameFramwork2017 NEnt by Eran Ravid . 26.6.2017.
This is a Node.js app using stack of technologies such as npm, ES6 and HTML5. 

This app was tested on: 
	chrome, firefox, edge - on windows
	chrome - on mobile

My developing tools were SublimeText3 editor, chrome browser and windows command promt.

## Installation & Scripts

**This app was developed on windows and thus some scripts might not work on other OS**

To start the project first download the git repository or just extract the project folder to your workspace directory. 
Make sure you have Node.js installed and run npm install.
After all the dependencies are installed, you can go ahead and run the following to start developing:

'npm run dev_client' - 
will run the gulp task runner which will build the client project to build_development.
It will also watch the files for changes and open up a browsersync server and start a browser on port 3006.

on a second shell window -
'npm run dev_server' - 
will run the index.js node app in a debug mode. 
It will also start node-inspector for server debugging, so it will open a browser window at port 8080 listening to port 5858 of the debug port of the node app.

'npm run prod_server' - 
Will start the production client build to build_production directory.
Also will start the server in production mode.

'npm run test' - 
Will start the mocha test app.

## Environments & Global Params

The app let you set some environment parameters to run for the Node app or for the Gulp task runner:
- NODE_ENV: can be development or production and define the task runner and the node app with the desired environment. default - development.
- GAME_CODE: the name code of the game to build or to run. default - Game_1.
- PROTOCOL: the protocol of reaching the server http or https. default - http.
- HOST: host name for the server. default - localhost.
- PORT: the port in which to run the server. default dev - 3005. default prod - 3001.
- LIVE_RELOAD_PORT: the port in which the live reload server will run. default 3006.

Other params to notice are:
- node-inspectore api for debugging the server app - 8080.
- node debug port in used to listen by the node-inspector - 5858.
Those can be changed in the package.json when running the scripts.

**For the client app, must specify a host_url in the query strings refering to the server app url**
This is done so the client and the server could sit on different machines.

## Infrastructure

This app is a fullstack NodeJS app developed & run both client and server, development and production from the same workspace.
You can of curse run a production server on one machine and development server on another.
Also the client build could be placed on another, static server like CDN.

The client side source is built from two main parts:
- infrastructure code - shared among all games including components like server front-end and ui manager.
- game dependent code - for each game, a folder with the game code name is created and in it the game specific code, config and assets.
In the root js directory there is also the main runner js file for the game specific.

That means that games can share code by refrensing the components they need from the infrastructure, and each update for any component, server for example, will take effect automatically for all game each build.
Any game specific changes can be made in the game config or in the implementation of the code itseld in the game directory by extending and overriding functions and classes.

## Client

No framework or external libraries were used to develop the client side. 
All graphic and rendering is done via the HTML canvas element.
The app is developed in es6 code using babel & browserify to bundle it up to one file during the building process.
gulp tasks are building and watching all of the files in the infrastructure and game directory and immidiatly refresh the browser on any file change (using the browsersync server).

index.html source file is shared among all games and contain only 1 canvas element and a script ref to bundle.js.
main_{gmaecode}.js is the entery point for the game specific app. It load the game config.jd and runner {gamecode}.js and then start up the preloader.
The preloader in turn start up the server, check for it to be alive, if so, start download assets, if not, show appropriate error message.
If everything went smooth, start up the main game.

Server_Facade - 
Is the main interface for doing server calls from within the app.
Use notify() to check server status - if alive.
Use getGameOutcome to call the server api for a game ticket.

UI_Manager - 
Is the main inteface to interact with the graphic user interface. 
Featuring methods like onButtonClick, lockUI, showMessages etc.
UI_Manager is using the atomic simple components from the components library, such as ButtonComponent and TextComponent.

Game-engine - SlotMachine is the main class of the game itself. It governse all the buisness logic of the game as well as the game flow itself such as when to start a round and when not to, controlled by the game status (idle,playing states) and it also in charge of displaing the correct round ticket and the initiation of the bonus game.

config file - is where any game specific can easily make changes to the game without writing any code.
For example you can chage strings messages or the game dimention and alot of other stuff, please see the file for your self to know what other configuration you can get to your specific game. Programatic changes such as extending & overriding of logic can also be done in the game specific directory by just creating new classes/functions.

To run the client dev build for a specific game:
'set GAME_CODE={gamecode}&&npm run dev_client'
Resulting your game being built in the build_development folder under a folder with the game code name.

To run the client prod build for a specific game:
'set GAME_CODE={gamecode}&&npm run prod_client'
Resulting your game being built in the build_production folder under a folder with the game code name.

## Server

The server is a NodeJS app that can serve the client app (static files) from the build_development/build_production directories.

It also serves a JSON based API:
- notify: to check server status - if alive.
- getOutcome: to get a game ticket representation in JSON.
	Ticket paramaters:
	- matrix: a support for a 2 dimentional matrix representing symbol indexes. The symbol indexes mapping can be found in the client game config file. Number of cols and rows for the matrix can be changed in RandomTicketGenerator.js file.
	- winType: an enum representing the winning type according to the given matrix.
		- 0: no win
		- 1: normal win
		- 2: big win
	- isBonus: indicating if for this ticket/round there should be bonus prompt. This chance for a bonuse is defined in RandomBonusGenerator.js by bonusPossibility which is a numric precentage.
	- bonusTicket: if isBonus flag is true, returned a random bonus ticket based on minBonusMultiplier & maxBonusMultiplier and consist of three multiplier posibilities:
		- winMultiplier: the predefined winning multiplier (no matter which bonus item the user chose, this is the multiplier he wins).
		- loseMultipliers: another two options to show for the client what he could have won.

The server logging is done by morgan route for each server call and are stored in access.log file in the src_server directory.

## Tests

Testing was out of the scope of this assignment though testing tools & framework were set using mocha & chai and more.
You can see the the test.js file in test folder.

Covarage directory is for the instabul plugin to serve pretty ui of the code covarage.

## Summary

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Totam molestiae nisi cumque in similique enim vero odit possimus non iure ab odio maiores, eius reiciendis animi nihil natus illo, neque quod! Nesciunt numquam mollitia, quam excepturi voluptate itaque ipsum totam ab animi esse distinctio. Tempora illum, voluptate accusantium nemo sunt sit repellat maiores fugit dicta, quisquam ducimus ipsum natus excepturi assumenda quod sint rem, corporis similique nesciunt ut. Earum, culpa nam obcaecati maiores ut labore quos excepturi error? Id rerum aspernatur aut illo reiciendis. Sint dolorem recusandae quo accusantium voluptatem. Magni commodi quae voluptates dicta non, placeat laboriosam veniam modi minima molestias quisquam error vero totam, ducimus quia corporis omnis maiores libero velit. Aperiam dicta illo ex, delectus reprehenderit tempora! ;)
