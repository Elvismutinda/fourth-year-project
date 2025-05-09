"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { memo } from "react";
import { UseChatHelpers } from "@ai-sdk/react";

interface SuggestedActionsProps {
  caseLawId: string;
  append: UseChatHelpers["append"];
}

function PureSuggestedActions({ caseLawId, append }: SuggestedActionsProps) {
  const suggestedActions = [
    {
      title: "Summarize this",
      label: "case law",
      action: "Summarize this case law",
    },
    {
      title: "How does this case law",
      label: `differ from similar precedents?`,
      action: `How does this case law differ from similar precedents?`,
    },
    {
      title: "What was the key evidence",
      label: `that influenced the court's decision?`,
      action: `What was the key evidence that influenced the court's decision?`,
    },
    {
      title: "What were the main arguments",
      label: "presented by both parties?",
      action: "What were the main arguments presented by both parties?",
    },
  ];

  return (
    <div
      data-testid="suggested-actions"
      className="grid sm:grid-cols-2 gap-2 w-full"
    >
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className={index > 1 ? "hidden sm:block" : "block"}
        >
          <Button
            variant="ghost"
            onClick={async () => {
              window.history.replaceState({}, "", `/app/caselaws/${caseLawId}`);

              append({
                role: "user",
                content: suggestedAction.action,
              });
            }}
            className="text-left border border-slate-400 rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"
          >
            <span className="font-medium">{suggestedAction.title}</span>
            <span className="text-muted-foreground">
              {suggestedAction.label}
            </span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(PureSuggestedActions, () => true);
