
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getImageUrl, getUploadUrl } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { useFormContext } from "react-hook-form";
import { Image } from "lucide-react";

interface ImageUploadProps {
  fieldName: string;
}

const ImageUpload = ({ fieldName }: ImageUploadProps) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const { setValue, watch } = useFormContext();
  
  const currentImages = watch(fieldName) || [];

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Get presigned URL from the backend
        const { url, key } = await getUploadUrl();
        
        // Upload the file to S3 using the presigned URL
        const uploadResponse = await fetch(url, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });
        
        if (!uploadResponse.ok) {
          throw new Error("Failed to upload image");
        }

        const imageUrl = await getImageUrl(key);
        setImageUrls((prev:any) => [...prev, imageUrl?.url]);       
        return key;
      });
      
      const uploadedKeys = await Promise.all(uploadPromises);
      
      // Update the form with new image keys
      setValue(fieldName, [...currentImages, ...uploadedKeys]);
      
      toast({
        title: "Success",
        description: `${uploadedKeys.length} image(s) uploaded successfully`,
      });
    } catch (error) {
      console.error("Error uploading images:", error);
      toast({
        title: "Error",
        description: "Failed to upload images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Clear the input
      event.target.value = "";
    }
  };

  const removeImage = (indexToRemove: number) => {
    setValue(
      fieldName,
      currentImages.filter((_, index) => index !== indexToRemove)
    );
  };
console.log('currentImages',{currentImages,imageUrls})
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <label htmlFor="image-upload" className="cursor-pointer">
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            className="flex gap-2 items-center"
            onClick={() => document.getElementById("image-upload")?.click()}
          >
            <Image size={16} />
            {uploading ? "Uploading..." : "Upload Images"}
          </Button>
        </label>
        <input
          id="image-upload"
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
          disabled={uploading}
        />
      </div>

      {currentImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {currentImages.map((imageKey, index) => (
            <div key={index} className="relative group border rounded-md p-1">
              <div className="aspect-square bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                <img 
                  src={imageUrls[index]}
                  alt={`Uploaded image ${index + 1}`}
                  className="object-contain w-full h-full"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
