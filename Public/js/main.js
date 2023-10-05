function showLoginPopup() {
  const popup = document.getElementById("loginPopup");
  popup.style.display = "block";
}

function hideLoginPopup() {
  const popup = document.getElementById("loginPopup");
  popup.style.display = "none";
}

async function fetchAndDisplayPosts() {
  try {
    const response = await fetch("/api/posts");
    const posts = await response.json();
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
  } catch (error) {
    console.error("Error fetching and displaying posts:", error);
  }
}

async function likePost(postId) {
  try {
    const response = await fetch(`/api/like/${postId}`, {
      method: "POST",
    });
    const data = await response.json();
    document.getElementById(`likes-${postId}`).innerText = Number(data.likes);
  } catch (error) {
    console.error("Error liking post:", error);
  }
}

async function addComment(postId) {
  const commentName = document.getElementById(`comment-name-${postId}`).value;
  const commentText = document.getElementById(`comment-text-${postId}`).value;
  const commentTime = new Date().toLocaleString("no-NO", { hour12: false });

  const validNameChars = /^[a-zA-ZæøåÆØÅ\s]+$/;
  const validCommentChars = /^[a-zA-Z0-9æøåÆØÅ\s.,]+$/;

  // Sjekk om feltene er tomme
  if (!commentName.trim() || !commentText.trim()) {
    alert("Både navn og kommentar må fylles ut.");
    return;
  }

  // Validering av navn
  if (!commentName.match(validNameChars)) {
    alert("Ingen spesialtegn tillatt i navn.");
    return;
  }

  // Validering av kommentartekst
  if (!commentText.match(validCommentChars)) {
    alert(
      "Ugyldige tegn i kommentaren. Bare bokstaver, tall, punktum, komma og mellomrom er tillatt."
    );
    return;
  }

  try {
    const response = await fetch(`/api/comment/${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: commentName,
        time: commentTime,
        content: commentText,
      }),
    });
    const data = await response.json();
    const commentList = document.getElementById(`comments-${postId}`);
    const newComment = document.createElement("li");
    newComment.innerHTML = `<strong>${data.name}</strong> kommenterte den ${data.time}: ${data.content}`;
    commentList.appendChild(newComment);
  } catch (error) {
    console.error("Error adding comment:", error);
  }
}

fetchAndDisplayPosts();
