function fetchAndDisplayPosts() {
  fetch("/api/posts")
    .then((response) => response.json())
    .then((posts) => {
      const postContainer = document.getElementById("postContainer");
      let html = "";
      posts.forEach((post) => {
        html += `
            <h2>${post.title}</h2>
            <p>${post.content}</p>
            <p>Dato: ${new Date(post.date).toLocaleDateString()}</p>
            <hr />
          `;
      });
      postContainer.innerHTML = html;
    });
}

fetchAndDisplayPosts();
