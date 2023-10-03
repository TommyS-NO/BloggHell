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
              <button onclick="likePost(${
                post.id
              })">Like</button> <span id="likes-${post.id}">${
          post.likes
        }</span> Likes
              <div>
                <h3>Kommentarer:</h3>
                <ul id="comments-${post.id}">
                  ${post.comments
                    .map((comment) => `<li>${comment}</li>`)
                    .join("")}
                </ul>
                <textarea id="comment-text-${post.id}"></textarea>
                <button onclick="addComment(${
                  post.id
                })">Legg til kommentar</button>
              </div>
              <hr />
            `;
      });
      postContainer.innerHTML = html;
    });
}

function likePost(postId) {
  fetch(`/api/like/${postId}`, {
    method: "POST",
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById(`likes-${postId}`).innerText = data.likes;
    });
}

function addComment(postId) {
  const commentText = document.getElementById(`comment-text-${postId}`).value;
  fetch(`/api/comment/${postId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ comment: commentText }),
  })
    .then((response) => response.json())
    .then((data) => {
      const commentList = document.getElementById(`comments-${post.id}`);
      const newComment = document.createElement("li");
      newComment.innerText = data.comment;
      commentList.appendChild(newComment);
    });
}

fetchAndDisplayPosts();
