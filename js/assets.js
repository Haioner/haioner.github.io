document.addEventListener("DOMContentLoaded", function () {
    const assetsList = document.querySelector(".assets-list");
    const prevPageButton = document.getElementById("prevPage");
    const nextPageButton = document.getElementById("nextPage");
    const firstPageButton = document.getElementById("firstPage");
    const lastPageButton = document.getElementById("lastPage");
    const currentPageElement = document.getElementById("currentPage");
    const searchInput = document.getElementById("searchInput");

    // Variáveis para controle de página
    let currentPage = 1;
    const assetsPerPage = 9;
    let assetsData = [];
    let filteredAssetsData = []; // Armazena os ativos filtrados
    let selectedCategory = null;
    let selectedSeries = null;
    let selectedTag = null;

    function createElementWithClasses(tagName, classNames, content) {
        const element = document.createElement(tagName);
        element.classList.add(...classNames);
        if (content) {
            element.textContent = content;
        }
        return element;
    }

    function updateAssetsList(assetsData) {
        // Limpe a lista de assets atual
        assetsList.innerHTML = "";

        // Calcule o índice de início e fim da página atual
        const startIndex = (currentPage - 1) * assetsPerPage;
        const endIndex = startIndex + assetsPerPage;

        // Obtenha os assets para a página atual (a partir dos ativos filtrados)
        const assetsForPage = filteredAssetsData.slice(startIndex, endIndex);

        assetsForPage.forEach((asset) => {
            const assetDiv = createElementWithClasses("div", ["asset-item"]);

            const thumbImage = createElementWithClasses("img", ["thumb"]);
            thumbImage.src = asset.thumbnail;
            thumbImage.alt = asset.title;
            const nameParagraph = createElementWithClasses("p", ["name"], asset.title);
            const categoryParagraph = createElementWithClasses("span", ["category"], asset.category);
            const seriesParagraph = createElementWithClasses("span", ["series"], asset.series);
            const tagsDiv = createElementWithClasses("div", ["tags"]);
            tagsDiv.appendChild(categoryParagraph);
            tagsDiv.appendChild(seriesParagraph);
            if (asset.license) {
                const assetLicense = createElementWithClasses('p', ['asset-license']);
                assetLicense.textContent = `${asset.license}`;
                assetDiv.appendChild(assetLicense);
            }
            
            asset.tags.forEach((tag, index) => {
                const tagSpan = createElementWithClasses("span", ["tag"], tag);
                tagSpan.id = `tagsFilter_${asset.id}_${index}`;
                tagsDiv.appendChild(tagSpan);
            });

            categoryParagraph.id = `categoryFilter_${asset.id}`;
            seriesParagraph.id = `seriesFilter_${asset.id}`;

            assetDiv.appendChild(thumbImage);
            assetDiv.appendChild(nameParagraph);

            assetDiv.appendChild(tagsDiv);
            assetsList.appendChild(assetDiv);

            // Adicione um evento de clique para redirecionar para a página de detalhes do asset
            thumbImage.addEventListener("click", () => {
                redirectToAssetDetails(asset.id);
            });

            nameParagraph.addEventListener("click", () => {
                redirectToAssetDetails(asset.id);
            });

            // Adicione ouvintes de evento para os filtros de categoria, series e tags
            categoryParagraph.addEventListener("click", () => {
                const selectedCategory = categoryParagraph.textContent.trim();
                filterAssetsByCategory(selectedCategory);
            });

            seriesParagraph.addEventListener("click", () => {
                const selectedSeries = seriesParagraph.textContent.trim();
                filterAssetsBySeries(selectedSeries);
            });

            asset.tags.forEach((tag, index) => {
                const tagSpan = document.getElementById(`tagsFilter_${asset.id}_${index}`);
                tagSpan.addEventListener("click", () => {
                    const selectedTag = tagSpan.textContent.trim();
                    filterAssetsByTag(selectedTag);
                });
            });
        });

        // Atualize o texto mostrando a página atual
        currentPageElement.textContent = `${currentPage}`;

        // Atualize a disponibilidade dos botões de página anterior e próxima
        prevPageButton.disabled = currentPage === 1;
        nextPageButton.disabled = endIndex >= filteredAssetsData.length;
    }

    // Função para ler o parâmetro da página atual da URL
    function getCurrentPageFromURL() {
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page');
        return page ? parseInt(page, 10) : 1; // Página padrão é 1 se nenhum parâmetro for especificado
    }

    // Atualize currentPage usando a função acima
    currentPage = getCurrentPageFromURL();

    // Função para processar os parâmetros da URL e aplicar os filtros
    function applyFiltersFromURL() {
        const params = new URLSearchParams(window.location.search);
        const categoryFilter = params.get('category');
        const seriesFilter = params.get('series');
        const tagFilter = params.get('tag');

        if (categoryFilter) {
            selectedCategory = categoryFilter;
        }
        if (seriesFilter) {
            selectedSeries = seriesFilter;
        }
        if (tagFilter) {
            selectedTag = tagFilter;
        }
    }

    // Função para construir a URL com base nos filtros selecionados
    function buildURLWithFilters() {
        const params = new URLSearchParams();
        if (selectedCategory) {
            params.append('category', selectedCategory);
        }
        if (selectedSeries) {
            params.append('series', selectedSeries);
        }
        if (selectedTag) {
            params.append('tag', selectedTag);
        }
        params.append('page', currentPage.toString());

        const queryString = params.toString();
        const newURL = `${window.location.pathname}?${queryString}`;
        window.history.pushState({ page: currentPage }, '', newURL);
    }

    // Função para filtrar os ativos por categoria
    function filterAssetsByCategory(category) {
        selectedCategory = category;
        selectedSeries = null;
        selectedTag = null;
        buildURLWithFilters();
        filterAssets();
    }

    // Função para filtrar os ativos por série
    function filterAssetsBySeries(series) {
        selectedCategory = null;
        selectedSeries = series;
        selectedTag = null;
        buildURLWithFilters();
        filterAssets();
    }

    // Função para filtrar os ativos por tag
    function filterAssetsByTag(tag) {
        selectedCategory = null;
        selectedSeries = null;
        selectedTag = tag;
        buildURLWithFilters();
        filterAssets();
    }

    // Função para aplicar os filtros e atualizar a lista de ativos
    function filterAssets() {
        if (selectedCategory || selectedSeries || selectedTag) {
            filteredAssetsData = assetsData.filter((asset) => {
                return (
                    (!selectedCategory || asset.category.toLowerCase() === selectedCategory.toLowerCase()) &&
                    (!selectedSeries || asset.series.toLowerCase() === selectedSeries.toLowerCase()) &&
                    (!selectedTag || asset.tags.some((tag) => tag.toLowerCase() === selectedTag.toLowerCase()))
                );
            });
        } else {
            filteredAssetsData = assetsData;
        }

        currentPage = 1;
        updateURL();
        updateAssetsList(filteredAssetsData);
    }

    // Função para atualizar a URL com base na página atual
    function updateURL() {
        const params = new URLSearchParams();
        if (selectedCategory) {
            params.append('category', selectedCategory);
        }
        if (selectedSeries) {
            params.append('series', selectedSeries);
        }
        if (selectedTag) {
            params.append('tag', selectedTag);
        }
        params.append('page', currentPage.toString());

        const queryString = params.toString();
        const newURL = `${window.location.pathname}?${queryString}`;
        window.history.pushState({ page: currentPage }, '', newURL);
    }

    // Adicione um ouvinte de evento para a tecla "Enter" no campo de pesquisa
    searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            performSearch();
        }
    });

    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
    
        // Realize a pesquisa nos dados dos ativos
        filteredAssetsData = assetsData.filter((asset) => {
            // Verifique se algum dos campos, exceto o título, é exatamente igual ao termo de pesquisa
            return (
                (asset.title.toLowerCase().includes(searchTerm)) ||
                (asset.category.toLowerCase() === searchTerm) ||
                (asset.series.toLowerCase() === searchTerm) ||
                asset.tags.some((tag) => tag.toLowerCase() === searchTerm) ||
                (asset['release-date'].toLowerCase() === searchTerm && isValidDate(asset['release-date'])) ||
                (asset.license.toLowerCase() === searchTerm)
            );
        });
    
        // Atualize a lista de ativos com os resultados da pesquisa
        updateAssetsList(filteredAssetsData);
    
        // Redefina os filtros ao realizar uma pesquisa
        selectedCategory = null;
        selectedSeries = null;
        selectedTag = null;
        buildURLWithFilters();
    }

    // Função para verificar se uma data está no formato "00/00/0000"
    function isValidDate(dateString) {
        const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;
        return datePattern.test(dateString);
    }

    // Função para redirecionar para a página de detalhes do asset
    function redirectToAssetDetails(assetId) {
        // Redirecione para a página de detalhes do asset com o ID do asset na URL
        window.location.href = `/asset.html?id=${assetId}`;
    }

    // Carregue os dados dos ativos e aplique os filtros da URL
    fetch("/json/assets.json")
        .then((response) => response.json())
        .then((data) => {
            assetsData = data; // Armazene todos os ativos na variável
            applyFiltersFromURL(); // Aplique os filtros da URL
            filterAssets(); // Aplique os filtros aos ativos
        })
        .catch((error) => {
            console.error("Erro ao buscar dados dos assets:", error);
        });
});
