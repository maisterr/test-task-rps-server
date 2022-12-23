// Setup basic express server
const express = require("express");
const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const PORT = 4000;

server.listen(PORT, () => {
  console.log("Server listening on port %d", PORT);
});

const players = new Map();
const game = new Map();

io.on("connection", (socket) => {
  if (players.size < 2) {
    const username = socket.handshake.query.username;

    players.set(username);

    socket.broadcast.emit("connected", {
      username,
    });

    socket.on("get_players", () => {
      io.emit(
        "players_received",
        Array.from(players, ([name]) => name)
      );
    });

    socket.on("choose", (chose) => {
      game.set(username, chose);

      if (game.size === 2) {
        io.emit("game_finished", {
          results: Array.from(game, ([username, choice]) => ({
            username,
            choice,
          })),
        });

        game.clear();
      } else {
        socket.broadcast.emit("opponent_made_choice", {
          username,
        });
      }
    });

    socket.on("disconnect", () => {
      players.delete(username);

      // echo globally that a player has left
      socket.broadcast.emit("disconnected", {
        username,
      });
    });
  }
});
