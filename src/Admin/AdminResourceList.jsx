import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Container,
  Row,
  Col,
  Spinner,
  Alert,
  Button,
  Accordion,
} from "react-bootstrap";
import { FolderFill, TrashFill, Link45deg, PlusCircleFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

const AdminResourceList = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("danger");
  const navigate = useNavigate();

  const fetchResources = () => {
    setLoading(true);
    setMessage("");
    axios
      .get("http://localhost:8080/api/resources")
      .then((response) => {
        setResources(response.data);
        setLoading(false);
      })
      .catch(() => {
        setMessage("Failed to load resources");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const deleteResource = (id) => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      axios
        .delete(`http://localhost:8080/api/resources/${id}`)
        .then(() => {
          setMessage("Resource deleted successfully");
          setVariant("success");
          fetchResources();
        })
        .catch(() => {
          setMessage("Failed to delete resource");
          setVariant("danger");
        });
    }
  };

  // Group resources by skill name
  const groupedResources = resources.reduce((acc, resource) => {
    const skillName = resource.skill ? resource.skill.name : "Unassigned Skill";
    if (!acc[skillName]) {
      acc[skillName] = [];
    }
    acc[skillName].push(resource);
    return acc;
  }, {});

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="m-0">📂 All Resources (Admin View)</h2>
        <Button
          variant="success"
          onClick={() => navigate("/admin/addresource")}
          className="d-flex align-items-center"
        >
          <PlusCircleFill className="me-2" /> Add Resource
        </Button>
      </div>

      {loading && <div className="text-center"><Spinner animation="border" /></div>}
      {message && <Alert variant={variant}>{message}</Alert>}

      {Object.keys(groupedResources).length > 0 ? (
        <Accordion defaultActiveKey="0">
          {Object.keys(groupedResources).map((skillName, index) => (
            <Accordion.Item eventKey={index.toString()} key={skillName}>
              <Accordion.Header>
                <FolderFill className="me-2 text-warning" size={20} />
                {skillName}
              </Accordion.Header>
              <Accordion.Body>
                <Row>
                  {groupedResources[skillName].map((resource) => (
                    <Col key={resource.id} md={4}>
                      <Card className="shadow-sm mb-3 border-0">
                        <Card.Body>
                          <Card.Title>{resource.title}</Card.Title>
                          <Card.Subtitle className="mb-2 text-muted">
                            Type: {resource.type}
                          </Card.Subtitle>
                          {resource.url ? (
                            <Card.Link
                              href={
                                resource.url.startsWith("http")
                                  ? resource.url
                                  : `http://localhost:8080${resource.url}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="d-flex align-items-center"
                            >
                              <Link45deg size={18} className="me-1" />
                              Visit Resource
                            </Card.Link>
                          ) : (
                            <Card.Text>No URL available</Card.Text>
                          )}
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="mt-2"
                            onClick={() => deleteResource(resource.id)}
                          >
                            <TrashFill className="me-1" />
                            Delete
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      ) : (
        !loading && <Alert variant="info">No resources found.</Alert>
      )}
    </Container>
  );
};

export default AdminResourceList;
