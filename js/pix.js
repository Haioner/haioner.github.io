document.addEventListener("DOMContentLoaded", function () {
    const openPixButton = document.getElementById("open-pix-button");
    const closePixButton = document.getElementById("close-pix-button");
    const pixContainer = document.querySelector(".pix-container");

    openPixButton.addEventListener("click", function () {
        pixContainer.style.display = "block";
    });

    closePixButton.addEventListener("click", function () {
        pixContainer.style.display = "none";
    });
});
