"use client";

import { useState, useTransition, useMemo } from "react";
import { m, AnimatePresence } from "motion/react";
import {
  CornerDownRight,
  ChevronDown,
  ChevronUp,
  Flame,
  Smile,
  ThumbsUp,
  Zap as Rocket,
  Heart,
  Reply,
  Send,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { postComment, toggleReaction } from "@/lib/actions/comment-actions";
import { useSession } from "@/lib/auth-client";
import { LoginOverlay } from "./LoginOverlay";
import ReactTextareaAutosize from "react-textarea-autosize";

import { CommentData } from "@/types/blog";

export function CommentSection({
  postSlug,
  comments,
}: {
  postSlug: string;
  comments: CommentData[];
}) {
  const { data: session } = useSession();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [rootComment, setRootComment] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isPending, startTransition] = useTransition();

  // Organize comments into a tree
  const commentTree = useMemo(() => {
    const map = new Map<string, CommentData & { replies: CommentData[] }>();
    const roots: (CommentData & { replies: CommentData[] })[] = [];

    comments.forEach((c) => {
      map.set(c.id, { ...c, replies: [] });
    });

    comments.forEach((c) => {
      if (c.parentId && map.has(c.parentId)) {
        map.get(c.parentId)!.replies.push(map.get(c.id)!);
      } else {
        roots.push(map.get(c.id)!);
      }
    });

    return roots;
  }, [comments]);

  const handlePost = async (
    content: string,
    parentId?: string,
    customName?: string,
  ) => {
    startTransition(async () => {
      await postComment({
        postSlug,
        content,
        parentId,
        authorName: customName || authorName,
      });
      if (!parentId) {
        setRootComment("");
        setAuthorName("");
      }
    });
  };

  return (
    <div className="space-y-12" data-testid="comment-section">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black font-heading uppercase tracking-tighter italic">
          Technical <span className="text-ctp-mauve">Discourse</span>
        </h2>
        <div className="px-4 py-1.5 bg-ctp-mauve/10 rounded-full border border-ctp-mauve/20">
          <span className="text-[10px] font-mono text-ctp-mauve uppercase tracking-[0.2em] font-bold">
            {comments.length} Nodes Synchronized
          </span>
        </div>
      </div>

      {/* Post Root Comment */}
      <div className="relative p-6 bg-card/20 border border-border/50 rounded-3xl space-y-4 shadow-xl">
        <div className="flex gap-4">
          <Avatar className="w-10 h-10 border-2 border-border/30">
            <AvatarImage
              src={`https://api.dicebear.com/9.x/identicon/svg?seed=${session?.user.id || authorName || "guest"}`}
            />
            <AvatarFallback>
              <UserIcon className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-4">
            {!session && (
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Identity (Optional name...)"
                className="w-full bg-ctp-surface0/50 border border-border/20 rounded-xl px-4 py-2 text-xs font-mono focus:border-ctp-mauve/50 outline-none transition-all"
              />
            )}
            <ReactTextareaAutosize
              value={rootComment}
              onChange={(e) => setRootComment(e.target.value)}
              data-testid="comment-textarea"
              placeholder="Transmit your analysis to the network..."
              className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium leading-relaxed resize-none pt-2"
            />
          </div>
        </div>
        <div className="flex justify-end pt-2 border-t border-border/10">
          <Button
            onClick={() => handlePost(rootComment)}
            disabled={!rootComment || isPending}
            data-testid="comment-submit-btn"
            className="bg-ctp-mauve hover:bg-ctp-mauve/80 text-background font-bold gap-2 px-6"
          >
            {isPending ? (
              "Transmitting..."
            ) : (
              <>
                <Send className="w-4 h-4" /> Execute
              </>
            )}
          </Button>
        </div>
      </div>

      <LoginOverlay
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />

      {/* Comments List */}
      <div className="space-y-8">
        {commentTree.length === 0 ? (
          <div className="text-center p-12 text-muted-foreground font-mono text-[10px] uppercase tracking-widest border border-dashed border-border/20 rounded-3xl">
            Protocol: Channel is silent. Standing by.
          </div>
        ) : (
          commentTree.map((item) => (
            <CommentItem key={item.id} comment={item} onReply={handlePost} />
          ))
        )}
      </div>
    </div>
  );
}

function CommentItem({
  comment,
  onReply,
  depth = 0,
}: {
  comment: CommentData & { replies?: CommentData[] };
  onReply: (
    content: string,
    parentId?: string,
    customName?: string,
  ) => Promise<void>;
  depth?: number;
}) {
  const { data: session } = useSession();
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [replyName, setReplyName] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const reactions = comment.reactions || {};
  const reactionTypes = [
    { emoji: "👍", icon: <ThumbsUp className="w-3 h-3" />, label: "like" },
    { emoji: "❤️", icon: <Heart className="w-3 h-3" />, label: "heart" },
    { emoji: "🚀", icon: <Rocket className="w-3 h-3" />, label: "rocket" },
    { emoji: "🔥", icon: <Flame className="w-3 h-3" />, label: "fire" },
  ];

  const [localReactions, setLocalReactions] = useState(reactions);
  const [prevReactions, setPrevReactions] = useState(reactions);

  if (reactions !== prevReactions) {
    setLocalReactions(reactions);
    setPrevReactions(reactions);
  }

  const handleReact = async (emoji: string) => {
    if (!session) return;

    // Optimistic Update
    const currentUsers = localReactions[emoji] || [];
    const isAdding = !currentUsers.includes(session.user.id);
    const nextUsers = isAdding
      ? [...currentUsers, session.user.id]
      : currentUsers.filter((id) => id !== session.user.id);

    setLocalReactions({
      ...localReactions,
      [emoji]: nextUsers,
    });

    setShowEmojiPicker(false);

    try {
      await toggleReaction(comment.id, emoji, comment.postSlug);
    } catch {
      // Rollback on error
      setLocalReactions(reactions);
    }
  };

  const handleReplySubmit = async () => {
    await onReply(replyContent, comment.id, replyName);
    setReplyContent("");
    setReplyName("");
    setIsReplyOpen(false);
    setIsExpanded(true);
  };

  const totalReplies = comment.replies?.length || 0;

  return (
    <m.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="group relative"
      data-testid="comment-item"
    >
      <div className="flex gap-4">
        <div className="flex flex-col items-center">
          <Avatar className="w-10 h-10 border-2 border-border/30 shadow-md">
            {comment.authorAvatar ? (
              <AvatarImage src={comment.authorAvatar} />
            ) : (
              <AvatarFallback>
                <UserIcon className="w-5 h-5" />
              </AvatarFallback>
            )}
          </Avatar>
          <div
            className={`flex-1 w-0.5 bg-linear-to-b from-border/30 to-transparent my-2 ${!isExpanded || totalReplies === 0 ? "hidden" : ""}`}
          />
        </div>

        <div className="flex-1 space-y-3 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-bold text-sm text-foreground/90">
                {comment.authorName}
              </span>
              <span className="text-[9px] font-mono text-muted-foreground/60 uppercase tracking-tighter">
                {new Date(comment.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            {totalReplies > 0 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 hover:bg-muted/50 rounded-md transition-colors text-muted-foreground"
              >
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            )}
          </div>

          <p className="text-sm text-muted-foreground/80 leading-relaxed font-medium">
            {comment.content}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {/* Reaction Display */}
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(localReactions).map(([emoji, users]) => {
                if (!users || users.length === 0) return null;
                const hasReacted =
                  session?.user.id && users.includes(session.user.id);
                return (
                  <button
                    key={emoji}
                    onClick={() => handleReact(emoji)}
                    data-testid={`reaction-badge-${emoji}`}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold border transition-all ${
                      hasReacted
                        ? "bg-ctp-mauve/20 border-ctp-mauve text-ctp-mauve"
                        : "bg-muted/30 border-border/50 text-muted-foreground hover:border-muted-foreground"
                    }`}
                  >
                    <span>{emoji}</span>
                    <span>{users.length}</span>
                  </button>
                );
              })}

              {/* Add Reaction Button */}
              <div className="relative">
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  data-testid="add-reaction-btn"
                  className="p-1.5 rounded-full hover:bg-muted/50 text-muted-foreground transition-colors border border-transparent hover:border-border/50"
                >
                  <Smile className="w-3.5 h-3.5" />
                </button>

                <AnimatePresence>
                  {showEmojiPicker && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowEmojiPicker(false)}
                      />
                      <m.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="absolute bottom-full left-0 mb-2 p-1.5 bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl z-50 flex gap-1"
                      >
                        {reactionTypes.map((type) => (
                          <button
                            key={type.emoji}
                            onClick={() => handleReact(type.emoji)}
                            className="p-2 hover:bg-muted rounded-xl transition-all hover:scale-125 text-lg"
                            title={type.label}
                            data-testid={`reaction-${type.label}`}
                          >
                            {type.emoji}
                          </button>
                        ))}
                      </m.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="w-px h-3 bg-border/30 mx-1" />

            <button
              onClick={() => setIsReplyOpen(!isReplyOpen)}
              data-testid="reply-btn"
              className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-ctp-mauve transition-colors"
            >
              <Reply className="w-3.5 h-3.5" />
              Reply
            </button>
          </div>

          <AnimatePresence>
            {isReplyOpen && (
              <m.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden pt-4"
              >
                <div className="flex gap-3">
                  <div className="pt-2">
                    <CornerDownRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 bg-card/30 border border-border/50 rounded-2xl p-4 space-y-3">
                    {!session && (
                      <input
                        type="text"
                        value={replyName}
                        onChange={(e) => setReplyName(e.target.value)}
                        placeholder="Identity (Optional name...)"
                        className="w-full bg-ctp-surface0/50 border border-border/20 rounded-xl px-4 py-2 text-xs font-mono focus:border-ctp-mauve/50 outline-none transition-all"
                      />
                    )}
                    <ReactTextareaAutosize
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      data-testid="reply-textarea"
                      placeholder="Enter reply protocol..."
                      className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium leading-relaxed resize-none"
                    />
                    <div className="flex justify-end pt-2 border-t border-border/10">
                      <Button
                        size="sm"
                        onClick={handleReplySubmit}
                        disabled={!replyContent}
                        data-testid="reply-submit-btn"
                        className="bg-ctp-mauve hover:bg-ctp-mauve/80 text-background font-bold text-xs rounded-xl"
                      >
                        Transmit
                      </Button>
                    </div>
                  </div>
                </div>
              </m.div>
            )}
          </AnimatePresence>

          {/* Recursive Replies */}
          {isExpanded && comment.replies && comment.replies.length > 0 && (
            <div className="pt-6 space-y-6">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onReply={onReply}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}

          {!isExpanded && totalReplies > 0 && (
            <button
              onClick={() => setIsExpanded(true)}
              className="text-[10px] font-mono uppercase tracking-widest text-ctp-mauve hover:underline pt-2"
            >
              Show {totalReplies} {totalReplies === 1 ? "reply" : "replies"}
            </button>
          )}
        </div>
      </div>
    </m.div>
  );
}
