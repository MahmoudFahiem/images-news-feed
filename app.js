(function () {
    const UIform = document.querySelector('#search-form');
    const UIsearchField = document.querySelector('#search-keyword');
    const UIresponseContainer = document.querySelector('#response-container');
    let searchedForText;

    UIform.addEventListener('submit', function (e) {
        e.preventDefault();
        // Empty Container
        UIresponseContainer.innerHTML = '';
        // Get the searched value
        searchedForText = UIsearchField.value;

        // Initiate an AJAX Request to unsplash
        const unsplashRequest = new XMLHttpRequest();
        unsplashRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
        unsplashRequest.setRequestHeader('Authorization', 'Client-ID jVAJiiQqWpulMuPE6q5HzEwMgn2CtKbC0c-qwIn67oU');
        unsplashRequest.onload = addImage;
        unsplashRequest.send();

        // Initiate an AJAX Request to unsplash
        const articleRequest = new XMLHttpRequest();
        articleRequest.open('GET', `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=RQL1khAM652tV3hDpvHAaKWiUhgVL8Hb`);
        articleRequest.onload = addArticles;
        articleRequest.send();
    });

    function addArticles() {
        if (!this.status === 200) return;
        const articles = JSON.parse(this.responseText).response.docs;
        console.log(articles);
        if (articles.length) return articles.forEach(displayArticle);
        displayError('No articles to display', 'no-articles');
    }

    function addImage() {
        if(!this.status === 200) return;
        const firstImage = JSON.parse(this.responseText).results[0];
        if (firstImage) return displayImage(firstImage);
        displayError('No images to display', 'no-image');
    }

    function displayImage(image) {
        const imageTemp = `
            <figure>
                <img src="${image.urls.regular}" alt="${image.alt_description}">
                <figcaption>${image.alt_description} by ${image.user.name}</figcaption>
            </figure>
        `;
        UIresponseContainer.insertAdjacentHTML('beforeend', imageTemp);
    }

    function displayArticle(article) {
        const articleTemp = `
            <ul>
                <li class="article">
                    <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
                    <p>${article.snippet}</p>
                </li>
            </ul>
        `;
        UIresponseContainer.insertAdjacentHTML('beforeend', articleTemp);
    }

    function displayError(message, type) {
        const errorTemp = `
            <div class="error-${type}">${message}</div>
        `;
        UIresponseContainer.innerHTML = errorTemp;
    }
})();