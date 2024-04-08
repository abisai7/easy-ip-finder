export const iptracker = {
  url: "https://api.ipify.org/?format=json",
  errorMessage:
    "An error has occurred, sorry for the inconvenience. Please try again. Reference: ",
  currentIp: null,

  fetchIP: async () => {
    const response = await fetch(iptracker.url);
    if (!response.ok) {
      throw new Error("Failed to fetch IP");
    }
    const data = await response.json();
    if (!data.ip) {
      throw new Error("Invalid response data");
    }
    return data.ip;
  },

  renderError: (error) => {
    const errorElement = document.querySelector(".error");
    errorElement.innerHTML = `${iptracker.errorMessage} ${error}`;
    errorElement.classList.remove("hide");
  },

  renderIP: (ip) => {
    const ipElement = document.querySelector("x-ip");
    ipElement.innerText = ip;
    ipElement.classList.remove("hide");
    ipElement.classList.add("show");
  },

  hideLoading: () => {
    const loaderElement = document.querySelector(".lds-loading");
    loaderElement.classList.remove("show");
    loaderElement.classList.add("hide");
  },

  showLoading: () => {
    const loaderElement = document.querySelector(".lds-loading");
    loaderElement.classList.remove("hide");
    loaderElement.classList.add("show");
  },

  copyToClipboard: async (value) => {
    await navigator.clipboard.writeText(value).then(() => {
      let options = {
        type: "basic",
        title: "Easy Public IP",
        message: `IP ${value} copied to the clipboard`,
        iconUrl: "/icon-128.png",
        silent: true,
      };
      chrome.notifications.create(options);
    });
  },

  copyIpToClipboardOnLoad: async () => {
    const config = await chrome.storage.sync.get(["copyToClipboardOnLoad"]);
    return config.copyToClipboardOnLoad;
  },

  init: async () => {
    iptracker.showLoading();
    try {
      const config = await chrome.storage.sync.get(["copyToClipboardOnLoad"]);
      document.querySelector("#clipboard-config-check").checked =
        config.copyToClipboardOnLoad;

      iptracker.currentIp = await iptracker.fetchIP();
      iptracker.renderIP(iptracker.currentIp);

      console.log(config.copyIpToClipboardOnLoad);
      if (config.copyToClipboardOnLoad) {
        await iptracker.copyToClipboard(iptracker.currentIp);
      }

      document
        .querySelector(".copy-to-clipboard-btn")
        .addEventListener("click", () =>
          iptracker.copyToClipboard(iptracker.currentIp)
        );
    } catch (error) {
      console.error("Error:", error);
      iptracker.renderError(error.message);
    } finally {
      iptracker.hideLoading();
    }
  },
};
