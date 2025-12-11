export const apiClient = {
    async get(url: string) {
        console.log('[API Client] GET request to:', url)
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Send cookies
        })
        console.log('[API Client] GET response status:', response.status, response.statusText)
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`)
        }
        return response.json()
    },

    async post(url: string, body: any) {
        console.log('[API Client] POST request to:', url, 'with body:', body)
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(body),
        })
        console.log('[API Client] POST response status:', response.status, response.statusText)
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`)
        }
        return response.json()
    },

    async put(url: string, body: any) {
        console.log('[API Client] PUT request to:', url, 'with body:', body)
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(body),
        })
        console.log('[API Client] PUT response status:', response.status, response.statusText)
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`)
        }
        return response.json()
    },

    async patch(url: string, body: any) {
        console.log('[API Client] PATCH request to:', url, 'with body:', body)
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(body),
        })
        console.log('[API Client] PATCH response status:', response.status, response.statusText)
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`)
        }
        return response.json()
    },

    async delete(url: string) {
        console.log('[API Client] DELETE request to:', url)
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
        console.log('[API Client] DELETE response status:', response.status, response.statusText)
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`)
        }
        return response.json()
    },

    // Add other methods as needed
}
