## Running server
1. Ensure that Node JS >14.0 is installed
2. Open root (index.js) directory
3. Run ```npm run start```

## Documentation
Initialization of [socket.io](http://socket.io/) client:

```jsx
import { io } from "socket.io-client";

const socket = io("http://localhost:4000", {
  query: {
    "username": "Player_1_name"
  }
});
```

Example of emitting/receiving events:

```jsx
// emitting an event to the server
socket.emit('choose', 'paper');

// subscribing and receiving a server event
socket.on('players_received', (players) => {
  console.log('players: ', players) // ['Player_1_name', 'Player_2_name']
})
```

Custom events that you can emit to the server:

```jsx
// used to notify the server of a player's choice
name: “choose”,
payload: “rock” | “paper” | “scissors”
```

```jsx
// used to request a list of all players
name: “get_players”
```

Events you can subscribe to:

```jsx
// username - connected player name
name: “connected”,
payload: { username: string }

// username - disconnected player name
payload: { username: string }

// string[] - names of all players in the game
name: “players_received”,
payload: string[]

// username - name of an opponent
name: “opponent_made_choice”,
payload: { username: string }

// username - player name, choice - a choice made by this player
name: “game_finished”,
payload: { results: [ { username: string, choice:  “rock” | “paper” | “scissors” } ] }
```
