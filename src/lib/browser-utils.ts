/**
 * Browser detection and cookie compatibility utilities
 */

export function detectBrowser(): 'chrome' | 'firefox' | 'safari' | 'edge' | 'other' {
    if (typeof window === 'undefined') return 'other'
    
    const userAgent = window.navigator.userAgent.toLowerCase()
    
    if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
        return 'chrome'
    }
    if (userAgent.includes('firefox')) {
        return 'firefox'
    }
    if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
        return 'safari'
    }
    if (userAgent.includes('edg')) {
        return 'edge'
    }
    
    return 'other'
}

export function getCookieHelpMessage(browser: ReturnType<typeof detectBrowser>): string {
    switch (browser) {
        case 'firefox':
            return 'Firefox may block cross-site cookies. Please check your privacy settings and allow cookies for this site and the API domain.'
        case 'safari':
            return 'Safari may block cross-site cookies. Please go to Safari Settings > Privacy and uncheck "Prevent cross-site tracking" or allow cookies for this site.'
        case 'edge':
            return 'Edge may block third-party cookies. Please check your privacy settings and allow cookies for this site.'
        default:
            return 'Your browser may be blocking cookies. Please check your browser settings and allow cookies for this site and the API domain.'
    }
}

export function checkCookieSupport(): boolean {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
        return false
    }
    
    try {
        // Try to set a test cookie
        document.cookie = 'test_cookie=1; SameSite=None; Secure'
        const canSetCookies = document.cookie.indexOf('test_cookie=') !== -1
        // Clean up test cookie
        document.cookie = 'test_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        return canSetCookies
    } catch (e) {
        return false
    }
}

export function isCrossOriginRequest(baseURL: string): boolean {
    if (typeof window === 'undefined') return false
    
    try {
        const apiUrl = new URL(baseURL)
        const currentUrl = new URL(window.location.href)
        
        return apiUrl.origin !== currentUrl.origin
    } catch {
        return false
    }
}

