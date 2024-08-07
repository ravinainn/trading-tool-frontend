import React, { useState } from "react";
// import axios from "axios";

const Settings = () => {
  const [tags, setTags] = useState([]);
  const [tagName, setTagName] = useState("");
  const [tagColor, setTagColor] = useState("#000000");

  const addTag = (e) => {
    e.preventDefault();
    if (tagName.trim()) {
      setTags([...tags, { name: tagName, color: tagColor }]);
      setTagName("");
      setTagColor("#000000");
    }
  };

  const deleteTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={addTag} className="mb-4">
        <input
          type="text"
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
          placeholder="Tag name"
          className="border p-2 mr-2"
        />
        <input
          type="color"
          value={tagColor}
          onChange={(e) => setTagColor(e.target.value)}
          className="mr-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Tag
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <div
            key={index}
            style={{ backgroundColor: tag.color }}
            className="flex items-center px-3 py-1 rounded text-white"
          >
            <span>{tag.name}</span>
            <button
              onClick={() => deleteTag(index)}
              className="ml-2 text-xs bg-red-500 rounded-full w-4 h-4 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;
