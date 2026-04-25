	const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        let players = [];
		let diceIsSpinning = false;
        let currentPlayerIndex = 0;
        let totalSquares = 25;
		let possiblerules=["Bebe 1", 
		"Bebe 2", "Bebe 5", "Manda 1", 
		"Manda 2", "Manda 5", "Reparte 5", 
		"Reparte 10", "Reparte 15", "Bebe vaso entero", 
		"Bebe medio vaso", "Bebe medio vaso tú y arrastra a alguien", 
		"Manda vaso entero", "Manda medio vaso", "Relax", "Relax especial, lo que te toque lo mandas", 
		"Esclavo", "Minijuego", "Bebe, 5 vueltas y vuelve a beber", "Muerte, bebe 10 y empieza de 0",
		"Beben los hombres", "Beben las mujeres", "Bebe el más alto", "Bebe el más bajo", "Cara o cruz, si cara mandas vaso, si cruz bebes vaso",
		"Recarga y bébete el vaso entero", "Tira el dado, bebe lo que saques", "Ruleta de la fortuna", "Todos beben 3", "Todos beben 5 menos tú"]
        let rules = { 3: "Bebe 1", 6: "Manda 2", 13: "¡OCA! Salta a la 16", 22: "Todos beben" };
        const colors = ['#ff4757', '#2ed573', '#1e90ff', '#ffa502', '#eccc68', '#70a1ff'];
 
        function toggleGame() {
            document.getElementById('start-screen').classList.add('hidden');
            document.getElementById('setup-screen').classList.remove('hidden');
        }
 
        function toggleConfig(show) {
            document.getElementById('setup-screen').classList.toggle('hidden', show);
            document.getElementById('config-screen').classList.toggle('hidden', !show);
            if(show) updateRulesList();
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
                document.getElementById('player-display').innerHTML = players.map(p => `<div style="color:${p.color}">● ${p.name}</div>`).join('');
            }
        }
		
		function drawDice(){
			const overlay = document.getElementById('dice-overlay');
			const dice = document.getElementById('dice');
			document.getElementById('closeDice').classList.add('hidden');
			document.getElementById('launchDice').classList.remove('hidden');
			diceIsSpinning = false;
			// Quitamos la transición para que el reset al "1" sea instantáneo e invisible
			dice.style.transition = 'none';
			dice.style.transform = 'rotateX(0deg) rotateY(0deg)';
			
			overlay.style.display = 'flex';
			
		}
		async function rollManualDice(event) {
			document.getElementById('closeDice').classList.add('hidden');
			const btn = document.getElementById('closeDice');
			if (btn) {
				btn.style.display = 'none'; 
				// Por si acaso, también la clase
				btn.classList.add('hidden');
			}
			if (diceIsSpinning) return;
			diceIsSpinning = true;
			
			const dice = document.getElementById('dice');
			const die = Math.floor(Math.random() * 6) + 1;

			// Coordenadas finales
			const rotations = {
				1: 'rotateX(0deg) rotateY(0deg)',
				2: 'rotateX(0deg) rotateY(-90deg)',
				3: 'rotateX(-90deg) rotateY(0deg)',
				4: 'rotateX(90deg) rotateY(0deg)',
				5: 'rotateX(0deg) rotateY(90deg)',
				6: 'rotateX(180deg) rotateY(0deg) rotateZ(180deg)'
			};

			// Vueltas extra para que el usuario vea el giro
			const extraSpinX = (Math.floor(Math.random() * 2) + 4) * 360;
			const extraSpinY = (Math.floor(Math.random() * 2) + 4) * 360;

			// Activar transición y aplicar giro total
			dice.style.transition = 'transform 1.5s cubic-bezier(0.2, 0.8, 0.3, 1.1)';
			dice.style.transform = `rotateX(${extraSpinX}deg) rotateY(${extraSpinY}deg) ${rotations[die]}`;

			// ESPERAR a que la animación de 1.5s termine
			await sleep(1600);

			// PAUSA EXTRA: Para que el usuario vea el dado quieto antes del alert
			await sleep(400);
			
			btn.classList.remove('hidden');
			btn.style.display = '';
			
			// Opcional: Cerrar después del alert
			
			diceIsSpinning = false;
		}
		
		function closeDice(){
			const btn = document.getElementById('closeDice');
			if (btn) {
				btn.style.display = 'none'; 
				btn.classList.add('hidden');
			}
			document.getElementById('launchDice').classList.add('hidden');
			document.getElementById('dice-overlay').style.display = 'none';
		}
        function updateRulesList() {
            document.getElementById('rules-list').innerHTML = Object.entries(rules).map(([sq, txt]) => `
                <div class="rule-item"><span>#${sq}: ${txt}</span><span onclick="deleteRule(${sq})" style="color:red">✖</span></div>
            `).join('');
        }
 
        function deleteRule(k) { delete rules[k]; updateRulesList(); }
        function saveRule() {
            const sq = document.getElementById('rule-sq-input').value;
            const txt = document.getElementById('rule-text-input').value;
            if(sq && txt) { rules[sq] = txt; updateRulesList(); }
        }
 
        function startGame() {
            if (players.length === 0) return;
            totalSquares = parseInt(document.getElementById('config-total-squares').value);
            document.getElementById('setup-screen').classList.add('hidden');
            document.getElementById('game-screen').classList.remove('hidden');
 
            const board = document.getElementById('board');
            board.innerHTML = "";
            for (let i = 1; i <= totalSquares; i++) {
                board.innerHTML += `<div class="square" id="sq-${i}"><span class="sq-num">${i}</span></div>`;
                if (rules[i]) document.getElementById(`sq-${i}`).style.borderColor = "#f1c40f";
            }
 
            // Inject Pawns into the container
            const container = document.getElementById('board-container');
            players.forEach((p, idx) => {
                const pawn = document.createElement('div');
                pawn.className = 'player-pawn';
                pawn.id = p.id;
                pawn.style.backgroundColor = p.color;
                // Offset slightly so they don't overlap perfectly
                pawn.style.marginTop = `${(idx * 4)}px`;
                pawn.style.marginLeft = `${(idx * 4)}px`;
                container.appendChild(pawn);
                movePawn(p, 0); // Initialize off-board
            });
            updateTurnDisplay();
        }
 
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
				// Calculamos la posición del cuadrado respecto al contenedor del tablero
				const top = targetSquare.offsetTop + (targetSquare.offsetHeight / 2) - 10;
				const left = targetSquare.offsetLeft + (targetSquare.offsetWidth / 2) - 10;

				// Aplicamos la posición
				pawn.style.top = `${top}px`;
				pawn.style.left = `${left}px`;
			}
		}
 
		async function takeTurn() {
			
			const diceContainer = document.getElementById('dice-overlay');
			const dice = document.getElementById('dice');
			const p = players[currentPlayerIndex];

			// 1. PREPARACIÓN E INICIO DE ANIMACIÓN DEL DADO
			// Resetear posición y modo para evitar conflictos con la utilidad manual
			dice.dataset.mode = "auto"; 
			dice.style.transition = 'none';
			dice.style.transform = 'rotateX(0deg) rotateY(0deg)';
			
			// Mostrar el dado en el centro
			diceContainer.style.display = 'flex';
			
			// Pequeña pausa para que el navegador registre el reset antes de girar
			await sleep(50); 

			// 2. LANZAMIENTO
			const die = Math.floor(Math.random() * 6) + 1;
			
			// Configuración de caras (Z-axis corregido para el 6)
			const rotations = {
				1: 'rotateX(0deg) rotateY(0deg)',
				2: 'rotateX(0deg) rotateY(-90deg)',
				3: 'rotateX(-90deg) rotateY(0deg)',
				4: 'rotateX(90deg) rotateY(0deg)',
				5: 'rotateX(0deg) rotateY(90deg)',
				6: 'rotateX(180deg) rotateY(0deg) rotateZ(180deg)'
			};

			// Giros aleatorios potentes (mínimo 3 vueltas completas)
			const extraSpinX = (Math.floor(Math.random() * 3) + 3) * 360; 
			const extraSpinY = (Math.floor(Math.random() * 3) + 3) * 360; 

			// Aplicar animación
			dice.style.transition = 'transform 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
			dice.style.transform = `rotateX(${extraSpinX}deg) rotateY(${extraSpinY}deg) ${rotations[die]}`;

			// Esperamos a que el dado termine de girar antes de mover el peón
			await sleep(1500);

			// 3. OCULTAR DADO Y CALCULAR POSICIÓN
			diceContainer.style.display = 'none';

			let currentPos = p.pos;
			let targetPos = currentPos + die;
			let finalPos;

			// Lógica de rebote
			if (targetPos > totalSquares) {
				finalPos = totalSquares - (targetPos - totalSquares);
			} else {
				finalPos = targetPos;
			}

			// 4. MOVIMIENTO VISUAL DEL PEÓN (CASILLA POR CASILLA)
			// Movimiento hacia adelante (hasta la meta o el tope)
			for (let i = currentPos + 1; i <= Math.min(targetPos, totalSquares); i++) {
				movePawn(p, i);
				await sleep(300); 
			}

			// Movimiento de rebote (hacia atrás si se pasó)
			if (targetPos > totalSquares) {
				for (let i = totalSquares - 1; i >= finalPos; i--) {
					movePawn(p, i);
					await sleep(300);
				}
			}

			// Actualizar posición lógica del jugador
			p.pos = finalPos; 

			// 5. PROCESAR REGLAS DE LA CASILLA
			let msg = `${p.name} sacó ${die}. `;
			if (rules[p.pos]) {
				msg += rules[p.pos];
				
				// Ejecución de efectos especiales
				if (rules[p.pos].includes("Muerte")) {
					p.pos = 0;
					await sleep(500); // Pausa dramática antes de volver al inicio
					movePawn(p, 0);
				}
				if (rules[p.pos].includes("Ruleta")) wheelOfFortune();
				if (rules[p.pos].includes("dado")) diceDraw(); 
				if (rules[p.pos].includes("cruz")) coinFlip();
			}

			document.getElementById('action-text').innerText = msg;

			// 6. CONTROL DE FIN DE PARTIDA O CAMBIO DE TURNO
			if (p.pos === totalSquares) {
				await sleep(500);
				alert(`🏆 ¡ENHORABUENA! ${p.name} ha ganado.`);
				location.reload();
			} else {
				// Pasar al siguiente jugador
				currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
				// Pausa para que el jugador asimile dónde ha caído
				await sleep(1000); 
				updateTurnDisplay();
			}
		}
		
		function utils(){
			document.getElementById('game-screen').classList.add('hidden');
			document.getElementById('utilsWindow').classList.remove('hidden');
		}
		function closeUtils(){
			document.getElementById('game-screen').classList.remove('hidden');
			document.getElementById('utilsWindow').classList.add('hidden');
		}
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
		function addGlass(player, isAdding){
			if(isAdding){
				players[player].glasses++;
			}
			else{
				players[player].glasses--;
			}
			updateTurnDisplay();
		}
		
		async function coinFlip() {
			const coin = document.getElementById('coin');
			
			// 1. Nos aseguramos de que la transición esté activa
			coin.style.transition = 'transform 2s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

			// 2. Decidir resultado
			const esCara = Math.random() < 0.5;
			const vueltas = 1800; // 5 vueltas
			const rotacionFinal = esCara ? vueltas : vueltas + 180;

			// 3. Aplicar el giro
			// Importante: rotateY es para que gire como una moneda lanzada al aire
			coin.style.transform = `rotateY(${rotacionFinal}deg)`;

			// 4. Esperar a que termine (2 segundos del CSS + un poco más)
			await new Promise(resolve => setTimeout(resolve, 2100));

			// Mostrar botón de cierre...
			document.getElementById('closeCoin').classList.remove('hidden');
		}
		
		function openCoin() {
			const overlay = document.getElementById('coin-overlay');
			const coin = document.getElementById('coin');
			
			// Reset de estados
			coin.style.transition = 'none';
			coin.style.transform = 'rotateY(0deg)';
			document.getElementById('btn-spin-coin').classList.remove('hidden');
			document.getElementById('closeCoin').classList.add('hidden');
			overlay.classList.remove('hidden')
			overlay.style.display = 'flex';
		}
		
		function closeCoin() {
			const overlay = document.getElementById('coin-overlay');
			const btnClose = document.getElementById('closeCoin');
			const coin = document.getElementById('coin');

			// 1. Ocultamos el overlay principal
			if (overlay) {
				overlay.classList.add('hidden');
			}

			// 2. Aseguramos que el botón de cerrar se oculte 
			// para que no aparezca nada más abrir la próxima vez
			if (btnClose) {
				btnClose.classList.add('hidden');
			}

			// 3. Opcional: Resetear la moneda a su posición inicial sin animación
			// Esto evita que el usuario vea un "salto" visual la próxima vez
			if (coin) {
				coin.style.transition = 'none';
				coin.style.transform = 'rotateY(0deg) rotateX(0deg)';
			}
		}