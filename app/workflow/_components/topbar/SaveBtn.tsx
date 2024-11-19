"use client";

import { UpdateWorkflow } from "@/actions/workflows/updateWorkflow";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { CheckIcon, Loader2Icon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

const SaveBtn = ({ workflowId }: { workflowId: string }) => {
  const { toObject } = useReactFlow();

  const saveMutation = useMutation({
    mutationFn: UpdateWorkflow,
    onSuccess: () => {
      toast.success("Flow saved successfully", { id: "save-workflow" });
    },
    onError: (error) => {
      toast.error("Failed to save flow", { id: "save-workflow" });
    },
  });

  return (
    <Button
      disabled={saveMutation.isPending}
      variant={"outline"}
      className="flex items-center gap-2"
      onClick={() => {
        const workflowDefinition = JSON.stringify(toObject());

        toast.loading("Saving workflow...", { id: "save-workflow" });

        saveMutation.mutate({ id: workflowId, definition: workflowDefinition });
      }}
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
