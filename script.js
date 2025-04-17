// let url = 'F:/WebsitePortfolio_Luccman/122130385_2658_AmendedFinalReport.pdf'; // Replace with the path to your PDF

let pdfDoc = null,
    pageNum = 1,
    pageIsRendering = false,
    pageNumIsPending = null;

const scale = 1.5,
      canvas = document.querySelector('#pdf-render'),
      ctx = canvas.getContext('2d');

const images = [
  "Pictures/FoodDisplay1.png",
  "Pictures/FoodDisplay3.png",
  "Pictures/FoodDisplay4.png",
];

let currentIndex = 0;
const imgElement = document.getElementById("gallery-image");

document.getElementById("next").addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % images.length;
  imgElement.src = images[currentIndex];
});

document.getElementById("prev").addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  imgElement.src = images[currentIndex];
});



// Render the page
const renderPage = num => {
    pageIsRendering = true;

    // Get page
    pdfDoc.getPage(num).then(page => {
        const viewport = page.getViewport({ scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderCtx = {
            canvasContext: ctx,
            viewport
        };

        page.render(renderCtx).promise.then(() => {
            pageIsRendering = false;

            if (pageNumIsPending !== null) {
                renderPage(pageNumIsPending);
                pageNumIsPending = null;
            }
        });

        // Output current page
        document.querySelector('#page-num').textContent = num;
    });
};

// Check for pages rendering
const queueRenderPage = num => {
    if (pageIsRendering) {
        pageNumIsPending = num;
    } else {
        renderPage(num);
    }
};

// Show Prev page
document.querySelector('#prev-page').addEventListener('click', () => {
    if (pageNum <= 1) {
        return;
    }
    pageNum--;
    queueRenderPage(pageNum);
});

// Show Next page
document.querySelector('#next-page').addEventListener('click', () => {
    if (pageNum >= pdfDoc.numPages) {
        return;
    }
    pageNum++;
    queueRenderPage(pageNum);
});

// Get Document
// pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
//     pdfDoc = pdfDoc_;
//     document.querySelector('#page-count').textContent = pdfDoc.numPages;

//     renderPage(pageNum);
// });


document.addEventListener('DOMContentLoaded', function () {
    // For smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});


