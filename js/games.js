document.addEventListener("DOMContentLoaded", function () {
    const gamesList = document.getElementById('games-list');
    const gamesPerPage = 9; // Número de jogos por página
    let currentPage = 1;
    let totalPages = 1;

    // Função para criar um elemento de tag HTML com classes e conteúdo
    function createElementWithClasses(tagName, classNames, content) {
        const element = document.createElement(tagName);
        element.classList.add(...classNames);
        if (content) {
            element.textContent = content;
        }
        return element;
    }

    // Função para exibir os jogos de acordo com a página atual
    function displayGamesByPage() {
        const startIndex = (currentPage - 1) * gamesPerPage;
        const endIndex = startIndex + gamesPerPage;
        const gamesToDisplay = data.slice(startIndex, endIndex);

        gamesList.innerHTML = ''; // Limpa a lista atual

        gamesToDisplay.forEach(game => {
            const gameItem = createElementWithClasses('div', ['game-item']);
            const gameLink = createElementWithClasses('a', []);
            gameLink.href = game.site;
            gameLink.target = '_blank';

            const gameImage = createElementWithClasses('img', []);
            gameImage.src = game.thumbnail;
            gameImage.alt = game.name;
            gameImage.style.borderBottom = `5px solid ${game['border-color']}`;

            if (game.price) {
                const gamePrice = createElementWithClasses('p', ['game-price']);
                gamePrice.textContent = `$${game.price}`;
                gameItem.appendChild(gamePrice);
            }

            const gameInfo = createElementWithClasses('div', ['game-info']);
            gameInfo.textContent = `${game.plataform}`;

            const gameName = createElementWithClasses('p', []);
            gameName.textContent = game.name;

            gameLink.appendChild(gameImage);
            gameLink.appendChild(gameName);
            gameItem.appendChild(gameLink);
            gamesList.appendChild(gameItem);
            gameItem.appendChild(gameInfo);
            gamesList.appendChild(gameItem);
        });
    }

    // Função para ler o parâmetro da página atual da URL
    function getCurrentPageFromURL() {
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page');
        return page ? parseInt(page, 10) : 1; // Página padrão é 1 se nenhum parâmetro for especificado
    }

    // Atualize currentPage usando a função acima
    currentPage = getCurrentPageFromURL();

    // Fetch no JSON de jogos
    fetch('/json/games.json')
        .then(response => response.json())
        .then(data => {
            // Armazena os dados dos jogos
            window.data = data;

            // Calcula o número total de páginas com base na quantidade de jogos e jogos por página
            totalPages = Math.ceil(data.length / gamesPerPage);

            // Adiciona um ouvinte de evento para o botão "Anterior"
            document.getElementById('prevPage').addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    updateURL();
                    displayGamesByPage();
                    updatePageInfo();
                }
            });

            // Adiciona um ouvinte de evento para o botão "Próxima"
            document.getElementById('nextPage').addEventListener('click', () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    updateURL();
                    displayGamesByPage();
                    updatePageInfo();
                }
            });

            // Adiciona um ouvinte de evento para o botão "Primeira Página"
            document.getElementById('firstPage').addEventListener('click', () => {
                currentPage = 1;
                updateURL();
                displayGamesByPage();
                updatePageInfo();
            });

            // Adiciona um ouvinte de evento para o botão "Última Página"
            document.getElementById('lastPage').addEventListener('click', () => {
                currentPage = totalPages;
                updateURL();
                displayGamesByPage();
                updatePageInfo();
            });

            displayGamesByPage(); // Exibe os jogos da página inicial
            updatePageInfo(); // Atualiza as informações da página
        })
        .catch(error => {
            console.error('Erro ao buscar dados dos jogos:', error);
        });

    // Função para atualizar as informações da página (número da página atual)
    function updatePageInfo() {
        const currentPageSpan = document.getElementById('currentPage');
        currentPageSpan.textContent = `${currentPage}`;
    }

    // Função para atualizar a URL com base na página atual
    function updateURL() {
        const newURL = `${window.location.pathname}?page=${currentPage}`;
        window.history.pushState({ page: currentPage }, '', newURL);
    }
});
