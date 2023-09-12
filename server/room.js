module.exports = class Room {
    teamA = null
    teamB = null
    maps = Array.from({length: 7} , (v, i) => ({
        id: i,
        banned: false,
        bannedBy: null
    }))

    turn = 0; // 0 = Team A, 1 = Team B

    takeTurn(map, team) {
        if (this.turn !== team) {
            return false
        }

        this.maps[map].banned = true
        this.maps[map].bannedBy = team

        this.turn = (this.turn + 1) % 2

        return true
    }
}