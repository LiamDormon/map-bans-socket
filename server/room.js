module.exports = class Room {
    teamA = null
    teamB = null
    maps = Array.from({length: 7} , (v, i) => ({
        id: i,
        banned: false,
        bannedBy: null
    }))
    turn = 0; // 0 = Team A, 1 = Team B
    startingSide = ""

    takeTurn(map, team) {
        if (this.turn !== team) {
            return false
        }

        if (this.endCondition()) {
            return false
        }

        this.maps[map].banned = true
        this.maps[map].bannedBy = team

        this.turn = (this.turn + 1) % 2

        return true
    }

    endCondition() {
        const mapCount = this.maps.reduce((acc, val) => {
            return acc + !val.banned
        }, 0)

        // end condition is met when there is only 1 map remaining
        if (mapCount === 1) {
            if (!this.map) {
                this.pickWinner()
            }
            return true
        } else {
            return false
        }
    }

    pickWinner() {
        const pickedMap = this.maps.filter(({banned}) => banned === false)
        this.map = pickedMap[0]
    }

    setStartingSide(team, side) {
        if (this.turn !== team) {
            return false
        }

        this.startingSide = side

        return true
    }
}