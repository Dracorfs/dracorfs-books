const navigationIsSupported = () => {
    return Boolean(document.startViewTransition)
}
const fetchPage = async (url) => {
    // load the incoming page using fetch to load the HTML
    const response = await fetch(url)
    const text = await response.text()
    // use regex to only keep the html inside body
    const [, data] = text.match(/<body>([\s\S]*)<\/body>/i)
    return data
}

export const startViewTransition = () => {
    if (!navigationIsSupported()) return

    window.navigation.addEventListener('navigate', (event) => {
        const toUrl = new URL(event.destination.url)

        // Ignore external pages
        if (location.origin != toUrl.origin) return

        event.intercept({
            async handler () {
                const data = await fetchPage(toUrl.pathname)

                // use View Transition API
                document.startViewTransition(() => {
                    document.body.innerHTML = data					
                    document.documentElement.scrollTop = 0
                })
            }
        })
    })
}