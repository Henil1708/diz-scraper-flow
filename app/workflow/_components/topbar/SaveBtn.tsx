"use client";

import { UpdateWorkflow } from "@/actions/workflows/updateWorkflow";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { CheckIcon, Loader2Icon } from "lucide-react";
import React, { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

const SaveBtn = ({ workflowId }: { workflowId: string }) => {
  const { toObject } = useReactFlow();
  const saveBtnRef = useRef<HTMLButtonElement>(null);

  const saveMutation = useMutation({
    mutationFn: UpdateWorkflow,
    onSuccess: () => {
      toast.success("Flow saved successfully", { id: "save-workflow" });
    },
    onError: (error) => {
      toast.error("Failed to save flow", { id: "save-workflow" });
    },
  });

  const save = useCallback(() => {
    const workflowDefinition = JSON.stringify(toObject());

    toast.loading("Saving workflow...", { id: "save-workflow" });

    saveMutation.mutate({ id: workflowId, definition: workflowDefinition });
  }, [saveMutation, toObject, workflowId]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault(); // Prevent the default browser "save" action
        save();
      }
    };

    // Attach the event listener
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup the event listener on unmount
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [save]); // Empty dependency array to ensure this effect runs only once

  return (
    <Button
      ref={saveBtnRef}
      disabled={saveMutation.isPending}
      variant={"outline"}
      className="flex items-center gap-2"
      onClick={save}
    >
      {saveMutation.isPending ? (
        <Loader2Icon size={16} className="animate-spin" />
      ) : (
        <CheckIcon size={16} className="stroke-green-400" />
      )}
      {saveMutation.isPending ? "Saving" : "Save"}
    </Button>
  );
};

export default SaveBtn;
