export async function uploadImageToCloudinary(file: File[]): Promise<string> {
  const formData = new FormData()
  formData.append("file", file[0])
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
  )

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  )

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data?.error?.message || "Image upload failed")
  }

  return data.secure_url
}