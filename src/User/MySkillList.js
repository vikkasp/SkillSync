import { useEffect, useState } from "react";
import axios from "axios";
import CertificateButton from "./CertificateButton"; // import your button component

function MySkillsList() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      console.warn("User not logged in");
      return;
    }

    axios
      .get(`http://localhost:8080/api/user-skills/user/${userId}`)
      .then((res) => {
        setSkills(res.data);
      })
      .catch((err) => {
        console.error("Error fetching user skills:", err);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  if (!userId) {
    return <div className="text-center mt-5 text-danger">User not logged in.</div>;
  }

  if (loading) {
    return <div className="text-center mt-5">Loading skills...</div>;
  }

  return (
    <div className="container mt-4">
      <h3 className="mb-4">My Skills</h3>

      {skills.length === 0 ? (
        <div className="text-muted">No skills added yet.</div>
      ) : (
        <div className="row">
          {skills.map((userSkill) => {
            const progress = userSkill.progressPercentage || 0;
            const isCompleted = progress === 100;
            const statusText = isCompleted ? "Completed" : userSkill.status || "N/A";

            return (
              <div key={userSkill.id} className="col-md-6 mb-4">
                <div className="card shadow-sm border-0">
                  <div className="card-body">
                    <h5 className="card-title">
                      {userSkill.skill?.name || "Unnamed Skill"}
                      <span className={`badge ms-2 ${isCompleted ? "bg-success" : "bg-secondary"}`}>
                        {statusText}
                      </span>
                    </h5>
                    <p className="card-text text-muted mb-2">
                      {userSkill.skill?.description || "No description available."}
                    </p>

                    <div className="progress" style={{ height: "20px" }}>
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: `${progress}%` }}
                        aria-valuenow={progress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        {progress}%
                      </div>
                    </div>

                    {/* ✅ Show button only if completed */}
                    {isCompleted && (
                      <div className="mt-3">
                        <CertificateButton
                          userId={userSkill.user.id}
                          skillId={userSkill.skill.id}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MySkillsList;
