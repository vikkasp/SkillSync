import React, { useEffect, useState } from "react";
import API from "../api/api";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert
} from "react-bootstrap";
import { TrashFill, PlusCircleFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

export default function AdminSkillList() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("danger");
  const navigate = useNavigate();

  const fetchSkills = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await API.get("/skills");
      setSkills(response.data);
    } catch (err) {
      console.error("Failed to fetch skills:", err);
      setMessage("Unable to load skills.");
      setVariant("danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const deleteSkill = async (id) => {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      try {
        await API.delete(`/skills/${id}`);
        setMessage("Skill deleted successfully");
        setVariant("success");
        fetchSkills();
      } catch (err) {
        setMessage("Failed to delete skill");
        setVariant("danger");
      }
    }
  };

  return (
    <Container className="mt-4">
      {/* Header with Add Skill Button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="m-0">🛠 All Skills (Admin View)</h2>
        <Button
          variant="success"
          onClick={() => navigate("/admin/skills")}
          className="d-flex align-items-center"
        >
          <PlusCircleFill className="me-2" /> Add Skill
        </Button>
      </div>

      {/* Loading and Messages */}
      {loading && (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      )}
      {message && <Alert variant={variant}>{message}</Alert>}

      {/* Skill Cards */}
      {!loading && skills.length === 0 && (
        <Alert variant="info">No skills found.</Alert>
      )}

      <Row>
        {skills.map((skill) => (
          <Col key={skill.id} md={4}>
            <Card className="shadow-sm mb-3 border-0">
              <Card.Body>
                <Card.Title>{skill.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  Category: {skill.category || "N/A"}
                </Card.Subtitle>
                <Card.Text>
                  <strong>ID:</strong> {skill.id} <br />
                  <strong>Description:</strong> {skill.description || "N/A"} <br />
                  <strong>Level:</strong> {skill.level} <br />
                  <strong>Estimated Time:</strong>{" "}
                  {skill.estimatedTime || "N/A"} <br />
                  <strong>Created By:</strong> {skill.creatorName || "N/A"}
                </Card.Text>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => deleteSkill(skill.id)}
                >
                  <TrashFill className="me-1" /> Delete
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
