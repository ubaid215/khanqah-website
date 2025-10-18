"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { ArrowLeft, Save, Plus, X, Upload, Loader2 } from "lucide-react";
import { CourseLevel, CourseStatus } from "@/types";

interface Category {
  id: string;
  name: string;
}

// Add these type guards at the top of your component, outside the component function
interface ApiResponseWithSuccess {
  success: boolean;
  data: any;
}

interface ApiResponseWithId {
  id: string;
}

function isApiResponseWithSuccess(response: any): response is ApiResponseWithSuccess {
  return response && typeof response === 'object' && 'success' in response;
}

function isApiResponseWithId(response: any): response is ApiResponseWithId {
  return response && typeof response === 'object' && 'id' in response;
}

function isCategoryArray(response: any): response is Category[] {
  return Array.isArray(response) && response.every(item => 
    item && typeof item === 'object' && 'id' in item && 'name' in item
  );
}

export default function CreateCoursePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<Category[]>(
    []
  );
  const [newCategory, setNewCategory] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    shortDesc: "",
    thumbnail: "",
    level: CourseLevel.BEGINNER,
    price: 0,
    isFree: true,
  });

  useEffect(() => {
    fetchAvailableCategories();
  }, []);

  // Fetch all available categories from the system
const fetchAvailableCategories = async () => {
  try {
    const response = await apiClient.getCategories();
    
    if (isCategoryArray(response)) {
      setAvailableCategories(response);
    } else if (isApiResponseWithSuccess(response) && Array.isArray(response.data)) {
      setAvailableCategories(response.data);
    } else {
      console.warn('Unexpected response format from getCategories:', response);
      setAvailableCategories([]);
    }
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    setAvailableCategories([]);
  }
};

 const createNewCategories = async (
  categoryNames: string[]
): Promise<string[]> => {
  const categoryIds: string[] = [];

  for (const categoryName of categoryNames) {
    const existingCategory = availableCategories.find(
      (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
    );

    if (existingCategory) {
      categoryIds.push(existingCategory.id);
    } else {
      try {
        // Create new category
        const response = await apiClient.createCategory({
          name: categoryName,
        });

        // Handle different response structures
        if (response && typeof response === 'object' && 'success' in response && response.success && response.data) {
          categoryIds.push(response.data.id);
          setAvailableCategories((prev) => [...prev, response.data]);
        } else if (response && typeof response === 'object' && 'id' in response) {
          categoryIds.push(response.id);
          setAvailableCategories((prev) => [
            ...prev,
            { id: response.id, name: categoryName },
          ]);
        } else if (Array.isArray(response)) {
          // If response is an array, take the first item (assuming it's the created category)
          const newCategory = response[0];
          if (newCategory && newCategory.id) {
            categoryIds.push(newCategory.id);
            setAvailableCategories((prev) => [...prev, newCategory]);
          }
        }
      } catch (error) {
        console.error(`Failed to create category ${categoryName}:`, error);
        // Continue with other categories even if one fails
      }
    }
  }

  return categoryIds;
};

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    // Create categories and get their IDs
    const categoryIds = await createNewCategories(categories);

    const courseData = {
      ...formData,
      categoryIds,
      status: CourseStatus.DRAFT,
    };

    console.log("Creating course with data:", courseData);

    const response = await apiClient.createCourse(courseData);

    // Properly check the response structure
    if (response && typeof response === 'object') {
      if ('success' in response && response.success) {
        alert("Course created successfully!");
        router.push("/admin/courses");
      } else if ('id' in response) {
        // Alternative success check if the API returns the created course directly
        alert("Course created successfully!");
        router.push("/admin/courses");
      } else {
        throw new Error("Failed to create course - invalid response format");
      }
    } else {
      throw new Error("Failed to create course - no response");
    }
  } catch (error: any) {
    console.error("Failed to create course:", error);
    alert(error.message || "Failed to create course");
  } finally {
    setIsLoading(false);
  }
};

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory("");
    }
  };

  const handleRemoveCategory = (categoryToRemove: string) => {
    setCategories(categories.filter((cat) => cat !== categoryToRemove));
  };

  // Add existing category from dropdown
  const handleAddExistingCategory = (categoryName: string) => {
    if (categoryName && !categories.includes(categoryName)) {
      setCategories([...categories, categoryName]);
    }
  };

  // Helper function to get authentication token
  const getAuthToken = (): string | null => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("token") || sessionStorage.getItem("token") || null
      );
    }
    return null;
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (!allowedTypes.includes(file.type)) {
      alert("Please select a valid image file (JPEG, PNG, WebP, or GIF)");
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      const token = getAuthToken();

      if (!token) {
        alert("Please log in to upload files");
        setIsUploading(false);
        return;
      }

      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadFormData,
      });

      const result = await response.json();

      if (result.success) {
        setFormData((prev) => ({
          ...prev,
          thumbnail: result.data.url,
        }));
      } else {
        alert(result.error || "Failed to upload file");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="border-gray-300"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Course
          </h1>
          <p className="text-gray-600 mt-1">
            Add a new course to your learning platform
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Title *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Enter course title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug *
                  </label>
                  <Input
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    placeholder="course-slug"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    This will be used in the URL
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Description
                  </label>
                  <Textarea
                    value={formData.shortDesc}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        shortDesc: e.target.value,
                      }))
                    }
                    placeholder="Brief description of the course"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Description *
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Detailed description of the course content"
                    rows={6}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add new category */}
                <div className="flex space-x-2">
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Add a new category"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCategory();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={handleAddCategory}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Existing categories dropdown */}
                {availableCategories.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Add Existing Categories
                    </label>
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handleAddExistingCategory(e.target.value);
                          e.target.value = ""; // Reset selection
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select existing category</option>
                      {availableCategories
                        .filter((cat) => !categories.includes(cat.name))
                        .map((category) => (
                          <option key={category.id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                {/* Selected categories */}
                {categories.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Selected Categories ({categories.length})
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <span
                          key={category}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                        >
                          {category}
                          <button
                            type="button"
                            onClick={() => handleRemoveCategory(category)}
                            className="ml-2 hover:text-blue-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Settings */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Course Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        level: e.target.value as CourseLevel,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={CourseLevel.BEGINNER}>Beginner</option>
                    <option value={CourseLevel.INTERMEDIATE}>
                      Intermediate
                    </option>
                    <option value={CourseLevel.ADVANCED}>Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pricing
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={formData.isFree}
                        onChange={() =>
                          setFormData((prev) => ({
                            ...prev,
                            isFree: true,
                            price: 0,
                          }))
                        }
                        className="mr-2"
                      />
                      Free
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={!formData.isFree}
                        onChange={() =>
                          setFormData((prev) => ({ ...prev, isFree: false }))
                        }
                        className="mr-2"
                      />
                      Paid
                    </label>
                    {!formData.isFree && (
                      <div className="ml-6">
                        <Input
                          type="number"
                          value={formData.price}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              price: parseFloat(e.target.value),
                            }))
                          }
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Thumbnail Upload */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Thumbnail
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Upload course thumbnail
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Supports: JPEG, PNG, WebP, GIF (Max 5MB)
                  </p>

                  <div className="flex flex-col items-center space-y-2">
                    <input
                      type="file"
                      id="thumbnail-upload"
                      accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="thumbnail-upload"
                      className="cursor-pointer"
                    >
                      <Button
                        type="button"
                        variant="outline"
                        className="border-gray-300"
                        disabled={isUploading}
                        onClick={() =>
                          document.getElementById("thumbnail-upload")?.click()
                        }
                      >
                        {isUploading ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Upload className="h-4 w-4 mr-2" />
                        )}
                        {isUploading ? "Uploading..." : "Choose File"}
                      </Button>
                    </label>
                    <p className="text-xs text-gray-500">
                      Click the button to select a file
                    </p>
                  </div>
                </div>

                {formData.thumbnail && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Preview:
                    </p>
                    <img
                      src={formData.thumbnail}
                      alt="Course thumbnail preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2 text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, thumbnail: "" }))
                      }
                    >
                      <X className="h-3 w-3 mr-1" />
                      Remove
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Publish Actions */}
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Create Course
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-gray-300"
                    onClick={() => router.push("/admin/courses")}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
