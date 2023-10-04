function showLoginPopup() {
  const popup = document.getElementById("loginPopup");
  popup.style.display = "block";
}

function hideLoginPopup() {
  const popup = document.getElementById("loginPopup");
  popup.style.display = "none";
}

function fetchAndDisplayPosts() {
  fetch("/api/posts")
    .then((response) => response.json())
    .then((posts) => {
      const postContainer = document.getElementById("postContainer");
      let html = "";
      posts.forEach((post) => {
        html += `
              <div class="post">
                <h2>${post.title}</h2>
                <p>${post.content}</p>
                <p>Dato: ${new Date(post.date).toLocaleDateString()}</p>
                <button onclick="likePost(${post.id})">Like</button> 
                <span id="likes-${post.id}">${post.likes}</span> Likes
                <hr />
                <div>
                  <h3>Kommentarer:</h3>
                  <ul id="comments-${post.id}">
                    ${post.comments
                      .map(
                        (comment) =>
                          `<li><strong>${comment.name}</strong> kommenterte den ${comment.time}: ${comment.content}</li>`
                      )
                      .join("")}
                  </ul>
                  Navn: <input type="text" id="comment-name-${post.id}" />
                  <textarea id="comment-text-${post.id}"></textarea>
                  <button onclick="addComment(${
                    post.id
                  })">Legg til kommentar</button>
                </div>
                <hr />
              </div>
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
  const commentName = document.getElementById(`comment-name-${postId}`).value;
  const commentText = document.getElementById(`comment-text-${postId}`).value;
  const commentTime = new Date().toLocaleString("no-NO", { hour12: false });
  fetch(`/api/comment/${postId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: commentName,
      time: commentTime,
      content: commentText,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      const commentList = document.getElementById(`comments-${postId}`);
      const newComment = document.createElement("li");
      newComment.innerHTML = `<strong>${data.name}</strong> kommenterte den ${data.time}: ${data.content}`;
      commentList.appendChild(newComment);
    });
}

fetchAndDisplayPosts();
