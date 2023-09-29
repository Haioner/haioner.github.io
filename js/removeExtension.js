// removeExtension.js

// Selecione todos os links no documento
const links = document.querySelectorAll("a");

// Itere sobre os links
links.forEach((link) => {
  // Verifique se o atributo "href" do link termina com ".html"
  if (link.getAttribute("href").endsWith(".html")) {
    // Remova a extensão ".html" do atributo "href"
    const newHref = link.getAttribute("href").replace(".html", "");
    
    // Atribua o novo valor ao atributo "href" do link
    link.setAttribute("href", newHref);
  }
});
