import React, { useEffect, useState } from "react";
import axios from "axios";

const Settings = () => {
  const [tags, setTags] = useState([]);
  const [tagName, setTagName] = useState("");
  const [tagColor, setTagColor] = useState("#000000");

  const getTags = async () => {
    const response = await axios.get(
      "https://trading-tool-e65y.onrender.com/get_tags"
    );
    console.log("123");

    console.log(response.data);

    setTags(response.data.tags);
  };
  useEffect(() => {
    getTags();
  }, []);

  const addTag = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post("https://trading-tool-e65y.onrender.com/create_tag", {
          tag_name: tagName,
          tag_color: tagColor,
        })
        .then((res) => {
          console.log(res);
          console.log(res.data);
        });
      getTags();
      // setTags([...tags, { tagId: 1, name: tagName, color: tagColor }]);
      setTagName("");
      setTagColor("#000000");
    } catch (error) {}
  };

  const deleteTag = async (tagId) => {
    try {
      await axios.post("https://trading-tool-e65y.onrender.com/delete_tag", {
        tag_id: tagId,
      });
      getTags();
    } catch (error) {
      console.error("Error deleting tag:", error);
    }
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
            style={{ backgroundColor: tag.tagcolor }}
            className="flex items-center px-3 py-1 rounded text-white"
          >
            <span>{tag.tagname}</span>
            <button
              onClick={() => deleteTag(tag.tagid)}
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
