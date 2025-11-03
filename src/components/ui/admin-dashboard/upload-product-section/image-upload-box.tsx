import { useState, DragEvent, ChangeEvent } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button"; 

const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg"];
const MAX_FILE_SIZE_MB = 10;

export function ImageUploadBox({
  id,
  preview,
  label,
  onFileChange,
  onRemove,
}: {
  id: string;
  preview: string | null;
  label: string;
  onFileChange: (file: File) => void;
  onRemove: () => void;
}) {
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (file: File): boolean => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      alert("Only PNG or JPG images are allowed!");
      return false;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert(`Image must be smaller than ${MAX_FILE_SIZE_MB}MB`);
      return false;
    }
    return true;
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && validateFile(file)) onFileChange(file);
  };

  return (
    <div className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-5 cursor-pointer transition 
        ${isDragging ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : "hover:bg-muted"}`}
      onClick={() => !preview && document.getElementById(id)?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      {preview ? (
        <div className="flex flex-col items-center space-y-3">
          <Image
            src={preview}
            alt={label}
            width={200}
            height={200}
            className="rounded-lg object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="flex items-center space-x-1"
          >
            <X className="w-4 h-4" />
            <span>Remove Image</span>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center space-y-2">
          <Upload className="w-8 h-8 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">
            Click or drag to upload image
          </p>
          <p className="text-xs text-muted-foreground">
            PNG, JPG up to {MAX_FILE_SIZE_MB}MB
          </p>
        </div>
      )}

      <input
        id={id}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(", ")}
        className="hidden"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];
          if (file && validateFile(file)) onFileChange(file);
        }}
      />
    </div>
  );
}
