// ---------------------
// Admin Authentication Functions
// ---------------------

function handleAdminLogin() {
  const username = document.getElementById("adminUsername").value;
  const password = document.getElementById("adminPassword").value;
  adminLogin(username, password);
}

async function adminLogin(username, password) {
  try {
    const response = await fetch("/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      showAdminFeatures();
      loadAdminPosts();
    } else {
      alert("Incorrect username or password.");
    }
  } catch (error) {
    console.error("Error logging in:", error);
  }
}

async function adminLogout() {
  try {
    const response = await fetch("/admin/logout");
    if (response.ok) {
      hideAdminFeatures();
      location.reload();
    }
  } catch (error) {
    console.error("Error logging out:", error);
  }
}

// ---------------------
// Admin UI Functions
// ---------------------

function showAdminFeatures() {
  const adminSection = document.getElementById("adminSection");
  const loginPopup = document.getElementById("loginPopup");

  adminSection.style.display = "block";
  loginPopup.style.display = "none";
}

function hideAdminFeatures() {
  const adminSection = document.getElementById("adminSection");
  adminSection.style.display = "none";
}

// ---------------------
// Post CRUD Functions
// ---------------------

function submitNewPost() {
  const title = document.getElementById("postTitle").value.trim();
  const content = document.getElementById("postContent").value.trim();
  if (!title || !content) {
    alert("Vennligst fyll ut både tittel og innhold.");
    return;
  }
  createPost(title, content);
  document.getElementById("postTitle").value = "";
  document.getElementById("postContent").value = "";
}

async function createPost(title, content) {
  try {
    const response = await fetch("/admin/create-post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    });

    if (response.ok) {
      alert("Post created successfully.");
      loadAdminPosts();
    } else {
      alert("Error creating post.");
    }
  } catch (error) {
    console.error("Error creating post:", error);
  }
}

async function updatePost(id, title, content) {
  try {
    const response = await fetch(`/admin/update-post/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    });

    if (response.ok) {
      alert("Post updated successfully.");
      loadAdminPosts();
    } else {
      alert("Error updating post.");
    }
  } catch (error) {
    console.error("Error updating post:", error);
  }
}

async function deletePost(id) {
  try {
    const response = await fetch(`/admin/delete-post/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Post deleted successfully.");
      loadAdminPosts();
    } else {
      alert("Error deleting post.");
    }
  } catch (error) {
    console.error("Error deleting post:", error);
  }
}

async function loadAdminPosts() {
  try {
    const response = await fetch("/admin/get-all-posts");
    const posts = await response.json();
    const postContainer = document.getElementById("postContainer");
    postContainer.innerHTML = ""; // Clear

    posts.forEach((post) => {
      const postElement = document.createElement("div");
      postElement.className = "post";
      postElement.id = `post-${post.id}`; // Legger til en unik ID
      postElement.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.content}</p>
        <p>Likes: ${post.likes}</p>
        <p>Kommentarer:</p>
        <ul>
          ${post.comments
            .map(
              (comment) =>
                `<li>${comment.name}: ${comment.content} <button onclick="deleteComment(${post.id}, '${comment.time}')">Slett</button></li>`
            )
            .join("")}
        </ul>
        <button onclick="showEditPostForm(${post.id})">Rediger</button>
        <button onclick="deletePost(${post.id})">Slett</button>
      `;
      postContainer.appendChild(postElement);
    });
  } catch (error) {
    console.error("Error loading posts:", error);
  }
}

async function showEditPostForm(postId) {
  try {
    const response = await fetch(`/admin/get-post/${postId}`);
    const post = await response.json();

    const editForm = `
      <form id="editPostForm-${postId}">
        <input type="text" id="editPostTitle-${postId}" value="${post.title}" required />
        <textarea id="editPostContent-${postId}" required>${post.content}</textarea>
        <input type="button" value="Oppdater innlegg" onclick="submitEditPost(${postId})" />
        <input type="button" value="Avbryt" onclick="cancelEditPost(${postId})" />
      </form>
    `;

    const postElement = document.querySelector(`#post-${postId}`);
    postElement.innerHTML = editForm;
  } catch (error) {
    console.error("Error fetching post details:", error);
  }
}

function submitEditPost(postId) {
  const title = document.getElementById(`editPostTitle-${postId}`).value;
  const content = document.getElementById(`editPostContent-${postId}`).value;
  updatePost(postId, title, content);
}

function cancelEditPost(postId) {
  loadAdminPosts();
}
async function deleteComment(postId, commentTime) {
  try {
    const response = await fetch(`/admin/delete-comment/${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ time: commentTime }),
    });

    if (response.ok) {
      alert("Kommentar slettet.");
      loadAdminPosts();
    } else {
      alert("Feil ved sletting av kommentar.");
    }
  } catch (error) {
    console.error("Error deleting comment:", error);
  }
}
