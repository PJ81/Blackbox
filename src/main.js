class BBox {
    constructor() {
        this.sel;
        this.again;
        this.check;
        this.score;
        this.done;
        this.atoms;
        this.guesses;
        this.beamCnt;
        this.board;
        this.brdSize;
        this.para;

        this.init();
    }

    updateScore(s) {
        this.score += s || 0;
        this.para.innerHTML = "Running score<br />" + this.score;
    }

    updateColor(i, j, c) {
        const b = document.getElementById("atom" + (i + j * this.brdSize));
        b.style.color = c;
        b.innerHTML = "&#x2688;";
    }

    checkIt() {
        this.check.className = "hide";
        this.again.className = "again";
        this.done = true;
        for (let j = 0; j < this.brdSize; j++) {
            for (let i = 0; i < this.brdSize; i++) {
                if (this.board[i][j].H) {
                    if (this.board[i][j].T) {
                        this.updateColor(i, j, "#0a2");
                    } else {
                        this.updateColor(i, j, "#04c");
                    }
                } else if (this.board[i][j].T) {
                    this.updateColor(i, j, "#f00");
                    this.updateScore(5);
                }
            }
        }
    }

    isValid(n) {
        return n > -1 && n < this.brdSize;
    }

    stepBeam(sx, sy, dx, dy) {
        var s = this.brdSize - 2
        if (dx) {
            if (this.board[sx][sy].H) return {
                r: "H",
                x: sx,
                y: sy
            };
            if (((sx == 1 && dx == 1) || (sx == s && dx == -1)) && ((sy > 0 && this.board[sx][sy - 1].H) ||
                    (sy < s && this.board[sx][sy + 1].H))) return {
                r: "R",
                x: sx,
                y: sy
            };
            if (this.isValid(sx + dx)) {
                if (this.isValid(sy - 1) && this.board[sx + dx][sy - 1].H) {
                    dx = 0;
                    dy = 1;
                }
                if (this.isValid(sy + 1) && this.board[sx + dx][sy + 1].H) {
                    dx = 0;
                    dy = -1;
                }
                sx += dx;
                return this.stepBeam(sx, sy, dx, dy);
            } else {
                return {
                    r: "O",
                    x: sx,
                    y: sy
                };
            }
        } else {
            if (this.board[sx][sy].H) return {
                r: "H",
                x: sx,
                y: sy
            };
            if (((sy == 1 && dy == 1) || (sy == s && dy == -1)) && ((sx > 0 && this.board[sx - 1][sy].H) ||
                    (sx < s && this.board[sx + 1][sy].H))) return {
                r: "R",
                x: sx,
                y: sy
            };
            if (this.isValid(sy + dy)) {
                if (this.isValid(sx - 1) && this.board[sx - 1][sy + dy].H) {
                    dy = 0;
                    dx = 1;
                }
                if (this.isValid(sx + 1) && this.board[sx + 1][sy + dy].H) {
                    dy = 0;
                    dx = -1;
                }
                sy += dy;
                return this.stepBeam(sx, sy, dx, dy);
            } else {
                return {
                    r: "O",
                    x: sx,
                    y: sy
                };
            }
        }
    }

    fireBeam(btn) {
        var sx = btn.i,
            sy = btn.j,
            dx = 0,
            dy = 0;

        if (sx == 0 || sx == this.brdSize - 1) dx = sx == 0 ? 1 : -1;
        else if (sy == 0 || sy == this.brdSize - 1) dy = sy == 0 ? 1 : -1;
        var s = this.stepBeam(sx + dx, sy + dy, dx, dy);
        switch (s.r) {
            case "H":
                btn.innerHTML = "H";
                this.updateScore(1);
                break;
            case "R":
                btn.innerHTML = "R";
                this.updateScore(1);
                break;
            case "O":
                if (s.x == sx && s.y == sy) {
                    btn.innerHTML = "R";
                    this.updateScore(1);
                } else {
                    var b = document.getElementById("fire" + (s.x + s.y * this.brdSize));
                    btn.innerHTML = "" + this.beamCnt;
                    b.innerHTML = "" + this.beamCnt;
                    this.beamCnt++;
                    this.updateScore(2);
                }
        }
    }

    setAtom(btn) {
        if (this.done) return;

        const b = document.getElementById("atom" + (btn.i + btn.j * this.brdSize));
        if (this.board[btn.i][btn.j].T == 0 && this.guesses < this.atoms) {
            this.board[btn.i][btn.j].T = 1;
            this.guesses++;
            b.innerHTML = "&#x2688;";
        } else if (this.board[btn.i][btn.j].T == 1 && this.guesses > 0) {
            this.board[btn.i][btn.j].T = 0;
            this.guesses--;
            b.innerHTML = " ";
        }
        if (this.guesses == this.atoms) this.check.className = "check";
        else this.check.className = "hide";
    }

    startGame() {
        this.score = 0;
        this.updateScore();
        this.check.className = this.again.className = "hide";
        const e = document.getElementById("mid");
        if (e.firstChild) e.removeChild(e.firstChild);

        this.brdSize = this.sel.value;
        this.done = false;

        if (this.brdSize < 5) return;

        const brd = document.createElement("div");
        brd.id = "board";
        brd.style.height = brd.style.width = 5.2 * this.brdSize + "vh"
        e.appendChild(brd);

        let b, c, d;
        for (let j = 0; j < this.brdSize; j++) {
            for (let i = 0; i < this.brdSize; i++) {
                b = document.createElement("button");
                b.i = i;
                b.j = j;
                if (j == 0 && i == 0 || j == 0 && i == this.brdSize - 1 ||
                    j == this.brdSize - 1 && i == 0 || j == this.brdSize - 1 && i == this.brdSize - 1) {
                    b.className = "corner";
                } else {
                    if (j == 0 || j == this.brdSize - 1 || i == 0 || i == this.brdSize - 1) {
                        b.className = "fire";
                        b.id = "fire" + (i + j * this.brdSize);
                    } else {
                        b.className = "atom";
                        b.id = "atom" + (i + j * this.brdSize);
                    }
                    b.addEventListener("click",
                        (e) => {
                            if (e.target.className == "fire" && e.target.innerHTML == " ") this.fireBeam(e.target);
                            else if (e.target.className == "atom") this.setAtom(e.target);
                        }, false);
                }
                b.appendChild(document.createTextNode(" "));
                brd.appendChild(b);
            }
        }

        this.board = new Array(this.brdSize);
        for (let j = 0; j < this.brdSize; j++) {
            this.board[j] = new Array(this.brdSize);
            for (let i = 0; i < this.brdSize; i++) {
                this.board[j][i] = {
                    H: 0,
                    T: 0
                };
            }
        }

        this.guesses = 0;
        this.beamCnt = 1;
        this.atoms = this.brdSize == 7 ? 3 : this.brdSize == 10 ? 4 : 4 + Math.floor(Math.random() * 5);

        let s = this.brdSize - 2;
        for (let k = 0; k < this.atoms; k++) {
            let i, j;
            while (true) {
                i = 1 + Math.floor(Math.random() * s);
                j = 1 + Math.floor(Math.random() * s);
                if (this.board[i][j].H == 0) break;
            }
            this.board[i][j].H = 1;
        }
    }

    init() {
        this.sel = document.createElement("select");
        this.sel.options.add(new Option("5 x 5 [3 atoms]", 7));
        this.sel.options.add(new Option("8 x 8 [4 atoms]", 10));
        this.sel.options.add(new Option("10 x 10 [4 - 8 atoms]", 12));
        this.sel.addEventListener("change", (e) => {
            this.startGame()
        }, false);
        document.getElementById("top").appendChild(this.sel);

        this.check = document.createElement("button");
        this.check.appendChild(document.createTextNode("Check it!"));
        this.check.className = "hide";
        this.check.addEventListener("click", (e) => {
            this.checkIt()
        }, false);

        this.again = document.createElement("button");
        this.again.appendChild(document.createTextNode("New game"));
        this.again.className = "hide";
        this.again.addEventListener("click", (e) => {
            this.startGame()
        }, false);

        this.para = document.createElement("p");
        this.para.className = "txt";
        const d = document.getElementById("bot");

        d.appendChild(this.para);
        d.appendChild(this.check);
        d.appendChild(this.again);

        this.startGame();
    }
}

new BBox();