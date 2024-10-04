const API_KEY_FINDIP = chrome.runtime.getManifest().content_security_policy.extension_settings.API_KEY_FINDIP;

export const ipLocation = {
    
    API_URL:  `https://api.findip.net/{IP}/?token=${API_KEY_FINDIP}`,
  
    fetchLocationData: async (ip) => {
      try {
        let url = ipLocation.API_URL.replace('{IP}', ip)
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error('Failed to fetch Location Data from api')
        }
        const data = await response.json()
        console.log(data)
        if (!data) {
          throw new Error('Invalid response data')
        }
        return data
      } catch (error) {
        console.error('Error fetching IP location data')
        return null
      }
    }
}