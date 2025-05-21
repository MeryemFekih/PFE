// components/PostCard.tsx
/* eslint-disable @next/next/no-img-element */
'use client';
import { 
  Bookmark,
  Heart,
  MessageCircle,
  Share2,
  Send,
  User,
  Trash2
} from 'lucide-react';
import { Post } from '@/lib/type';
import { createComment } from '@/lib/comment-action';
import { useState } from 'react';
import { Session } from '@/lib/session';
interface Props {
  post: Post;
  showActions?: boolean;
  currentUserId?: number;
  onDelete?: (postId: number) => void;
  children?: React.ReactNode;
  session: Session;
}

export default function PostCard({ post, showActions = true, currentUserId, onDelete, children, session }: Props) {
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleCommentChange = (postId: number, value: string) => {
    setCommentInputs(prev => ({ ...prev, [postId]: value }));
  };

  const handlePostComment = async (postId: number) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    await createComment(postId, text);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 max-w-2xl mx-auto">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              {post.author.profilePicture ? (
                <img
                  src={
                    post.author.profilePicture.startsWith('http')
                      ? post.author.profilePicture
                      : `${'http://localhost:4000'}${post.author.profilePicture}`
                  }
                  alt="Author"
                  className="rounded-full w-10 h-10 object-cover"
                />
              ) : (
                <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="text-gray-400 w-5 h-5" />
                </div>
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                {post.author.firstName} {post.author.lastName}
              </h3>
              <p className="text-xs text-gray-500">
                {new Date(post.createdAt).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
          {showActions && (
            <button 
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              onClick={() => onDelete?.(post.id)}
            >
              <Trash2  size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-2">
        <h4 className="text-lg font-bold text-gray-900 mb-1">{post.title}</h4>
        <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line">
          {post.content}
        </div>
      </div>

      {/* Media */}
      {post.mediaUrl && (
        <div className="px-4 pb-3">
          {post.mediaUrl.endsWith('.mp4') ? (
            <video controls className="w-full rounded-lg max-h-96 bg-black">
              <source src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${post.mediaUrl}`} />
            </video>
          ) : post.mediaUrl.endsWith('.pdf') ? (
            <div className="bg-gray-100 border rounded p-3">
              <p className="font-medium text-sm">PDF Document</p>
              <a
                href={`${process.env.NEXT_PUBLIC_BACKEND_URL}${post.mediaUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm hover:underline"
              >
                View PDF
              </a>
            </div>
          ) : (
            <img
              src={`${'http://localhost:4000'}${post.mediaUrl}`}
              alt="Post media"
              className="w-full object-cover rounded-lg max-h-96"
            />
          )}
        </div>
      )}

      {/* Footer Actions */}
      <div className="px-4 py-2 border-t border-gray-100">
        <div className="flex items-center justify-between text-gray-500">
          <div className="flex space-x-4">
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className={`flex items-center space-x-1 ${isLiked ? 'text-red-500' : 'hover:text-gray-700'}`}
            >
              <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
              <span>{post.likes || 0}</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-gray-700">
              <MessageCircle size={18} />
              <span>{post.comments?.length || 0}</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-gray-700">
              <Share2 size={18} />
            </button>
          </div>
          <button 
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={isBookmarked ? 'text-blue-500' : 'hover:text-gray-700'}
          >
            <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <div className="border-t border-gray-100 px-4 py-3 space-y-3 bg-gray-50">
        {post.comments?.length > 0 && (
          <div className="space-y-3">
            {post.comments.map(comment => (
              <div key={comment.id} className="flex space-x-2">
                <div className="flex-shrink-0">
                  {comment.author.profilePicture ? (
                    <img
                      src={comment.author.profilePicture}
                      alt="Comment author"
                      className="rounded-full w-8 h-8 object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="text-gray-400 w-4 h-4" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="bg-white rounded-lg p-2 shadow-xs">
                    <p className="text-xs font-medium text-gray-900 mb-1">
                      {comment.author.firstName} {comment.author.lastName}
                    </p>
                    <p className="text-sm text-gray-700">{comment.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Comment Input */}
        <div className="flex items-start space-x-2">
          <div className="flex-shrink-0">
            {session?.user.profilePicture ? (
              <img
                src={session.user.profilePicture}
                alt="User"
                className="rounded-full w-8 h-8 object-cover"
              />
            ) : (
              <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="text-gray-400 w-4 h-4" />
              </div>
            )}
          </div>
          <div className="flex-1 flex items-end space-x-2">
            <textarea
              placeholder="Write a comment..."
              value={commentInputs[post.id] || ''}
              onChange={e => handleCommentChange(post.id, e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={1}
            />
            <button
              onClick={() => handlePostComment(post.id)}
              disabled={!commentInputs[post.id]?.trim()}
              className={`p-2 rounded-full mb-1 ${
                commentInputs[post.id]?.trim()
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              } transition-colors`}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {children && <div className="px-4 py-3 border-t border-gray-100">{children}</div>}
    </div>
  );
}