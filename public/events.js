const catPic = document.getElementsByClassName('cat-pic');
const newPicButton = document.getElementById('new-pic');
const status = document.getElementsByClassName('status');
const vote = document.getElementById('vote-buttons');
const score = document.getElementsByClassName('score');
const submitButton = document.getElementById('submit-button');
const commentBox = document.getElementsByClassName('comments');
const userComment = document.getElementById('user-comment');

function renderComments(data) {
  commentBox[0].innerHTML = '';
  data.comments.forEach((comment, i) => {
    const newCommentDiv = document.createElement('div');
    newCommentDiv.classList.add('comment-div');
    const newComment = document.createElement('span');
    newComment.classList.add('comment');
    const deleteButton = document.createElement('button');
    newCommentDiv.appendChild(newComment);
    newCommentDiv.appendChild(deleteButton);
    deleteButton.innerHTML = 'X';
    newComment.innerHTML = comment;
    deleteButton.setAttribute('id', `comment${i}`);
    deleteButton.classList.add('delete-button');

    commentBox[0].appendChild(newCommentDiv);
  });
}

async function getNewCatPic() {
  status[0].innerHTML = 'Loading...';
  status[0].classList.remove('error');
  const response = await fetch('/kitten/image');
  const data = await response.json();
  if (!response.ok) {
    status[0].innerHTML = `${response.status}, ${data.message}`;
    status[0].classList.add('error');
    return;
  }
  status[0].innerHTML = '';
  catPic[0].setAttribute('src', data.src);
  score[0].innerHTML = data.score;
  renderComments(data);
}

async function catVote(value) {
  const response = await fetch(`/kitten/${value}`, { method: 'PATCH' });
  const data = await response.json();
  if (!response.ok) {
    status[0].innerHTML = `${response.status}, ${data.message}`;
    status[0].classList.add('error');
    return;
  }
  score[0].innerHTML = data.score;
}

async function catComment(userComment) {
  const response = await fetch('/kitten/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ comment: userComment }),
  });
  const data = await response.json();
  if (!response.ok) {
    status[0].innerHTML = `${response.status}, ${data.message}`;
    status[0].classList.add('error');
    return;
  }
  renderComments(data);
}

async function deleteComment(number) {
  const response = await fetch(`/kitten/comments/${number}`, {
    method: 'DELETE',
  });
  const data = await response.json();
  if (!response.ok) {
    status[0].innerHTML = `${response.status}, ${data.message}`;
    status[0].classList.add('error');
    return;
  }
  renderComments(data);
}

getNewCatPic();

newPicButton.addEventListener('click', getNewCatPic);

vote.addEventListener('click', (event) => catVote(event.target.id));

submitButton.addEventListener('click', (event) => {
  event.preventDefault();
  if (userComment.value !== '') catComment(userComment.value);
  userComment.value = '';
});

commentBox[0].addEventListener('click', (event) => {
  number = event.target.id.slice(7);
  deleteComment(number);
});
