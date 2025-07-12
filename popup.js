document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("link-container");
    const nameInput = document.getElementById("link-name");
    const urlInput = document.getElementById("link-url");
    const addBtn = document.getElementById("add-btn");

    function renderLinks() {
        chrome.storage.local.get(["links"], (result) => {
            const links = result.links || [];
            container.innerHTML = "";

            links.forEach((link, index) => {
                const div = document.createElement("div");
                div.className = "link-item";

                const title = document.createElement("strong");
title.textContent = link.name;

const urlText = document.createElement("small");
urlText.textContent = link.url;

const copyBtn = document.createElement("button");
copyBtn.textContent = "Copy";
copyBtn.className = "copy-btn";
copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(link.url);
});

const goBtn = document.createElement("button");
goBtn.textContent = "Go";
goBtn.className = "go-btn";
goBtn.addEventListener("click", () => {
  window.open(link.url, "_blank");
});

const deleteBtn = document.createElement("button");
deleteBtn.textContent = "Delete";
deleteBtn.className = "delete-btn";
deleteBtn.addEventListener("click", () => {
  chrome.storage.local.get(["links"], (result) => {
    const links = result.links || [];
    links.splice(index, 1);
    chrome.storage.local.set({ links }, renderLinks);
  });
});

const btnGroup = document.createElement("div");
btnGroup.className = "btn-group";
btnGroup.appendChild(copyBtn);
btnGroup.appendChild(goBtn);
btnGroup.appendChild(deleteBtn);

div.appendChild(title);
div.appendChild(urlText);
div.appendChild(btnGroup);


                container.appendChild(div);
            });
        });
    }

    addBtn.addEventListener("click", () => {
        const name = nameInput.value.trim();
        let url = urlInput.value.trim();
        if (!name || !url) return;

        // Ensure URL has https:// prefix
        if (!/^https?:\/\//i.test(url)) {
            url = "https://" + url;
        }

        chrome.storage.local.get(["links"], (result) => {
            const links = result.links || [];
            links.push({ name, url });
            chrome.storage.local.set({ links }, () => {
                nameInput.value = "";
                urlInput.value = "";
                renderLinks();
            });
        });
    });


    renderLinks();
});
