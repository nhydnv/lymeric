const page = (html, js) => ({html, js});

export const routes = {
    login: page("pages/login.html", "pages/login.js"),
    home: page("pages/home.html", "pages/home.js"),
};

export async function navigateTo(route) {
    const container = document.getElementById("app");

    const pageModule = routes[route];
    if (!pageModule) {
        containerontainer.innerHTML = `<h2>404 Not Found</h2>`;
        return;
    }

    // Load HTML
    try {
        // Load and run page module
        const pageHTML = await window.pages.loadPage(pageModule.html);
        container.innerHTML = pageHTML;
        const pageJS = await import(`./${pageModule.js}`);
        if (pageJS.init) pageJS.init();   // Call exported init()
    } catch (err) {
        container.innerHTML = '<p>An error occured while loading page.</p>';
    }
}