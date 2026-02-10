// Load header and footer dynamically
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Load header
        const headerResponse = await fetch('header.html');
        if (headerResponse.ok) {
            const headerContent = await headerResponse.text();
            const headerPlaceholder = document.getElementById('header-placeholder');
            if (headerPlaceholder) {
                headerPlaceholder.innerHTML = headerContent;
            }
        }

        // Load footer
        const footerResponse = await fetch('footer.html');
        if (footerResponse.ok) {
            const footerContent = await footerResponse.text();
            const footerPlaceholder = document.getElementById('footer-placeholder');
            if (footerPlaceholder) {
                footerPlaceholder.innerHTML = footerContent;
            }
        }
    } catch (error) {
        console.error('Error loading header/footer:', error);
    }
});
