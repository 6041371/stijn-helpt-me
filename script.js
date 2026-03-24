let playedMatches = {}
let currentMatch = {}
let popup = document.getElementById("scorePopup")

// Synchronisatie helpers
function serializeSchema() {
	// Haal alle cellen en hun klassen op
	return Array.from(document.querySelectorAll('.schemaRow')).map(row =>
		Array.from(row.querySelectorAll('.cell')).map(cell => ({
			team: cell.dataset.team,
			round: cell.dataset.round,
			class: cell.className
		}))
	);
}
function serializeScores() {
	return Array.from(document.querySelectorAll('.scoreRow')).map(row =>
		({
			team: row.dataset.team,
			rounds: Array.from(row.querySelectorAll('.scoreCell')).map(cell => cell.innerText)
		})
	);
}
function applyRemoteSchema(schema, scores, remotePlayedMatches) {
	// Cell klassen herstellen
	if(schema) {
		document.querySelectorAll('.schemaRow').forEach((row, i) => {
			let cells = row.querySelectorAll('.cell');
			schema[i]?.forEach((cell, j) => {
				cells[j].className = cell.class;
			});
		});
	}
	// Scores herstellen
	if(scores) {
		document.querySelectorAll('.scoreRow').forEach((row, i) => {
			let roundCells = row.querySelectorAll('.scoreCell');
			scores[i]?.rounds?.forEach((val, j) => {
				roundCells[j].innerText = val;
			});
		});
		updateTotal();
		sortRanking();
	}
	// Gespeelde wedstrijden herstellen
	if(remotePlayedMatches) {
		playedMatches = { ...remotePlayedMatches };
	}
}
window.applyRemoteSchema = applyRemoteSchema;

document.querySelectorAll(".schemaRow").forEach((row,rowIndex)=>{

let cells = row.querySelectorAll(".cell")

for(let i=0;i<cells.length;i+=2){

let teamA = cells[i]
let teamB = cells[i+1]

let matchId = rowIndex+"_"+i

teamA.addEventListener("click",()=>openMatch(teamA,teamB,matchId))
teamB.addEventListener("click",()=>openMatch(teamA,teamB,matchId))

}

})

function openMatch(teamA,teamB,matchId){
	if(playedMatches[matchId]) return

	// Haal de ronde uit het data-round attribuut van teamA (of teamB, want ze zijn gelijk)
	let round = teamA.dataset.round;

	currentMatch = {teamA,teamB,matchId, round};

	let t1 = teamA.dataset.team
	let t2 = teamB.dataset.team

	document.getElementById("matchTitle").innerText = "Team "+t1+" vs Team "+t2

	document.getElementById("teamAwin").innerText = "🏆 Team "+t1+" wint"
	document.getElementById("teamBwin").innerText = "🏆 Team "+t2+" wint"

	// Enable buttons when popup opens
	document.getElementById("teamAwin").disabled = false;
	document.getElementById("teamBwin").disabled = false;
	document.getElementById("draw").disabled = false;
	document.getElementById("cancel").disabled = false;

	popup.style.display="flex"
}


document.getElementById("teamAwin").onclick = ()=>handlePopupButton("A");
document.getElementById("teamBwin").onclick = ()=>handlePopupButton("B");
document.getElementById("draw").onclick = ()=>handlePopupButton("D");
document.getElementById("cancel").onclick = ()=>handlePopupButton("C");

function handlePopupButton(result) {
	if(result === "C") {
		popup.style.display = "none";
		return;
	}
	// Disable all buttons immediately to prevent double input, but only for scoring actions
	document.getElementById("teamAwin").disabled = true;
	document.getElementById("teamBwin").disabled = true;
	document.getElementById("draw").disabled = true;
	document.getElementById("cancel").disabled = true;
	finishMatch(result);
}

function finishMatch(result){
	let {teamA,teamB,matchId, round} = currentMatch
	let team1 = teamA.dataset.team
	let team2 = teamB.dataset.team

	let pA=0
	let pB=0

	if(result=="A"){
		pA=3
		pB=0
		teamA.classList.add("win")
		teamB.classList.add("lose")
	}
	if(result=="B"){
		pA=0
		pB=3
		teamA.classList.add("lose")
		teamB.classList.add("win")
	}
	if(result=="D"){
		pA=1
		pB=1
		teamA.classList.add("draw")
		teamB.classList.add("draw")
	}

	updateScore(team1,round,pA)
	updateScore(team2,round,pB)
	playedMatches[matchId]=true
	updateTotal()
	sortRanking()
	popup.style.display="none"

	// Stuur update naar backend als in room
	if(window.sendUpdate) {
		window.sendUpdate(serializeSchema(), serializeScores(), playedMatches);
	}
}

function updateScore(team,round,points){

let row = document.querySelector(`.scoreRow[data-team='${team}']`)

row.querySelector(".round"+round).innerText = points

}

function updateTotal(){

document.querySelectorAll(".scoreRow").forEach(row=>{

let total = 0

for(let r=1;r<=6;r++){

let val = row.querySelector(".round"+r).innerText

if(val!="") total += parseInt(val)

}

row.querySelector(".total").innerText = total

})

}

function sortRanking(){

let rows = Array.from(document.querySelectorAll(".scoreRow"))

rows.sort((a,b)=>{

let ta = parseInt(a.querySelector(".total").innerText)
let tb = parseInt(b.querySelector(".total").innerText)

return tb-ta

})

let container = rows[0].parentNode

rows.forEach(r=>container.appendChild(r))

}