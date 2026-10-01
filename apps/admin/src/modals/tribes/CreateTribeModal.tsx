"use client";
import { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { XIcon } from "lucide-react";
import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  Dialog,
  DialogContentBare,
  DialogTitle,
  Button,
} from "@lemonade/ui";
import { ApiError } from "@lemonade/api-client";
import { AppDispatch } from "@/redux/store";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { tribesApi } from "@/features/tribes/api";
import { useTribeCategoriesQuery } from "@/features/tribes/queries";
import { useCreateTribeMutation } from "@/features/tribes/mutations";
import { createTribeSchema, type CreateTribeInput } from "@/features/tribes/schema";

interface CreateTribeModalProps {
  isOpen: boolean;
  toggle: () => void;
}

const CreateTribeModal = ({ isOpen, toggle }: CreateTribeModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { data: categoriesData } = useTribeCategoriesQuery({ enabled: isOpen });
  const createTribeMutation = useCreateTribeMutation();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTribeInput>({
    resolver: zodResolver(createTribeSchema),
    defaultValues: { tribe_name: "", image: "", category: "", description: "" },
  });

  const image = watch("image");

  const handleImageClick = () => fileInputRef.current?.click();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await tribesApi.uploadImage(formData);
      setValue("image", result.image, { shouldValidate: true });
    } catch {
      dispatch(
        updateToastifyReducer({ show: true, message: "Image upload failed", type: "error" }),
      );
    } finally {
      setIsUploading(false);
    }
  };

  const closeAndReset = () => {
    reset();
    toggle();
  };

  const onSubmit = (data: CreateTribeInput) => {
    createTribeMutation.mutate(data, {
      onSuccess: (result) => {
        closeAndReset();
        router.push(`/tribes/${result.tribe.id}`);
      },
      onError: (error) => {
        if (error instanceof ApiError && error.fieldErrors) {
          for (const [field, messages] of Object.entries(error.fieldErrors)) {
            if (field in data) {
              setError(field as keyof CreateTribeInput, { message: messages[0] });
            }
          }
          return;
        }
        dispatch(
          updateToastifyReducer({
            show: true,
            message: error.message || "Something went wrong",
            type: "error",
          }),
        );
      },
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) closeAndReset();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Create Tribe</DialogTitle>
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          <div className="tablet:max-h-[90vh] tablet:h-auto tablet:w-[640px] flex h-screen w-full flex-col overflow-y-auto rounded-lg bg-white p-6 px-12 pb-12 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XIcon onClick={closeAndReset} className="cursor-pointer" />
                <p className="font-semiBold text-[18px]">Create Tribe</p>
              </div>
              <Button type="submit" disabled={isSubmitting || isUploading}>
                <p className="text-[16px] font-medium text-white">
                  {isSubmitting ? "Creating..." : "Create tribe"}
                </p>
              </Button>
            </div>
            <div className="tablet:mt-6 mt-12 flex flex-col items-center">
              {image ? (
                <Image
                  src={image}
                  alt="upload"
                  width={89}
                  height={83}
                  className="h-[89px] w-[89px] cursor-pointer rounded-3xl border object-cover"
                  onClick={handleImageClick}
                />
              ) : (
                <Image
                  src={"/images/upload.png"}
                  alt="upload"
                  width={89}
                  height={83}
                  className="cursor-pointer"
                  onClick={handleImageClick}
                />
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              {isUploading && <p className="text-text-grey mt-2 text-[12px]">Uploading...</p>}
              {errors.image && (
                <p className="text-red-1 mt-2 text-[12px]">{errors.image.message}</p>
              )}
            </div>
            <div className="mt-4 flex flex-col">
              <div className="grid gap-2">
                <Label
                  htmlFor="tribe-name"
                  className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
                >
                  Tribe name
                </Label>
                <Input
                  id="tribe-name"
                  type="text"
                  className="bg-light_grey form-font h-12 rounded-xl border-0"
                  {...register("tribe_name")}
                />
                {errors.tribe_name && (
                  <p className="text-red-1 text-[12px]">{errors.tribe_name.message}</p>
                )}
              </div>
              <div className="mt-4 grid gap-2">
                <Label
                  htmlFor="category"
                  className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
                >
                  Category
                </Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="category"
                        aria-label="Category"
                        className="bg-light_grey h-12 rounded-xl border-0"
                      >
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="form-font">
                        {categoriesData?.categories.map((category) => (
                          <SelectItem value={category.name} key={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && (
                  <p className="text-red-1 text-[12px]">{errors.category.message}</p>
                )}
              </div>
              <div className="mt-4 grid gap-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="description"
                    className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
                  >
                    Description
                  </Label>
                </div>
                <Textarea
                  id="description"
                  className="bg-light_grey form-font h-[91px] resize-none rounded-xl border-0"
                  placeholder="A short bio for this tribe..."
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-red-1 text-[12px]">{errors.description.message}</p>
                )}
              </div>
            </div>
          </div>
        </form>
      </DialogContentBare>
    </Dialog>
  );
};

export default CreateTribeModal;
