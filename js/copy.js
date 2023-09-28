const botaoCopiar = document.getElementById("copy-button");
const codigo = "00020126580014BR.GOV.BCB.PIX0136c0672ea8-9fde-4936-9f50-bd105991cef25204000053039865802BR5925Kelvyn Lee de Souza Silva6009SAO PAULO610805409000622405206Nl34ndCLORMIXnw8yr06304A053";

botaoCopiar.addEventListener("click", () => {
    // Criar um elemento de área de texto temporário
    const textareaTemp = document.createElement("textarea");
    textareaTemp.value = codigo;

    // Adicionar o elemento à página
    document.body.appendChild(textareaTemp);

    // Selecionar e copiar o texto da área de texto
    textareaTemp.select();
    document.execCommand("copy");

    // Remover o elemento temporário
    document.body.removeChild(textareaTemp);

    // Alerta de sucesso
    alert("Code copied!");
});
