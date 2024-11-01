// src/api/hooks/commentHooks.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/instance";

export interface Comment {
  id: number;
  userId: number;
  writerId: number;
  writerNickname: string;
  writerProfileImage: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const commentApi = {
  getComments: (userId: number) =>
    apiClient.get<Comment[]>(`/api/comments/${userId}`).then((res) => res.data),

  createComment: (data: { userId: number; content: string }) =>
    apiClient.post("/api/comments", data).then((res) => res.data),

  updateComment: (
    commentId: number,
    data: { userId: number; content: string },
  ) =>
    apiClient.put(`/api/comments/${commentId}`, data).then((res) => res.data),

  deleteComment: (commentId: number) =>
    apiClient.delete(`/api/comments/${commentId}`).then((res) => res.data),
};

export const useCommentsQuery = (friendId: number) => {
  return useQuery({
    queryKey: ["comments", friendId],
    queryFn: () => commentApi.getComments(friendId),
    enabled: !!friendId,
  });
};

export const useCreateCommentMutation = (
  friendId: number,
  options?: { onSuccess?: () => void },
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: commentApi.createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", friendId] });
      if (options?.onSuccess) {
        options.onSuccess(); // onSuccess가 존재할 때만 호출
      }
    },
  });
};

export const useUpdateCommentMutation = (friendId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      commentId,
      data,
    }: {
      commentId: number;
      data: { userId: number; content: string };
    }) => commentApi.updateComment(commentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", friendId] });
    },
  });
};

export const useDeleteCommentMutation = (friendId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: commentApi.deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", friendId] });
    },
  });
};
