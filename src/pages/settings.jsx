import React, { useState, useEffect } from "react";
import axios from "axios";

const Settings = () => {
  const [tags, setTags] = useState(["a", "b"]);
  const [newTag, setNewTag] = useState({ name: "", color: "#000000" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/get_tags");
      setTags(response.data.tags);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch tags");
      setLoading(false);
    }
  };

  const handleAddTag = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:5000/add_tag", newTag);
      setNewTag({ name: "", color: "#000000" });
      fetchTags();
    } catch (err) {
      setError("Failed to add tag");
    }
  };

  const handleUpdateTag = async (id, updatedTag) => {
    try {
      await axios.post(`http://127.0.0.1:5000/update_tag/${id}`, updatedTag);
      fetchTags();
    } catch (err) {
      setError("Failed to update tag");
    }
  };

  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-full flex flex-col p-20 bg-gray-100">
      <div className="w-4/5 flex flex-col gap-8 bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold text-gray-800">Set Priority</h1>

        <div className="bg-gray-50 p-6 rounded-md">
          <h4 className="text-xl font-medium mb-4 text-gray-700">
            Add New Tag:
          </h4>
          <form onSubmit={handleAddTag} className="flex gap-4 items-end">
            <div className="flex flex-col gap-2">
              <label htmlFor="tagName" className="text-sm text-gray-600">
                Tag Name:
              </label>
              <input
                id="tagName"
                type="text"
                value={newTag.name}
                onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                placeholder="Enter Tag"
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="tagColor" className="text-sm text-gray-600">
                Tag Color:
              </label>
              <input
                id="tagColor"
                type="color"
                value={newTag.color}
                onChange={(e) =>
                  setNewTag({ ...newTag, color: e.target.value })
                }
                className="h-10 w-20 border rounded"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
            >
              Add Tag
            </button>
          </form>
        </div>

        <div>
          <h4 className="text-xl font-medium mb-4 text-gray-700">
            Existing Tags:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center gap-4 bg-gray-50 p-4 rounded-md"
              >
                <div
                  className="w-8 h-8 rounded-full"
                  style={{ backgroundColor: tag.color }}
                ></div>
                <input
                  type="text"
                  value={tag.name}
                  onChange={(e) =>
                    handleUpdateTag(tag.id, { ...tag, name: e.target.value })
                  }
                  className="border rounded px-3 py-1 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <input
                  type="color"
                  value={tag.color}
                  onChange={(e) =>
                    handleUpdateTag(tag.id, { ...tag, color: e.target.value })
                  }
                  className="h-8 w-14 border rounded"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
