// Finds recent posts from catalog.xml and displays them in the aside

const catalog = fetch(location.href.includes("posts") ? "../catalog.xml" : "catalog.xml").then(response => response.text());

catalog.then(data => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(data, "text/xml");
    const posts = xml.getElementsByTagName("post");
    const aside = document.querySelector("aside");
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    
    for (let i = 0; i < posts.length; i++) {
        const title = posts[i].getElementsByTagName("title")[0].childNodes[0].nodeValue;
        const dateStr = posts[i].getElementsByTagName("date")[0].childNodes[0].nodeValue;
        const desc = posts[i].getElementsByTagName("desc")[0].childNodes[0].nodeValue;
        const postDate = new Date(dateStr);
        
        if (postDate > twoWeeksAgo) {
            const post = document.createElement("a");
            post.className = location.href.includes(title.replace(/\s/g, "-").toLowerCase()) ? "post active" : "post";
            post.href = `posts/${title.replace(/\s/g, "-").toLowerCase()}`;
            post.innerHTML = `<div class="title-date"><h3>${title}</h3><p class="date">${dateStr}</p></div><p class="desc">${desc}</p>`;
            aside.appendChild(post);
        }
    }
});
