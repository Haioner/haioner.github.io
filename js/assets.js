document.addEventListener("DOMContentLoaded", () => {
    const assetsList = document.querySelector(".assets-list");
    const prevPageButton = document.getElementById("prevPage");
    const nextPageButton = document.getElementById("nextPage");
    const firstPageButton = document.getElementById("firstPage");
    const lastPageButton = document.getElementById("lastPage");
    const currentPageElement = document.getElementById("currentPage");
    const searchInput = document.getElementById("searchInput");

    let currentPage = 1;
    const assetsPerPage = 9;
    let assetsData = [];
    let filteredAssetsData = [];
    let selectedCategory = null;
    let selectedSeries = null;
    let selectedTag = null;

    const createElementWithClasses = (tagName, classNames, content) => {
        const element = document.createElement(tagName);
        element.classList.add(...classNames);
        if (content) {
            element.textContent = content;
        }
        return element;
    };

    const updateAssetsList = (assetsData) => {
        assetsList.innerHTML = "";
        const startIndex = (currentPage - 1) * assetsPerPage;
        const endIndex = startIndex + assetsPerPage;
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
                const assetLicense = createElementWithClasses('p', ['asset-license'], asset.license);
                assetDiv.appendChild(assetLicense);
            }

            asset.tags.forEach((tag, index) => {
                const tagSpan = createElementWithClasses("span", ["tag"], tag);
                tagSpan.id = `tagsFilter_${asset.id}_${index}`;
                tagsDiv.appendChild(tagSpan);
            });

            [categoryParagraph, seriesParagraph].forEach((element, index) => {
                element.id = `categoryFilter_${asset.id}`;
                if (index === 0) {
                    element.addEventListener("click", () => filterAssetsByCategory(element.textContent.trim()));
                } else {
                    element.addEventListener("click", () => filterAssetsBySeries(element.textContent.trim()));
                }
            });

            assetDiv.appendChild(thumbImage);
            assetDiv.appendChild(nameParagraph);
            assetDiv.appendChild(tagsDiv);
            assetsList.appendChild(assetDiv);

            [thumbImage, nameParagraph].forEach((element) => {
                element.addEventListener("click", () => redirectToAssetDetails(asset.id));
            });

            asset.tags.forEach((tag, index) => {
                const tagSpan = document.getElementById(`tagsFilter_${asset.id}_${index}`);
                tagSpan.addEventListener("click", () => filterAssetsByTag(tagSpan.textContent.trim()));
            });
        });

        currentPageElement.textContent = `${currentPage}`;
        prevPageButton.disabled = currentPage === 1;
        nextPageButton.disabled = endIndex >= filteredAssetsData.length;
    };

    const getCurrentPageFromURL = () => {
        const params = new URLSearchParams(window.location.search);
        return parseInt(params.get('page'), 10) || 1;
    };

    currentPage = getCurrentPageFromURL();

    const applyFiltersFromURL = () => {
        const params = new URLSearchParams(window.location.search);
        selectedCategory = params.get('category');
        selectedSeries = params.get('series');
        selectedTag = params.get('tag');
    };

    const buildURLWithFilters = () => {
        const params = new URLSearchParams();
        if (selectedCategory) params.append('category', selectedCategory);
        if (selectedSeries) params.append('series', selectedSeries);
        if (selectedTag) params.append('tag', selectedTag);
        params.append('page', currentPage.toString());
        const queryString = params.toString();
        const newURL = `${window.location.pathname}?${queryString}`;
        window.history.pushState({ page: currentPage }, '', newURL);
    };

    const filterAssetsByCategory = (category) => {
        selectedCategory = category;
        selectedSeries = null;
        selectedTag = null;
        buildURLWithFilters();
        filterAssets();
    };

    const filterAssetsBySeries = (series) => {
        selectedCategory = null;
        selectedSeries = series;
        selectedTag = null;
        buildURLWithFilters();
        filterAssets();
    };

    const filterAssetsByTag = (tag) => {
        selectedCategory = null;
        selectedSeries = null;
        selectedTag = tag;
        buildURLWithFilters();
        filterAssets();
    };

    const filterAssets = () => {
        filteredAssetsData = assetsData.filter((asset) => {
            return (
                (!selectedCategory || asset.category.toLowerCase() === selectedCategory.toLowerCase()) &&
                (!selectedSeries || asset.series.toLowerCase() === selectedSeries.toLowerCase()) &&
                (!selectedTag || asset.tags.some((tag) => tag.toLowerCase() === selectedTag.toLowerCase()))
            );
        });

        currentPage = 1;
        updateURL();
        updateAssetsList(filteredAssetsData);
    };

    const updateURL = () => {
        const params = new URLSearchParams();
        if (selectedCategory) params.append('category', selectedCategory);
        if (selectedSeries) params.append('series', selectedSeries);
        if (selectedTag) params.append('tag', selectedTag);
        params.append('page', currentPage.toString());
        const queryString = params.toString();
        const newURL = `${window.location.pathname}?${queryString}`;
        window.history.pushState({ page: currentPage }, '', newURL);
    };

    searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") performSearch();
    });

    const performSearch = () => {
        const searchTerm = searchInput.value.toLowerCase();
        filteredAssetsData = assetsData.filter((asset) => {
            return (
                (asset.title.toLowerCase().includes(searchTerm)) ||
                (asset.category.toLowerCase() === searchTerm) ||
                (asset.series.toLowerCase() === searchTerm) ||
                asset.tags.some((tag) => tag.toLowerCase() === searchTerm) ||
                (asset['release-date'].toLowerCase() === searchTerm && isValidDate(asset['release-date'])) ||
                (asset.license.toLowerCase() === searchTerm)
            );
        });
        selectedCategory = null;
        selectedSeries = null;
        selectedTag = null;
        buildURLWithFilters();
        updateAssetsList(filteredAssetsData);
    };

    const isValidDate = (dateString) => {
        const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;
        return datePattern.test(dateString);
    };

    const redirectToAssetDetails = (assetId) => {
        window.location.href = `/asset.html?id=${assetId}`;
    };

    fetch("/json/assets.json")
        .then((response) => response.json())
        .then((data) => {
            assetsData = data;
            applyFiltersFromURL();
            filterAssets();
        })
        .catch((error) => {
            console.error("Erro ao buscar dados dos assets:", error);
        });

    prevPageButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            updateURL();
            updateAssetsList(filteredAssetsData);
        }
    });

    nextPageButton.addEventListener("click", () => {
        const startIndex = (currentPage - 1) * assetsPerPage;
        const endIndex = startIndex + assetsPerPage;
        if (endIndex < filteredAssetsData.length) {
            currentPage++;
            updateURL();
            updateAssetsList(filteredAssetsData);
        }
    });

    firstPageButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage = 1;
            updateURL();
            updateAssetsList(filteredAssetsData);
        }
    });

    lastPageButton.addEventListener("click", () => {
        const totalPages = Math.ceil(filteredAssetsData.length / assetsPerPage);
        if (currentPage < totalPages) {
            currentPage = totalPages;
            updateURL();
            updateAssetsList(filteredAssetsData);
        }
    });
});
