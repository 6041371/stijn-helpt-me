// room.js: frontend voor create/join room en synchronisatie

let ws = null;
let currentRoom = null;


function connectRoom(room) {
  currentRoom = room;
  ws = new WebSocket(`ws://${location.hostname}:3001`);
  ws.onopen = () => {
    ws.send(JSON.stringify({ type: "join", room }));
  };
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "init") {
      window.applyRemoteSchema(data.schema, data.scores, data.playedMatches);
    }
    if (data.type === "update") {
      window.applyRemoteSchema(data.schema, data.scores, data.playedMatches);
    }
  };
}



function sendUpdate(schema, scores, playedMatches) {
  if (ws && ws.readyState === 1 && currentRoom) {
    ws.send(
      JSON.stringify({
        type: "update",
        room: currentRoom,
        schema,
        scores,
        playedMatches: playedMatches || {}
      })
    );
  }
}

window.connectRoom = connectRoom;
window.sendUpdate = sendUpdate;
