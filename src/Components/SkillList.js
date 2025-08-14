import React, { useEffect, useState } from "react";
import API from "../api/api";

export default function SkillList() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSkills = async () => {
    try {
      const response = await API.get("/skills");
      setSkills(response.data);
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-purple-800">Available Skills</h2>

      {loading ? (
        <p>Loading skills...</p>
      ) : skills.length === 0 ? (
        <p className="text-gray-500">No skills available.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {skills.map((skill) => (
            <li
              key={skill.id}
              className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-md transition"
            >
              <h3 className="text-lg font-bold text-purple-700">{skill.name}</h3>
              <p className="text-sm text-gray-600">{skill.category}</p>
              <p className="mt-2 text-gray-700 text-sm">{skill.description}</p>
              <p className="mt-2 text-sm text-gray-500">
                Level: <span className="font-medium">{skill.level}</span> | Time: {skill.estimatedTime}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
