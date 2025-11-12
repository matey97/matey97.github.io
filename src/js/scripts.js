//
// Scripts
//

function setupPaginationWithFilter(papers, sectionId, paginationId, dropdownId, filterId) {
    const section = document.getElementById(sectionId);
    const pagination = document.getElementById(paginationId);
    const perPageDropdown = document.getElementById(dropdownId);
    const filterDropdown = document.getElementById(filterId);

    let currentPage = 1;

    function getFilteredItems() {
        const filterValue = filterDropdown.value;
        return filterValue === "all"
            ? papers
            : papers.filter(paper => paper.tier === filterValue);
    }

    function renderPapers(papers) {
        const paperList = document.getElementById(sectionId === "journals" ? "paper-list" : "conference-list");
        const paperDivs = papers.map(paper => {
            const paperDiv = document.createElement("div");
            paperDiv.className = "paper";
            //paperDiv.setAttribute("data-rank", paper.tier);

            const container = document.createElement("div");
            container.className = "row justify-content-center";

            const paperInfo = document.createElement("div");
            paperInfo.className = "paper-info col-12 col-md-10";
            const paperType = document.createElement("span");
            paperType.className = `paper-type ${sectionId === "journals" ? "journal" : "conference"}`;
            const title = document.createElement("h4");
            title.textContent = paper.title;

            if (paper.tier) {
                const badge = document.createElement("span");
                badge.className = `badge ${classFromTier(paper.tier)}`;
                badge.textContent = paper.tierString;
                title.appendChild(badge);
            }

            if (paper.doi) {
                const doiLink = document.createElement("a");
                doiLink.setAttribute("href", "https://doi.org/"+paper.doi);
                doiLink.setAttribute("target", "_blank");
                const doiIcon = document.createElement("img");
                doiIcon.className = "doi";
                doiIcon.setAttribute("src", "assets/img/doi.png");
                doiLink.appendChild(doiIcon);
                title.appendChild(doiLink);
            }

            if (paper.pdf) {
                const pdfLink = document.createElement("a");
                pdfLink.setAttribute("href", paper.pdf);
                pdfLink.setAttribute("target", "_blank");
                const pdfIcon = document.createElement("img");
                pdfIcon.className = "pdf";
                pdfIcon.setAttribute("src", "assets/img/file-pdf-regular.svg");
                pdfLink.appendChild(pdfIcon);
                title.appendChild(pdfLink);
            }

            const authors = document.createElement("h5");
            authors.className = "light";
            authors.textContent = paper.authors;

            const journal = document.createElement("h5");
            journal.className = "light";
            journal.textContent = paper.journal;
            journal.style.fontStyle = "italic";

            if (paper.note) {
                const note = document.createElement("span");
                note.className = "light";
                note.textContent = `[${paper.note}]`;
                note.style.paddingLeft = "0.7rem";
                note.style.fontStyle = "normal";
                note.style.fontWeight = "bold";
                journal.appendChild(note);
            }

            paperInfo.appendChild(paperType);
            paperInfo.appendChild(title);
            paperInfo.appendChild(authors);
            paperInfo.appendChild(journal);

            if (paper.award) {
                const award = document.createElement("span");
                const awardIcon = document.createElement("i");
                awardIcon.className = "fas fa-trophy text-warning";
                award.appendChild(awardIcon);
                const awardDescription = document.createElement("span");
                awardDescription.textContent = paper.award;
                awardDescription.style.paddingLeft = "0.7rem";
                awardDescription.style.fontWeight = "bold";
                award.appendChild(awardDescription);
                //award.style.paddingLeft = "0.7rem";

                paperInfo.appendChild(award);
            }

            const paperMetrics = document.createElement("div");
            paperMetrics.className = "paper-metrics col-12 col-md-2";
            const link = document.createElement("a");
            link.className = "plumx-plum-print-popup";
            link.setAttribute("href", "https://plu.mx/plum/a/?doi="+paper.doi);
            paperMetrics.appendChild(link);
            container.appendChild(paperInfo);
            container.appendChild(paperMetrics);
            paperDiv.appendChild(container);
            return paperDiv;
        });
        paperList.replaceChildren(...paperDivs);
        return paperDivs;
    }

    function renderPage(page) {
        currentPage = page;
        const itemsPerPage = parseInt(perPageDropdown.value);
        const filteredItems = getFilteredItems();
        renderedPapers = renderPapers(filteredItems);
        const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

        renderedPapers.forEach((item, index) => {
            item.style.display = (index >= (page - 1) * itemsPerPage && index < page * itemsPerPage)
                ? "flex" : "none";
        });

        if (window.__plumX && window.__plumX.widgets) {
            window.__plumX.widgets.init();
        }

        // Hide items that don't match filter
        //Array.from(section.querySelectorAll(".paper")).forEach(item => {
        //    if (!renderedPapers.includes(item)) item.style.display = "none";
        //});

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

function classFromTier(tier) {
    switch (tier) {
        case "Q1" || "A":
            return "rank-a";
        case "Q2" || "B":
            return "rank-b";
        case "Q3" || "C":
            return "rank-c";
        case "A":
            return "rank-a";
        case "B":
            return "rank-b";
        case "C":
            return "rank-c";
    }
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

    //setupPaginationWithFilter("journals", "journal-pagination", "journal-items-per-page", "journal-filter");
    //setupPaginationWithFilter("conferences", "conference-pagination", "conference-items-per-page", "conference-filter");
    fetch('/papers.json')
        .then(response => response.json())
        .then(data => {
            setupPaginationWithFilter(data.journalPapers, "journals", "journal-pagination", "journal-items-per-page", "journal-filter");
            setupPaginationWithFilter(data.conferencePapers, "conferences", "conference-pagination", "conference-items-per-page", "conference-filter");
        })
        .catch(error => console.error('Failed to load JSON', error));
});
