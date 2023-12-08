document.addEventListener('DOMContentLoaded', function () {
    const playersContainer = document.getElementById('players');
    const startGameButton = document.getElementById('start-game');
    const nextRoundButton = document.getElementById('next-round');
    const roundResultsDiv = document.getElementById('round-results');
    const eliminationStatusDiv = document.getElementById('elimination-status');

    let players = [];
    let roundNumber = 1;

    function createPlayerInputField(playerNumber) {
        const container = document.createElement('div');

        const playerName = document.createElement('span');
        playerName.textContent = `Jogador ${playerNumber}: `;

        const input = document.createElement('input');
        input.setAttribute('type', 'number');
        input.setAttribute('placeholder', 'Pontos');
        input.setAttribute('data-player', `player-${playerNumber}`); // Adiciona identificador único

        container.appendChild(playerName);
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
            const input = document.querySelector(`input[data-player="player-${player.name.split(' ')[1]}"]`);
            const score = parseInt(input.value) || 0;

            player.points -= score;

            roundResultsDiv.innerHTML += `<p>${player.name} perdeu ${score} pontos. Pontuação atual: ${player.points}</p>`;
        });

        roundNumber++;
        displayScoreTable();
        updateEliminationStatus();

        // Check if only one player is remaining
        const remainingPlayers = players.filter(player => player.points >= 0);
        if (remainingPlayers.length === 1 && players.length > 1) {
            eliminationStatusDiv.textContent = `Parabéns! ${remainingPlayers[0].name} é o vencedor!`;
            nextRoundButton.disabled = true;
        }
    }

    startGameButton.addEventListener('click', function () {
        const playerCount = parseInt(prompt('Quantos jogadores participarão?'));
        if (isNaN(playerCount) || playerCount < 2) {
            alert('Por favor, insira um número válido de jogadores (pelo menos 2).');
            return;
        }

        // Create player input fields dynamically
        for (let i = 1; i <= playerCount; i++) {
            const inputField = createPlayerInputField(i);
            playersContainer.appendChild(inputField);

            // Add player to the players array
            const playerName = `Jogador ${i}`;
            players.push({
                name: playerName,
                points: 99,
            });
        }

        startGameButton.disabled = true;
        nextRoundButton.disabled = false;

        displayScoreTable();
    });

    nextRoundButton.addEventListener('click', collectRoundScores);
});
