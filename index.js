document.addEventListener('DOMContentLoaded', function () {
    const playersContainer = document.getElementById('players');
    const startGameButton = document.getElementById('start-game');
    const nextRoundButton = document.getElementById('next-round');
    const roundResultsDiv = document.getElementById('round-results');
    const eliminationStatusDiv = document.getElementById('elimination-status');
    const restartGameButton = document.getElementById('restart-game'); // Adicionado o botão de reinício

    let players = [];
    let roundNumber = 1;

    function createPlayerInputField(playerNumber, playerName) {
        const container = document.createElement('div');

        const playerNameLabel = document.createElement('label');
        playerNameLabel.textContent = `${playerName}: `;

        const input = document.createElement('input');
        input.setAttribute('type', 'text'); // Alterado de 'number' para 'text' para aceitar apenas teclado numérico
        input.setAttribute('inputmode', 'numeric');
        input.setAttribute('pattern', '\\d*');
        input.setAttribute('placeholder', 'Pontos');
        input.setAttribute('data-player', `player-${playerNumber}`);
        input.setAttribute('data-name', playerName);

        container.appendChild(playerNameLabel);
        container.appendChild(input);

        return container;
    }

    function updateEliminationStatus() {
        const eliminatedPlayers = players.filter(player => player.points < 0);
        if (eliminatedPlayers.length > 0) {
            eliminationStatusDiv.textContent = `Jogadores Eliminados: ${eliminatedPlayers.map(player => player.name).join(', ')}`;
        } else {
            eliminationStatusDiv.textContent = '';
        }
    }

    function displayScoreTable() {
        const table = document.createElement('table');
        const header = document.createElement('tr');

        const playerNameHeader = document.createElement('th');
        playerNameHeader.textContent = 'Jogador';
        header.appendChild(playerNameHeader);

        const playerScoreHeader = document.createElement('th');
        playerScoreHeader.textContent = 'Pontuação';
        header.appendChild(playerScoreHeader);

        table.appendChild(header);

        players.forEach(player => {
            const row = document.createElement('tr');

            const playerNameCell = document.createElement('td');
            playerNameCell.textContent = player.name;
            row.appendChild(playerNameCell);

            const playerScoreCell = document.createElement('td');
            playerScoreCell.textContent = player.points;
            row.appendChild(playerScoreCell);

            table.appendChild(row);
        });

        roundResultsDiv.innerHTML = '';
        roundResultsDiv.appendChild(table);
    }

    function collectRoundScores() {
        roundResultsDiv.innerHTML = `<p>Rodada ${roundNumber}:</p>`;

        players.forEach(player => {
            const input = document.querySelector(`input[data-player="player-${players.indexOf(player) + 1}"][data-name="${player.name}"]`);
            const score = parseInt(input.value) || 0;

            player.points -= score;

            roundResultsDiv.innerHTML += `<p>${player.name} perdeu ${score} pontos. Pontuação atual: ${player.points}</p>`;

            input.value = '';
        });

        roundNumber++;
        displayScoreTable();
        updateEliminationStatus();

        const remainingPlayers = players.filter(player => player.points >= 0);
        if (remainingPlayers.length === 1 && players.length > 1) {
            eliminationStatusDiv.textContent = `Parabéns! ${remainingPlayers[0].name} é o vencedor!`;
            nextRoundButton.disabled = true;
            restartGameButton.classList.remove('hide'); // Exibir o botão de reinício ao final do jogo
        }
    }

    function restartGame() {
        players.forEach(player => {
            player.points = 99;
        });

        roundNumber = 1;

        displayScoreTable();
        updateEliminationStatus();

        nextRoundButton.disabled = false;
        eliminationStatusDiv.textContent = '';
        restartGameButton.classList.add('hide'); // Ocultar o botão de reinício novamente
    }

    startGameButton.addEventListener('click', function () {
        const playerCount = parseInt(prompt('Quantos jogadores participarão?'));
        if (isNaN(playerCount) || playerCount < 2) {
            alert('Por favor, insira um número válido de jogadores (pelo menos 2).');
            return;
        }

        for (let i = 1; i <= playerCount; i++) {
            const playerName = prompt(`Nome do Jogador ${i}:`) || `Jogador ${i}`;
            const inputField = createPlayerInputField(i, playerName);
            playersContainer.appendChild(inputField);

            players.push({
                name: playerName,
                points: 99,
            });
        }
        startGameButton.style.display = 'none';
        startGameButton.disabled = true;
        nextRoundButton.disabled = false;

        displayScoreTable();
    });

    nextRoundButton.addEventListener('click', function() {
        collectRoundScores();
    });
    restartGameButton.addEventListener('click', restartGame); 
});
