// ---------------------
// UI Functions
// ---------------------

function showLoginPopup() {
  const popup = document.getElementById("loginPopup");
  popup.style.display = "block";
}

function hideLoginPopup() {
  const popup = document.getElementById("loginPopup");
  popup.style.display = "none";
}

// ---------------------
// Post Display Functions
// ---------------------

async function fetchAndDisplayPosts() {
  try {
    const response = await fetch("/api/blogginnlegg");
    const posts = await response.json();
    const postContainer = document.getElementById("postContainer");
    let html = "";

    posts.forEach((post) => {
      const commentsHtml =
        post.comments && Array.isArray(post.comments)
          ? post.comments
              .map((comment) => {
                const formattedDate = comment.time
                  .replace("T", " ")
                  .replace("Z", " ")
                  .split(".")[0];
                return `<li><strong>${comment.name}</strong> kommenterte den ${formattedDate}:
                <br/> 
                ${comment.content}</li>`;
              })
              .join("")
          : "";

      html += generatePostHtml(post, commentsHtml);
    });

    postContainer.innerHTML = html;

    posts.forEach((post) => {
      document
        .getElementById(`comment-name-${post.id}`)
        .addEventListener("input", () => checkCommentInputs(post.id));
      document
        .getElementById(`comment-text-${post.id}`)
        .addEventListener("input", () => checkCommentInputs(post.id));
    });
  } catch (error) {
    console.error("Error fetching and displaying posts💩", error);
  }
}

function generatePostHtml(post, commentsHtml) {
  const lastEditedHtml = post.lastEdited
    ? `<p class="date">Sist redigert: ${new Date(
        post.lastEdited
      ).toLocaleDateString("no-NB")}</p>`
    : "";

  return `
    <div class="post">
        <h2 class="blog-content">${post.title}</h2>
        <p>${post.content}</p>
        <p class="date">Dato: ${new Date(post.dateCreated).toLocaleDateString(
          "no-NB"
        )}</p>
        ${lastEditedHtml}
        <button class="like" onclick="likePost(${post.id})">Like</button> 
        <span id="likes-${post.id}">${post.likes}</span> Likes
        <hr />
        <div class="comments">
            <h3>Kommentarer:</h3>
            <ul id="comments-${post.id}">
                ${commentsHtml}
            </ul>
            <div class="new-comment-section">
                <strong>Navn:</strong> <input type="text" id="comment-name-${
                  post.id
                }" class="comment-input" />
                <strong>Kommentar:</strong> <textarea id="comment-text-${
                  post.id
                }" class="comment-input"></textarea>
                <button class="submitCommentButton" data-post-id="${
                  post.id
                }" onclick="addComment(${post.id})">Legg til kommentar</button>
            </div>
        </div>
        <hr />
    </div>
`;
}

// ---------------------
// Post Interaction Functions
// ---------------------

async function likePost(postId) {
  try {
    const response = await fetch(`/api/blogginnlegg/like/${postId}`, {
      method: "POST",
    });
    const data = await response.json();
    document.getElementById(`likes-${postId}`).innerText = Number(data.likes);
  } catch (error) {
    console.error("Error liking post:", error);
  }
}

async function addComment(postId) {
  const commentNameInput = document.getElementById(`comment-name-${postId}`);
  const commentTextInput = document.getElementById(`comment-text-${postId}`);
  const commentName = commentNameInput.value;
  const commentText = commentTextInput.value;
  const commentTime = new Date().toISOString();

  const validNameChars = /^[a-zA-ZæøåÆØÅ\s]+$/;
  const validCommentChars = /^[a-zA-Z0-9æøåÆØÅ\s.,!]+$/;

  // Sjekk om feltene er tomme
  if (!commentName.trim() || !commentText.trim()) {
    alert("Navn og Kommentar må fylles ut🫵");
    return;
  }

  // Validering av navn
  if (!commentName.match(validNameChars)) {
    alert("Ingen spesialtegn tillatt i navn🫵");
    return;
  }

  // Validering av kommentar
  if (!commentText.match(validCommentChars)) {
    alert("Ugyldige tegn i kommentaren🫵");
    return;
  }

  try {
    const response = await fetch(`/api/blogginnlegg/comment/${postId}`, {
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

    // Tøm feltene
    commentNameInput.value = "";
    commentTextInput.value = "";
  } catch (error) {
    console.error("Error adding comment:", error);
  }
}

function checkCommentInputs(postId) {
  const nameInput = document.getElementById(`comment-name-${postId}`);
  const commentInput = document.getElementById(`comment-text-${postId}`);
  const submitButton = document.querySelector(
    `.submitCommentButton[data-post-id="${postId}"]`
  );

  if (nameInput.value.trim() !== "" && commentInput.value.trim() !== "") {
    submitButton.style.backgroundColor = "#4caf50";
    submitButton.disabled = false;
  } else {
    submitButton.style.backgroundColor = "var(--button-comment-color)";
    submitButton.disabled = true;
  }
}

fetchAndDisplayPosts();
