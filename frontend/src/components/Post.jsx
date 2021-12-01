import {useState} from 'react';

export default function Post({ post }) {
  const [moreComments, setMoreComments] = useState(false);
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');

  function loadComments (id) {
    fetch(`http://localhost:8080/post/${id}/comments`)
      .then(response => response.json())
      .then(data => {
        setMoreComments(data)
      })
      .catch(err => console.warn("ERROR:", err));
  }


  console.log('Total comments:', post.totalComments);
  console.log('Comments:', post.comments);
  console.log('more comments:', moreComments);

  return (
    <div className="post">
      <img src={post.image} alt="" />
      <p>
        <b>{post.author}</b> {post.content}
      </p>
      <p>
        <span className="tag">#catsofdci</span>
        <span className="tag">#kittywebdev</span>
        <span className="tag">#😺</span>
      </p>
      <p className="commentLink" onClick={(e) => loadComments(e.target.id)} id={post._id}>
        {post.totalComments > 3 && <>View all {post.totalComments} comments</>}
      </p>
{/*       {post.totalComments > 0 && (
        <div className="comments">
          {post.comments?.map((c) => (
            <Comment key={c._id} comment={c} />
          ))}
        </div>
      )} */}


      {post.totalComments > 0 ?
        ( moreComments ? 
          moreComments.map((c) => <div className="comments">
            <Comment key={c._id} comment={c} />
          </div>) : 
          post.comments?.map((c) => <div className="comments">
            <Comment key={c._id} comment={c} />
          </div>)
        ) :
        <></>
      }


      <div className="comment-form">
        <input 
          type="text" placeholder="Author" value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <textarea 
          type="text" placeholder="Write your comment here..." value={content} 
          onChange={(e) => setContent(e.target.value)}
        />
        <button data-id={post._id} onClick={(e) => { 
            makeComment(author, content, e.target.dataset.id, () => {
              console.log(author, content, e.target.dataset.id)
              setAuthor('');
              setContent('');
              loadComments(e.target.dataset.id);
            });
          }}>
          Submit
        </button>
      </div>
    </div>
  );
}

function Comment({ comment }) {
  return (
    <p>
      <b>{comment.author}</b> {comment.content}
    </p>
  );
}

function makeComment (author, content, id, callBack) {
  fetch(`http://localhost:8080/post/${id}/comments`, { 
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(
    { 
      "author": author,
      "content": content,
      "postId": id
    })
  })
    .then(res => res.json())
    .then(callBack)
    .catch(err => console.warn(err));
}
