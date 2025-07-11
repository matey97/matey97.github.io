//
// Scripts
//

function setupPaginationWithFilter(sectionId, paginationId, dropdownId, filterId) {
    const container = document.getElementById(sectionId);
    const pagination = document.getElementById(paginationId);
    const perPageDropdown = document.getElementById(dropdownId);
    const filterDropdown = document.getElementById(filterId);

    let currentPage = 1;

    function getFilteredItems() {
        const filterValue = filterDropdown.value;
        const allItems = Array.from(container.querySelectorAll(".paper"));
        return filterValue === "all"
            ? allItems
            : allItems.filter(item => item.getAttribute("data-rank") === filterValue);
    }

    function renderPage(page) {
        currentPage = page;
        const itemsPerPage = parseInt(perPageDropdown.value);
        const filteredItems = getFilteredItems();
        const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

        filteredItems.forEach((item, index) => {
            item.style.display = (index >= (page - 1) * itemsPerPage && index < page * itemsPerPage)
                ? "flex" : "none";
        });

        // Hide items that don't match filter
        Array.from(container.querySelectorAll(".paper")).forEach(item => {
            if (!filteredItems.includes(item)) item.style.display = "none";
        });

        // Pagination buttons
        pagination.innerHTML = "";

        const prev = document.createElement("li");
        prev.className = `page-item mx-1 ${page === 1 ? "disabled" : ""}`;
        const prevBtn = document.createElement("button");
        prevBtn.className = "page-link rounded-pill";
        prevBtn.textContent = "Previous";
        prevBtn.onclick = () => { if (page > 1) renderPage(page - 1); };
        prev.appendChild(prevBtn);
        pagination.appendChild(prev);

        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement("li");
            li.className = `page-item mx-1 ${i === page ? "active" : ""}`;
            const btn = document.createElement("button");
            btn.className = "page-link rounded-pill";
            btn.textContent = i;
            btn.onclick = () => renderPage(i);
            li.appendChild(btn);
            pagination.appendChild(li);
        }

        const next = document.createElement("li");
        next.className = `page-item mx-1 ${page === totalPages ? "disabled" : ""}`;
        const nextBtn = document.createElement("button");
        nextBtn.className = "page-link rounded-pill";
        nextBtn.textContent = "Next";
        nextBtn.onclick = () => { if (page < totalPages) renderPage(page + 1); };
        next.appendChild(nextBtn);
        pagination.appendChild(next);
    }

    // Event listeners
    perPageDropdown.addEventListener("change", () => renderPage(1));
    filterDropdown.addEventListener("change", () => renderPage(1));

    renderPage(1);
}

window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const sideNav = document.body.querySelector('#sideNav');
    if (sideNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#sideNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    setupPaginationWithFilter("journals", "journal-pagination", "journal-items-per-page", "journal-filter");
    setupPaginationWithFilter("conferences", "conference-pagination", "conference-items-per-page", "conference-filter");
});
