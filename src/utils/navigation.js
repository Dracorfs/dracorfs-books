const navigationIsSupported = () => {
    return Boolean(document.startViewTransition)
}

export const startViewTransition = () => {
    if (!navigationIsSupported) return
    
    window.navigation.addEventListener('navigate', (event) => {
        console.log(event.destination.url)
        const toUrl = new URL(event.destination.url)

        // Ignore external pages
        if (location.origin != toUrl.origin) return

        event.intercept({
            async handler () {
                // load the incoming page using fetch to load the HTML
                const response = await fetch(toUrl.pathname)
                const text = await response.text()
                // use regex to only keep the html inside body
                const [, data] = text.match(/<body[^>]*([\s\S]*)<\/body>/i)

                // use View Transition API
                document.startViewTransition(() => {
                    document.body.innerHTML = data					
                    document.documentElement.scrollTop = 0
                })
            }
        })
    })
}