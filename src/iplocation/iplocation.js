export const ipLocation = {
    
    API_URL: 'https://api.findip.net/{IP}/?token={TOKEN}',
    TOKEN: 'c23c6c9652f94e448601a5869d5004dc',
  
    fetchLocationData: async (ip) => {
      try {
        let url = ipLocation.API_URL.replace('{IP}', ip).replace('{TOKEN}', ipLocation.TOKEN)
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error('Failed to fetch Location Data from api')
        }
        const data = await response.json()
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