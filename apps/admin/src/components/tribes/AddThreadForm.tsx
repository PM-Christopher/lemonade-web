"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Textarea } from "@lemonade/ui";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { useAddTribeThreadMutation } from "@/features/tribes/mutations";
import { addTribeThreadSchema, type AddTribeThreadInput } from "@/features/tribes/schema";

interface AddThreadFormProps {
  tribeId: string;
}

const AddThreadForm = ({ tribeId }: AddThreadFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const addThreadMutation = useAddTribeThreadMutation(tribeId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddTribeThreadInput>({
    resolver: zodResolver(addTribeThreadSchema),
    defaultValues: { topic: "", thoughts: "" },
  });

  const onSubmit = (data: AddTribeThreadInput) => {
    addThreadMutation.mutate(data, {
      onSuccess: () => reset(),
      onError: (error) => {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: error?.message || "Something went wrong",
            type: "error",
          }),
        );
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-[8px] border-b-[1px] border-grey-20 pb-[16px]"
    >
      <p className="text-[14px] font-medium">Post as admin</p>
      <Input
        placeholder="Topic"
        className="h-[40px] rounded-[12px] border-[1px] border-grey-20"
        {...register("topic")}
      />
      {errors.topic && <p className="text-[12px] text-red-1">{errors.topic.message}</p>}
      <Textarea
        placeholder="Write something..."
        className="min-h-[80px] resize-none rounded-[12px] border-[1px] border-grey-20"
        {...register("thoughts")}
      />
      {errors.thoughts && <p className="text-[12px] text-red-1">{errors.thoughts.message}</p>}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-[36px] rounded-[12px] border-step-color bg-gradient-green px-[16px]"
        >
          <p className="text-[14px] font-medium text-white">
            {isSubmitting ? "Posting..." : "Post thread"}
          </p>
        </Button>
      </div>
    </form>
  );
};

export default AddThreadForm;
