<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="style.css">
<script src="script.js"defer></script>
<title>Flitz Schema</title>


</head>

<body>

<h1>Wedstrijdschema</h1>
<h2>12 Teams</h2>

<div class="container">

<div class="header">
<div>Games</div>
<div>Ronde 1</div>
<div>Ronde 2</div>
<div>Ronde 3</div>
<div>Ronde 4</div>
<div>Ronde 5</div>
<div>Ronde 6</div>
</div>

<?php

$schema = [
[1,2,3,5,4,10,7,11,12,6,9,8],
[3,4,1,11,2,8,6,10,9,7,12,5],
[5,6,2,9,1,3,8,12,4,11,10,7],
[7,8,4,6,9,12,1,5,3,10,2,11],
[9,10,7,12,11,5,2,4,1,8,3,6],
[11,12,8,10,6,7,3,9,2,5,1,4]
];

for($i=0;$i<6;$i++){

echo '<div class="schemaRow">';

echo '<input class="gameInput">';

for($j=0;$j<12;$j++){
	// $i = ronde (van boven naar beneden), $j = kolom (van links naar rechts)
	$round = $j/2+1; // 0,1 => 1; 2,3 => 2; ...
	$team = $schema[$i][$j];
	$col = floor($j/2)+1; // kolomnummer van links naar rechts (1 t/m 6)
	echo '<div class="cell r'.$col.'" data-team="'.$team.'" data-round="'.$col.'">'.$team.'</div>';
}

echo '</div>';

}

?>

<div class="scoreTitle">Puntenstand</div>

<div class="scoreHeader">
<div>Team</div>
<div>R1</div>
<div>R2</div>
<div>R3</div>
<div>R4</div>
<div>R5</div>
<div>R6</div>
<div>Totaal</div>
</div>

<?php

for($t=1;$t<=12;$t++){

echo '<div class="scoreRow" data-team="'.$t.'">';

echo '<div class="teamName">Team '.$t.'</div>';

for($r=1;$r<=6;$r++){
echo '<div class="scoreCell round'.$r.'"></div>';
}

echo '<div class="scoreCell total">0</div>';

echo '</div>';

}

?>

</div>


<div id="scorePopup" class="popup">

<div class="popupBox">

<h3 id="matchTitle"></h3>

<button id="teamAwin"></button>

<button id="draw">🤝 Gelijkspel</button>

<button id="teamBwin"></button>

<button id="cancel">Annuleren</button>

</div>

</div>

</div>

</div>
</body>
</html>