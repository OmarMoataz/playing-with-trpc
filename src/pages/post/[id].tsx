import NextError from 'next/error';
import { useRouter } from 'next/router';
import AddComment from '~/components/comments/addComment';
import { NextPageWithLayout } from '~/pages/_app';
import { RouterOutput, trpc } from '~/utils/trpc';

type PostByIdOutput = RouterOutput['post']['byId'];

function PostItem(props: { post: PostByIdOutput }) {
  const { post } = props;
  const { comments } = post;
  const utils = trpc.useContext();

  const addComment = trpc.comment.add.useMutation({
    async onSuccess() {
      // refetches posts after a post is added
      await utils.post.invalidate();
    },
  });

  const handleCommentAddition = async (commentText: string) => {
    const input = {
      text: commentText,
      postId: post?.id,
    };
    await addComment.mutateAsync(input);
  };

  return (
    <>
      <h1>{post.title}</h1>
      <em>Created {post.createdAt.toLocaleDateString('en-us')}</em>

      <p>{post.text}</p>
      <h2> Comments for this post: </h2>
      <ul>
        {comments?.map((comment) => (
          <li key={comment.id}>{comment?.text}</li>
        ))}
      </ul>

      <AddComment onSubmit={handleCommentAddition} />
    </>
  );
}

const PostViewPage: NextPageWithLayout = () => {
  const id = useRouter().query.id as string;
  const postQuery = trpc.post.byId.useQuery({ id });

  if (postQuery.error) {
    return (
      <NextError
        title={postQuery.error.message}
        statusCode={postQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (postQuery.status !== 'success') {
    return <>Loading...</>;
  }
  const { data } = postQuery;
  return <PostItem post={data} />;
};

export default PostViewPage;
