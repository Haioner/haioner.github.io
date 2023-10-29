// Selecione as imagens
const assetThumbnail = document.getElementById("asset-thumbnail");
const assetPrint = document.getElementById("asset-print");

// Adicione um evento de clique às imagens
assetThumbnail.addEventListener("click", openFullscreenImage);
assetPrint.addEventListener("click", openFullscreenImage);

// Função para exibir uma imagem ou vídeo em tela cheia com tamanho máximo de 1000x500 e responsiva
function openFullscreenImage(event) {
    // Verifique se o elemento clicado é um vídeo
    if (event.target.tagName === "VIDEO") {
        return; // Não faz nada se for um vídeo
    }

    // Crie um elemento de imagem em tela cheia
    const fullscreenImage = document.createElement("div");
    fullscreenImage.classList.add("fullscreen-image");

    if (event.target.tagName === "IMG") {
        // Se o destino for uma imagem, crie uma imagem em tela cheia
        const image = document.createElement("img");
        image.src = event.target.src; // Use a fonte da imagem clicada

        // Defina o tamanho fixo de 1000x500 pixels
        image.width = 1000;
        image.height = 500;

        // Adicione uma classe CSS para tornar a imagem responsiva
        image.classList.add("responsive-image");

        fullscreenImage.appendChild(image);
    } else if (event.target.tagName === "VIDEO") {
        // Se o destino for um vídeo, crie um vídeo em tela cheia
        const video = event.target.cloneNode(true);
        video.width = 1000;
        video.height = 500;
        video.controls = true;

        fullscreenImage.appendChild(video);
    }

    // Adicione um evento de clique para fechar a imagem em tela cheia
    fullscreenImage.addEventListener("click", closeFullscreenImage);

    // Adicione o elemento de imagem em tela cheia ao corpo do documento
    document.body.appendChild(fullscreenImage);
}



// Função para fechar a imagem em tela cheia
function closeFullscreenImage() {
    const fullscreenImage = document.querySelector(".fullscreen-image");
    
    // Verifique se o elemento da imagem em tela cheia existe
    if (fullscreenImage) {
        // Remova o elemento da imagem em tela cheia
        fullscreenImage.remove();
    }
}
