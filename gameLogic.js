		const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        let players = [];
		let diceIsSpinning = false;
        let currentPlayerIndex = 0;
        let totalSquares = 25;
		let isNotClose = true;
		let possiblerules=["Bebe 1", 
		"Bebe 2", "Bebe 5", "Manda 1", 
		"Manda 2", "Manda 5", "Reparte 5", 
		"Reparte 10", "Reparte 15", "Bebe vaso entero", 
		"Bebe medio vaso", "Bebe medio vaso tú y arrastra a alguien", "Norma", "Norma", "Norma", "Mini juego", "Mini juego",
		"Manda vaso entero", "Manda medio vaso", "Relax", "Relax especial, lo que te toque lo mandas", 
		"Esclavo", "Mini juego", "Bebe, 5 vueltas y vuelve a beber", "Muerte, bebe 10 y empieza de 0",
		"Beben los hombres", "Beben las mujeres", "Bebe el más alto", "Bebe el más bajo", "Cara o cruz, si cara mandas vaso, si cruz bebes vaso",
		"Recarga y bébete el vaso entero", "Tira el dado, bebe lo que saques", "Ruleta de la fortuna", "Todos beben 3", "Todos beben 5 menos tú", "Muerte"]
        let rules = { 3: "Bebe 1", 6: "Manda 2", 13: "Bebe 5", 22: "Todos beben" };
        const colors = ['#ff4757', '#2ed573', '#1e90ff', '#ffa502', '#eccc68', '#70a1ff'];
		const tileImages = [
			'./assets/tiles/1.png', 
			'./assets/tiles/2.png', 
			'./assets/tiles/3.png', 
			'./assets/tiles/4.png', 
			'./assets/tiles/5.png'
		];
		let wheelRules = ["BEBE 15", "BEBE 20", "BEBE DOS VASOS (O UNO LLENITO)", "CÁLLATE", "ESCLAVO INVERTIDO", "VEGETAL", "UN TURNO OJOS CERRADOS", "REPARTE 30"];
 
		//Function for showing up the board
		
        function toggleGame() {
            document.getElementById('start-screen').classList.add('hidden');
            document.getElementById('setup-screen').classList.remove('hidden');
        }
		
		//Function to showing up the configuration screen
		
        function toggleConfig(show) {
            document.getElementById('setup-screen').classList.toggle('hidden', show);
            document.getElementById('config-screen').classList.toggle('hidden', !show);
            if(show) updateRulesList();
        }
 
		//Function to add a new player
 
        /*function addPlayer() {
            const input = document.getElementById('name-input');
            if (input.value.trim() !== "") {
                players.push({ 
                    name: input.value, 
                    pos: 0, 
                    color: colors[players.length % colors.length],
                    id: `pawn-${players.length}`, 
					glasses: 0
                });
                input.value = "";
                document.getElementById('player-display').innerHTML = players.map(p => `<div style="color:${p.color}">● ${p.name}</div>`).join('');
            }
        }
		*/
		
		function updatePlayerList() {
			document.getElementById('player-display').innerHTML = players.map((p, index) => `
				<div class="player-entry" style="color:${p.color}; display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
					<span>● ${p.name}</span>
					<span onclick="removePlayer(${index})" style="color:red; cursor:pointer; font-weight:bold; margin-left:10px;">✖</span>
				</div>
			`).join('');
		}
		
		function addPlayer() {
			const input = document.getElementById('name-input');
			if (input.value.trim() !== "") {
				players.push({ 
					name: input.value, 
					pos: 0, 
					color: colors[players.length % colors.length],
					id: `pawn-${players.length}`, 
					glasses: 0
				});
				input.value = "";
				updatePlayerList(); // Llamamos a una función separada para refrescar la lista
			}
		}
		
		function removePlayer(index) {
			// Eliminamos el jugador del array
			players.splice(index, 1);
			
			// Recalculamos los IDs y colores de los que quedan para que no haya huecos raros (opcional)
			players.forEach((p, idx) => {
				p.id = `pawn-${idx}`;
				p.color = colors[idx % colors.length];
			});
			
			// Actualizamos la lista visual
			updatePlayerList();
		}
		//Function to remove a Player
		
		//Function to display the dice
		
		function drawDice(){
			const overlay = document.getElementById('dice-overlay');
			const dice = document.getElementById('dice');
			document.getElementById('closeDice').classList.add('hidden');
			document.getElementById('launchDice').classList.remove('hidden');
			diceIsSpinning = false;
			overlay.classList.remove('hidden');
			
			dice.style.transition = 'none';
			dice.style.transform = 'rotateX(0deg) rotateY(0deg)';
			
			overlay.style.display = 'flex';
			
		}
		
		//Function to make the rotation of the dice
		
		async function rollManualDice(event) {
			document.getElementById('closeDice').classList.add('hidden');
			

			document.getElementById('closeDice').classList.add('hidden');
		
			if (diceIsSpinning) return;
			diceIsSpinning = true;
			
			const dice = document.getElementById('dice');
			let die = 0;
			die = Math.floor(Math.random() * 6) + 1;
			// CSS Coords dictionary for positioning dice faces
			const rotations = {
				1: 'rotateX(0deg) rotateY(0deg)',
				2: 'rotateX(0deg) rotateY(-90deg)',
				3: 'rotateX(-90deg) rotateY(0deg)',
				4: 'rotateX(90deg) rotateY(0deg)',
				5: 'rotateX(0deg) rotateY(90deg)',
				6: 'rotateX(180deg) rotateY(0deg) rotateZ(180deg)'
			};
			//Making extra spins to seems like it is actually rotating until falling on a number
			const extraSpinX = (Math.floor(Math.random() * 2) + 4) * 360;
			const extraSpinY = (Math.floor(Math.random() * 2) + 4) * 360;

			//Applying soft transition and another final rotation to show the winning face
			dice.style.transition = 'transform 1.5s cubic-bezier(0.2, 0.8, 0.3, 1.1)';
			dice.style.transform = `rotateX(${extraSpinX}deg) rotateY(${extraSpinY}deg) ${rotations[die]}`;

			//Waiting for the css transition actually ends
			await sleep(1600);
			
			//An small pause to see the result
			await sleep(400);
			
			document.getElementById('closeDice').classList.remove('hidden');
			
			
			diceIsSpinning = false;
		}
		
		//Function to close the dice overlay
		function closeDice(){
			const btn = document.getElementById('closeDice');
			if (btn) {
				btn.style.display = 'none'; 
				btn.classList.add('hidden');
			}
			document.getElementById('launchDice').classList.add('hidden');
			document.getElementById('dice-overlay').classList.add('hidden');
		}
		
		//Function to update the list that is shown up to the user
        function updateRulesList() {
            document.getElementById('rules-list').innerHTML = Object.entries(rules).map(([sq, txt]) => `
                <div class="rule-item"><span>#${sq}: ${txt}</span><span onclick="deleteRule(${sq},1)" style="color:red">✖</span></div>
            `).join('');
			document.getElementById('wheelRules-list').innerHTML = Object.entries(wheelRules).map(([sq, txt]) => `
                <div class="rule-item"><span>#${sq}: ${txt}</span><span onclick="deleteRule(${sq},2)" style="color:red">✖</span></div>
            `).join('');
        }
 
		//Function to delete an user given rule
        function deleteRule(k,m) { 
			if(m == 1){
				delete rules[k];
			}
			if(m == 2){
				delete wheelRules[k];
			}
			updateRulesList(); 
		}
		
		
		//Function to autofil all the rules
		function randomizeRules(){
			const boardsize = document.getElementById('config-total-squares').value;
			for(let i=1; i<boardsize; i++){
				if(i==1){
					rules[i] = possiblerules[Math.floor(Math.random()*possiblerules.length)];
				}
				else{
					let norm;
					let failed=true;
					//This while is only for not repeating the same rule, so it is at least 3 squares without the same rule
					while(failed){
						norm = possiblerules[Math.floor(Math.random()*possiblerules.length)]
						if (norm != rules[i-1] && norm != rules[i-2]){
							rules[i]=norm;
							failed=false;
						}
					}
					
				}
			}
			updateRulesList();
		}
		
		//Function to add a rule to the list
        function saveRule(m) {
			if(m == 1){
				const boardsize = document.getElementById('config-total-squares').value;
				const sq = document.getElementById('rule-sq-input').value;
				const txt = document.getElementById('rule-text-input').value;
				//We keep the last square without rule, because the last one is only the finish
				if(boardsize==sq){
					alert("¡La última casilla no puede tener norma!");
				}
				else{
					if(sq && txt) { rules[sq] = txt; updateRulesList(); }
				}
			}
			if(m == 2){
				wheelRules.push(document.getElementById('wheelRule-text-input').value)
				updateRulesList();
			}
        }
 
		//Function to start the game, creating the pawns for every player
        function startGame() {
			let lastlastTile='';
			let lastTile = '';
			let currentTile = '';
            if (players.length === 0) {
				alert("Añade al menos 1 jugador");
				return;
			}
            totalSquares = parseInt(document.getElementById('config-total-squares').value);
            document.getElementById('setup-screen').classList.add('hidden');
            document.getElementById('game-screen').classList.remove('hidden');
 
            const board = document.getElementById('board');
            board.innerHTML = "";
            for (let i = 1; i <= totalSquares; i++) {
				failed = true;
				while(failed){
					currentTile = tileImages[Math.floor(Math.random()*tileImages.length)]
					if(currentTile!=lastTile && currentTile!=lastlastTile){
						failed=false;
						lastlastTile=lastTile;
						lastTile=currentTile;
					}
				}
				const backgroundStyle = `background-image: linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url('${currentTile}');`;
				const ruleText = rules[i] ? rules[i] : "";
                if (rules[i]){ 
				
					board.innerHTML += `
						<div class="square" id="sq-${i}" style="${backgroundStyle}" onclick="showRule('REGLA', '${ruleText}', 1)">
							<span class="sq-num">${i}</span>
							<div class="rule-display">${ruleText}</div>
						</div>`;
				}
				else{
	                board.innerHTML += `<div class="square" id="sq-${i}" style="${backgroundStyle})"><span class="sq-num">${i}</span></div>`;
				}
            }
 
            const container = document.getElementById('board-container');
            players.forEach((p, idx) => {
                const pawn = document.createElement('div');
                pawn.className = 'player-pawn';
                pawn.id = p.id;
                pawn.style.backgroundColor = p.color;
                // This is just a offset so when two or more players are on the same square they dont overlaps perfectly
                pawn.style.marginTop = `${(idx * 4)}px`;
                pawn.style.marginLeft = `${(idx * 4)}px`;
                container.appendChild(pawn);
                movePawn(p, 0);
            });
			
            updateTurnDisplay();
        }
		
		
		//Function to animate the movement of the pawns
        function movePawn(player, position) {
			const pawn = document.getElementById(player.id);
			if (!pawn) return;

			if (position === 0) {
				pawn.style.opacity = "0";
				return;
			}
			
			pawn.style.opacity = "1";
			const targetSquare = document.getElementById(`sq-${position}`);
			const boardContainer = document.getElementById('board-container');

			if (targetSquare && boardContainer) {
				const top = targetSquare.offsetTop + (targetSquare.offsetHeight / 2) - 10;
				const left = targetSquare.offsetLeft + (targetSquare.offsetWidth / 2) - 10;

				pawn.style.top = `${top}px`;
				pawn.style.left = `${left}px`;
			}
		}
 
		//MultiFunction to pop up different messages
		function showRule(title, message, type) {
			return new Promise((resolve)=>{
				const overlay = document.getElementById('notification-overlay');
				document.getElementById('notification-title').textContent = title;
				document.getElementById('notification-text').textContent = message;
				
				overlay.classList.remove('hidden');
				overlay.style.display = 'flex';
				//The different types are for showing just an ok button (type 1) or resetGame and mainMenu buttons
				if(type==1){

					document.getElementById('closeNotification').classList.remove('hidden');
				}
				if(type==2){

					document.getElementById('resetGame').classList.remove('hidden');
					document.getElementById('mainMenu').classList.remove('hidden');
				}
				document.getElementById('closeNotification').onclick = () => {
					closeNotification();
					resolve();     // ¡Esto es lo que desbloquea el 'await'!
				};
			});
		}
		
		//Function to close the notification mostle for type 1 popup
		function closeNotification() {
			document.getElementById('notification-overlay').classList.add('hidden');
			document.getElementById('closeNotification').classList.add('hidden');

		}
		
		//Function to reset the game, all pawns and stats (minus the glasses), so player doesn't need to return to main menu
		function resetGame(){
			document.getElementById('notification-overlay').classList.add('hidden');
			document.getElementById('resetGame').classList.add('hidden');
			document.getElementById('mainMenu').classList.add('hidden');
			
			currentPlayerIndex=0;
			players.forEach((pl, index) => {
				pl.pos=0;
				movePawn(pl, 0);
				updateTurnDisplay();
			});
		}
		
		//Function to close the current game and return to main menu, deleting all the pawns
		function mainMenuReturn(){
			document.getElementById('notification-overlay').classList.add('hidden');
			document.getElementById('resetGame').classList.add('hidden');
			document.getElementById('mainMenu').classList.add('hidden')
			document.getElementById('setup-screen').classList.remove('hidden');
            document.getElementById('game-screen').classList.add('hidden');
			resetGame();
			players.forEach(p => {
				const existingPawn = document.getElementById(p.id);
				if (existingPawn) {
					existingPawn.remove(); // Esto elimina el DIV del peón del mapa
				}
			});
		}
		function mainMenuReturnUtils(){
			document.getElementById('notification-overlay').classList.add('hidden');
			document.getElementById('resetGame').classList.add('hidden');
			document.getElementById('mainMenu').classList.add('hidden')
			document.getElementById('setup-screen').classList.remove('hidden');
            document.getElementById('game-screen').classList.add('hidden');
			document.getElementById('utilsWindow').classList.add('hidden');
			resetGame();
			players.forEach(p => {
				const existingPawn = document.getElementById(p.id);
				if (existingPawn) {
					existingPawn.remove(); // Esto elimina el DIV del peón del mapa
				}
			});
			
		}
		
		//Function to make every player turn
		async function takeTurn() {
			
			//Showing the dice container
			const diceContainer = document.getElementById('dice-overlay');
			const dice = document.getElementById('dice');
			const p = players[currentPlayerIndex];

			//Setting the dice and position
			dice.dataset.mode = "auto"; 
			dice.style.transition = 'none';
			dice.style.transform = 'rotateX(0deg) rotateY(0deg)';
			
			//Rendering the dice in the center
			diceContainer.classList.remove('hidden');
			diceContainer.style.display = 'flex';
			
			//A little pause for the browser to actually set the reset
			await sleep(50); 

			//Getting the final result
			let die = 0;
			die = Math.floor(Math.random() * 6) + 1;
			
			// CSS Coords dictionary for positioning dice faces
			const rotations = {
				1: 'rotateX(0deg) rotateY(0deg)',
				2: 'rotateX(0deg) rotateY(-90deg)',
				3: 'rotateX(-90deg) rotateY(0deg)',
				4: 'rotateX(90deg) rotateY(0deg)',
				5: 'rotateX(0deg) rotateY(90deg)',
				6: 'rotateX(180deg) rotateY(0deg) rotateZ(180deg)'
			};

			//Random spins to look like the dice is actually spinning to the final result
			const extraSpinX = (Math.floor(Math.random() * 3) + 3) * 360; 
			const extraSpinY = (Math.floor(Math.random() * 3) + 3) * 360; 


			dice.style.transition = 'transform 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
			dice.style.transform = `rotateX(${extraSpinX}deg) rotateY(${extraSpinY}deg) ${rotations[die]}`;

			//Waiting to the dice to end the animation to move the pawn
			await sleep(1500);

			//Hidding the dice and calculating the movement
			diceContainer.classList.add('hidden');

			let currentPos = p.pos;
			let targetPos = currentPos + die;
			let finalPos;

			//In this game you have to arrive with the exact number to the end, so if you get a bigger number you come back the rest of the remaining movements
			if (targetPos > totalSquares) {
				finalPos = totalSquares - (targetPos - totalSquares);
			} else {
				finalPos = targetPos;
			}
			
			//Moving the pawn, it iterates so it moves into every square
			for (let i = currentPos + 1; i <= Math.min(targetPos, totalSquares); i++) {
				movePawn(p, i);
				await sleep(300); 
			}

			if (targetPos > totalSquares) {
				for (let i = totalSquares - 1; i >= finalPos; i--) {
					movePawn(p, i);
					await sleep(300);
				}
			}


			p.pos = finalPos; 

			//Rules processing
			let msg = `${p.name} sacó ${die}. `;
			if (rules[p.pos]) {
				
				//Showing the rule with the popup function
				await showRule("REGLA",rules[p.pos], 1);
				
				//Controlling special events
				
				//If the rule contains the word Muerte the pawn starts all over again
				if (rules[p.pos].toLowerCase().includes("muerte")) {
					p.pos = 0;
					await sleep(500); 
					movePawn(p, 0);
					currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
					updateTurnDisplay();
				}
				//If the rule contains Rulete it launchs the slot minigame
				if (rules[p.pos].toLowerCase().includes("ruleta")) openSlot();
				//If the rule contains dado it launchs the dice minigame
				if (rules[p.pos].toLowerCase().includes("dado")) drawDice(); 
				//If the rule contains cruz it launchs the coin minigame
				if (rules[p.pos].toLowerCase().includes("cruz")) openCoin();

			}

			document.getElementById('action-text').innerText = msg;

			//Controlling end of game or next turn
			if (p.pos === totalSquares) {
				await sleep(500);
				showRule("GANADOR", `🏆 ¡ENHORABUENA! ${p.name} ha ganado.`, 2);
			} else {
	
				currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
				await sleep(1000); 
				updateTurnDisplay();
			}
		}
		//Function to bring up the utils screen so the player can return to main menu or use manually a minigame
		function utils(){
			document.getElementById('game-screen').classList.add('hidden');
			document.getElementById('utilsWindow').classList.remove('hidden');
		}
		
		//Function to hide the utils screen
		function closeUtils(){
			document.getElementById('game-screen').classList.remove('hidden');
			document.getElementById('utilsWindow').classList.add('hidden');
		}
		
		//Function to update the turn display so you can see where are every player and how many glasses had it drink
        function updateTurnDisplay() {
			const p = players[currentPlayerIndex];
			
			const results = document.getElementById('results'); 
			
			document.getElementById('turn-display').innerText = `Turno de: ${p.name}`;
			document.getElementById('turn-display').style.color = p.color;

			results.innerHTML = `
				<div class="titles">
					<div class="posTitle">POSICIÓN</div>
					<div class="glassesTitle">VASOS</div>
				</div>
			`; 

			players.forEach((pl, index) => {
				results.innerHTML += `
					<div class="result">
						<div class="positions">
							<div class="name" style="color:${pl.color}">${pl.name}</div>
							<div class="position" style="color:${pl.color}">${pl.pos}</div>
						</div>
						<div class="division">|</div>
						<div class="glasses">
							<button class="btn btn-removeglass" onClick="addGlass(${index},false)">-</button>
							<div style="color:${pl.color}">${pl.glasses}</div>
							<button class="btn btn-addglass" onClick="addGlass(${index},true)">+</button>
						</div>
					</div>`;
			});
		}
		
		//Function to add a glass drank
		function addGlass(player, isAdding){
			if(isAdding){
				players[player].glasses++;
			}
			else{
				if (players[player].glasses!=0){
					players[player].glasses--;
				}
			}
			updateTurnDisplay();
		}
		
		//Function to flip the coin
		async function coinFlip() {
			const coin = document.getElementById('coin');
			
			//Check if the transition is active
			coin.style.transition = 'transform 2s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

			//Get the result and calculate the spins, making 5 turns and a hald in case it is tails
			const isHeads = Math.random() < 0.5;
			const flips = 1800; // 5 vueltas
			const finalRotation = isHeads ? flips : flips + 180;

			//Applying the rotation
			coin.style.transform = `rotateY(${finalRotation}deg)`;

			//Waiting for the animation to end
			await new Promise(resolve => setTimeout(resolve, 2100));

			//Showing the close button
			document.getElementById('closeCoin').classList.remove('hidden');
		}
		
		//Function to show the coin overlay
		function openCoin() {
			const overlay = document.getElementById('coin-overlay');
			const coin = document.getElementById('coin');
			
			//Resetting the coin
			coin.style.transition = 'none';
			coin.style.transform = 'rotateY(0deg)';
			document.getElementById('btn-spin-coin').classList.remove('hidden');
			document.getElementById('closeCoin').classList.add('hidden');
			overlay.classList.remove('hidden')
			overlay.style.display = 'flex';
		}
		
		//Function to close the coin overlay
		function closeCoin() {
			const overlay = document.getElementById('coin-overlay');
			const btnClose = document.getElementById('closeCoin');
			const coin = document.getElementById('coin');

			overlay.classList.add('hidden');
			btnClose.classList.add('hidden');

			//Resetting the coin so the next time it doesn't visually glitches
			if (coin) {
				coin.style.transition = 'none';
				coin.style.transform = 'rotateY(0deg) rotateX(0deg)';
			}
		}
		



//Function to show the slot overlay
function drawSlot() {
    const reel = document.getElementById('slot-reel');
    
    // Safety Check: If the element doesn't exist yet, stop here
    if (!reel) {
        console.error("Error: 'slot-reel' element not found in the DOM.");
        return;
    }

    reel.innerHTML = '';

    const iterations = 12;
    for (let i = 0; i < iterations; i++) {
        wheelRules.forEach(text => {
            const div = document.createElement('div');
            div.className = 'slot-item';
            div.textContent = text;
            reel.appendChild(div);
        });
    }
    
    console.log("Slot reel populated with " + reel.children.length + " items.");
}

async function spinSlot() {
    const reel = document.getElementById('slot-reel');
    const btnSpin = document.getElementById('btn-spin-slot');
    const itemHeight = 80; // Your CSS height
    

    // We start at the height of one full set of prizes so there's content above
    const startingOffset = wheelRules.length * itemHeight;
    
    reel.style.transition = 'none';
    reel.style.transform = `translateY(-${startingOffset}px)`;

    //Forcing reflow
    reel.offsetHeight; 

    //Setting up the transition
    reel.style.transition = 'transform 4s cubic-bezier(0.1, 0, 0.1, 1)';

    //Calculate the result
    const winnerIndex = Math.floor(Math.random() * wheelRules.length);
    
    //Spin 4 times, is long enought to see like random without running out of text
    const setsToSpin = 4; 
    const finalOffset = (setsToSpin * wheelRules.length + winnerIndex) * itemHeight;

    //Starting the animation
    reel.style.transform = `translateY(-${finalOffset}px)`;

    //Waiting for the animation to end
    await new Promise(resolve => setTimeout(resolve, 4100));

    //Showing up the close button
    document.getElementById('closeSlot').classList.remove('hidden');
}

//Function to open the slot and calling for drawing the actual slot
function openSlot() {
    document.getElementById('slot-overlay').classList.remove('hidden');
    document.getElementById('slot-reel').style.transition = 'none'; // Reset sin que se vea
    document.getElementById('slot-reel').style.transform = 'translateY(0)';
    drawSlot();
}


//Function to close the slot
function closeSlot(){
	 document.getElementById('slot-overlay').classList.add('hidden');
	    document.getElementById('closeSlot').classList.add('hidden');

}
