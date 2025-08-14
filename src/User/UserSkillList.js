import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';

const UserSkillList = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState(''); // success / danger / info

  const storedUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!storedUser) {
      setMessage('User not logged in');
      setVariant('danger');
      return;
    }

    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/skills');
      setSkills(response.data);
    } catch (error) {
      console.error('Error fetching skills:', error);
      setMessage('Failed to fetch skills');
      setVariant('danger');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToMySkills = async (skillId) => {
    if (!storedUser) {
      setMessage('User not logged in');
      setVariant('danger');
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/user-skills', {
        user: { id: storedUser.id },
        skill: { id: skillId },
        status: "In Progress",
        progressPercentage: 0
      });

      setMessage('Skill added to your skills successfully!');
      setVariant('success');
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setMessage('Skill already added!');
        setVariant('info');
      } else {
        setMessage('Something went wrong while adding skill.');
        setVariant('danger');
      }
    }
  };

  if (!storedUser) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">Please log in to view and add skills.</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Available Skills</h2>

      {message && (
        <Alert variant={variant} onClose={() => setMessage('')} dismissible>
          {message}
        </Alert>
      )}

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status" />
        </div>
      ) : (
        <Row xs={1} md={2} lg={2} className="g-4">
          {skills.map((skill) => (
            <Col key={skill.id}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>{skill.name}</Card.Title>
                  <Card.Text>{skill.description}</Card.Text>
                  <p><strong>Level:</strong> {skill.level}</p>
                  <p><strong>Category:</strong> {skill.category}</p>
                  <p><strong>Time:</strong> {skill.estimatedTime}</p>
                  <Button
                    variant="primary"
                    onClick={() => handleAddToMySkills(skill.id)}
                  >
                    Add to My Skills
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default UserSkillList;