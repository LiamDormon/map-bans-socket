# Counter-Strike Map Bans

A quick and dirty (needs optimisation) solution for picking a map to play in a Best-of-One scrim using websockets for real-time solution between two clients.

# Screenshots

![Landing Page](https://i.imgur.com/1A0N0OY.png)

Once both clients are connected they take turns to ban maps until only one remains.
![Ban Phase](https://i.imgur.com/ptVG05D.png)

Instead of banning a map, the client with the last turn decides which side they start from.
![Map Select Phase](https://i.imgur.com/q4zcut2.png)

# How to run?

- Pull the repository with `git pull git@github.com:LiamDormon/map-bans-socket.git`,
- Then install dependencies with `cd server; pnpm install`,
- Then create a `.env` file from the `.env.template`, your secret should be a long, random string,
- Then simply run with `node server/.` and the application should be running on the default port 3000