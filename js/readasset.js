document.addEventListener("DOMContentLoaded", function () {
    // Obter o parâmetro 'id' da URL
    const params = new URLSearchParams(window.location.search);
    const assetId = params.get("id");

    // Selecionar os elementos HTML para atualizar
    const assetThumbnail = document.getElementById("asset-thumbnail");
    const assetPrint = document.getElementById("asset-print");
    const assetTitle = document.getElementById("asset-title");
    const assetCategory = document.getElementById("asset-category");
    const assetSeries = document.getElementById("asset-series");
    const assetTags = document.getElementById("asset-tags");
    const assetAssets = document.getElementById("asset-assets");
    const assetReleaseDate = document.getElementById("asset-releasedate");
    const assetLicense = document.getElementById("asset-license");
    const assetDownload = document.getElementById("asset-download");

    // Função para redirecionar para a página "assets.html" com o filtro selecionado
    function redirectToAssetsPageWithFilter(filterType, filterValue) {
        const url = new URL("/assets.html", window.location.href); // Substitua "/assets.html" pelo caminho correto da sua página
        url.searchParams.set(filterType, filterValue);
        window.location.href = url.href; // Redireciona na mesma aba
    }

    // Função para abrir o link de licença em uma nova aba
    function openLicenseLinkInNewTab() {
        const licenseLink = assetLicense.getAttribute("data-license-link");
        if (licenseLink) {
            window.open(licenseLink, "_blank");
        }
    }

    // Verificar se há um ID de asset válido
    if (assetId) {
        // Fetch no JSON de assets para encontrar o asset com o ID correspondente
        fetch("/json/assets.json") // Substitua pelo caminho correto do seu JSON
            .then((response) => response.json())
            .then((assetsData) => {
                // Encontrar o asset com o ID correspondente
                const asset = assetsData.find((a) => a.id == assetId);

                // Verificar se o asset foi encontrado
                if (asset) {
                    // Atualizar os elementos HTML com as informações do asset
                    assetThumbnail.src = asset.thumbnail;
                    assetThumbnail.alt = asset.title;
                    assetPrint.src = asset.print;
                    assetTitle.textContent = asset.title;

                    // Verificar se a categoria e a série existem e, em seguida, atualizá-las
                    if (asset.category) {
                        const categorySpan = document.createElement("span");
                        categorySpan.textContent = asset.category;
                        assetCategory.textContent = "Category: ";
                        assetCategory.appendChild(categorySpan);

                        categorySpan.addEventListener("click", function () {
                            redirectToAssetsPageWithFilter("category", asset.category);
                        });
                    }

                    if (asset.series) {
                        const seriesSpan = document.createElement("span");
                        seriesSpan.textContent = asset.series;
                        assetSeries.textContent = "Series: ";
                        assetSeries.appendChild(seriesSpan);

                        seriesSpan.addEventListener("click", function () {
                            redirectToAssetsPageWithFilter("series", asset.series);
                        });
                    }

                    assetTags.textContent = "Tags: ";
                    asset.tags.forEach((tag, index) => {
                        const tagSpan = document.createElement("span");
                        tagSpan.classList.add("tag");
                        tagSpan.textContent = tag;

                        // Adicione um evento de clique à tag para redirecionar com o filtro da tag selecionada
                        tagSpan.addEventListener("click", function () {
                            redirectToAssetsPageWithFilter("tag", tag);
                        });

                        assetTags.appendChild(tagSpan);

                        if (index < asset.tags.length - 1) {
                            assetTags.appendChild(document.createTextNode(", "));
                        }
                    });

                    assetAssets.textContent = `Assets: ${asset.assets}`;
                    assetReleaseDate.textContent = `Release Date: ${asset["release-date"]}`;
                    
                    // Atualizar o elemento de licença
                    assetLicense.textContent = "License: ";
                    const licenseSpan = document.createElement("span");
                    licenseSpan.textContent = asset.license;

                    // Adicione um evento de clique ao elemento de licença para abrir o link
                    licenseSpan.addEventListener("click", function () {
                        openLicenseLinkInNewTab();
                    });

                    assetLicense.appendChild(licenseSpan);
                    assetLicense.setAttribute("data-license-link", asset["license-link"]);

                    assetDownload.href = asset.download;
                    assetDownload.textContent = "Download";

                    // Exibir a seção de detalhes do asset
                    document.querySelector(".asset-col").style.display = "block";
                } else {
                    // Se o asset não for encontrado, você pode redirecionar ou exibir uma mensagem de erro
                    console.error("Asset não encontrado.");
                }
            })
            .catch((error) => {
                console.error("Erro ao buscar dados dos assets:", error);
            });
    } else {
        // Se não houver um ID de asset na URL, você pode redirecionar ou exibir uma mensagem de erro
        console.error("ID de asset não especificado na URL.");
    }
});
