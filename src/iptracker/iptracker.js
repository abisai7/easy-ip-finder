export const ipTracker = {
  getVersionUrl: (version) => {
    const baseUrl = "https://api.ipify.org?format=json";
    const ipv6Url = "https://api64.ipify.org?format=json";
    return version === 6 ? ipv6Url : baseUrl;
  },

  fetchIP: async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch IP");
      }
      const data = await response.json();
      if (!data.ip) {
        throw new Error("Invalid response data");
      }
      return data.ip;
    } catch (error) {
      throw new Error(`Error fetching IP: ${error.message}`);
    }
  },

  copyToClipboard: async (ip, onCopy) => {
    if (ip) {
      try {
        await navigator.clipboard.writeText(ip);
        if (onCopy) {
          onCopy();
        }
      } catch (error) {
        console.error("Error copying IP to clipboard:", error);
      }
    }
  },

  init: async (versionToGet = 4, copyToClipboard = false, onCopy = null) => {
    try {
      const url = ipTracker.getVersionUrl(versionToGet);
      const currentIp = await ipTracker.fetchIP(url);
      if (copyToClipboard) {
        await ipTracker.copyToClipboard(currentIp, onCopy);
      }
      return { ip: currentIp, error: "" };
    } catch (error) {
      console.error("Initialization error:", error);
      return { ip: null, error: error.message };
    }
  },
};


